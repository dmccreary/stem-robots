---
title: Robot Control Modes Compared
description: An interactive comparison of open-loop, closed-loop, and teleoperated robot control — sensor use, reliability, code complexity, and when to choose each — with a built-in quiz.
image: /posters/robot-control-modes/robot-control-modes-infographic.png
og:image: /posters/robot-control-modes/robot-control-modes-infographic.png
twitter:image: /posters/robot-control-modes/robot-control-modes-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students learning how robots make decisions in Chapter 10 (Robot Behaviors and Autonomous Navigation).
Chapter: 10 — Robot Behaviors and Autonomous Navigation

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares the three fundamental ways to control a robot: **Open-Loop** (timed commands with no sensor feedback — dance routines), **Closed-Loop** (sensor-driven decisions — collision avoidance and line following), and **Teleoperated** (human-in-the-loop via WiFi browser or BLE). Click each column to explore the details, then use **Quiz Me** to test your understanding.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Robot Control Modes", subtitle beneath: "Open-Loop · Closed-Loop · Teleoperated — how does your robot make decisions?"

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a simple diagram icon at the top. A vertical row-label strip on the far left lists the attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (raspberry red #C7164E): Header "Open-Loop Control"; Illustration: a simple block-diagram arrow: "Program → Motor" with no feedback arrow — a single straight arrow from a box labeled "Program" to a wheel icon. Rows:
    · Sensor needed: None
    · Decision logic: Fixed timed commands in code
    · MicroPython: motor_on(); time.sleep(1); motor_off()
    · Example: Robot dance — drive forward 1 s, turn 0.5 s, repeat
    · Reliability: Drifts over time (wheel slip, battery drop)
    · Code complexity: Simple — no sensor reads required
    · Adapts to obstacles: No
    · Best for: Dance routines, scripted demos, intro labs

    Column 2 (deep purple #6A3FB5): Header "Closed-Loop Control"; Illustration: a feedback loop block diagram — "Sensor → Compare → Motor → World → Sensor" forming a closed circle with an arrow returning from the wheel back to the sensor box. Rows:
    · Sensor needed: Distance sensor (ToF, ultrasonic) or IR pair
    · Decision logic: Read sensor; compare to threshold; branch
    · MicroPython: while True: d=sensor.read(); if d<20: turn()
    · Example: Collision avoidance — stop and turn if wall < 20 cm
    · Reliability: Self-correcting; adapts to real conditions
    · Code complexity: Moderate — sensor reads + conditional logic
    · Adapts to obstacles: Yes — sensor feedback drives behavior
    · Best for: Collision avoidance, line following, any autonomous task

    Column 3 (teal blue #1389A6): Header "Teleoperated Control"; Illustration: a person icon with a phone/laptop sending a WiFi arc to a robot icon — human in the loop. Rows:
    · Sensor needed: Wireless radio (WiFi or BLE)
    · Decision logic: Human operator sends real-time commands
    · MicroPython: Parse HTTP POST or BLE packet; map to motor action
    · Example: Browser control page — tap Forward/Left/Right/Stop buttons
    · Reliability: Depends on wireless signal quality and operator skill
    · Code complexity: Moderate-high — web server or BLE stack needed
    · Adapts to obstacles: Yes — human judgment guides the robot
    · Best for: Competitions, remote demos, exploration tasks

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for MicroPython code snippets, numbers bold. Footer bar: "Sources: Chapter 10 — Robot Behaviors and Autonomous Navigation · Chapter 11 — Wireless Networking · Chapter 12 — Bluetooth Low Energy." Overall: tidy vector flat-design infographic poster, three-column grid with control-system diagram icons, suitable for a textbook or classroom screen.
