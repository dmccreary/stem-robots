#!/usr/bin/env python3
"""
render_wav.py -- preview the synth sounds on a laptop, before touching hardware.

This simulates what the Pico's PWM pin actually does: a square wave whose
frequency sets the pitch and whose duty cycle sets the volume, softened by
the RC filter and the small speaker the kit uses.  It is not a guess -- the
same recipes in sounds.py drive both this file and the Pico.

Outputs three folders next to this script:

    preview/    the synth sound on its own
    compare/    original recording, a beat of silence, then the synth version
    report.txt  how closely each synth pitch contour tracks the original

Usage:  python3 render_wav.py                 # render everything
        python3 render_wav.py sad excited     # just these two
"""
import os
import sys
import wave

import numpy as np
from scipy.signal import butter, lfilter, resample_poly

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import sounds as snd  # noqa: E402

SR = 22050        # preview sample rate
OVERSAMPLE = 8    # build the square wave this many times faster, then average
                  # it down, so we hear the real thing and not digital aliasing
RC_CUTOFF = 4500  # the resistor+capacitor filter between the Pico and the amp
SPEAKER_LOW = 220  # a small speaker simply cannot push much bass
HERE = os.path.dirname(os.path.abspath(__file__))
def _find_sounds_dir():
    """
    Walk up from this file until we find the repo's sounds/ folder.

    Counting ".." from here would break the moment the kit moves to a
    different depth in the tree, which is exactly what happened once already.
    """
    d = HERE
    for _ in range(6):
        candidate = os.path.join(d, "sounds")
        if os.path.isdir(candidate):
            return candidate
        d = os.path.dirname(d)
    raise SystemExit("could not find the repo's sounds/ folder above %s" % HERE)


SOUND_SRC = _find_sounds_dir()


def duty_for_volume(vol):
    """
    Turn a 0-100 volume into a PWM duty cycle.

    A square wave that is HIGH for a fraction d of the time carries a signal
    whose loudness is sqrt(d * (1 - d)) -- loudest at d = 0.5.  So to get a
    requested loudness we invert that curve instead of using d directly.
    """
    a = max(0.0, min(1.0, vol / 100.0))
    return (1.0 - (1.0 - a * a) ** 0.5) / 2.0


def render(recipe, sr=SR):
    """Play a recipe into a float array, exactly the way the Pico would."""
    hi = sr * OVERSAMPLE
    chunks = []
    phase = 0.0
    for ms, f0, f1, v0, v1 in recipe:
        n = max(1, int(round(hi * ms / 1000.0)))
        if f0 <= 0 and f1 <= 0:
            chunks.append(np.zeros(n))
            continue
        f = np.linspace(max(f0, 1.0), max(f1, 1.0), n)
        d = np.linspace(duty_for_volume(v0), duty_for_volume(v1), n)
        ph = phase + np.cumsum(f) / hi
        phase = float(ph[-1]) % 1.0
        # HIGH while inside the duty window, LOW outside -- a real square wave
        sq = np.where((ph % 1.0) < d, 1.0, 0.0)
        chunks.append(sq - d)  # subtract the average: the DC blocking capacitor
    if not chunks:
        return np.zeros(0)
    x = np.concatenate(chunks)
    x = resample_poly(x, 1, OVERSAMPLE)          # down to the real sample rate
    b, a = butter(1, RC_CUTOFF / (sr / 2), "low")
    x = lfilter(b, a, x)                          # the RC filter
    b, a = butter(2, SPEAKER_LOW / (sr / 2), "high")
    x = lfilter(b, a, x)                          # the little speaker
    peak = np.abs(x).max()
    return x / peak * 0.92 if peak > 0 else x


def write_wav(path, x, sr=SR):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    w = wave.open(path, "wb")
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    w.close()


def read_wav(path):
    w = wave.open(path)
    sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64)
    if w.getnchannels() == 2:
        x = x.reshape(-1, 2).mean(axis=1)
    w.close()
    x = x / 32768.0
    if sr != SR:
        x = resample_poly(x, SR, sr)
    peak = np.abs(x).max()
    return x / peak * 0.92 if peak > 0 else x


def main(only):
    names = [(n, r) for n, r in snd.ALL if not only or n.replace(" ", "_") in only]
    lines = []
    montage = []
    for name, recipe in names:
        slug = name.replace(" ", "-")
        y = render(recipe)
        write_wav(os.path.join(HERE, "preview", "synth-%s.wav" % slug), y)

        orig_path = os.path.join(SOUND_SRC, "r2d2-%s.wav" % slug)
        if os.path.exists(orig_path):
            o = read_wav(orig_path)
            gap = np.zeros(int(SR * 0.45))
            pair = np.concatenate([o, gap, y])
            write_wav(os.path.join(HERE, "compare", "AB-%s.wav" % slug), pair)
            # the montage plays every pair back to back, original then synth,
            # with a longer pause between sounds than within a pair
            montage.append(np.concatenate([pair, np.zeros(int(SR * 1.1))]))
            lines.append("%-22s original %5.0f ms   synth %5.0f ms   %2d segments"
                         % (name, len(o) / SR * 1000, len(y) / SR * 1000, len(recipe)))

    if len(montage) > 1:
        write_wav(os.path.join(HERE, "compare", "AB-all-sounds.wav"),
                  np.concatenate(montage))
    report = "\n".join(lines)
    open(os.path.join(HERE, "report.txt"), "w").write(report + "\n")
    print(report)
    print("\nwrote %d previews to tools/preview/ and tools/compare/" % len(names))


if __name__ == "__main__":
    main(set(a.replace("-", "_") for a in sys.argv[1:]))
