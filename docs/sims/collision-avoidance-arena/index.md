---
title: Collision Avoidance Arena
description: A top-down robot arena where students tune STOP_DIST_CM and SLOW_DIST_CM and watch how the robot's path, speed, turns, and wall touches change.
image: /sims/collision-avoidance-arena/collision-avoidance-arena.png
og:image: /sims/collision-avoidance-arena/collision-avoidance-arena.png
twitter:image: /sims/collision-avoidance-arena/collision-avoidance-arena.png
social:
   cards: false
quality_score: 100
---

# Collision Avoidance Arena

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Collision Avoidance Arena MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim shows a small robot driving around a walled arena with three boxes in it.
The robot runs the same rules as the collision avoidance program in
[Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md).
Its time-of-flight (ToF) sensor measures the distance to whatever is straight ahead.
The robot picks one of three zones from that distance:

| Distance | Zone | What the code does | Motor duty |
|----------|------|--------------------|------------|
| more than `SLOW_DIST_CM` | FORWARD | `go_forward()` | 65535 |
| between the two thresholds | SLOW | `go_slow()` | 32767 |
| `STOP_DIST_CM` or less | TURN | `stop_motors()`, wait 0.1 s, then turn left or right for 0.4 s | 0, then a spin |

The sensor beam changes color with the zone: green, amber, or red.
Two dashed arcs in front of the robot show the slow and stop distances.
The blue line is the path from the last 20 seconds, and each orange dot marks a turn.
The light blue squares show how much of the floor the robot has covered.

Like a real robot, the virtual one checks its sensor once every 0.05 seconds (the `sleep(0.05)` in the loop).
Its wheels also need a moment to slow down.
So if the stop distance is very small, the robot can roll into a wall before it reacts.
The readout counts every **wall touch** so you can see this happen.

## How to Use

1. Press **Run** and watch the robot for about 20 seconds. Notice where it slows down and where it turns.
2. Move the **Stop distance** slider. A bigger number makes the robot turn earlier. Watch the red arc move.
3. Move the **Slow distance** slider. It can never be less than the stop distance plus 5 cm.
4. Change **Turn choice** to "Always left" and compare it with "Random (real code)". Does the path repeat? Does **Floor covered** keep growing?
5. Click anywhere on the floor to drop the robot there with a random heading.
6. Press **Reset** to put the robot back in the center with all counters at zero. Your slider settings stay the same, so you can rerun a test.
7. Press **Clear Path** to erase the trail and the covered-floor squares without moving the robot.

**Try this challenge:** Set the stop distance to 5 cm and the full-duty speed to 100 cm/s. Press Run.
Why does the wall touch counter start to climb?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/collision-avoidance-arena/main.html"
        height="552px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* the three-zone collision avoidance rules by adjusting `STOP_DIST_CM` and `SLOW_DIST_CM`, and will *predict* how those changes affect the robot's path, speed, and number of turns (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12

### Duration

20–25 minutes

### Prerequisites

- The collision avoidance program in [Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md), including `go_forward()`, `go_slow()`, and the random turn.
- Reading the VL53L0X time-of-flight sensor from [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md).
- Motor duty values (`duty_u16`, 0 to 65535) from [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md).
- `if`/`elif`/`else` decisions from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

### Activities

1. **Predict (3 min).** Before pressing Run, students write down where they expect the robot to make its first turn and how far from the box it will stop. They then run the sim for one turn and compare the orange turn dot with their prediction.
2. **Threshold sweep (7 min).** In pairs, students run three trials of 30 seconds each with `STOP_DIST_CM` at 10, 20, and 35 (Reset between trials, default speed). They record Turns, Floor covered, and Wall touches in a table and describe the trend in one sentence.
3. **Turn strategy comparison (7 min).** Students run "Always left" for 60 seconds, then Reset and run "Random (real code)" for 60 seconds, recording Floor covered at 30 s and at 60 s for each. "Always left" tends to repeat the same loop, so its coverage levels off; random turns keep reaching new floor but sometimes wiggle in a corner and trigger the "Stuck in a corner?" banner. Students explain the trade-off and why the chapter code uses `random.choice()`.
4. **Reaction-time challenge (5 min).** Students set the stop distance to 5 cm and the speed to 100 cm/s, observe the wall touches, and explain the cause in terms of the 0.05 s loop and the time the wheels need to stop.
5. **Transfer (3 min).** Students choose the threshold pair they would copy into `config.py` for a classroom floor and justify the choice with their data.

### Assessment

- **Formative:** During Activity 2, check that each pair's table shows more turns and fewer touches as `STOP_DIST_CM` rises. Ask: "What would change if the robot were twice as fast?"
- **Exit ticket:** "The robot keeps bumping into boxes at full speed. Name two changes to the constants or speed that would fix it, and explain why each one works."
- **Rubric (4-point):** *Exemplary* — predictions are stated before testing, data from at least three trials supports a clear rule linking threshold, speed, and wall touches, and the reaction-time explanation mentions both loop delay and stopping distance. *Proficient* — correct trend with data from two or more trials, and a partial reaction-time explanation. *Developing* — describes what happened without linking it to the thresholds. *Beginning* — changes sliders without recording or explaining results.

## References

1. [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md) — the collision avoidance program this sim models.
2. [Obstacle avoidance](https://en.wikipedia.org/wiki/Obstacle_avoidance) — Wikipedia overview of how mobile robots detect and steer around obstacles.
3. [Differential wheeled robot](https://en.wikipedia.org/wiki/Differential_wheeled_robot) — Wikipedia article on two-wheeled robots that turn by running the wheels in opposite directions.
4. [VL53L0X Time-of-Flight ranging sensor](https://www.st.com/en/imaging-and-photonics-solutions/vl53l0x.html) — STMicroelectronics product page and datasheet for the robot's distance sensor.
5. [MicroPython `random` module](https://docs.micropython.org/en/latest/library/random.html) — documentation for `random.choice()`, used to pick the turn direction.
