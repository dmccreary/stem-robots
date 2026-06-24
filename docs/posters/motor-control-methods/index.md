---
title: Motor Control Methods Compared
description: An interactive comparison of H-bridge circuits, motor driver ICs, and single transistors for controlling DC motors — direction, speed, complexity, and cost — with a built-in quiz.
image: /posters/motor-control-methods/motor-control-methods-infographic.png
og:image: /posters/motor-control-methods/motor-control-methods-infographic.png
twitter:image: /posters/motor-control-methods/motor-control-methods-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students learning how microcontrollers drive DC motors in Chapter 6 (Electronics, DC Motors, and Communication Protocols).
Chapter: 6 — Electronics, DC Motors, and Communication Protocols

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares the three ways to control a DC motor from a microcontroller: the **H-Bridge Circuit** (the foundational four-switch concept), the **Motor Driver IC** (the practical integrated solution used on the Cytron board), and a **Single Transistor** (simplest on/off or PWM speed control, no direction reversal). Click each column to explore the details, then use **Quiz Me** to test your understanding.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Motor Control Methods Compared", subtitle beneath: "H-Bridge · Motor Driver IC · Single Transistor — three ways to drive a DC motor"

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a simple circuit schematic illustration at the top. A vertical row-label strip on the far left lists the attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (teal blue #1389A6): Header "H-Bridge Circuit"; Illustration: a simple H-bridge schematic — four switches (S1–S4) arranged in the letter H with a motor (M) in the center crossbar, power (+) at top and GND (−) at bottom. Label S1 (top-left), S2 (bottom-left), S3 (top-right), S4 (bottom-right). Rows:
    · Direction control: Yes — close S1+S4 for forward; S2+S3 for reverse
    · Speed control: Yes — PWM switches at high frequency to vary average voltage
    · Implementation: Four transistors (BJT or MOSFET) or mechanical switches
    · Shoot-through risk: Yes — closing S1+S2 or S3+S4 shorts the power supply
    · Protection diodes: Must be added externally (flyback/freewheeling diodes)
    · Complexity: Moderate — requires careful sequencing to avoid shoot-through
    · Cost: Low (discrete parts ~$0.50–$2) but higher design effort
    · On Cytron board: Concept — implemented inside the TB6612FNG-style IC
    · Best for: Understanding the principle behind all DC motor direction control

    Column 2 (raspberry red #C7164E): Header "Motor Driver IC"; Illustration: a small rectangular IC chip (labeled "TB6612FNG" or "DRV8833") with labeled pins — IN1, IN2, PWM, VM, GND, OUT1, OUT2 — and arrows showing the motor connected to OUT1/OUT2. Rows:
    · Direction control: Yes — IN1=HIGH IN2=LOW → forward; swap → reverse
    · Speed control: Yes — PWM pin duty cycle from 0% (stop) to 100% (full)
    · Implementation: Two complete H-bridges in one IC package
    · Shoot-through risk: No — built-in dead-time logic prevents it
    · Protection diodes: Built-in flyback diodes protect the MCU
    · Complexity: Low — simple logic-level pin control from MCU
    · Cost: Low (~$1–$3 per IC); pre-installed on Cytron Maker Pi RP2040
    · On Cytron board: Yes — two channels drive left and right motors
    · Best for: All robot projects in this course — safe, simple, integrated

    Column 3 (deep purple #6A3FB5): Header "Single Transistor"; Illustration: a simple NPN transistor circuit — MCU GPIO pin → resistor → Base; Collector → motor → power supply; Emitter → GND. Label the three terminals B (Base), C (Collector), E (Emitter). Rows:
    · Direction control: No — current always flows the same direction
    · Speed control: Yes — PWM on Base pin varies average motor current
    · Implementation: One NPN transistor (2N2222, TIP120) + base resistor
    · Shoot-through risk: None (only one switch)
    · Protection diodes: One flyback diode across motor terminals needed
    · Complexity: Very low — two components, one GPIO pin
    · Cost: Very low (~$0.10–$0.50 per transistor)
    · On Cytron board: Not used — motor driver IC handles this role
    · Best for: Simple on/off loads (fan, pump, one-direction conveyor)

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, circuit labels in monospace, numbers bold. Footer bar: "Sources: TB6612FNG dual motor driver datasheet (Toshiba) · Chapter 6 — Electronics, DC Motors, and Communication Protocols · general BJT transistor application notes." Overall: tidy vector flat-design infographic poster, three-column grid with circuit diagrams, suitable for a textbook or classroom screen.
