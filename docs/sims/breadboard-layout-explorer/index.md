---
title: Breadboard Layout Explorer
description: Students will explain which holes on a breadboard are electrically connected to each other, and correctly trace a circuit path from the power rail through a component to ground.
image: /sims/breadboard-layout-explorer/breadboard-layout-explorer.png
og:image: /sims/breadboard-layout-explorer/breadboard-layout-explorer.png
twitter:image: /sims/breadboard-layout-explorer/breadboard-layout-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand (L2) — Explain how the internal connections of a breadboard allow components to share electrical pathways.
---

# Breadboard Layout Explorer

<iframe src="main.html" width="100%" height="422" scrolling="no"></iframe>

[Run the Breadboard Layout Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Students will explain which holes on a breadboard are electrically connected to each other, and correctly trace a circuit path from the power rail through a component to ground.

**Bloom's Taxonomy level:** Understand (L2) — Explain how the internal connections of a breadboard allow components to share electrical pathways.

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/breadboard-layout-explorer/main.html" width="100%" height="422" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Students will explain which holes on a breadboard are electrically connected to each other, and correctly trace a circuit path from the power rail through a component to ground.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md)
- [Breadboard (Wikipedia)](https://en.wikipedia.org/wiki/Breadboard)
- [How to use a breadboard (SparkFun)](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard)

## Specification

The full specification below is extracted from [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md).

```text
Type: infographic
**sim-id:** breadboard-layout-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2) — Explain how the internal connections of a breadboard allow components to share electrical pathways.
Bloom Verb: Explain

Learning Objective: Students will explain which holes on a breadboard are electrically connected to each other, and correctly trace a circuit path from the power rail through a component to ground.

Layout:
- Left 70%: Top-view illustration of a standard 830-hole breadboard (63 rows × 10 columns plus 2 power rails per side)
- Right 30%: Info panel showing a plain-English description of the selected connection

Visual elements:
- Breadboard drawn in realistic detail: cream body, red and blue power rail stripes, column letters (a–e, f–j), row numbers (1–63)
- Center gap (DIP channel) shown as a dark groove labeled "IC channel — NOT connected across the gap"
- Holes rendered as small dark circles with hover glow

Interactivity:
- Hover any hole: cursor changes to pointer, hole glows orange
- Click any hole in a row (columns a–e): entire row a–e on that side lights yellow; info panel: "All five holes in this row (a–e, row N) are connected. This connection does NOT cross the center gap."
- Click any hole in a row (columns f–j): entire row f–j lights yellow; info panel shows same message for that side
- Click the red (+) power rail: entire red rail glows; info panel: "Connected to 3.3 V power. All holes in this rail column share the same voltage."
- Click the blue (−) power rail: entire blue rail glows; info panel: "Connected to GND (0 V). All holes in this rail column share ground."
- "Reset highlights" button clears all glowing holes

Info panel for each selection shows a small diagram of the connection path as a colored line tracing through the selected holes.

Responsive behavior: Canvas scales with window width. Breadboard illustration maintains aspect ratio. Info panel stacks below the breadboard on narrow viewports.

Instructional Rationale: Clicking holes to highlight invisible internal connections makes breadboard topology concrete and visible. Students build an accurate mental model before handling physical hardware, preventing the most common beginner mistake — assuming holes across the center gap are connected.
```

