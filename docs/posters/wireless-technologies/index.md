---
title: Wireless Technologies Compared
description: An interactive comparison of WiFi, Bluetooth LE, and Classic Bluetooth — range, power, connection model, and robot use cases — with a built-in quiz.
image: /posters/wireless-technologies/wireless-technologies-infographic.png
og:image: /posters/wireless-technologies/wireless-technologies-infographic.png
twitter:image: /posters/wireless-technologies/wireless-technologies-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students adding wireless control to their STEM robots using the Raspberry Pi Pico W.
Chapter: 11 — Wireless Networking and Web Servers · 12 — Bluetooth Low Energy

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares the three wireless technologies relevant to this course: **WiFi** (router-based internet connectivity for browser control), **Bluetooth LE** (direct, low-power device-to-device links for robot-to-robot swarms), and **Classic Bluetooth** (included for context — not supported on the Pico W). Click each column to explore the details, then use **Quiz Me** to test your understanding.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Wireless Technologies Compared", subtitle beneath: "WiFi · Bluetooth LE · Classic Bluetooth — which wireless technology fits your robot?"

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a clean icon illustration at the top of the column. A vertical row-label strip on the far left lists the key attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (forest green #1A6B3C): Header "WiFi"; Illustration: a simple WiFi fan-arc icon (three curved arcs above a dot) in green, centered above the column. Rows:
    · Standard: IEEE 802.11 b/g/n (2.4 GHz)
    · Hardware: Infineon CYW43439 (built into Pico W)
    · Connection: Joins a router; gets an IP address via DHCP
    · Range: 30–100 m indoors
    · Speed: 10–100 Mbps
    · Power draw: Medium-high (~80–250 mA TX)
    · Robot use: HTTP web server — control from any browser
    · Best for: IoT, browser teleoperation, data logging

    Column 2 (raspberry red #C7164E): Header "Bluetooth LE"; Illustration: a stylized Bluetooth B-rune icon in red. Rows:
    · Standard: Bluetooth 4.0+ Low Energy, 2.4 GHz
    · Hardware: Same CYW43439 chip (WiFi and BLE share the antenna)
    · Connection: Advertise/scan — direct device-to-device, no router
    · Range: 10–50 m outdoors
    · Speed: 1–3 Mbps
    · Power draw: Very low — designed for coin-cell devices
    · Robot use: Central/peripheral GATT — robot-to-robot commands
    · Best for: Swarm robotics, wearables, direct phone control

    Column 3 (teal blue #1389A6): Header "Classic Bluetooth"; Illustration: the same Bluetooth B-rune but grayed out with a small red "NOT ON PICO W" badge. Rows:
    · Standard: Bluetooth 1.0–3.0 (BR/EDR), 2.4 GHz
    · Hardware: NOT supported by CYW43439 — needs external HC-05 module
    · Connection: Pairing with PIN; BR/EDR master/slave
    · Range: 10–100 m (Class 1 up to 100 m)
    · Speed: 1–3 Mbps (BR), up to 24 Mbps (EDR)
    · Power draw: Medium — higher than BLE
    · Robot use: HC-05/HC-06 UART module for serial Bluetooth (non-Pico W)
    · Best for: Audio streaming, legacy serial port replacement

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, numbers bold, monospace for technical specs. Footer bar: "Sources: Raspberry Pi Pico W datasheet (Infineon CYW43439) · Bluetooth Core Specification 5.3 · IEEE 802.11 standard." Overall: tidy vector flat-design infographic poster, three-column grid with wireless icons, suitable for a textbook or classroom screen.
