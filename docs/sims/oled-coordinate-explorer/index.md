---
title: OLED Coordinate System Explorer
description: Type: MicroSim **sim-id:** oled-coordinate-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.
image: /sims/oled-coordinate-explorer/oled-coordinate-explorer.png
og:image: /sims/oled-coordinate-explorer/oled-coordinate-explorer.png
twitter:image: /sims/oled-coordinate-explorer/oled-coordinate-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# OLED Coordinate System Explorer

<iframe src="main.html" width="100%" height="402" scrolling="no"></iframe>

[Run the OLED Coordinate System Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** oled-coordinate-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/oled-coordinate-explorer/main.html" width="100%" height="402" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** oled-coordinate-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 9: Display Systems and Visual Output](../../chapters/09-display-systems-output/index.md)
- [OLED (Wikipedia)](https://en.wikipedia.org/wiki/OLED)
- [MicroPython framebuf module](https://docs.micropython.org/en/latest/library/framebuf.html)

## Specification

The full specification below is extracted from [Chapter 9: Display Systems and Visual Output](../../chapters/09-display-systems-output/index.md).

```text
Type: MicroSim
**sim-id:** oled-coordinate-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Show a scaled-up representation of the 128×64 OLED display (rendered 4× actual size = 512×256 pixels on canvas).

Features:
- A black background rectangle representing the OLED screen.
- A grid overlay (toggle button "Show grid") showing pixel positions every 8 pixels.
- Mouse hover shows a tooltip: "Pixel: (x, y)" at the cursor position (in OLED coordinates, 0–127 x, 0–63 y).
- Four buttons: "Draw Text", "Draw Line", "Draw Circle", "Draw Rect".
  - Each button draws the corresponding element at a random position and displays the corresponding ssd1306 Python code in a code box below the display.
- A "Clear" button resets the display.

Learning objective (Bloom's Taxonomy — Applying): students practice placing drawing commands at specific coordinates and reading back the code equivalent.

Responsive: redraw on window resize.
```

