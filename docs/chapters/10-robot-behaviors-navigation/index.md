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

#### Diagram: Collision Avoidance Arena

This simulation shows a top-down view of a small robot driving around a walled arena with a few boxes in it. The robot runs the same rules as our program: full speed above 50 cm, half speed from 20 to 50 cm, and stop and turn below 20 cm. You can change the thresholds and watch the path the robot leaves behind.

<iframe src="../../sims/collision-avoidance-arena/main.html" width="100%" height="552px" scrolling="no"></iframe>
[Run Collision Avoidance Arena Fullscreen](../../sims/collision-avoidance-arena/main.html){ .md-button }

<details markdown="1">
<summary>Drive a virtual robot around an arena and tune its stop and slow distances</summary>
Type: microsim
**sim-id:** collision-avoidance-arena<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design. This one is spatial and behavioral. It must not repeat the flowchart in `collision-decision-flow` (Chapter 4), which only shows the decision logic.

Learning objective: Apply (Bloom L3) — adjust `STOP_DIST_CM` and `SLOW_DIST_CM` and predict how the robot's path, speed, and number of turns will change.

Canvas layout: total width responsive (max 800 px), height 600 px. The arena fills the top 500 px. A control strip fills the bottom 100 px. Scale is 1 cm = 2 px, so a 360 cm x 240 cm arena is drawn at 720 x 480 px.

