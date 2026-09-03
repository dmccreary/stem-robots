# Lab 02: Blink the Onboard LED
# Confirms code can run on the board with no wiring at all - no
# breadboard, no display, no compass. GP25 is the onboard LED on a bare
# Raspberry Pi Pico.

from machine import Pin
import time
import config

led = Pin(config.LED_PIN, Pin.OUT)

try:
    while True:
        led.toggle()    # switches it on if off, or off if on
        time.sleep(0.5)  # wait half a second (half a full blink cycle)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
