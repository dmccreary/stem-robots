---
title: MicroPython and Development Environment Setup
description: Flash MicroPython firmware onto your robot, connect via USB, and use the Thonny IDE and REPL to write and run your first programs — then learn the core data types and operators that power every MicroPython program in this course.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 13:57:00
version: 0.08
---

# MicroPython and Development Environment Setup

!!! mascot-welcome "Welcome, maker — let's bring your robot to life!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This chapter is a big one. By the time we're done, your robot will run real code — code that *you* wrote. We'll install the programming language, hook up the board, and write our very first MicroPython programs. Computational thinking is YOUR superpower — let's activate it!

## Summary

This chapter gets students writing and running real code on the robot. It covers
flashing MicroPython firmware via the BOOTSEL button and UF2 file, connecting to
the board over USB, and using the Thonny IDE's editor and REPL for interactive
experimentation. With the environment in place, students learn core MicroPython
fundamentals: variables, all primary data types, arithmetic and comparison operators,
and clean code style — the building blocks for every program in the course.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. MicroPython Overview
2. UF2 Firmware File
3. BOOTSEL Button
4. USB Cable Connection
5. Thonny IDE
6. Thonny Installation
7. REPL Interactive Shell
8. Thonny File Upload
9. Syntax Highlighting
10. Python Syntax Basics
11. Variables and Assignment
12. Integer Data Type
13. Float Data Type
14. String Data Type
15. Boolean Data Type
16. Arithmetic Operators
17. Comparison Operators
18. Logical Operators
19. Comments and Code Style

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computational Thinking and Physical Computing](../01-intro-computational-thinking/index.md)
- [Chapter 2: Hardware Platform and Robot Assembly](../02-hardware-platform-assembly/index.md)

---

## What Is MicroPython?

Your robot's brain is a small computer called a microcontroller. It can run programs — but it doesn't speak English. You have to speak its language. We use **MicroPython** for that.

**MicroPython** is a lightweight version of the Python programming language designed to run on small, low-power hardware. A regular Python program runs on a laptop or desktop computer with gigabytes of memory. MicroPython runs on a microcontroller with just 264 kilobytes of RAM — about the size of a single small image file. Despite that tiny footprint, MicroPython gives you real Python: loops, functions, lists, even object-oriented programming.

Python is one of the world's most popular programming languages. Once you know MicroPython, you already know the basics of regular Python too. That is a skill that transfers far beyond robots.

MicroPython is not the only language you could use on this hardware. C and C++ also work. But they require far more setup, and they are harder for beginners. MicroPython lets you focus on the robotics, not the language.

#### Diagram: MicroPython in the Stack


<iframe src="../../sims/micropython-stack-diagram/main.html" width="100%" height="760px" scrolling="no"></iframe>
[Run MicroPython in the Stack Fullscreen](../../sims/micropython-stack-diagram/main.html)

<details markdown="1">
<summary>Where MicroPython sits between your code and the robot hardware</summary>
Type: diagram
**sim-id:** micropython-stack-diagram<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a vertical stack diagram using Mermaid showing the four layers of the system:

Layer 1 (top): "Your Code (the program you write)" — light blue background
Layer 2: "MicroPython Interpreter" — orange background, labeled "translates your code into machine instructions"
Layer 3: "MicroPython Firmware" — yellow background, labeled "lives on the RP2040 flash memory"
Layer 4 (bottom): "Hardware (RP2040 chip, motors, sensors)" — gray background

Use Mermaid graph TD (top-down). Each node has a click directive that opens an infobox describing that layer. Arrow labels show the direction of control (Your Code → MicroPython → Hardware) and the direction of data (Hardware → MicroPython → Your Code).

Canvas: 400 × 300 px. Responsive: redraw on window resize.
</details>

---

## Flashing the Firmware

Before your board can run MicroPython, you need to install it. The board ships with a different program already on it. We replace that program by copying a special file onto the board. This process is called **flashing the firmware**.

**Firmware** is permanent software stored in your device's memory. It is the lowest layer of software — the stuff that runs before anything else. MicroPython's firmware turns a bare RP2040 chip into a Python computer.

The file we copy is called a **UF2 file**. **UF2** stands for USB Flashing Format. It is a standard format that lets you update a microcontroller's firmware by simply dragging and dropping a file, just like copying a document. You do not need any special programming hardware.

Here is the complete flashing process, step by step:

