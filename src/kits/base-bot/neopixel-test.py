from machine import Pin
from utime import sleep
from neopixel import NeoPixel
import config

NEOPIXEL_PIN = config.NEOPIXEL_PIN
NUMBER_PIXELS = config.NUMBER_NEOPIXELS

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    # turn first red pixel on for 1/2 second
    strip[0] = (255,0,0)
    strip.write()
    sleep(.5)

    # turn off for 1/2 second
    strip[0] = (0,0,0)
    strip.write()
    sleep(.5)