# Image Prompt: STEM Robot Kits Compared

## How to use this file

Copy the prompt below into ChatGPT (DALL·E 3), Gemini Imagen 3, or a similar
text-to-image model. Save the output as **`robot-kits-infographic.png`**
in this folder. The interactive zone overlay in `main.html` will then work automatically.

---

## Verification notes (do not include in image)

All specifications below were verified against:
- Cytron Maker Pi RP2040 product page and docs/setup/20-parts-list.md
- STMicroelectronics VL53L0X datasheet
- Solomon Systech SSD1306 datasheet
- Course documentation: docs/chapters/02-hardware-platform-assembly/index.md

Key corrections applied:
- Motor driver is MX1508 (not TB6612FNG) — confirmed in docs/chapters/06 and docs/kits/base/07
- MX1508 rated current: 1 A continuous, 1.5 A peak (5 s) — NOT 1.2 A / 3.2 A (those are TB6612FNG specs)
- VL53L0X: 3–120 cm default, up to 200 cm in long-range mode (both confirmed in STMicro datasheet)
- SSD1306: 128×64 pixels, monochrome (each pixel ON or OFF), I2C — confirmed
- Cytron board cost: ~$11 USD (Digikey / Cytron official), confirmed in parts list
- Cytron board has exactly 2 NeoPixel LEDs on GPIO 18, plus piezo buzzer with mute switch

---

## Image Generation Prompt

Please generate a wide-landscape comparison infographic poster.

Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows, columns, or statistics.

A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, on a light off-white background (#F7F9FC). Full-width title bar across the very top, dark slate (#2A2E3A): large bold white centered title "STEM Robot Kits Compared", subtitle "Base Bot · WiFi Bot · Display Bot — which kit is right for your project?"

Layout: EXACTLY THREE equal-width column cards side by side. Each card has a colored title bar with a price badge, then a top-view robot illustration, then a row-by-row attribute table. All three columns share the same top and bottom edge. Thin dividers between rows.

Column 1 — title bar solid raspberry red (#C7164E), white text:
Title: "Base Bot"
Price badge: a white filled circle with bold red text "~$18" centered in the title bar, right-aligned.
Top-view robot illustration: a simple flat top-view two-wheeled robot — a rounded rectangular board body (label "Cytron RP2040" on the body in small text), two DC motor + wheel assemblies extending from left and right sides, a small rectangular VL53L0X sensor module at the front center, two small glowing dots representing NeoPixels. Clean line art in white and light gray on a slightly darker red card background.
Attribute rows (label left, value right):
· Microcontroller: Cytron Maker Pi RP2040
· Motor driver: MX1508 — 1 A continuous
· Distance sensor: VL53L0X ToF (I2C)
· Sensor range: 3–120 cm (200 cm max)
· Display: None
· Wireless: None (USB-tethered)
· NeoPixels: 2× RGB (GPIO 18)
· Sound: Piezo buzzer + mute switch
· Power: USB or 3× AA batteries
· Best for: First build · Collision avoidance

Column 2 — title bar solid teal blue (#1389A6), white text:
Title: "WiFi Bot"
Price badge: white circle with bold teal text "~$21".
Top-view robot illustration: same robot shape as column 1, but the board is now labeled "Pico W" and a WiFi fan-arc symbol floats above the board in white, plus a Bluetooth rune symbol beside it, indicating wireless capability.
Attribute rows:
· Microcontroller: Raspberry Pi Pico W
· Motor driver: MX1508 — 1 A continuous
· Distance sensor: VL53L0X ToF (I2C)
· Sensor range: 3–120 cm (200 cm max)
· Display: None
· WiFi: 802.11 b/g/n — 2.4 GHz
· BLE: Bluetooth 5.2 LE — 1–10 ms latency
· WiFi + BLE simultaneous: Yes
· Power: LiPo recommended; also USB
· Best for: Browser control · BLE swarms

Column 3 — title bar solid deep purple (#6A3FB5), white text:
Title: "Display Bot"
Price badge: white circle with bold purple text "~$24".
Top-view robot illustration: same robot shape as column 1, but with a small rectangular OLED screen mounted on top of the board body displaying two lines of white text: "dist: 42 cm" on line 1 and "speed: 80%" on line 2 — in a tiny monospace font. The screen has a thin black border.
Attribute rows:
· Microcontroller: Cytron Maker Pi RP2040
· Motor driver: MX1508 — 1 A continuous
· Distance sensor: VL53L0X ToF (I2C)
· Sensor range: 3–120 cm (200 cm max)
· Display: SSD1306 — 128×64 px OLED
· Display type: Monochrome — each pixel ON or OFF
· I2C bus: ToF + OLED share one bus (diff addresses)
· Wireless: None (USB-tethered)
· Power: USB or battery pack
· Best for: Live sensor readouts · On-robot HUD

Footer bar (full width, light gray #E8ECF0):
"TIP: All three kits use the same VL53L0X ToF sensor and MX1508 motor driver — the differences are in wireless capability and display output.   Sources: Cytron Maker Pi RP2040 product page · STMicro VL53L0X datasheet · Solomon Systech SSD1306 datasheet"

Typography: Inter/Roboto sans-serif. Title bar bold white. Price badge bold. Row labels medium gray. Values dark slate, numbers bold. Three equal-width columns, classroom-display quality.
