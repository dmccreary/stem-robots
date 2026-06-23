---
title: Robot Behaviors and Autonomous Navigation
description: Converge all prior skills into autonomous robot behavior — implement open-loop and closed-loop motor control, build a full collision avoidance algorithm, construct a dual-sensor line follower, choreograph a robot dance, and apply the config/secrets/gitignore patterns to a production-quality project.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 15:05:00
version: 0.08
---

# Robot Behaviors and Autonomous Navigation

!!! mascot-welcome "Welcome, maker — this is the chapter you've been building toward!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Motors, sensors, displays, functions, loops — you've built every piece separately. In this chapter, we wire them all together into a robot that navigates on its own. Collision avoidance. Line following. Even a dance routine. Computational thinking is YOUR superpower — and this chapter is proof.

## Summary

This chapter is where all prior skills converge into autonomous robot behavior.
Students implement open-loop and closed-loop (feedback) motor control, build a full
collision avoidance algorithm with obstacle detection, distance thresholds, and random
turn logic, and construct a dual-sensor line follower with motor differential
adjustment. The chapter also covers robot dance sequences, timed motor patterns, and
the config/secrets/gitignore file patterns that every well-organized robot project
should use.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Open-Loop Motor Control
2. Closed-Loop Feedback
3. Feedback Loop
4. Collision Avoidance
5. Obstacle Detection
6. Distance Threshold
7. Random Turn Direction
8. Collision Avoidance Code
9. Line Following
10. Dual IR Sensor Reading
11. Motor Differential Adjust
12. Line Following Code
13. Robot Dance Sequence
14. Timed Motor Patterns
15. Config File Pattern
16. Pin Assignment Constants
17. Secrets File Pattern
18. Gitignore File

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)
- [Chapter 5: Data Structures, Modular Programming, and Version Control](../05-data-structures-modular-code/index.md)
- [Chapter 7: PWM, Motor Speed Control, and Actuators](../07-pwm-motor-speed-actuators/index.md)
- [Chapter 8: Sensors and Data Input](../08-sensors-data-input/index.md)

---

## Open-Loop vs. Closed-Loop Motor Control

Before building behaviors, we need to understand two fundamentally different approaches to motor control. This distinction is the foundation of robotics and control engineering.

### Open-Loop Motor Control

**Open-loop motor control** sends a command to the motors and does nothing to verify the result. You say "go forward at 50% speed" and trust that it happens. No sensor checks. No correction.

Open-loop is simple and works fine for timed patterns — "drive forward for 2 seconds, then turn for 0.5 seconds." The problem is that real motors are imperfect. One motor may be slightly faster than the other. The battery voltage drops as it drains. These factors cause drift — the robot veers off course over time.

```python
# Open-loop: drive forward for 2 seconds, then turn right
set_speed(right_fwd, right_rev, HALF)
set_speed(left_fwd,  left_rev,  HALF)
sleep(2)

set_speed(right_fwd, right_rev, 0)      # right stops
set_speed(left_fwd,  left_rev,  HALF)   # left keeps going — turns right
sleep(0.5)

set_speed(right_fwd, right_rev, 0)
set_speed(left_fwd,  left_rev,  0)
```

Open-loop works for choreographed sequences where the path is pre-planned. It fails for reactive navigation.

### Closed-Loop Feedback

**Closed-loop feedback** continuously measures the output (what is actually happening) and compares it to the goal (what should be happening). If there is a difference (called the **error**), the controller adjusts its output to reduce that error.

The **feedback loop** is the cycle:

1. **Sense** — read the current state (sensor value)
2. **Compare** — how far is the current state from the goal?
3. **Act** — adjust the motor output to reduce the difference
4. **Repeat** — go back to step 1

For collision avoidance, the sensor is the ToF distance sensor. The goal is "maintain a safe distance." When the measured distance drops below the threshold, the motors respond. That is a closed feedback loop.

#### Diagram: Open-Loop vs. Closed-Loop Control


<iframe src="../../sims/open-closed-loop-comparison/main.html" width="100%" height="560px" scrolling="no"></iframe>
[Run Open-Loop vs. Closed-Loop Control Fullscreen](../../sims/open-closed-loop-comparison/main.html)

