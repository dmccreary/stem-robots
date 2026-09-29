---
title: Distance to Display Mapper
description: Turn one distance reading into an OLED bar chart, an OLED meter, and a NeoPixel status color, and see how int(), min(bar_height, 50), and the 50 cm and 20 cm thresholds shape each output.
image: /sims/distance-display-mapper/distance-display-mapper.png
og:image: /sims/distance-display-mapper/distance-display-mapper.png
twitter:image: /sims/distance-display-mapper/distance-display-mapper.png
social:
   cards: false
quality_score: 100
---

# Distance to Display Mapper

<iframe src="main.html" height="422px" width="100%" scrolling="no"></iframe>

[Run the Distance to Display Mapper MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Your robot reads one number from its distance sensor, then shows it three ways.
The OLED can draw a **bar chart** or a **meter**, and the NeoPixel can glow a
**status color**. This MicroSim runs the three functions from
[Chapter 9](../../chapters/09-display-systems-output/index.md#bar-chart-of-live-sensor-data)
on the same distance:

- **`draw_distance_bar()`** scales the distance into a bar up to 50 pixels
  tall: `bar_height = int(distance_cm / max_cm * 50)`. Then
  `min(bar_height, 50)` stops the bar from growing past its area.
- **`draw_meter()`** prints the distance with one decimal place.
- **`set_status_color()`** picks green above 50 cm, yellow above 20 cm, and red
  for 20 cm or less.

Both OLED panels are drawn pixel by pixel on a 128 × 64 grid, just like the real
screen. Each letter is 8 × 8 pixels. The box under the panels fills in the math
with your numbers, so you can check each step.

The bar chart uses the same range-mapping idea as the
[Range Mapping Explorer](../range-mapping-explorer/index.md) from Chapter 7.

## How to Use

1. Move the **Distance** slider. Before you look, predict the bar height and
   the LED color. Then check the formula box.
2. Find the distance where the LED changes from green to yellow, and from
   yellow to red.
3. Change **max_cm**. This is how far away the bar reads as "full". Watch the
   bar height change for the same distance.
4. Turn off **Use min(bar_height, 50) clamp**. Set max_cm to 100 and the
   distance to 250 cm. What happens to the bar?
5. Click **Sweep** to move the distance from 300 cm down to 0 and back, like a
   wall coming closer.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/distance-display-mapper/main.html"
        height="422px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Learning Objective

Students will *predict* the OLED bar height and NeoPixel status color for any
distance, and will *explain* why `min(bar_height, 50)` and the 50 cm and 20 cm
thresholds appear in the display code.

### Prerequisites

- Linear range mapping and `int()` from the
  [Range Mapping Explorer](../range-mapping-explorer/index.md) and
  [Chapter 7](../../chapters/07-pwm-motor-speed-actuators/index.md#linear-range-mapping)
- `if`/`elif`/`else` from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- OLED drawing calls and NeoPixel colors from earlier in
  [Chapter 9](../../chapters/09-display-systems-output/index.md)
- ToF distance readings from
  [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md)

### Activities

1. **Predict first (4 min).** Give students three distances (100 cm, 50 cm,
   15 cm). They predict the bar height and LED color on paper, then check each
   one in the sim.
2. **Find the edges (3 min).** Students find the exact distances where the LED
   color changes, and explain why 50 cm is yellow and not green (the test is
   `> 50`, not `>= 50`).
3. **Change the scale (3 min).** Students set max_cm to 100 and to 300, and
   explain when a shorter or longer full-scale distance is more useful on a
   robot.
4. **Break the clamp (3 min).** With the clamp off, students find a distance
   where the bar covers the "Distance" label and one where it leaves the screen.
   They explain what `min()` protects.
5. **Design your own (4 min).** Students pick new thresholds for a faster
   robot (for example 80 cm and 40 cm) and justify them in terms of stopping
   distance.

### Assessment

- **Challenge:** "At what distance does the LED turn from green to yellow, and
  how tall is the bar there?" (At 50 cm or less it turns yellow. At 50 cm the bar
  is 12 pixels tall, because 50 / 200 × 50 = 12.5 and `int()` drops the decimal.)
  "Set max_cm to 100 and the distance to 250 with the clamp off. What goes wrong?"
  (The bar height is 125, far beyond the 50-pixel area, so it leaves the screen.)
- **Code reading:** "Change one line so the LED is red at 25 cm." (Change
  `elif distance_cm > 20` to `elif distance_cm > 25`.)
- **Rubric (4-point):** *Exemplary* — predicts bar heights including `int()`
  truncation, explains the clamp and the strict `>` thresholds, and proposes
  justified new thresholds. *Proficient* — predicts bar heights and colors
  correctly. *Developing* — predicts colors but not bar heights. *Beginning* —
  cannot connect the distance to the bar height.

### Simplifications to Mention

- The OLED letters use a public-domain 8 × 8 font like the MicroPython
  `framebuf` font, so a pixel or two may differ on your screen.
- The real bar chart code draws a filled rectangle that the driver clips at the
  top edge. The red stub above the panel shows the part that would be lost.

## References

1. [Chapter 9: Display Systems and Visual Output — Practical Display Projects](../../chapters/09-display-systems-output/index.md#practical-display-projects) — `draw_distance_bar()` and `draw_meter()`.
2. [Chapter 9: LED Status Indicators](../../chapters/09-display-systems-output/index.md#led-status-indicators) — the `set_status_color()` thresholds.
3. [MicroPython `framebuf` module](https://docs.micropython.org/en/latest/library/framebuf.html) — `fill_rect()`, `text()`, and `line()` used on the OLED.
4. [MicroPython `neopixel` module](https://docs.micropython.org/en/latest/library/neopixel.html) — setting the status LED color.
5. [Clamping (graphics) (Wikipedia)](https://en.wikipedia.org/wiki/Clamping_(graphics)) — why values are limited to a range before drawing.
6. [Linear interpolation (Wikipedia)](https://en.wikipedia.org/wiki/Linear_interpolation) — the math behind scaling a distance to a bar height.
