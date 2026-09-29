---
title: IR Reflectance Threshold Explorer
description: See how surface color, distance, and the trimmer threshold decide whether an active-LOW IR sensor reads 0 (surface detected) or 1 (nothing detected).
image: /sims/ir-reflectance-threshold-explorer/ir-reflectance-threshold-explorer.png
og:image: /sims/ir-reflectance-threshold-explorer/ir-reflectance-threshold-explorer.png
twitter:image: /sims/ir-reflectance-threshold-explorer/ir-reflectance-threshold-explorer.png
social:
   cards: false
quality_score: 100
---

# IR Reflectance Threshold Explorer

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the IR Reflectance Threshold Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

An **IR sensor** shines invisible infrared light down at a surface. A detector
next to the light measures how much bounces back. White surfaces bounce back a
lot. Black surfaces soak most of it up. The closer the surface, the more light
comes back.

That amount changes smoothly, but the sensor's output pin can only say 0 or 1.
A small dial on the module, called the **trimmer**, sets a **threshold**. If the
reflected light is at or above the threshold, the pin reads **0**, which means
"surface detected". If it is below, the pin reads **1**. This is called
**active LOW**, because LOW (0) means yes. It is the rule used in
[Chapter 8](../../chapters/08-sensors-data-input/index.md#ir-digital-output).

This MicroSim shows the sensor above a surface on the left. The graph on the
right shows how much IR comes back from white, gray, and black surfaces at every
distance from 0 to 15 cm. The orange line is the threshold. Anything in the
green zone above it reads 0. The dashed orange line shows the distance where
the current surface switches from 0 to 1.

## How to Use

1. Start with a white surface at 4 cm. The reading is 50 and the output is 0.
2. Before you move the **Distance** slider, predict: at what distance will the
   output change to 1? Check your answer with the "switches at" marker.
3. Click **Black**. What does the sensor read at 4 cm now? Why?
4. Move the **Threshold** slider. This is the trimmer dial on your real sensor.
   Find a threshold that gives 0 for white and 1 for black at 4 cm.
5. Click **Auto-calibrate**. It puts the threshold halfway between the black
   and white readings at the current distance.
6. Check **Bright room**. Sunlight adds extra IR to every reading. Watch for
   the warning "Black and white give the same answer here".

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/ir-reflectance-threshold-explorer/main.html"
        height="472px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Learning Objective

Students will *predict* whether an active-LOW IR sensor reads 0 or 1 for a given
surface and distance, and will *set* the trimmer threshold so the sensor
switches at a chosen distance and separates black from white.

### Prerequisites

- GPIO input pins and HIGH/LOW logic from
  [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)
- `if` statements and comparison operators from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- Reading a line graph (x and y axes)

### Materials

- Optional: one robot with an IR line sensor per pair, plus a sheet of white
  paper with a strip of black electrical tape

### Activities

1. **Predict (3 min).** Before using the sim, students answer: "Will a black
   surface or a white surface make the sensor say 0?" and "Does 0 mean yes or
   no?" Discuss active LOW.
2. **Read the graph (4 min).** With white at threshold 40, students find the
   switch distance (about 4.9 cm) and explain it as the place where the curve
   crosses the orange line.
3. **Separate black from white (4 min).** At 4 cm, students switch between white
   and black and find the range of thresholds that tells them apart
   (above 7.5 and up to 50). They compare their choice with **Auto-calibrate**.
4. **Change the conditions (4 min).** Students check **Bright room** and move
   the distance to 10 cm. They explain why black and white now give the same
   answer, and what they would do on a real robot (lower the sensor, shade it,
   or recalibrate).
5. **Hardware check (3 min).** Pairs turn the trimmer on a real module until it
   switches between the tape and the paper, then read `ir_left.value()` in the REPL.

### Assessment

- **Challenge:** "With a white surface, find the largest distance where the
  sensor still reads 0 at threshold 40." (About 4.9 cm.) "Switch to black at
  4 cm. What is the output, and what threshold would separate black from white?"
  (Output 1, reading 7.5. Any threshold above 7.5 and up to 50, such as 30.)
- **Predict:** Give three (surface, distance, threshold) cases and ask students
  to predict 0 or 1 before checking in the sim.
- **Rubric (4-point):** *Exemplary* — predicts outputs correctly, explains
  active LOW, and justifies a threshold for a given distance and room.
  *Proficient* — predicts outputs and chooses a working threshold.
  *Developing* — finds a working threshold by trial and error only.
  *Beginning* — expects 1 to mean "surface detected".

### Simplifications to Mention

- The curve shape, reflected IR = peak × 100 / (1 + (d / 4)²), is a simple
  model. Real modules also have a minimum range and depend on the surface texture.
- Some line-sensor modules invert their output. Always test yours over black
  and white before you trust the numbers.

## References

1. [Chapter 8: Sensors and Data Input — Infrared Sensor](../../chapters/08-sensors-data-input/index.md#infrared-sensor) — the IR digital output code and calibration steps.
2. [TCRT5000 reflective optical sensor datasheet (Vishay)](https://www.vishay.com/docs/83760/tcrt5000.pdf) — a common IR emitter-detector pair used on line-sensor modules.
3. [Infrared (Wikipedia)](https://en.wikipedia.org/wiki/Infrared) — what infrared light is and why we cannot see it.
4. [Logic level (Wikipedia)](https://en.wikipedia.org/wiki/Logic_level) — active-high and active-low signals.
5. [Potentiometer (Wikipedia)](https://en.wikipedia.org/wiki/Potentiometer) — how the trimmer dial sets the threshold.
6. [MicroPython `machine.Pin`](https://docs.micropython.org/en/latest/library/machine.Pin.html) — reading a digital input with `value()`.
