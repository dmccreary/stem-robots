---
title: Battery Pack Health Explorer
description: Wear down four AA batteries in series and see how the falling pack voltage slows the robot's motors and puts the RP2040 board at risk of resetting.
image: /sims/battery-pack-health-explorer/battery-pack-health-explorer.png
og:image: /sims/battery-pack-health-explorer/battery-pack-health-explorer.png
twitter:image: /sims/battery-pack-health-explorer/battery-pack-health-explorer.png
social:
   cards: false
quality_score: 100
---

# Battery Pack Health Explorer

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Battery Pack Health Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Your robot runs on four AA batteries connected end to end. This is called a
**series** connection. Each fresh battery gives about 1.5 volts, so the whole
pack gives about 6 volts. As the batteries wear down, each one gives less
voltage, and the whole pack drops with them.

This MicroSim lets you watch what that drop does to your robot. The colored
bar shows the pack voltage from 0 to 6 volts. The robot view shows how fast the
wheels turn. The **Brain (RP2040)** lamp shows whether the microcontroller
still has enough voltage to run safely. When the pack falls below 4.5 volts,
the lamp blinks red. That means the board may reset or read its sensors wrong.

The numbers in this model are simplified, but the pattern is real. Weak
batteries make a robot slow first, and then they make it act strangely.

## How to Use

1. **Start fresh.** At 100% charge, every battery reads 1.50 V and the pack
   reads 6.00 V. The robot runs at 100% of its best speed.
2. **Drag the Battery charge slider** to the left. Watch each battery's
   voltage, the pointer on the voltage bar, and the wheel speed change together.
3. **Switch the Program command** between full speed (duty 65535) and half
   speed (duty 32768). Notice that half speed is always half of the full-speed
   value, no matter how fresh the batteries are.
4. **Find the reset point.** Move the slider until the Brain lamp turns red.
   What is the highest charge where it first shows "Reset risk"?
5. **Turn on Wear down over time** to drain the pack by 1% each second.
   Press **Swap in fresh batteries** to start over.

The simulation is also described in
[Chapter 1: Introduction to Computational Thinking and Physical Computing](../../chapters/01-intro-computational-thinking/index.md#your-battery-pack).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/battery-pack-health-explorer/main.html"
        height="452px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *analyze* how the voltage of a four-cell AA battery pack affects
motor speed and microcontroller reliability, and will use that analysis to
decide what to check first when a physical robot behaves unexpectedly
(Bloom's Taxonomy: Analyze).

### Grade Level

Grades 8–12. No prior electronics coursework is assumed.

### Duration

15–20 minutes.

### Prerequisites

- The "Voltage and Current" and "Your Battery Pack" sections of
  [Chapter 1](../../chapters/01-intro-computational-thinking/index.md),
  including the idea that four 1.5 V cells in series produce 6 V.
- The water-pressure picture of voltage from the
  [Voltage and Current Water Analogy](../voltage-current-water-analogy/index.md) MicroSim.

### Model Used in the Simulation

The simulation uses a deliberately linear model so that students can reason
about it quantitatively:

| Quantity | Formula | Fresh (100%) | Worn out (0%) |
|----------|---------|--------------|---------------|
| Cell voltage | 0.9 + 0.6 × (charge / 100) | 1.50 V | 0.90 V |
| Pack voltage | 4 × cell voltage | 6.00 V | 3.60 V |
| Motor speed | (pack voltage / 6.0) × duty fraction | 100% | 60% |
| Reset risk | pack voltage < 4.5 V | no | yes |

Real alkaline discharge curves are non-linear, and the Maker Pi RP2040's
on-board regulator changes the exact threshold. Point this out explicitly so
that students treat the numbers as a model rather than as measured data.

### Activities

1. **Predict (3 min).** Before students touch the controls, ask: "If each
   battery drops to 1.2 V, what is the pack voltage, and how fast will the
   robot drive?" Record predictions on the board (answer: 4.8 V and 80%).
2. **Explore (5 min).** Students drag the charge slider from 100% to 0% and
   record, at 20% intervals, the pack voltage, motor speed, and board status in
   a three-column table.
3. **Analyze (5 min).** Students answer the challenge: find the highest charge
   at which the board first shows "Reset risk". The correct answer is 35%. The
   threshold is crossed at 37.5%, and the slider moves in 5% steps, so 40% is
   still green. Ask students to justify the answer with the formula, not only
   the lamp color.
4. **Compare commands (3 min).** Students repeat one measurement with the half
   speed command and explain why halving the duty cycle halves the speed but
   does not change the reset risk.
5. **Transfer (2 min).** Ask: "Your real robot drives slowly and sometimes
   restarts by itself. What do you check first, and why?"

### Assessment

- **Formative:** Check the data tables from Activity 2 for a consistent,
  steadily falling pattern in voltage and speed.
- **Exit ticket:** "Explain, using the words *voltage*, *motor speed*, and
  *reset*, why fresh batteries fix many mysterious robot problems."
- **Rubric (4-point):** *Exemplary* — links low voltage to both slower motors
  and board resets and cites the 4.5 V threshold; *Proficient* — links low
  voltage to one of the two effects with a correct number; *Developing* —
  states that batteries matter but gives no mechanism; *Beginning* — blames
  the code or gives no reason.

## References

1. [Chapter 1: Introduction to Computational Thinking and Physical Computing](../../chapters/01-intro-computational-thinking/index.md) — the chapter section on voltage, current, and the battery pack.
2. [AA battery — Wikipedia](https://en.wikipedia.org/wiki/AA_battery) — nominal voltage and typical discharge behavior of alkaline AA cells.
3. [Series and parallel circuits — Wikipedia](https://en.wikipedia.org/wiki/Series_and_parallel_circuits) — why cell voltages add when batteries are connected end to end.
4. [Brownout (electricity) — Wikipedia](https://en.wikipedia.org/wiki/Brownout_(electricity)) — what happens to electronics when supply voltage sags.
5. [MicroPython machine.PWM documentation](https://docs.micropython.org/en/latest/library/machine.PWM.html) — the `duty_u16()` values 0–65535 used by the program command.
6. [Cytron Maker Pi RP2040 product page](https://www.cytron.io/p-maker-pi-rp2040-simplifying-robotics-with-raspberry-pi-rp2040) — the robot controller board and its battery input.
