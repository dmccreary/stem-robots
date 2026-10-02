---
title: "OLED Framebuffer and show()"
description: "Run display.fill(0), text(), ellipse(), rect(), and show() one step at a time to see that drawing changes only the framebuffer in memory and show() copies it to the OLED screen."
image: /sims/oled-framebuffer-show-demo/oled-framebuffer-show-demo.png
og:image: /sims/oled-framebuffer-show-demo/oled-framebuffer-show-demo.png
twitter:image: /sims/oled-framebuffer-show-demo/oled-framebuffer-show-demo.png
social:
   cards: false
quality_score: 100
status: implemented
---

# OLED Framebuffer and show()

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the OLED Framebuffer and show() MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Your robot's OLED screen is 128 pixels wide and 64 pixels tall. The robot does
not draw straight onto the screen. Instead, it keeps a copy of the screen in its
memory, called the **framebuffer**. Every drawing call, such as
`display.text()` or `display.rect()`, changes only the framebuffer. Nothing new
appears on the screen until your code calls `display.show()`. Then the whole
framebuffer is copied to the screen in one fast step, so the picture does not
flicker.

This MicroSim shows both at once:

- The **left panel** is the framebuffer, in the robot's memory.
- The **right panel** is the OLED screen, what you actually see.
- The **blue arrow** flashes orange each time `show()` copies the framebuffer.
- The **code list** highlights the line that just ran.
- The **status line** tells you whether the screen is up to date.

The code is the same pattern used in
[Chapter 9](../../chapters/09-display-systems-output/index.md#display-resolution-and-the-framebuffer):
clear with `fill(0)`, draw, then `show()`.

## How to Use

1. Click **2. text()**. Look at both panels. Did the screen change?
2. Click **3. ellipse()** and **4. rect()**. The framebuffer fills up, but the
   status says the screen is out of date.
3. Click **5. show()**. Watch the arrow flash and the screen catch up.
4. Click **1. fill(0)**. The framebuffer goes black, but the screen does not.
   Why? Click **show()** to find out.
5. Click **Run all in order** to watch all five steps run one after another.
6. Click **Loop mode: move the ellipse**. The ellipse moves 8 pixels right on
   each pass. Then check **Skip fill(0) in loop mode** and watch what happens.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/oled-framebuffer-show-demo/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15 minutes

### Learning Objective

Students will *explain* why display code calls `display.fill(0)`, then draws,
then calls `display.show()`, and will *predict* what the OLED screen shows when
one of those steps is left out.

### Prerequisites

- `while` loops and functions from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- Pixels and screen coordinates, with (0, 0) in the top-left corner
- The OLED display and SSD1306 sections of
  [Chapter 9](../../chapters/09-display-systems-output/index.md#the-oled-display)

### Activities

1. **Predict (2 min).** Show the code list and ask: "After step 2 runs, what
   is on the screen?" Record answers before anyone clicks.
2. **Step through (4 min).** Students click the five steps one at a time and
   describe, after each click, what changed in each panel.
3. **Break the order (3 min).** Students try orders such as show, then text; or
   text, show, fill(0). For each, they predict the screen first, then check.
4. **Loop mode (4 min).** Students run loop mode with and without
   **Skip fill(0)**. They explain the smeared trail in terms of the framebuffer.
5. **Connect to hardware (2 min).** Ask: "Why does the robot draw into memory
   first instead of drawing each pixel on the screen right away?" (One fast copy
   avoids flicker and half-drawn frames.)

### Assessment

- **Challenge:** "Press display.text and then look at the screen. What do you
  see?" (Nothing new. The text is only in the framebuffer until `show()` runs.)
  "Run loop mode with Skip fill(0) checked. What appears, and how do you fix
  it?" (A smeared trail of ellipses. Call `display.fill(0)` at the start of
  every pass.)
- **Debug a program:** Give students a loop with `display.show()` placed before
  the drawing calls. Ask what the screen shows (each frame appears one pass
  late) and how to fix it.
- **Rubric (4-point):** *Exemplary* — explains the roles of the framebuffer,
  `fill(0)`, and `show()`, and predicts the result of any missing or reordered
  step. *Proficient* — explains why `show()` is needed and why `fill(0)` stops
  smearing. *Developing* — knows the correct order but cannot explain why.
  *Beginning* — believes drawing calls change the screen directly.

### Simplifications to Mention

- The real `show()` sends 1,024 bytes over I2C or SPI, which takes a few
  milliseconds. The sim copies instantly.
- The letters use a common public-domain 8×8 font, like the MicroPython
  `framebuf` font, so they may differ by a pixel or two from your screen.

## References

1. [Chapter 9: Display Systems and Visual Output — Display Resolution and the Framebuffer](../../chapters/09-display-systems-output/index.md#display-resolution-and-the-framebuffer) — the fill, draw, show pattern.
2. [MicroPython `framebuf` module](https://docs.micropython.org/en/latest/library/framebuf.html) — the drawing methods (`fill`, `text`, `ellipse`, `rect`) behind the display object.
3. [MicroPython SSD1306 driver (micropython-lib)](https://github.com/micropython/micropython-lib/blob/master/micropython/drivers/display/ssd1306/ssd1306.py) — the source of `ssd1306.py`, including `show()`.
4. [SSD1306 datasheet (Adafruit)](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf) — the OLED controller chip and its display memory.
5. [Framebuffer (Wikipedia)](https://en.wikipedia.org/wiki/Framebuffer) — what a framebuffer is and how screens use one.
6. [Multiple buffering (Wikipedia)](https://en.wikipedia.org/wiki/Multiple_buffering) — why drawing off-screen and then copying avoids flicker.
