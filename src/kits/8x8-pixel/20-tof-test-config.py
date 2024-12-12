# Demo for Maker Pi RP2040 board

from machine import Pin,PWM
from time import sleep
import VL53L0X
import config

sda=machine.Pin(config.TOF_SDA_PIN) # row one on our standard Pico breadboard
scl=machine.Pin(config.TOF_SCL_PIN) # row two on our standard Pico breadboard
i2c=machine.I2C(config.TOF_I2C_BUS, sda=sda, scl=scl)
print("Device found at decimal", i2c.scan())

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)
sleep(.1)
tof.start()

while True:
    d = tof.read()
    print(d)
    sleep(0.1)