<details markdown="1">
<summary>Interactive diagram comparing open-loop and closed-loop control systems</summary>
Type: diagram
**sim-id:** open-closed-loop-comparison<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create two Mermaid flowcharts side by side (use subgraph):

Left subgraph "Open-Loop":
Controller → Actuator (Motors) → Output (Robot Motion)
No feedback arrow.

Right subgraph "Closed-Loop":
Controller → Actuator (Motors) → Output (Robot Motion) → Sensor (Distance) → Error Calculation → Controller (loop back)

Every node has a click directive opening an infobox explaining that component's role. Error node infobox explains: "Error = Goal distance - Measured distance. If error > 0, speed up. If error < 0, slow down or stop."

Canvas: 700 × 300 px. Responsive on window resize.
</details>

!!! mascot-thinking "Why does feedback matter?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think about riding a bicycle. You don't look at your hands once, set the handlebar angle, and close your eyes — you constantly check where you're going and adjust. That's closed-loop control. Your eyes are the sensor, your brain is the controller, your arms are the actuators. The robot works the same way.

---

## Collision Avoidance

**Collision avoidance** is the behavior of detecting an obstacle and changing course before hitting it. It is the most fundamental autonomous robot behavior — and the first one we will fully implement.

### Obstacle Detection and Distance Threshold

**Obstacle detection** means determining whether an object is close enough to be a concern. We use the ToF sensor to measure distance, then compare it to a **distance threshold** — a fixed value that defines "too close."

In this course, we use two thresholds:

- **Warning threshold (50 cm):** slow down
- **Stop threshold (20 cm):** stop and turn

Before the code, here is the decision logic: if distance is above 50 cm, drive forward at full speed. If it drops to 20–50 cm, slow down. If it drops below 20 cm, stop and pick a random turn direction.

### Random Turn Direction

**Random turn direction** prevents the robot from getting stuck in a corner. If the robot always turned left when it hit an obstacle, it could end up running in tight circles or stuck in a left-corner trap. By randomly choosing left or right, the robot explores the space more efficiently.

Before the code, here is how randomness works in MicroPython: `random.choice([True, False])` returns `True` or `False` with equal probability. We interpret `True` as "turn left" and `False` as "turn right."

```python
import random

def pick_random_turn():
    return random.choice(["left", "right"])
```

### The Complete Collision Avoidance Algorithm

Now let's build the full collision avoidance behavior. Before the code, here is the overall structure: we have five movement functions (`go_forward`, `go_slow`, `stop_motors`, `turn_left`, `turn_right`). The main loop reads the sensor, decides the response, and calls the appropriate function.

```python
from machine import PWM, Pin, I2C
from time import sleep
import random, vl53l0x, config

# Set up motors (same as Chapter 7)
right_fwd = PWM(Pin(config.RIGHT_FORWARD_PIN), freq=50)
right_rev = PWM(Pin(config.RIGHT_REVERSE_PIN), freq=50)
left_fwd  = PWM(Pin(config.LEFT_FORWARD_PIN),  freq=50)
left_rev  = PWM(Pin(config.LEFT_REVERSE_PIN),  freq=50)

FULL = 65535
HALF = 32767

def set_speed(pf, pr, speed):
    if speed > 0:
        pf.duty_u16(speed); pr.duty_u16(0)
    elif speed < 0:
        pf.duty_u16(0); pr.duty_u16(-speed)
    else:
        pf.duty_u16(0); pr.duty_u16(0)

def go_forward():
    set_speed(right_fwd, right_rev, FULL)
    set_speed(left_fwd,  left_rev,  FULL)

def go_slow():
    set_speed(right_fwd, right_rev, HALF)
    set_speed(left_fwd,  left_rev,  HALF)

def stop_motors():
    set_speed(right_fwd, right_rev, 0)
    set_speed(left_fwd,  left_rev,  0)

def turn_left(duration=0.4):
    set_speed(right_fwd, right_rev, FULL)
    set_speed(left_fwd,  left_rev,  -FULL)
    sleep(duration)

def turn_right(duration=0.4):
    set_speed(right_fwd, right_rev, -FULL)
    set_speed(left_fwd,  left_rev,  FULL)
    sleep(duration)

# Set up ToF sensor
i2c = I2C(0, scl=Pin(config.I2C_SCL_PIN),
             sda=Pin(config.I2C_SDA_PIN), freq=400000)
tof = vl53l0x.VL53L0X(i2c)

STOP_DIST_CM  = 20
SLOW_DIST_CM  = 50

try:
    while True:
        dist_cm = tof.read() / 10

        if dist_cm > SLOW_DIST_CM:
            go_forward()
        elif dist_cm > STOP_DIST_CM:
            go_slow()
        else:
            stop_motors()
            sleep(0.1)
            direction = random.choice(["left", "right"])
            if direction == "left":
                turn_left()
            else:
                turn_right()

        sleep(0.05)

except KeyboardInterrupt:
    pass

finally:
    stop_motors()
    print("Stopped.")
```

