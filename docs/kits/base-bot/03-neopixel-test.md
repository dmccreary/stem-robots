# NeoPixel Blink Test

## Simple Blink Test

This program blinks the first pixel in a NeoPixel strip red.

```python
from machine import Pin
from utime import sleep
from neopixel import NeoPixel

NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2

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
```

## Color Blink

This will make the first pixel blink red and the second pixel blink green.

```python
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
    # turn the second pixel [1] green
    strip[1] = (0,10,0)
    # send data to the strip
    strip.write()
    # pause for 1/2 second
    sleep(.5)

    # turn both off for 1/2 second
    strip[0] = (0,0,0)
    strip[1] = (0,0,0)
    strip.write()
    sleep(.5)
```

## Color Wheel

Each pixel will slowly change color as they move around the color wheel.
The wheel function takes in a number from 0 to 255 and return the r,g and b
values as it walks around the color wheel.  See the [Moving Rainbow](https://dmccreary.github.io/moving-rainbow/lessons/05-color-wheel/) labs for details.

```python
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
```