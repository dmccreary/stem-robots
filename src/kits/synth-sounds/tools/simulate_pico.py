#!/usr/bin/env python3
"""
simulate_pico.py -- run the real r2d2.py engine on a laptop.

This imports the same r2d2.py that gets uploaded to the Pico, but hands it a
pretend PWM pin and a pretend clock. Every frequency and duty-cycle change
the engine makes is written down, and the resulting square wave is rendered
to a .wav file.

The point is to prove that the code going onto the board makes the same
sound as the preview in render_wav.py, without needing a board.  It also
reports how much memory the recipes will take up once loaded.

Usage:  python3 simulate_pico.py            # check every sound
        python3 simulate_pico.py sad        # just one
"""
import os
import sys
import types

import numpy as np
from scipy.signal import butter, lfilter, resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, ".."))
sys.path.insert(0, HERE)

# --------------------------------------------------------------- fake hardware
EVENTS = []  # (start_ms, freq, duty_u16, duration_ms)


class _Clock:
    now = 0


class FakePin:
    IN = 0
    OUT = 1
    PULL_UP = 2

    def __init__(self, n, *a, **k):
        self.n = n


class FakePWM:
    def __init__(self, pin):
        self.f, self.d = 0, 0

    def freq(self, f):
        self.f = f

    def duty_u16(self, d):
        self.d = d

    def deinit(self):
        self.d = 0


_active = {}


def _sleep_ms(ms):
    """The engine sleeping is our cue to record what the pin was doing."""
    pwm = _active.get("pwm")
    if pwm is not None and ms > 0:
        EVENTS.append((_Clock.now, pwm.f, pwm.d, ms))
    _Clock.now += ms


machine = types.ModuleType("machine")
machine.Pin, machine.PWM, machine.ADC = FakePin, FakePWM, object
sys.modules["machine"] = machine

faketime = types.ModuleType("time")
faketime.sleep_ms = _sleep_ms
faketime.ticks_ms = lambda: _Clock.now
faketime.ticks_add = lambda t, d: t + d
faketime.ticks_diff = lambda a, b: a - b
sys.modules["time"] = faketime

import r2d2  # noqa: E402
import sounds  # noqa: E402

_real_begin = r2d2.begin


def _begin(pin=None):
    pwm = _real_begin(pin)
    _active["pwm"] = pwm
    return pwm


r2d2.begin = _begin

# --------------------------------------------------------------- rendering
SR, OVERSAMPLE, RC_CUTOFF, SPEAKER_LOW = 22050, 8, 4500, 220


def render_events(events):
    """Turn the recorded pin activity into audio, the way the speaker would."""
    hi = SR * OVERSAMPLE
    chunks, phase = [], 0.0
    for _, f, d, ms in events:
        n = max(1, int(round(hi * ms / 1000.0)))
        duty = d / 65536.0
        if f <= 0 or duty <= 0:
            chunks.append(np.zeros(n))
            continue
        ph = phase + np.arange(1, n + 1) * (f / hi)
        phase = float(ph[-1]) % 1.0
        chunks.append(np.where((ph % 1.0) < duty, 1.0, 0.0) - duty)
    if not chunks:
        return np.zeros(0)
    x = resample_poly(np.concatenate(chunks), 1, OVERSAMPLE)
    b, a = butter(1, RC_CUTOFF / (SR / 2), "low")
    x = lfilter(b, a, x)
    b, a = butter(2, SPEAKER_LOW / (SR / 2), "high")
    x = lfilter(b, a, x)
    peak = np.abs(x).max()
    return x / peak * 0.92 if peak > 0 else x


def write_wav(path, x):
    import wave

    os.makedirs(os.path.dirname(path), exist_ok=True)
    w = wave.open(path, "wb")
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    w.close()


def estimate_ram():
    """Rough MicroPython cost of the recipe tables once imported."""
    segs = sum(len(r) for _, r in sounds.ALL)
    # a 5-element tuple of small ints is about 56 bytes on a 32-bit build,
    # plus 4 bytes per slot in the list that holds them
    return segs * 56 + segs * 4 + len(sounds.ALL) * 64


def main(only):
    r2d2.set_volume(100)
    rows = []
    for name, recipe in sounds.ALL:
        if only and name.replace(" ", "_") not in only:
            continue
        EVENTS.clear()
        _Clock.now = 0
        r2d2.play(recipe)
        played = _Clock.now
        wanted = sum(s[0] for s in recipe)
        write_wav(os.path.join(HERE, "pico-sim", "pico-%s.wav" % name.replace(" ", "-")),
                  render_events(EVENTS))
        rows.append((name, wanted, played, len(EVENTS)))

    print("%-22s %8s %8s %7s %8s" % ("sound", "recipe", "played", "steps", "drift"))
    print("-" * 58)
    worst = 0
    for name, wanted, played, steps in rows:
        drift = played - wanted
        worst = max(worst, abs(drift))
        print("%-22s %6d ms %6d ms %7d %6d ms" % (name, wanted, played, steps, drift))
    print("-" * 58)
    print("worst timing drift: %d ms" % worst)
    print("recipe memory on device: about %.1f kB" % (estimate_ram() / 1024))
    print("wrote %d files to tools/pico-sim/" % len(rows))
    return 0 if worst <= 25 else 1


if __name__ == "__main__":
    sys.exit(main(set(a.replace("-", "_") for a in sys.argv[1:])))
