---
title: "BLE Connection Lifecycle"
description: "Step through how a leader and follower robot find each other, connect, send a command, and disconnect over Bluetooth Low Energy, with the IRQ event code and MicroPython call for every step."
image: /sims/ble-connection-lifecycle/ble-connection-lifecycle.png
og:image: /sims/ble-connection-lifecycle/ble-connection-lifecycle.png
twitter:image: /sims/ble-connection-lifecycle/ble-connection-lifecycle.png
social:
   cards: false
quality_score: 100
status: implemented
---

# BLE Connection Lifecycle

<iframe src="main.html" height="546px" width="100%" scrolling="no"></iframe>

[Run the BLE Connection Lifecycle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Two robots talk over Bluetooth Low Energy (BLE) in a fixed order.
This MicroSim shows each robot as a **state machine**: a set of states (the circles) with arrows showing how the robot moves from one state to the next.
The state each robot is in right now is **gold**.

- The **follower** is the *peripheral*. Its states are ADVERTISING, CONNECTED, and EXECUTING.
- The **leader** is the *central*. Its states are SCANNING, CONNECTING, CONNECTED, and SENDING.

Every time something happens, MicroPython calls the robot's `bt_irq()` function with an **event code**.
The dark badge under each robot shows the code that just fired, such as `_IRQ_CENTRAL_CONNECT (1)` on the follower or `_IRQ_PERIPHERAL_CONNECT (7)` on the leader.
The middle column shows which radio packet is on the air.
The code strip shows the exact call from the leader and follower code in
[Chapter 12](../../chapters/12-bluetooth-low-energy/index.md), and the log lists what each robot prints.

The normal path has eight steps:

1. The follower calls `advertise()`.
2. The leader calls `gap_scan(5000)`.
3. The leader gets `_IRQ_SCAN_RESULT (5)`, finds `b"RobotFollower"`, stops scanning, and calls `gap_connect()`.
4. Both robots get a connect event: 1 on the follower, 7 on the leader.
5. The leader calls `gattc_write()` with a command such as `b"FORWARD"`.
6. The follower gets `_IRQ_GATTS_WRITE (3)`, reads the command, and runs its motors.
7. The leader gets `_IRQ_GATTC_WRITE_DONE (17)`.
8. The leader calls `gap_disconnect()`. Both robots get a disconnect event: 2 and 8.

## How to Use

1. Press **Next Step** to move through the connection one step at a time, or **Auto Play** to step every 1.5 seconds.
2. Click any state circle to read what that state means.
3. When both robots are connected, press **Send FORWARD** or **Send STOP** to write another command.
4. Check **Walk out of range** while the robots are connected. The link drops after 3 seconds.
5. Change **Follower advertising name** to "Robot2" and step through again. Why does the leader never connect?
6. Press **Reset** to start over.

**Try this challenge:** After the disconnect, which robot starts advertising again by itself?
Which line of code makes that happen?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/ble-connection-lifecycle/main.html"
        height="546px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *sequence* the steps of a BLE connection (advertise, scan, connect, write, disconnect) and *match* each step to the IRQ event code and the MicroPython function call in the leader and follower programs (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12

### Duration

20–25 minutes

### Prerequisites

- Central and peripheral roles, connection pairing, IRQ callbacks, and the leader and follower code in [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md).
- Advertising and scanning, from the BLE Advertising and Scanning MicroSim in the same chapter.
- `if`/`elif` branches and functions from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

### Activities

1. **Annotate the code (6 min).** Students print the follower and leader code from Chapter 12. As they step through the sim, they write the step number next to the line of code that runs and circle the `bt_irq` branch that handles each event code.
2. **Event code table (4 min).** Students build a two-column table (follower events 1, 2, 3; leader events 5, 7, 8, 17) with the state change each event causes.
3. **Failure cases (6 min).** Students run the "Robot2" name and the "Walk out of range" cases. For each, they identify the step where the story changes and the line of code responsible (`if b"RobotFollower" in adv_data:` and the disconnect branches).
4. **Design question (4 min).** The sim notes that the chapter's leader code does not restart scanning after a disconnect. Students propose where to add `ble.gap_scan(5000)` so the leader reconnects automatically, and predict the new state sequence.

### Assessment

- **Formative:** Pause at step 4 and ask, "Which robot got event 1 and which got event 7? Why are there two different numbers for the same connection?"
- **Exit ticket:** "Put these in order and label each with its event code: leader connects, follower reads FORWARD, leader finds the follower, follower loses the leader."
- **Rubric (4-point):** *Exemplary* — correct eight-step order, every event code matched to the correct robot and `bt_irq` branch, and a working proposal for automatic reconnection. *Proficient* — correct order and most event codes matched. *Developing* — correct overall order but confuses central and peripheral events. *Beginning* — cannot order the steps or connect them to code.

## References

1. [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md) — the leader and follower programs and the IRQ event codes used in this sim.
2. [State Machine Diagram (Moving Rainbow)](https://dmccreary.github.io/moving-rainbow/sims/state-machine-diagram/) — the state-circle and gold current-state design this sim is based on.
3. [MicroPython `bluetooth` module](https://docs.micropython.org/en/latest/library/bluetooth.html) — documentation for `gap_advertise()`, `gap_scan()`, `gap_connect()`, `gattc_write()`, and the IRQ event codes.
4. [MicroPython Bluetooth examples](https://github.com/micropython/micropython/tree/master/examples/bluetooth) — official peripheral and central example programs.
5. [The Bluetooth Low Energy Primer (Bluetooth SIG)](https://www.bluetooth.com/bluetooth-resources/the-bluetooth-low-energy-primer/) — an overview of BLE roles, advertising, and connections.
6. [Finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) — Wikipedia article on state machines like the ones drawn here.
