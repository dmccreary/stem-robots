from machine import Pin
import time
import config

# Isolates the button from the I2S/amp code entirely - no machine.I2S
# object is created here. If pressing the button still causes a reset or
# USB disconnect with this script running, the cause is the button's
# wiring (short or overvoltage into BUTTON_PIN), not the audio code.
BUTTON_PIN = config.BUTTON_PIN
button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

print("Watching GPIO{}. Idle should read 1, pressed should read 0.".format(BUTTON_PIN))
print("Ctrl-C to stop.")

last = None
try:
    while True:
        v = button.value()
        if v != last:
            print("GPIO{} = {}".format(BUTTON_PIN, v))
            last = v
        time.sleep_ms(20)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
