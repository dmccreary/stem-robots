---
title: Voltage and Current Water Analogy
description: A water loop and a robot circuit side by side show that voltage works like water pressure and current works like water flow, using the rule current = voltage / resistance.
image: /sims/voltage-current-water-analogy/voltage-current-water-analogy.png
og:image: /sims/voltage-current-water-analogy/voltage-current-water-analogy.png
twitter:image: /sims/voltage-current-water-analogy/voltage-current-water-analogy.png
social:
   cards: false
quality_score: 100
---

# Voltage and Current Water Analogy

<iframe src="main.html" height="447px" width="100%" scrolling="no"></iframe>

[Run the Voltage and Current Water Analogy MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Electricity is hard to see, but water is easy to picture. This MicroSim puts
two loops side by side. On the left, a **pump** pushes water around a pipe.
On the right, a **battery pack** pushes electric charge around a wire.

- **Voltage** is like water **pressure**. It is the push. More batteries in
  series give more push.
- **Current** is like water **flow**. It is how much moves past a point each
  second. We measure current in amps (A).
- **Resistance** is like a **narrow pipe**. Your robot's motor is the narrow
  part of the loop. A narrower pipe lets less water through.

Both loops follow the same rule: **current = voltage ÷ resistance**. With 4
batteries (6.0 V) and a 12-ohm motor, the current is 6.0 ÷ 12 = 0.50 A.

## How to Use

1. **Move your mouse over the MicroSim** to start the dots moving. Blue dots
   are water. Yellow dots are charge. They always move at the same speed.
2. **Predict, then test.** Before you move the Voltage slider, guess what
   will happen to the flow. Then drag it and check the Current bar.
3. **Change the Motor resistance.** Watch the narrow pipe get thinner and the
   dots slow down.
4. **Press Break the loop.** The valve closes and the switch opens. What
   happens to the dots? Press **Fix the loop** to close it again.

**Challenge:** Set the sliders so the current is exactly 0.30 A. Then explain
in one sentence why the dots stop when you break the loop. The ideas behind
this MicroSim are in
[Chapter 1: Voltage and Current](../../chapters/01-intro-computational-thinking/index.md#voltage-and-current).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/voltage-current-water-analogy/main.html"
        height="447px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *explain* voltage as the push (pressure) that drives charge and
current as the rate of flow, and will *predict* how current changes when
voltage, resistance, or loop continuity changes (Bloom's Taxonomy:
Understand).

### Grade Level

Grades 8–12. No prior physics course is assumed; the division is the only
mathematics required.

### Duration

15 minutes.

### Prerequisites

- The "Voltage and Current" section of
  [Chapter 1](../../chapters/01-intro-computational-thinking/index.md),
  including the water-tower picture of voltage and the unit names volt and
  amp.
- The fact that four 1.5 V AA batteries in series give 6 V.

### Design Notes

The two panels share one model, so every change appears in both
representations at once. Dual representations of this kind help novices map
a concrete source domain (water) onto an abstract target domain (charge),
provided the correspondences are made explicit (Gentner & Gentner, 1983). The
MicroSim therefore labels each mapping ("Pump = Battery", "Narrow pipe =
Motor") and shows matching numeric meters. The dots move only while the
pointer is over the MicroSim; the meters and the formula line carry the same
information when the animation is paused.

The analogy has known limits worth naming in class: water leaks out of a
broken pipe, but charge does not spill out of a broken wire; and the motor's
resistance is not truly constant as it spins.

### Activities

1. **Predict (3 min).** With the MicroSim at its defaults (6.0 V, 12 ohms,
   0.50 A), ask: "What happens to the current if we use only 2 batteries?"
   Students write a prediction and a reason (answer: it halves to 0.25 A).
2. **Observe (4 min).** Students test the prediction, then test the effect
   of raising the resistance from 12 to 24 ohms at 6.0 V (answer: 0.25 A).
3. **Explain (3 min).** Students complete the sentence: "More voltage makes
   the current ___ because ___; more resistance makes the current ___
   because ___."
4. **Challenge (3 min).** Students find a setting that gives exactly 0.30 A.
   Four settings work: 1 battery with 5 ohms, 2 batteries with 10 ohms, 3
   batteries with 15 ohms, and 4 batteries with 20 ohms.
5. **Connect (2 min).** Students break the loop and explain why a loose wire
   stops the whole robot, linking to the chapter's "Basic Circuits" section.

### Assessment

- **Formative:** Compare each student's written prediction from Activity 1
  with the observed result, and ask students who predicted incorrectly to
  revise their reasoning.
- **Exit ticket:** "Your robot's motors run slowly. Using the water
  analogy, give two different reasons this could happen." (Expected: weak
  batteries mean lower pressure; a stiff or jammed motor means a narrower
  pipe.)
- **Rubric (4-point):** *Exemplary* — correctly maps pressure to voltage and
  flow to current, predicts direction and size of change, and names a limit
  of the analogy; *Proficient* — correct mapping and direction of change;
  *Developing* — correct mapping but confuses which quantity changes;
  *Beginning* — treats voltage and current as the same thing.

## References

1. [Chapter 1: Introduction to Computational Thinking and Physical Computing](../../chapters/01-intro-computational-thinking/index.md) — voltage, current, basic circuits, and the battery pack.
2. [Hydraulic analogy — Wikipedia](https://en.wikipedia.org/wiki/Hydraulic_analogy) — the water-pipe model of electric circuits and its limits.
3. [Ohm's law — Wikipedia](https://en.wikipedia.org/wiki/Ohm%27s_law) — the relationship current = voltage ÷ resistance.
4. [Electric current — Wikipedia](https://en.wikipedia.org/wiki/Electric_current) — what current is and how it is measured in amperes.
5. Gentner, D., & Gentner, D. R. (1983). Flowing waters or teeming crowds: Mental models of electricity. In D. Gentner & A. L. Stevens (Eds.), *Mental Models* (pp. 99–129). Lawrence Erlbaum.
6. [Ohm's Law Calculator MicroSim (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/ohms-law-calculator) — the current-flow loop this MicroSim reuses.