This is a complete, production-quality collision avoidance program. The constants `STOP_DIST_CM` and `SLOW_DIST_CM` are easy to tune without touching the logic. The `finally` block guarantees the motors stop.

!!! mascot-tip "Tune your thresholds on the actual floor"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The 20 cm and 50 cm values are starting points, not magic numbers. Run the robot on your actual test surface, observe where it stops, and adjust. A robot on carpet needs different thresholds than one on tile. A competition arena is different from a classroom floor. Tuning is part of the engineering process — expect to iterate.

---

## Line Following

**Line following** is the behavior of keeping the robot on a track — usually a black tape line on a white surface. It is one of the classic competitions in educational robotics.

### Dual IR Sensor Reading

Line-following robots use two infrared sensors mounted at the front, spaced about the width of the line apart. The sensors point down at the surface. When a sensor is over the black line, it reads LOW (line detected). When over the white surface, it reads HIGH (no line).

This dual-sensor arrangement gives four possible states:

| Left IR | Right IR | Meaning | Action |
|---------|----------|---------|--------|
| HIGH | HIGH | Both off the line | Turn — line is lost |
| LOW | HIGH | Left on line, right off | Turn right to center |
| HIGH | LOW | Right on line, left off | Turn left to center |
| LOW | LOW | Both on line (wide line) | Drive straight |

```python
ir_left  = Pin(config.IR_LEFT_PIN,  Pin.IN)
ir_right = Pin(config.IR_RIGHT_PIN, Pin.IN)

left_val  = ir_left.value()
right_val = ir_right.value()
```

### Motor Differential Adjust

**Motor differential adjust** means running one motor faster than the other to steer back onto the line. Rather than making sharp turns, we adjust speed gradually — smoother tracking.

For example, when the left sensor detects the line and the right doesn't (robot drifted left), we need to turn right. We slow the left motor and keep the right at full speed:

```python
def adjust_motors(left_val, right_val):
    if left_val == 0 and right_val == 1:
        # Left sensor on line — slow left, keep right fast (turn right)
        set_speed(right_fwd, right_rev, FULL)
        set_speed(left_fwd,  left_rev,  HALF)
    elif left_val == 1 and right_val == 0:
        # Right sensor on line — keep left fast, slow right (turn left)
        set_speed(right_fwd, right_rev, HALF)
        set_speed(left_fwd,  left_rev,  FULL)
    else:
        # Both sensors on line or both off — drive straight
        set_speed(right_fwd, right_rev, FULL)
        set_speed(left_fwd,  left_rev,  FULL)
```

### The Complete Line Following Program

```python
ir_left  = Pin(config.IR_LEFT_PIN,  Pin.IN)
ir_right = Pin(config.IR_RIGHT_PIN, Pin.IN)

try:
    while True:
        lv = ir_left.value()
        rv = ir_right.value()
        adjust_motors(lv, rv)
        sleep(0.02)   # 50 Hz update rate

except KeyboardInterrupt:
    pass

finally:
    stop_motors()
```

!!! mascot-warning "IR sensors are sensitive to surface and light"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Bright sunlight or fluorescent flicker can confuse IR sensors. Test your line follower in the same lighting conditions you'll use for the actual run. If the robot misbehaves in a specific area, check for shadows, shiny surfaces, or light reflections — not always the code's fault.

---

## Robot Dance Sequence

A **robot dance sequence** is a choreographed series of timed motor patterns. Unlike the reactive behaviors above (which respond to sensor input), a dance is fully **open-loop** — every move is timed in advance. This is a great creative challenge: design a dance using only forward, backward, left turn, right turn, and spin.

