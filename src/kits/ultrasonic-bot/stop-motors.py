from machine import Pin, PWM
from time import sleep
import config

# lower right pins with USB on top
RIGHT_FORWARD_PIN = config.RIGHT_FORWARD_PIN
RIGHT_REVERSE_PIN = config.RIGHT_REVERSE_PIN
LEFT_FORWARD_PIN = config.LEFT_FORWARD_PIN
LEFT_REVERSE_PIN = config.LEFT_REVERSE_PIN

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

right_forward.duty_u16(0)
right_reverse.duty_u16(0)
left_forward.duty_u16(0)
left_reverse.duty_u16(0)