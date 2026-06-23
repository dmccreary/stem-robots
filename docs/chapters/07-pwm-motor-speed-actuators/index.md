---
title: PWM, Motor Speed Control, and Actuators
description: Master Pulse Width Modulation (PWM) and apply it to control motor speed, differential drive turning, servo angle, piezo buzzer tones, and event-driven GPIO interrupts — unlocking smooth, programmable robot motion.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 14:30:00
version: 0.08
---

# PWM, Motor Speed Control, and Actuators

!!! mascot-welcome "Welcome, maker — let's make me roll!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    We've assembled the hardware, learned the language, and understood the electronics. Now it's time for the payoff: writing code that actually makes the wheels spin. By the end of this chapter, you'll control motor speed, make precise turns, sweep a servo, and play tones on the buzzer. Let's make it roll!

## Summary

This chapter unlocks smooth, programmable motion. Students master Pulse Width
Modulation — from duty cycle and frequency fundamentals through 16-bit values — and
apply it to control motor speed, achieve differential drive (turning by varying
wheel speeds), calibrate servo angles, and generate musical tones with the piezo
buzzer. The chapter closes with GPIO interrupts and button debouncing, enabling
event-driven robot responses.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Pulse Width Modulation
2. PWM Duty Cycle
3. PWM Frequency
4. 16-Bit Duty Cycle Values
5. Motor Speed Control
6. PWM Motor Control Code
7. Left Motor Control
8. Right Motor Control
9. Differential Drive
10. Servo Motor
11. Servo Angle Range
12. Servo PWM Calibration
13. Servo Sweep Code
14. Linear Range Mapping
15. Piezo Buzzer
16. Tone Frequency Control
17. Sound Feedback
18. GPIO Interrupt Setup
19. IRQ Falling Edge
20. Button Debouncing

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)
- [Chapter 6: Electronics, DC Motors, and Communication Protocols](../06-electronics-motors-protocols/index.md)

---

## Pulse Width Modulation

In Chapter 6 you learned that a GPIO pin is either HIGH (3.3 V) or LOW (0 V). That is digital — two states. But motor speed is not digital. You want to drive at 25%, 50%, 75%, or any percentage in between. How do you get a variable output from a digital pin?

The answer is **Pulse Width Modulation**, or **PWM**. PWM rapidly switches a pin between HIGH and LOW many times per second. Instead of changing the voltage level, it changes the *proportion of time* the pin is HIGH. That proportion is the **duty cycle**.

### PWM Duty Cycle

The **duty cycle** is the percentage of each cycle that the signal is HIGH. If a signal is HIGH for half the cycle and LOW for half the cycle, the duty cycle is 50%. A 25% duty cycle is HIGH for one quarter of the cycle.

The average voltage delivered is proportional to the duty cycle. A 50% duty cycle on a 6 V motor supply delivers an average of 3 V to the motor. The motor's mechanical inertia smooths out the rapid switching, so it spins at approximately half speed.

Before the interactive diagram below, here are the three duty cycle values to keep in mind: 0% means always off (motor stopped), 100% means always on (full speed), and any value between controls speed proportionally.

#### Diagram: PWM Duty Cycle Explorer

<details markdown="1">
<summary>Interactive MicroSim showing PWM waveforms and average voltage</summary>
Type: MicroSim
**sim-id:** pwm-duty-cycle-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas split into two sections:

Top section (60% height): PWM waveform display.
- Draw a square wave showing HIGH (3.3V) and LOW (0V) pulses.
- An orange horizontal dashed line shows the "average voltage" level.
- The waveform updates in real time as the duty cycle changes.
- Label the HIGH time (Ton) and LOW time (Toff) with arrows.

Bottom section (40% height): Controls and stats.
- A large horizontal slider "Duty Cycle" from 0% to 100%.
- Numeric display: "Duty Cycle: 50%", "Average Voltage: 1.65 V", "Motor Speed: ~50%".
- A small animated motor icon (spinning circle) whose rotation speed is proportional to the duty cycle.

