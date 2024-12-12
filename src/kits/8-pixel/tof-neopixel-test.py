# Demo for Maker Pi RP2040 board using the VL32L0X time of flight distance sensor
# Note the driver I used came from here: https://github.com/CoderDojoTC/micropython/blob/main/src/drivers/VL53L0X.py
# Perhaps derived from here: https://github.com/uceeatz/VL53L0X/blob/master/VL53L0X.py

# This demo makes a strip of 8 NeoPixels show the distance

from machine import Pin
from time import sleep
import VL53L0X
from neopixel import NeoPixel

LED_PIN = 4
NUMBER_PIXELS = 8
neopixel_pin = Pin(LED_PIN, Pin.OUT)   # set GPIO0 to output to drive NeoPixels
strip = NeoPixel(neopixel_pin, NUMBER_PIXELS)   # create NeoPixel driver on GPIO0 for 8 pixels

# pick 8 numbers on a non-linear scale
dist_scale = [2, 6, 10, 20, 30, 50, 80, 110, 130]

# I2C Setup
DATA_PIN = 0
CLOCK_PIN = 1
sda=machine.Pin(DATA_PIN)
scl=machine.Pin(CLOCK_PIN)
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)

delay = .05

# initial calibration parameters
ZERO_DIST_INITIAL = 50
zero_dist_dynamic = ZERO_DIST_INITIAL
MAX_DIST = 1200 # max raw distance we are able to read
SCALE_DIST = .3 # multiplier for raw to calibrated distance

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

# get the normalized time-of-flight distance
def convert_to_calibrated_distance(raw_tof_distance):
    global zero_dist_dynamic, scale_factor
    
    calibrated_dist_1 = raw_tof_distance - zero_dist_dynamic
    # if we get a negative value, then we need to recalibrate
    if calibrated_dist_1 < 0:
        zero_dist_dynamic -= 1
    
    # nothing too high
    if calibrated_dist_1 > MAX_DIST:
        return MAX_DIST
    
    calibrated_dist_2 = calibrated_dist_1 * SCALE_DIST
    
    # if our current time-of-flight distance is lower than our zero distance then reset the zero distance
    
    # fix negative reading
    if calibrated_dist_2 < 0:
        calibrated_dist_2 = 0
    return  int(calibrated_dist_2)

# use the dist_scale to turn on LEDs
def neopixel_show_dist(in_distance):
    global NUMBER_PIXELS
    for i in range(0, NUMBER_PIXELS-1):
        if in_distance > dist_scale[i]:
            strip[i] = (0, 0, 255)
        else:
            strip[i] = (0, 0, 0)
        strip.write()

# test
test_delay = .05
def test_pixels():
    for i in range(0, NUMBER_PIXELS - 1):
        strip[i] = (255, 0, 0)
        strip.write()
        sleep(test_delay)

    for i in range(0, NUMBER_PIXELS - 1):
        strip[i] = (0, 255, 0)
        strip.write()
        sleep(test_delay)

    for i in range(0, NUMBER_PIXELS - 1):
        strip[i] = (0, 0, 255)
        strip.write()
        sleep(test_delay)
    
# start our time-of-flight sensor
tof.start()
# autocalibrate the minimum distance
min_distance = 1000
test_pixels()

# loop forever
while True:
    raw_distance = tof.read()
    calibrated_distance = convert_to_calibrated_distance(raw_distance)
    print(raw_distance, calibrated_distance)
    neopixel_show_dist(calibrated_distance)
    sleep(0.05)

# clean up
tof.stop()