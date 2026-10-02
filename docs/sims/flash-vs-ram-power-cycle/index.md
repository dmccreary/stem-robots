---
title: "Flash Memory vs RAM Power Cycle"
description: "Save main.py, run it, change a variable, and cut the power to see that Flash memory keeps your files while RAM forgets everything."
image: /sims/flash-vs-ram-power-cycle/flash-vs-ram-power-cycle.png
og:image: /sims/flash-vs-ram-power-cycle/flash-vs-ram-power-cycle.png
twitter:image: /sims/flash-vs-ram-power-cycle/flash-vs-ram-power-cycle.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Flash Memory vs RAM Power Cycle

<iframe src="main.html" height="422px" width="100%" scrolling="no"></iframe>

[Run the Flash Memory vs RAM Power Cycle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Your robot's board has two kinds of memory. **Flash memory** is permanent
storage. It keeps your saved files, like `main.py`, even when the power is
off. **RAM** (Random Access Memory) is fast, temporary memory. It holds the
values your program is using right now, like `speed = 50`. RAM is wiped clean
every time the power goes off.

The board in this MicroSim has a blue Flash block and an orange RAM block.
The log on the right tells you, in one sentence, what the board just did.
The Flash meter shows how full the 2 MB of storage is. MicroPython itself
uses 640 KB of it, so about 1.4 MB is left for your own files.

## How to Use

Each button does one thing. Before you press a button, **predict** what will
change. Then check the board and the log.

1. Press **Save main.py to Flash**. The file appears in Flash.
2. Press **Run program**. The variables `speed = 50` and
   `distance_cm = 32` appear in RAM.
3. Press **Change speed to 80**. Only RAM changes.
4. Press **Power OFF**. What happens to RAM? What happens to Flash?
5. Press **Power ON**. Watch the board read `main.py` from Flash and start
   it again.
6. Press **Add a 2 MB picture file** to see what happens when a file is too
   big. Press **Reset** to start over.

**Challenge:** Save `main.py`, run it, change the speed to 80, then turn the
power off and on. What is the value of `speed` now? Which memory kept
`main.py`? The chapter section
[Storing Your Programs: Flash Memory](../../chapters/02-hardware-platform-assembly/index.md#storing-your-programs-flash-memory)
explains why.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/flash-vs-ram-power-cycle/main.html"
        height="422px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *explain* the difference between non-volatile flash storage
and volatile RAM, and will *predict* which program data survives a power
cycle on the RP2040 board (Bloom's Taxonomy: Understand).

### Grade Level

Grades 8–12.

### Duration

10–15 minutes.

### Prerequisites

- The "Storing Your Programs: Flash Memory" section of
  [Chapter 2](../../chapters/02-hardware-platform-assembly/index.md).
- An informal idea of a *variable* as a named value that a program uses and
  can change, such as `speed`.

### Background

Students commonly assume that a value changed at run time is "saved" in the
program. This misconception causes real confusion later, when a robot
restarts after a brown-out and "forgets" a setting that was changed from the
REPL. The MicroSim makes the distinction observable: the edit to `speed`
lands only in RAM, the power cycle clears RAM, and the boot sequence
re-creates the variables from the unchanged `main.py` in flash. The storage
figures are accurate for the MicroPython rp2 port on a 2 MB board, which
reserves 1408 KB for the file system and leaves 640 KB for the firmware.

### Activities

1. **Predict (3 min).** Students write answers to: "If the robot is running
   with speed changed to 80 and the batteries fall out, what will speed be
   when the batteries go back in?"
2. **Step through (5 min).** Pairs follow the six steps in *How to Use*,
   reading each log line aloud before pressing the next button.
3. **Check predictions (2 min).** Pairs compare the result (50) with their
   prediction and explain any difference using the words *Flash* and *RAM*.
4. **Extend (3 min).** Ask: "How could we make the robot remember
   speed = 80 after a restart?" (Answer: edit and re-save `main.py`, or write
   the value to a file in flash.)
5. **Storage sense (2 min).** Discuss why the 2 MB picture fails and why the
   chapter recommends small, text-based program files.

### Assessment

- **Formative:** Listen for correct use of *permanent* and *temporary*
  during the paired walk-through.
- **Exit ticket:** "Name one thing stored in Flash and one thing stored in
  RAM on your robot, and say what happens to each when the batteries are
  removed."
- **Rubric (4-point):** *Exemplary* — correctly predicts speed = 50,
  explains that the boot process re-runs `main.py` from flash, and proposes a
  way to persist a value; *Proficient* — correct prediction with a
  Flash-versus-RAM explanation; *Developing* — correct prediction without a
  reason; *Beginning* — predicts that speed stays 80.

## References

1. [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md) — the flash memory section this MicroSim supports.
2. [Flash memory — Wikipedia](https://en.wikipedia.org/wiki/Flash_memory) — how non-volatile storage keeps data without power.
3. [Random-access memory — Wikipedia](https://en.wikipedia.org/wiki/Random-access_memory) — why RAM is fast but loses its contents when power is removed.
4. [MicroPython quick reference for the RP2](https://docs.micropython.org/en/latest/rp2/quickref.html) — the MicroPython port that runs on the RP2040.
5. [Cytron Maker Pi RP2040 product page](https://www.cytron.io/p-maker-pi-rp2040-simplifying-robotics-with-raspberry-pi-rp2040) — the robot controller board used in this course.
