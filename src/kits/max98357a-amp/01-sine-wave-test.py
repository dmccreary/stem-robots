import math
import struct
import time
from machine import Pin, I2S

# MAX98357A I2S amplifier wiring:
#   BCLK -> GPIO11 (bit clock)
#   LRC  -> GPIO12 (word select / left-right clock)
#   DIN  -> GPIO13 (serial audio data, Pico -> amp)
#   GAIN -> GPIO14 (floating = default 9dB gain)
#   SD   -> GPIO15 (shutdown control: HIGH = enabled, LOW = muted)
#   GND  -> Pico GND
#   VIN  -> Pico VBUS (5V)
#
# BCLK and LRC are swapped relative to the amp board's left-to-right pin
# order because MicroPython's rp2 I2S driver requires ws (LRC) to be
# exactly one GPIO number higher than sck (BCLK).
#
# Self-contained on purpose (pins inlined, not imported from config.py) so
# it can be run standalone from Thonny or `mpremote run`.
BCLK_PIN = 11
LRC_PIN = 12
DIN_PIN = 13
GAIN_PIN = 14
SD_PIN = 15

I2S_ID = 0
SAMPLE_RATE_HZ = 16000
TONE_HZ = 440       # target pitch (A4); actual pitch is printed below
AMPLITUDE = 0.3      # fraction of full-scale, keeps the amp from clipping
DURATION_S = 5

# Leave GAIN floating (input, no pull) for the amp's default 9dB gain.
gain = Pin(GAIN_PIN, Pin.IN)

# Drive SD high to take the amp out of shutdown.
shutdown = Pin(SD_PIN, Pin.OUT)
shutdown.value(1)

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
