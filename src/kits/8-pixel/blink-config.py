# NeoPixel blink with parameters coming from the config.py file
from machine import Pin
from time import sleep
from neopixel import NeoPixel
import config

# Get the data from the config file
NUMBER_PIXELS = config.NUMBER_PIXELS
NEOPIXEL_PIN = config.NEOPIXEL_PIN

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    strip[0] = (255,0,0) # red=255, green and blue are 0
    strip.write()        # send the data from RAM down the wire to the NeoPixel Strpi
    sleep(1)             # keep on 1 second
    strip[0] = (0,0,0)   # change the RAM back to zero but don't resend the data
    strip.write()        # write the buffer to the LED strip
    sleep(1)             # wait 1 second