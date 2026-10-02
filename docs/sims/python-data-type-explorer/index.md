---
title: "Data Type Explorer"
description: "Type a value or pick a robot value and watch it slide into the int, float, str, or bool bin, with a REPL-style type() check and a plain-English reason."
image: /sims/python-data-type-explorer/python-data-type-explorer.png
og:image: /sims/python-data-type-explorer/python-data-type-explorer.png
twitter:image: /sims/python-data-type-explorer/python-data-type-explorer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Data Type Explorer

<iframe src="main.html" height="432px" width="100%" scrolling="no"></iframe>

[Run the Data Type Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every value in MicroPython has a **data type**. The type tells Python what
kind of information the value is and what you can do with it. This MicroSim
sorts values into the four types from the chapter:

| Type | What it looks like | Robot example |
|------|--------------------|---------------|
| `int` | A whole number, no decimal point | `distance_cm = 15` |
| `float` | A number with a decimal point | `scale_factor = 0.92` |
| `str` | Text inside quotes | `robot_name = "Sparky"` |
| `bool` | Exactly `True` or `False` | `is_moving = True` |

Tiny changes matter. `15` is an int, `15.0` is a float, and `"15"` is a
string. `True` is a bool, but `true` (lowercase) is an error.

## How to Use

1. **Predict first.** Click the bin you think the value belongs in. It gets
   an orange outline.
2. **Type a value** in the field, or click one of the robot value buttons.
3. **Press Check type.** The value slides into its bin. The dark panel shows
   what the REPL would print for `type(value)`, plus the reason.
4. **Tick "Show what value + 1 does"** to see which types can do math. Try
   it with `"15"` and with `True`.
5. **Try to break it.** Type `true`, `TRUE`, or `12 cm` and read the error.

**Challenge:** Predict the type of each value: `0.92`, `"65535"`, `False`,
and `20`. Then check. Which one changed type because of the quotes? The four
types are described in
[Chapter 3: The Four Core Data Types](../../chapters/03-micropython-dev-environment/index.md#the-four-core-data-types).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/python-data-type-explorer/main.html"
        height="432px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *classify* MicroPython literals as `int`, `float`, `str`, or
`bool`, and will *explain* how a single surface feature—a decimal point,
quotation marks, or capitalization—determines the type (Bloom's Taxonomy:
Understand).

### Grade Level

Grades 8–12.

### Duration

10–15 minutes.

### Prerequisites

- The "Variables and Assignment" and "The Four Core Data Types" sections of
  [Chapter 3](../../chapters/03-micropython-dev-environment/index.md).
- Familiarity with the REPL prompt `>>>`, from the REPL section of the same
  chapter.

### Background

Novices tend to classify values by meaning ("15 is a distance, so it is a
number") rather than by syntax. Python, however, decides the type purely from
how the literal is written. The MicroSim's reason sentences always point to
the syntactic cue, and the `value + 1` toggle shows the practical
consequence: `"15" + 1` raises a `TypeError`, which is exactly the bug
students meet when they read text from a display or a network and try to do
arithmetic on it. The `True + 1 == 2` case is included deliberately; it
previews the fact that `bool` is a subtype of `int` in Python, without
requiring students to learn inheritance.

### Activities

1. **Predict-and-check (4 min).** Students click a bin to predict each of
   the ten robot values before pressing **Check type**, tallying correct
   predictions.
2. **Minimal pairs (4 min).** Students test `15` / `15.0` / `"15"` and
   `True` / `true` / `"True"`, then write one sentence for each set naming
   the feature that changed the type.
3. **Math test (3 min).** With "+ 1" on, students record which types allow
   `+ 1` and which produce an error.
4. **Challenge (2 min).** Answers: `0.92` float, `"65535"` str, `False` bool,
   `20` int. The quotes changed `"65535"`.
5. **REPL confirm (2 min).** Students type `type("15")` and `"15" + 1` in
   Thonny to confirm the MicroSim matches the real board. The exact wording
   of an error message can vary slightly between MicroPython versions, but
   the error type (`TypeError`, `NameError`) is always the same.

### Assessment

- **Formative:** Prediction tallies from Activity 1 (target: 8 of 10).
- **Exit ticket:** "A sensor library gives you `"42"`. What type is it, what
  happens if you add 1, and how could you tell from how it is written?"
- **Rubric (4-point):** *Exemplary* — classifies all four types and error
  cases, names the syntactic cue, and predicts the `+ 1` result;
  *Proficient* — classifies all four types and names the cue; *Developing*
  — classifies by meaning and misses quoted numbers; *Beginning* — cannot
  distinguish `int` from `float` or `str`.

## References

1. [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md) — integers, floats, strings, and booleans in robot code.
2. [Python Built-in Types](https://docs.python.org/3/library/stdtypes.html) — official description of numeric, text, and boolean types.
3. [Data type — Wikipedia](https://en.wikipedia.org/wiki/Data_type) — what a data type is and why languages use them.
4. [MicroPython builtin functions and exceptions](https://docs.micropython.org/en/latest/library/builtins.html) — `type()`, `NameError`, `TypeError`, and `SyntaxError` in MicroPython.
5. [Python Data Type Explorer (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/python-data-type-explorer) — the MicroSim this version was adapted from.
