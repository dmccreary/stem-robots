---
title: Data Structures, Modular Programming, and Version Control
description: Round out the MicroPython toolkit with lists, tuples, dictionaries, and string manipulation — then learn modular programming, the config.py pattern, secrets files, and Git basics for tracking your robot programs.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 14:10:00
version: 0.08
---

# Data Structures, Modular Programming, and Version Control

!!! mascot-welcome "Welcome, maker — let's organize your code like a pro!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You know variables and loops. Now we add containers that hold many values at once, patterns that keep your code tidy across multiple files, and a tool that saves every version of your work so you can always go back. These skills make the difference between a first draft and a finished project.

## Summary

This chapter rounds out the core MicroPython toolkit and introduces software
engineering practices that scale. Students learn Python's primary data structures —
lists, tuples, and dictionaries — along with string manipulation and formatted output.
The chapter then teaches modular programming patterns: writing reusable functions,
separating hardware configuration into a `config.py` file, and keeping secrets like
WiFi credentials out of version control. Students also learn Git basics so they can
track their robot programs throughout the course.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Lists
2. List Indexing
3. List Iteration
4. Tuples
5. Dictionaries
6. String Manipulation
7. Formatted Strings
8. Modular Programming
9. Reusable Functions
10. Import Config Pattern
11. Serial Communication
12. Software Troubleshooting
13. Code Documentation
14. Version Control Git
15. Git Commit Workflow

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: MicroPython and Development Environment Setup](../03-micropython-dev-environment/index.md)
- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)

---

## Lists — Ordered Collections

A **list** is an ordered collection of values stored under a single variable name. Instead of creating `color_0`, `color_1`, `color_2`, you store all three in one list. Lists use square brackets and commas:

```python
colors = ["red", "green", "blue"]
speeds = [0, 25, 50, 75, 100]
sensor_readings = [14.2, 13.8, 15.1, 14.7]
```

Lists can hold any data type — strings, integers, floats, even other lists. A single list can even mix types, though it is usually clearer to keep one type per list.

### List Indexing

**Indexing** means accessing a single item by its position. Python counts positions starting at 0, not 1. So the first item in `colors` is at index 0, the second at index 1, and so on.

```python
colors = ["red", "green", "blue"]

print(colors[0])    # "red"
print(colors[1])    # "green"
print(colors[2])    # "blue"
```

Negative indexes count from the end. `colors[-1]` gives `"blue"` — the last item. `colors[-2]` gives `"green"`.

You can also update a list item by assigning to an index:

```python
colors[0] = "orange"    # changes "red" to "orange"
```

Use `len(colors)` to find out how many items the list has. Accessing `colors[3]` when there are only 3 items (indexes 0–2) raises an `IndexError` — a very common bug.

### List Iteration

**Iterating** a list means visiting each item one at a time. The simplest way uses a `for` loop:

```python
for color in colors:
    print("Setting LED to:", color)
```

When you also need the index, use `enumerate()`:

```python
for i, color in enumerate(colors):
    print(f"LED {i}: {color}")
```

Common list methods worth knowing:

- `colors.append("yellow")` — adds an item to the end
- `colors.remove("green")` — removes the first matching item
- `len(colors)` — returns the number of items

#### Diagram: List Index Explorer


<iframe src="../../sims/list-index-explorer/main.html" width="100%" height="302px" scrolling="no"></iframe>
[Run List Index Explorer Fullscreen](../../sims/list-index-explorer/main.html)

<details markdown="1">
<summary>Interactive MicroSim showing list indexing and iteration</summary>
Type: MicroSim
**sim-id:** list-index-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 300 canvas. Show a horizontal array of 5 colored boxes labeled with values (e.g., "red", "green", "blue", "orange", "purple"). Above each box, display the positive index (0, 1, 2, 3, 4). Below each box, display the negative index (-5, -4, -3, -2, -1).

Controls:
- A slider "Index" from -5 to 4 selects a box, which highlights yellow with a glowing border.
- A text display shows: "colors[X] = 'value'" where X is the current index.
- A "Iterate" button animates the highlight moving left to right through all items with a 500ms delay between steps.

