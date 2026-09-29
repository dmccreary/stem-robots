---
title: Bluetooth Low Energy Fundamentals
description: Learn how Bluetooth Low Energy (BLE) enables direct robot-to-robot communication — explore advertising, scanning, GATT protocol, central and peripheral roles, then pair two Pico W robots and send movement commands between them using MicroPython's bluetooth module.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 15:25:00
version: 0.08
---

# Bluetooth Low Energy Fundamentals

!!! mascot-welcome "Welcome, maker — let's make two robots talk to each other!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    WiFi connects your robot to the internet through a router. Bluetooth Low Energy connects robots directly to each other — no router needed. In this chapter, one robot becomes the leader and another becomes the follower, communicating over a direct wireless link. That's the foundation for swarm robotics.

## Summary

This chapter introduces Bluetooth Low Energy as the communication backbone for
multi-robot coordination. Students learn how BLE differs from Classic Bluetooth and
WiFi in range, power, and latency, then explore the full BLE stack: advertising and
scanning, GATT protocol, service and characteristic definitions, and central/peripheral
roles. The chapter concludes with hands-on BLE pairing and message sending between two
Pico W robots using MicroPython's `bluetooth` module — the foundation for the swarm
robotics chapter that follows.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Bluetooth Overview
2. Bluetooth Low Energy BLE
3. BLE vs Classic Bluetooth
4. BLE vs WiFi Comparison
5. BLE Advertising
6. BLE Scanning
7. GATT Protocol
8. GATT Service Definition
9. GATT Characteristic
10. BLE Central Role
11. BLE Peripheral Role
12. BLE Connection Pairing
13. BLE Message Sending
14. bluetooth Module
15. BLE Range and Power
16. BLE Reliability

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Hardware Platform and Robot Assembly](../02-hardware-platform-assembly/index.md)
- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)
- [Chapter 11: Wireless Networking and Web Servers](../11-wireless-networking-web-servers/index.md)

---

## Bluetooth Overview

**Bluetooth** is a short-range wireless communication technology designed to connect devices directly — without a network router in between. It runs on the 2.4 GHz radio frequency band, the same band as WiFi, but uses a different protocol optimized for low power and direct device-to-device links.

Bluetooth was invented in 1994 (named after a Viking king who united Norse tribes — a nod to uniting communication protocols). Since then it has evolved significantly. The two main variants you will encounter today are **Classic Bluetooth** and **Bluetooth Low Energy (BLE)**.

Classic Bluetooth is designed for continuous data streaming — audio headphones, speakers, and file transfer. BLE is designed for infrequent, small data bursts — fitness trackers, heart rate monitors, smart locks, and now, robot-to-robot commands. The Pico W supports both, but this chapter focuses on BLE.

---

## BLE vs. Classic Bluetooth

Before comparing BLE to WiFi, let's compare BLE to Classic Bluetooth. These are two separate protocols that share the Bluetooth name but work very differently.

**Classic Bluetooth** (also called Bluetooth BR/EDR — Basic Rate/Enhanced Data Rate):

- Designed for audio and file transfer
- Continuous streaming capability
- Higher power consumption
- More complex pairing process
- Not ideal for microcontrollers

**Bluetooth Low Energy (BLE)**:

- Designed for small, infrequent data packets
- Very low power — a BLE device can run for months on a coin cell battery
- Simple pairing model
- Perfect for sensor data and robot commands
- Supported natively on Raspberry Pi Pico W

For robot-to-robot commands (strings like "FORWARD", "STOP", "LEFT"), BLE is the ideal choice. Commands are short, don't need to stream continuously, and BLE's low power is a bonus for battery-powered robots.

---

## BLE vs. WiFi Comparison

You used WiFi in Chapter 11 to build a web server. Why use BLE for robot-to-robot communication instead of WiFi?

Before the comparison table, here are the key differences in plain language: WiFi requires a router — if the router goes down, your robots lose communication. BLE connects devices directly, peer-to-peer — no router needed. BLE also uses much less power than WiFi, though it has shorter range.

| Feature | WiFi (Pico W) | BLE (Pico W) |
|---------|-------------|-------------|
| Requires router | Yes | No (direct peer connection) |
| Range | 30–50 m (indoors) | 10–30 m (indoors) |
| Power consumption | High (~80 mA during transmission) | Very low (~0.3 mA idle) |
| Data rate | High (Mbps) | Low (1–2 Mbps max, typical payloads < 20 bytes) |
| Latency | 10–50 ms | 1–10 ms |
| Setup complexity | Medium | Medium |
| Best for | Web servers, large data, internet access | Robot commands, sensor data, peer-to-peer |

