import math
import os
import struct
import time
from array import array
from machine import ADC, Pin, I2S
import config

# Combines 03 (button-triggered playback) with 06 (the pot + gauge ring):
# the pot now controls VOLUME instead of a bare test reading, live-updated
# both while idle and while a sound is playing.
#
# The MAX98357A's GAIN pin can't do continuous volume control - it only
# selects one of ~5 fixed dB steps via voltage thresholds (see
# docs/kits/max98357a-amp/index.md). Real, smoothly-variable volume has
# to happen in software: each 16-bit PCM sample is scaled by the pot's
# 0.0-1.0 position before being written to I2S.
#
# Wiring: see config.py for the amp/display/pot pins - nothing new here
# beyond what 03 and 06 already used.
BCLK_PIN = config.BCLK_PIN
LRC_PIN = config.LRC_PIN
DIN_PIN = config.DIN_PIN
GAIN_PIN = config.GAIN_PIN
SD_PIN = config.SD_PIN
BUTTON_PIN = config.BUTTON_PIN
POT_PIN = config.POT_PIN

I2S_ID = config.I2S_ID
SOUND_DIR = config.SOUND_DIR
SAMPLE_RATE_HZ = config.SAMPLE_RATE_HZ
BITS = config.BITS
FORMAT = I2S.MONO
CHUNK_BYTES = config.CHUNK_BYTES
SETTLE_MS = 200  # let the amp's power-on mute clear before real audio

gain = Pin(GAIN_PIN, Pin.IN)
shutdown = Pin(SD_PIN, Pin.OUT)
shutdown.value(1)
time.sleep_ms(SETTLE_MS)

button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)
pot = ADC(Pin(POT_PIN))

audio_out = I2S(
    I2S_ID,
    sck=Pin(BCLK_PIN),
    ws=Pin(LRC_PIN),
    sd=Pin(DIN_PIN),
    mode=I2S.TX,
    bits=BITS,
    format=FORMAT,
    rate=SAMPLE_RATE_HZ,
    ibuf=16384,  # more headroom than 03/04's 8192 - this script does real
                 # per-chunk work (volume scaling, occasional display
                 # updates) between writes, so give the DMA more slack.
)

display = config.init_display()
display.fill(config.DISPLAY_BLACK)

# --- Volume gauge ring (see 06-pot-gauge-test.py for the fill_rect()
# speed trick and why it matters - line()/pixel() is ~10x slower here) ---
CENTER_X = config.DISPLAY_WIDTH // 2
CENTER_Y = config.DISPLAY_HEIGHT // 2
RADIUS_OUTER = 116
RADIUS_INNER = 106
ANGLE_STEP_DEG = 1
TOTAL_STEPS = 360 // ANGLE_STEP_DEG

SPOKE_RECTS = []
for step in range(TOTAL_STEPS):
    rad = math.radians(step * ANGLE_STEP_DEG - 90)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)
    x0 = CENTER_X + int(RADIUS_INNER * cos_a)
    y0 = CENTER_Y + int(RADIUS_INNER * sin_a)
    x1 = CENTER_X + int(RADIUS_OUTER * cos_a)
    y1 = CENTER_Y + int(RADIUS_OUTER * sin_a)
    rect_x = min(x0, x1)
    rect_y = min(y0, y1)
    rect_w = abs(x1 - x0) + 1
    rect_h = abs(y1 - y0) + 1
    SPOKE_RECTS.append((rect_x, rect_y, rect_w, rect_h))

current_step = 0


def update_gauge(volume):
    global current_step
    target_step = int(volume * TOTAL_STEPS)
    if target_step > current_step:
        for step in range(current_step, target_step):
            rx, ry, rw, rh = SPOKE_RECTS[step]
            display.fill_rect(rx, ry, rw, rh, config.DISPLAY_BLUE)
        current_step = target_step
    elif target_step < current_step:
        for step in range(target_step, current_step):
            rx, ry, rw, rh = SPOKE_RECTS[step]
            display.fill_rect(rx, ry, rw, rh, config.DISPLAY_BLACK)
        current_step = target_step


# --- Two text rows, centered in the middle of the ring: the name of the
# last sound played (top) and a static "Ready" status (bottom). The title
# is deliberately NOT cleared when playback ends - it stays on screen so
# a student has time to actually read it, instead of flashing by for the
# 1-3 seconds the clip takes to play. ---
TITLE_Y = 104
STATUS_Y = TITLE_Y + 16  # directly below the title
MAX_TEXT_CHARS = 20  # keeps the widest label clear of the ring at 3/9 o'clock
last_title = None


def _draw_centered_row(y, text, color):
    if len(text) > MAX_TEXT_CHARS:
        text = text[:MAX_TEXT_CHARS - 3] + "..."
    text_width = len(text) * 8
    x = (config.DISPLAY_WIDTH - text_width) // 2
    # Clear the whole row first - text() doesn't erase characters from a
    # previous, longer label that the new one doesn't cover.
    display.fill_rect(0, y, config.DISPLAY_WIDTH, 16, config.DISPLAY_BLACK)
    display.text(config.DISPLAY_FONT, text, x, y, color, config.DISPLAY_BLACK)


