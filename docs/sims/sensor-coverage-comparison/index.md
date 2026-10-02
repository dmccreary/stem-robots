---
title: "Sensor Coverage Comparison"
description: "A top-down view of the robot that compares the range, beam width, and blind spots of the ToF, ultrasonic, IR, and bump sensors as you drag an obstacle around."
image: /sims/sensor-coverage-comparison/sensor-coverage-comparison.png
og:image: /sims/sensor-coverage-comparison/sensor-coverage-comparison.png
twitter:image: /sims/sensor-coverage-comparison/sensor-coverage-comparison.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Sensor Coverage Comparison

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Sensor Coverage Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every sensor on your robot sees the world in its own way. This MicroSim shows
the robot from above, facing up the screen, with the area each sensor covers:

- **ToF (green):** a narrow 25° beam that reaches 200 cm. It cannot measure
  anything closer than 3 cm.
- **Ultrasonic (purple):** a slightly wider 30° cone that reaches 400 cm, far
  past the top of the screen. It cannot measure closer than 2 cm.
- **IR (orange):** two short strips at the front corners that reach about 10 cm.
- **Bump switch (red):** a bar on the front edge. It only knows about an
  obstacle when the robot touches it.

Drag the gray obstacle around. A sensor's zone lights up when it sees the
obstacle, and the legend shows its reading. Places that no sensor covers are
**blind spots**. The obstacle menu changes what the obstacle is made of, because
some materials fool some sensors. This matches the sensor table in
[Chapter 8](../../chapters/08-sensors-data-input/index.md#sensor-types-overview).

## How to Use

1. Start with the hard wall 80 cm straight ahead. Which sensors see it?
2. Drag the obstacle to the side, just outside the green and purple beams.
   The status line tells you how many sensors still see it.
3. Check **Zoom in near robot** to see the area right in front of the robot.
   Place the obstacle just ahead of the left front corner, outside the beams.
   Which sensor notices it?
4. Change **Obstacle** to **Glass** and to **Soft cloth**. Which sensor goes
   blind for each one?
5. Try **Thin table leg**. It is small, so it can hide in the gaps between zones.
6. Put the obstacle in front of the robot and click **Drive forward**. Watch
   the order in which the sensors pick it up. Turn off **Bump** and try again.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/sensor-coverage-comparison/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

20 minutes

### Learning Objective

Students will *compare* the range, beam width, and blind spots of the ToF,
ultrasonic, IR, and bump sensors, and will *choose* which sensors to combine
for a given robot task.

### Prerequisites

- The sensor types table and the ToF, ultrasonic, IR, and bump switch sections
  of [Chapter 8](../../chapters/08-sensors-data-input/index.md)
- Driving the robot forward and stopping it with PWM motor control from
  [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md)
- Reading angles and distances on a diagram

### Activities

1. **Predict (3 min).** Show the default view. Ask: "Which sensor would miss a
   chair leg just off to the side at 20 cm?" Students write a guess.
2. **Map the blind spots (6 min).** In pairs, students drag the obstacle to
   find three blind spots: one beside the robot, one very close in front (turn
   on the zoom), and one in a gap between zones. They sketch each on paper.
3. **Materials test (4 min).** Students test **Glass** and **Soft cloth** at
   50 cm and record which sensor fails for each, and why (the laser passes
   through glass; cloth soaks up sound).
4. **Drive test (4 min).** With the obstacle straight ahead, students press
   **Drive forward** and record the distance at which each sensor first
   detects it. Then they repeat with **Bump** off to see what happens without
   a backup.
5. **Design choice (3 min).** Give each pair a task (hallway following,
   line-following on a table, avoiding glass doors) and ask them to pick the
   smallest set of sensors that covers it and justify the choice.

### Assessment

- **Challenge:** "Place the obstacle just ahead of the left front corner, outside
  the ToF and ultrasonic beams. Which sensor notices it?" (The left IR sensor.)
  "Choose Glass. Which sensor still works at 50 cm?" (The ultrasonic sensor.)
- **Compare in writing:** "Name one situation where the ultrasonic sensor
  beats the ToF sensor, and one where the ToF sensor wins."
- **Rubric (4-point):** *Exemplary* — compares all four sensors on range,
  width, and failure cases and justifies a combination with evidence from the
  sim. *Proficient* — identifies each sensor's main blind spot and picks a
  reasonable combination. *Developing* — identifies range differences only.
  *Beginning* — assumes one sensor can see everything around the robot.

### Simplifications to Mention

- Beam widths and ranges are typical values. Real beams have soft edges, and
  ranges shrink in bright light or with dark, angled, or small targets.
- The view follows the robot, so while driving, the obstacle moves toward the
  robot on screen at 10 cm per second.

## References

1. [Chapter 8: Sensors and Data Input — Sensor Types Overview](../../chapters/08-sensors-data-input/index.md#sensor-types-overview) — the ranges used for each sensor.
2. [Chapter 8: Sensor Fusion](../../chapters/08-sensors-data-input/index.md#sensor-fusion) — combining sensors so they cover each other's blind spots.
3. [VL53L0X Time-of-Flight Distance Sensor Carrier (Pololu)](https://www.pololu.com/product/2490) — range, field of view, and a link to the ST datasheet for the robot's ToF sensor.
4. [HC-SR04 Ultrasonic Ranging Module datasheet (SparkFun)](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf) — range and measuring angle of the ultrasonic sensor.
5. [Sensor fusion (Wikipedia)](https://en.wikipedia.org/wiki/Sensor_fusion) — why robots combine several sensors.
6. [Field of view (Wikipedia)](https://en.wikipedia.org/wiki/Field_of_view) — what beam width and viewing angle mean.
