# Check the button before any sound code exists.
# This script creates no PWM object at all. If the button behaves here but
# the jukebox misbehaves later, the fault is in the audio wiring, not the
# button. Idle should print 1, pressing should print 0.

from machine import Pin
import time
import config

button = Pin(config.BUTTON_PIN, Pin.IN, Pin.PULL_UP)

print("Watching GP{}. Idle = 1, pressed = 0.".format(config.BUTTON_PIN))
print("Ctrl-C to stop.")

last = None
try:
    while True:
        value = button.value()
        if value != last:
            print("GP{} = {}".format(config.BUTTON_PIN, value))
            last = value
        time.sleep_ms(config.DEBOUNCE_MS)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
