# Simple demo of the VL53L0X distance sensor.
# Will print the sensed range/distance every second.
from time import sleep
from machine import Pin, I2C
from neopixel import NeoPixel
import VL53L0X

NUMBER_PIXELS = 64
LED_PIN = 6
strip = NeoPixel(Pin(LED_PIN), NUMBER_PIXELS)
# Initialize I2C bus and sensor.

sda=Pin(16) # row one on our standard Pico breadboard
scl=Pin(17) # row two on our standard Pico breadboard
i2c=I2C(0, sda=sda, scl=scl)
vl53 = VL53L0X.VL53L0X(i2c)
# vl53.measurement_timing_budget = 200000


# Optionally adjust the measurement timing budget to change speed and accuracy.
# See the example here for more details:
#   https://github.com/pololu/vl53l0x-arduino/blob/master/examples/Single/Single.ino
# For example a higher speed but less accurate timing budget of 20ms:
# vl53.measurement_timing_budget = 20000
# Or a slower but more accurate timing budget of 200ms:
# vl53.measurement_timing_budget = 200000
# The default timing budget is 33ms, a good compromise of speed and accuracy.

# Main loop will read the range and print it every second.
while True:
    dist = vl53.read() - 35
    if dist < 0:
        dist = 0
    if dist < 1200 and dist >= 0:
        print(dist)
    index = dist // 4
    if index >= 0 and index <= 64:
        for i in range(0, NUMBER_PIXELS):
            if i < index:
                strip[i] = (2,0,0)
            else:
                strip[i] = (0,0,1)
    strip.write()
    sleep(.05)
