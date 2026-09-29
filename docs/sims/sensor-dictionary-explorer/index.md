---
title: Sensor Dictionary Explorer
description: Read, update, and add entries in the robot dictionary by key, see each action as a line of MicroPython, and predict the KeyError for a key that does not exist yet.
image: /sims/sensor-dictionary-explorer/sensor-dictionary-explorer.png
og:image: /sims/sensor-dictionary-explorer/sensor-dictionary-explorer.png
twitter:image: /sims/sensor-dictionary-explorer/sensor-dictionary-explorer.png
social:
   cards: false
quality_score: 100
---

# Sensor Dictionary Explorer

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Sensor Dictionary Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/sensor-dictionary-explorer/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A **dictionary** stores pairs of keys and values. You find a value by its
name, not by its position. This MicroSim draws the chapter's `robot`
dictionary as a cabinet of drawers. Each drawer has a teal **key** tab on the
left and a **value** box on the right:

```python
robot = {"name": "Sparky", "speed": 75, "is_moving": True, "distance_cm": 30.5}
```

Pick a key and press a button. A yellow arrow points to the drawer you used,
the exact line of MicroPython appears on the right, and the console shows what
it prints.

- **Read** runs `print(robot["speed"])`. The value box glows green.
- **Update value** runs `robot["speed"] = 50`. The value box flashes yellow.
- **Add new key** runs `robot["battery_pct"] = 85`. A new drawer slides in
  with a blue outline, and `len(robot)` goes up by one.
- Reading a key that is not there, such as `battery_pct`, opens a red drawer
  with a lock: `KeyError: 'battery_pct'`.

Check **Compare to a list** to see the same four values stored as a list. Then
decide which is easier to read: `robot_list[1]` or `robot["speed"]`.

## How to Use

1. Choose a key from the **Key** menu. The **New value** box fills in a
   sensible example value for that key.
2. **Predict** what will happen, then press **Read**, **Update value**, or
   **Add new key**.
3. Type your own value to try numbers, `True` or `False`, or text.
4. Press **Reset** to go back to the four starting drawers.

This MicroSim goes with the dictionaries section of
[Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

15 minutes

### Prerequisites

- Variables and data types: strings, integers, floats, and booleans
  ([Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))
- Lists and indexing (Chapter 5, "Lists — Ordered Collections")
- Reading an error message such as `NameError` or `TypeError` (Chapter 4)

### Learning Objective

Students will be able to **apply** (Bloom's Taxonomy: Apply) dictionary syntax
to read, update, and add entries by key, and predict a `KeyError` when code
reads a key that does not exist.

### Activities

1. **Read every drawer (3 min).** Students read all four starting keys and
   write the printed value and its data type for each one.
2. **Predict the error (3 min).** Before pressing Read on `battery_pct`,
   students predict what will happen. Most predict `None` or `0`; the sim shows
   a `KeyError`.
3. **Fix it without changing the read line (4 min).** Students add
   `battery_pct`, then read it again. Discuss how the assignment line both
   updates existing keys and creates new ones.
4. **Dictionary vs list (5 min).** With **Compare to a list** on, students
   rewrite `robot_list[3]` and `robot_list[1]` as dictionary reads and explain
   which version a teammate could understand without looking up the order.

### Assessment

- **Challenge:** Read `battery_pct` first and get the `KeyError`. Then fix the
  error without changing the code line. *Answer:* use **Add new key** to set
  `battery_pct` to 85, then read it again and see 85.
- **Exit ticket:** "Write one line that changes the robot's speed to 40 and one
  line that adds a new key `wheel_cm` with the value 6.5." Both lines use the
  same `robot["key"] = value` form.
- **Rubric (4-point):** *Exemplary* writes correct read, update, and add lines,
  predicts the `KeyError`, and explains why dictionary keys make code easier to
  read than list indexes. *Proficient* writes all three lines correctly.
  *Developing* confuses keys with indexes (for example, `robot[1]`).
  *Beginning* cannot read a value by key.

## References

1. [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md) - the `robot` dictionary and the list/tuple/dictionary comparison table.
2. [Python Tutorial: Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries) - official guide to creating, reading, and updating dictionaries.
3. [Python Built-in Exceptions: KeyError](https://docs.python.org/3/library/exceptions.html#KeyError) - the error raised when a key is not found.
4. [Associative array (Wikipedia)](https://en.wikipedia.org/wiki/Associative_array) - background on key-value data structures.
5. [MicroPython builtin types](https://docs.micropython.org/en/latest/library/builtins.html) - the built-in `dict` type in MicroPython.
