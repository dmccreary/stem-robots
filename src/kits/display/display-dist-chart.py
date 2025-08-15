# Display Time of Flight Distance Chart On OLED Display

from machine import Pin
from utime import sleep
import ssd1306
import VL53L0X
from neopixel import NeoPixel

TOF_DATA_PIN = 26
TOF_CLOCK_PIN = 27

sda=machine.Pin(TOF_DATA_PIN) # row one on our standard Pico breadboard
scl=machine.Pin(TOF_CLOCK_PIN) # row two on our standard Pico breadboard
i2c=machine.I2C(1, sda=sda, scl=scl, freq=400000)

WIDTH = 128
HEIGHT = 64
SCK=Pin(2)
SDL=Pin(3)
# servo pins
RES = machine.Pin(13)
DC = machine.Pin(14)
CS = machine.Pin(15)

spi=machine.SPI(0,baudrate=100000,sck=SCK, mosi=SDL)
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

def turn_motor_on(pwm):
   pwm.duty_u16(POWER_LEVEL)

delay = .05

# time of flight calibration parameters
zero_dist = 35 # distance measure when an object is about 1/2 cm away
max_dist = 500 # the max distance we gooing to display
scale_factor = .15 # compress the vertical value to display how much will display on the chart

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)
tof.start()

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

# store how far down the X we are plotting
x = 0
def update_distance_chart(distance):
    global x
    print(distance)
    # put any values above 63
    if distance > 63:
        distance = 63
    oled.pixel(x, HEIGHT - int(distance) - 1, 1)
    # don't scroll until we get 61 samples
    if x > WIDTH - 3:
        oled.scroll(-1,0)
    else:
        x += 1
    oled.show()

mode = 0
# loop forever
def main():
    global valid_distance
    while True:
        distance = get_distance()
        update_distance_chart(distance)

# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard intrrupt
print('Running Collision Avoidence with Time-of-Flight Sensor Version 3.0')

try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    print('turning off time-of-flight sensor')
    tof.stop()
