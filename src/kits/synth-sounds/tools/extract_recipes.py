#!/usr/bin/env python3
"""
extract_recipes.py -- turn recorded R2-D2 WAV files into tiny synth "recipes".

This runs on a laptop, NOT on the Pico.  It listens to each .wav file in the
repo's sounds/ folder, measures how the pitch and loudness change over time,
then compresses that measurement down to a handful of numbers that the Pico
can replay with nothing but a PWM pin.

Each recipe is a list of segments:

    (duration_ms, freq_start, freq_end, vol_start, vol_end)

A segment is a straight-line glide in pitch and a straight-line fade in
volume.  freq 0 means silence (a rest).  That is the whole format -- the
same five numbers describe a chirp, a beep, a wobble, or a pause.

Usage:  python3 tools/extract_recipes.py > sounds.py      # finds sounds/ itself
        python3 tools/extract_recipes.py a.wav b.wav > sounds.py
"""
import os
import sys
import wave

import numpy as np

HOP_MS = 5.0          # how often we measure (milliseconds)
WIN_MS = 32.0         # how much audio each measurement looks at
FMIN, FMAX = 120.0, 3900.0
SILENCE = 0.055       # normalized RMS below this counts as a rest
CENTS_TOL = 55.0      # pitch fit tolerance (100 cents = 1 semitone)
VOL_TOL = 0.11        # volume fit tolerance (0..1)
MIN_EVENT_MS = 35.0
MIN_REST_MS = 28.0


# ---------------------------------------------------------------- loading
def load(path):
    w = wave.open(path)
    sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64)
    if w.getnchannels() == 2:
        x = x.reshape(-1, 2).mean(axis=1)
    w.close()
    return x / 32768.0, sr


