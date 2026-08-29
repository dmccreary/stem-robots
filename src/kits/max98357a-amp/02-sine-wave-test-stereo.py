import math
import struct
import time
from machine import Pin, I2S

# Diagnostic variant of 01-sine-wave-test.py: uses STEREO format with the
# same sample duplicated into both L and R slots explicitly, instead of
# relying on the driver's MONO format to do the duplication internally.
# Also louder (0.8 amplitude) and a higher, more speaker-friendly pitch
# (1kHz) to rule out "too quiet to notice" as an explanation.
#
# Pins: see 01-sine-wave-test.py for why GPIO2-6 (not 11-15) are used.
BCLK_PIN = 2
LRC_PIN = 3
DIN_PIN = 4
GAIN_PIN = 5
SD_PIN = 6

I2S_ID = 0
SAMPLE_RATE_HZ = 16000
TONE_HZ = 1000
AMPLITUDE = 0.8
DURATION_S = 5

gain = Pin(GAIN_PIN, Pin.IN)

shutdown = Pin(SD_PIN, Pin.OUT)
shutdown.value(1)

audio_out = I2S(
    I2S_ID,
    sck=Pin(BCLK_PIN),
    ws=Pin(LRC_PIN),
    sd=Pin(DIN_PIN),
    mode=I2S.TX,
    bits=16,
    format=I2S.STEREO,
    rate=SAMPLE_RATE_HZ,
    ibuf=4000,
)


def make_sine_buffer_stereo(frequency_hz, sample_rate_hz, amplitude):
    num_samples = sample_rate_hz // frequency_hz
    peak = int((2 ** 15 - 1) * amplitude)
    interleaved = []
    for i in range(num_samples):
        v = int(peak * math.sin(2 * math.pi * i / num_samples))
        interleaved.append(v)  # left
        interleaved.append(v)  # right
    return struct.pack("<{}h".format(len(interleaved)), *interleaved), num_samples


buf, num_samples = make_sine_buffer_stereo(TONE_HZ, SAMPLE_RATE_HZ, AMPLITUDE)
actual_hz = SAMPLE_RATE_HZ / num_samples
print("STEREO test: playing {:.1f} Hz tone for {}s".format(actual_hz, DURATION_S))

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
