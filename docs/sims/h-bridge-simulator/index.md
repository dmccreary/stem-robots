---
title: H-Bridge Switch States
description: Type: MicroSim **sim-id:** h-bridge-simulator<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.
image: /sims/h-bridge-simulator/h-bridge-simulator.png
og:image: /sims/h-bridge-simulator/h-bridge-simulator.png
twitter:image: /sims/h-bridge-simulator/h-bridge-simulator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# H-Bridge Switch States

<iframe src="main.html" width="100%" height="402" scrolling="no"></iframe>

[Run the H-Bridge Switch States MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** h-bridge-simulator<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/h-bridge-simulator/main.html" width="100%" height="402" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** h-bridge-simulator<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)
- [H-bridge (Wikipedia)](https://en.wikipedia.org/wiki/H-bridge)
- [Motor controller (Wikipedia)](https://en.wikipedia.org/wiki/Motor_controller)

## Specification

The full specification below is extracted from [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md).

```text
Type: MicroSim
**sim-id:** h-bridge-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Draw an H-bridge circuit schematically:

- Four switch symbols at the four corners of an "H" shape (SW1 top-left, SW2 bottom-left, SW3 top-right, SW4 bottom-right).
- A motor symbol (circle with M) in the horizontal center bar.
- Power supply (V+) at top, Ground at bottom.
- Current flow shown as animated dots moving along the wire when switches are in a valid state.
- The dot color indicates direction: orange for forward, blue for reverse.

Three buttons: "Forward", "Reverse", "Stop". Clicking each:
- Updates switch states (green circle = closed, red circle = open).
- Animates current flow dots in the correct direction.
- Updates a text label: "Motor: FORWARD / REVERSE / STOPPED".

Hovering each switch shows a tooltip: "SW1 — top-left switch. Closed = connects motor terminal A to V+."

Learning objective (Bloom's Taxonomy — Analyzing): students trace current paths through the H-bridge to predict motor direction.

Responsive: redraw on window resize.
```