def show_title(text):
    global last_title
    if text == last_title:
        return
    _draw_centered_row(TITLE_Y, text, config.DISPLAY_WHITE)
    last_title = text


def read_volume():
    linear = pot.read_u16() / 65535  # 0.0 - 1.0, straight from the pot
    # Human hearing perceives loudness logarithmically, not linearly, so
    # scaling samples by `linear` directly makes most of the knob's
    # rotation sound barely audible - only the top of the range feels
    # loud. sqrt() is a simple, cheap perceptual-taper correction: it
    # boosts the low/middle of the range so volume feels more even across
    # the full turn of the pot.
    return math.sqrt(linear)


def find_data_chunk(f):
    # Parses RIFF/WAVE chunks looking for 'data', skipping any others in
    # between - these files carry a 'LIST'/INFO metadata chunk right
    # after 'fmt ', so a fixed 44-byte header offset would read garbage.
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


UPDATE_INTERVAL_MS = 150  # how often to re-read the pot / touch the display
                           # during playback - NOT every chunk. Reading the
                           # ADC and redrawing the gauge are both real SPI/
                           # GPIO work; doing them ~4x/sec is still plenty
                           # responsive and keeps the tight per-chunk audio
                           # loop free to just feed the I2S buffer.
VOLUME_DEADBAND = 0.01    # skip the scaling loop entirely this close to
                           # full volume - saves a 2000+ iteration Python
                           # loop on most "turned all the way up" chunks


def play_wav(path, label):
    show_title(label)
    with open(path, "rb") as f:
        channels, sample_rate, bits_per_sample, data_size = find_data_chunk(f)
        if (channels, sample_rate, bits_per_sample) != (1, SAMPLE_RATE_HZ, BITS):
            print("  skipping {} - unexpected format (channels={}, rate={}, bits={})".format(
                path, channels, sample_rate, bits_per_sample))
            return

        buf = bytearray(CHUNK_BYTES)
        mv = memoryview(buf)
        remaining = data_size
        volume = read_volume()
        update_gauge(volume)
        print("  volume={:5.1f}%".format(volume * 100))
        last_update_ms = time.ticks_ms()

        while remaining > 0:
            want = min(len(buf), remaining)
            n = f.readinto(mv[:want])
            if not n:
                break

            now = time.ticks_ms()
            if time.ticks_diff(now, last_update_ms) >= UPDATE_INTERVAL_MS:
                volume = read_volume()
                update_gauge(volume)
                print("  volume={:5.1f}%".format(volume * 100))
                last_update_ms = now

            # array('h', ...) only reinterprets raw bytes correctly when
            # given a bytes/bytearray object - a memoryview (mv[:n]) is
            # silently iterated BYTE BY BYTE instead (confirmed on-device:
            # 10 tiny 0-255 elements from 10 bytes, not 5 real int16
            # samples). That was the actual bug behind "quiet and
            # garbled": every chunk was reinterpreted as twice as many
            # scrambled, tiny-amplitude "samples." buf[:n] (a bytearray
            # slice) takes the correct path.
            samples = array('h', buf[:n])
            if volume < 1.0 - VOLUME_DEADBAND:
                for i in range(len(samples)):
                    samples[i] = int(samples[i] * volume)
            audio_out.write(samples)

            remaining -= n
    # No show_title("Ready") here on purpose - the title stays on screen
    # as the last sound played, so a student has time to read it instead
    # of it flashing back to "Ready" the instant a 1-3 second clip ends.


sound_files = sorted(name for name in os.listdir(SOUND_DIR) if name.endswith(".wav"))
if not sound_files:
    raise RuntimeError("no .wav files found in " + SOUND_DIR)

# sounds/metadata.json maps each filename to a Title Case display name
# (e.g. "r2d2-unsure.wav" -> "R2D2 Unsure") - falls back to the raw
# filename for any .wav not listed there.
sound_titles = config.load_sound_titles()

show_title("Press button")
_draw_centered_row(STATUS_Y, "Ready", config.DISPLAY_WHITE)  # drawn once - static
update_gauge(read_volume())

print("Loaded {} sound(s) from {}.".format(len(sound_files), SOUND_DIR))
print("Turn the pot to set volume, press the button (GPIO{}) to play the next one in order.".format(BUTTON_PIN))
print("Ctrl-C to stop.")

# Cycle through every sound in order (wrapping back to the start) rather
# than picking randomly, so a student hears the whole set with no
# repeats before anything plays twice.
sound_index = 0

try:
    while True:
        update_gauge(read_volume())

        if button.value() == 0:
            time.sleep_ms(20)  # debounce
            if button.value() == 0:
                name = sound_files[sound_index]
                sound_index = (sound_index + 1) % len(sound_files)
                title = sound_titles.get(name, name)
                print("Playing", title)
                play_wav(SOUND_DIR + "/" + name, title)
                while button.value() == 0:  # wait for release before re-arming
                    time.sleep_ms(10)

        time.sleep_ms(10)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
finally:
    shutdown.value(0)
    audio_out.deinit()
    print("Done - amp shut down.")
