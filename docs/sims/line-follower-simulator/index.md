---
title: "Line Follower Simulator"
description: "A two-sensor line-following robot that runs the Chapter 10 adjust_motors() rules on oval, figure-8, and zigzag tracks, with sliders for fast speed, slow speed, and update rate."
image: /sims/line-follower-simulator/line-follower-simulator.png
og:image: /sims/line-follower-simulator/line-follower-simulator.png
twitter:image: /sims/line-follower-simulator/line-follower-simulator.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Line Follower Simulator

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Line Follower Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim shows a robot with two infrared (IR) sensors following a black line on a white floor.
The two circles on the front of the robot are the sensors.
A sensor circle turns **black** when it is over the line. That reading is **HIGH** (1).
It turns **light yellow** when it is over the white floor. That reading is **LOW** (0).
The sensors are *active LOW*: the white floor bounces the infrared light back, so the
sensor reads 0. The black line soaks the light up, so the sensor reads 1.

Two sensors give four possible states. The robot uses the same rules as `adjust_motors()` in
[Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md):

| Left IR | Right IR | What the motors do | Which way the robot goes |
|---------|----------|--------------------|--------------------------|
| HIGH | LOW | left motor slow, right motor fast | turns left, back toward the line |
| LOW | HIGH | left motor fast, right motor slow | turns right, back toward the line |
| HIGH | HIGH | both motors fast | straight |
| LOW | LOW | both motors fast | straight (the line is lost) |

When only the left sensor sees the line, the line is under the robot's left side.
That means the robot has drifted to the right, so it must turn left to get back.

The table on the right side of the sim lights up the state the robot is in right now.
The readouts show both sensor values, both motor duties, and how much of the time at least one sensor is on the line.

The **Tightest turn** readout shows the smallest circle the robot can drive when one wheel is slow.
A big number means a weak correction. The robot cannot turn sharply enough to stay on a tight corner.

## How to Use

1. Press **Run** and watch the sensor circles and the highlighted row in the table.
2. Look closely: when the left sensor sees the line, the code slows the **left** wheel. Which way does the robot turn? Why does that bring it back to the line?
3. Pick the **Zigzag** track and press **Run**. The robot loses the line at the first sharp corner. Why?
4. Lower the **Slow speed** slider and try again. Watch the **Tightest turn** number get smaller.
5. Change the **Update rate**. This is how often the loop reads the sensors, like the `sleep(0.02)` in the chapter code (50 times per second).
6. **Reset robot** puts the robot back at the start. **Clear path** erases the blue trail.

**Try this challenge:** On the Zigzag track, set the update rate to 20 Hz and the slow speed to 0.
What is the largest fast speed that keeps **Time on line** above 90 % for 30 seconds?
Now try 10 Hz. What happens, and why?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/line-follower-simulator/main.html"
        height="552px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *analyze* how the four IR sensor states and the fast/slow motor duties combine to steer a line-following robot, and will *predict* the effect of excessive speed, weak correction (slow duty too close to fast duty), and a slow update loop (Bloom's Taxonomy: Analyze).

### Grade Level

Grades 8–12

### Duration

25–30 minutes

### Prerequisites

- Dual IR sensor reading and motor differential adjustment in [Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md).
- Digital input with `Pin.value()` from [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md).
- Motor duty and differential drive from [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md).
- `if`/`elif`/`else` from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

### Instructor Note on Turn Direction

In the chapter's `adjust_motors()`, the state *left HIGH, right LOW* sets the left motor to `HALF` and the right motor to `FULL`. With differential drive, a faster right wheel turns the robot **left**, toward the side where the line was detected, which is the correct correction because the robot has drifted right. Two student misconceptions are common here: that the robot should steer *away* from the sensor that sees the line, and that a robot turns toward its faster wheel. Activity 2 is designed to surface that misconception: students predict the turn direction first, then confirm it against the motion in the simulation and the comments in the chapter code.

### Activities

1. **Observe the four states (5 min).** On the Oval track at default settings, students pause the sim several times and record the sensor values, the highlighted table row, and the motor duties. They should find that the robot spends most of its time alternating between the two "one sensor on the line" states.
2. **Explain the steering (5 min).** Students answer: "When the left sensor reads HIGH, which wheel slows down, which way does the robot turn, and why does that recenter it?" Pairs check their answer against the motion in the sim and the comments in the chapter's `adjust_motors()` code.
3. **Correction strength (7 min).** On the Zigzag track, students hold fast speed at 65535 and lower the slow speed in steps (32767, 20000, 10000, 0), recording Tightest turn and Time on line. They identify the threshold where the robot starts to stay on the line.
4. **Speed versus loop rate (8 min).** With slow speed 0, students find the largest fast speed that keeps Time on line above 90 % for 30 s at 50 Hz, 20 Hz, and 10 Hz. They explain the pattern using distance traveled between sensor readings (speed / update rate).
5. **Design discussion (5 min).** The class discusses why the LOW/LOW state drives straight in the chapter code and proposes a better behavior (for example, remembering the last turn direction).

### Assessment

- **Formative:** During Activity 4, ask each pair to compute how far the robot travels between readings at 80 cm/s and 10 Hz (8 cm, twice the line width) and to explain why that loses the line.
- **Exit ticket:** "Your real robot follows the oval but loses the line at sharp corners. Give two different changes to the code constants that could fix it, and explain what each one changes."
- **Rubric (4-point):** *Exemplary* — correctly explains all four states, identifies weak correction and slow updates as separate causes with data, and proposes a justified improvement for LOW/LOW. *Proficient* — explains the steering direction correctly and supports one cause with data. *Developing* — describes what happens on screen without linking it to the motor duties or loop rate. *Beginning* — cannot connect sensor states to motor actions.

## References

1. [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md) — the `adjust_motors()` rules and the line following program.
2. [Line Follower Bot kit](../../kits/line-follower-bot/index.md) — the project's hardware kit with two digital IR sensors.
3. [Differential wheeled robot](https://en.wikipedia.org/wiki/Differential_wheeled_robot) — Wikipedia article on steering by running two wheels at different speeds.
4. [Bang–bang control](https://en.wikipedia.org/wiki/Bang%E2%80%93bang_control) — Wikipedia article on controllers that switch between a few fixed outputs, like the fast and slow duties used here.
5. [MicroPython `machine.Pin`](https://docs.micropython.org/en/latest/library/machine.Pin.html) — documentation for reading a digital input with `Pin.value()`.
