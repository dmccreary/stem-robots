import machine
from neopixel import NeoPixel
from utime import sleep

NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2

strip = NeoPixel(machine.Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

def wheel(pos):
    # Input a value 0 to 255 to get a color value.
    # The colors are a transition r - g - b - back to r.
    if pos < 0 or pos > 255:
        return (0, 0, 0)
    if pos < 85:
        return (255 - pos * 3, pos * 3, 0)
    if pos < 170:
        pos -= 85
        return (0, 255 - pos * 3, pos * 3)
    pos -= 170
    return (pos * 3, 0, 255 - pos * 3)

counter = 0
while True:
    # set the color moduo 255
    # start of color wheel
    strip[0] = wheel(counter % 255)
    # 1/2 way around the wheel
    strip[1] = wheel((counter + 128) % 255)
    strip.write()
    sleep(.05)
    counter += 1
    # reset the counter
    if counter == 255:
        counter = 0