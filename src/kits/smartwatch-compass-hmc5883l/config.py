# Hardware configuration for the Smartwatch Compass (HMC5883L + GC9A01) kit.
# Every numbered lab in this folder imports its pins from here instead of
# hardcoding them, so the whole kit only needs to be described in one place.
#
# This kit pairs two boards already used elsewhere in this repo:
#   - the GC9A01 round display, wired exactly like the confirmed-working
#     "pico" wiring in src/kits/max98357a-amp/config.py (SPI0, GPIO2-6)
#   - the HMC5883L compass, the same chip as src/kits/compass-hmc5883l, but
#     moved off I2C1 (GPIO10/11) onto I2C0 (GPIO12/13) because GPIO2/3 are
#     now spoken for by the display's SPI clock/data lines.

from machine import Pin, SPI
import gc9a01
import vga1_8x16 as FONT           # 8x16 - no built-in font on this driver
import vga1_bold_16x32 as BIG_FONT  # 16x32 - readable from across the room, 15 chars max

# ---------------------------------------------------------------------------
# GC9A01 round display (240x240, SPI0)
# ---------------------------------------------------------------------------
#   Module pin   Pico pin
#   ----------   --------
#   SCL / CLK    GP2
#   SDA / MOSI   GP3
#   DC           GP4
#   CS           GP5
#   RST          GP6
#   VCC          3V3
#   GND          GND
WIDTH = 240
HEIGHT = 240
SPI_ID = 0
SCK_PIN = 2
MOSI_PIN = 3
DC_PIN = 4
CS_PIN = 5
RES_PIN = 6
BAUDRATE = 60_000_000

# RGB565: five bits of red, six of green, five of blue.
BLACK = 0x0000
WHITE = 0xFFFF
RED = 0xF800
GREEN = 0x07E0
BLUE = 0x001F

# The geometry of a round screen: the driver addresses a 240x240 square,
# but only the circle inscribed in it is visible. Keep drawing inside
# SAFE_RADIUS - the last few pixels out toward RADIUS sit under the bezel.
CENTER_X = WIDTH // 2   # 120
CENTER_Y = HEIGHT // 2  # 120
RADIUS = WIDTH // 2     # 120 -- the physical edge of the glass
SAFE_RADIUS = 112


def init_display():
    """Start the SPI bus and the GC9A01. Returns the display object.

    There is no frame buffer on this driver - every drawing call goes
    straight to the glass, and there is no show() to call afterwards."""
    spi = SPI(SPI_ID, baudrate=BAUDRATE, sck=Pin(SCK_PIN), mosi=Pin(MOSI_PIN))
    return gc9a01.GC9A01(
        spi,
        dc=Pin(DC_PIN, Pin.OUT),
        cs=Pin(CS_PIN, Pin.OUT),
        reset=Pin(RES_PIN, Pin.OUT),
        rotation=0)


# ---------------------------------------------------------------------------
# HMC5883L compass (I2C0)
# ---------------------------------------------------------------------------
#   VCC  -> Pico 3.3V OUT
#   GND  -> Pico GND
#   SDA  -> GPIO12 (I2C0 SDA)
#   SCL  -> GPIO13 (I2C0 SCL)
I2C_SDA_PIN = 12
I2C_SCL_PIN = 13
I2C_BUS = 0
HMC5883L_ADDRESS = 0x1E  # 30 decimal, fixed on this chip

CONFIG_A = 0x00
CONFIG_B = 0x01
MODE = 0x02
DATA_START = 0x03

# GP25 is the onboard LED on a Raspberry Pi Pico. Lab 02 blinks it.
LED_PIN = 25
