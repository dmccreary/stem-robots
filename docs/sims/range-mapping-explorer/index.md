---
title: Range Mapping Explorer
description: Pick an input range and an output range, move the input, and see the linear mapping formula fill in with real numbers, including clamping and int() rounding.
image: /sims/range-mapping-explorer/range-mapping-explorer.png
og:image: /sims/range-mapping-explorer/range-mapping-explorer.png
twitter:image: /sims/range-mapping-explorer/range-mapping-explorer.png
social:
   cards: false
quality_score: 100
---

# Range Mapping Explorer

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Range Mapping Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Robots turn one kind of number into another all the time. A servo angle
becomes a duty value. A distance becomes the height of a bar on the screen.
A knob reading becomes a motor speed. This is called **linear range mapping**.
It uses one formula:

`result = out_min + (x - in_min) / (in_max - in_min) * (out_max - out_min)`

The idea is simple. First, find how far `x` is through the input range, as a
fraction. Then go the same fraction through the output range.

This MicroSim draws the input range on the top line and the output range on
the bottom line. The two ranges line up, so the blue marker (x) and the orange
marker (the result) always sit the same fraction of the way along their own
ranges. The formula box fills in your real numbers, just like the
`angle_to_duty()` function in
[Chapter 7](../../chapters/07-pwm-motor-speed-actuators/index.md#linear-range-mapping).

If `x` goes past the end of the input range, the result goes past the end of
the output range too. The marker turns red to warn you. Turn on **Clamp
output** to keep the result inside the range, the way `min()` and `max()` do in
robot code.

## How to Use

1. Start with the **Servo angle to duty** preset. Move the **Input x** slider
   and watch the duty value change. At 90 degrees you should see 4914.
2. Before you move the slider again, predict the result for 45 degrees.
   Then check your answer.
3. Choose **ToF distance to bar height**. Set x to 150 cm, then to 250 cm.
   What happens to the bar height at 250 cm?
4. Turn on **Clamp output** and watch the red marker snap back to the end of
   the range.
5. Turn **Round to integer** on and off. It works like Python's `int()`,
   which drops the decimal part.
6. Choose **Custom** and type your own ranges. Try an output range that runs
   backward, like 50 to 0. The gray lines cross to show the flip.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/range-mapping-explorer/main.html"
        height="452px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Learning Objective

Students will *apply* the linear mapping formula
`out_min + (x - in_min) / (in_max - in_min) * (out_max - out_min)` to choose
input and output ranges and *predict* the mapped value, including the effect
of clamping and integer truncation.

### Prerequisites

- Variables, integers, and arithmetic operators from
  [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md)
- Writing and calling functions from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- The servo angle range (1–2 ms pulses, duty 3276–6553) from the
  [Servo Motors section of Chapter 7](../../chapters/07-pwm-motor-speed-actuators/index.md#servo-motors)

### Activities

1. **Warm-up (3 min).** Ask: "A trip is 180 km long and you have driven 90 km.
   What fraction of the trip is done?" Connect the answer (one half) to the
   first part of the formula, `(x - in_min) / (in_max - in_min)`.
2. **Predict, then check (6 min).** Pairs use the servo preset. One student
   names an angle; the other predicts the duty value on paper before moving
   the slider. Swap roles after three rounds. Target angles: 0, 45, 135, 180.
3. **Out of range (4 min).** With the ToF preset, students find the bar
   height for 150 cm and 250 cm, then turn on clamping. Discuss why a real
   display needs the clamp.
4. **Design a mapping (5 min).** In Custom mode, students build a map for a
   new job, such as a light sensor (0–65535) to a NeoPixel brightness (0–255),
   or a distance (10–100 cm) to a buzzer pitch that rises as objects get closer
   (a reversed range, for example 2000 down to 200 Hz).

### Assessment

- **Challenge:** "With the ToF preset, what bar height do you get for 150 cm?"
  (37 pixels.) "What about 250 cm with clamp off and with clamp on?"
  (62 pixels; 50 pixels.)
- **Transfer question:** "A potentiometer reads 49151. Map it to a speed from
  0 to 100 percent with `int()`." (74.)
- **Rubric (4-point):** *Exemplary* — predicts values within 1 unit before
  checking, explains the fraction idea, and justifies when to clamp.
  *Proficient* — predicts values correctly using the formula. *Developing* —
  finds values only by moving the slider. *Beginning* — cannot identify the
  input and output ranges for a given task.

### Common Misconceptions

- Students may think the result is always inside the output range. The
  250 cm case shows it is not unless the code clamps it.
- Students may expect `int()` to round 4914.5 up to 4915. It truncates to 4914.

## References

1. [Chapter 7: PWM, Motor Speed Control, and Actuators — Linear Range Mapping](../../chapters/07-pwm-motor-speed-actuators/index.md#linear-range-mapping) — the `angle_to_duty()` function this MicroSim generalizes.
2. [Linear interpolation (Wikipedia)](https://en.wikipedia.org/wiki/Linear_interpolation) — the math behind mapping one range onto another.
3. [Clamping (graphics) (Wikipedia)](https://en.wikipedia.org/wiki/Clamping_(graphics)) — limiting a value to a range.
4. [Arduino `map()` reference](https://docs.arduino.cc/language-reference/en/functions/math/map/) — the same formula as a built-in Arduino function, with notes on integer math.
5. [p5.js `map()` reference](https://p5js.org/reference/p5/map/) — the JavaScript version used to draw this MicroSim.
6. [MicroPython `machine.ADC`](https://docs.micropython.org/en/latest/library/machine.ADC.html) — `read_u16()` returns 0 to 65535, the input range of the "Pot to speed" preset.