Visual elements:
- Arena: light gray floor (#EEEEEE) with a dark gray 4 px wall border. Place 3 fixed box obstacles (rectangles, 40 x 40 cm to 60 x 30 cm) in tan (#D2B48C).
- Robot: a 20 x 16 cm rounded rectangle in OliveDrab (#6B8E23) with a white triangle showing the heading. Two small dark rectangles show the wheels.
- ToF beam: a thin line and translucent cone (10 degrees wide) from the front of the robot, colored by zone: green above 50 cm, amber from 20 to 50 cm, red below 20 cm. The beam ends at the first wall or box it hits.
- Two dashed arcs in front of the robot at the slow and stop distances, labeled "50 cm" and "20 cm" (they update with the sliders).
- Path trace: a fading blue polyline of the last 20 seconds of robot positions. Turn spots are marked with small orange dots.
- Readout panel (top-right of the arena): "Distance: __ cm", "Zone: FORWARD / SLOW / TURN", "Speed: __ duty" (65535, 32767, or 0), "Turns: __", "Last turn: LEFT / RIGHT".

Interactive controls:
- Slider "Stop distance (cm)": 5 to 40, step 1, default 20. Sets `STOP_DIST_CM`.
- Slider "Slow distance (cm)": 20 to 100, step 5, default 50. Sets `SLOW_DIST_CM`. It cannot go below the stop distance plus 5.
- Slider "Speed (cm/s at full duty)": 20 to 100, default 60.
- Dropdown "Turn choice": "Random (real code)", "Always left", "Always right". Default Random.
- Button "Run / Pause". Button "Reset". Button "Clear Path".
- Click in the arena to drop the robot at that spot with a random heading.

Behavior: each frame (60 fps) the sim computes the ToF distance by casting a ray from the robot front to the nearest wall or box. Then it uses the same rules as the chapter code. If distance > slow, speed is 65535 (full, 60 cm/s by default). If stop < distance <= slow, speed is 32767 (half). If distance <= stop, speed is 0 for 0.1 s, then the robot spins in place for 0.4 s (about 90 degrees) in the chosen direction, and the turn counter goes up by 1. Speed in cm/s is duty / 65535 times the speed slider. Add 1 cm of random noise to the distance reading. If the robot ever has to turn 6 times in 10 seconds, show a small banner "Stuck in a corner?" With "Always left", it is easy to make the robot circle a box, which shows why random turns help.

Default state: robot in the arena center heading right, paused, thresholds 20 and 50, Turn choice Random, empty path.

Assessment/Challenge: Set the slider to "Always left" and press Run for 60 seconds. Then switch to "Random" and run 60 seconds again. Which mode covers more of the arena, and which gets stuck more often? Also set stop distance to 5 cm at 100 cm/s. The robot should now touch a wall. Explain why. (Answer: the robot needs time to react, so it moves too far before the next sensor reading.)

Responsive: redraw on window resize.
</details>

The arena uses the same three-zone logic as the `while True` loop in our program. The stop and slow sliders are the `STOP_DIST_CM` and `SLOW_DIST_CM` constants in `config.py`. Try values in the sim first. Then copy the ones that work into your robot and tune them on the real floor.

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

#### Diagram: Line Follower Simulator

This simulation shows a top-down view of a robot with two IR sensors following a black line on a white floor. You can change the speed and how hard the robot steers, then watch how those settings change the way it tracks the line.

<iframe src="../../sims/line-follower-simulator/main.html" width="100%" height="552px" scrolling="no"></iframe>
[Run Line Follower Simulator Fullscreen](../../sims/line-follower-simulator/main.html){ .md-button }

<details markdown="1">
<summary>Tune a two-sensor line follower on an oval, figure-8, or zigzag track</summary>
Type: microsim
**sim-id:** line-follower-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design. It may borrow the animation loop and slider panel style from https://github.com/dmccreary/control-systems/tree/main/docs/sims/feedback-loop-simulator. The track, sensors, and motor model are new.

Learning objective: Analyze (Bloom L4) — explain how the four IR sensor states and the fast/slow motor speeds make the robot steer, and predict what happens when speed is too high or the correction is too weak.

Canvas layout: total width responsive (max 800 px), height 600 px. Left 600 px is the track view. Right 200 px is the control panel. Under the track view, a 40 px strip shows the sensor state table.

Visual elements:
- Track: white background, black line 4 cm wide (drawn 8 px wide at 1 cm = 2 px). Three tracks: "Oval", "Figure-8", "Zigzag".
- Robot: a 16 x 12 cm rounded rectangle in OliveDrab (#6B8E23) with two wheels. Two small circles mark the IR sensors at the front corners, 4 cm apart. Each circle is filled black when it reads LOW (over the line, value 0) and light yellow when HIGH (over white, value 1).
- Path trace: thin blue polyline from the robot center. Faded after 15 seconds.
- State strip: the four-row table from the chapter (HIGH/HIGH, LOW/HIGH, HIGH/LOW, LOW/LOW) with the active row highlighted in gold and the action text next to it ("Drive straight", "Turn right", "Turn left", "Line lost").
- Live readouts: "Left IR: 0/1", "Right IR: 0/1", "Left motor: duty", "Right motor: duty", "Time on line: __ %".

Interactive controls:
- Slider "Fast speed (duty)": 20000 to 65535, step 1000, default 65535 (`FULL`).
- Slider "Slow speed (duty)": 0 to 60000, step 1000, default 32767 (`HALF`). Cannot exceed the fast speed.
- Slider "Update rate (Hz)": 5 to 100, default 50 (the `sleep(0.02)` in the chapter code).
- Dropdown "Track": Oval (default), Figure-8, Zigzag.
- Button "Run / Pause", button "Reset robot", button "Clear path".

Behavior: at each update tick (rate slider), read both sensors by checking whether the sensor point is within 2 cm of the line center. Then apply the exact rules from `adjust_motors()`. Left LOW and right HIGH: left motor gets slow duty, right motor gets fast duty (turn right). Left HIGH and right LOW: right motor gets slow duty, left gets fast (turn left). Both LOW or both HIGH: both motors fast (drive straight). Between updates the motors keep their last duty. Every 1/60 s move the robot with differential drive: forward speed = (left + right) / 2 / 65535 x 80 cm/s, turn rate = (right - left) / 65535 x 80 / 12 rad/s (wheel spacing 12 cm). "Time on line" is the share of frames where at least one sensor reads LOW. If both sensors read HIGH for more than 2 seconds, stop the robot and show "Line lost!" in red. Note that both-HIGH drives straight in the chapter code, so on sharp curves the robot will lose the line. This is a good discussion point.

Default state: Oval track, robot on the line facing along it, paused, fast 65535, slow 32767, 50 Hz.

Assessment/Challenge: On the Zigzag track, find the largest fast speed where the robot still stays on the line for 30 seconds (Time on line above 90 percent). Then lower the update rate to 10 Hz. What happens? (Answer: the robot reacts too slowly and leaves the line, so a fast loop matters as much as fast motors.)

Responsive: redraw on window resize.
</details>

The two circles on the robot match the two IR sensors on `IR_LEFT_PIN` (28) and `IR_RIGHT_PIN` (27). The fast and slow duty values are the `FULL` and `HALF` constants in `adjust_motors()`. If the simulated robot loses the line at a speed, your real robot probably will too, so slow it down or shorten the `sleep()` time.

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

#### Diagram: Dance Beat Sequencer

This simulation shows a beat timeline for a robot dance. You pick a tempo, place moves on the beats, and watch a small robot perform them. The timeline also shows the exact `sleep()` time each move needs.

<iframe src="../../sims/dance-beat-sequencer/main.html" width="100%" height="532px" scrolling="no"></iframe>
[Run Dance Beat Sequencer Fullscreen](../../sims/dance-beat-sequencer/main.html){ .md-button }

<details markdown="1">
<summary>Build an 8-beat robot dance on a BPM timeline and preview it</summary>
Type: microsim
**sim-id:** dance-beat-sequencer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design

Learning objective: Apply (Bloom L3) — convert a tempo in BPM into seconds per beat and arrange timed open-loop moves into a dance that fits the beats.

Canvas layout: total width responsive (max 800 px), height 500 px. Top 120 px is the control bar. Middle 200 px is the timeline grid. Bottom 180 px is a stage showing the robot and the generated code.

Visual elements:
- Timeline: 8 columns (beats 1 to 8), each with a half-beat split so moves can be 0.5 or 1 or 2 beats long. Each move is a colored block: Forward (green), Back (orange), Spin left (blue), Spin right (purple), Stop (gray).
- Beat ruler across the top with numbers 1 to 8. A vertical red playhead sweeps across during playback.
- Stage: a top-down 300 x 150 px floor with a small OliveDrab robot that moves and spins as blocks play. A trail shows where it has been.
- Code box: the dance() function that matches the timeline, with lines like `go_forward(); sleep(0.5)  # beat 1`. The line for the active move is highlighted.
- Metronome: a circle that flashes on every beat.

Interactive controls:
- Slider "Tempo (BPM)": 60 to 180, step 5, default 120. Shows "Seconds per beat = 60 / BPM = 0.50".
- Palette of 5 move buttons. Click a move, then click a beat cell to place it. Click a placed block to remove it.
- Dropdown "Block length": half beat (0.5), one beat (1), two beats (2). Default 1.
- Button "Play", button "Stop", button "Clear", button "Load Chapter Dance" (fills in the 8-beat example from the chapter).
- Checkbox "Metronome click" (default on).

Behavior: seconds per beat = 60 / BPM. A block that lasts N beats runs for N x (60 / BPM) seconds. Total length is shown as "Dance length: __ s". Playback moves the robot: forward and back move it 30 px per beat, spin turns it 90 degrees per 0.5 beat. If the total blocks add up to more than 8 beats, show a red message "Too long for 8 beats". If a gap is left, fill it with Stop and show a gray block. Note that a dance is open-loop, so add a small "Drift" slider (0 to 10 percent, default 0) that makes each move slightly off. After a few repeats the robot ends far from where it started. This shows why open-loop dances drift.

Default state: the chapter's 8-beat dance loaded at 120 BPM, stopped, playhead at beat 1.

Assessment/Challenge: How many seconds long is the chapter's dance at 120 BPM? At 90 BPM? (Answers: 4 s at 120 BPM, and 5.33 s at 90 BPM.) Then set Drift to 5 percent and repeat the dance 4 times. Where does the robot end up compared with the start?

Responsive: redraw on window resize.
</details>

Each block in the sequencer is one line of the `dance()` function, and the `sleep()` number is the block length in beats times the seconds per beat. Change the BPM to see how one dance works for many songs. The drift slider reminds us why an open-loop dance needs a reset spot on the floor.

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

#### Diagram: Commit or Ignore Sorter

This simulation shows a list of files from a robot project. You drag each file into a "Commit to git" bin or an "Add to .gitignore" bin, and the sim tells you why the choice is right or wrong.

<iframe src="../../sims/git-secrets-sorter/main.html" width="100%" height="502px" scrolling="no"></iframe>
[Run Commit or Ignore Sorter Fullscreen](../../sims/git-secrets-sorter/main.html){ .md-button }

<details markdown="1">
<summary>Sort project files into commit or .gitignore and see the resulting .gitignore file</summary>
Type: microsim
**sim-id:** git-secrets-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design. It is a sorting quiz in the style of a concept classifier.

Learning objective: Classify (Bloom L2) — decide which project files belong in version control and which belong in `.gitignore`, and explain the reason for each.

Canvas layout: total width responsive (max 800 px), height 500 px. Left 260 px is a "file pile" of cards. The middle 300 px has two large drop bins stacked vertically. The right 240 px shows a live `.gitignore` preview and the feedback panel.

Visual elements:
- 10 file cards, each with a file icon and name: `main.py`, `config.py`, `secrets.py`, `.gitignore`, `__pycache__/`, `notes.pyc`, `.DS_Store`, `README.md`, `lib/vl53l0x.py`, `heading_log.csv`.
- Bin 1 (green border): "Commit to git". Bin 2 (red border): "Add to .gitignore".
- Feedback panel: after a drop, the card gets a green check or red X and one plain sentence of feedback, for example "secrets.py holds your WiFi password. Anyone who sees your repo would see it."
- Live `.gitignore` preview: a monospace box that lists every file placed in the red bin, one per line.
- Score: "Correct: __ / 10".

Interactive controls:
- Drag and drop each card into a bin (or click a card and press a bin button for keyboard use). A card can be moved again after a wrong drop.
- Button "Check All" (colors every card), button "Reset", and button "Show Answers".

Behavior: the correct answers are: Commit: `main.py`, `config.py`, `.gitignore`, `README.md`, `lib/vl53l0x.py`. Ignore: `secrets.py`, `__pycache__/`, `notes.pyc` (matches `*.pyc`), `.DS_Store`. The tenth card, `heading_log.csv`, is a discussion card: either bin is accepted, and the feedback says "Small logs can be committed for a class project. Large or private logs should be ignored." Feedback text for each file explains its reason: config.py has pin numbers (hardware facts, safe to share); pycache and .pyc are files Python rebuilds; .DS_Store is a Mac folder file with no use in the project. If `secrets.py` is placed in Commit, flash the bin red and show "Once a secret is committed, it stays in git history. You would need to change the password." Accept a match for `*.pyc` in the preview by showing the pattern rather than the file name.

Default state: all cards in the pile, empty bins, empty preview, score 0 / 10.

Assessment/Challenge: Place all files, press Check All, and get 10 of 10. Then compare the preview with the chapter's example `.gitignore`. Which line protects your WiFi password? (Answer: `secrets.py`.)

Responsive: redraw on window resize.
</details>

The red bin builds the same `.gitignore` file you saw above. Your robot code, `config.py`, and libraries are safe to share, but `secrets.py` never is. Sort the files a few times until the choice feels automatic. Then check your own project folder for the same file types.

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

