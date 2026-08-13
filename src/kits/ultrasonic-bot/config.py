# Hardware configuration for the Cytron Maker Pi RP2040
# Ultrasonic Bot: motors, an HC-SR04 ultrasonic distance sensor, and an
# SSD1306 SPI OLED display.
#
# NOTE: main.py, stop-motors.py and test-drive-all.py previously disagreed
# with each other about which GPIO pins drive the motors, and
# display-logo-ping.py used a different trigger/echo pair than main.py. The
# values below match main.py and the 11-ping-lab documentation page, which
# are treated as the canonical wiring for this kit.

from machine import Pin, SPI
import ssd1306

# ---------------------------------------------------------------------------
# Motor driver (H-bridge on GP18-GP21)
# ---------------------------------------------------------------------------
RIGHT_FORWARD_PIN = 19
RIGHT_REVERSE_PIN = 21
LEFT_FORWARD_PIN = 18
LEFT_REVERSE_PIN = 20
MAX_POWER_LEVEL = 65025

# ---------------------------------------------------------------------------
# HC-SR04 ultrasonic distance sensor
# ---------------------------------------------------------------------------
TRIGGER_PIN = 16
ECHO_PIN = 17

# ---------------------------------------------------------------------------
# SSD1306 SPI OLED display
# ---------------------------------------------------------------------------
DISPLAY_WIDTH = 128
DISPLAY_HEIGHT = 64
SPI_BUS = 0
SPI_BAUDRATE = 100000
SCL_PIN = 2   # SPI clock
SDA_PIN = 3   # SPI MOSI
RES_PIN = 5
DC_PIN = 4
CS_PIN = 1


def init_display():
    clock = Pin(SCL_PIN)
    data = Pin(SDA_PIN)
    res = Pin(RES_PIN)
    dc = Pin(DC_PIN)
    cs = Pin(CS_PIN)
    spi = SPI(SPI_BUS, baudrate=SPI_BAUDRATE, sck=clock, mosi=data)
    return ssd1306.SSD1306_SPI(DISPLAY_WIDTH, DISPLAY_HEIGHT, spi, dc, res, cs)
