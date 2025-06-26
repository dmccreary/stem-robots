from machine import Pin
from utime import sleep
from neopixel import NeoPixel

NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    # turn first [0] pixel red on for 1/2 second
    # use a red brightness of 10 out of 255 (r, g, b)
    strip[0] = (10,0,0)
    # send data to the strip
    strip.write()
    # pause for 1/2 second
    sleep(.5)

    # turn off for 1/2 second
    strip[0] = (0,0,0)
    strip.write()
    sleep(.5)