# Motor Direction Lab
# Cycles forward, stop, reverse stop
# Motor pins for the Cytron board are 8,9,10 and 11 and are stored in the config file

from utime import sleep
from machine import Pin, PWM
import config

MAX_POWER_LEVEL = 65025

RIGHT_FORWARD_PIN = config.MOTOR_RIGHT_FORWARD_PIN
RIGHT_REVERSE_PIN = config.MOTOR_RIGHT_REVERSE_PIN
LEFT_FORWARD_PIN = config.MOTOR_LEFT_FORWARD_PIN
LEFT_REVERSE_PIN = config.MOTOR_LEFT_REVERSE_PIN

# our PWM objects
PWM_FREQUENCY = 500
right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_forward.freq(PWM_FREQUENCY)

right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
right_reverse.freq(PWM_FREQUENCY)

left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_forward.freq(PWM_FREQUENCY)

left_reverse = PWM(Pin(LEFT_REVERSE_PIN))
left_reverse.freq(PWM_FREQUENCY)

# test on 1/2 max power
duty = MAX_POWER_LEVEL

def stop():
    right_forward.duty_u16(0)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(0)
    left_reverse.duty_u16(0)
    
while True:
    print("going forward")
    right_forward.duty_u16(duty)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(duty)
    left_reverse.duty_u16(0)
    sleep(2)
    stop()
    sleep(1)

    print("going reverse")
    right_forward.duty_u16(0)
    right_reverse.duty_u16(duty)
    left_forward.duty_u16(0)
    left_reverse.duty_u16(duty)
    sleep(2)
    stop()
    sleep(3)