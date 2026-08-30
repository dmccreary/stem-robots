# Hardware configuration for the MAX98357A I2S amplifier kit.
# Every script in this folder imports its pins from here instead of
# hardcoding them - edit the numbers below to try the amp/button on
# different GPIOs, then re-run any script without changing it.
#
# Constraint: MicroPython's rp2 I2S driver requires LRC_PIN to be exactly
# one GPIO number higher than BCLK_PIN (LRC_PIN = BCLK_PIN + 1), or
# machine.I2S() raises a ValueError.
#
# These are the pins actually wired inside the assembled project box (see
# docs/kits/max98357a-amp/index.md) - BCLK/LRC/DIN/GAIN/SD as one
# contiguous block (11-15), with the button right next to it on 16. GPIO
# 11-15 looked broken early in development but wasn't - see TODO.md and
# each script's SETTLE_MS comment for why.

# ---------------------------------------------------------------------------
# MAX98357A I2S amplifier
# ---------------------------------------------------------------------------
BCLK_PIN = 11   # bit clock
LRC_PIN = 12    # word select / left-right clock (must be BCLK_PIN + 1)
DIN_PIN = 13    # serial audio data, Pico -> amp
GAIN_PIN = 14   # floating (Pin.IN, no pull) = default 9dB gain
SD_PIN = 15     # shutdown control: HIGH = enabled, LOW = muted

I2S_ID = 0

# ---------------------------------------------------------------------------
# Momentary push button
# ---------------------------------------------------------------------------
# One leg -> BUTTON_PIN, other leg -> GND. Internal PULL_UP holds the pin
# HIGH when open; pressing it pulls the pin LOW.
BUTTON_PIN = 16

# ---------------------------------------------------------------------------
# Sound playback (used by 03-play-sounds-on-button.py, 04-play-one-file-test.py)
# ---------------------------------------------------------------------------
SOUND_DIR = "/sounds"
SAMPLE_RATE_HZ = 8000  # matches the .wav files uploaded to SOUND_DIR
BITS = 16
CHUNK_BYTES = 4096     # streaming buffer size - keep this large; a too-small
                        # buffer written in a tight loop was the likely cause
                        # of audible static during early tone testing


def load_sound_titles():
    """Load sounds/metadata.json: {filename -> Title Case display name}.

    Falls back to an empty dict if the file is missing, so callers should
    look up with titles.get(filename, filename) rather than titles[...]."""
    import json
    try:
        with open(SOUND_DIR + "/metadata.json") as f:
            return json.load(f)
    except OSError:
        return {}

# ---------------------------------------------------------------------------
# GC9A01 round display (240x240, SPI)
# ---------------------------------------------------------------------------
# Same pins as the confirmed-working "pico" wiring in the robot-faces
# smartwatch kit (src/kits/smartwatch/config.py), so wiring habits carry
# over: SCK/MOSI on GPIO2/3, then DC/CS/RST on 4/5/6.
DISPLAY_SPI_ID = 0
DISPLAY_SCK_PIN = 2    # SCL / CLK
DISPLAY_MOSI_PIN = 3   # SDA / MOSI (data)
DISPLAY_DC_PIN = 4
DISPLAY_CS_PIN = 5
DISPLAY_RES_PIN = 6
DISPLAY_BAUDRATE = 60_000_000

DISPLAY_WIDTH = 240
DISPLAY_HEIGHT = 240

# RGB565: five bits of red, six of green, five of blue.
DISPLAY_BLACK = 0x0000
DISPLAY_WHITE = 0xFFFF
DISPLAY_BLUE = 0x001F

from machine import Pin, SPI
import gc9a01
import vga1_8x16 as DISPLAY_FONT  # 8x16 bitmap font - no built-in font on this driver


def init_display():
    """Start the SPI bus and the GC9A01. Returns the display object.

    There is no frame buffer on this driver - every drawing call goes
    straight to the glass, and there is no show() to call afterwards."""
    spi = SPI(DISPLAY_SPI_ID, baudrate=DISPLAY_BAUDRATE,
              sck=Pin(DISPLAY_SCK_PIN), mosi=Pin(DISPLAY_MOSI_PIN))

    return gc9a01.GC9A01(
        spi,
        dc=Pin(DISPLAY_DC_PIN, Pin.OUT),
        cs=Pin(DISPLAY_CS_PIN, Pin.OUT),
        reset=Pin(DISPLAY_RES_PIN, Pin.OUT),
        rotation=0)


# ---------------------------------------------------------------------------
# 20K potentiometer (wiper -> ADC0)
# ---------------------------------------------------------------------------
# Wiper -> POT_PIN, outer legs -> 3V3 and GND so the wiper sweeps the full
# 0-3.3V range. GPIO26 is the Pico's ADC0 - GPIO26-29 are the only pins
# with ADC hardware behind them.
POT_PIN = 26
