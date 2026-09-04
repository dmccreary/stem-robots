# Hardware configuration for the 9-DOF IMU + display kit: the same L3GD20
# gyro + LSM303DLHC accel/mag bench-test rig as the 9-dof-imu kit, plus a
# GC9B72 round SPI display so the live readings show on screen instead of
# only in the console. The board also carries a bonus BMP180 temp/pressure
# chip, printed "10 DOF" on its silkscreen - not used by these lessons.
# VCC -> Pico 3.3V OUT, GND -> Pico GND.
#
# Use machine.SoftI2C (bit-banged), not machine.I2C (the hardware
# peripheral): on this board/firmware, the hardware I2C0 block could scan
# and find all four chips but threw OSError EIO on every real read/write -
# SoftI2C performs the identical transactions over the same pins and pull-ups
# with no failures at any frequency tested (400Hz-100kHz), so this is a
# peripheral-driver quirk, not a wiring or pull-up problem. No external
# pull-up resistors are used or needed - the Pico's internal ones are enough.

I2C_SDA_PIN = 12 # Data on even pins
I2C_SCL_PIN = 13

# Interrupt / data-ready pins - wired up but not read by these lessons yet.
# Interrupt-driven reads are a stretch goal (see swarm-bot plan.md Phase 12).
# GYRO_INT_PIN = 11         # GINT (gyro interrupt)
# GYRO_DRDY_PIN = 12        # GRDY (gyro data-ready)
# ACCEL_MAG_INT1_PIN = 13   # LIN1 (accel/mag interrupt 1)
# ACCEL_MAG_INT2_PIN = 14   # LIN2 (accel/mag interrupt 2)
# ACCEL_MAG_DRDY_PIN = 15   # LRDY (accel/mag data-ready)

# I2C addresses - confirmed by 01-probe.py. Clone boards vary depending on
# how the SA0/SDO address-select pin is tied, so don't assume these without
# running the scan.
GYRO_I2C_ADDRESS = 0x6B         # L3GD20 / L3GD20H, SA0 pulled high
ACCEL_I2C_ADDRESS = 0x19        # LSM303DLHC accelerometer sub-device
MAG_I2C_ADDRESS = 0x1E          # LSM303DLHC magnetometer sub-device
BMP180_I2C_ADDRESS = 0x77       # bonus temp/pressure chip, not used by these lessons

# Gyro identity check (WHO_AM_I register, same address on many ST parts)
WHO_AM_I_REGISTER = 0x0F
GYRO_WHO_AM_I_L3GD20 = 0xD4
GYRO_WHO_AM_I_L3GD20H = 0xD7

# BMP180 identity check (chip-id register - always reads 0x55)
BMP180_CHIP_ID_REGISTER = 0xD0
BMP180_CHIP_ID = 0x55

# ---------------------------------------------------------------------------
# Display: GC9B72 2.1" 360x360 round SPI panel (sw-gc9b72 kit)
# ---------------------------------------------------------------------------
# Confirmed working on this kit's real hardware via display-hello-test.py.
# Wiring differs from the sw-gc9b72 kit in one place: BL goes straight to
# 3V3 here instead of a GPIO, so the backlight is always on and there is
# no software control of it (no set_backlight() - there's nothing to
# switch). Everything else shares no pins with the IMU wiring above (I2C0
# on GPIO0/1, interrupts on GPIO11-15), so both halves of this kit can be
# wired at once with no conflicts.
#
# The 10-pad breakout reads (left to right): GND VCC SDA SCL RST DC CS BL
# SDO TE. SDO (read-back) and TE (frame tearing sync) are not used by this
# driver and left unconnected.
#
#   Module pin   Pico pin   Wire color
#   ----------   --------   ----------
#   SCL / CLK    GP2        orange
#   SDA / MOSI   GP3        yellow
#   RST          GP4        green
#   DC           GP5        blue
#   CS           GP6        purple
#   BL           3V3        (always on, not GPIO-switched)
#   VCC          3V3
#   GND          GND
from machine import Pin, SPI
import gc9b72
from gc9b72 import color565
import vga1_8x16 as SMALL_FONT       # 8x16 - no built-in font on this driver
import vga1_bold_16x32 as BIG_FONT   # 16x32 - readable from across the room

DISPLAY_WIDTH = 360
DISPLAY_HEIGHT = 360
DISPLAY_SPI_ID = 0

DISPLAY_SCK_PIN = 2
DISPLAY_MOSI_PIN = 3
DISPLAY_RST_PIN = 4
DISPLAY_DC_PIN = 5
DISPLAY_CS_PIN = 6
# No DISPLAY_BL_PIN - BL is wired straight to 3V3 on this board, not a GPIO.

# THE NUMBER YOU ASK FOR IS ALMOST NEVER THE NUMBER YOU GET: the RP2040
# derives its SPI clock by dividing the peripheral clock and MicroPython
# rounds DOWN to the nearest rate it can actually hit. On a Pico running
# MicroPython 1.28 the only rungs near the top are 8, 12 and 24 MHz --
# asking for, say, 20_000_000 quietly hands you 12_000_000. 24 MHz is
# confirmed working on the sw-gc9b72 kit's 20cm ribbon cables with no
# speckling or tearing; step down to 12_000_000 if your wiring is longer
# or messier and you see torn/speckled frames.
DISPLAY_BAUDRATE = 24_000_000

# RGB565: five bits of red, six of green, five of blue.
BLACK = 0x0000
WHITE = 0xFFFF
RED = 0xF800
GREEN = 0x07E0
BLUE = 0x001F
YELLOW = 0xFFE0
CYAN = 0x07FF
MAGENTA = 0xF81F

# The geometry of a round screen: the driver addresses a 360x360 square,
# but only the circle inscribed in it is visible. SAFE_RADIUS is an
# estimate carried over from the sw-gc9b72 kit, not yet measured against
# this specific panel -- nudge it in or out if text crowds the bezel.
DISPLAY_CENTER_X = DISPLAY_WIDTH // 2   # 180
DISPLAY_CENTER_Y = DISPLAY_HEIGHT // 2  # 180
DISPLAY_SAFE_RADIUS = 168

def init_display():
    """Start the SPI bus and the GC9B72. Returns the display object.

    There is no frame buffer on this driver - every drawing call goes
    straight to the glass, and there is no show() to call afterwards.
    No backlight Pin is passed - BL is wired straight to 3V3 on this
    board, so there's nothing for software to switch."""
    spi = SPI(DISPLAY_SPI_ID, baudrate=DISPLAY_BAUDRATE,
              sck=Pin(DISPLAY_SCK_PIN), mosi=Pin(DISPLAY_MOSI_PIN))
    return gc9b72.GC9B72(
        spi,
        dc=Pin(DISPLAY_DC_PIN, Pin.OUT),
        cs=Pin(DISPLAY_CS_PIN, Pin.OUT),
        reset=Pin(DISPLAY_RST_PIN, Pin.OUT),
        rotation=0)