# ---------------------------------------------------------------- pitch
def yin_frame(x, sr):
    """YIN pitch estimate for one frame. Returns (freq_hz, confidence 0..1)."""
    n = len(x)
    tmin, tmax = max(2, int(sr / FMAX)), min(n // 2, int(sr / FMIN))
    if tmax <= tmin:
        return 0.0, 0.0
    x = x - x.mean()
    if np.dot(x, x) < 1e-9:
        return 0.0, 0.0
    nfft = 1 << (2 * n - 1).bit_length()
    spec = np.fft.rfft(x, nfft)
    acf = np.fft.irfft(spec * np.conj(spec))[: tmax + 1]
    cum = np.concatenate(([0.0], np.cumsum(x * x)))
    taus = np.arange(tmax + 1)
    e1 = cum[n] - cum[0]
    e2 = cum[n] - cum[np.minimum(taus, n)]
    d = e1 + e2 - 2 * acf
    d[0] = 0.0
    run = np.cumsum(d[1:])
    cmnd = np.ones(tmax + 1)
    nz = run > 0
    cmnd[1:][nz] = d[1:][nz] * taus[1:][nz] / run[nz]
    seg = cmnd[tmin : tmax + 1]
    below = np.where(seg < 0.15)[0]
    t = below[0] + tmin if len(below) else int(np.argmin(seg)) + tmin
    while t + 1 <= tmax and cmnd[t + 1] < cmnd[t]:
        t += 1
    ti = t
    if 1 <= t < tmax:  # parabolic refinement
        a, b, c = cmnd[t - 1], cmnd[t], cmnd[t + 1]
        den = a - 2 * b + c
        if abs(den) > 1e-12:
            ti = t + 0.5 * (a - c) / den
    return sr / ti, float(1.0 - cmnd[t])


def hps_pitch(x, sr, harmonics=5):
    """
    Harmonic product spectrum -- fallback for noisy, buzzy blips where YIN
    gives up.  Squashing the spectrum by 2x, 3x, 4x... and multiplying the
    copies together lines every harmonic up on top of the fundamental, so
    the fundamental wins.  Picking the plain loudest bin instead would keep
    choosing a harmonic and the sound would come out an octave or two high.
    """
    nfft = 1 << (4 * len(x) - 1).bit_length()
    sp = np.abs(np.fft.rfft(x * np.hanning(len(x)), nfft))
    fq = np.fft.rfftfreq(nfft, 1.0 / sr)
    hps = sp[: len(sp) // harmonics].copy()
    for h in range(2, harmonics + 1):
        hps *= sp[:: h][: len(hps)]
    fq = fq[: len(hps)]
    band = (fq >= FMIN) & (fq <= FMAX)
    if not band.any() or not np.any(hps[band]):
        return 0.0
    return float(fq[band][int(np.argmax(hps[band]))])


def track(x, sr):
    """Measure pitch + loudness every HOP_MS."""
    hop, win = int(sr * HOP_MS / 1000), int(sr * WIN_MS / 1000)
    f, c, a = [], [], []
    for i in range(0, max(1, len(x) - win), hop):
        fr = x[i : i + win]
        hz, conf = yin_frame(fr, sr)
        if conf < 0.45 or hz <= 0:          # unreliable -> find the fundamental
            hz, conf = hps_pitch(fr, sr), max(conf, 0.25)
        f.append(hz)
        c.append(conf)
        a.append(float(np.sqrt(np.mean(fr * fr))))
    f, c, a = np.array(f), np.array(c), np.array(a)
    return f, c, a / (a.max() or 1.0)


def fix_octaves(f, conf, voiced):
    """
    YIN often reports half or double the true pitch.  Pick, for each frame,
    the octave of the raw estimate that keeps the melody smoothest (Viterbi).
    """
    cand = np.array([0.25, 0.5, 1.0, 2.0, 4.0])
    idx = np.where(voiced)[0]
    if len(idx) < 2:
        return f
    lf = np.log2(np.maximum(f[idx], 1e-6))
    grid = lf[:, None] + np.log2(cand)[None, :]
    ok = (grid >= np.log2(FMIN)) & (grid <= np.log2(FMAX))
    emit = np.where(cand == 1.0, 0.0, 0.45)[None, :] * np.maximum(conf[idx], 0.1)[:, None]
    emit = emit + np.where(ok, 0.0, 9e3)
    cost = emit[0].copy()
    back = np.zeros((len(idx), len(cand)), dtype=int)
    for t in range(1, len(idx)):
        trans = 1.6 * np.abs(grid[t][None, :] - grid[t - 1][:, None])
        tot = cost[:, None] + trans
        back[t] = np.argmin(tot, axis=0)
        cost = tot[back[t], np.arange(len(cand))] + emit[t]
    path = np.zeros(len(idx), dtype=int)
    path[-1] = int(np.argmin(cost))
    for t in range(len(idx) - 1, 0, -1):
        path[t - 1] = back[t, path[t]]
    out = f.copy()
    out[idx] = 2.0 ** grid[np.arange(len(idx)), path]
    return out


def smooth(f, voiced, k=3):
    out = f.copy()
    idx = np.where(voiced)[0]
    for j, i in enumerate(idx):
        lo, hi = max(0, j - k), min(len(idx), j + k + 1)
        out[i] = float(np.median(f[idx[lo:hi]]))
    return out


# ---------------------------------------------------------------- fitting
def split_points(y, tol):
    """Douglas-Peucker: fewest straight lines that stay within tol of y."""
    keep = {0, len(y) - 1}
    stack = [(0, len(y) - 1)]
    while stack:
        i, j = stack.pop()
        if j - i < 2:
            continue
        line = np.linspace(y[i], y[j], j - i + 1)
        err = np.abs(y[i : j + 1] - line)
        k = int(np.argmax(err))
        if err[k] > tol:
            keep.add(i + k)
            stack.append((i, i + k))
            stack.append((i + k, j))
    return sorted(keep)


def fit_event(f, amp, t0, t1):
    """Compress one continuous blip into a few (ms, f0, f1, v0, v1) tuples."""
    lf = np.log2(np.maximum(f[t0:t1], 1e-6))
    va = amp[t0:t1]
    pts = sorted(set(split_points(lf, CENTS_TOL / 1200.0)) | set(split_points(va, VOL_TOL)))
    segs = []
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        ms = int(round((b - a) * HOP_MS))
        if ms < 8:
            continue
        segs.append((
            ms,
            int(round(2.0 ** lf[a])), int(round(2.0 ** lf[b])),
            int(round(min(1.0, va[a]) * 100)), int(round(min(1.0, va[b]) * 100)),
        ))
    return segs


def build(path):
    x, sr = load(path)
    f, conf, amp = track(x, sr)
    voiced = amp > SILENCE
    # drop specks and bridge tiny gaps so events are musical, not jittery
    min_v, min_r = int(MIN_EVENT_MS / HOP_MS), int(MIN_REST_MS / HOP_MS)
    runs, i = [], 0
    while i < len(voiced):
        j = i
        while j < len(voiced) and voiced[j] == voiced[i]:
            j += 1
        runs.append([voiced[i], i, j])
        i = j
    for st, i, j in runs:
        if not st and (j - i) < min_r and i > 0 and j < len(voiced):
            voiced[i:j] = True
    for st, i, j in runs:
        if st and (j - i) < min_v:
            voiced[i:j] = False

    f = smooth(fix_octaves(f, conf, voiced), voiced)

    segs, i, prev_end = [], 0, 0
    while i < len(voiced):
        if not voiced[i]:
            i += 1
            continue
        j = i
        while j < len(voiced) and voiced[j]:
            j += 1
        rest = int(round((i - prev_end) * HOP_MS))
        if rest >= 10:
            segs.append((rest, 0, 0, 0, 0))
        segs.extend(fit_event(f, amp, i, j))
        prev_end, i = j, j
    return segs


# ---------------------------------------------------------------- output
def name_of(path):
    return os.path.basename(path).replace("r2d2-", "").replace(".wav", "").replace("-", "_")


def main(paths):
    out = {}
    for p in sorted(paths):
        out[name_of(p)] = build(p)

    w = sys.stdout.write
    w('"""\n')
    w("sounds.py -- R2-D2 style sound recipes for the PWM synth.\n\n")
    w("AUTO-GENERATED by tools/extract_recipes.py from the recorded .wav files\n")
    w("in the repo's sounds/ folder.  Hand-edits will be lost -- change the\n")
    w("extractor, or copy a recipe into your own lesson file and edit it there.\n\n")
    w("Each sound is a list of segments:\n\n")
    w("    (duration_ms, freq_start, freq_end, volume_start, volume_end)\n\n")
    w("Pitch glides in a straight line from freq_start to freq_end while the\n")
    w("volume fades from volume_start to volume_end (both 0-100).  A segment\n")
    w("with freq 0 is a rest.\n")
    w('"""\n\n')
    for k, v in out.items():
        total = sum(s[0] for s in v)
        w("# %s: %d segments, %d ms\n" % (k.replace("_", " "), len(v), total))
        w("%s = (\n" % k.upper())
        for s in v:
            w("    (%4d, %4d, %4d, %3d, %3d),\n" % s)
        w(")\n\n")
    w("# Every sound, in the order the demo plays them.\n")
    w("ALL = (\n")
    for k in out:
        w('    ("%s", %s),\n' % (k.replace("_", " "), k.upper()))
    w(")\n")
    sys.stderr.write(
        "extracted %d sounds, %d segments total\n"
        % (len(out), sum(len(v) for v in out.values()))
    )


def default_wavs():
    """Every r2d2-*.wav in the repo's sounds/ folder, found by walking up."""
    import glob

    d = os.path.dirname(os.path.abspath(__file__))
    for _ in range(6):
        if os.path.isdir(os.path.join(d, "sounds")):
            return sorted(glob.glob(os.path.join(d, "sounds", "r2d2-*.wav")))
        d = os.path.dirname(d)
    raise SystemExit("could not find the repo's sounds/ folder")


if __name__ == "__main__":
    main(sys.argv[1:] or default_wavs())
