---
title: "Robot Logic Truth Table"
description: "Flip two robot conditions, pick an and, or, or not rule, and watch the Emergency stop lamp and a live truth table show exactly when the robot stops."
image: /sims/robot-logic-truth-table/robot-logic-truth-table.png
og:image: /sims/robot-logic-truth-table/robot-logic-truth-table.png
twitter:image: /sims/robot-logic-truth-table/robot-logic-truth-table.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Robot Logic Truth Table

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Robot Logic Truth Table MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Robots make decisions by combining conditions. This MicroSim uses two
conditions from a real robot:

- **A** is `obstacle_close`. It is `True` when the distance sensor reads
  under 20 cm.
- **B** is `robot_moving`. It is `True` when the motors are running.

You pick a **rule** that combines them with `and`, `or`, or `not`. When the
rule is `True`, the **Emergency stop?** lamp turns red.

A **truth table** lists every possible combination of `True` and `False`
for A and B, and the answer the rule gives for each one. The row that
matches your switches is highlighted yellow. The other answers stay hidden
as `?` until you predict them.

## How to Use

1. **Flip the switches.** Use the A and B checkboxes, or click a switch in
   the picture. You can also click a row of the table to jump to it.
2. **Pick a rule** such as `A and B` or `not A and B`. The code line shows
   the rule as a MicroPython `if` statement, with the live values worked out
   step by step underneath.
3. **Tick "Show parentheses order"** to see which part Python works out
   first: `not` is 1, `and` is 2, and `or` is 3.
4. **Press Test my prediction.** Click a `?` in the Result column, then press
   **True** or **False**. Can you fill the whole table without mistakes?
5. **Press Show all rows** to check the full table.

**Challenge:** With `A or B`, find the one row where the lamp stays dark.
Then choose the rule that stops the robot only when it is moving and *not*
close to an obstacle. The operators are introduced in
[Chapter 3: Logical Operators](../../chapters/03-micropython-dev-environment/index.md#logical-operators).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/robot-logic-truth-table/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* the rules for `and`, `or`, and `not`, including
MicroPython's operator precedence, to evaluate compound robot conditions and
*predict* when an emergency-stop rule fires (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12.

### Duration

15–20 minutes.

### Prerequisites

- The "Booleans", "Comparison Operators", and "Logical Operators" sections
  of [Chapter 3](../../chapters/03-micropython-dev-environment/index.md).
- Reading a simple `if` statement.

### Background

Truth tables externalize the full input space of a Boolean expression, which
lets students verify a rule exhaustively instead of by a single example. The
two compound rules are chosen to surface precedence: because `not` binds more
tightly than `and`, `not A and B` means `(not A) and B`, not `not (A and B)`.
The optional order circles and the step-by-step value line make that
evaluation order visible. Hiding the non-current rows until students commit
to a prediction turns the table from a reference into a practice task.

### Activities

1. **Warm-up (3 min).** With `A and B`, students flip the switches through
   all four combinations and say the robot behavior aloud for each.
2. **Predict the table (5 min).** For `A or B`, students use **Test my
   prediction** to fill every `?` before pressing **Show all rows**.
3. **Challenge (4 min).** The dark row for `A or B` is A `False`, B `False`.
   The rule that stops only when moving and not close is `not A and B`,
   whose results for rows FF, FT, TF, TT are `False`, `True`, `False`,
   `False`.
4. **Precedence (4 min).** Students compare `not A and B` with
   `(not A) or B` using the order circles, then write `not (A and B)` on
   paper and build its truth table by hand. Ask how it differs from
   `not A and B`.
5. **Connect to code (2 min).** Students rewrite the emergency-stop rule
   with comparisons from the chapter:
   `if distance_cm < 20 and motor_speed > 0:`.

### Assessment

- **Formative:** Watch the number of "Not yet" responses during Activity 2;
  students with more than two should re-state the `or` rule before
  continuing.
- **Exit ticket:** "Write the full truth table for `not A or B`, and say in
  plain words when the lamp is dark." (Dark only when A is `True` and B is
  `False`.)
- **Rubric (4-point):** *Exemplary* — correct tables for all five rules,
  including precedence, and a correct hand-built table for `not (A and B)`;
  *Proficient* — correct tables for `and`, `or`, and `not`, with one
  precedence error; *Developing* — confuses `and` with `or`; *Beginning* —
  evaluates only the highlighted row.

## References

1. [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md) — booleans, comparison operators, and logical operators.
2. [Truth table — Wikipedia](https://en.wikipedia.org/wiki/Truth_table) — how truth tables list every input combination.
3. [Python Language Reference: Boolean operations](https://docs.python.org/3/reference/expressions.html#boolean-operations) — official rules for `and`, `or`, and `not`.
4. [Python Language Reference: Operator precedence](https://docs.python.org/3/reference/expressions.html#operator-precedence) — why `not` is evaluated before `and`, and `and` before `or`.
5. [Python Operator Playground (Moving Rainbow)](https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/python-operator-playground) — the logic evaluation this MicroSim builds on.
