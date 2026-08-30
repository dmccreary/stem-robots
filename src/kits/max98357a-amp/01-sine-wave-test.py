import math
import struct
import time
from machine import Pin, I2S
import config

# MAX98357A I2S amplifier wiring (tested on a plain Raspberry Pi Pico):
#   GND -> Pico GND, VIN -> Pico VBUS (5V)
#   BCLK/LRC/DIN/GAIN/SD pins live in config.py - edit them there to try
#   the amp on different GPIOs, see TODO.md for the pin tests to run.
#
# MicroPython's rp2 I2S driver requires ws (LRC) to be exactly one GPIO
# number higher than sck (BCLK); config.py's defaults (GPIO2/3) satisfy
# that. (If this ever runs on a Cytron Maker Pi RP2040 instead of a plain
# Pico, note that board hardwires GPIO8-11 to its onboard motor driver and
# GPIO12-15 to its onboard servo headers - avoid those pins there.)
#
# GPIO11-15 is also confirmed to work fine on a plain Pico - earlier
# "silent" results there were a testing artifact (a very short clip played
# with almost no delay after enabling the amp, likely swallowed by the
# amp's own power-on mute), not a pin problem. See SETTLE_MS below.
BCLK_PIN = config.BCLK_PIN
LRC_PIN = config.LRC_PIN
DIN_PIN = config.DIN_PIN
GAIN_PIN = config.GAIN_PIN
SD_PIN = config.SD_PIN

I2S_ID = config.I2S_ID
SAMPLE_RATE_HZ = 16000
TONE_HZ = 440       # target pitch (A4); actual pitch is printed below
AMPLITUDE = 0.3      # fraction of full-scale, keeps the amp from clipping
DURATION_S = 5
SETTLE_MS = 200      # let the amp's power-on mute clear before real audio

# Leave GAIN floating (input, no pull) for the amp's default 9dB gain.
gain = Pin(GAIN_PIN, Pin.IN)

# Drive SD high to take the amp out of shutdown, then give it a moment
# before sending real audio - see SETTLE_MS note above.
shutdown = Pin(SD_PIN, Pin.OUT)
shutdown.value(1)
time.sleep_ms(SETTLE_MS)

audio_out = I2S(
    I2S_ID,
    sck=Pin(BCLK_PIN),
    ws=Pin(LRC_PIN),
    sd=Pin(DIN_PIN),
    mode=I2S.TX,
    bits=16,
    format=I2S.MONO,
    rate=SAMPLE_RATE_HZ,
    ibuf=4000,
)


def make_sine_buffer(frequency_hz, sample_rate_hz, amplitude):
    # One full cycle, sized so consecutive writes loop without a click at
    # the seam (each buffer starts and ends on a zero crossing).
    num_samples = sample_rate_hz // frequency_hz
    peak = int((2 ** 15 - 1) * amplitude)
    samples = [int(peak * math.sin(2 * math.pi * i / num_samples)) for i in range(num_samples)]
    return struct.pack("<{}h".format(num_samples), *samples), num_samples


buf, num_samples = make_sine_buffer(TONE_HZ, SAMPLE_RATE_HZ, AMPLITUDE)
actual_hz = SAMPLE_RATE_HZ / num_samples
print("Playing {:.1f} Hz tone for {}s - listen for a steady tone on the speaker.".format(actual_hz, DURATION_S))

start = time.ticks_ms()
try:
    while time.ticks_diff(time.ticks_ms(), start) < DURATION_S * 1000:
        audio_out.write(buf)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
finally:
    shutdown.value(0)
    audio_out.deinit()
    print("Done - amp shut down.")
