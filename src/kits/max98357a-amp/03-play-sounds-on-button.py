import os
import struct
import time
from machine import Pin, I2S
import config

# MAX98357A I2S amplifier wiring (tested on a plain Raspberry Pi Pico):
#   GND -> Pico GND, VIN -> Pico VBUS (5V) - NOT the 3V3 OUT pin. The
#   onboard 3.3V regulator only supplies ~300mA shared with the whole
#   board; on 3V3 this amp browned out and audio cut off after about 1.2s.
#   BCLK/LRC/DIN/GAIN/SD/BUTTON pins live in config.py - edit them there
#   to try the amp/button on different GPIOs, see TODO.md for the pin
#   tests to run.
#
# Momentary push button: one leg -> BUTTON_PIN, other leg -> GND. PULL_UP
# holds the pin HIGH when open; pressing it pulls the pin LOW.
BCLK_PIN = config.BCLK_PIN
LRC_PIN = config.LRC_PIN
DIN_PIN = config.DIN_PIN
GAIN_PIN = config.GAIN_PIN
SD_PIN = config.SD_PIN
BUTTON_PIN = config.BUTTON_PIN

I2S_ID = config.I2S_ID
SOUND_DIR = config.SOUND_DIR

# Every file in SOUND_DIR is mono/16-bit/8000Hz (checked on the desktop
# before upload), so I2S is configured once for that format up front
# instead of re-deriving it per file. If you add a file with a different
# rate/bit depth/channel count, play_wav() below will print a warning and
# skip it rather than reinitializing I2S mid-run.
SAMPLE_RATE_HZ = config.SAMPLE_RATE_HZ
BITS = config.BITS
FORMAT = I2S.MONO

# Streaming chunk size for file -> I2S playback. Much bigger than the
# single-cycle buffer used by 01/02's tone tests on purpose: writing tiny
# buffers in a tight loop is a likely cause of the audible static heard
# during tone testing (buffer underruns between writes).
CHUNK_BYTES = config.CHUNK_BYTES

SETTLE_MS = 200  # let the amp's power-on mute clear before real audio -
                  # matters most for a short first clip played right after
                  # boot with little/no button-wait delay

gain = Pin(GAIN_PIN, Pin.IN)

shutdown = Pin(SD_PIN, Pin.OUT)
shutdown.value(1)
time.sleep_ms(SETTLE_MS)

button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

audio_out = I2S(
    I2S_ID,
    sck=Pin(BCLK_PIN),
    ws=Pin(LRC_PIN),
    sd=Pin(DIN_PIN),
    mode=I2S.TX,
    bits=BITS,
    format=FORMAT,
    rate=SAMPLE_RATE_HZ,
    ibuf=8192,
)


def find_data_chunk(f):
    # Parses RIFF/WAVE chunks looking for 'data', skipping any others in
    # between - these files carry a 'LIST'/INFO metadata chunk right
    # after 'fmt ', so a fixed 44-byte header offset would read garbage.
    # Returns (channels, sample_rate, bits_per_sample, data_chunk_size).
    if f.read(4) != b"RIFF":
        raise ValueError("not a RIFF file")
    f.read(4)  # overall RIFF chunk size, unused
    if f.read(4) != b"WAVE":
        raise ValueError("not a WAVE file")

    channels = sample_rate = bits_per_sample = None
    while True:
        chunk_id = f.read(4)
        if len(chunk_id) < 4:
            raise ValueError("no data chunk found")
        chunk_size = struct.unpack("<I", f.read(4))[0]
        if chunk_id == b"fmt ":
            fmt = f.read(chunk_size)
            (_audio_format, channels, sample_rate, _byte_rate,
             _block_align, bits_per_sample) = struct.unpack("<HHIIHH", fmt[:16])
            if chunk_size % 2:
                f.read(1)  # chunks are word-aligned
        elif chunk_id == b"data":
            return channels, sample_rate, bits_per_sample, chunk_size
        else:
            f.seek(chunk_size + (chunk_size % 2), 1)


def play_wav(path):
    with open(path, "rb") as f:
        channels, sample_rate, bits_per_sample, data_size = find_data_chunk(f)
        if (channels, sample_rate, bits_per_sample) != (1, SAMPLE_RATE_HZ, BITS):
            print("  skipping {} - unexpected format (channels={}, rate={}, bits={})".format(
                path, channels, sample_rate, bits_per_sample))
            return

        buf = bytearray(CHUNK_BYTES)
        mv = memoryview(buf)
        remaining = data_size
        while remaining > 0:
            want = min(len(buf), remaining)
            n = f.readinto(mv[:want])
            if not n:
                break
            audio_out.write(mv[:n])
            remaining -= n


sound_files = sorted(name for name in os.listdir(SOUND_DIR) if name.endswith(".wav"))
if not sound_files:
    raise RuntimeError("no .wav files found in " + SOUND_DIR)

print("Loaded {} sound(s) from {}.".format(len(sound_files), SOUND_DIR))
print("Press the button (GPIO{}) to play the next one in order. Ctrl-C to stop.".format(BUTTON_PIN))

# Cycle through every sound in order (wrapping back to the start) rather
# than picking randomly, so a student hears the whole set with no
# repeats before anything plays twice.
sound_index = 0

try:
    while True:
        if button.value() == 0:
            time.sleep_ms(20)  # debounce
            if button.value() == 0:
                name = sound_files[sound_index]
                sound_index = (sound_index + 1) % len(sound_files)
                print("Playing", name)
                play_wav(SOUND_DIR + "/" + name)
                while button.value() == 0:  # wait for release before re-arming
                    time.sleep_ms(10)
        time.sleep_ms(10)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
finally:
    shutdown.value(0)
    audio_out.deinit()
    print("Done - amp shut down.")
