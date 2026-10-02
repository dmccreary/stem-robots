---
title: "Magnetometer Calibration Explorer"
description: "Rotate a simulated magnetometer through a full turn, watch the raw X/Y readings trace an off-center circle, then compute the hard-iron offset from min and max values and see the corrected circle and heading snap back into place."
image: /sims/magnetometer-calibration-explorer/magnetometer-calibration-explorer.png
og:image: /sims/magnetometer-calibration-explorer/magnetometer-calibration-explorer.png
twitter:image: /sims/magnetometer-calibration-explorer/magnetometer-calibration-explorer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Magnetometer Calibration Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Magnetometer Calibration Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/magnetometer-calibration-explorer/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A **magnetometer** measures the magnetic field around it. If you spin a perfect
magnetometer in a full circle and plot its X reading against its Y reading, the dots make
a circle centered on the origin (0, 0). The robot's heading is the angle of each dot:
`heading = atan2(mag_y, mag_x)`.

A real robot is not perfect. Its DC motors, battery, and screws add their own magnetic
field that moves with the robot. That extra field shifts every reading by the same
amount, so the circle slides off-center. This shift is called **hard-iron distortion**.
Until you remove it, the compass heading is wrong, and by how much depends on which way
the robot faces.

This MicroSim lets you do the same four-step calibration you will do on the real robot:

1. **Rotate a full turn.** Each red dot is one raw reading. The progress bar fills as
   you cover all 360 degrees.
2. **Find the min and max.** The panel tracks the smallest and largest X and Y values.
3. **Compute the offsets.** `offset_x = (max_x + min_x) / 2` and
   `offset_y = (max_y + min_y) / 2`. The orange crosshair marks this center.
4. **Apply them.** `corrected_x = mag_x - offset_x` and `corrected_y = mag_y - offset_y`.
   The green dots are the corrected readings, and they circle the origin.

The **Compass heading now** section compares the true heading with the heading from the
raw reading and from the corrected reading, so you can see why calibration matters.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Calibrating the Gyroscope and Magnetometer."

## How to Use

1. Drag the **Rotate robot** slider slowly. Watch the red dots trace a circle. Is the
   circle centered on the origin?
2. Keep going until the progress bar is full. You can also press **Auto-rotate** to do a
   full turn for you.
3. Before you press anything, **predict** the offsets from the min and max values in the
   panel. Then press **Compute Calibration** and check your math.
4. Drag the slider again. Compare the raw heading error with the corrected heading error.
   At which headings is the raw error biggest?
5. Press **New robot** to get a robot with a different hidden offset, and calibrate it
   again. **Reset** returns to the first robot.

## Lesson Plan

### Learning Objective

Students will *apply* (Bloom's Taxonomy: Apply) the hard-iron calibration procedure:
collect magnetometer readings through a full rotation, compute
`offset = (max + min) / 2` on each axis, and subtract the offsets to re-center the
readings, then *explain* how the correction changes the compass heading.

### Grade Level

Grades 8–12

### Duration

20 minutes

### Prerequisites

- Coordinate planes and the idea of an average (midpoint)
- Reading I2C sensor data from
  [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md)
- The 9-DOF IMU section of Chapter 13 (what the LSM303DLHC magnetometer measures)

### Activities

1. **Observe the problem (4 min):** Students rotate halfway and describe the curve. Ask:
   "Where would the center be if the sensor were perfect?"
2. **Compute by hand (6 min):** After a full rotation, students copy the min and max
   values, compute both offsets on paper, and only then press Compute Calibration to
   check. Differences of about 1 unit come from sensor noise.
3. **Heading impact (5 min):** Students record the raw and corrected heading error at
   0°, 90°, 180°, and 270° and identify where the raw error peaks. Connect this to the
   chapter's warning that an uncalibrated compass makes heading-following fail.
4. **Transfer (5 min):** Students press New robot, calibrate it, and then write the two
   offsets as they would store them in `config.py` or a `calibration.json` file.

### Discussion Questions

- Why does the midpoint of the minimum and maximum give the center of the circle?
- Why must you recalibrate after moving the IMU closer to or farther from the motors?
- What would the plot look like if you only rotated the robot halfway before computing
  the offsets?

### Assessment

- **Formative:** Hand-computed offsets from Activity 2, checked against the sim to within
  about 2 units.
- **Exit ticket:** "A robot's readings run from x = -150 to 250 and y = -230 to 170. Find
  offset_x and offset_y, then correct the reading (250, -30)." (Expected: offsets 50 and
  -30; corrected reading (200, 0), heading 0°.)
- **Rubric (4-point):** *Exemplary* — computes offsets, applies them, and explains the
  heading error pattern; *Proficient* — computes and applies offsets correctly;
  *Developing* — computes offsets but applies them with the wrong sign; *Beginning* —
  cannot identify the min and max needed.

## References

1. [Magnetometer (Wikipedia)](https://en.wikipedia.org/wiki/Magnetometer) — how
   magnetometers measure field strength and act as electronic compasses.
2. [Magnetic deviation (Wikipedia)](https://en.wikipedia.org/wiki/Magnetic_deviation) —
   compass errors caused by nearby magnetic materials, the same effect as hard-iron
   distortion on a robot.
3. [atan2 (Wikipedia)](https://en.wikipedia.org/wiki/Atan2) — the function that turns
   the X and Y readings into a heading angle.
4. [LSM303DLHC accelerometer/magnetometer datasheet (STMicroelectronics)](https://www.st.com/resource/en/datasheet/lsm303dlhc.pdf) —
   the magnetometer chip on this course's 9-DOF IMU module, including its measurement
   ranges and output registers.
5. [Swarm Robot Build Plan](../../kits/swarm-bot/plan.md) — Phase 4, the magnetometer
   calibration script for the real robot.
