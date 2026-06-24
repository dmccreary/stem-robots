# Image Prompt: Wireless Technologies Compared

## How to use this file

Copy the prompt below into ChatGPT (DALL·E 3), Gemini Imagen 3, or a similar
text-to-image model. Save the output as **`wireless-technologies-infographic.png`**
in this folder. The interactive zone overlay in `main.html` will then work automatically.

---

## Verification notes (do not include in image)

All specifications below were verified against:
- Infineon CYW43439 datasheet v05.00
- Raspberry Pi Pico W product brief
- Bluetooth Core Specification 5.2
- IEEE 802.11 standard

Key facts confirmed:
- CYW43439 supports 802.11b/g/n (2.4 GHz only, no 5 GHz)
- CYW43439 has BR/EDR hardware but official MicroPython exposes BLE only
- WiFi peak TX current measured at ~270 mA on Pico W forums
- BLE round-trip latency measured at 1–10 ms in practice
- WiFi typical indoor range 15–30 m (not 30–100 m as often cited)

---

## Image Generation Prompt

Please generate a wide-landscape comparison infographic poster.

Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows, columns, or statistics. Where a cell says "None" or "N/A", render that exactly.

A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, on a light off-white background (#F7F9FC). Title bar across the very top, full width, dark slate (#2A2E3A) background: large bold sans-serif centered title "Wireless Technologies Compared", subtitle line beneath it "WiFi · Bluetooth LE · Classic Bluetooth — which wireless technology fits your robot?"

Layout: EXACTLY THREE equal-width column cards arranged side by side, separated by narrow gutters, with equal left and right page margins. All three cards share the same top edge and bottom edge. Each card is a rounded-corner panel with a full-width colored title bar at the top; title bar text is centered and spans the full card width. Below each title bar, stack content top to bottom: (1) a centered wireless technology icon illustration, (2) a labeled row table listing key attributes. Use thin horizontal divider lines between rows. Generous white space, friendly textbook feel.

Column 1 — title bar solid forest green (#1A6B3C), white text:
Title: "WiFi"
Subtitle in title bar: "Internet-connected via a router"
Icon: a clean flat WiFi fan-arc icon — three concentric curved arcs above a filled dot, all in white on the green title bar background.
Attribute rows (left: gray label, right: dark value):
· Standard: 802.11 b/g/n — 2.4 GHz only
· Chip (Pico W): Infineon CYW43439
· Connection: Joins router via DHCP
· Typical indoor range: 15–30 m
· Speed: 10–100 Mbps
· Peak TX current: ~270 mA
· Round-trip latency: 7–30 ms (local LAN)
· Requires: Router + secrets.py
· Best for: Browser control · IoT · Data logging

Column 2 — title bar solid raspberry red (#C7164E), white text:
Title: "Bluetooth LE"
Subtitle in title bar: "Direct device-to-device link"
Icon: a clean flat Bluetooth symbol — the classic B-rune (angular ᛒ shape) in white on the red title bar background.
Attribute rows:
· Standard: Bluetooth 5.2 LE — 2.4 GHz
· Chip (Pico W): Same CYW43439 (shared antenna)
· Connection: Advertise / scan — no router
· Typical indoor range: 5–20 m
· Speed: 1–3 Mbps
· Power draw: 1–15 mA active (coin-cell capable)
· Round-trip latency: 1–10 ms
· Requires: Nothing — direct peer-to-peer
· Best for: Swarm robots · Phone control

Column 3 — title bar solid teal blue (#1389A6), white text:
Title: "Classic Bluetooth"
Subtitle in title bar: "BR/EDR — hardware present, MicroPython BLE only"
Icon: a Bluetooth symbol identical to column 2 but with a small orange caution triangle badge overlaid at bottom-right of the icon, indicating a limitation. White symbol on teal background.
Attribute rows:
· Standard: Bluetooth BR/EDR — 2.4 GHz
· Chip (Pico W): CYW43439 has BR/EDR hardware
· MicroPython: Official firmware exposes BLE only
· Typical indoor range: 10–30 m
· Speed: 1–3 Mbps (BR) · up to 24 Mbps (EDR)
· Power draw: Medium — higher than BLE
· Round-trip latency: 30–100 ms
· Requires: C SDK for BR/EDR on Pico W
· Best for: Audio · Legacy serial (not this course)

Footer bar (full width, below the three columns, light gray background #E8ECF0, dark text):
Left side — small lightbulb icon then: "TIP: WiFi and BLE can run simultaneously on the Pico W's CYW43439 chip via antenna time-sharing."
Right side — "Sources: Infineon CYW43439 datasheet · Raspberry Pi Pico W product brief · Bluetooth Core Spec 5.2"

Typography throughout: one clean geometric sans-serif (Inter or Roboto style). Column title bar text bold white. Row labels in medium gray (#6B7280). Row values in dark slate (#2A2E3A), bold for numbers. Overall: tidy vector flat-design poster, three equal-width columns, suitable for a classroom screen or printed A3 poster.