**Timed motor patterns** are just calls to motor functions followed by `sleep()`. The key is counting beats: if your song is 120 BPM (beats per minute), one beat = 60/120 = 0.5 seconds.

```python
from time import sleep

def spin(duration=0.5):
    set_speed(right_fwd, right_rev, FULL)
    set_speed(left_fwd,  left_rev,  -FULL)
    sleep(duration)

def back(duration=0.5):
    set_speed(right_fwd, right_rev, -FULL)
    set_speed(left_fwd,  left_rev,  -FULL)
    sleep(duration)

# A simple 8-beat dance at 120 BPM (0.5s per beat)
def dance():
    go_forward(); sleep(0.5)      # beat 1
    spin("left"); sleep(0.5)      # beat 2
    spin("right"); sleep(0.5)     # beat 3
    back(); sleep(0.5)            # beat 4
    go_forward(); sleep(1.0)      # beats 5–6
    spin("left"); sleep(0.25)     # beat 7 (half beat)
    spin("right"); sleep(0.25)    # beat 7 (half beat)
    stop_motors()                 # beat 8 — end
```

Encourage creativity here: try adding buzzer tones, NeoPixel color changes, and OLED face changes synchronized with motor moves. A robot that blinks, beeps, and dances is memorable.

---

## Config, Secrets, and .gitignore in Production

This is a good moment to revisit the file organization patterns from Chapter 5, now that you have a complete robot program. Every production-quality robot project should use all three.

### Config File Pattern and Pin Assignment Constants

**Config file pattern:** All hardware pin numbers and calibration constants live in `config.py`, not in `main.py`. This was introduced in Chapter 5. Here is the complete `config.py` for the full course robot:

```python
# config.py — Cytron Maker Pi RP2040 pin assignments

# Motors
RIGHT_FORWARD_PIN = 11
RIGHT_REVERSE_PIN = 10
LEFT_FORWARD_PIN  = 9
LEFT_REVERSE_PIN  = 8

# Sensors
I2C_SDA_PIN         = 16
I2C_SCL_PIN         = 17
IR_LEFT_PIN         = 28
IR_RIGHT_PIN        = 27
BUMP_PIN            = 26
ULTRASONIC_TRIG_PIN = 3
ULTRASONIC_ECHO_PIN = 2

# Outputs
NEOPIXEL_PIN   = 18
NEOPIXEL_COUNT = 2
BUZZER_PIN     = 22
SERVO_PIN      = 12

# Tuning constants
STOP_DIST_CM = 20
SLOW_DIST_CM = 50
```

**Pin assignment constants** in UPPERCASE signal that these values are fixed hardware facts, not runtime variables.

### Secrets File Pattern

**Secrets file pattern:** WiFi credentials live in `secrets.py`, a separate file that is never committed to version control:

```python
# secrets.py — NEVER commit this file to git!
WIFI_SSID     = "SchoolRobotics"
WIFI_PASSWORD = "your-password-here"
```

In `main.py`, import only what you need:

```python
from secrets import WIFI_SSID, WIFI_PASSWORD
```

### Gitignore File

The `.gitignore` file in your project root prevents `secrets.py` (and other unwanted files) from being committed:

```
secrets.py
__pycache__/
*.pyc
.DS_Store
```

With these three files in place (`config.py`, `secrets.py`, `.gitignore`), your project follows professional engineering standards: hardware facts are separated from logic, credentials are protected, and your repository is clean.

---

## Key Takeaways

- **Open-loop control** sends commands without feedback — good for timed sequences, drifts over time
- **Closed-loop feedback** continuously senses and corrects — essential for reactive navigation
- **Collision avoidance** uses distance thresholds to trigger stop and random turn behaviors
- **Random turn direction** prevents the robot from getting trapped in corners
- **Line following** reads dual IR sensors and uses motor differential to stay on a track
- **Motor differential adjust** steers by running one wheel faster than the other — no steering servo needed
- **Robot dance sequences** are open-loop timed patterns — combine with sound and lights for performance
- **config.py** holds all pin constants; **secrets.py** holds WiFi credentials; **.gitignore** protects secrets

!!! mascot-celebration "Your robot navigates the world on its own — you did that!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, engineer! Collision avoidance, line following, a dance routine — these behaviors combine every skill from the past nine chapters. The next chapter adds WiFi: your robot becomes internet-connected and browser-controlled. The journey keeps going!