Clicking any box directly selects it and updates the index display.

Learning objective (Bloom's Taxonomy — Applying): students practice accessing specific items by index, including negative indexing.

Responsive: redraw on window resize.
</details>

---

## Tuples — Immutable Sequences

A **tuple** is like a list, but it cannot be changed after creation. Tuples use parentheses instead of square brackets:

```python
motor_pins = (6, 7, 8, 9)      # pin numbers never change
rgb_red = (255, 0, 0)           # RGB color — stays constant
board_size = (128, 64)          # OLED resolution
```

The word **immutable** means "cannot be mutated (changed)." Once you create a tuple, you cannot append to it, remove from it, or change its values. Python enforces this. Trying to do `motor_pins[0] = 5` raises a `TypeError`.

Tuples are useful when the data should never change — hardware pin numbers, screen dimensions, color constants. Using a tuple instead of a list signals to anyone reading your code: "these values are fixed on purpose."

Tuples support indexing and iteration exactly like lists:

```python
for pin in motor_pins:
    print("Setting up pin:", pin)

print("First pin:", motor_pins[0])
```

---

## Dictionaries — Key-Value Stores

A **dictionary** stores pairs of keys and values. Instead of accessing data by position (like a list), you access it by name. Dictionaries use curly braces:

```python
robot = {
    "name": "Sparky",
    "speed": 75,
    "is_moving": True,
    "distance_cm": 30.5
}
```

Access a value with its key in square brackets:

```python
print(robot["name"])      # "Sparky"
print(robot["speed"])     # 75
```

Update a value the same way:

```python
robot["speed"] = 50
robot["is_moving"] = False
```

Add a new key-value pair by simply assigning to a new key:

```python
robot["battery_pct"] = 85
```

Dictionaries are great for grouping related data about one thing. Instead of separate variables `robot_name`, `robot_speed`, `robot_distance`, you have one `robot` dictionary with all the properties in one place.

The table below compares the three data structures:

| Structure | Syntax | Access method | Mutable? | Best for |
|-----------|--------|--------------|----------|---------|
| List | `[a, b, c]` | Index `[0]` | Yes | Ordered sequences, sensor logs |
| Tuple | `(a, b, c)` | Index `[0]` | No | Fixed values, pin assignments |
| Dictionary | `{k: v}` | Key `["name"]` | Yes | Named properties of one object |

!!! mascot-thinking "Which container should I use?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Ask yourself: "Do I need to change the values? Are the values named or numbered?" If the values are fixed, use a tuple. If they're numbered in order, use a list. If they're named properties of one thing (like a robot's stats), use a dictionary. Getting this right makes your code easier to read and harder to break.

---

## String Manipulation

Strings are more than just labels. MicroPython provides many operations for working with text — splitting it, joining it, searching it, and formatting it.

Some useful string operations:

```python
message = "Hello, Sparky!"

print(len(message))         # 14 — number of characters
print(message.upper())      # "HELLO, SPARKY!"
print(message.lower())      # "hello, sparky!"
print(message[0:5])         # "Hello" — slice characters 0–4
print(message.replace("Sparky", "Robot"))  # "Hello, Robot!"
print("Sparky" in message)  # True — membership test
```

String **slicing** lets you extract a part of a string. `message[0:5]` gives characters at indexes 0, 1, 2, 3, 4 — but not index 5. The format is `[start:stop]` where stop is not included.

### Formatted Strings

**Formatted strings** (also called f-strings) let you embed variable values directly inside a string. Before the code, here is the idea: put the letter `f` before the opening quote, then use curly braces `{}` around any variable or expression you want to insert.

```python
robot_name = "Sparky"
distance_cm = 23.5
speed_pct = 75

# f-string — clean and readable
msg = f"Robot {robot_name} is {distance_cm:.1f} cm away at {speed_pct}% speed."
print(msg)
# Output: Robot Sparky is 23.5 cm away at 75% speed.
```

The `:` inside `{}` adds formatting. `:.1f` means "one decimal place as a float." F-strings are the clearest way to build display text for the OLED screen.

---

## Modular Programming

As your robot programs grow, one long `main.py` file becomes hard to manage. **Modular programming** means splitting your code into separate files — each file handles one concern. This is the same decomposition idea from Chapter 1, applied to code organization.

In MicroPython, each `.py` file is a module. You import it just like a built-in library.

### The config.py Pattern

**The most important modular pattern in this course** is the `config.py` file. Hardware pin numbers belong in `config.py`, not scattered through your program. If you ever change which pin a motor connects to, you change one line in `config.py` and everything else still works.

Create `config.py` on your board with pin assignments as constants:

```python
# config.py — hardware pin assignments for Cytron Maker Pi RP2040

# Motor pins (PWM-controlled H-bridge)
RIGHT_FORWARD_PIN = 11
RIGHT_REVERSE_PIN = 10
LEFT_FORWARD_PIN  = 9
LEFT_REVERSE_PIN  = 8

# NeoPixel LED
NEOPIXEL_PIN   = 18
NEOPIXEL_COUNT = 2

# I2C bus for sensors and display
I2C_SDA_PIN = 16
I2C_SCL_PIN = 17
```

Then import it in `main.py`:

```python
# main.py
import config

print("Right forward pin:", config.RIGHT_FORWARD_PIN)
```

This pattern keeps hardware details in one place and logic in another. Professional engineers call this **separation of concerns** — each file has exactly one job.

!!! mascot-tip "UPPERCASE constants are a signal"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Pin numbers and hardware constants go in `config.py` in UPPERCASE. That capitalization signals to any reader: "this value is fixed — don't change it at runtime." When you see `config.RIGHT_FORWARD_PIN` in code, you know exactly where to look if the pin ever needs changing.

### Reusable Functions and Module Files

You can also put groups of related functions in their own module file. For example, a `motors.py` file could hold all motor control functions:

```python
# motors.py
import config

def stop_all():
    """Stop all motors safely."""
    print("All motors stopped.")
    # PWM code goes here in Chapter 7
```

Then import and use it in `main.py`:

```python
import motors
motors.stop_all()
```

This is exactly how the course's library files (`vl53l0x.py`, `ssd1306.py`) work. They are modules you import to get sensor and display functionality without writing those drivers yourself.

---

## Serial Communication

**Serial communication** is how MicroPython sends text to Thonny's Shell pane. Every `print()` statement you write sends data over the USB cable as serial output. This works because the USB connection creates a virtual **serial port** — a communication channel that sends data one bit at a time.

Serial output is your most basic debugging tool. When you don't know what a sensor is reading, add a `print()`. When you don't know if a function is being called, add a `print()`. This technique is called **print debugging**, and professional engineers use it constantly.

```python
distance_cm = 25   # will be read from sensor later
print(f"[DEBUG] distance_cm = {distance_cm}")   # temporary debug line

if distance_cm < 20:
    stop_motors()
```

Remove or comment out debug prints before your final program — too many slows the loop slightly and clutters the output.

---

## Software Troubleshooting

**Software troubleshooting** is the systematic process of finding and fixing bugs. Bugs are not failures — they are information. An error message tells you exactly where something went wrong and what type of error occurred.

When Thonny shows a red traceback, read it from the bottom up:

1. The last line names the exception type and message: `AttributeError: 'NoneType' object has no attribute 'read'`
2. The line above shows the file and line number: `File "main.py", line 23`
3. Working upward shows the call stack — how the program got there

A systematic troubleshooting process:

1. Read the full error message before changing anything.
2. Identify the file and line number from the traceback.
3. Add print statements before and after the failing line.
4. Check one variable at a time in the REPL.
5. Test the smallest possible piece of code that still shows the bug.

This process — isolate, hypothesize, test, observe — is the engineering design process applied to code.

---

## Code Documentation

**Code documentation** means writing explanations that help readers understand your code. There are two places to do this in Python: comments and docstrings.

**Comments** use `#` and explain a single line or short section. You practiced these in Chapter 3.

**Docstrings** are strings at the top of a function that explain what it does. They use triple quotes:

```python
def read_distance():
    """Return distance in centimeters from the VL53L0X sensor.
    Returns -1 if the sensor is not connected.
    """
    return -1   # sensor code goes here in Chapter 8
```

Good documentation answers: What does this do? What inputs does it need? What does it return? These questions matter most when someone else reads your code — or when you return to it after a week away.

---

## Version Control with Git

**Version control** is a system that tracks changes to your files over time. It lets you save checkpoints of your code. If you break something, you can go back to the last working checkpoint. We use **Git** — the most widely used version control system in the world.

Git stores your code's history in a hidden folder called a **repository** (or repo). Every checkpoint is called a **commit**.

### Initializing a Repository

On your laptop (not the robot board), open a terminal in your project folder. Before the commands below, here is what each does: `git init` creates a new repository. `git add` stages files for the next commit. `git commit` saves those files as a checkpoint with a description.

```bash
git init                        # create a new repository
git add main.py config.py       # stage specific files
git commit -m "Initial robot program"  # save a checkpoint
```

### The Git Commit Workflow

The **Git commit workflow** is the cycle you repeat after every meaningful change:

1. Make changes to your code in Thonny.
2. Test the changes on the robot.
3. Copy the updated files to your laptop.
4. Stage the changed files: `git add filename.py`
5. Commit with a clear message: `git commit -m "Add collision avoidance function"`

A good commit message completes the sentence "This commit will...". "Fix motor speed bug" is good. "updates" is not.

#### Diagram: Git Commit Workflow


<iframe src="../../sims/git-commit-workflow/main.html" width="100%" height="300px" scrolling="no"></iframe>
[Run Git Commit Workflow Fullscreen](../../sims/git-commit-workflow/main.html)

<details markdown="1">
<summary>Interactive diagram of the Git commit workflow stages</summary>
Type: diagram
**sim-id:** git-commit-workflow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a Mermaid flowchart (graph LR, left to right) showing the four Git areas:

1. "Working Directory" (yellow box) — where you edit files
2. "Staging Area" (orange box) — files marked for the next commit
3. "Local Repository" (blue box) — committed history on your laptop
4. "Remote (GitHub)" (green box) — optional cloud backup

Arrows between areas labeled with commands:
- Working Dir → Staging Area: `git add`
- Staging Area → Local Repo: `git commit -m "message"`
- Local Repo → Remote: `git push`
- Remote → Local Repo: `git pull`

Every box and every arrow has a click directive that opens an infobox with a plain-language explanation of what that area stores or what that command does.

Canvas: 700 × 200 px. Responsive on window resize.
</details>

### The .gitignore File

**Not every file belongs in version control.** A `.gitignore` file lists patterns of files Git should ignore.

Create a file named `.gitignore` in your project folder:

```
# Ignore secrets file — NEVER commit WiFi passwords
secrets.py

# Ignore Python cache files
__pycache__/
*.pyc

# Ignore OS junk files
.DS_Store
Thumbs.db
```

The `secrets.py` file stores your WiFi network name and password. If you commit it to a public repository, anyone in the world can see your credentials. Always list `secrets.py` in `.gitignore` before your first commit.

!!! mascot-warning "Never commit secrets.py"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    WiFi passwords and API keys should never be in a Git repository. Add `secrets.py` to `.gitignore` before your first commit. If you accidentally commit credentials, consider them compromised — change the password immediately. This is a real-world security principle, not just a class rule.

---

## Key Takeaways

- **Lists** store ordered, changeable sequences accessed by index (`[0]`, `[-1]`)
- **Tuples** store fixed, unchangeable sequences — use them for pin numbers and constants
- **Dictionaries** store named key-value pairs — perfect for grouping an object's properties
- **f-strings** embed variables in text cleanly: `f"Speed: {speed_pct}%"`
- **config.py** centralizes all pin assignments — change hardware in one place
- **Modular programming** splits code across multiple files, each with one job
- **Serial output** (`print()`) is your primary debugging tool
- **Git** tracks code history; commit often with clear messages
- **secrets.py** never goes in version control — always add it to `.gitignore`

!!! mascot-celebration "You code like a software engineer now!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, maker! Lists, tuples, dictionaries, modular files, Git commits — you now have the tools that professional engineers use every day. The next chapter dives into the electronics and motors that make me actually move. Get ready to roll!
