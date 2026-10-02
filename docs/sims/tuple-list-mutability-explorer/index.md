---
title: "Tuple vs List Mutability"
description: "Run the same operation on a list and a tuple that hold the same robot data, see which changes work and which raise a TypeError, and choose the right container for fixed hardware values."
image: /sims/tuple-list-mutability-explorer/tuple-list-mutability-explorer.png
og:image: /sims/tuple-list-mutability-explorer/tuple-list-mutability-explorer.png
twitter:image: /sims/tuple-list-mutability-explorer/tuple-list-mutability-explorer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Tuple vs List Mutability

<iframe src="main.html" height="422px" width="100%" scrolling="no"></iframe>

[Run the Tuple vs List Mutability MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/tuple-list-mutability-explorer/main.html"
        height="422px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Lists and tuples both hold values in order, and you read them the same way:
`motor_pins[0]`. The difference is that a **list** can change after you make
it, and a **tuple** cannot. A tuple is **immutable**, which means "cannot be
changed."

This MicroSim stores the same robot data twice: as a list on the left (blue
boxes with square brackets) and as a tuple on the right (gray boxes with round
brackets and a padlock). You pick one operation and run it on both at once.

- **Read item 0** and **Loop over all items** work on both.
- **Change item 0**, **Append a value**, and **Remove the last item** work on
  the list only. The changed box flashes yellow. The tuple refuses: its padlock
  shakes and a red bubble shows the real MicroPython error, such as
  `TypeError: 'tuple' object doesn't support item assignment`.

The console at the bottom keeps a running tally of how many changes worked on
the list and how many were blocked by the tuple.

The `motor_pins` data set uses GP8, GP9, GP10, and GP11, the four motor pins
from the course's `config.py` file.

## How to Use

1. Choose a **Data set**: `motor_pins`, the color `rgb_red`, or the OLED
   screen size `board_size`.
2. Choose an **Operation**. The code line in each panel shows exactly what will
   run, for example `>>> motor_pins[0] = 5`.
3. **Predict** whether it will work on the list, the tuple, or both.
4. Press **Try it on both** and check your prediction.
5. Set **New value** (0 to 255) to change what the change and append operations
   use. Press **Reset** to restore the data and clear the tally.

This MicroSim goes with the tuples section of
[Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

10–15 minutes

### Prerequisites

- Creating a list and reading items by index (Chapter 5, "Lists — Ordered Collections")
- `for` loops (Chapter 4: Control Flow, Functions, and Exception Handling)
- Reading a MicroPython error message in Thonny
  ([Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))

### Learning Objective

Students will be able to **distinguish** (Bloom's Taxonomy: Understand) which
operations work on a list and which raise an error on a tuple, and choose a
tuple for fixed hardware values and a list for data that grows.

### Activities

1. **Prediction table (3 min).** Students copy a 5 × 2 table (five operations,
   list and tuple) and mark each cell "works" or "error" before touching the sim.
2. **Test every cell (5 min).** Using the `motor_pins` data set, students run
   each operation and correct their table. They copy the exact error name for
   each blocked operation.
3. **Change the data (3 min).** Students repeat two operations with `rgb_red`
   and `board_size` and confirm that the rules depend on the container, not the
   values inside it.
4. **Choose the container (4 min).** Students decide list or tuple for four
   robot values: the four motor pins, the last ten distance readings, the OLED
   size, and a queue of dance moves. They justify each choice in one sentence.

### Assessment

- **Challenge:** You need to store the two OLED dimensions (128, 64) and a list
  of the last ten distance readings. Which is a tuple and which is a list?
  *Answer:* the dimensions are a tuple because they never change, and the
  readings are a list because new readings keep being added. Students check by
  trying **Append a value** on each data set.
- **Exit ticket:** "Why does `config.py` benefit from values that cannot change
  while the robot runs?"
- **Rubric (4-point):** *Exemplary* predicts all ten cells correctly and
  explains immutability in terms of preventing accidental changes to hardware
  values. *Proficient* predicts at least eight cells and chooses the correct
  container for all four robot values. *Developing* knows tuples cannot be
  changed but believes they cannot be read or looped over either.
  *Beginning* treats lists and tuples as interchangeable.

## References

1. [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md) - lists, tuples, and when to use each for robot data.
2. [Python Tutorial: Tuples and Sequences](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences) - official explanation of tuples and immutability.
3. [Python Tutorial: More on Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists) - list methods such as `append()` and `pop()`.
4. [Immutable object (Wikipedia)](https://en.wikipedia.org/wiki/Immutable_object) - background on objects that cannot be changed after they are created.
5. [MicroPython builtin types](https://docs.micropython.org/en/latest/library/builtins.html) - the built-in `list` and `tuple` types in MicroPython.
