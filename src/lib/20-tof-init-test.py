# Demo for Maker Pi RP2040 board
# turn on the Thonny plotter to see the distance data in a plot
from machine import Pin, PWM, I2C
import time
import VL53L0X

sda=Pin(16) # row one on our standard Pico breadboard
scl=Pin(17) # row two on our standard Pico breadboard
i2c=I2C(0, sda=sda, scl=scl)
print("Device found at decimal", i2c.scan())

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)
# tof.start()

while True:
    d = tof.read()
    if d < 1200:
        print(d)
    time.sleep(0.1)