For a swarm robotics lab where two robots talk to each other in a classroom, BLE is the better choice: faster response, no router dependency, lower power drain.

#### Diagram: WiFi vs BLE Communication Topology


<iframe src="../../sims/wifi-vs-ble-topology/main.html" width="100%" height="380px" scrolling="no"></iframe>
[Run WiFi vs BLE Communication Topology Fullscreen](../../sims/wifi-vs-ble-topology/main.html)

<details markdown="1">
<summary>Interactive diagram comparing WiFi (hub-and-spoke) and BLE (peer-to-peer) network topologies</summary>
Type: diagram
**sim-id:** wifi-vs-ble-topology<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a side-by-side Mermaid graph showing two network topologies:

Left subgraph "WiFi (via router)":
Browser -- HTTP --> Router -- WiFi --> Robot A
Robot B -- WiFi --> Router

Right subgraph "BLE (direct)":
Robot A (Central) -- BLE --> Robot B (Peripheral)

Use different node shapes: diamonds for routers, rectangles for robots/browsers.

Every node and connection has a click directive opening an infobox: Router infobox explains "single point of failure — if the router goes down, all robots lose contact." BLE connection infobox explains "direct peer link — works even without a network."

Canvas: 700 × 300 px. Responsive on window resize.
</details>

---

## BLE Advertising and Scanning

BLE communication begins with **advertising**. A BLE device in **advertising mode** broadcasts small packets of data on three special radio channels, repeatedly, at regular intervals (typically every 100–1000 ms). These packets say: "I'm here. Here's my name and some info about me."

A second device can **scan** the airwaves to detect advertising packets. The **scanning device** listens on those same channels, collects advertising packets it hears, and shows you a list of available BLE devices nearby.

This advertising/scanning model is one-way: the advertiser broadcasts, and any scanner nearby can hear it. No pairing is needed just to receive advertising data — it's like a public announcement.

After scanning, a scanner can choose to **connect** to an advertiser. Once connected, the two devices can exchange data in both directions using the **GATT protocol**.

### BLE Range and Power

**BLE range** depends heavily on the environment. In open air, BLE can reach 30–50 meters. Indoors, with walls and interference, expect 10–20 meters. For a classroom robot lab, this is more than adequate.

**BLE power** is the technology's strongest advantage for battery-powered devices. In advertising mode, the Pico W consumes about 1–2 mA. While connected and idle (no data being sent), it drops below 1 mA. Compare this to WiFi at 80–150 mA during active data transfer. For a robot running on a battery pack, BLE extends battery life dramatically.

#### Diagram: BLE Advertising and Scanning

This simulation shows a follower robot sending out advertising packets and a leader robot listening for them. You can move the robots apart, change how often the follower advertises, and see when the leader hears it.

<iframe src="../../sims/ble-advertising-scanner/main.html" width="100%" height="552px" scrolling="no"></iframe>
[Run BLE Advertising and Scanning Fullscreen](../../sims/ble-advertising-scanner/main.html){ .md-button }

<details markdown="1">
<summary>Watch advertising packets travel to a scanner and change interval, distance, and scan time</summary>
Type: microsim
**sim-id:** ble-advertising-scanner<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design

Learning objective: Explain (Bloom L2) — describe how an advertising interval, a scan window, and distance decide whether a scanner hears a BLE device, and how the advertising interval affects power use.

Canvas layout: total width responsive (max 800 px), height 580 px. The top 380 px is a floor view. The bottom 200 px has a timeline and a readout panel.

Visual elements:
- Floor view: a follower robot on the left (labeled "RobotFollower", peripheral) and a leader robot on the right (labeled "Leader", central). The follower can be dragged left and right. A distance ruler in meters runs along the bottom.
- Advertising packets: small rings that expand from the follower each time it advertises, in three quick pulses (blue, green, orange) for the three advertising channels. Rings fade at 50 m (open air).
- Range zones: soft shaded arcs at 5 m (green, "near-perfect"), 20 m (yellow, "indoor limit"), and 50 m (red, "open-air limit") using the numbers from the chapter.
- Scan window: on the leader, a bar under the robot shows "Scanning" (highlighted for the scan window) and "Sleeping" (gray) when the radio is off.
- Timeline: two rows. Row 1 shows each advertising event as a tick. Row 2 shows the scan window as a wide bar. A tick that falls inside the bar and inside the range is marked with a green dot "heard". Other ticks get a gray dot "missed".
- Readout panel: "Packets sent", "Packets heard", "First heard at: __ ms", "Follower current: __ mA" (about 1 to 2 mA), and "Battery life on 1000 mAh: __ hours".
- Scan results list (like a phone app): shows "RobotFollower, RSSI -62 dBm" once heard. RSSI gets weaker with distance.

