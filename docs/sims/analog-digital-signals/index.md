---
title: Analog vs Digital Signal Comparison
description: Type: MicroSim **sim-id:** analog-digital-signals<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 350 canvas split into two panels side by side.  Left panel — "Analog Signal": - Shows a smooth sin...
image: /sims/analog-digital-signals/analog-digital-signals.png
og:image: /sims/analog-digital-signals/analog-digital-signals.png
twitter:image: /sims/analog-digital-signals/analog-digital-signals.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# Analog vs Digital Signal Comparison

<iframe src="main.html" width="100%" height="352" scrolling="no"></iframe>

[Run the Analog vs Digital Signal Comparison MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** analog-digital-signals<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 350 canvas split into two panels side by side.  Left panel — "Analog Signal": - Shows a smooth sin...

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/analog-digital-signals/main.html" width="100%" height="352" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** analog-digital-signals<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 350 canvas split into two panels side by side.  Left panel — "Analog Signal": - Shows a smooth sin...

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)
- [Analog-to-digital converter (Wikipedia)](https://en.wikipedia.org/wiki/Analog-to-digital_converter)
- [Digital signal (Wikipedia)](https://en.wikipedia.org/wiki/Digital_signal)

## Specification

The full specification below is extracted from [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md).

```text
Type: MicroSim
**sim-id:** analog-digital-signals<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 350 canvas split into two panels side by side.

Left panel — "Analog Signal":
- Shows a smooth sine wave drawn in orange.
- A vertical dashed line follows the mouse X position and displays the voltage value at that point.
- Label: "Voltage: X.XX V"

Right panel — "Digital Signal":
- Shows a square wave (PWM-like) in blue — high and low states with sharp transitions.
- Same vertical cursor showing "HIGH (3.3V)" or "LOW (0V)" at the cursor position.

Below both panels, a "Signal Type" dropdown lets the student switch the left panel between: Sine wave, Potentiometer (sawtooth ramp), Microphone (noise).

Learning objective (Bloom's Taxonomy — Understanding): students distinguish continuous analog signals from discrete digital signals and understand why ADC conversion is needed.

Responsive: redraw on window resize.
```

