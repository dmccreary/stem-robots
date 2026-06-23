---
title: Physical Computing Explorer
description: Students will *identify* (Bloom L1: Remember) the three layers of a physical computing system — inputs, processor, and outputs — and *explain* (Bloom L2: Understand) how information flows through the sense → decide → act loop.
image: /sims/physical-computing-explorer/physical-computing-explorer.png
og:image: /sims/physical-computing-explorer/physical-computing-explorer.png
twitter:image: /sims/physical-computing-explorer/physical-computing-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# Physical Computing Explorer

<iframe src="main.html" width="100%" height="422" scrolling="no"></iframe>

[Run the Physical Computing Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Students will *identify* (Bloom L1: Remember) the three layers of a physical computing system — inputs, processor, and outputs — and *explain* (Bloom L2: Understand) how information flows through the sense → decide → act loop.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/physical-computing-explorer/main.html" width="100%" height="422" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Students will *identify* (Bloom L1: Remember) the three layers of a physical computing system — inputs, processor, and outputs — and *explain* (Bloom L2: Understand) how information flows through the sense → decide → act loop.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 1: Introduction to Computational Thinking and Physical Computing](../../chapters/01-intro-computational-thinking/index.md)
- [Physical computing (Wikipedia)](https://en.wikipedia.org/wiki/Physical_computing)
- [Cytron Maker Pi RP2040](https://www.cytron.io/p-maker-pi-rp2040)

## Specification

The full specification below is extracted from [Chapter 1: Introduction to Computational Thinking and Physical Computing](../../chapters/01-intro-computational-thinking/index.md).

```text
Type: MicroSim
**sim-id:** physical-computing-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will *identify* (Bloom L1: Remember) the three layers of a physical computing system — inputs, processor, and outputs — and *explain* (Bloom L2: Understand) how information flows through the sense → decide → act loop.

**Canvas size:** 700 × 380 px, responsive (fills container width on resize)

**Layout:** Three vertical columns separated by animated flowing arrows:

Left column — **Inputs**: Three sensor icons stacked vertically with labels: "Distance Sensor (ToF)", "Line Sensors (IR)", "Bump Sensor". Each icon is drawn as a simple geometric shape with a colored border. All three connect via dashed animated lines flowing rightward.

Center column — **Processor**: A rounded rectangle labeled "Cytron Maker Pi RP2040" with "MicroPython Code" in smaller text inside and a blinking cursor. Color: navy (#1a237e). Animated dashed lines flow in from the left and out to the right.

Right column — **Outputs**: Three output icons with labels: "DC Motors", "NeoPixel LEDs", "OLED Display". Each icon uses the appropriate visual metaphor (spinning wheel, colored dot grid, small screen).

**Interactions:**
- Clicking any input icon highlights it yellow (#f9a825) and opens a tooltip popup stating: the sensor name, what physical phenomenon it measures, and an example reading (e.g., "Time-of-flight sensor: measures reflected infrared light. Example: 24 cm to nearest obstacle.").
- Clicking the center processor box shows: "The microcontroller reads every input, executes your MicroPython code, and decides what outputs to trigger — all in milliseconds."
- Clicking any output icon shows: the output name, what physical action it produces, and an example value (e.g., "DC Motors: spin the wheels. Example: speed=75 means 75% of full power.").
- A "Play Loop" button (bottom-center, created with p5's `createButton()`) starts an animation where orange (#e65100) particles travel along the wire paths from left to right, illustrating the sense → decide → act cycle in motion. Clicking again pauses the animation.

**Visual style:** Bold flat illustration, thick black outlines, transparent background. Tooltips appear as navy (#1a237e) rounded rectangles with white text, positioned adjacent to the clicked element.

Implementation: p5.js sketch with icons drawn programmatically using `rect()`, `ellipse()`, and `line()`. Tooltip divs managed as HTML elements parented to the canvas container. `createButton()` for the Play Loop control. Canvas resizes by calling `resizeCanvas(windowWidth * 0.9, 380)` in `windowResized()`.
```