1. Download the MicroPython UF2 file from the official MicroPython website. Look for the version for the "Raspberry Pi Pico" or "Cytron Maker Pi RP2040."
2. Hold down the **BOOTSEL button** on your board. BOOTSEL stands for Boot Select. This button tells the chip to start in a special mode where it can receive new firmware.
3. While still holding BOOTSEL, plug the USB cable into your board and your computer.
4. Release the BOOTSEL button. Your board will appear on your computer as a USB drive named `RPI-RP2`.
5. Drag the UF2 file onto that drive. The board will automatically reboot and run MicroPython.

!!! mascot-tip "Tip — data cables only!"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Use a **data USB cable**, not a charge-only cable. Many USB cables sold with phone accessories are charge-only — they carry power but no data. If your computer doesn't see the `RPI-RP2` drive after plugging in, try a different cable. This is the number-one reason the flashing step fails.

After flashing, the `RPI-RP2` drive disappears and the board reboots. That is normal — it means the firmware installed correctly. If the drive stays visible, the UF2 file may be the wrong version or the cable may be charge-only.

---

## Connecting to Thonny

Now we need a way to talk to the board. We use an **IDE** for that. An **IDE** (Integrated Development Environment) is a program that lets you write code, send it to your board, and see what happens. We use **Thonny** — a free, beginner-friendly IDE designed exactly for MicroPython.

### Installing Thonny

Thonny is one download and one click to install. Go to `thonny.org` and choose the installer for your operating system (Windows, Mac, or Linux). The installer includes everything you need — you do not need to install Python separately.

Once installed, open Thonny. The main window has two parts:

- **Editor pane (top):** Where you write and save programs.
- **Shell pane (bottom):** Where you interact with the board directly.

Before Thonny can talk to your board, you need to configure the interpreter. Go to **Tools → Options → Interpreter** and select "MicroPython (Raspberry Pi Pico)" from the dropdown. Then select the correct serial port. On Windows, it appears as something like `COM3`. On Mac, it looks like `/dev/cu.usbmodem...`. Click OK and Thonny will connect.

!!! mascot-thinking "Think about this — what's a serial port?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A **serial port** is a communication channel — a pathway data travels through, one bit at a time. Your USB cable creates a virtual serial port. Thonny uses it to send your code to the board and receive output back. When you see output in the Shell pane, it traveled over that same cable.

### Syntax Highlighting

One of Thonny's most helpful features is **syntax highlighting**. **Syntax** means the rules of a programming language — which words are allowed, how to punctuate them, and what order things go in. Syntax highlighting colors different parts of your code so they are easy to read.

In Thonny, keywords like `if`, `for`, and `def` appear in one color. Strings appear in another. Numbers are a third color. Comments — notes you write for yourself — appear in a muted color because they don't affect what the program does.

If you ever see a line that didn't get colored the way you expected, that is often a sign of a typo. Syntax highlighting is your first line of defense against bugs.

---

## The REPL — Your Live Experiment Lab

The most powerful feature of MicroPython on the RP2040 is the **REPL**. **REPL** stands for Read-Evaluate-Print Loop. It is the interactive prompt in Thonny's Shell pane.

Here is what REPL does:

- **Read** — it reads whatever you type.
- **Evaluate** — it runs that code immediately.
- **Print** — it shows you the result.
- **Loop** — it waits for you to type something else.

You do not need to write a whole program and save it. You just type one line and press Enter. The board runs it right now. This is perfect for experiments.

Try it. Click in the Shell pane in Thonny (you should see `>>>` — that is the REPL prompt). Type the following and press Enter:

```python
print("Hello, robot!")
```

The board prints:

```
Hello, robot!
```

That's your first MicroPython output. Let's try some math:

```python
>>> 3 + 4
7
>>> 10 / 3
3.3333333333333
```

The REPL evaluates each expression and prints the result immediately. This is how engineers explore new hardware — try small things, see what happens, build up from there.

You now have two ways to run code: the REPL for quick tests and a saved file for programs that run on their own. The simulation below shows how the two fit together in one workflow, from an idea to a robot that runs `main.py`.

#### Diagram: REPL and Save Workflow

<iframe src="../../sims/repl-workflow/main.html" width="100%" height="502px" scrolling="no"></iframe>
[Run REPL and Save Workflow Fullscreen](../../sims/repl-workflow/main.html){ .md-button }

