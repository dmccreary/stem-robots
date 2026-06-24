---
title: STEM Robot Kits Compared
description: An interactive comparison of the Base Bot, WiFi Bot, and Display Bot kits — cost, components, capabilities, and which chapters each supports — with a built-in quiz.
image: /posters/robot-kits/robot-kits-infographic.png
og:image: /posters/robot-kits/robot-kits-infographic.png
twitter:image: /posters/robot-kits/robot-kits-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students and teachers choosing a robot kit configuration for the STEM Robots course.
Chapter: 2 — Hardware Platform and Robot Assembly

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares the three robot kit configurations used in this course: the **Base Bot** (~$18, motors + ToF sensor), the **WiFi Bot** (~$21, adds wireless Pico W for browser/BLE control), and the **Display Bot** (~$24, adds an OLED screen for on-board readouts). Click each column to explore the components and capabilities, then use **Quiz Me** to test your understanding.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "STEM Robot Kits Compared", subtitle beneath: "Base Bot · WiFi Bot · Display Bot — which kit is right for your project?"

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a simple top-view robot illustration at the top of each column. A vertical row-label strip on the far left lists the attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (raspberry red #C7164E): Header "Base Bot"; price badge "~$18" in a colored circle. Illustration: a simple top-view two-wheel robot with a rectangular Cytron board body, two motor+wheel assemblies at the sides, and a small VL53L0X sensor module at the front. Rows:
    · Microcontroller: Cytron Maker Pi RP2040
    · DC motors: 2 (built-in motor driver channels)
    · Distance sensor: VL53L0X ToF (I2C) — 3 to 120 cm
    · Display: None
    · Wireless: None (USB-tethered via Thonny)
    · LEDs: 2 NeoPixel RGB (on Cytron board)
    · Sound: Onboard piezo buzzer
    · Power: USB cable or 3× AA battery pack
    · Best for: First build, collision avoidance, dance programs
    · Key chapters: 6 (motors), 7 (PWM), 8 (sensors), 10 (navigation)

    Column 2 (teal blue #1389A6): Header "WiFi Bot"; price badge "~$21". Illustration: same robot top-view but with a Raspberry Pi Pico W board and a WiFi fan-arc symbol floating above it. Rows:
    · Microcontroller: Raspberry Pi Pico W (RP2040 + CYW43439)
    · DC motors: 2 (Cytron motor driver board)
    · Distance sensor: VL53L0X ToF (I2C) — 3 to 120 cm
    · Display: None
    · Wireless: WiFi 802.11 b/g/n + Bluetooth LE (built-in)
    · LEDs: 2 NeoPixel RGB (Cytron board)
    · Sound: Onboard piezo buzzer
    · Power: LiPo battery recommended for wireless operation
    · Best for: Browser control, BLE swarms, IoT projects
    · Key chapters: 11 (web server), 12 (BLE), 13 (swarm)

    Column 3 (deep purple #6A3FB5): Header "Display Bot"; price badge "~$24". Illustration: same robot top-view but with a small rectangular OLED screen visible on the top of the robot body showing "dist: 42 cm". Rows:
    · Microcontroller: Cytron Maker Pi RP2040
    · DC motors: 2 (built-in motor driver channels)
    · Distance sensor: VL53L0X ToF (I2C) — 3 to 120 cm
    · Display: SSD1306 128×64 OLED (I2C, same bus as ToF)
    · Wireless: None (USB-tethered)
    · LEDs: 2 NeoPixel RGB (on Cytron board)
    · Sound: Onboard piezo buzzer
    · Power: USB cable or battery pack
    · Best for: Live sensor readouts, portable demos, status HUD
    · Key chapters: 8 (sensors), 9 (display systems), any with added HUD

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, price badges bold, numbers bold. Footer bar: "Sources: Cytron Maker Pi RP2040 product page · Raspberry Pi Pico W datasheet · VL53L0X datasheet (STMicroelectronics) · SSD1306 datasheet." Overall: tidy vector flat-design infographic poster, three-column grid with robot top-view illustrations, suitable for a textbook or classroom screen.
