---
title: BLE Advertising and Scanning
description: A follower robot advertises over Bluetooth Low Energy while a leader robot scans, so students can see how distance, advertising interval, and scan window decide which packets are heard and how much power advertising uses.
image: /sims/ble-advertising-scanner/ble-advertising-scanner.png
og:image: /sims/ble-advertising-scanner/ble-advertising-scanner.png
twitter:image: /sims/ble-advertising-scanner/ble-advertising-scanner.png
social:
   cards: false
quality_score: 100
---

# BLE Advertising and Scanning

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the BLE Advertising and Scanning MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Before two Bluetooth Low Energy (BLE) robots can connect, one has to find the other.
The **follower** robot *advertises*: it sends a short "I'm here" packet over and over.
Each advertising event goes out on three radio channels, shown as blue, green, and orange rings.
The **leader** robot *scans*: it turns its radio on and listens for those packets.

Three things decide whether the leader hears a packet:

1. **Is the leader's radio on?** It only listens during the scan window, set by `ble.gap_scan(5000)` in
   [Chapter 12](../../chapters/12-bluetooth-low-energy/index.md). After that, the radio is sleeping.
2. **Is the follower close enough?** Every packet gets through in the near part of the range. Near the edge, some packets are lost. Past the edge, none get through. The dashed red circle shows how far the signal reaches in the chosen room.
3. **How often does the follower advertise?** The advertising interval is set by `ble.gap_advertise(100_000, ...)`. That number is in microseconds, so 100,000 means 100 ms.

The timeline puts a dot on every advertising packet: **green** if the leader heard it, **gray** if it was missed.
The readout shows the follower's current. Advertising more slowly uses less power, so the battery lasts longer.
The gray bar shows how much more current WiFi uses.

## How to Use

1. Press **Start scan**. Watch the rings, the green scan bar, and the dots on the timeline.
2. Drag the follower robot left or right, or use the **Distance** slider. Then scan again.
3. Change the **Environment**. Metal shelves shrink the reach to about 8 m.
4. Move the **Advertising interval** slider. Watch the follower current and the battery life.
5. Make the **Scan window** short, such as 300 ms. How many packets does the leader catch now?
6. Press **Reset** to go back to the starting settings.

**Try this challenge:** Put the follower at 15 m in the Classroom and press **Start scan** a few times.
Why does the leader sometimes miss packets? Then set the interval to 1000 ms.
What do you gain, and what do you lose?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/ble-advertising-scanner/main.html"
        height="552px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *explain* how the advertising interval, the scan window, and the distance between two robots together determine whether a BLE scanner hears an advertiser, and how the advertising interval trades discovery speed against current draw (Bloom's Taxonomy: Understand).

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Prerequisites

- BLE advertising, scanning, range, and power from [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md).
- The WiFi current figures from [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md), for comparison.
- Milliseconds and microseconds as units of time.

### Instructional Design Note

The objective is at the Understand level, so the sim runs one scan at a time rather than animating continuously. Each run produces a fixed record on the timeline (one dot per packet), which students can inspect and explain after the animation stops.

### Activities

1. **Baseline (3 min).** At default settings, students run one scan and read the counts. They explain why nearly every packet is heard (close range, radio on for the whole run).
2. **Three variables, one at a time (8 min).** Students run three short experiments and record *packets heard* and *first heard at*: distance 3 m vs. 15 m vs. 25 m (Classroom); scan window 5000 ms vs. 300 ms; interval 100 ms vs. 1000 ms. After each, they complete the sentence "A packet is heard only if..."
3. **Power trade-off (4 min).** Students compute battery life for 100 ms and 1000 ms intervals on a 1000 mAh pack and compare with WiFi at 80–150 mA. They argue which interval they would choose for a follower that must be found within one second.
4. **Transfer (3 min).** Students predict what happens to the real robots if the leader calls `gap_scan(1000)` while the follower advertises every 1000 ms, then test the prediction in the sim several times.

### Assessment

- **Formative:** Ask students to point to a gray dot inside the green scan bar and explain why it was missed (distance), and to a gray dot outside the bar (radio off).
- **Exit ticket:** "Your leader robot sometimes cannot find the follower across the room. Give two changes, one to each robot's code, that make discovery more reliable, and state the cost of each."
- **Rubric (4-point):** *Exemplary* — explains all three conditions (radio on, in range, advertising often enough) using timeline evidence and quantifies the power trade-off. *Proficient* — explains two conditions with evidence and states that a longer interval saves power. *Developing* — describes results without identifying the causes. *Beginning* — believes a scanner hears every packet within range at all times.

## References

1. [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md) — advertising, scanning, range, and power numbers used in this sim.
2. [MicroPython `bluetooth` module](https://docs.micropython.org/en/latest/library/bluetooth.html) — documentation for `gap_advertise()` (interval in microseconds) and `gap_scan()` (duration in milliseconds).
3. [Intro to Bluetooth Low Energy Advertisements (Bluetooth SIG)](https://www.bluetooth.com/bluetooth-resources/intro-to-bluetooth-advertisements/) — how advertising events and the three advertising channels work.
4. [Understanding Bluetooth Range (Bluetooth SIG)](https://www.bluetooth.com/learn-about-bluetooth/key-attributes/range/) — the factors that change how far a Bluetooth signal reaches.
5. [Bluetooth Low Energy](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) — Wikipedia overview of BLE and its low-power design.
6. [Received signal strength indicator](https://en.wikipedia.org/wiki/Received_signal_strength_indicator) — Wikipedia article on RSSI, the signal strength shown in the scan results.
