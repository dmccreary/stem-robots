---
title: "Complementary Filter Heading Tuner"
description: "Compare gyro-only, magnetometer-only, and complementary-filter heading estimates against the true heading on one compass dial, and use the alpha slider to see which sensor the fused estimate trusts."
image: /sims/complementary-filter-heading-tuner/complementary-filter-heading-tuner.png
og:image: /sims/complementary-filter-heading-tuner/complementary-filter-heading-tuner.png
twitter:image: /sims/complementary-filter-heading-tuner/complementary-filter-heading-tuner.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Complementary Filter Heading Tuner

<iframe src="main.html" height="507px" width="100%" scrolling="no"></iframe>

[Run the Complementary Filter Heading Tuner MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/complementary-filter-heading-tuner/main.html"
        height="507px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

The swarm robot needs one steady number for its **heading**, the compass direction it
faces. It has two sensors that can each estimate heading, and each one has a weakness:

- The **gyroscope** measures how fast the robot turns. Adding up those small turns gives
  a smooth heading, but a tiny error called **bias** adds up too. The orange needle
  slowly **drifts** away from the truth, even when the robot sits still.
- The calibrated **magnetometer** acts like a compass. It does not drift, but each
  reading is a little **noisy**. The green needle jitters.

A **complementary filter** blends the two. This is the `HeadingFilter` class from the
chapter, running 50 times a second:

```python
gyro_estimate = self.heading + gyro_z_dps * dt
compass_estimate = math.degrees(math.atan2(mag_y, mag_x)) % 360
diff = ((compass_estimate - gyro_estimate + 180) % 360) - 180
self.heading = (gyro_estimate + (1 - self.alpha) * diff) % 360
```

The one number **alpha** (α) sets the blend. With α = 0.98, each update keeps 98% of the
smooth gyroscope estimate and mixes in 2% of the compass. The blue needle is the fused
result. The black needle is the true heading, which a real robot can never see directly.

The panel on the right shows each estimate's error now and averaged over the last five
seconds. The best average is shown in bold. The orange and green bar shows how much each
update trusts each sensor, and the chart shows the three errors over the last 20 seconds.

!!! note "Why the short way around?"
    Headings wrap from 359° back to 0°. If you blended the two raw numbers, 359° and 1°
    would give about 352°, pointing the wrong way. So the `diff` line finds how far the
    compass is from the gyro the short way around the circle (here, +2°), and the filter
    moves a small step toward it. This MicroSim runs exactly that chapter code, so the
    fused needle stays steady even when the robot points north.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Fusing Sensors: The Complementary Filter and Heading Estimation."

## How to Use

1. Watch for about 20 seconds with the default settings. Which needle drifts? Which one
   jitters? Which one stays closest to the black needle?
2. Press **Start Turn**. The true heading turns 90° in 2 seconds. Which estimate keeps up
   best during the turn?
3. Slide **Alpha** up to 0.999. Wait 20 seconds. What does the blue needle start to look
   like, and why?
4. Slide **Alpha** down to 0.80. Now what does the blue needle look like?
5. Set **Gyro drift** to 2 °/s or **Mag noise** to 15°. Find the alpha value that gives
   the smallest fused average error for each case.
6. **Reset** restores the default settings and clears the chart.

## Lesson Plan

### Learning Objective

Students will *compare* (Bloom's Taxonomy: Analyze) gyro-only, magnetometer-only, and
complementary-filter heading estimates against a true heading, and *attribute* the fused
estimate's behavior to the alpha setting: drift when alpha is too high and jitter when
alpha is too low.

### Grade Level

Grades 9–12 (advanced grade 8 students)

### Duration

20–25 minutes

### Prerequisites

- Sensor fusion and noisy readings from
  [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md)
- The 9-DOF IMU, gyroscope calibration, and magnetometer calibration sections of
  Chapter 13
- Percentages and weighted averages

### Activities

1. **Observe the two failure modes (5 min):** With default settings, students describe
   the orange and green needles in one word each (expected: drifts, jitters) and record
   the three average errors after 20 seconds.
2. **Alpha sweep (8 min):** Pairs set alpha to 0.80, 0.90, 0.95, 0.98, 0.99, and 0.999,
   wait about 15 seconds each, and record the fused average error. Plotting error against
   alpha gives a U-shaped curve: too low follows the compass noise, too high follows the
   gyro drift.
3. **Change the sensors (5 min):** Pairs repeat a short sweep with Gyro drift = 2 °/s and
   then with Mag noise = 15°. Ask them to explain why the best alpha moves down for a
   worse gyroscope and up for a noisier compass.
4. **Connect to the robot (4 min):** Students explain why the chapter recommends
   calibrating the gyroscope (smaller bias) and the magnetometer (no offset) before tuning
   alpha.

### Discussion Questions

- Why can't the robot simply average the gyro heading and the compass heading 50/50?
- With alpha = 0.98 and a 50 Hz loop, roughly how long does it take the compass to
  correct a drifted heading? (About one second.)
- If you mounted the IMU right next to a motor, which needle would get worse, and how
  should you change alpha?

### Assessment

- **Formative:** The alpha sweep table and U-shaped sketch from Activity 2.
- **Exit ticket:** "A student's fused heading slowly creeps away from the truth while the
  robot sits still. Should they raise or lower alpha, and what else should they check?"
  (Expected: lower alpha slightly and re-run gyroscope calibration to reduce the bias.)
- **Rubric (4-point):** *Exemplary* — explains both failure modes, predicts how the best
  alpha shifts with drift and noise, and supports the prediction with data; *Proficient* —
  explains both failure modes with data; *Developing* — identifies that alpha matters but
  confuses which end causes drift; *Beginning* — treats the fused needle as always
  correct.

## References

1. [Sensor fusion (Wikipedia)](https://en.wikipedia.org/wiki/Sensor_fusion) — combining
   sensors so the result is better than either one alone.
2. [Gyroscope (Wikipedia)](https://en.wikipedia.org/wiki/Gyroscope) — how gyroscopes
   measure rotation rate, and why integrated rate drifts.
3. [Dead reckoning (Wikipedia)](https://en.wikipedia.org/wiki/Dead_reckoning) — why
   adding up small measured changes lets errors accumulate over time.
4. [atan2 (Wikipedia)](https://en.wikipedia.org/wiki/Atan2) — the function that turns
   magnetometer X and Y readings into a compass heading.
5. [Swarm Robot Build Plan](../../kits/swarm-bot/plan.md) — Phase 5, the `HeadingFilter`
   code and the recommended starting value of alpha = 0.98.
