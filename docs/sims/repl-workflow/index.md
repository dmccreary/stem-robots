---
title: REPL and Save Workflow
description: Test lines in a mock Thonny REPL, copy the ones that work into the Editor, save them to the board as main.py or test.py, and power-cycle to see what runs by itself.
image: /sims/repl-workflow/repl-workflow.png
og:image: /sims/repl-workflow/repl-workflow.png
twitter:image: /sims/repl-workflow/repl-workflow.png
social:
   cards: false
quality_score: 100
---

# REPL and Save Workflow

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the REPL and Save Workflow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Thonny gives you two ways to run MicroPython code:

- The **REPL** in the Shell pane runs one line the moment you press Enter.
  It is perfect for quick experiments. But nothing you type there is saved.
- The **Editor** holds a whole program. When you save it to the board, it
  lives in flash memory. If you name it `main.py`, the board runs it by
  itself every time it powers up.

This MicroSim walks you through the full workflow, one step at a time:
**try it in the REPL**, **write it in the Editor**, **save it as
`main.py`**, and **power-cycle** the board. The board picture shows which
files are saved in Flash and which variables are sitting in RAM.

## How to Use

1. **Run a line.** Type in the `>>>` box and press Enter, or click a
   quick-line button such as `speed = 50`. Try `speed * 2` before and after
   you set `speed`.
2. **Copy REPL lines into Editor.** Only lines that worked are copied.
3. **Save to board.** Pick `main.py` or `test.py` from the Save as menu,
   then press **Save to board**. The file appears in the Flash list.
4. **Unplug and replug.** Watch what happens to the RAM variables, and read
   what the Shell prints when the board powers back up.
5. **Follow the checklist.** The orange chip is your next step, and Sparky
   explains each one.

**Challenge:** Save a file named `test.py` with the line
`print("Ready to roll!")`, then power-cycle. Does it print? Now save the same
line as `main.py` and power-cycle again. The workflow is described in
[Chapter 3: Uploading Programs with Thonny](../../chapters/03-micropython-dev-environment/index.md#uploading-programs-with-thonny).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/repl-workflow/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* the REPL-to-file workflow to decide when an idea
should be tested interactively and when it should be saved as `main.py`, and
will *predict* what the board runs after a power cycle (Bloom's Taxonomy:
Apply).

### Grade Level

Grades 8–12.

### Duration

15–20 minutes.

### Prerequisites

- "The REPL — Your Live Experiment Lab" and "Uploading Programs with Thonny"
  sections of [Chapter 3](../../chapters/03-micropython-dev-environment/index.md).
- The difference between flash storage and RAM from the
  [Flash Memory vs RAM Power Cycle](../flash-vs-ram-power-cycle/index.md)
  MicroSim in Chapter 2.

### Background

This MicroSim targets two misconceptions about working with a
microcontroller. First, students may expect REPL work to persist; the MicroSim
clears the RAM variables at every power cycle to make that loss visible.
Second, students may expect a saved program to "show its answers" the way the
REPL echoes expressions. The simulated `main.py` run executes bare
expressions such as `3 + 4` silently and prints only `print()` output, which
is how MicroPython actually behaves. The `main.py` versus `test.py` choice
isolates the boot convention: the board runs only `main.py` automatically.

### Activities

1. **Explore the REPL (4 min).** Students run all six quick lines, including
   `speed * 2` before `speed = 50`, and explain the `NameError`.
2. **Predict (2 min).** Before saving, students write down what the Shell
   will print after a power cycle if every REPL line is saved as `main.py`.
3. **Save and power-cycle (5 min).** Students copy, save as `main.py`, and
   power-cycle, then compare with their prediction. Students who expect `7`
   and `100` to appear discover that only the `print()` lines do.
4. **Challenge (4 min).** Students complete the `test.py` / `main.py`
   challenge. Answers: `test.py` does not print; `main.py` prints
   "Ready to roll!".
5. **Real board (optional, 5 min).** Repeat the challenge on a real Maker Pi
   RP2040 in Thonny.

### Assessment

- **Formative:** Compare predictions from Activity 2 with results; ask
  students to explain any mismatch in terms of REPL echo versus `print()`.
- **Exit ticket:** "You tested a motor speed in the REPL and it worked.
  What three steps make the robot use that speed every time it turns on?"
  (Copy into the Editor, save to the board as `main.py`, power-cycle to
  test.)
- **Rubric (4-point):** *Exemplary* — correctly predicts power-cycle output,
  including silent expressions, and explains the `main.py` convention;
  *Proficient* — completes the workflow and the challenge correctly;
  *Developing* — saves files but expects REPL variables or `test.py` to
  persist or run; *Beginning* — cannot distinguish the REPL from the Editor.

## References

1. [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md) — the REPL, Thonny, and saving `main.py`.
2. [Read–eval–print loop — Wikipedia](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) — what a REPL is and where the name comes from.
3. [MicroPython Interactive Interpreter Mode (REPL)](https://docs.micropython.org/en/latest/reference/repl.html) — official guide to the MicroPython REPL.
4. [Thonny Python IDE](https://thonny.org/) — the editor and Shell used in this course.
5. [REPL Workflow MicroSim (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/repl-workflow) — the MicroSim this version was adapted from.
