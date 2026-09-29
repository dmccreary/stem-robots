---
title: Resistor Color Code Calculator
description: Pick four stripe colors to read a resistor's value in ohms, type a value to see its stripes, load common robot-lab resistors, and quiz yourself on random resistors.
image: /sims/resistor-color-code-calculator/resistor-color-code-calculator.png
og:image: /sims/resistor-color-code-calculator/resistor-color-code-calculator.png
twitter:image: /sims/resistor-color-code-calculator/resistor-color-code-calculator.png
social:
   cards: false
quality_score: 100
---

# Resistor Color Code Calculator

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Resistor Color Code Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **resistor** limits how much current flows in a circuit. Resistors are too
small to print numbers on, so they use colored stripes instead. A four-stripe
resistor is read from left to right:

| Stripe | Meaning | Example (330 ohms) |
|--------|---------|--------------------|
| 1 | First digit | orange = 3 |
| 2 | Second digit | orange = 3 |
| 3 | Multiplier | brown = x10 |
| 4 | Tolerance (how exact) | gold = 5% |

So orange, orange, brown means 33 x 10 = 330 ohms. The tolerance stripe says
the real value can be off by a little. A 330-ohm resistor with 5% tolerance
can really be anywhere from 313.5 to 346.5 ohms.

The digit colors go in rainbow order: black 0, brown 1, red 2, orange 3,
yellow 4, green 5, blue 6, violet 7, gray 8, white 9.

## How to Use

1. **Pick a color for each stripe** from the four dropdowns. The resistor,
   the value, and the math update right away.
2. **Type a value** such as `330`, `4.7k`, or `1M` and press **Show
   stripes**. The MicroSim finds the stripes for that value, or the closest
   match if two digits cannot make it exactly.
3. **Click a row** in the example table to load a resistor you will use in
   robot labs, like the 330-ohm LED protector.
4. **Quiz yourself.** Press **Random resistor**. The value and the
   dropdown labels hide. Read the stripes, work out the value, then press
   **Reveal**.

**Challenge:** Use quiz mode on three random resistors and read each one.
Then build 10,000 ohms with stripes. Resistors are introduced in
[Chapter 2: Resistors and Breadboards](../../chapters/02-hardware-platform-assembly/index.md#resistors-and-breadboards).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/resistor-color-code-calculator/main.html"
        height="452px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* the four-band resistor color code to decode a resistor's
value and tolerance range, and to encode a target value as stripe colors
(Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12.

### Duration

15 minutes, plus an optional 10-minute hands-on sort with real resistors.

### Prerequisites

- The "Resistors and Breadboards" section of
  [Chapter 2](../../chapters/02-hardware-platform-assembly/index.md),
  including the three jobs resistors do in robot labs.
- Multiplying by powers of ten (x10, x100, x1,000).

### Background

The color code is a positional notation: two significant digits and a
power-of-ten exponent. Framing it as "two digits plus a count of zeros"
(330 = 33 followed by one zero) gives students one rule to apply instead of a
list of values to memorize. The MicroSim shows the
multiplication explicitly ("33 x 10 = 330") to reinforce that model. The
value field works in the other direction—encoding—which is the skill
students need when a lab calls for a specific part.

### Activities

1. **Decode together (3 min).** Load the default 330-ohm resistor. Ask
   students to explain each stripe using the table in *About This
   MicroSim*.
2. **Quiz rounds (5 min).** Pairs take turns pressing **Random resistor**.
   The reader states the value before pressing **Reveal**; the partner
   records whether it was correct.
3. **Encode (4 min).** Students build 10,000 ohms using only the dropdowns
   (answer: brown, black, orange), then check with the value field. Next they
   try 475 ohms and explain the "Closest match" message.
4. **Tolerance (3 min).** Ask: "Could a 10k resistor with 10% tolerance
   measure 10,800 ohms?" (Yes—the range is 9k to 11k.)
5. **Optional hands-on (10 min).** Give each pair a mixed bag of real
   resistors to sort by value, using the MicroSim to check.

### Assessment

- **Formative:** Pair quiz records from Activity 2 (target: at least three
  correct readings in a row).
- **Exit ticket:** "Write the stripe colors for 4.7k ohms, and give the
  range for a 330-ohm resistor with a gold tolerance stripe."
  (Answers: yellow, violet, red; 313.5 to 346.5 ohms.)
- **Rubric (4-point):** *Exemplary* — decodes and encodes values across
  several multipliers, including gold, and computes tolerance ranges;
  *Proficient* — decodes and encodes common values correctly; *Developing*
  — reads the digits correctly but misapplies the multiplier; *Beginning* —
  cannot map colors to digits without the table.

## References

1. [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md) — what resistors do in robot labs.
2. [Electronic color code — Wikipedia](https://en.wikipedia.org/wiki/Electronic_color_code) — the full resistor color code, including multipliers and tolerance bands.
3. [Resistor — Wikipedia](https://en.wikipedia.org/wiki/Resistor) — how resistors limit current and how they are specified.
4. [Engineering tolerance — Wikipedia](https://en.wikipedia.org/wiki/Engineering_tolerance) — what a tolerance percentage means.
5. [Resistor Color Code Calculator (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/resistor-color-code-calculator) — the MicroSim this version was adapted from.
