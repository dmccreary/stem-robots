---
title: Interactive Infographic Posters
description: Six interactive comparison infographic posters for the STEM Robots course — sensors, wireless, control modes, kits, and motor control.
hide:
  toc
---

# Infographic Posters for STEM Robots

These comparison infographic posters are designed for classroom display, hallway bulletin boards, and textbook reference. Each poster lets students click a column to explore facts and then switch to **Quiz Me** mode to test their understanding.

---

<div class="grid cards" markdown style="grid-template-columns: repeat(2, 1fr);">

-   **[Distance Sensors Compared](distance-sensors/index.md)**

    IR reflective · HC-SR04 ultrasonic · VL53L0X laser ToF — range, accuracy, and interface type.

-   **[Communication Protocols: I2C vs SPI](communication-protocols/index.md)**

    Two-wire I2C vs four-wire SPI — speed, wiring, addressing, and which devices use each.

-   **[Wireless Technologies Compared](wireless-technologies/index.md)**

    WiFi · Bluetooth LE · Classic Bluetooth — range, power, connection model, and robot use cases.

-   **[Robot Control Modes Compared](robot-control-modes/index.md)**

    Open-loop · Closed-loop · Teleoperated — how does your robot make decisions?

-   **[STEM Robot Kits Compared](robot-kits/index.md)**

    Base Bot · WiFi Bot · Display Bot — cost, components, and which chapters each supports.

-   **[Motor Control Methods Compared](motor-control-methods/index.md)**

    H-Bridge · Motor Driver IC · Single Transistor — three ways to drive a DC motor.

</div>

---

## Generating the Infographic Images

Each poster directory contains an **Image Prompt** section in its `index.md`. Copy that prompt into a text-to-image tool (ChatGPT, DALL·E 3, Midjourney, or similar) to generate the background illustration. Save the output as the PNG filename listed in `data.json` inside the same folder, then reload `main.html` to activate the interactive overlays.
