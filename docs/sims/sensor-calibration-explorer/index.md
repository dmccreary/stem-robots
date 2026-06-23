---
title: Sensor Calibration Two-Point Process
description: Type: MicroSim **sim-id:** sensor-calibration-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.
image: /sims/sensor-calibration-explorer/sensor-calibration-explorer.png
og:image: /sims/sensor-calibration-explorer/sensor-calibration-explorer.png
twitter:image: /sims/sensor-calibration-explorer/sensor-calibration-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# Sensor Calibration Two-Point Process

<iframe src="main.html" width="100%" height="402" scrolling="no"></iframe>

[Run the Sensor Calibration Two-Point Process MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** sensor-calibration-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/sensor-calibration-explorer/main.html" width="100%" height="402" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** sensor-calibration-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md)
- [Calibration (Wikipedia)](https://en.wikipedia.org/wiki/Calibration)
- [Linear equation (Wikipedia)](https://en.wikipedia.org/wiki/Linear_equation)

## Specification

The full specification below is extracted from [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md).

```text
Type: MicroSim
**sim-id:** sensor-calibration-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Show a graph with:
- X-axis: "True distance (cm)" from 0 to 200.
- Y-axis: "Sensor reading (cm)" from 0 to 220.
- A diagonal "ideal" line (green) where sensor = true distance.
- A "raw sensor" line (orange) that is offset (starts at a non-zero Y intercept) and has a different slope.
- After clicking "Calibrate", the orange line transforms into a corrected line that overlaps the green ideal line.

Controls:
- "Zero offset" slider: adjusts the Y intercept of the raw sensor line (-20 to +20 cm).
- "Scale factor" slider: adjusts the slope of the raw sensor line (0.8 to 1.2).
- "Calibrate" button: applies the corrections and animates the orange line rotating/shifting to match the green line.
- A "Test point" slider moves a vertical cursor across the graph, showing "Raw: X cm, Corrected: Y cm, Error: Z cm."

Learning objective (Bloom's Taxonomy — Applying): students practice adjusting calibration parameters and observe how they reduce sensor error.

Responsive: redraw on window resize.
```

