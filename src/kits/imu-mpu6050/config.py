# Hardware configuration for the MPU6050 IMU kit.

from machine import Pin, SPI
import ssd1306

# ---------------------------------------------------------------------------
# OLED display (SPI0) - 2.42" SSD1306/SSD1309, same pins as compass-hmc5883l
# ---------------------------------------------------------------------------
WIDTH = 128
HEIGHT = 64

SCL_PIN = 2  # SPI clock
SDA_PIN = 3  # SPI MOSI
RES_PIN = 4
DC_PIN = 5
CS_PIN = 6

WHITE = 1
BLACK = 0
NO_FILL = 0
FILL = 1


def init_display():
    clock = Pin(SCL_PIN)
    data = Pin(SDA_PIN)
    res = Pin(RES_PIN)
    dc = Pin(DC_PIN)
    cs = Pin(CS_PIN)
    spi = SPI(0, sck=clock, mosi=data)
    return ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, dc, res, cs)


# ---------------------------------------------------------------------------
# MPU6050 sensor (I2C1)
# ---------------------------------------------------------------------------
# The RP2040's I2C1 hardware block fixes GPIO10 as SDA and GPIO11 as SCL -
# machine.I2C(1, ...) raises "bad SCL pin" if the roles are swapped.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1

# Aux I2C pass-through pins - usually unconnected on GY-521 breakouts
XDA_PIN = 12
XCL_PIN = 13

# Address select pin: low/floating = 0x68, high = 0x69
AD0_PIN = 14

# Interrupt output, only active once configured in the driver
INT_PIN = 15

# I2C addresses and identity register
MPU6050_ADDRESS_LOW = 0x68   # AD0 tied low (or floating with internal pull-down)
MPU6050_ADDRESS_HIGH = 0x69  # AD0 tied high
WHO_AM_I_REG = 0x75
WHO_AM_I_EXPECTED = 0x68     # MPU6050 always reports 0x68 here, regardless of AD0
