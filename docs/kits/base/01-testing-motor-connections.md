# Testing Motor Connections

## Activity Overview
Students will work with a MicroPython-controlled robot to understand motor control, PWM signals, and basic robotics programming.

## Learning Objectives
Students will be able to:

- Understand how PWM controls motor speed and direction
- Identify the purpose of each pin configuration
- Observe and document motor behavior
- Modify code parameters to change robot behavior

## Materials Needed
- MicroPython-compatible microcontroller (Raspberry Pi Pico recommended)

- Robot chassis with two motors
- Jumper wires
- Computer with MicroPython IDE

## Student Activities

### Activity 1: Code Analysis
- Read through the provided code and identify the four motor control pins

- Explain what the `POWER_LEVEL` constant controls
- Predict what the robot will do when the code runs

### Activity 2: Initial Testing

- Connect the motors according to the pin assignments
- Run the code and observe which wheels move in which directions
- Record observations for each motor test phase
- Note any motors that don't work as expected

### Activity 3: Pin Calibration

- If wheels move in unexpected directions, modify the pin assignments
- Test different pin combinations until all motors work correctly
- Document the correct pin configuration for your robot

### Activity 4: Parameter Modification

- Change the `POWER_LEVEL` value and observe speed differences
- Modify the sleep times to make movements faster or slower
- Test values between 0-65535 for power level

### Activity 5: Movement Programming

- Create new functions for specific movements (forward, backward, turn left, turn right)
- Replace the test loop with a sequence of actual robot movements
- Program the robot to move in a square pattern

## Assessment Questions

- What happens if you set `POWER_LEVEL` to 0?
- Why does the code use separate pins for forward and reverse?
- How would you modify the code to make the robot turn in place?

## Sample Code

```python
from machine import Pin, PWM
from utime import sleep

POWER_LEVEL = 65025

# change these numbers until you get the right wheel and direction
RIGHT_FORWARD_PIN = 9
RIGHT_REVERSE_PIN = 8
LEFT_FORWARD_PIN = 10
LEFT_REVERSE_PIN = 11

# setup all the PWM objects with a frequency of 50 Hz
right_forward = PWM(Pin(RIGHT_FORWARD_PIN), freq=50)
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN), freq=50)
left_forward = PWM(Pin(LEFT_FORWARD_PIN), freq=50)
left_reverse = PWM(Pin(LEFT_REVERSE_PIN), freq=50)

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

```