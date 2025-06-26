from machine import Pin
from neopixel import NeoPixel

LED_PIN = 4
NUMBER_PIXELS = 8

pin = Pin(LED_PIN, Pin.OUT)   # set GPIO0 to output to drive NeoPixels
strip = NeoPixel(pin, NUMBER_PIXELS)   # create NeoPixel driver on GPIO0 for 8 pixels
strip[0] = (255, 255, 255) # set the first pixel to white
strip.write()              # write data to all pixels
