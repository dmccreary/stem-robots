---
title: "Local vs Global Scope Explorer"
description: "Step through three short robot programs one line at a time and watch local variables appear and vanish inside a function, and see what the global keyword changes."
image: /sims/scope-local-global-explorer/scope-local-global-explorer.png
og:image: /sims/scope-local-global-explorer/scope-local-global-explorer.png
twitter:image: /sims/scope-local-global-explorer/scope-local-global-explorer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Local vs Global Scope Explorer

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Local vs Global Scope Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/scope-local-global-explorer/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Every variable in a program lives somewhere. **Scope** is the part of the
program where a variable can be seen and used. This MicroSim draws scope as
boxes, so you can see it.

- The big **blue box** is the global scope, the whole program. Variables made
  outside every function live here as **blue cards**.
- The smaller **orange box** appears only while a function runs. Variables made
  inside the function are **local variables**. They live here as
  **orange cards**.

When the function ends, its box slides away and its orange cards vanish in a
puff of smoke. If the program then tries to use one of those local names, a red
**NameError** tag pops up.

The three examples come straight from the chapter:

1. **Local variable:** `compute_speed()` makes a local variable called `scaled`.
2. **Global with the `global` keyword:** `start_motors()` changes the global
   flag `is_moving`. A dashed arrow shows the function reaching the global card.
3. **Global without `global` (the bug):** the same function without the
   `global` line. Python makes a new local `is_moving`, and the global one never
   changes.

## How to Use

1. Choose an example from the **Example** menu. Example 1 is loaded first.
2. Press **Step** to run one line. The yellow bar marks the line that just ran.
   The message box explains that line in one sentence.
3. Press **Run** to play one line per second, or **Reset** to start over.
4. Watch the output console under the code. It shows what `print()` displays.
5. In examples 2 and 3, use the **Show global keyword** checkbox to switch
   between the working code and the buggy code. It adds or removes a single
   line: `global is_moving`.

This MicroSim goes with the functions section of
[Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

15 minutes

### Prerequisites

- Defining and calling a function with `def` (Chapter 4, "Defining a Function")
- Parameters and return values (Chapter 4, "Parameters and Return Values")
- Assigning and printing variables
  ([Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))

### Learning Objective

Students will be able to **explain** (Bloom's Taxonomy: Understand) why a local
variable disappears after a function ends, and why the `global` keyword is
needed to change a global variable from inside a function.

### Activities

1. **Predict the error (3 min).** Show example 1 before stepping. Ask: "Will
   `print(scaled)` on the last line work?" Record a class vote.
2. **Step through example 1 (4 min).** Students step line by line and describe
   what happens to `raw_value` and `scaled` when `return` runs. They connect
   the NameError to the empty function box.
3. **Compare examples 2 and 3 (5 min).** In pairs, one student steps through
   example 2 and the other steps through example 3. They compare the final
   output line (`After call: True` vs. `After call: False`) and find the one
   line that makes the difference.
4. **Explain it back (3 min).** Each student writes two sentences: one
   explaining why `scaled` disappears, and one explaining what `global is_moving`
   tells Python.

### Assessment

- **Challenge:** Run example 3, then find the one-line fix. *Answer:* add
  `global is_moving` as the first line inside `start_motors()`. Students check it
  by turning on **Show global keyword** and confirming the blue card becomes
  `True`.
- **Exit ticket:** "Your robot's `obstacle_detected` flag never turns `True`,
  even though a function sets it. What is the most likely cause?" *Expected
  answer:* the function is missing `global obstacle_detected`, so it made a
  local variable instead.
- **Rubric (4-point):** *Exemplary* explains both behaviors using the words
  "local scope" and "global scope" and predicts the output of a new example.
  *Proficient* explains both behaviors correctly. *Developing* explains the
  NameError but not the missing-`global` bug. *Beginning* believes all
  variables are visible everywhere.

## References

1. [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md) - the `compute_speed()` and `start_motors()` examples used in this MicroSim.
2. [Python Tutorial: Defining Functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions) - explains that assignments inside a function create local variables.
3. [Python Language Reference: The global statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement) - the official definition of `global`.
4. [Scope (computer science) (Wikipedia)](https://en.wikipedia.org/wiki/Scope_(computer_science)) - background on where names are visible in a program.
5. [Variable Scope Explorer (Moving Rainbow)](https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/variable-scope-explorer) - the earlier MicroSim whose nested scope boxes this one adapts.
