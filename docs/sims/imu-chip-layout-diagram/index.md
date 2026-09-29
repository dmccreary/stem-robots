---
title: 9-DOF IMU Chip Layout
description: Interactive diagram showing that the 9-DOF IMU module is really two I2C chips, the L3GD20 gyroscope at 0x6B and the LSM303D accelerometer/magnetometer at 0x1D, sharing one bus on Pico W GPIO16/17.
image: /sims/imu-chip-layout-diagram/imu-chip-layout-diagram.png
og:image: /sims/imu-chip-layout-diagram/imu-chip-layout-diagram.png
twitter:image: /sims/imu-chip-layout-diagram/imu-chip-layout-diagram.png
social:
   cards: false
quality_score: 100
---

# 9-DOF IMU Chip Layout

<iframe src="main.html" height="422px" width="100%" scrolling="no"></iframe>

[Run the 9-DOF IMU Chip Layout MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/imu-chip-layout-diagram/main.html"
        height="422px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

The IMU board on the swarm robot is called a **9-DOF IMU**. "9-DOF" means nine degrees of
freedom: three axes from a gyroscope, three from an accelerometer, and three from a
magnetometer. It looks like one small board, but it is really **two separate chips**
that share one I2C bus:

- The **L3GD20 gyroscope** answers at I2C address `0x6B`. It gives 3 axes of rotation
  rate in degrees per second.
- The **LSM303D** answers at I2C address `0x1D`. It holds two sensors in one chip: a
  3-axis accelerometer (in g) and a 3-axis magnetometer (in gauss).

Both chips connect to the same two wires: GPIO16 (SDA) and GPIO17 (SCL), which make I2C
bus 0 on the Pico W. I2C lets many devices share one pair of wires, as long as each
device has a different **address** (a number that picks which chip should answer).

The **What i2c.scan() prints** card shows the output of the chapter's scan code. With a
working module it lists two addresses, not one. The scenario buttons show what the scan
prints when one chip's wiring has failed, which is the first row of the chapter's
troubleshooting table.

!!! note "Clone boards can use different addresses"
    Each chip has an address-select pin. On some boards the gyroscope shows up at `0x6A`
    and the LSM303D at `0x1E`. Always run `i2c.scan()` and use the addresses your own
    board reports.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Meet the 9-DOF IMU: L3GD20 + LSM303D."

## How to Use

1. Hover over (or tap) each box, from left to right. Read the explanation in the
   **Details** card.
2. Hover over the `addr 0x6B` and `addr 0x1D` labels. How does the Pico W pick which chip
   answers?
3. Count the gray boxes on the right. How many axes does each one have? Add them up. Do
   you get 9?
4. Press **Gyro not answering**, then **Accel/Mag not answering**. Look at the scan
   output each time. Which address is missing?
5. Explain to a partner why reading this module needs two small drivers, not one.

## Lesson Plan

### Learning Objective

Students will *explain* (Bloom's Taxonomy: Understand) that a "9-DOF IMU module" is two
separate I2C sensor chips sharing one bus, each with its own address, rather than one
combined chip, and will *interpret* an `i2c.scan()` result in those terms.

### Grade Level

Grades 8–12

### Duration

10–15 minutes

### Prerequisites

- I2C buses, SDA/SCL, and device addresses from
  [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)
- Reading an I2C sensor with `readfrom_mem()` from
  [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md)

### Activities

1. **Prediction (3 min):** Before showing the diagram, ask: "The board says 9-DOF. How
   many addresses will `i2c.scan()` print?" Most students predict one; record the split.
2. **Guided walk-through (5 min):** Project the diagram and hover each node from left to
   right. Pause at the LSM303D and ask why one chip can produce six of the nine values.
3. **Fault reasoning (4 min):** Use the two failure scenarios. Students state which
   address disappears and which readings the robot would lose (rotation rate versus
   acceleration and heading).
4. **Hardware check (3 min):** If modules are available, students run the chapter's scan
   and `WHO_AM_I` code and compare the printed addresses with the diagram, noting any
   clone-board address differences.

### Discussion Questions

- Why can the time-of-flight sensor, the OLED display, and both IMU chips all share
  GPIO16 and GPIO17?
- What would happen if two chips on the bus had the same address?
- Why does the chapter warn that motors near the LSM303D distort one of its readings but
  not the other?

### Assessment

- **Formative:** Students label a blank copy of the diagram with the two addresses and
  the units of each data type.
- **Exit ticket:** "`i2c.scan()` prints `['0x6b']`. Which chip is missing, and which
  robot features stop working?" (Expected: the LSM303D; tilt sensing and the compass
  heading.)
- **Rubric (4-point):** *Exemplary* — explains the two-chip design, both addresses, and
  how the bus selects a chip; *Proficient* — names both chips and addresses; *Developing* —
  knows there are two chips but confuses which sensor is on which; *Beginning* — treats
  the module as a single device.

## References

1. [Inertial measurement unit (Wikipedia)](https://en.wikipedia.org/wiki/Inertial_measurement_unit) —
   what an IMU measures and why several sensor types are combined.
2. [I²C (Wikipedia)](https://en.wikipedia.org/wiki/I%C2%B2C) — how devices share SDA and
   SCL and how 7-bit addresses select one device.
3. [MicroPython machine.I2C documentation](https://docs.micropython.org/en/latest/library/machine.I2C.html) —
   `scan()` and `readfrom_mem()` used in the chapter code.
4. [Pololu MinIMU-9 v3 (L3GD20H and LSM303D carrier)](https://www.pololu.com/product/2468) —
   a well-documented board with the same two-chip arrangement and address-select pins.
5. [Magnetometer (Wikipedia)](https://en.wikipedia.org/wiki/Magnetometer) — how a
   magnetometer works as an electronic compass.
6. [Swarm Robot Build Plan](../../kits/swarm-bot/plan.md) — full L3GD20 and LSM303D
   drivers for this course's module.
