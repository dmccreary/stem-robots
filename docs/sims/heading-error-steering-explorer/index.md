---
title: Heading Error and Steering Explorer
description: Set a follower robot's current and target headings, watch heading_error() pick the shorter turn step by step, and see the left and right motor speeds that steer() returns for a given Kp.
image: /sims/heading-error-steering-explorer/heading-error-steering-explorer.png
og:image: /sims/heading-error-steering-explorer/heading-error-steering-explorer.png
twitter:image: /sims/heading-error-steering-explorer/heading-error-steering-explorer.png
social:
   cards: false
quality_score: 100
---

# Heading Error and Steering Explorer

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Heading Error and Steering Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/heading-error-steering-explorer/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A follower robot in the heading swarm knows two numbers: its own **current heading** and
the **target heading** that the master broadcasts. Both are compass directions from 0 to
359 degrees. The follower has to decide which way to turn and how hard. It does that with
the two small functions from the chapter:

```python
def heading_error(target, current):
    return (target - current + 180) % 360 - 180   # shortest turn direction, -180..+180

def steer(error, base_speed, Kp=0.02):
    turn = Kp * error
    left = max(0, min(1, base_speed + turn))
    right = max(0, min(1, base_speed - turn))
    return left, right
```

This MicroSim runs the same math and shows every step:

- **The compass dial** has a green arrow for the current heading and a purple arrow for
  the target. The solid blue arc is the shorter turn. The dashed gray arc is the long way
  around.
- **The calculation panel** shows each step of `heading_error()` with real numbers. It
  also shows the "naive" answer you get without the wrap-around trick, in red when it
  would send the robot the long way.
- **The motor bars** show the `left` and `right` values from `steer()`. Each value runs
  from 0 to 1, which is 0 to 65535 duty on the robot's PWM pins. A gray bar means
  `steer()` had to clip the value to stay between 0 and 1.
- **Play turn** replays the robot turning. Every 50 ms tick, the heading changes by
  `(left - right) x 20` degrees, and the small chart plots the error after each tick.

One detail matters here. Python's `%` always returns a number from 0 up to 359 when you
use `% 360`, even for negative numbers. So `-150 % 360` is `210`. That is what makes the
wrap-around work.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Heading Synchronization: Master and Follower Code."

## How to Use

1. Start with the default: current 350°, target 20°. **Predict** the error before you
   read the panel. Is it +30 or -330?
2. Drag the green or purple arrow, or use the heading sliders. Watch each line of the
   calculation panel change.
3. Try current 10° and target 350°. Which way does the robot turn, and by how much?
4. Look at the motor bars. With Kp = 0.02 and an error of +30, the left motor wants 1.10,
   but `steer()` clips it to 1.00. Lower **Kp** until neither bar is clipped.
5. Press **Play turn** at Kp = 0.02. Then raise **Kp** to 0.05 or more and press it
   again. When does the robot start swinging back and forth?
6. Set the two headings exactly 180° apart. What does the calculation panel say?

## Lesson Plan

### Learning Objective

Students will *calculate* (Bloom's Taxonomy: Apply) the shortest-turn heading error
with wrap-around using `(target - current + 180) % 360 - 180`, and *predict* the left
and right motor speeds that `steer()` returns for a given error, base speed, and `Kp`.

### Grade Level

Grades 8–12

### Duration

20–25 minutes

### Prerequisites

- Arithmetic operators, including `%`, and functions with return values from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- PWM duty cycle and motor speed from
  [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md)
- Proportional (P-only) control, introduced with the PID tuner earlier in Chapter 13

### Activities

1. **Hand calculation first (5 min):** Before opening the sim, students compute the
   error for three pairs on paper: (current 350, target 20), (current 10, target 350),
   and (current 90, target 270). They then check each answer in the calculation panel.
   Students who write -330 for the first pair have found the naive-error misconception.
2. **Motor prediction (7 min):** For error +30 and base speed 0.5, students predict
   `left` and `right` for Kp = 0.005, 0.01, and 0.02, including any clipping, and verify
   with the motor bars. Ask them to find the largest Kp that avoids clipping (about 0.016
   for this error, so 0.015 on the slider).
3. **Stability hunt (6 min):** Pairs raise Kp in 0.005 steps, press **Play turn** each
   time, and record the smallest Kp at which the replay chart shows the error changing
   sign and never settling. They should find a value near 0.05.
4. **Connect to hardware (4 min):** Students locate where `steer()`'s outputs would be
   multiplied by 65535 before being written to the motor PWM pins from `config.py`.

### Discussion Questions

- Why does adding 180 before `% 360`, then subtracting 180, give a result between -180
  and +180?
- Why is a clipped motor value a sign that Kp may be too high for large errors?
- The replay uses a 20 Hz update. Would a faster update rate change the Kp at which the
  robot starts to oscillate? Why?

### Assessment

- **Formative:** Accuracy of the three hand calculations in Activity 1, checked against
  the calculation panel.
- **Exit ticket:** "Current 300°, target 30°, base speed 0.5, Kp 0.01. Give the error,
  the turn direction, and the left and right motor values." (Expected: error +90, turn
  right, turn 0.9, left 1.0 clipped from 1.4, right 0.0 clipped from -0.4.)
- **Rubric (4-point):** *Exemplary* — computes wrap-around error and clipped motor values
  correctly and explains the clipping; *Proficient* — correct error and unclipped motor
  values, with a clipping mistake; *Developing* — correct only when no wrap-around is
  needed; *Beginning* — uses `target - current` without wrap-around.

## References

1. [Modulo (Wikipedia)](https://en.wikipedia.org/wiki/Modulo) — explains why
   the sign of `%` results differs between Python (floored) and C or JavaScript
   (truncated).
2. [Python documentation: binary arithmetic operations](https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations) —
   the official definition of `%`, whose result has the same sign as the divisor.
3. [Proportional control (Wikipedia)](https://en.wikipedia.org/wiki/Proportional_control) —
   background on P-only control and why a high gain causes oscillation.
4. [Course (navigation) (Wikipedia)](https://en.wikipedia.org/wiki/Course_%28navigation%29) —
   compass headings measured clockwise from north.
5. [MicroPython machine.PWM documentation](https://docs.micropython.org/en/latest/library/machine.PWM.html) —
   `duty_u16()` values from 0 to 65535 used to drive the motors.
6. [Swarm Robot Build Plan](../../kits/swarm-bot/plan.md) — the full follower script that
   uses `heading_error()` and `steer()`.
