---
title: Cytron Maker Pi RP2040 Board Explorer
description: Students will identify each major component on the Cytron Maker Pi RP2040 board and state its function in the robot system.
image: /sims/cytron-board-explorer/cytron-board-explorer.png
og:image: /sims/cytron-board-explorer/cytron-board-explorer.png
twitter:image: /sims/cytron-board-explorer/cytron-board-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Remember (L1) — Identify the main components on the Cytron Maker Pi RP2040 board.
---

# Cytron Maker Pi RP2040 Board Explorer

<iframe src="main.html" width="100%" height="502" scrolling="no"></iframe>

[Run the Cytron Maker Pi RP2040 Board Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Students will identify each major component on the Cytron Maker Pi RP2040 board and state its function in the robot system.

**Bloom's Taxonomy level:** Remember (L1) — Identify the main components on the Cytron Maker Pi RP2040 board.

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/cytron-board-explorer/main.html" width="100%" height="502" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Students will identify each major component on the Cytron Maker Pi RP2040 board and state its function in the robot system.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md)
- [Cytron Maker Pi RP2040](https://www.cytron.io/p-maker-pi-rp2040)
- [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/)

## Specification

The full specification below is extracted from [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md).

```text
Type: infographic
**sim-id:** cytron-board-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Remember (L1) — Identify the main components on the Cytron Maker Pi RP2040 board.
Bloom Verb: Identify

Learning Objective: Students will identify each major component on the Cytron Maker Pi RP2040 board and state its function in the robot system.

Layout:
- Left 65% of canvas: Stylized top-view illustration of the Cytron Maker Pi RP2040 board showing component placement with labels
- Right 35% of canvas: Info panel that updates when the user clicks any labeled component

Components shown on the board illustration (each is a labeled, clickable region):
1. RP2040 chip — large square IC in the center
2. Raspberry Pi Pico module outline — dashed border showing the Pico footprint
3. USB Micro-B connector — left edge
4. Motor driver terminals (M1, M2) — blue screw terminals at the bottom
5. Grove connectors (GP0, GP1, GP2, GP4, GP16, GP17, GP26) — white 4-pin connectors along the edges
6. Onboard LEDs (13 total) — small circles adjacent to GPIO pin labels
7. Piezo buzzer — small circular component with label
8. Reset button — labeled square button
9. Boot button — labeled square button
10. Power terminal — large green screw terminal block

Info panel content displayed on click:
1. RP2040 Chip: "The brain. Dual-core ARM processor at up to 133 MHz. Executes your MicroPython code."
2. Pico module: "The Raspberry Pi Pico mounts here. Its 40 pins align with sockets on this board."
3. USB connector: "Plug your USB cable here to upload programs or to power the board from a laptop."
4. Motor drivers M1, M2: "Each channel drives one DC motor up to 1 A and can reverse direction. M1 = left motor, M2 = right motor."
5. Grove connectors: "Keyed 4-pin connectors for sensors. They only plug in one way — you cannot wire them backwards."
6. Onboard LEDs: "Each LED lights up when its GPIO pin goes HIGH. No extra wiring needed to see pin state."
7. Piezo buzzer: "Generates tones. Your code uses PWM to play notes or beep patterns."
8. Reset button: "Restarts the board without unplugging USB. Press once to reboot."
9. Boot button: "Hold this while plugging in USB to enter bootloader mode for firmware updates."
10. Power terminal: "Connect the AA battery pack here. Provides motor power independently of USB."

Visual style:
- Board drawn as a flat top-view illustration in the Cytron blue-green color palette
- Clickable regions glow orange on hover
- Active (clicked) region outlined in orange with info panel updating immediately
- Info panel: white text on dark navy background
- Transitions smooth when switching between components

Responsive behavior: Canvas redraws on window resize. Board illustration scales proportionally. Info panel always occupies the right column.

Instructional Rationale: Clicking labeled component regions at the Remember level builds part-name fluency before students handle physical hardware. Hover highlights prevent "where is it?" confusion during assembly.
```

