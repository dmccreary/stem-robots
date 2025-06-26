# Demo for Maker Pi RP2040 board

from machine import Pin, PWM, I2C
import time
import VL53L0X
I2C_SDA_PIN = 16
I2C_SCL_PIN = 17
I2C_BUS = 0

sda=Pin(I2C_SDA_PIN) # row one on our standard Pico breadboard
scl=Pin(I2C_SCL_PIN) # row two on our standard Pico breadboard
i2c=I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)
print("Device found at decimal", i2c.scan())


delay = .05

# calibration parameters
zero_dist = 65 # distance measure when an object is about 1/2 cm away
max_dist = 350 # max distance we are able to read
scale_factor = .2

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

# get the normalized time-of-flight distance
def get_distance():
    global zero_dist, scale_factor
    tof_distance = tof.read()
    if tof_distance > max_dist:
        return tof_distance
    # if our current time-of-flight distance is lower than our zero distance then reset the zero distance
    if tof_distance < zero_dist:
        zero_dist = tof_distance
    return  int((tof_distance - zero_dist) * scale_factor)


# start our time-of-flight sensor
tof.start()

# just get the raw number
while True:
    print(tof.read())