Interactive controls:
- Draggable follower robot, or slider "Distance (m)": 1 to 60, default 3.
- Slider "Advertising interval (ms)": 100 to 1000, step 50, default 100 (matches `ble.gap_advertise(100_000, ...)`, which is in microseconds).
- Slider "Scan window (ms)": 50 to 5000, default 5000 (matches `ble.gap_scan(5000)`).
- Dropdown "Environment": "Open air" (range 50 m), "Classroom" (range 20 m, default), "Metal shelves in the way" (range 8 m).
- Button "Start scan", button "Reset".

Behavior: each advertising event happens every interval, plus a random delay of 0 to 10 ms. A packet is heard if the scanner radio is on at that moment and the distance is under the environment range. Beyond 80 percent of the range, each packet has a 50 percent chance of being lost, and beyond 100 percent it is always lost. Current in mA for advertising = 1.0 + 100 / interval (so about 2 mA at 100 ms and about 1.1 mA at 1000 ms). WiFi active is shown as a gray reference bar at 80 to 150 mA. Battery life = 1000 / current. When the scan ends (scan window time is up) and nothing was heard, show "Scan finished — no devices found" and suggest moving closer.

Default state: follower 3 m away, Classroom, interval 100 ms, scan 5000 ms, scan not started.

Assessment/Challenge: Put the follower at 15 m in the Classroom and press Start scan. Why does the leader sometimes take longer to hear it? Then set the interval to 1000 ms. What do you gain and what do you lose? (Answer: at 15 m some packets are lost, so the leader needs more tries. A longer interval saves battery but makes the first hear slower.)

Responsive: redraw on window resize.
</details>

The follower's `advertise()` function sets the interval, and the leader's `ble.gap_scan(5000)` sets the scan time. Advertising more slowly saves battery, but the leader needs more time to find it. If your robots do not find each other, move them closer and look at the range zones in the sim before you look at your code.

!!! mascot-thinking "Advertising without connecting"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    BLE advertising has a clever use: you can send data WITHOUT ever connecting. A fitness tracker broadcasts your heart rate in its advertising packet. Any compatible receiver can read it — no connection, no pairing. For robots that need to broadcast their position or status to everyone nearby, this is powerful. You'll see this used in swarm robotics in Chapter 13.

---

## The GATT Protocol

Once two BLE devices connect, they communicate using **GATT — the Generic Attribute Profile**. GATT is the data model that defines how information is organized and exchanged over a BLE connection.

GATT is built around a hierarchy: **Services** contain **Characteristics**, which hold the actual data.

### GATT Service Definition

A **GATT service** is a collection of related data and behaviors. Think of it as a category. Examples: "Robot Control Service", "Battery Service", "Temperature Service". Each service has a unique 128-bit **UUID** (Universally Unique Identifier) — a long number that identifies exactly that service type.

For this course, we define a custom service called the "Robot Command Service" with a UUID we choose.

### GATT Characteristic

A **GATT characteristic** is a single data value within a service. It's the actual slot where data lives. A characteristic also has a UUID, a data type, and permissions (readable, writable, notifiable).

For robot control, we define one characteristic: the **Command Characteristic**. The central (leader robot) writes a command string to this characteristic. The peripheral (follower robot) receives a notification and reads the value.

Before the code, here is the data flow: Central writes "FORWARD" to the Command Characteristic → Peripheral gets a `_IRQ_GATTS_WRITE` interrupt → Peripheral reads the value → Peripheral calls `go_forward()`.

```python
import bluetooth
import struct

# UUID for our custom robot command service
_SERVICE_UUID = bluetooth.UUID("12345678-1234-5678-1234-56789abcdef0")

# UUID for the command characteristic (writable by central)
_CMD_UUID = bluetooth.UUID("12345678-1234-5678-1234-56789abcdef1")
```

