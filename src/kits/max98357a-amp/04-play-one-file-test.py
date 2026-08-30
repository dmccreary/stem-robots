import struct
import time
from machine import Pin, I2S
import config

# Isolates file-streaming playback from the button entirely: plays one
# file immediately on start, no button involved.
#
# v0.03: on GPIO11-15, this previously ran clean (no error) but produced
# no sound, while 03-play-sounds-on-button.py on the SAME pins played
# several files fine. The difference: 03 waits for a button press before
# playing (a real delay after shutdown.value(1) enables the amp), and its
# files were all 0.7-2.6s long; this script played r2d2-another-beep.wav
# (~0.44s, the shortest file) almost immediately after enabling the amp.
# Many class-D amps mute output briefly after coming out of shutdown to
# suppress power-on pop - if that mute window is longer than this file,
# the whole thing could be swallowed. Testing that theory: added a settle
# delay after enable, and switched to a longer file.
BCLK_PIN = config.BCLK_PIN
LRC_PIN = config.LRC_PIN
DIN_PIN = config.DIN_PIN
GAIN_PIN = config.GAIN_PIN
SD_PIN = config.SD_PIN

I2S_ID = config.I2S_ID
SAMPLE_RATE_HZ = config.SAMPLE_RATE_HZ
BITS = config.BITS
CHUNK_BYTES = config.CHUNK_BYTES
WAV_PATH = config.SOUND_DIR + "/r2d2-laughing.wav"  # ~2.6s - long enough that
                                                      # a short amp mute window
                                                      # can't hide the whole file
SETTLE_MS = 200  # delay after enabling the amp, before sending real audio

gain = Pin(GAIN_PIN, Pin.IN)
shutdown = Pin(SD_PIN, Pin.OUT)
shutdown.value(1)
time.sleep_ms(SETTLE_MS)

audio_out = I2S(
    I2S_ID,
    sck=Pin(BCLK_PIN),
    ws=Pin(LRC_PIN),
    sd=Pin(DIN_PIN),
    mode=I2S.TX,
    bits=BITS,
    format=I2S.MONO,
    rate=SAMPLE_RATE_HZ,
    ibuf=8192,
)


def find_data_chunk(f):
    if f.read(4) != b"RIFF":
        raise ValueError("not a RIFF file")
    f.read(4)
    if f.read(4) != b"WAVE":
        raise ValueError("not a WAVE file")
    while True:
        chunk_id = f.read(4)
        if len(chunk_id) < 4:
            raise ValueError("no data chunk found")
        chunk_size = struct.unpack("<I", f.read(4))[0]
        if chunk_id == b"fmt ":
            f.read(chunk_size)
            if chunk_size % 2:
                f.read(1)
        elif chunk_id == b"data":
            return chunk_size
        else:
            f.seek(chunk_size + (chunk_size % 2), 1)


print("Running 04-play-one-file-test.py version 0.03")
print("Opening", WAV_PATH)
print("BCLK_PIN", BCLK_PIN)
print("LRC_PIN", LRC_PIN)
print("DIN_PIN", DIN_PIN)
print("GAIN_PIN", GAIN_PIN)
print("SD_PIN", SD_PIN)

with open(WAV_PATH, "rb") as f:
    data_size = find_data_chunk(f)
    print("data chunk size:", data_size)
    buf = bytearray(CHUNK_BYTES)
    mv = memoryview(buf)
    remaining = data_size
    n_writes = 0
    while remaining > 0:
        want = min(len(buf), remaining)
        n = f.readinto(mv[:want])
        if not n:
            break
        audio_out.write(mv[:n])
        n_writes += 1
        remaining -= n
        print("wrote chunk", n_writes, "remaining", remaining)

shutdown.value(0)
audio_out.deinit()
print("Done - amp shut down.")
