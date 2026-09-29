---
title: Transistor Switch Explorer
description: Raise and lower the voltage on a MOSFET's gate from an RP2040 GPIO pin and watch a tiny control current switch a motor current thousands of times larger.
image: /sims/transistor-switch-explorer/transistor-switch-explorer.png
og:image: /sims/transistor-switch-explorer/transistor-switch-explorer.png
twitter:image: /sims/transistor-switch-explorer/transistor-switch-explorer.png
social:
   cards: false
quality_score: 100
---

# Transistor Switch Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Transistor Switch Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/transistor-switch-explorer/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A **transistor** is an electronic switch that is turned on and off by
electricity. This MicroSim shows the kind of transistor inside your robot's
motor driver: an **N-channel MOSFET**. It has three terminals: the **gate**
(G), the **drain** (D), and the **source** (S).

- On the left, an **RP2040 GPIO** pin sends a small signal through a
  220 Ω resistor to the gate. This is the thin blue control path.
- On the right, a **6 V battery pack (4 x AA)** pushes current through the
  **DC motor**, then through the MOSFET from drain to source, and back to
  ground. This is the thick orange motor path.

When the gate voltage reaches **1.5 V**, the MOSFET turns on. Its symbol turns
green, the channel closes, and orange dots flow around the motor loop. The
meters on the right show the two currents side by side: a fraction of a
milliamp on the GPIO side, and hundreds of milliamps through the motor.

This sim uses a simplified model. The motor current rises in a straight line
from 1.5 V to 3.3 V. The gate current is shown as about 0.1 mA at 3.3 V so
the ratio can be computed; a real MOSFET gate draws almost no steady current
at all.

Check **Connect motor directly to GPIO** to see why we never wire a motor
straight to a pin. The motor tries to pull hundreds of milliamps, but a GPIO
pin can only give about 12 mA. The pin overloads and the motor barely turns.

## How to Use

1. Press **GPIO: LOW** to switch the pin HIGH (3.3 V). Press it again to go
   back to LOW (0 V).
2. Drag the **Gate voltage** slider slowly up from 0 V. Watch for the voltage
   where the MOSFET turns on and the motor current starts.
3. Choose **Stalled motor (blocked wheel)** from the **Load** menu and compare
   the motor current with the normal load.
4. Check **Connect motor directly to GPIO (no transistor)** and read the
   GPIO meter and the warning.
5. Move your mouse over the circuit to see the current dots and the motor
   shaft move.

This MicroSim goes with the transistor section of
[Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory electronics with a physical robot)

### Duration

15 minutes

### Prerequisites

- GPIO pins and HIGH/LOW digital outputs
  ([Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md) and
  [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))
- Voltage (volts) and current (milliamps) as basic ideas
- The idea that a motor needs much more power than an LED

### Learning Objective

Students will be able to **explain** (Bloom's Taxonomy: Understand) how a small
GPIO signal on a MOSFET's gate switches a much larger motor current, and why a
motor cannot be powered directly from a GPIO pin.

### Activities

1. **Find the threshold (3 min).** Students raise the gate voltage in 0.1 V
   steps and record the lowest voltage where motor current appears (1.5 V).
2. **Compare the currents (4 min).** At 3.3 V, students read both meters and
   the ratio line for the normal and stalled loads. They explain in one
   sentence what "small signal, big current" means.
3. **Try the shortcut (4 min).** Students turn on the direct connection and
   describe what happens to the pin and the motor. Discuss what could happen
   to a real RP2040 pin that is overloaded.
4. **Connect to the robot (4 min).** Students find the motor driver chip on
   the Cytron board (or a board photo) and explain which part of the sim it
   replaces.

### Assessment

- **Challenge:** Find the lowest gate voltage at which the motor starts to
  turn. *Answer:* 1.5 V. Then turn on **Connect motor directly to GPIO** and
  explain why the motor cannot work that way. *Answer:* the pin can only
  supply about 12 mA, and the motor needs hundreds of milliamps.
- **Exit ticket:** "Label the gate, drain, and source on a MOSFET symbol, and
  draw an arrow showing where the large motor current flows."
- **Rubric (4-point):** *Exemplary* explains the control path and motor path
  separately, names the threshold, and uses the current ratio as evidence.
  *Proficient* explains that a small gate signal switches a large motor
  current. *Developing* knows the transistor is a switch but believes the
  motor current comes from the GPIO pin. *Beginning* cannot say why the
  direct connection fails.

## References

1. [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md) - transistors as switches and why a GPIO pin cannot drive a motor.
2. [MOSFET (Wikipedia)](https://en.wikipedia.org/wiki/MOSFET) - how metal-oxide-semiconductor field-effect transistors work.
3. [Transistor (Wikipedia)](https://en.wikipedia.org/wiki/Transistor) - background on transistors as switches and amplifiers.
4. [Raspberry Pi RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf) - electrical specifications for the RP2040's GPIO pins.
5. [Transistor Circuit Diagrams (Moving Rainbow)](https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/transistor-circuit-diagrams) - the earlier transistor-switch MicroSim this one adapts.