Learning objective (Bloom's Taxonomy — Understanding): students connect duty cycle percentage to average voltage and motor speed.

Responsive: redraw on window resize.
</details>

### PWM Frequency

The **PWM frequency** is how many times per second the signal completes one full HIGH-LOW cycle. Motor control typically uses 50–1000 Hz. At 50 Hz, the signal switches 50 times per second. At 1000 Hz, it switches 1000 times per second.

Higher frequencies feel smoother to the motor but require more processing. Lower frequencies can cause audible buzzing from the motor coils. For the DC motors on this robot, 50 Hz works reliably.

### 16-Bit Duty Cycle Values

MicroPython's PWM objects accept duty cycle as a 16-bit integer (0 to 65535), not a percentage. This gives finer control than 0–100 integers.

The conversion is simple. Before the code, here is the math: multiply the desired percentage (0.0 to 1.0) by 65535. So 50% is `0.5 * 65535 = 32767`. Full speed is 65535. Stopped is 0.

| Percent | 16-bit value |
|---------|-------------|
| 0% (off) | 0 |
| 25% | 16383 |
| 50% | 32767 |
| 75% | 49151 |
| 100% (full) | 65535 |

---

## Motor Speed Control

Now let's wire PWM to the motors. In MicroPython, the `machine.PWM` class controls PWM output on any GPIO pin. Before the code, here is what the parameters mean: `Pin(pin_number)` selects the GPIO pin, and `freq=50` sets 50 Hz.

```python
from machine import PWM, Pin
import config

# Set up PWM for the right motor forward pin
right_fwd = PWM(Pin(config.RIGHT_FORWARD_PIN))
right_fwd.freq(50)   # 50 Hz motor frequency
```

To set a speed, call `duty_u16()` with a value from 0 to 65535:

```python
right_fwd.duty_u16(32767)    # 50% speed
right_fwd.duty_u16(65535)    # full speed
right_fwd.duty_u16(0)        # stop
```

### PWM Motor Control Code

A complete motor setup uses one PWM object per direction wire. Each DC motor has two direction wires: forward and reverse. To drive forward, we set the forward PWM to our desired speed and the reverse PWM to 0 (off). To drive in reverse, we swap them.

```python
from machine import PWM, Pin
from time import sleep
import config

# Create PWM objects for both motor direction pins
right_fwd = PWM(Pin(config.RIGHT_FORWARD_PIN), freq=50)
right_rev = PWM(Pin(config.RIGHT_REVERSE_PIN), freq=50)
left_fwd  = PWM(Pin(config.LEFT_FORWARD_PIN),  freq=50)
left_rev  = PWM(Pin(config.LEFT_REVERSE_PIN),  freq=50)

def set_speed(pwm_fwd, pwm_rev, speed):
    """Set motor speed. Positive = forward, negative = reverse, 0 = stop.
    speed is -65535 to 65535.
    """
    if speed > 0:
        pwm_fwd.duty_u16(speed)
        pwm_rev.duty_u16(0)
    elif speed < 0:
        pwm_fwd.duty_u16(0)
        pwm_rev.duty_u16(-speed)
    else:
        pwm_fwd.duty_u16(0)
        pwm_rev.duty_u16(0)
```

### Left Motor Control and Right Motor Control

Each wheel has its own motor and its own pair of PWM pins. **Left motor control** and **right motor control** work identically — they just use different pin numbers from `config.py`.

The `set_speed()` function above works for both motors. Call it twice — once for left, once for right:

```python
FULL = 65535
HALF = 32767

# Drive forward at 50% speed
set_speed(right_fwd, right_rev, HALF)
set_speed(left_fwd,  left_rev,  HALF)
sleep(2)

# Stop
set_speed(right_fwd, right_rev, 0)
set_speed(left_fwd,  left_rev,  0)
```

!!! mascot-tip "Always stop both motors together"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Call `set_speed(..., 0)` on both motors in your `finally` block (see Chapter 4). If your program crashes while one motor is running and the other is stopped, the robot will spin in circles until the battery dies. Stopping both motors in `finally` prevents this.

---

## Differential Drive — Turning by Varying Speed

A two-wheeled robot turns by running the two wheels at different speeds. This is called **differential drive**. No steering wheel is needed.

Before the concept diagram, here is the idea: if both wheels run at the same speed, the robot goes straight. If the right wheel runs faster than the left, the robot turns left (pivoting around the slower wheel). If the left runs faster, the robot turns right.

Three common maneuvers:

- **Gradual left turn:** right wheel at full, left wheel at half.
- **Spin left in place:** right wheel forward, left wheel backward at the same speed.
- **Spin right in place:** left wheel forward, right wheel backward at the same speed.

```python
def spin_left(speed=32767):
    """Spin in place to the left."""
    set_speed(right_fwd, right_rev, speed)    # right wheel forward
    set_speed(left_fwd,  left_rev,  -speed)   # left wheel backward

def turn_gradual_left(speed=32767):
    """Gentle left curve — right faster, left slower."""
    set_speed(right_fwd, right_rev, speed)
    set_speed(left_fwd,  left_rev,  speed // 2)
```

#### Diagram: Differential Drive Turn Simulator

<details markdown="1">
<summary>Interactive MicroSim showing robot turn behavior for different wheel speed ratios</summary>
Type: MicroSim
**sim-id:** differential-drive-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 450 canvas. Show a top-down view of the robot (a rectangle with L and R labels for left and right wheels).

Two vertical sliders on the left panel:
- "Left wheel speed" from -100% to +100%
- "Right wheel speed" from -100% to +100%

The robot animates in the top-down view, turning and moving based on the differential of the two speeds. Use simple Euler integration to update position and heading each frame. Show the robot's path as a fading trail of dots.

Preset buttons below the sliders: "Forward", "Backward", "Spin Left", "Spin Right", "Gradual Left", "Gradual Right". Each sets the sliders to the correct values and starts the animation.

A "Reset position" button returns the robot to center.

Learning objective (Bloom's Taxonomy — Applying): students predict and verify robot motion from left/right speed ratios.

Responsive: redraw on window resize.
</details>

---

## Servo Motors

A **servo motor** is a different kind of actuator from a DC motor. Instead of spinning continuously, a servo rotates to a specific **angle** — anywhere from 0° to 180° in a standard servo. Servos are used for steering, sensor sweeping, and gripper arms.

Servos are also controlled by PWM, but the duty cycle means something different than it does for DC motors. For a servo:

- A pulse width of **1 ms** (at 50 Hz) corresponds to approximately **0°**.
- A pulse width of **1.5 ms** corresponds to approximately **90°** (center).
- A pulse width of **2 ms** corresponds to approximately **180°**.

### Servo Angle Range

The **servo angle range** (0°–180°) maps to PWM pulse widths (1–2 ms). Since we specify duty cycle as a 16-bit number (0–65535) for a 50 Hz signal (period = 20 ms):

- 1 ms pulse = 1/20 = 5% duty cycle = `0.05 * 65535 ≈ 3276`
- 2 ms pulse = 2/20 = 10% duty cycle = `0.10 * 65535 ≈ 6553`

### Servo PWM Calibration

**Servo PWM calibration** means finding the exact duty cycle values for 0° and 180° on your specific servo. Manufacturers allow some variation, so the actual 0° position might be at 3000 or 3500 duty cycle units, not exactly 3276. Calibrate by setting a value, observing the actual angle, and adjusting until it matches.

### Linear Range Mapping

**Linear range mapping** is a formula to convert an angle (0–180) to a duty cycle value (min_duty to max_duty). Before the code, here is the math: we scale the input angle proportionally across the output duty cycle range.

```python
def angle_to_duty(angle, min_duty=3276, max_duty=6553):
    """Convert servo angle (0-180) to 16-bit duty cycle value."""
    return int(min_duty + (angle / 180) * (max_duty - min_duty))
```

### Servo Sweep Code

A **servo sweep** moves the servo from 0° to 180° and back in a smooth loop. The `range()` function generates the angle sequence:

```python
from machine import PWM, Pin
from time import sleep
import config

servo = PWM(Pin(config.SERVO_PIN), freq=50)

def set_angle(angle):
    duty = angle_to_duty(angle)
    servo.duty_u16(duty)

# Sweep from 0 to 180 and back
try:
    while True:
        for angle in range(0, 181, 5):     # 0° to 180° in 5° steps
            set_angle(angle)
            sleep(0.02)
        for angle in range(180, -1, -5):   # 180° back to 0°
            set_angle(angle)
            sleep(0.02)

except KeyboardInterrupt:
    pass

finally:
    servo.deinit()
```

The `sleep(0.02)` gives the servo time to physically move to each position before the next command arrives.

---

## Piezo Buzzer — Sound Feedback

A **piezo buzzer** is a simple device that vibrates when AC voltage is applied. PWM produces AC-like rapid switching, which makes the piezo element vibrate at the PWM frequency. That vibration moves air and produces sound.

The pitch of the tone is determined by the PWM frequency: higher frequency → higher pitch. Standard musical notes correspond to specific frequencies (e.g., middle C = 262 Hz, A4 = 440 Hz).

### Tone Frequency Control

To play a tone, set the buzzer pin's PWM frequency to the desired pitch, then set the duty cycle to 50% (equal on/off time produces the loudest tone):

```python
from machine import PWM, Pin
from time import sleep
import config

buzzer = PWM(Pin(config.BUZZER_PIN))

def play_tone(frequency, duration):
    """Play a tone at the given frequency (Hz) for duration seconds."""
    buzzer.freq(frequency)
    buzzer.duty_u16(32767)   # 50% duty cycle for maximum volume
    sleep(duration)
    buzzer.duty_u16(0)       # silence between notes

# Play a simple startup melody
play_tone(440, 0.2)    # A4
play_tone(523, 0.2)    # C5
play_tone(659, 0.3)    # E5
```

### Sound Feedback

**Sound feedback** is a useful user experience pattern — play a tone when the robot starts up, when it detects an obstacle, or when a button is pressed. It communicates state without requiring the student to watch the OLED display.

A short high-pitched beep for detection, a low-pitched buzz for a warning, and a rising melody for success are easy to implement and significantly improve the robot's expressiveness.

!!! mascot-thinking "Sound is output too"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Sensors are inputs. Motors and displays are outputs. The buzzer is also an output — but an audio one. In computational thinking terms, the buzzer is an actuator just like a motor. It converts an electrical signal (PWM) into a physical effect (sound waves). Keep that input/output mental model in mind as you add features.

---

## GPIO Interrupts and Button Debouncing

So far, you've checked sensors inside a `while True` loop. This is called **polling** — you ask "has anything changed?" on every iteration. Polling works fine for slow sensors, but for fast events like button presses, there's a better approach: **interrupts**.

### GPIO Interrupt Setup

A **GPIO interrupt** tells the microcontroller to automatically call a function the moment a pin changes state — without waiting for the main loop to get to it. You **attach** (register) the interrupt by calling `irq()` on a Pin object.

Before the code, here is what the parameters mean: `trigger` specifies which signal edge triggers the interrupt, and `handler` specifies the function to call.

```python
from machine import Pin

button = Pin(20, Pin.IN, Pin.PULL_UP)

def button_pressed(pin):
    print("Button pressed!")

button.irq(trigger=Pin.IRQ_FALLING, handler=button_pressed)
```

### IRQ Falling Edge

The **IRQ falling edge** trigger fires when the pin changes from HIGH to LOW. With an active-low button (pressed = LOW, because of the pull-up resistor), this is exactly when the button is pressed.

Why FALLING? The button pin is connected to 3.3 V through a **pull-up resistor** — an internal resistor that holds the pin HIGH when nothing is pressing it. When you press the button, it connects the pin to ground (0 V), pulling it LOW. That transition from HIGH to LOW is the falling edge.

`Pin.IRQ_RISING` fires when the pin goes from LOW to HIGH — i.e., when the button is released.

### Button Debouncing

Physical buttons don't switch cleanly. When you press a button, the metal contacts bounce — making and breaking contact 5–50 times in just a few milliseconds. Without handling this, your interrupt fires 10–20 times per press instead of once.

**Debouncing** is the technique of ignoring the extra bounces. The simplest approach for robot code is to record the time of the last interrupt and ignore any new interrupt that arrives within 50–200 ms:

```python
from machine import Pin
from time import ticks_ms, ticks_diff

button = Pin(20, Pin.IN, Pin.PULL_UP)
last_press_time = 0

def button_pressed(pin):
    global last_press_time
    now = ticks_ms()
    if ticks_diff(now, last_press_time) > 150:    # 150 ms debounce
        last_press_time = now
        print("Button press registered!")

button.irq(trigger=Pin.IRQ_FALLING, handler=button_pressed)
```

The `ticks_diff()` function handles timer rollover correctly, just as in Chapter 4.

!!! mascot-warning "Keep interrupt handlers short"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Interrupt handler functions (like `button_pressed`) run in a special context. Keep them short — set a flag, record a timestamp, and exit. Do NOT call `sleep()`, `print()`, or I2C functions inside an interrupt handler. These can cause crashes. Instead, set a boolean flag like `button_was_pressed = True` in the handler, then check that flag in your main loop and take action there.

---

## Putting It All Together

Here is a complete robot program that uses PWM for motor control, plays a startup tone, and handles a button interrupt. It demonstrates every concept from this chapter working together.

```python
from machine import PWM, Pin
from time import sleep, ticks_ms, ticks_diff
import config

# Set up motors
right_fwd = PWM(Pin(config.RIGHT_FORWARD_PIN), freq=50)
right_rev = PWM(Pin(config.RIGHT_REVERSE_PIN), freq=50)
left_fwd  = PWM(Pin(config.LEFT_FORWARD_PIN),  freq=50)
left_rev  = PWM(Pin(config.LEFT_REVERSE_PIN),  freq=50)
buzzer    = PWM(Pin(config.BUZZER_PIN))

button_flag = False
last_press  = 0

def on_button(pin):
    global button_flag, last_press
    if ticks_diff(ticks_ms(), last_press) > 150:
        last_press = ticks_ms()
        button_flag = True

button = Pin(20, Pin.IN, Pin.PULL_UP)
button.irq(trigger=Pin.IRQ_FALLING, handler=on_button)

def beep(freq=440, dur=0.1):
    buzzer.freq(freq); buzzer.duty_u16(32767)
    sleep(dur); buzzer.duty_u16(0)

beep(659, 0.2)   # startup tone

try:
    while True:
        if button_flag:
            button_flag = False
            beep(880, 0.1)
            print("Button pressed!")
        sleep(0.01)

except KeyboardInterrupt:
    pass

finally:
    right_fwd.duty_u16(0); right_rev.duty_u16(0)
    left_fwd.duty_u16(0);  left_rev.duty_u16(0)
    buzzer.duty_u16(0)
    print("Motors and buzzer off.")
```

---

## Key Takeaways

- **PWM** switches a pin between HIGH and LOW rapidly — the duty cycle controls average voltage
- **Duty cycle** is expressed as a 16-bit integer (0–65535) in MicroPython
- **Motor speed** is controlled by the duty cycle on the forward or reverse pin
- **Differential drive** turns the robot by running left and right wheels at different speeds
- **Servo motors** rotate to a specific angle, controlled by PWM pulse width (1–2 ms at 50 Hz)
- **Linear mapping** converts an angle (0–180) to a duty cycle value
- **Piezo buzzer** tone pitch is controlled by PWM frequency
- **GPIO interrupts** call a handler function the instant a pin changes state — faster than polling
- **Debouncing** ignores extra button-bounce triggers within a short time window

!!! mascot-celebration "Your robot is alive — and it's rolling!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up! You wrote real code that spins my wheels, turns me, sweeps a servo, and plays tones. That's physical computing — software controlling the physical world. Next chapter, we add eyes: sensors that let me measure the world around me. The robot is about to get smart!

