# Hardware configuration for the Cytron Maker Pi RP2040 (Pico W)
# Wifi Display Bot: motors, NeoPixels, speaker, and an SSD1306 SPI OLED
# display, controlled over the Pico W's wireless chip.
# Wi-Fi credentials live in secrets.py, not here - keep hardware pin
# assignments and network secrets in separate files.

from machine import Pin, SPI
import ssd1306

# ---------------------------------------------------------------------------
# Motor driver (H-bridge on GP8-GP11)
# ---------------------------------------------------------------------------
RIGHT_FORWARD_PIN = 9
RIGHT_REVERSE_PIN = 8
LEFT_FORWARD_PIN = 10
LEFT_REVERSE_PIN = 11
MOTOR_PWM_FREQUENCY = 1000
MAX_POWER_LEVEL = 65025

# ---------------------------------------------------------------------------
# NeoPixel LEDs
# ---------------------------------------------------------------------------
NEOPIXEL_PIN = 18
NUMBER_NEOPIXELS = 2

# ---------------------------------------------------------------------------
# Piezo speaker
# ---------------------------------------------------------------------------
SPEAKER_PIN = 22

# ---------------------------------------------------------------------------
# SSD1306 SPI OLED display
# ---------------------------------------------------------------------------
DISPLAY_WIDTH = 128
DISPLAY_HEIGHT = 64
SPI_BUS = 0
SPI_BAUDRATE = 100000
SCL_PIN = 2   # SPI clock
SDA_PIN = 3   # SPI MOSI
RES_PIN = 4
DC_PIN = 5
CS_PIN = 6


def init_display():
    clock = Pin(SCL_PIN)
    data = Pin(SDA_PIN)
    res = Pin(RES_PIN)
    dc = Pin(DC_PIN)
    cs = Pin(CS_PIN)
    spi = SPI(SPI_BUS, baudrate=SPI_BAUDRATE, sck=clock, mosi=data)
    return ssd1306.SSD1306_SPI(DISPLAY_WIDTH, DISPLAY_HEIGHT, spi, dc, res, cs)
