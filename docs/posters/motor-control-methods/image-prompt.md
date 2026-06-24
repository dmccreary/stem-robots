# Image Prompt: Motor Control Methods Compared

## How to use this file

Copy the prompt below into ChatGPT (DALL·E 3), Gemini Imagen 3, or a similar
text-to-image model. Save the output as **`motor-control-methods-infographic.png`**
in this folder. The interactive zone overlay in `main.html` will then work automatically.

---

## Verification notes (do not include in image)

All specifications below were verified against:
- Toshiba TB6612FNG datasheet (used as the general "Motor Driver IC" example)
- Cytron Maker Pi RP2040 documentation (MX1508 is the actual on-board chip)
- Course documentation: docs/chapters/06-electronics-motors-protocols/index.md
- docs/lessons/16-h-bridge.md

Key facts confirmed:
- H-bridge shoot-through: caused by closing S1+S2 OR S3+S4 (same leg), not diagonals — confirmed
- TB6612FNG: 1.2 A continuous, 3.2 A peak per channel — verified from Toshiba datasheet
- MX1508 (Cytron board): 1 A continuous, 1.5 A peak (5 s) — from Cytron docs
- TB6612FNG has built-in dead-time logic and flyback diodes — verified
- Single transistor cannot reverse a motor (current one-directional) — verified
- Flyback diode required across motor for transistor circuit — verified

---

## Image Generation Prompt

Please generate a wide-landscape comparison infographic poster.

Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows, columns, or statistics.

A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, on a light off-white background (#F7F9FC). Full-width title bar across the very top, dark slate (#2A2E3A): large bold white centered title "Motor Control Methods Compared", subtitle "H-Bridge · Motor Driver IC · Single Transistor — three ways to drive a DC motor"

Layout: EXACTLY THREE equal-width column cards side by side, equal margins. Each card has a colored title bar, then a circuit schematic illustration, then a row-by-row attribute table. Thin dividers between rows.

Column 1 — title bar solid teal blue (#1389A6), white text:
Title: "H-Bridge Circuit"
Subtitle in title bar: "Four switches — forward and reverse"
Circuit schematic illustration: draw a clean H-bridge schematic in white line art on a slightly darker teal card background.
- Power supply (+V) at the top center, GND (−) at the bottom center
- Four switches arranged as an H: S1 (top-left), S2 (bottom-left), S3 (top-right), S4 (bottom-right)
- A DC motor symbol (M in a circle) connected between the center-left and center-right nodes (the crossbar of the H)
- Label each switch with its number: S1, S2, S3, S4
- Small arrow showing forward current direction when S1+S4 closed
- A small red warning badge near S1+S2 labeled "⚠ Short!" to show the danger of closing same-leg switches
Attribute rows:
· Direction control: Yes — diagonal switch pairs
· Forward: Close S1 + S4
· Reverse: Close S2 + S3
· Brake: Close S2 + S4 (both low-side)
· Danger: S1+S2 or S3+S4 = shoot-through short
· Shoot-through protection: Must be designed in
· Flyback diodes: Must be added externally
· Complexity: Moderate — timing must be correct
· Cost: ~$0.50–$2 (discrete parts)
· Best for: Learning the concept; discrete builds

Column 2 — title bar solid raspberry red (#C7164E), white text:
Title: "Motor Driver IC"
Subtitle in title bar: "Integrated H-bridge — the practical choice"
Circuit schematic illustration: draw a flat rectangular IC chip in white line art on a slightly darker red background.
- Chip body: a rectangle labeled "MOTOR DRIVER IC" (e.g., MX1508 / TB6612FNG)
- Left side pins labeled from top: IN1, IN2, PWM, GND
- Right side pins labeled: OUT1, OUT2, VM (motor supply)
- Two arrow lines leaving OUT1 and OUT2, connecting to a DC motor symbol (M in a circle) below
- A small green shield icon near the chip body labeled "Protection" indicating built-in diodes
Attribute rows:
· Direction control: Yes — IN1/IN2 logic pins
· Forward: IN1=HIGH, IN2=LOW
· Reverse: IN1=LOW, IN2=HIGH
· Brake: IN1=LOW, IN2=LOW
· PWM pin: Sets speed 0%–100% duty cycle
· Shoot-through: Prevented by built-in dead-time
· Flyback diodes: Built-in — protects the MCU
· On Cytron board: MX1508 — 1 A cont., 1.5 A peak
· Common alternative: TB6612FNG — 1.2 A cont., 3.2 A peak
· Best for: All course robots — safe and simple

Column 3 — title bar solid deep purple (#6A3FB5), white text:
Title: "Single Transistor"
Subtitle in title bar: "PWM speed only — no direction reversal"
Circuit schematic illustration: draw a simple NPN transistor circuit in white line art on a slightly darker purple background.
- Power supply (+V) at top
- Motor symbol (M in a circle) connected between +V and the Collector (C) terminal
- NPN transistor symbol with three labeled terminals: B (Base, left), C (Collector, top), E (Emitter, bottom)
- A resistor symbol on the Base line labeled "~1 kΩ"
- GPIO pin connection to the left of the resistor labeled "MCU GPIO"
- GND at the bottom connected to Emitter
- A flyback diode symbol in parallel with the motor symbol, with a small label "Flyback diode (required)"
- A one-way arrow alongside the motor showing current flows down only — labeled "One direction only"
Attribute rows:
· Direction control: No — current one direction only
· Speed control: Yes — PWM duty cycle on Base
· Forward: GPIO HIGH → transistor ON
· Reverse: Not possible — needs full H-bridge
· Flyback diode: Required externally (back-EMF)
· Shoot-through: Not applicable (one switch)
· Common parts: 2N2222 (small) · TIP120 (large)
· Complexity: Very simple — 2 components
· Cost: ~$0.10–$0.50 per transistor
· Best for: Fans · Pumps · One-direction loads

Footer bar (full width, light gray #E8ECF0):
"TIP: The Cytron Maker Pi RP2040 includes a built-in MX1508 motor driver IC — no extra components needed for two-motor direction and speed control.   Sources: Toshiba TB6612FNG datasheet · Cytron Maker Pi RP2040 docs · Chapter 6 — Electronics, DC Motors, and Communication Protocols"

Typography: Inter/Roboto sans-serif. Title bar bold white. Row labels medium gray (#6B7280). Values dark slate (#2A2E3A), bold for numbers and pin names. Three equal-width columns with circuit diagram illustrations. Classroom-display quality.
