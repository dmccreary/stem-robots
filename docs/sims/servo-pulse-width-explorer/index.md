---
title: Servo Pulse Width Explorer
description: Move a servo arm from 0 to 180 degrees and see how the angle sets a 1 to 2 ms pulse inside a 20 ms PWM period and a duty_u16 value from 3276 to 6553.
image: /sims/servo-pulse-width-explorer/servo-pulse-width-explorer.png
og:image: /sims/servo-pulse-width-explorer/servo-pulse-width-explorer.png
twitter:image: /sims/servo-pulse-width-explorer/servo-pulse-width-explorer.png
social:
   cards: false
quality_score: 100
---

# Servo Pulse Width Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Servo Pulse Width Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **servo motor** turns to an angle and holds it there. It learns which angle
to use from a PWM signal. The signal repeats every 20 ms (50 times a second).
At the start of each cycle the pin goes HIGH for a short **pulse**:

- A 1 ms pulse means about 0°.
- A 1.5 ms pulse means about 90°.
- A 2 ms pulse means about 180°.

In MicroPython we do not set the pulse in milliseconds. We set a 16-bit duty
value with `servo.duty_u16()`. A 1 ms pulse is 1/20 of the period, so its duty
is about 0.05 × 65535 = 3276. A 2 ms pulse is about 6553.

This MicroSim shows all three views at once. The servo arm shows the angle.
The readout shows the pulse width and the duty value. The timeline shows two
20 ms cycles, with the orange HIGH pulse at the start of each one. The shaded
purple zone marks the 1 ms to 2 ms range the servo understands. The zoomed
gauge makes small changes in the pulse easy to see.

The math matches the `angle_to_duty()` function in
[Chapter 7](../../chapters/07-pwm-motor-speed-actuators/index.md#linear-range-mapping):

`duty = int(min_duty + (angle / 180) * (max_duty - min_duty))`

## How to Use

1. Drag the **Angle** slider. Watch the arm turn and the orange pulse grow
   and shrink. Notice that the 20 ms period never changes.
2. Set the angle to 0°, 90°, and 180°. Write down the pulse and duty value
   for each one.
3. Click **Sweep** to move the arm from 0° to 180° and back in 5° steps, just
   like the Servo Sweep Code in the chapter. Click **Stop sweep** to take
   control again.
4. Real servos are not all the same. Move the **Min duty** and **Max duty**
   sliders to practice calibration. Watch how the duty value changes for the
   same angle.
5. Click **Reset calibration** to go back to 3276 and 6553.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/servo-pulse-width-explorer/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15 minutes

### Learning Objective

Students will *explain* how a servo angle from 0° to 180° maps to a pulse
width from 1 ms to 2 ms inside a 20 ms period, and to a `duty_u16` value from
about 3276 to 6553 at 50 Hz.

### Prerequisites

- PWM duty cycle, PWM frequency, and 16-bit duty values from the
  [Pulse Width Modulation section](../../chapters/07-pwm-motor-speed-actuators/index.md#pulse-width-modulation)
  of Chapter 7
- Converting between fractions, percentages, and milliseconds (period = 1 / frequency)
- GPIO output pins from
  [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)

### Materials

- One robot with a hobby servo on `config.SERVO_PIN` per pair (optional, for the hardware check)

### Activities

1. **Contrast with DC motors (2 min).** Ask: "For a DC motor, what does a
   bigger duty cycle do?" (It spins faster.) "What do you think a bigger pulse
   does for a servo?" Record predictions.
2. **Fill in a table (5 min).** Students set the angle to 0°, 45°, 90°, 135°,
   and 180° and record the pulse width and duty value for each. They should see
   that each 45° adds about 0.25 ms and about 819 duty units.
3. **Explain the period (3 min).** Students start the sweep and watch the
   timeline. Ask: "What part of the signal changes, and what part stays the
   same?" The pulse width changes; the 20 ms period does not.
4. **Calibrate (3 min).** Students change **Max duty** to 7000 and explain why
   180° now needs a longer pulse. Connect this to the
   [Servo PWM Calibration](../../chapters/07-pwm-motor-speed-actuators/index.md#servo-pwm-calibration)
   section.
5. **Hardware check (2 min).** Pairs send `servo.duty_u16(4914)` from the REPL
   and confirm the arm points near 90°.

### Assessment

- **Challenge:** "Set the angle to 45°. What pulse width and duty value do you
  see?" (About 1.25 ms and 4095 with the default calibration.) "Raise Max duty
  to 7000. What is the duty at 180°?" (7000.)
- **Explain in writing:** "Use the words *pulse*, *period*, and *duty* to
  explain how the robot tells the servo to point straight up."
- **Rubric (4-point):** *Exemplary* — explains that the pulse width (not the
  period) encodes the angle, converts between ms and duty, and explains why
  calibration is needed. *Proficient* — relates angle to pulse width and duty
  using the table. *Developing* — reads values from the sim but cannot explain
  why the period stays fixed. *Beginning* — believes a bigger duty makes the
  servo spin faster, as with a DC motor.

### Simplifications to Mention

- The arm eases toward each new angle to suggest motion. A real servo's speed
  depends on its motor and load.
- The Min duty and Max duty sliders cover 2500–4000 and 5500–7500, so the
  "Min must be smaller than max" warning cannot appear with these ranges. It
  is kept as a guard in the code.

## References

1. [Chapter 7: PWM, Motor Speed Control, and Actuators — Servo Motors](../../chapters/07-pwm-motor-speed-actuators/index.md#servo-motors) — the 1–2 ms pulse rule and the servo sweep code.
2. [Servo control (Wikipedia)](https://en.wikipedia.org/wiki/Servo_control) — how pulse width sets the position of a hobby servo.
3. [Servomotor (Wikipedia)](https://en.wikipedia.org/wiki/Servomotor) — what is inside a servo and how its feedback loop works.
4. [MicroPython `machine.PWM`](https://docs.micropython.org/en/latest/library/machine.PWM.html) — official documentation for `freq()` and `duty_u16()`.
5. [Servo PWM Explorer (learning-micropython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/servo-pwm-explorer) — the earlier MicroSim this one was adapted from.
