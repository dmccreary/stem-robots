---
title: "Arithmetic Operator Playground"
description: "Enter two numbers and see all seven MicroPython arithmetic operators side by side, with a block picture that shows what integer division and remainder really mean."
image: /sims/arithmetic-operator-playground/arithmetic-operator-playground.png
og:image: /sims/arithmetic-operator-playground/arithmetic-operator-playground.png
twitter:image: /sims/arithmetic-operator-playground/arithmetic-operator-playground.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Arithmetic Operator Playground

<iframe src="main.html" height="462px" width="100%" scrolling="no"></iframe>

[Run the Arithmetic Operator Playground MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

MicroPython has seven arithmetic operators. Most work just like math class.
Three of them surprise beginners:

- **Division `/`** always gives a **float** (a number with a decimal point),
  even for two whole numbers. `7 / 2` gives `3.5`, and `6 / 2` gives `3.0`.
- **Integer division `//`** counts only the **full groups**. `7 // 2` gives
  `3`.
- **Remainder `%`** (also called modulo) gives what is **left over**.
  `7 % 2` gives `1`.

The table shows all seven results for the same two numbers, `a` and `b`,
plus the type of each result. The picture draws `a` as squares and groups
them into blocks of `b`. The green blocks are the `//` answer. The orange
squares left over are the `%` answer.

## How to Use

1. **Change a and b** in the number fields. Before you look at the table,
   predict each result.
2. **Look at the picture.** Count the green groups and the orange leftovers.
   Do they match the `//` and `%` rows?
3. **Check the Type column.** Which operator gives a float even when both
   numbers are ints?
4. **Tick "Use decimal a"** to set `a = 7.5`. Now every result is a float.
5. **Pick a Robot example** to see where each operator shows up in real
   robot code.

**Challenge:** Set `a = 23` and `b = 5`. What are `a // b` and `a % b`? Then
decide how a robot could beep on every 5th trip through its main loop. The
operators are introduced in
[Chapter 3: Arithmetic Operators](../../chapters/03-micropython-dev-environment/index.md#arithmetic-operators).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/arithmetic-operator-playground/main.html"
        height="462px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* MicroPython's seven arithmetic operators to predict
results and result types, and will *select* the appropriate operator
(`/`, `//`, or `%`) for a given robot task (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12.

### Duration

15 minutes.

### Prerequisites

- The "Integers" and "Floats" sections of
  [Chapter 3](../../chapters/03-micropython-dev-environment/index.md#the-four-core-data-types).
- Using the REPL to evaluate an expression, from the REPL section of the
  same chapter.

### Background

Two behaviors cause most novice errors here. First, Python 3 (and
MicroPython) made `/` true division, so `6 / 2` is the float `3.0`; passing
that value to an API that expects an int, such as a PWM duty value, raises a
`TypeError`. Second, students rarely have a concrete model of `%`. The block
picture grounds both `//` and `%` in the same division-with-remainder
image students learned in elementary arithmetic, so the two operators are
seen as the two halves of one idea.

### Activities

1. **Predict the table (3 min).** With `a = 7` and `b = 2` hidden behind a
   sheet of paper, students write all seven results and types, then reveal
   and check.
2. **Pattern hunt (4 min).** Students try `a` from 20 to 25 with `b = 5`
   and describe the pattern in the `%` column (it cycles 0, 1, 2, 3, 4, 0).
3. **Challenge (3 min).** `23 // 5 = 4` and `23 % 5 = 3`. Students then write
   the condition `loop_count % 5 == 0` for "beep every 5th loop."
4. **Robot examples (3 min).** Students step through the four presets and
   state, for each, why that operator is the right choice.
5. **REPL check (2 min).** Students type two of the expressions into the
   Thonny REPL and confirm the MicroSim matches real MicroPython.

### Assessment

- **Formative:** Check the prediction sheets from Activity 1; the most
  common error is writing `3` instead of `3.5` for `7 / 2`.
- **Exit ticket:** "A robot should turn around after every 4th wall it
  finds. Write the condition using `%`. Then say what `30 / 2` and
  `30 // 2` each give." (Answers: `walls % 4 == 0`; `15.0` and `15`.)
- **Rubric (4-point):** *Exemplary* — correct results and types for all
  seven operators, including float inputs, and a correct `%` condition;
  *Proficient* — correct results with one type error; *Developing* —
  confuses `/` and `//` or `//` and `%`; *Beginning* — treats all division
  as the same operation.

## References

1. [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md) — the arithmetic operators table this MicroSim explores.
2. [Python Tutorial: Using Python as a Calculator](https://docs.python.org/3/tutorial/introduction.html#numbers) — official examples of `/`, `//`, `%`, and `**`.
3. [Modulo — Wikipedia](https://en.wikipedia.org/wiki/Modulo) — the remainder operation and its uses.
4. [MicroPython documentation](https://docs.micropython.org/) — MicroPython follows Python 3 arithmetic rules.
5. [Python Operator Playground (Moving Rainbow)](https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/python-operator-playground) — the MicroSim this version was adapted from.
