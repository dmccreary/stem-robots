# Demo for Maker Pi RP2040 board

from machine import Pin, PWM
from time import sleep, sleep_ms
# for picking a random direction to turn
from urandom import randint
from neopixel import NeoPixel
import VL53L0X

# Piezo Buzzer is on GP22
buzzer=PWM(Pin(22))

# this is the max power level
MAX_POWER_LEVEL = 65025
DEMO_POWER_LEVEL = MAX_POWER_LEVEL // 2

# Motor Pins are A: 8,9 and B: 10,11
RIGHT_FORWARD_PIN = 9
RIGHT_REVERSE_PIN = 8
LEFT_FORWARD_PIN = 10
LEFT_REVERSE_PIN = 11

# our PWM objects
right_forward = PWM(Pin(RIGHT_FORWARD_PIN), freq=50)
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN), freq=50)
left_forward = PWM(Pin(LEFT_FORWARD_PIN), freq=50)
left_reverse = PWM(Pin(LEFT_REVERSE_PIN), freq=50)

NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

def turn_motor_on(pwm):
   pwm.duty_u16(DEMO_POWER_LEVEL)

def turn_motor_off(pwm):
   pwm.duty_u16(0)

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

# Time of flight sensor is on the I2C bus on Grove connector 0
sda=machine.Pin(16) # row one on our standard Pico breadboard
scl=machine.Pin(17) # row two on our standard Pico breadboard
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)
print("Device found at decimal", i2c.scan())

delay = .05

# calibration parameters
zero_dist = 65 # distance measure when an object is about 1/2 cm away
max_dist = 350 # max distance we are able to read
scale_factor = .2

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

def setLights(color):
    if color == 'red':
        strip[0] = (10,0,0)
        strip[1] = (10,0,0)
    elif color == 'green':
        strip[0] = (0,10,0)
        strip[1] = (0,10,0)
    elif color == 'purple':
        strip[0] = (10,0,10)
        strip[1] = (10,0,10)
    else:
        strip[0] = (0,0,10)
        strip[1] = (0,0,10)
    strip.write()

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

def playtone(frequency):
    buzzer.duty_u16(1000)
    buzzer.freq(frequency)

def bequiet():
    buzzer.duty_u16(0)

def play_no_signal():
    playtone(100)
    time.sleep(0.1)
    bequiet()

def play_turn():
    playtone(500)
    sleep(0.1)
    bequiet()

# start our time-of-flight sensor
tof.start()
valid_distance = 1

# loop forever
def main():
    global valid_distance
    while True:  
        distance = get_distance()
        if distance > 1000:
            # only print if we used to have a valid distance
            if valid_distance == 1:
                print('no signal')
                setLights('purple')
            valid_distance = 0
        else:
            print(distance)
            if distance < 30:
                play_turn()
                # back up for 1/2 second
                reverse()
                sleep(0.5)
                if randint(0,1):
                    print('turning right')
                    turn_right()
                    setLights('red')
                else:
                    print('turning left')
                    turn_left()
                    setLights('green')
                sleep(0.75)
                forward()
            else:
                print('forward')
                setLights('blue')
                forward()
            valid_distance = 1
        sleep(0.05)

# clean up


# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard intrrup
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('turning off sound')
    buzzer.duty_u16(0)
    print('powering down all motors')
    stop()
    print('stopping time of flight sensor')
    tof.stop()