---
title: "Piezo Tone Frequency Explorer"
description: "Play a PWM tone and see how the frequency passed to buzzer.freq() sets the pitch, the period of the wave, and the piano note, and why 50% duty is the loudest."
image: /sims/piezo-tone-frequency-explorer/piezo-tone-frequency-explorer.png
og:image: /sims/piezo-tone-frequency-explorer/piezo-tone-frequency-explorer.png
twitter:image: /sims/piezo-tone-frequency-explorer/piezo-tone-frequency-explorer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Piezo Tone Frequency Explorer

<iframe src="main.html" height="477px" width="100%" scrolling="no"></iframe>

[Run the Piezo Tone Frequency Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A piezo buzzer makes sound when a PWM signal flips its pin between HIGH and
LOW. Each flip bends a thin crystal disk, and the disk pushes the air.
The **frequency** is how many times per second the signal repeats. A higher
frequency means a higher pitch. The **period** is the time for one repeat,
and it equals 1000 ÷ frequency in milliseconds.

This MicroSim shows the same numbers you use in the `play_tone()` code in
[Chapter 7](../../chapters/07-pwm-motor-speed-actuators/index.md#tone-frequency-control):

- The **piano keyboard** shows one octave, from C4 (262 Hz) to C5 (523 Hz).
- The **wave view** draws the PWM signal. The orange part is HIGH (3.3 V).
  The gray part is LOW (0 V). A blue arrow marks one period.
- The **code box** shows `buzzer.freq()` and `buzzer.duty_u16()` with the
  values you pick.
- The **loudness meter** shows how strong the tone is for your duty cycle.

The sound is a square wave, just like the one your robot's buzzer pin makes.
Your browser only allows sound after you click, so nothing plays until you
press **Play**, click a key, or click **Startup melody**.

## How to Use

1. Click **Play** to hear a steady 440 Hz tone (the note A4).
2. Click a few piano keys. Each key sets the frequency to its note. Watch the
   period get shorter as the notes get higher.
3. Drag the **Frequency** slider from 100 Hz up to 2000 Hz. The wave view shows
   more cycles as the frequency rises, and the nearest note name updates.
4. Drag the **Duty** slider. The HIGH part of each cycle gets wider or
   narrower. Listen to the volume and watch the loudness meter.
5. Set the duty to 0% and then to 100%. Why is the buzzer silent at both ends?
6. Click **Startup melody** to hear 440 Hz, 523 Hz, and 659 Hz, the same three
   notes as the chapter's code.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/piezo-tone-frequency-explorer/main.html"
        height="477px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15 minutes

### Learning Objective

Students will *relate* the PWM frequency passed to `buzzer.freq()` to the
pitch they hear and to the signal period (period = 1000 / frequency ms), and
will *explain* why a 50% duty cycle produces the loudest tone while 0% and
100% produce silence.

### Prerequisites

- PWM duty cycle and 16-bit duty values from the
  [Pulse Width Modulation section](../../chapters/07-pwm-motor-speed-actuators/index.md#pulse-width-modulation)
  of Chapter 7
- GPIO HIGH and LOW levels from
  [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)
- Calling functions with arguments from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)

### Materials

- Headphones or classroom speakers (optional; the visual readouts work without sound)
- One robot with a piezo buzzer per pair for the hardware check

### Activities

1. **Predict (2 min).** Ask: "If we double the frequency, what happens to the
   period?" Students write a prediction before touching the sim.
2. **Explore frequency (4 min).** Students play A4 (440 Hz), then find the key
   an octave higher on the slider (880 Hz). They record both periods (2.27 ms and
   1.14 ms) and check their prediction.
3. **Explore duty (4 min).** Students step the duty slider from 0% to 100% in
   25% steps and record the loudness at each step. They should find the peak at
   50% and silence at both ends, because a pin that never changes state never
   moves the piezo disk.
4. **Match the melody (3 min).** Students play the startup melody and name its
   three notes (A4, C5, E5) using the "Nearest note" readout.
5. **Hardware check (2 min).** Pairs type the three `play_tone()` calls from the
   chapter into the REPL and compare the robot's sound with the sim.

### Assessment

- **Quick check:** "What frequency plays E5, and what is its period?"
  (659 Hz; about 1.52 ms.)
- **Explain:** "Your buzzer is silent. The code calls `buzzer.freq(440)`.
  What value of `duty_u16()` could cause this?" (0 or 65535.)
- **Rubric (4-point):** *Exemplary* — states that pitch rises with frequency,
  computes a period correctly, and explains silence at 0% and 100% in terms of
  the pin never switching. *Proficient* — relates frequency to pitch and names
  50% as loudest. *Developing* — relates frequency to pitch but cannot explain
  the duty result. *Beginning* — confuses duty cycle with frequency.

### Simplifications to Mention

- The loudness meter uses the simple rule loudness = 1 − |duty − 50| / 50.
  A real piezo's response also depends on its resonant frequency, so some
  pitches sound louder than others.
- The browser plays a perfect square wave at 50% duty and changes only its
  volume as you move the duty slider. The wave view shows the true duty shape.

## References

1. [Chapter 7: PWM, Motor Speed Control, and Actuators — Piezo Buzzer](../../chapters/07-pwm-motor-speed-actuators/index.md#piezo-buzzer-sound-feedback) — the `play_tone()` code and startup melody used here.
2. [Piano key frequencies (Wikipedia)](https://en.wikipedia.org/wiki/Piano_key_frequencies) — the standard frequency of every note on a piano.
3. [Piezoelectric speaker (Wikipedia)](https://en.wikipedia.org/wiki/Piezoelectric_speaker) — how a piezo element turns voltage changes into sound.
4. [MicroPython `machine.PWM`](https://docs.micropython.org/en/latest/library/machine.PWM.html) — official documentation for `freq()` and `duty_u16()`.
5. [p5.sound `p5.Oscillator` reference](https://p5js.org/reference/p5.sound/p5.Oscillator/) — the oscillator that plays the square wave in this MicroSim.
6. [Piano Keyboard Tone Generator (learning-micropython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/piano-tone-generator) — the earlier MicroSim this one was adapted from.
