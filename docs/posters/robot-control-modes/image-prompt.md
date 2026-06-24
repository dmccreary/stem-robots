# Image Prompt: Robot Control Modes Compared

## How to use this file

Copy the prompt below into ChatGPT (DALL·E 3), Gemini Imagen 3, or a similar
text-to-image model. Save the output as **`robot-control-modes-infographic.png`**
in this folder. The interactive zone overlay in `main.html` will then work automatically.

---

## Verification notes (do not include in image)

All facts below were verified against:
- Chapter 10 course documentation (Robot Behaviors and Autonomous Navigation)
- Chapter 11 (Wireless Networking and Web Servers)
- Chapter 12 (Bluetooth Low Energy)
- Measured Pico W WiFi ping data in docs/kits/wifi-bot/03-ping-test-fast.md

Key facts confirmed:
- Open-loop control has no sensor feedback — verified as standard control-theory definition
- Drift accumulates in open-loop — explicitly stated in Chapter 10 materials
- WiFi round-trip latency: 7–30 ms on local LAN (measured on Pico W, not theoretical)
- BLE round-trip latency: 1–10 ms (Chapter 12 comparison table)
- Collision avoidance and line following are closed-loop — confirmed in Chapter 10
- BLE is direct peer-to-peer; WiFi requires a router — confirmed Chapter 11/12

---

## Image Generation Prompt

Please generate a wide-landscape comparison infographic poster.

Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows, columns, or statistics.

A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, on a light off-white background (#F7F9FC). Full-width title bar across the very top, dark slate (#2A2E3A) background: large bold white sans-serif centered title "Robot Control Modes", subtitle "Open-Loop · Closed-Loop · Teleoperated — how does your robot make decisions?"

Layout: EXACTLY THREE equal-width column cards side by side, equal margins, shared top and bottom edges. Each card has a colored title bar at top, then a block-diagram icon illustration, then a row-by-row attribute table. Thin horizontal dividers between rows. Friendly textbook feel.

Column 1 — title bar solid raspberry red (#C7164E), white text:
Title: "Open-Loop Control"
Subtitle in title bar: "Pre-timed commands — no feedback"
Block diagram icon: a simple two-box horizontal arrow diagram — a box labeled "Program" with a right-pointing arrow leading to a wheel/motor icon labeled "Motor". NO return arrow. Clean flat line art in white on red background.
Attribute rows:
· Sensor needed: None
· Decision source: Fixed timed commands
· MicroPython: motor_on(); sleep(1); motor_off()
· Course example: Robot dance — timed sequences
· Drift over time: Yes — wheel slip, battery drop
· Code complexity: Simple — no sensor reads
· Adapts to obstacles: No
· Best for: Dance routines · Scripted demos

Column 2 — title bar solid deep purple (#6A3FB5), white text:
Title: "Closed-Loop Control"
Subtitle in title bar: "Sensor feedback — robot adapts"
Block diagram icon: a circular feedback loop — four boxes arranged in a clockwise cycle: "Sense" → "Compare" → "Act" → "World" → back to "Sense". Draw the cycle as clean rounded arrows connecting the four boxes. White line art on purple background.
Attribute rows:
· Sensor needed: ToF / ultrasonic / IR pair
· Decision source: Sensor reading vs. threshold
· MicroPython: if tof.read() < 20: turn()
· Course example: Collision avoidance · Line following
· Drift over time: No — self-correcting feedback
· Code complexity: Moderate — sensor + conditionals
· Adapts to obstacles: Yes — sensor drives behavior
· Best for: Collision avoidance · Line following

Column 3 — title bar solid teal blue (#1389A6), white text:
Title: "Teleoperated Control"
Subtitle in title bar: "Human pilot — WiFi or BLE"
Block diagram icon: a person silhouette icon on the left holding a phone/tablet, with a double-headed wireless arc (WiFi ripple lines) in the center, and a small robot icon on the right. White flat line art on teal background.
Attribute rows:
· Sensor needed: WiFi or BLE radio
· Decision source: Human operator (real-time)
· WiFi latency: 7–30 ms (local LAN, Pico W)
· BLE latency: 1–10 ms (direct peer-to-peer)
· Course example: Browser control page · BLE swarm
· Requires router: WiFi yes · BLE no
· Code complexity: Moderate-high — server or BLE stack
· Best for: Competitions · Remote demos

Footer bar (full width, light gray #E8ECF0):
"TIP: Real robots often combine modes — closed-loop collision avoidance running underneath teleoperated steering is a common safety pattern.   Sources: Chapter 10 — Robot Behaviors and Autonomous Navigation · Chapters 11–12 — Wireless and BLE"

Typography: Inter/Roboto style sans-serif. Title bar text bold white. Row labels medium gray. Values dark slate, bold for code snippets and numbers. Three equal-width columns, classroom-display quality.