<details markdown="1">
<summary>Try one line in a simulated REPL, then save it into main.py and power-cycle the board</summary>
Type: microsim
**sim-id:** repl-workflow<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-micropython/repl-workflow (https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/repl-workflow). Keep the REPL-to-file flow; limit the allowed commands to the ones below and add the power-cycle step.

Learning objective: Apply (Bloom L3) — decide when to test an idea in the REPL and when to save it in `main.py`, and predict what runs after a power cycle.

Canvas layout: 700 px wide (responsive), 500 px tall. Left 50%: a mock Thonny window with an Editor pane on top and a Shell pane below. Right 50%: a board picture with a "Board flash" file list and a workflow bar of four steps. Total iframe height 502 px.

Visual elements:
- Mock Thonny window: Editor pane (white, line numbers, syntax colors) and Shell pane (dark navy #1a237e, white text, `>>>` prompt with a blinking cursor).
- Board picture with a green power LED, a reset button, and a file list inside a box labeled "Flash: saved files".
- Workflow bar with four numbered chips: "1 Try in REPL", "2 Write in Editor", "3 Save to board as main.py", "4 Power-cycle". The active chip is orange (#e65100); finished chips are green with a check.

Interactive controls:
- Shell text input: the student types a line and presses Enter. Allowed lines: `print("Hello, robot!")`, `3 + 4`, `10 / 3`, `speed = 50`, `speed * 2`. Any other text returns a simple error such as `NameError: name 'x' isn't defined` or `SyntaxError: invalid syntax`, with a hint line "That is OK. Errors are information."
- Quick buttons under the Shell that paste each allowed line.
- Button "Copy REPL lines into Editor" copies all accepted lines into the Editor.
- Dropdown "Save as": "main.py" (default) or "test.py".
- Button "Save to board" adds the file to the Flash list.
- Button "Unplug and replug" runs the power-cycle animation.

Behavior:
- Results: `print("Hello, robot!")` prints `Hello, robot!`; `3 + 4` prints `7`; `10 / 3` prints `3.3333333333333`; `speed = 50` prints nothing and stores the variable; `speed * 2` prints `100` only if speed was set, else `NameError: name 'speed' isn't defined`.
- The REPL variables vanish when the board is power-cycled; the Flash files remain.
- After "Unplug and replug": if `main.py` is in Flash, the Shell prints its output automatically; if the file is `test.py`, nothing runs and the Shell says "No main.py found. Run test.py from Thonny yourself."
- A "Sparky says" line under the workflow bar explains each step in one sentence.

Default state: empty Editor, Shell with `>>>` prompt, Flash empty, chip 1 active.

Assessment/Challenge: Save a file named `test.py` with the line `print("Ready to roll!")`, then power-cycle. Does it print? (Answer: No. Only `main.py` runs automatically.) Now save it as `main.py` and repeat. (Answer: It prints.)

Responsive: redraw on window resize. On narrow screens the board picture moves below the Thonny window.
</details>

Use the REPL whenever you are unsure what a line will do. When the idea works, copy it into a file and save it as `main.py` on the board. That two-step habit will help you in every lab.

!!! mascot-encourage "This feels simple — and that's the point."
    ![Sparky encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    The REPL might feel too simple right now — like a fancy calculator. But every expert programmer uses it to test ideas before writing a full program. When something isn't working later in the course, we'll come back to the REPL and test one line at a time. That habit will save you hours of frustration.

---

## Uploading Programs with Thonny

The REPL is great for experiments. But for programs that run automatically when the board powers up, we need to write a file and save it to the board.

In Thonny's editor pane (the top panel), type a short program. Then go to **File → Save As** and choose "MicroPython device" when asked where to save. Name the file `main.py`.

The special name `main.py` is important. When the Cytron board powers up, it looks for a file called `main.py` on its flash storage and runs it automatically. Save any other file name and it won't auto-run — you'll need to run it manually from Thonny.

Here is a simple program to save as `main.py`:

```python
from time import sleep

print("Robot starting up!")
sleep(2)
print("Ready to roll!")
```

Unplug the USB cable, plug it back in (or press the reset button if your board has one), and watch the Shell. Your program runs automatically. That is the complete workflow: write in the editor, save to the board, and the board runs it.

---

## Python Syntax Basics

Now that the environment works, let's learn the language. MicroPython follows the same syntax rules as regular Python. **Syntax** is the grammar of a programming language — the rules that say which arrangements of words and symbols are legal.

Python has a few key syntax rules every beginner needs to know:

- **Indentation matters.** Python uses spaces to show which code belongs inside a block (like a loop or a function). Mixing tabs and spaces causes errors. Thonny's default is 4 spaces per indent level.
- **Case is significant.** `Speed` and `speed` are different names. Most Python code uses lowercase with underscores for variable and function names.
- **Colons start blocks.** After `if`, `for`, `while`, `def`, and similar keywords, you put a colon. Everything indented under it is inside that block.
- **No semicolons needed.** Unlike C or JavaScript, Python ends statements with a newline, not a semicolon.

These four rules cover 90% of syntax errors beginners make. When Thonny shows a red error about an `IndentationError` or `SyntaxError`, look for violations of these rules first.

---

## Variables and Assignment

A **variable** is a named storage location in memory. You create a variable by giving it a name and assigning a value with the `=` sign. The `=` sign in Python means "store this value" — it is not asking "are these equal?"

```python
speed = 50
robot_name = "Sparky"
is_moving = True
```

Each line creates a variable. `speed` stores the number 50. `robot_name` stores the text "Sparky". `is_moving` stores `True`, meaning the robot is currently in motion.

Variable names follow these rules:

- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Cannot contain spaces or hyphens
- Cannot be a Python keyword like `for`, `if`, or `while`

Good variable names are descriptive. `d` is a legal name, but `distance_cm` tells you exactly what is stored. Descriptive names make debugging much easier.

#### Diagram: Variable Assignment Interactive Explorer


<iframe src="../../sims/variable-assignment-explorer/main.html" width="100%" height="352px" scrolling="no"></iframe>
[Run Variable Assignment Interactive Explorer Fullscreen](../../sims/variable-assignment-explorer/main.html)

<details markdown="1">
<summary>Interactive p5.js visualization of variables storing values in memory</summary>
Type: MicroSim
**sim-id:** variable-assignment-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 350 canvas. Show a left panel with two input fields where the user can type a variable name and a value. When they click "Assign", an animated arrow flies from an "Assignment statement" box on the left to a "Memory box" on the right, and the memory box updates with the new variable name and value. Show up to 4 memory boxes stacked vertically on the right.

Add a "Reset" button that clears all memory boxes with a fade-out animation.

Hovering a memory box shows a tooltip: "Variable: [name] stores [value] of type [type]."

Learning objective (Bloom's Taxonomy — Applying): students practice the concept that assignment stores a value in a named location, not that two things are equal.

Responsive: redraw on window resize. Font size: 14px. Color scheme: navy blue memory boxes, yellow arrow animation, orange labels.
</details>

---

## The Four Core Data Types

Every value in MicroPython has a **data type** — a category that tells Python what kind of information it is and what operations make sense on it. Let's meet the four types you will use throughout this course.

### Integers

An **integer** is a whole number — no decimal point. Examples: `0`, `5`, `-3`, `1000`. We use integers constantly in robot code: motor speeds, distances in centimeters, LED color values (0–255), and loop counters.

```python
distance_cm = 15        # distance from sensor in centimeters
motor_speed = 65535     # maximum PWM duty cycle value (16-bit)
led_red = 255           # maximum red intensity for NeoPixel LED
```

### Floats

A **float** (short for floating-point number) is a number with a decimal point. Examples: `3.14`, `0.5`, `-9.81`. Floats are useful for sensor calibration constants, voltage calculations, and angles.

```python
scale_factor = 0.92     # calibration constant for distance sensor
battery_voltage = 7.4   # nominal LiPo battery voltage
turn_angle = 45.0       # servo angle in degrees
```

Be careful mixing integers and floats. Division in Python (and MicroPython) always returns a float: `7 / 2` gives `3.5`, not `3`. If you need whole-number division, use `//`: `7 // 2` gives `3`.

### Strings

A **string** is text — any sequence of characters between quotes. You can use single quotes `'like this'` or double quotes `"like this"`. We use strings for labels on the OLED display, messages printed to the REPL, and WiFi credentials.

```python
robot_name = "Sparky"
status_message = 'All systems go!'
ssid = "SchoolRobotics"   # WiFi network name
```

### Booleans

A **boolean** is a value that is either `True` or `False`. Booleans come from comparisons and control the flow of your programs. When you ask "is the obstacle closer than 20 cm?", the answer is a boolean.

```python
is_moving = True
obstacle_detected = False
motor_enabled = True
```

`True` and `False` are capitalized. MicroPython is case-sensitive, so `true` (lowercase) would cause a `NameError`.

The table below summarizes the four data types:

| Data Type | Example Values | Common Robot Uses |
|-----------|---------------|-------------------|
| `int` | `0`, `255`, `65535` | Motor speed, LED values, loop counters |
| `float` | `3.14`, `0.92`, `45.0` | Sensor calibration, angles, voltages |
| `str` | `"Sparky"`, `"GO"` | Display text, WiFi SSID, status messages |
| `bool` | `True`, `False` | Flags, conditionals, sensor states |

Python can tell you a value's type with the `type()` function. In the simulation below, you type or pick a value and see which of the four types it is and why. Mixing up types is a common source of bugs, so this is a good place to practice.

#### Diagram: Data Type Explorer

<iframe src="../../sims/python-data-type-explorer/main.html" width="100%" height="432px" scrolling="no"></iframe>
[Run Data Type Explorer Fullscreen](../../sims/python-data-type-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Enter robot values and see whether MicroPython treats them as int, float, str, or bool</summary>
Type: microsim
**sim-id:** python-data-type-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-micropython/python-data-type-explorer (https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/python-data-type-explorer). Limit to the four chapter types and use robot example values.

Learning objective: Classify (Bloom L2) — identify the data type of a value and explain how a small change, such as a decimal point or quotes, changes its type.

Canvas layout: 700 px wide (responsive), 430 px tall. Top strip (90 px): input row. Middle (200 px): four type "bins" side by side. Bottom (140 px): a result panel with the `type()` output and a plain-English reason. Total iframe height 432 px.

Visual elements:
- Four bins with color and label: `int` blue (#1976d2), `float` green (#43a047), `str` orange (#e65100), `bool` purple (#7b1fa2). Each bin shows a small sample: `255`, `0.92`, `"Sparky"`, `True`.
- The typed value appears as a token that slides into the matching bin.
- Result panel shows the REPL-style line, for example `>>> type(15)` and `<class 'int'>`, then a sentence such as "15 has no decimal point and no quotes, so it is an int."

Interactive controls:
- Text field "Type a value" (default `15`).
- Preset buttons for robot values: `15` (distance_cm), `30.5` (distance_cm), `"Sparky"`, `'All systems go!'`, `65535`, `0.92`, `True`, `False`, `"15"`, `true`.
- Button "Check type".
- Toggle "Show what `value + 1` does" that displays the result or an error for the current value.

Behavior:
- Classification rules: digits only (optional leading minus) is `int`; digits with one decimal point is `float`; text in matching single or double quotes is `str`; exactly `True` or `False` is `bool`.
- Anything else, including `true`, `TRUE`, or `12 cm`, shows `NameError` or `SyntaxError` with the hint "Check capital letters and quotes."
- The `value + 1` toggle shows: `15` gives `16`; `30.5` gives `31.5`; `"Sparky"` gives `TypeError: unsupported types for __add__: 'str', 'int'`; `True` gives `2`; `"15"` gives the same `TypeError`.
- The note for `"15"` always reads: "It looks like a number, but the quotes make it a string."
- The note for `True + 1` reads: "A bool acts like 1 or 0 in math, but it is still a bool."

Default state: value `15` shown in the `int` bin with its result panel filled.

Assessment/Challenge: Predict the type of each: `0.92`, `"65535"`, `False`, `20`. Then check. (Answers: float, str, bool, int.) Which one changed type because of quotes? (Answer: `"65535"`.)

Responsive: redraw on window resize. Bins wrap to a 2 x 2 grid on narrow screens.
</details>

Robot programs use all four types together. A distance reading might be a float, a motor speed an int, a status message a string, and an obstacle check a boolean. Knowing the type tells you what you can safely do with the value.

---

## Arithmetic Operators

**Operators** are symbols that perform operations on values. MicroPython supports all the arithmetic operators you know from math class, plus a few extras useful for robot code.

Before the table, here is a plain-language explanation of each one:

- **Addition (`+`)** — adds two numbers, or joins two strings.
- **Subtraction (`-`)** — subtracts the right value from the left.
- **Multiplication (`*`)** — multiplies. Also repeats strings: `"Go!" * 3` gives `"Go!Go!Go!"`.
- **Division (`/`)** — always produces a float, even when both inputs are integers.
- **Integer division (`//`)** — divides and discards the decimal part, giving a whole number.
- **Modulo (`%`)** — gives the remainder after division. `10 % 3` gives `1` because 3 goes into 10 three times with 1 left over.
- **Exponentiation (`**`)** — raises the left number to the power of the right. `2 ** 8` gives `256`.

| Operator | Symbol | Example | Result |
|----------|--------|---------|--------|
| Addition | `+` | `100 + 55` | `155` |
| Subtraction | `-` | `100 - 55` | `45` |
| Multiplication | `*` | `4 * 16` | `64` |
| Division | `/` | `7 / 2` | `3.5` |
| Integer division | `//` | `7 // 2` | `3` |
| Modulo | `%` | `10 % 3` | `1` |
| Exponentiation | `**` | `2 ** 8` | `256` |

Try a few of these in the REPL right now. The REPL is the perfect place to test arithmetic before you embed it in a program.

Division and modulo often surprise beginners. The simulation below shows the same two numbers going through every operator so you can see the patterns side by side.

#### Diagram: Arithmetic Operator Playground

<iframe src="../../sims/arithmetic-operator-playground/main.html" width="100%" height="462px" scrolling="no"></iframe>
[Run Arithmetic Operator Playground Fullscreen](../../sims/arithmetic-operator-playground/main.html){ .md-button }

<details markdown="1">
<summary>Change two numbers and see the result of every arithmetic operator, with a picture for division and remainder</summary>
Type: microsim
**sim-id:** arithmetic-operator-playground<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** moving-rainbow/python-operator-playground (https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/python-operator-playground). Keep the operator table; add the block-grouping picture for `//` and `%` and the robot examples below.

Learning objective: Apply (Bloom L3) — predict the result of `+`, `-`, `*`, `/`, `//`, `%`, and `**` for two numbers, and choose the right operator for a robot task.

Canvas layout: 700 px wide (responsive), 460 px tall. Top strip (80 px): two number inputs and a preset dropdown. Left 55%: a result table with seven rows. Right 45%: a picture panel. Total iframe height 462 px.

Visual elements:
- Result table with columns "Operator", "Code", "Result", "Type". For example with a = 7 and b = 2: `+` gives `a + b` = `9` int; `-` gives `5`; `*` gives `14`; `/` gives `3.5` float; `//` gives `3` int; `%` gives `1` int; `**` gives `49` int.
- The `/` row is highlighted blue when both inputs are integers to remind the student that the result is a float.
- Picture panel: `a` drawn as a row of small squares (one square per unit, up to 30). Squares are grouped into blocks of size `b`. Complete blocks are green (#43a047), counted as the `//` answer. Leftover squares are orange (#e65100), counted as the `%` answer.
- Under the picture, a sentence: "7 squares make 3 full groups of 2, with 1 left over."

Interactive controls:
- Number field "a" (integer 0 to 30, default 7) and number field "b" (integer 1 to 10, default 2).
- Dropdown "Robot example" that loads preset values: "Whole groups of 10 cm: 27 // 10 (a=27, b=10)", "Every 5th loop: loop_count % 5 (a=23, b=5)", "Split a speed of 30 in half: 30 / 2 (a=30, b=2)", "Average of two readings: (30 + 34) / 2 (shown as a=64, b=2 with `/`)".
- Checkbox "Use decimal a (a = 7.5)" that makes a a float.

Behavior:
- Division by zero is blocked because b has a minimum of 1; the b field shows "b cannot be 0" if the student types 0.
- With a float `a`, results follow Python: `7.5 // 2` gives `3.0`, `7.5 % 2` gives `1.5`, and the Type column shows float.
- For values above 30, the picture switches to a bar with a label "Picture scaled: each square = 10".
- Preset "Every 5th loop" shows the sentence: "`loop_count % 5 == 0` is True every 5th loop, when the remainder is 0."
- Type column always matches Python rules: only `/` always returns float; `+ - * // % **` return int for int inputs.

Default state: a = 7, b = 2, integer mode, table filled, picture shows 3 green groups and 1 orange square.

Assessment/Challenge: Set a = 23 and b = 5. What are `//` and `%`? (Answers: 4 and 3.) Then use `%` to decide when a robot should beep every 5th loop. (Answer: beep when `loop_count % 5 == 0`.)

Responsive: redraw on window resize. The picture panel moves below the table on narrow screens.
</details>

The remainder operator is a favorite trick in robot code, because it lets a program do something every Nth time through a loop. Integer division is handy when you turn a big number, like a 16-bit duty value, into a smaller, friendlier one.

---

## Comparison Operators

**Comparison operators** compare two values and produce a boolean result — either `True` or `False`. These are the building blocks of every decision your robot makes: "Is the distance less than 20 cm? Should I stop?"

Before the table, here is each operator explained in plain language:

- **Equal to (`==`)** — two equal signs. Asks "are these the same?" One equal sign (`=`) assigns; two equal signs (`==`) compare.
- **Not equal to (`!=`)** — asks "are these different?"
- **Less than (`<`)** — asks "is the left smaller than the right?"
- **Greater than (`>`)** — asks "is the left bigger than the right?"
- **Less than or equal to (`<=`)** — true if left is smaller than or the same as right.
- **Greater than or equal to (`>=`)** — true if left is bigger than or the same as right.

| Operator | Symbol | Example | Result |
|----------|--------|---------|--------|
| Equal to | `==` | `5 == 5` | `True` |
| Not equal to | `!=` | `5 != 3` | `True` |
| Less than | `<` | `3 < 10` | `True` |
| Greater than | `>` | `3 > 10` | `False` |
| Less than or equal | `<=` | `5 <= 5` | `True` |
| Greater than or equal | `>=` | `3 >= 10` | `False` |

In robot code, you will use comparison operators constantly:

```python
distance_cm = 15

if distance_cm < 20:
    print("Obstacle nearby — stop!")
```

!!! mascot-warning "Don't mix up = and =="
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Using one `=` instead of two `==` inside an `if` statement is one of the most common bugs beginners write. `distance = 15` stores the value 15. `distance == 15` asks "is distance equal to 15?" If you write `if distance = 15:`, Python gives you a `SyntaxError`. Two equal signs for comparison — always.

---

## Logical Operators

**Logical operators** combine boolean values. They let you build more complex conditions: "Is the distance less than 20 cm AND is the robot moving?" Three logical operators exist in MicroPython:

- **`and`** — returns `True` only if **both** sides are `True`.
- **`or`** — returns `True` if **at least one** side is `True`.
- **`not`** — flips `True` to `False` and `False` to `True`.

Here are examples using robot sensor scenarios:

```python
obstacle_close = True
robot_moving = True

# Both must be true to trigger emergency stop
if obstacle_close and robot_moving:
    print("Emergency stop!")
```

Logical operators follow a clear priority order. `not` evaluates first, then `and`, then `or`. When in doubt, use parentheses to make the order explicit:

```python
if (distance_cm < 20) and (motor_speed > 0):
    print("Too fast, too close — stopping!")
```

Parentheses make the intent clear and prevent bugs from subtle operator order surprises.

A truth table lists every combination of true and false inputs and the answer each one gives. The simulation below builds one live for your robot's emergency-stop rule. You flip the inputs and watch the rule decide.

#### Diagram: Robot Logic Truth Table

<iframe src="../../sims/robot-logic-truth-table/main.html" width="100%" height="482px" scrolling="no"></iframe>
[Run Robot Logic Truth Table Fullscreen](../../sims/robot-logic-truth-table/main.html){ .md-button }

<details markdown="1">
<summary>Flip robot condition switches and see which rows of the and, or, and not truth tables light up</summary>
Type: microsim
**sim-id:** robot-logic-truth-table<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-python/boolean-logic-lab (https://github.com/dmccreary/learning-python/tree/main/docs/sims/boolean-logic-lab) and moving-rainbow/python-operator-playground (https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/python-operator-playground). Use the lab's truth-table layout and replace the generic inputs with the robot conditions below.

Learning objective: Apply (Bloom L3) — evaluate `and`, `or`, and `not` expressions for robot conditions and predict when the robot will stop.

Canvas layout: 700 px wide (responsive), 480 px tall. Top 40%: robot scene with two switches. Middle 15%: the expression selector. Bottom 45%: a truth table. Total iframe height 482 px.

Visual elements:
- Robot scene: a small robot top view with two toggle switches drawn beside it. Switch A is "obstacle_close (distance under 20 cm)". Switch B is "robot_moving". Each switch is green (True) or gray (False), with the word True or False.
- A big output lamp labeled "Emergency stop?" that is red when the expression is True and dark when False.
- Code line at the center showing the current expression in monospace, for example `if obstacle_close and robot_moving:` with the live values filled in below it: `True and True -> True`.
- Truth table with columns A, B, Result and 4 rows (A/B combinations: False/False, False/True, True/False, True/True). The row that matches the current switches is highlighted yellow (#fff59d) and the Result cell is bold.
- For `not`, a two-row table (A only).

Interactive controls:
- Two toggle switches A and B, each clickable, default A = True, B = True.
- Expression selector (radio buttons): `A and B` (default), `A or B`, `not A`, `not A and B`, `(not A) or B`.
- Checkbox "Show parentheses order" that draws numbered circles above each part: 1 for `not`, 2 for `and`, 3 for `or`.
- Button "Show all rows" that fills every Result cell; otherwise only the highlighted row shows its answer, and the others show "?".
- Button "Test my prediction": the student clicks a Result cell and picks True or False for it, and the sim says "Correct!" or "Not yet, look at the rule."

Behavior:
- `and` is True only when A and B are both True. `or` is True when at least one is True. `not A` flips A.
- Order for `not A and B` is `(not A) and B`, so it is True only when A is False and B is True. The order circles show `not` first, then `and`.
- The lamp and the highlighted row update immediately after any switch or selector change.
- "Show all rows" with `not A and B` shows the results F, T, F, F for rows FF, FT, TF, TT respectively.
- The message line states the robot behavior in plain words, for example "Both are True: the robot stops!" for `A and B` at True, True, and "Only one is True: the robot keeps moving." for True, False.

Default state: expression `A and B`, both switches True, lamp red, row True/True highlighted.

Assessment/Challenge: With `A or B`, find the one row where the lamp stays dark. (Answer: A False and B False.) Then choose the expression that stops the robot only when it is moving and NOT close to an obstacle. (Answer: `not A and B`.)

Responsive: redraw on window resize. The truth table drops below the robot scene on narrow screens.
</details>

Every decision your robot makes comes down to conditions like these. When you write `if obstacle_close and robot_moving:`, you are building one row of this table. Checking all the rows before you upload can save you from a robot that stops at the wrong time.

---

## Comments and Code Style

Good code is readable. Not just by you today, but by you six months from now, and by your teammates. **Comments** are notes you write in the code for human readers. Python ignores them completely — they have no effect on what the program does.

Write a comment with the `#` symbol. Everything after `#` on that line is a comment:

```python
# Set forward motor speed (0–65535 for 16-bit PWM)
motor_speed = 32768    # 50% duty cycle

# Check if obstacle is within stopping distance
if distance_cm < 20:   # threshold: 20 cm
    stop_motors()
```

Good comments explain *why*, not *what*. The code shows what is happening. Comments explain the reasoning: why 20 cm? why 32768?

**Code style** is the set of conventions that make code look consistent. In Python, the standard style guide is called PEP 8. The most important rules for this course:

- Variable names use lowercase and underscores: `motor_speed`, not `MotorSpeed` or `motorspeed`.
- Constants (values that never change) use UPPERCASE: `MAX_SPEED = 65535`.
- Put a single space on each side of operators: `x = 5 + 3`, not `x=5+3`.
- Put a blank line between logical sections of a program.

Here is a complete, well-styled example program that brings together everything in this chapter:

```python
# Robot startup program — variables, types, and operators
robot_name = "Sparky"       # string: the robot's name
motor_speed = 50            # int: speed as percentage
distance_cm = 30.5          # float: sensor reading in cm
is_moving = False           # bool: motor state flag

print("Robot:", robot_name)
print("Speed:", motor_speed, "%")

# Check if path is clear before moving
if distance_cm > 20.0:
    is_moving = True
    print("Path clear — ready to move!")
else:
    print("Obstacle detected — staying put.")
```

Run this in Thonny. Change `distance_cm` to `10.0` and re-run. Watch how the output changes. This experiment-driven cycle is how engineers work.

---

## Key Takeaways

Let's review what you accomplished in this chapter:

- You flashed MicroPython firmware onto the board using BOOTSEL and a UF2 file
- You installed Thonny and configured it to talk to the board over USB
- You used the REPL to run MicroPython code one line at a time
- You saved a `main.py` file that runs automatically on power-up
- You learned the four core data types: `int`, `float`, `str`, and `bool`
- You practiced arithmetic, comparison, and logical operators
- You wrote comments and applied Python code style

These building blocks appear in every program in this course. When something looks unfamiliar in a later chapter, come back here.

!!! mascot-celebration "You just turned a bare circuit board into a Python computer!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, maker! You flashed firmware, installed an IDE, used the REPL, and wrote real MicroPython programs. That is not a small thing — most people never get this far. The next chapter builds loops, functions, and everything you need to make your robot actually *do* things. You've got this!
