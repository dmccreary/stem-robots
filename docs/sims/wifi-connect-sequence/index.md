---
title: WiFi Connect Sequence
description: A step-by-step sequence diagram of the Pico W WiFi connect code, with a running timeout clock and scenarios for success, a wrong password, a missing network, and a slow router.
image: /sims/wifi-connect-sequence/wifi-connect-sequence.png
og:image: /sims/wifi-connect-sequence/wifi-connect-sequence.png
twitter:image: /sims/wifi-connect-sequence/wifi-connect-sequence.png
social:
   cards: false
quality_score: 100
---

# WiFi Connect Sequence

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the WiFi Connect Sequence MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Your robot joins a WiFi network in a fixed order of steps.
This MicroSim shows each step as an arrow on a **sequence diagram**.
A sequence diagram has one vertical line for each thing that talks, and arrows for the messages between them.
Here the two lines are the robot and the access point (the router).

The steps are:

1. `WLAN(STA_IF)` creates the WiFi object in station mode.
2. `active(True)` turns on the WiFi chip.
3. `connect(SSID, PASSWORD)` asks the router to let the robot join. This call **returns right away**. It does not wait!
4. The router checks the password (**authentication**).
5. The router gives the robot an IP address with **DHCP**.
6. Meanwhile, the `while` loop calls `isconnected()` every 0.1 seconds until it returns `True` or the timeout runs out.
7. `ifconfig()[0]` reads the robot's IP address.

The code panel on the right is the connect code from
[Chapter 11](../../chapters/11-wireless-networking-web-servers/index.md).
The line that is running lights up. The orange bar shows the time since `start = ticks_ms()`.
The black mark on the bar is the timeout. The dark box at the bottom is the serial console, showing exactly what the robot prints.
The circle on the robot is a status light: orange while connecting, green when connected, and red when the connection fails.

## How to Use

1. Press **Next Step** to run one step at a time, or **Auto Play** to run them all.
2. At step 5 the loop starts. The clock runs by itself (at 2x speed) until the robot connects or gives up.
3. Pick a different **Scenario** and run it again. Watch the arrows, the `wlan.status()` value, and the console.
4. Move the **Timeout (s)** slider. The number in the `if ticks_diff(...)` line changes to match.
5. Uncheck **Use secrets.py** to see what the code looks like with the password typed right into `main.py`.

**Try this challenge:** Choose "Slow router (connects at 12 s)" with the default 10 second timeout.
The robot says it failed, even though the router was about to let it in.
Fix it using only the timeout slider.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/wifi-connect-sequence/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *sequence* the WiFi connection calls (`WLAN`, `active`, `connect`, polling `isconnected`, `ifconfig`) and *explain* the robot's behavior when the network is missing, the password is wrong, or the timeout expires (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Prerequisites

- WiFi, the WLAN object, and `isconnected()` from [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md).
- `ticks_ms()` and `ticks_diff()` non-blocking timing from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).
- The `secrets.py` pattern from [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).

### Activities

1. **Order the calls (4 min).** Before opening the sim, give students the seven calls on cut-up cards and ask them to put them in order. Then step through the Success scenario and have them correct their order. Emphasize that `connect()` returns before the connection exists.
2. **Failure analysis (6 min).** Students run "Wrong password" and "Network out of range" and record, for each, which arrow failed, the final `wlan.status()` value, how many times `isconnected()` was called, and the console output. They explain why both cases print the same message even though the causes differ.
3. **Timeout tuning (4 min).** Students run both slow-router scenarios. They find the smallest timeout that works for the 12 s router and discuss the trade-off: a long timeout tolerates slow routers but makes a real failure take longer to report.
4. **Secrets check (3 min).** Students uncheck "Use secrets.py" and explain what would be exposed if this `main.py` were pushed to a public repository.
5. **Debugging extension (optional).** Students modify the chapter code to print `wlan.status()` inside the loop, so the console reports the specific failure reason.

### Assessment

- **Formative:** Ask "At step 3, is the robot connected yet? How do you know?" Look for answers that reference the loop or the status value.
- **Exit ticket:** "Your robot prints `WiFi connection failed!`. List three different causes and one way to tell them apart." (Wrong password, network out of range or 5 GHz only, timeout too short; check `wlan.status()`.)
- **Rubric (4-point):** *Exemplary* — correct call order with the reason `connect()` must be followed by a polling loop, all three failure modes distinguished using status codes, and a justified timeout choice. *Proficient* — correct order and two failure modes explained. *Developing* — correct order, but failure explanations are generic. *Beginning* — cannot order the calls or treats `connect()` as blocking.

## References

1. [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md) — the WiFi connect code this sim steps through.
2. [MicroPython `network.WLAN`](https://docs.micropython.org/en/latest/library/network.WLAN.html) — documentation for `active()`, `connect()`, `isconnected()`, `ifconfig()`, and the `STAT_` status values.
3. [Connecting to the Internet with Raspberry Pi Pico W](https://datasheets.raspberrypi.com/picow/connecting-to-the-internet-with-pico-w.pdf) — Raspberry Pi's official guide to WiFi on the Pico W, including connection status codes.
4. [Dynamic Host Configuration Protocol](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) — Wikipedia article on how a router hands out IP addresses.
5. [Wireless access point](https://en.wikipedia.org/wiki/Wireless_access_point) — Wikipedia article on the device the robot connects to.
6. [Timeout (computing)](https://en.wikipedia.org/wiki/Timeout_(computing)) — Wikipedia article on why programs stop waiting after a set time.
