# Hardware Configuration File

This file defines all the hardware in a robot and the pin 
assignments of the motors, sensors, speakers, and displays.

Because most of our robots use the Cytron board, the
pins are standardized for most of our kits.

Using a configuration file has tradeoffs.  The pros
is that it allows you to change a single file when
you change the wiring in your robot.  All the
example programs that use the config file
 will be automatically updated.

 The disadvantage is that it makes your programs
 a little more abstract.  New users will take
 some time to learn how to see how the configuration
 file is used to map a variable to the underlying
 hardware pins.

 ## Sample Config File

 All of the hardware pins should be defined in this file.

```python
NUMBER_PIXELS = 2
NEOPIXEL_PIN = 18
SPEAKER_PIN = 22
```

!!! Note
    Make sure there are no spaces in front of the variable names.

 Now in your main code you must do the following:
 
 1. Ddd the ```import config``` (without the .py)
 2. place the string ```config.``` in front of each variable.

 ```python
 import config

  # Get the data from the config file
NUMBER_PIXELS = config.NUMBER_PIXELS
NEOPIXEL_PIN = config.NEOPIXEL_PIN
  ```

  By placing the ```config``` in front of the variable name, you
  tell the Python interpreter to read the variable from that file.

###  Standard NeoPixel Blink

```python
from machine import Pin
from time import sleep
from neopixel import NeoPixel

NUMBER_PIXELS = 8
NEOPIXEL_PIN = 15

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    strip[0] = (255,0,0) # red=255, green and blue are 0
    strip.write()        # send the data from RAM down the wire
    sleep(1)             # keep on 1/10 of a second
    strip[0] = (0,0,0)   # change the RAM back but don't resend the data
    strip.write()
    sleep(1)
```

### Blink Using Config  File