---
title: "NeoPixel RGB Color Mixer"
description: "Mix red, green, and blue values from 0 to 255 on the robot's two NeoPixels, see the glow, and copy the matching np[0] = (r, g, b) line of MicroPython."
image: /sims/neopixel-rgb-color-mixer/neopixel-rgb-color-mixer.png
og:image: /sims/neopixel-rgb-color-mixer/neopixel-rgb-color-mixer.png
twitter:image: /sims/neopixel-rgb-color-mixer/neopixel-rgb-color-mixer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# NeoPixel RGB Color Mixer

<iframe src="main.html" height="507px" width="100%" scrolling="no"></iframe>

[Run the NeoPixel RGB Color Mixer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Your robot's Maker Pi RP2040 board has two **NeoPixel** LEDs on GPIO 18.
Each NeoPixel has three tiny lights inside it: red, green, and blue. You set
each one to a number from 0 (off) to 255 (full). Mixing the three makes any
color. This is how every phone and TV screen makes color too.

In MicroPython you set a color with a line like `np[0] = (255, 80, 0)`, where
the numbers are red, green, and blue. Then you call `np.write()` to send the
colors to the LEDs, as shown in
[Chapter 9](../../chapters/09-display-systems-output/index.md#neopixel-library).

This MicroSim shows the two LEDs glowing on the board. The swatch shows the same
color without the glow. The code box shows the exact lines to type. The
**Closest name** line compares your mix with the color table in the chapter.

## How to Use

1. Move the **Red**, **Green**, and **Blue** sliders, or type numbers into the
   boxes. Watch the LEDs and the code box change.
2. Choose which LED to edit: **LED 0**, **LED 1**, or **Both**. A dashed ring
   marks the LED you are editing.
3. Click a color button, such as **Yellow**, to load a row from the chapter's
   color table.
4. Click a **Status** button to load a traffic-light color: Clear (green),
   Caution (yellow), Stop (red), or Standby (blue).
5. Lower the **Brightness**. Each value is multiplied by the brightness and
   rounded down, and the code box shows the new numbers.
6. Try to make a color without the presets, then check the closest name.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/neopixel-rgb-color-mixer/main.html"
        height="507px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15 minutes

### Learning Objective

Students will *apply* additive RGB color mixing to choose R, G, and B values
from 0 to 255 that produce a target color, and will *write* the matching
`np[0] = (r, g, b)` line, including brightness scaling.

### Prerequisites

- Tuples and lists from
  [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md)
- Integers and multiplication from
  [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md)
- The Maker Pi RP2040 board layout from
  [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md)

### Materials

- One robot per pair (optional, to test colors on the real NeoPixels)

### Activities

1. **Predict (2 min).** Ask: "What color do you get when red and green are both
   at 255 and blue is 0?" Many students expect brown. Check it in the sim (yellow).
2. **Match the table (4 min).** Students hide the presets (no clicking) and try
   to make yellow, orange, and white from scratch, then check with the closest
   name line.
3. **Two LEDs (3 min).** Students choose **LED 1** and give each LED a
   different status color. They copy the two `np[...]` lines and the `np.write()`
   line from the code box.
4. **Brightness math (3 min).** Students set yellow, then brightness 20%, and
   compute the new values by hand before reading the code box.
5. **Hardware check (3 min).** Pairs paste their lines into the REPL on the
   real robot and compare the LEDs with the sim.

### Assessment

- **Challenge:** "Make a yellow that matches the chapter's table. What values
  do you use?" ((255, 200, 0).) "Lower the brightness to 20%. What does the code
  box show?" ((51, 40, 0).)
- **Write the code:** "Write the lines that make LED 0 red and LED 1 blue."
  (`np[0] = (255, 0, 0)`, `np[1] = (0, 0, 255)`, `np.write()`.)
- **Rubric (4-point):** *Exemplary* — builds target colors without presets,
  explains additive mixing, and computes brightness-scaled values correctly.
  *Proficient* — builds target colors and writes correct `np[...]` lines.
  *Developing* — relies on presets and forgets `np.write()`. *Beginning* —
  confuses the channel order or expects values above 255.

### Simplifications to Mention

- A screen can only suggest how bright a real LED looks. Real NeoPixels at
  full white are very bright, so many robot programs use low brightness.
- The MicroPython `neopixel` module has no brightness setting. You scale the
  numbers yourself, just like the code box does.

## References

1. [Chapter 9: Display Systems and Visual Output — NeoPixel LEDs](../../chapters/09-display-systems-output/index.md#neopixel-leds) — the color table and `set_status_color()` code.
2. [MicroPython `neopixel` module](https://docs.micropython.org/en/latest/library/neopixel.html) — official documentation for `NeoPixel()` and `write()`.
3. [WS2812B datasheet (Adafruit)](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf) — the LED controller chip inside each NeoPixel.
4. [Adafruit NeoPixel Überguide](https://learn.adafruit.com/adafruit-neopixel-uberguide) — wiring, power, and best practices for NeoPixels.
5. [RGB color model (Wikipedia)](https://en.wikipedia.org/wiki/RGB_color_model) — how red, green, and blue light mix to make other colors.
6. [NeoPixel Color Mixer (learning-micropython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/neopixel-color-mixer) — the earlier MicroSim this one was adapted from.
