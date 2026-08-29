import struct
from machine import Pin, I2S

# Isolates file-streaming playback from the button entirely: plays one
# file immediately on start, no button involved, to check whether the
# reset seen in 03-play-sounds-on-button.py is caused by reading a WAV
# file from flash while streaming to I2S, independent of the button.
BCLK_PIN = 2
LRC_PIN = 3
DIN_PIN = 4
GAIN_PIN = 5
SD_PIN = 6

I2S_ID = 0
SAMPLE_RATE_HZ = 8000
BITS = 16
CHUNK_BYTES = 4096
WAV_PATH = "/sounds/r2d2-another-beep.wav"  # smallest file, 7198 bytes

gain = Pin(GAIN_PIN, Pin.IN)
shutdown = Pin(SD_PIN, Pin.OUT)
shutdown.value(1)

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


print("Opening", WAV_PATH)
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
