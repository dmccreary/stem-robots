---
title: Robot Main Loop with Timing
description: Type: MicroSim **sim-id:** robot-main-loop-timing<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.
image: /sims/robot-main-loop-timing/robot-main-loop-timing.png
og:image: /sims/robot-main-loop-timing/robot-main-loop-timing.png
twitter:image: /sims/robot-main-loop-timing/robot-main-loop-timing.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# Robot Main Loop with Timing

<iframe src="main.html" width="100%" height="402" scrolling="no"></iframe>

[Run the Robot Main Loop with Timing MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** robot-main-loop-timing<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/robot-main-loop-timing/main.html" width="100%" height="402" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** robot-main-loop-timing<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- [Event loop (Wikipedia)](https://en.wikipedia.org/wiki/Event_loop)
- [MicroPython time module](https://docs.micropython.org/en/latest/library/time.html)

## Specification

The full specification below is extracted from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

```text
Type: MicroSim
**sim-id:** robot-main-loop-timing<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Show a timeline animation of the robot's main loop:

- A horizontal "time" axis runs left to right.
- Each loop iteration is shown as a stacked block. Inside the block, colored segments represent: "Read sensor" (blue, ~5ms), "Make decision" (orange, ~1ms), "Move motor" (green, ~2ms), "Sleep 100ms" (gray, ~100ms).
- An animated "NOW" cursor moves along the timeline in real time.
- A "Speed" toggle button cycles through 1×, 5×, 10× animation speed.
- A "Loop #" counter in the top right increments each iteration.
- Hovering each segment type shows a tooltip with the MicroPython function name and approximate duration.

Learning objective (Bloom's Taxonomy — Understanding): students grasp that each loop iteration has distinct phases, and that sleep() determines the polling rate.

Responsive: redraw on window resize. Canvas min-width: 400px.
```

