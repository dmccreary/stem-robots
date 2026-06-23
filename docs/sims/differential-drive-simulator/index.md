---
title: Differential Drive Turn Simulator
description: Type: MicroSim **sim-id:** differential-drive-simulator<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 450 canvas.
image: /sims/differential-drive-simulator/differential-drive-simulator.png
og:image: /sims/differential-drive-simulator/differential-drive-simulator.png
twitter:image: /sims/differential-drive-simulator/differential-drive-simulator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# Differential Drive Turn Simulator

<iframe src="main.html" width="100%" height="452" scrolling="no"></iframe>

[Run the Differential Drive Turn Simulator MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** differential-drive-simulator<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 450 canvas.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/differential-drive-simulator/main.html" width="100%" height="452" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** differential-drive-simulator<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 450 canvas.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md)
- [Differential wheeled robot (Wikipedia)](https://en.wikipedia.org/wiki/Differential_wheeled_robot)
- [Dead reckoning (Wikipedia)](https://en.wikipedia.org/wiki/Dead_reckoning)

## Specification

The full specification below is extracted from [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md).

```text
Type: MicroSim
**sim-id:** differential-drive-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 450 canvas. Show a top-down view of the robot (a rectangle with L and R labels for left and right wheels).

Two vertical sliders on the left panel:
- "Left wheel speed" from -100% to +100%
- "Right wheel speed" from -100% to +100%

The robot animates in the top-down view, turning and moving based on the differential of the two speeds. Use simple Euler integration to update position and heading each frame. Show the robot's path as a fading trail of dots.

Preset buttons below the sliders: "Forward", "Backward", "Spin Left", "Spin Right", "Gradual Left", "Gradual Right". Each sets the sliders to the correct values and starts the animation.

A "Reset position" button returns the robot to center.

Learning objective (Bloom's Taxonomy — Applying): students predict and verify robot motion from left/right speed ratios.

Responsive: redraw on window resize.
```

