---
title: "PID Feedback Loop Tuner"
description: "Adjust Kp, Ki, and Kd one at a time and watch a simulated robot turn to a new heading, with live overshoot, settling time, final error, and P, I, and D term readouts."
image: /sims/pid-feedback-loop-tuner/pid-feedback-loop-tuner.png
og:image: /sims/pid-feedback-loop-tuner/pid-feedback-loop-tuner.png
twitter:image: /sims/pid-feedback-loop-tuner/pid-feedback-loop-tuner.png
social:
   cards: false
quality_score: 100
status: implemented
---

# PID Feedback Loop Tuner

<iframe src="main.html" height="477px" width="100%" scrolling="no"></iframe>

[Run the PID Feedback Loop Tuner MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/pid-feedback-loop-tuner/main.html"
        height="477px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A follower robot has to turn until it faces a **target heading**. A **PID controller**
decides how hard to turn. It adds up three reactions to the **error**, which is the
target minus the current heading:

\[ \text{output} = K_p \cdot e + K_i \cdot \int e \, dt + K_d \cdot \frac{de}{dt} \]

| Term | Reacts to | What you see on the chart |
|---|---|---|
| **P** (Kp) | How far off the robot is right now | A bigger Kp turns faster, but too big swings past the target and rings |
| **I** (Ki) | How long the robot has stayed off | Removes a small leftover error, but too much causes a big overshoot |
| **D** (Kd) | How fast the error is changing | Brakes the turn before it overshoots |

The chart shows 10 seconds of the robot's heading. At 0.5 s the target (dashed purple
line) jumps from 0° to 90°. The solid blue line is where the robot actually points. The
light green band is the "close enough" zone, within 2° of the target. When you move a
slider, the old curve stays on the chart in gray so you can compare.

The panel on the right turns the curve into numbers: the error now, the **overshoot**
(how far past the target it swung), the **settling time** (how long until it stays
within 2°), and the **final error** at 10 s. The three colored bars show how much each of
the P, I, and D terms is contributing.

Just like a real robot, this simulated robot is not perfect. Its heading reading is
0.1 s old, its motors take a moment to speed up, and one wheel drags a little while it
drives. That drag is why P-only control stops a few degrees short of the target.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Smoother Control: PID and Encoder Feedback."

## How to Use

1. Start with the default: Kp = 0.20, Ki = 0, Kd = 0. This is proportional-only control.
   Read the **Final error**. Why doesn't the robot reach 90°?
2. Raise **Kp** to 0.5, then to 1.0. Watch the overshoot and the ringing grow.
3. Keep Kp at 1.0 and raise **Kd** slowly. Find the value where the overshoot disappears.
4. Press **Reset**, then raise **Ki** to about 0.02. What happens to the final error?
   Now try Ki = 0.2. What went wrong?
5. Press **Step Target** to replay the current settings in real time. Watch the P, I,
   and D bars and the small heading dial during the turn.
6. **Challenge:** find settings with less than 10% overshoot, a settling time under 2 s,
   and a final error under 1°.

## Lesson Plan

### Learning Objective

Students will *apply* (Bloom's Taxonomy: Apply) the PID formula by adjusting Kp, Ki, and
Kd independently and *describe* how each gain changes a robot's approach to a target
heading, measured by overshoot, settling time, and steady-state error.

### Grade Level

Grades 9–12 (advanced grade 8 students with algebra)

### Duration

25–30 minutes

### Prerequisites

- Closed-loop, proportional feedback from
  [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md)
- Reading line graphs of a value over time
- The PID section of Chapter 13, including the P, I, and D table

### Activities

1. **P-only baseline (5 min):** Students record overshoot, settling time, and final error
   for Kp = 0.2, 0.5, and 1.0 with Ki = Kd = 0. Ask them to explain why the final error
   shrinks as Kp grows but never reaches zero (a constant drag needs a constant output,
   and P only produces output when there is error).
2. **Add damping (7 min):** At Kp = 1.0, students increase Kd in steps of 0.05 and record
   the smallest Kd that removes the overshoot (about 0.2 in this model). Discuss what
   happens when Kd is much larger than needed (a slower approach).
3. **Remove the offset (7 min):** From the default, students try Ki = 0.01, 0.02, 0.05,
   0.1, and 0.2 and plot final error and overshoot against Ki. They should find a small
   Ki fixes the offset while a large Ki causes large overshoot.
4. **Tuning challenge (8 min):** Pairs search for gains that meet the challenge in How to
   Use step 6 and report their settings. Compare solutions across the class; several
   different combinations work.

### Discussion Questions

- Why does the robot overshoot even though every term is computed correctly?
- The follower robot later in this chapter uses P-only steering. When is P-only "good
  enough," and when would you add I or D?
- How would logging real heading data to `heading_log.csv` (from the Data Logging
  section) help you tune a real robot the same way?

### Assessment

- **Formative:** The data tables from Activities 1–3, checked for correct trends (Kp up →
  faster and more overshoot; Kd up → less overshoot; Ki up → less final error, more
  overshoot).
- **Exit ticket:** "A robot's heading rings back and forth three times before settling.
  Which gain would you change first, and in which direction?" (Expected: add Kd or lower
  Kp.)
- **Rubric (4-point):** *Exemplary* — meets the tuning challenge and justifies each gain
  with the P, I, and D bars; *Proficient* — meets the challenge by trial and error and
  describes each gain's effect; *Developing* — identifies the effect of Kp only;
  *Beginning* — changes gains without connecting them to the curve.

## References

1. [PID controller (Wikipedia)](https://en.wikipedia.org/wiki/PID_controller) — the
   standard reference for the proportional, integral, and derivative terms and tuning.
2. [Integral windup (Wikipedia)](https://en.wikipedia.org/wiki/Integral_windup) — why a
   large Ki overshoots, and the anti-windup idea this simulation uses.
3. [Overshoot (signal) (Wikipedia)](https://en.wikipedia.org/wiki/Overshoot_%28signal%29) —
   the definition of overshoot shown in the results panel.
4. [Settling time (Wikipedia)](https://en.wikipedia.org/wiki/Settling_time) — how the
   ±2° settling time is measured.
5. [Improving the Beginner's PID (Brett Beauregard)](http://brettbeauregard.com/blog/2011/04/improving-the-beginners-pid-introduction/) —
   a readable series on practical PID code, including taking the derivative of the
   measurement to avoid "derivative kick."
6. [Feedback Loop Simulator (Control Systems MicroSims)](https://github.com/dmccreary/control-systems/tree/main/docs/sims/feedback-loop-simulator) —
   the proportional step-response MicroSim this tuner extends with Ki and Kd.
