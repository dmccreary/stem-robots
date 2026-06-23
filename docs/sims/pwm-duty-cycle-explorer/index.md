---
title: PWM Duty Cycle Explorer
description: Type: MicroSim **sim-id:** pwm-duty-cycle-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas split into two sections:  Top section (60% height): PWM waveform display. - Draw a squ...
image: /sims/pwm-duty-cycle-explorer/pwm-duty-cycle-explorer.png
og:image: /sims/pwm-duty-cycle-explorer/pwm-duty-cycle-explorer.png
twitter:image: /sims/pwm-duty-cycle-explorer/pwm-duty-cycle-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# PWM Duty Cycle Explorer

<iframe src="main.html" width="100%" height="402" scrolling="no"></iframe>

[Run the PWM Duty Cycle Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** pwm-duty-cycle-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas split into two sections:  Top section (60% height): PWM waveform display. - Draw a squ...

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/pwm-duty-cycle-explorer/main.html" width="100%" height="402" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** pwm-duty-cycle-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 400 canvas split into two sections:  Top section (60% height): PWM waveform display. - Draw a squ...

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md)
- [Pulse-width modulation (Wikipedia)](https://en.wikipedia.org/wiki/Pulse-width_modulation)
- [MicroPython machine.PWM](https://docs.micropython.org/en/latest/library/machine.PWM.html)

## Specification

The full specification below is extracted from [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md).

```text
Type: MicroSim
**sim-id:** pwm-duty-cycle-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas split into two sections:

Top section (60% height): PWM waveform display.
- Draw a square wave showing HIGH (3.3V) and LOW (0V) pulses.
- An orange horizontal dashed line shows the "average voltage" level.
- The waveform updates in real time as the duty cycle changes.
- Label the HIGH time (Ton) and LOW time (Toff) with arrows.

Bottom section (40% height): Controls and stats.
- A large horizontal slider "Duty Cycle" from 0% to 100%.
- Numeric display: "Duty Cycle: 50%", "Average Voltage: 1.65 V", "Motor Speed: ~50%".
- A small animated motor icon (spinning circle) whose rotation speed is proportional to the duty cycle.

Learning objective (Bloom's Taxonomy — Understanding): students connect duty cycle percentage to average voltage and motor speed.

Responsive: redraw on window resize.
```

