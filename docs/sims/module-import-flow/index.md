---
title: "Module Import Flow"
description: "Change one pin number in config.py and watch it flow into motors.py and main.py through import, then compare how many lines you would edit with hard-coded pins."
image: /sims/module-import-flow/module-import-flow.png
og:image: /sims/module-import-flow/module-import-flow.png
twitter:image: /sims/module-import-flow/module-import-flow.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Module Import Flow

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Module Import Flow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/module-import-flow/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Every `.py` file on your robot is a **module**, which is a file of code that
other files can use. The `import` statement links one module to another. This
MicroSim shows three files from the chapter:

- **config.py** (blue) holds the pin numbers as UPPERCASE constants, such as
  `RIGHT_FORWARD_PIN = 11`.
- **motors.py** (green) runs `import config` and uses
  `config.RIGHT_FORWARD_PIN` to set up the motor pin.
- **main.py** (orange) runs `import config` and `import motors`, prints the
  pin, and calls `motors.stop_all()`.

Arrows show which file imports which. Every spot that reads
`config.RIGHT_FORWARD_PIN` is highlighted in yellow, with an orange badge that
shows its current value. The small wiring picture on the left shows which GP
pin the right forward motor wire is plugged into.

When you change the pin in `config.py`, every highlighted spot follows along
at once. You edit **1 line**. Turn on **Hard-code pins instead** and the same
number is typed by hand in **5 places**. Now changing `config.py` does
nothing. The code still drives GP11, and the wiring picture shows the motor
as not connected.

## How to Use

1. Press **Run main.py**. The console prints the import order one step at a
   time, and each import arrow pulses gold as it runs. Notice that `config.py`
   loads only once, even though two files import it.
2. Change **RIGHT_FORWARD_PIN** to 13. Watch the badges in `motors.py` and
   `main.py` change, and the orange wire move to GP13.
3. Check **Hard-code pins instead (no config.py)**. Change the pin again and
   read the **Pin mismatch** message and the **Lines to edit** counter.
4. Press **Reset** to return to pin 11 with the `config.py` pattern.

This MicroSim goes with the modular programming section of
[Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

15 minutes

### Prerequisites

- Importing built-in modules with `import time` and `from time import sleep`
  ([Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md))
- Defining and calling functions (Chapter 4)
- Variables and constants
  ([Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))

### Learning Objective

Students will be able to **explain** (Bloom's Taxonomy: Understand) how
`import` links files together, and predict which files change behavior when
one value in `config.py` changes.

### Activities

1. **Trace the imports (4 min).** Students press **Run main.py** and write down
   the order of the console lines. Ask why `config.py` loads only once.
2. **Predict the change (3 min).** Before changing the pin to 13, students
   list every place in the three files that will show 13 afterward. They check
   their list against the yellow badges.
3. **Break the pattern (4 min).** With **Hard-code pins instead** on, students
   change the pin to 13 and count the stale numbers. They explain, in two
   sentences, why the motor would not move on the real robot.
4. **Connect to the kits (4 min).** Students open a `config.py` from one of the
   robot kits and find two other constants that other files import.

### Assessment

- **Challenge:** You move the right forward motor wire from pin 11 to pin 13.
  How many lines must you edit with the `config.py` pattern, and how many with
  hard-coded pins? *Answer:* 1 line with `config.py`, 5 lines when hard-coded.
  Students check the **Lines to edit** counter.
- **Exit ticket:** "A teammate changes a pin number in `motors.py` instead of
  `config.py`. What problem might this cause later?"
- **Rubric (4-point):** *Exemplary* explains that importing shares one
  definition across files, predicts every file affected by a change, and
  connects the pattern to separation of concerns. *Proficient* explains the
  import link and predicts the affected files. *Developing* knows
  `config.py` holds pins but cannot explain how other files see the change.
  *Beginning* believes each file needs its own copy of the pin numbers.

## References

1. [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md) - the `config.py` pattern and the `motors.py` module example.
2. [Python Tutorial: Modules](https://docs.python.org/3/tutorial/modules.html) - official explanation of modules and the `import` statement.
3. [MicroPython machine.Pin](https://docs.micropython.org/en/latest/library/machine.Pin.html) - the `Pin` class used to set up the motor pin.
4. [Separation of concerns (Wikipedia)](https://en.wikipedia.org/wiki/Separation_of_concerns) - the design idea behind keeping hardware settings in one file.
5. [Magic number (programming) (Wikipedia)](https://en.wikipedia.org/wiki/Magic_number_(programming)) - why unexplained numbers typed in many places cause bugs.
