from machine import Pin
from utime import sleep
from neopixel import NeoPixel
import config

NUMBER_PIXELS = config.NUMBER_NEOPIXELS
NEOPIXEL_PIN = config.NEOPIXEL_PIN
strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    strip[0] = (255,0,0)
    strip.write()
    sleep(.5)
    strip[0] = (0,0,0)
    strip.write()
    sleep(.5)