---
title: "Button Bounce Timeline"
description: "A slow-motion timeline that shows how one button press on pin 20 makes many falling edges, and how a debounce window decides which edges count as presses."
image: /sims/button-bounce-timeline/button-bounce-timeline.png
og:image: /sims/button-bounce-timeline/button-bounce-timeline.png
twitter:image: /sims/button-bounce-timeline/button-bounce-timeline.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Button Bounce Timeline

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Button Bounce Timeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

When you press a button, the metal contacts inside do not close cleanly.
They bounce open and closed several times in just a few milliseconds.
Your robot's button is on pin 20, which rests HIGH at 3.3 V because of a
pull-up resistor. Every bounce drops the pin from HIGH to LOW again, and
each drop is a **falling edge**. With `Pin.IRQ_FALLING`, every falling edge
runs your interrupt handler.

This MicroSim slows time down so you can see the bounce. It uses the same
rule as the `button_pressed()` handler in
[Chapter 7](../../chapters/07-pwm-motor-speed-actuators/index.md#button-debouncing):
an edge counts as a press only if more time than the debounce window has
passed since the last counted press.

The timeline has three strips that share one time axis from 0 to 200 ms:

- **Pin 20 signal** shows the voltage. Watch it flip up and down during the bounce.
- **Falling edges (IRQ fires)** puts a numbered red arrow at every HIGH-to-LOW drop.
- **Presses counted** shows a green check for each edge the handler accepts
  and a gray × for each edge it ignores.

The shaded blue band is the debounce window. Any edge inside the band is ignored.

## How to Use

1. Click **Press**. Watch the signal bounce, then count the red arrows.
   How many falling edges did one press make?
2. Hover over any red arrow. The tooltip shows the exact test the code runs,
   such as `1.5 > 150? No, so it is ignored`.
3. Drag **Debounce window** down to 0 ms. Every edge is now counted, and the
   message says the bounce was counted as extra presses.
4. Click **Press twice quickly**. This makes two real presses 100 ms apart.
   With a 150 ms window, the second press is missed.
5. Find a window that counts both presses once each. Try changing
   **Bounce length** too. The pattern changes each time you let go of that slider.
6. Check **Show code** to see the handler. The number in the `if` line
   follows the slider.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/button-bounce-timeline/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Learning Objective

Students will *analyze* a bounced button signal to *explain* why one press
produces several falling-edge interrupts, and will *select* a debounce window
that is longer than the bounce but shorter than the gap between two real presses.

### Prerequisites

- GPIO pins, HIGH/LOW, and pull-up resistors from
  [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)
- `if` statements, functions, and `ticks_ms()`/`ticks_diff()` timing from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- The GPIO interrupt and IRQ falling edge sections of
  [Chapter 7](../../chapters/07-pwm-motor-speed-actuators/index.md#gpio-interrupts-and-button-debouncing)

### Activities

1. **Predict (3 min).** Before anyone clicks, ask: "If you press the button
   once, how many times will `button_pressed()` run?" Record the class
   predictions. Most students will say once.
2. **Observe (4 min).** Students click **Press** several times with the
   default settings and record the number of falling edges each time.
   Point out that the number changes from press to press, just as it does
   with real contacts.
3. **Break it on purpose (4 min).** Students set the window to 0 ms and press
   again. They compare "Falling edges seen" with "Presses counted" and explain
   why the two numbers are now equal.
4. **Find the safe range (5 min).** Using **Press twice quickly**, pairs find
   the smallest and largest windows that count both presses exactly once, for
   a 12 ms bounce and again for a 30 ms bounce. They should conclude that the
   window must be longer than the bounce and shorter than the 100 ms gap.
5. **Connect to hardware (2 min).** Students explain why the chapter's
   150 ms value is a reasonable default for a human pressing a robot button,
   and when it would fail (a fast double-tap).

### Assessment

- **Exit question:** "A button bounces for 20 ms. A user can press it at most
  every 250 ms. Name one debounce window that works and one that fails, and
  explain each failure." (Any value between about 20 and 250 ms works; a value
  below 20 ms double-counts, and a value above 250 ms misses presses.)
- **Hover check:** Ask students to hover over an ignored edge and read the
  tooltip aloud as a sentence that uses the words *falling edge*, *window*,
  and *ignored*.
- **Rubric (4-point):** *Exemplary* — explains bounce, chooses a window with
  both limits justified, and connects it to the `> 150` line of code.
  *Proficient* — chooses a working window and names one limit. *Developing* —
  chooses a working window by trial and error but cannot say why it works.
  *Beginning* — believes one press always makes one interrupt.

### Simplifications to Mention

- Real button releases also bounce, which can add falling edges. The sim
  draws each release as one clean rising edge so the focus stays on the press.
- `ticks_ms()` counts whole milliseconds. The sim uses exact times, so two
  edges less than 1 ms apart can both count when the window is 0 ms.

## References

1. [Chapter 7: PWM, Motor Speed Control, and Actuators — Button Debouncing](../../chapters/07-pwm-motor-speed-actuators/index.md#button-debouncing) — the handler code this MicroSim models.
2. [Switch: Contact bounce (Wikipedia)](https://en.wikipedia.org/wiki/Switch#Contact_bounce) — why mechanical contacts bounce and common ways to debounce them.
3. [MicroPython `machine.Pin` — `Pin.irq()`](https://docs.micropython.org/en/latest/library/machine.Pin.html) — official documentation for pin interrupts and `Pin.IRQ_FALLING`.
4. [MicroPython `time` module — `ticks_ms()` and `ticks_diff()`](https://docs.micropython.org/en/latest/library/time.html) — the timing functions used in the debounce test.
5. [Jack Ganssle: A Guide to Debouncing](https://www.ganssle.com/debouncing.htm) — measurements of real switch bounce times and software debounce strategies.