#### Diagram: GATT Hierarchy Explorer

This simulation shows the follower robot's data as a tree: the device holds a service, the service holds a characteristic, and the characteristic holds a value. You can click the parts, and act as the leader to read, write, or subscribe.

<iframe src="../../sims/gatt-hierarchy-explorer/main.html" width="100%" height="522px" scrolling="no"></iframe>
[Run GATT Hierarchy Explorer Fullscreen](../../sims/gatt-hierarchy-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Explore a device, service, characteristic tree and try read, write, and notify</summary>
Type: microsim
**sim-id:** gatt-hierarchy-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design

Learning objective: Classify (Bloom L2) — identify the device, service, characteristic, UUID, and property in a GATT tree, and predict which operations a characteristic allows.

Canvas layout: total width responsive (max 800 px), height 580 px. Left 400 px is the tree. Right 400 px has a detail panel (top 260 px) and a "Leader actions" panel with a message log (bottom 300 px).

Visual elements:
- Tree, drawn as nested boxes with lines: Level 0 "Device: RobotFollower" (OliveDrab). Level 1 "Service: Robot Command Service" with the UUID `12345678-1234-5678-1234-56789abcdef0` (blue). Level 1 "Service: Battery Service" (gray, marked "extra example, not in our code"). Level 2 under the robot service: "Characteristic: Command" with UUID `...abcdef1` (orange) and "Characteristic: Status" (orange, marked "optional, not in our code").
- Under each characteristic, a small value box, e.g. `b"FORWARD"`. Property badges show WRITE, READ, or NOTIFY. The Command characteristic has only WRITE (`_FLAG_WRITE = 0x0008`). The Status characteristic has READ and NOTIFY.
- Detail panel: shows the name, the type (device, service, or characteristic), the UUID, the properties, and the plain-English sentence "A category" or "A single data slot". Long UUIDs are shown in two lines.
- Message log: monospace lines such as `Central -> WRITE Command "FORWARD"` and `Peripheral IRQ: _IRQ_GATTS_WRITE`.
- A small follower robot icon that moves its wheels when a valid FORWARD write arrives.

Interactive controls:
- Click any box to select it and show details.
- Text input "Value" (default FORWARD) plus buttons "Read", "Write", and "Subscribe (notify)". Buttons are grayed out when the selected item does not allow that property.
- Dropdown "Command value": FORWARD, STOP, LEFT, RIGHT, or a custom text.
- Button "Reset".

Behavior: choose the Command characteristic and press Write. The log shows the write, the peripheral fires `_IRQ_GATTS_WRITE` (event 3), reads the value with `gatts_read`, and the robot icon runs the matching motor action. Press Read on Command: it is refused with "Not permitted: Command has no READ property." Choose Status and Subscribe: the peripheral then sends a notification every 2 s, with values like "OK" or "BUSY". Press Write on Status: refused with "Not permitted". Clicking a service or the device shows Read, Write, and Subscribe grayed out, with a note "Data lives in characteristics". A wrong UUID typed in a small "Look up UUID" field returns "No such attribute".

Default state: tree fully expanded, Command characteristic selected, log empty.

Assessment/Challenge: Which box holds the data that says "FORWARD"? Which UUID would the leader look for to find it? (Answer: the Command characteristic, `...abcdef1`, inside the service with UUID `...abcdef0`.) Also, why can you not read the Command characteristic? (Answer: it only has the WRITE property.)

Responsive: redraw on window resize.
</details>

The tree matches `gatts_register_services()` in the follower code. The service is the outer list. Each characteristic is an item inside the list with its own UUID and flags. The leader must find the right UUID before it can write.

---

## Central and Peripheral Roles

BLE connections are asymmetric — one device is the **central** and one is the **peripheral**. These roles are fixed for the duration of a connection.

### BLE Peripheral Role

The **peripheral** is the device that:
- Advertises its presence
- Waits for a central to connect
- Hosts the GATT server (owns the services and characteristics)
- Accepts writes from the central

In our robot pair, the **follower robot** is the peripheral. It advertises "Robot Follower" and waits for the leader to connect.

### BLE Central Role

The **central** is the device that:
- Scans for advertising peripherals
- Initiates the connection
- Reads and writes characteristics on the peripheral's GATT server

In our robot pair, the **leader robot** is the central. It scans for "Robot Follower", connects, and sends commands.

The following table summarizes the two roles:

| Attribute | Central (Leader) | Peripheral (Follower) |
|-----------|-----------------|----------------------|
| Network role | Scanner, initiates connection | Advertiser, accepts connection |
| GATT role | Client (reads/writes) | Server (hosts data) |
| Action | `connect()`, `write()` | `advertise()`, respond to writes |
| Robot analogy | Commander | Soldier |

---

## BLE Connection Pairing

**BLE connection pairing** in this context means two Pico W boards establishing a BLE link. Unlike Classic Bluetooth, BLE doesn't always require a numeric PIN — simple connections can be made without user interaction.

The sequence:
1. Peripheral starts advertising with a service UUID.
2. Central scans and finds the peripheral by its UUID or name.
3. Central calls `gap_connect()` to initiate the connection.
4. Both sides receive a `_IRQ_CENTRAL_CONNECT` (peripheral) or `_IRQ_PERIPHERAL_CONNECT` (central) interrupt event.
5. The connection is established. Central can now read/write characteristics.

The `bluetooth` module in MicroPython uses an **IRQ callback** (interrupt handler) to handle BLE events — connection, disconnection, write notifications. You register one callback function, and it receives all BLE events, distinguished by an event code.

#### Diagram: BLE Connection Lifecycle

This simulation follows the leader and follower robots from the first advertising packet to disconnect. Each step shows the event code that fires and what each robot does with it.

<iframe src="../../sims/ble-connection-lifecycle/main.html" width="100%" height="546px" scrolling="no"></iframe>
[Run BLE Connection Lifecycle Fullscreen](../../sims/ble-connection-lifecycle/main.html){ .md-button }

<details markdown="1">
<summary>Step through advertising, scanning, connecting, writing, and disconnecting with the IRQ event codes</summary>
Type: microsim
**sim-id:** ble-connection-lifecycle<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** dmccreary/moving-rainbow `state-machine-diagram` — https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/state-machine-diagram. Keep its state circles, highlighted current state, and clickable transitions. Replace the states with the two BLE robots, and add the event code panel and the message log.

Learning objective: Sequence (Bloom L3) — put the BLE connection steps in order and match each step to the IRQ event code and the function call in the leader and follower code.

Canvas layout: total width responsive (max 800 px), height 600 px. Two state machine columns of 300 px each: "Follower (peripheral)" and "Leader (central)". A 200 px middle column shows the radio link. A 160 px strip at the bottom shows the event log and code.

Visual elements:
- Follower states (circles): ADVERTISING, CONNECTED, EXECUTING. Leader states: SCANNING, CONNECTING, CONNECTED, SENDING. The active state on each side is gold. Other states are gray.
- Middle column: arrows that show the packets: "Advertising packet", "Connect request", "Write command", "Disconnect". A dashed radio wave drawn between the robots when a packet is on the air.
- Event badge above each robot: shows the code that just fired. Follower: `_IRQ_CENTRAL_CONNECT` (1), `_IRQ_GATTS_WRITE` (3), `_IRQ_CENTRAL_DISCONNECT` (2). Leader: `_IRQ_SCAN_RESULT` (5), `_IRQ_PERIPHERAL_CONNECT` (7), `_IRQ_GATTC_WRITE_DONE` (17), `_IRQ_PERIPHERAL_DISCONNECT` (8).
- Code strip: the exact call for the current step, for example `ble.gap_advertise(100_000, adv_data=payload)`, `ble.gap_connect(addr_type, addr)`, `ble.gattc_write(conn_handle, value_handle, b"FORWARD", 1)`, `ble.gap_disconnect(conn_handle)`.
- Log: time-stamped text lines like `[0.4 s] Found follower — connecting...`.
- Robot icons at the top of each column. The follower's wheels turn during EXECUTING.

Interactive controls:
- Button "Next Step", button "Auto Play" (1.5 s per step), button "Reset".
- Buttons "Send FORWARD" and "Send STOP" (enabled when both are connected).
- Toggle "Walk out of range" — the link drops.
- Toggle "Follower advertising name": "RobotFollower" (default) or "Robot2". With "Robot2", the leader's check `b"RobotFollower" in adv_data` fails.
- Click any state circle to read a plain-language definition.

Behavior: the normal path is: (1) follower calls `advertise()` and enters ADVERTISING. (2) Leader calls `gap_scan(5000)` and enters SCANNING. (3) Leader gets `_IRQ_SCAN_RESULT`, finds the name, stops the scan with `gap_scan(None)`, calls `gap_connect()`, and enters CONNECTING. (4) Both get a connect event (follower 1, leader 7). Follower enters CONNECTED, leader enters CONNECTED. (5) Leader calls `gattc_write()`. Follower gets `_IRQ_GATTS_WRITE` (3), reads the value, and enters EXECUTING, then returns to CONNECTED. (6) Disconnect: both get a disconnect event (follower 2, leader 8). The follower's `bt_irq` calls `advertise()` again, so it goes back to ADVERTISING. The leader goes to SCANNING only if the code restarts the scan. Show a note that the chapter's leader code does not restart it. If the name does not match, the leader stays in SCANNING until 5 s, then the log says "Scan finished — follower not found". "Walk out of range" removes the connection after 3 s with a disconnect event on both robots. Event badges and the log use exactly the constants from the chapter.

Default state: both robots in their first state (follower ADVERTISING, leader idle), step 0, empty log.

Assessment/Challenge: After a disconnect, which robot starts advertising again by itself, and which line of code does it? (Answer: the follower, because `bt_irq` calls `advertise()` when it gets `_IRQ_CENTRAL_DISCONNECT`.) Then use the "Robot2" toggle to find why the leader never connects.

Responsive: redraw on window resize.
</details>

Each state change in the sim is an event that reaches your `bt_irq` function. Read the sim next to the follower and leader code. Then you can find which branch of `bt_irq` runs at each step, and add a `print()` there to debug a real connection.

---

## The bluetooth Module

MicroPython's **`bluetooth` module** provides the low-level BLE interface. It is lower-level than many BLE libraries — you work directly with UUIDs, handles, and IRQ event codes. This gives you full control at the cost of more boilerplate code.

Before the code below, here is what each line does: `bluetooth.BLE()` creates the BLE driver object. `ble.active(True)` powers on the radio. `ble.irq(handler)` registers the callback function for all events.

```python
import bluetooth

ble = bluetooth.BLE()
ble.active(True)

def bt_irq(event, data):
    """Handle all BLE events."""
    if event == 1:    # _IRQ_CENTRAL_CONNECT
        print("Central connected!")
    elif event == 2:  # _IRQ_CENTRAL_DISCONNECT
        print("Central disconnected.")
    elif event == 3:  # _IRQ_GATTS_WRITE
        print("Data written to characteristic.")

ble.irq(bt_irq)
```

---

## BLE Message Sending — Peripheral (Follower) Code

Let's write the peripheral code for the follower robot. This robot advertises a service, waits for the leader to connect, and executes motor commands when the leader writes to the command characteristic.

```python
import bluetooth, struct
from machine import PWM, Pin
from micropython import const
import config

_IRQ_CENTRAL_CONNECT    = const(1)
_IRQ_CENTRAL_DISCONNECT = const(2)
_IRQ_GATTS_WRITE        = const(3)

_SERVICE_UUID = bluetooth.UUID("12345678-1234-5678-1234-56789abcdef0")
_CMD_UUID     = bluetooth.UUID("12345678-1234-5678-1234-56789abcdef1")
_FLAG_WRITE   = const(0x0008)

ble = bluetooth.BLE()
ble.active(True)

# Register service and characteristic
((cmd_handle,),) = ble.gatts_register_services([
    (_SERVICE_UUID, [
        (_CMD_UUID, _FLAG_WRITE),
    ]),
])

conn_handle = None

def bt_irq(event, data):
    global conn_handle
    if event == _IRQ_CENTRAL_CONNECT:
        conn_handle, _, _ = data
        print("Leader connected!")
    elif event == _IRQ_CENTRAL_DISCONNECT:
        conn_handle = None
        advertise()   # start advertising again
    elif event == _IRQ_GATTS_WRITE:
        _, attr_handle = data
        if attr_handle == cmd_handle:
            cmd = ble.gatts_read(cmd_handle).decode().strip()
            execute_command(cmd)

ble.irq(bt_irq)

def advertise(name="RobotFollower"):
    payload = bytearray()
    name_bytes = name.encode()
    payload += bytes([len(name_bytes) + 1, 0x09]) + name_bytes
    ble.gap_advertise(100_000, adv_data=payload)
    print(f"Advertising as '{name}'...")

def execute_command(cmd):
    print("Command received:", cmd)
    # Motor control calls go here — same functions as Chapter 10

advertise()
```

## BLE Message Sending — Central (Leader) Code

The central (leader) robot scans for the follower, connects, and periodically writes command strings to the command characteristic.

```python
import bluetooth, struct
from machine import Pin
from time import sleep
from micropython import const

_IRQ_SCAN_RESULT         = const(5)
_IRQ_PERIPHERAL_CONNECT  = const(7)
_IRQ_PERIPHERAL_DISCONNECT = const(8)
_IRQ_GATTC_WRITE_DONE    = const(17)

_SERVICE_UUID = bluetooth.UUID("12345678-1234-5678-1234-56789abcdef0")

ble = bluetooth.BLE()
ble.active(True)

conn_handle   = None
value_handle  = None
target_found  = False

def bt_irq(event, data):
    global conn_handle, target_found
    if event == _IRQ_SCAN_RESULT:
        addr_type, addr, adv_type, rssi, adv_data = data
        if b"RobotFollower" in adv_data:
            target_found = True
            ble.gap_scan(None)   # stop scanning
            ble.gap_connect(addr_type, addr)
            print("Found follower — connecting...")

    elif event == _IRQ_PERIPHERAL_CONNECT:
        conn_handle, _, _ = data
        print("Connected to follower!")

    elif event == _IRQ_PERIPHERAL_DISCONNECT:
        conn_handle = None
        print("Follower disconnected.")

ble.irq(bt_irq)
ble.gap_scan(5000)   # scan for 5 seconds

def send_command(cmd):
    if conn_handle is not None and value_handle is not None:
        ble.gattc_write(conn_handle, value_handle, cmd.encode(), 1)
        print(f"Sent: {cmd}")

# After connecting, discover services and find the write handle
# Then in the main loop:
try:
    while True:
        send_command("FORWARD")
        sleep(2)
        send_command("STOP")
        sleep(1)
except KeyboardInterrupt:
    if conn_handle:
        ble.gap_disconnect(conn_handle)
    print("Done.")
```

!!! mascot-encourage "BLE code is longer — that's okay"
    ![Sparky encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    The BLE code is more complex than anything we've written before. That's because BLE is a real, production wireless protocol — the same one in your phone's Bluetooth headphones. Understanding it fully takes time. Focus on the overall structure: peripheral advertises, central scans and connects, central writes, peripheral responds. The details fill in with practice.

---

## BLE Reliability

**BLE reliability** — the probability that a message gets through — is high but not perfect. Packet loss can occur from:

- Physical obstruction (metal shelving, thick concrete walls)
- Radio interference from other 2.4 GHz devices (other robots, WiFi)
- Distance exceeding the chip's range

Strategies to improve reliability:

1. **Keep robots close** — under 5 m for classroom use, you'll get near-perfect reliability.
2. **Retry on failure** — check the IRQ status code; if a write fails, retry once.
3. **Acknowledge with a response** — after the peripheral executes a command, it can write a response back to the central as confirmation.
4. **Reduce interference** — run robots on BLE while keeping WiFi on a separate channel, or disable WiFi while using BLE.

For the swarm robotics lab in Chapter 13, these reliability considerations directly affect whether leader-follower coordination works consistently. Test in the actual physical space before the formal lab.

---

## Key Takeaways

- **Bluetooth Low Energy (BLE)** connects devices directly — no router needed, very low power
- **BLE vs Classic Bluetooth:** BLE is for small data bursts; Classic is for audio streaming
- **BLE vs WiFi:** BLE needs no router, uses less power, has lower latency — ideal for robot-to-robot commands
- **Advertising** broadcasts device presence; **scanning** listens for advertisers
- **GATT protocol** organizes data into Services (categories) and Characteristics (data slots)
- **Peripheral** (follower) advertises and hosts the GATT server; **Central** (leader) scans, connects, and writes
- **BLE pairing** in MicroPython uses `bluetooth.BLE()`, `gap_advertise()`, `gap_connect()`, and an IRQ callback
- **BLE reliability** depends on distance and interference — stay under 5 m for classroom labs
- The `bluetooth` module provides the full BLE stack — lower level than WiFi but full control

!!! mascot-celebration "Two robots communicating wirelessly — you made that happen!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, engineer! You understand BLE advertising, GATT services, central and peripheral roles, and you wrote code that pairs two robots and sends commands between them. In Chapter 13, we take this further into swarm robotics — where groups of robots coordinate through BLE to exhibit collective behavior. The future of robotics is in your hands!

