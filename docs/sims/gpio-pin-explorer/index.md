---
title: GPIO Pin Explorer
description: Students will explain the difference between a digital input pin and a digital output pin, and correctly map HIGH/LOW states to voltage levels and MicroPython boolean values.
image: /sims/gpio-pin-explorer/gpio-pin-explorer.png
og:image: /sims/gpio-pin-explorer/gpio-pin-explorer.png
twitter:image: /sims/gpio-pin-explorer/gpio-pin-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand (L2) — Explain how GPIO pins switch between input and output modes and how HIGH/LOW states map to voltage.
---

# GPIO Pin Explorer

<iframe src="main.html" width="100%" height="412" scrolling="no"></iframe>

[Run the GPIO Pin Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Students will explain the difference between a digital input pin and a digital output pin, and correctly map HIGH/LOW states to voltage levels and MicroPython boolean values.

**Bloom's Taxonomy level:** Understand (L2) — Explain how GPIO pins switch between input and output modes and how HIGH/LOW states map to voltage.

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/gpio-pin-explorer/main.html" width="100%" height="412" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Students will explain the difference between a digital input pin and a digital output pin, and correctly map HIGH/LOW states to voltage levels and MicroPython boolean values.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md)
- [MicroPython machine.Pin](https://docs.micropython.org/en/latest/library/machine.Pin.html)
- [General-purpose input/output (Wikipedia)](https://en.wikipedia.org/wiki/General-purpose_input/output)

## Specification

The full specification below is extracted from [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md).

```text
Type: microsim
**sim-id:** gpio-pin-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2) — Explain how GPIO pins switch between input and output modes and how HIGH/LOW states map to voltage.
Bloom Verb: Explain

Learning Objective: Students will explain the difference between a digital input pin and a digital output pin, and correctly map HIGH/LOW states to voltage levels and MicroPython boolean values.

Canvas layout:
- Left 55%: Visual schematic showing a simplified view of two GPIO pins — one connected to an LED with a resistor (output mode), one connected to a push button (input mode)
- Right 45%: Control panel with mode selector and data display

Visual elements:
- Schematic shows: an "RP2040" microcontroller block, a wire from GP15 to an LED and resistor, a wire from GP14 to a push button
- LED glows yellow when HIGH; is gray when LOW
- Button shows "pressed" vs "released" state visually (depressed outline vs raised)
- Voltage bar on each wire: 0.0 V to 3.3 V scale with animated fill
- Current mode label above each pin: "OUTPUT" or "INPUT"

Interactive controls (right panel):
- Dropdown: "Select Pin Mode" — Output or Input
- Toggle button: "Set HIGH / Set LOW" (active in Output mode)
- Toggle button: "Press Button / Release Button" (active in Input mode)
- Data display: Pin Mode, Voltage reading, MicroPython value (True / False)

Data Visibility Requirements:
Stage 1: Output mode, LOW — LED off, 0.0 V, value = False
Stage 2: Click "Set HIGH" — LED lights yellow, 3.3 V, value = True
Stage 3: Switch dropdown to Input — controls change to button toggle
Stage 4: Click "Press Button" — 3.3 V, value = True (pull-up keeps line high when pressed)
Stage 5: Click "Release Button" — 0.0 V, value = False

Default parameters:
- Mode: Output
- State: LOW (LED off)

Responsive behavior: Canvas redraws on window resize. Schematic and control panel maintain proportional widths. Voltage bars redraw correctly at all sizes.

Instructional Rationale: Step-through with concrete voltage values is appropriate for an Understand/Explain objective. Students need to see the exact voltage change when they toggle HIGH/LOW before they can explain the relationship between code and electricity. Continuous animation would obscure the binary nature of the two states.
```

