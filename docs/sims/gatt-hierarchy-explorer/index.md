---
title: "GATT Hierarchy Explorer"
description: "Explore the follower robot's GATT tree of device, services, and characteristics, then act as the leader robot to read, write, or subscribe and see which operations each characteristic allows."
image: /sims/gatt-hierarchy-explorer/gatt-hierarchy-explorer.png
og:image: /sims/gatt-hierarchy-explorer/gatt-hierarchy-explorer.png
twitter:image: /sims/gatt-hierarchy-explorer/gatt-hierarchy-explorer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# GATT Hierarchy Explorer

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the GATT Hierarchy Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

When two BLE robots connect, they share data using **GATT**, the Generic Attribute Profile.
GATT organizes data like folders on a computer:

- A **device** is the robot itself. Here it is the follower, `RobotFollower`.
- A **service** is a category of related data. Each service has a **UUID**, a long ID number that no other service type shares.
- A **characteristic** is a single data slot inside a service. It holds the actual value, such as `b"FORWARD"`.

Each characteristic also has **properties** that say what the other robot may do with it:

| Property | What the leader can do |
|----------|------------------------|
| READ | ask for the current value |
| WRITE | put a new value in the slot |
| NOTIFY | subscribe, so the follower sends new values without being asked |

The tree on the left matches `gatts_register_services()` in the follower code from
[Chapter 12](../../chapters/12-bluetooth-low-energy/index.md).
Our code has one service and one characteristic, **Command**, with only the WRITE property (`_FLAG_WRITE = 0x0008`).
The dashed **Status** characteristic and the gray **Battery Service** are extra examples that are not in our code.
They are here so you can compare different properties.

## How to Use

1. Click any box in the tree. The **Details** panel shows its type, UUID, properties, and what it means.
2. With **Command** selected, pick a **Value** (or choose "custom..." and type your own) and press **Write**. Watch the message log and the robot's wheels.
3. Before you press a button, predict: will it work? Dimmed buttons are not allowed for the selected box. Press one anyway to read the reason.
4. Select **Status** and press **Subscribe (notify)**. The follower sends its status every 2 seconds. Press **Unsubscribe** to stop.
5. Type a UUID in **Look up UUID** and press **Look up**. A wrong UUID gives "No such attribute".
6. Press **Reset** to clear the log and start over.

**Try this challenge:** Which box holds the data that says "FORWARD"?
Which UUID would the leader look for to find it? Why can't the leader read the Command characteristic?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/gatt-hierarchy-explorer/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *classify* each part of a GATT tree as a device, service, characteristic, UUID, or property, and will *predict* which operations (read, write, notify) a characteristic allows from its properties (Bloom's Taxonomy: Understand).

### Grade Level

Grades 8–12

### Duration

15 minutes

### Prerequisites

- The GATT protocol, services, characteristics, and UUIDs from [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md).
- Central and peripheral roles from the same chapter.
- Hexadecimal numbers such as `0x0008`, used for pin and flag constants in earlier chapters.

### Activities

1. **Label the tree (4 min).** Without clicking, students write the type (device, service, or characteristic) of each of the five boxes and circle every UUID. They then click each box to check.
2. **Predict, then test (5 min).** For each characteristic, students fill in a table predicting whether Read, Write, and Subscribe will succeed, then test each prediction and record the message. Emphasize that the dimmed buttons are a hint, and the property badges are the reason.
3. **Trace a write (3 min).** Students write FORWARD to Command and match each log line to the follower code: `_IRQ_GATTS_WRITE`, `gatts_read(cmd_handle)`, and `execute_command()`.
4. **UUID precision (3 min).** Students look up the Command UUID, then change one digit and look it up again. Discuss why the leader must know the exact UUID to find the characteristic.

### Assessment

- **Formative:** Ask, "Which is the category and which is the data slot: the Robot Command Service or the Command characteristic?"
- **Exit ticket:** "A classmate wants the leader to read the follower's last command. What must change in the follower's `gatts_register_services()` call?" (Add `_FLAG_READ` to the Command characteristic's flags.)
- **Rubric (4-point):** *Exemplary* — correctly classifies all five boxes, predicts every operation before testing, and explains the exit-ticket change using flags. *Proficient* — correct classification and predictions for both characteristics. *Developing* — correct classification but predictions rely on trial and error. *Beginning* — confuses services with characteristics or believes data is stored in services.

## References

1. [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md) — the GATT service, the Command characteristic, and the follower code used in this sim.
2. [MicroPython `bluetooth` module](https://docs.micropython.org/en/latest/library/bluetooth.html) — documentation for `gatts_register_services()`, `gatts_read()`, and the `_FLAG_READ`, `_FLAG_WRITE`, and `_FLAG_NOTIFY` values.
3. [Introduction to Bluetooth Low Energy: GATT (Adafruit)](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt) — a beginner-friendly explanation of profiles, services, and characteristics.
4. [Assigned Numbers (Bluetooth SIG)](https://www.bluetooth.com/specifications/assigned-numbers/) — the official list of standard UUIDs, including 0x180F for the Battery Service.
5. [Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) — Wikipedia article on 128-bit UUIDs.
