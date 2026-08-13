from machine import Pin, PWM
from utime import sleep
import config

POWER_LEVEL = 65025

# change these numbers until you get the right wheel and direction
RIGHT_FORWARD_PIN = config.RIGHT_FORWARD_PIN
RIGHT_REVERSE_PIN = config.RIGHT_REVERSE_PIN
LEFT_FORWARD_PIN = config.LEFT_FORWARD_PIN
LEFT_REVERSE_PIN = config.LEFT_REVERSE_PIN

# setup all the PWM objects with a frequency of 50 Hz
right_forward = PWM(Pin(RIGHT_FORWARD_PIN), freq=config.MOTOR_PWM_FREQUENCY)
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN), freq=config.MOTOR_PWM_FREQUENCY)
left_forward = PWM(Pin(LEFT_FORWARD_PIN), freq=config.MOTOR_PWM_FREQUENCY)
left_reverse = PWM(Pin(LEFT_REVERSE_PIN), freq=config.MOTOR_PWM_FREQUENCY)

def spin_wheel(pwm):
    pwm.duty_u16(POWER_LEVEL)
    # keep motor on for 3 seconds
    sleep(3)
    pwm.duty_u16(0)
    # turn motor off for two seconds
    sleep(2)

# the orientation is looking down from the back of the robot
while True:
    print('right forward')
    spin_wheel(right_forward)

    print('right reverse')
    spin_wheel(right_reverse)

    print('left foward')
    spin_wheel(left_forward)

    print('left_reverse')
    spin_wheel(left_reverse)