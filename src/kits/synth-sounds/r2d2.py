"""
r2d2.py -- the synth engine.

Plays the sound recipes in sounds.py using a single PWM pin. There is no
audio file, no DAC, and no amplifier chip involved: the Pico switches one
pin on and off, and the speed of that switching is the pitch you hear.

Typical use:

    import r2d2, sounds
    r2d2.play(sounds.SAD)
"""

import math
import time
from machine import PWM, Pin

import config

# ---------------------------------------------------------------------------
# Volume table
# ---------------------------------------------------------------------------
# A square wave that is HIGH for a fraction d of each cycle carries a signal
# whose loudness works out to sqrt(d * (1 - d)). That peaks at d = 0.5 and
# falls away on both sides, so we cannot just use "duty = volume" - half
# volume would not sound half as loud. Instead we turn that formula around
# and work out which duty gives the loudness we asked for.
#
# We do the arithmetic once here, at import, and keep the answers in a list.
# Looking a number up in a list is far quicker than a square root, and the
# engine needs a fresh one every few milliseconds.
_DUTY = tuple(
    int(32768 * (1.0 - math.sqrt(1.0 - (v / 100.0) ** 2))) for v in range(101)
)

_pwm = None
_master = 100


def begin(pin=None):
    """Wake up the audio pin. Called automatically the first time you play."""
    global _pwm
    if _pwm is None:
        _pwm = PWM(Pin(config.AUDIO_PIN if pin is None else pin))
        _pwm.duty_u16(0)
    return _pwm


def end():
    """
    Silence the pin and hand it back. Call this when your program exits.

    After deinit() the pin would be left floating, and a floating wire into a
    high-gain amplifier acts as an aerial - you hear hiss and mains buzz out
    of a robot that is supposed to be silent. So we drive the pin firmly LOW
    on the way out, which gives the amplifier a steady, quiet input.
    """
    global _pwm
    if _pwm is not None:
        _pwm.duty_u16(0)
        _pwm.deinit()
        _pwm = None
    Pin(config.AUDIO_PIN, Pin.OUT, value=0)


def set_volume(percent):
    """Master volume, 0 to 100. Scales every sound played after this."""
    global _master
    _master = max(0, min(100, int(percent)))


def get_volume():
    return _master


def quiet():
    """Stop making noise, but keep the pin ready for the next sound."""
    if _pwm is not None:
        _pwm.duty_u16(0)


def tone(frequency, ms, volume=100):
    """Hold one steady pitch for a while. The simplest thing this kit can do."""
    glide(frequency, frequency, ms, volume, volume)


def glide(f_start, f_end, ms, v_start=100, v_end=100):
    """
    Slide from one pitch to another while fading from one volume to another.

    This single function is the whole synth. Every R2-D2 noise in sounds.py
    is just a list of these glides played back to back.
    """
    pwm = begin()

    if f_start <= 0 and f_end <= 0:  # a rest: silence for a while
        quiet()
        time.sleep_ms(ms)
        return

    steps = max(1, ms // config.STEP_MS)
    start = time.ticks_ms()
    for i in range(steps):
        # How far through the glide are we, from 0 at the start to 1 at the end?
        progress = i / steps
        freq = int(f_start + (f_end - f_start) * progress)
        vol = int(v_start + (v_end - v_start) * progress)

        pwm.freq(max(config.MIN_FREQUENCY, freq))
        pwm.duty_u16(_DUTY[max(0, min(100, vol)) * _master // 100])

        # Sleep until this step's deadline rather than for a fixed amount,
        # so the small delays of the lines above cannot pile up and stretch
        # the sound out of shape.
        deadline = time.ticks_add(start, (i + 1) * ms // steps)
        time.sleep_ms(max(0, time.ticks_diff(deadline, time.ticks_ms())))


def play(recipe):
    """
    Play a whole sound.

    A recipe is a list of segments, each one five numbers:
    (duration_ms, freq_start, freq_end, volume_start, volume_end)
    """
    begin()
    for ms, f0, f1, v0, v1 in recipe:
        glide(f0, f1, ms, v0, v1)
    quiet()
