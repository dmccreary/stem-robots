---
title: Display Systems and Visual Output
description: Give your robot a visual voice — program NeoPixel RGB LEDs for animations and status indicators, then draw text, shapes, bar charts, animated faces, and live sensor meters on the 128×64 OLED display using the SSD1306 driver.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 14:55:00
version: 0.08
---

# Display Systems and Visual Output

!!! mascot-welcome "Welcome, maker — let's give your robot a face!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    My OLED display is what makes me look alive — those two glowing oval eyes you see are drawn by code. This chapter teaches you how to light me up with color LEDs, draw anything you want on my screen, and show live sensor data as animated charts. Visual output is your robot's way of talking back to you.

## Summary

This chapter gives the robot a visual voice. Students program NeoPixel RGB LED strips
for color sequences and animations, then dive into the 128×64 OLED display: driver
chip, framebuffer model, and drawing primitives (text, lines, circles, rectangles).
Practical projects include bar charts of live sensor data, a scrolling distance meter,
an animated robot face, and a servo position display — all combining the display API
with the sensors and motors from prior chapters.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. NeoPixel LEDs
2. WS2816 LED Strip
3. RGB Color Values
4. NeoPixel Library
5. LED Animation
6. LED Status Indicators
7. OLED Display Overview
8. SSD1306 Driver Chip
9. I2C Display Mode
10. SPI Display Mode
11. Display Resolution
12. Framebuffer
13. Blit Operation
14. Display Text Output
15. Drawing Lines
16. Drawing Circles
17. Drawing Rectangles
18. Bar Chart on Display
19. Live Sensor on Display
20. Animated Faces on OLED
21. Distance Meter Display
22. Servo Meter Display

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)
- [Chapter 5: Data Structures, Modular Programming, and Version Control](../05-data-structures-modular-code/index.md)
- [Chapter 6: Electronics, DC Motors, and Communication Protocols](../06-electronics-motors-protocols/index.md)
- [Chapter 7: PWM, Motor Speed Control, and Actuators](../07-pwm-motor-speed-actuators/index.md)
- [Chapter 8: Sensors and Data Input](../08-sensors-data-input/index.md)

---

## NeoPixel LEDs

A **NeoPixel LED** is a special type of RGB LED that contains a tiny controller chip inside the LED package itself. Unlike a standard LED that you control with voltage, a NeoPixel receives color and brightness commands through a single data wire. This means you can chain many NeoPixels together and control them all from a single GPIO pin.

The Cytron Maker Pi RP2040 has two built-in NeoPixel LEDs connected to GPIO pin 18. You can also attach external NeoPixel strips.

### WS2812B — The Chip Inside

The chip inside each NeoPixel is the **WS2812B** (sometimes listed as WS2816 for certain variants). It receives a serial data stream at a specific timing protocol. You don't need to implement this protocol yourself — the MicroPython `neopixel` library handles it. But knowing the chip name helps when reading datasheets and looking up compatible LED strips.

### RGB Color Values

Each NeoPixel LED has three color channels: **R** (red), **G** (green), and **B** (blue). Each channel takes a value from 0 (off) to 255 (full brightness). Mixing these three channels produces any color.

Before the table, here is the idea: `(255, 0, 0)` means full red, zero green, zero blue — a pure red. `(0, 0, 255)` is pure blue. `(255, 255, 255)` is white (all channels full). `(0, 0, 0)` is off.

| Color | R | G | B |
|-------|---|---|---|
| Red | 255 | 0 | 0 |
| Green | 0 | 255 | 0 |
| Blue | 0 | 0 | 255 |
| Yellow | 255 | 200 | 0 |
| White | 255 | 255 | 255 |
| Off | 0 | 0 | 0 |
| Orange | 255 | 80 | 0 |

Tables of numbers are hard to picture. The MicroSim below lets you mix a color yourself. Move the three sliders and watch the LED glow change. The code line under the LED shows what to type in your own program.

#### Diagram: NeoPixel RGB Color Mixer

<iframe src="../../sims/neopixel-rgb-color-mixer/main.html" width="100%" height="507px" scrolling="no"></iframe>
[Run NeoPixel RGB Color Mixer Fullscreen](../../sims/neopixel-rgb-color-mixer/main.html){ .md-button }

<details markdown="1">
<summary>Interactive MicroSim for mixing red, green, and blue values on the robot's two NeoPixels</summary>
Type: microsim
**sim-id:** neopixel-rgb-color-mixer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-micropython / neopixel-color-mixer (https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/neopixel-color-mixer). Keep the three sliders and the glowing LED. Reduce the strip to the robot's two LEDs, add the color-name table match, and add the status-color presets.

Learning objective: Apply (Bloom L3) — the student can choose R, G, and B values from 0 to 255 to produce a target color, and can write the matching `np[0] = (r, g, b)` line.

Canvas layout: Width fills the page (up to 700 px). Height 450 px. The left 55% shows two large round LEDs on a dark circuit-board rectangle. The right 45% holds the sliders and the code box.

Visual elements:
- Two large circles labeled "np[0]" and "np[1]". Each glows with its current color. A soft blurred halo around each circle grows with brightness.
- Three horizontal sliders colored red, green, and blue, each with a number box at the right.
- A color swatch strip that shows the mix as a solid color, so students can see it without the glow.
- Code box: `np[0] = (255, 80, 0)` and `np.write()`. The values update live.
- A small text line, "Closest name: Orange", found by matching the chapter's color table.

Interactive controls:
- R, G, and B sliders, 0 to 255, step 1, default R 255, G 80, B 0.
- Radio buttons "Edit: LED 0 / LED 1 / Both", default Both.
- Preset buttons: "Red", "Green", "Blue", "Yellow", "White", "Orange", "Off". Each sets the sliders to the row in the chapter's table.
- Traffic-light buttons "Clear", "Caution", "Stop", "Standby". They set the sliders to the status colors: green (0, 255, 0), yellow (255, 200, 0), red (255, 0, 0), and blue (0, 0, 255).
- Slider "Brightness", 0% to 100%, step 5, default 100%. It scales all three channels for the display and the code box, for example, R 255 at 20% becomes 51.

Behavior:
- The displayed color = (R, G, B) x brightness. The code box shows the scaled integers, rounded down.
- "Closest name" uses the smallest distance in RGB space to the seven table colors. If the distance is over 60, show "Custom color".
- If all channels are 0, the LED circle shows a dark gray outline and the text "Off".
- Show a tip when R, G, and B are all 255: "White uses all three channels. It draws the most current!"

Default state: Both LEDs orange (255, 80, 0), brightness 100%.

Assessment/Challenge: Make a yellow that looks like the chapter's table. What values do you use? (Answer: (255, 200, 0).) Then lower brightness to 20%. What R, G, B values does the code box show? (Answer: (51, 40, 0).)

Responsive: redraw on window resize.
</details>

Your Cytron board has two NeoPixels on GPIO 18. Anything you mix here works on the robot when you copy the line into your code and call `np.write()`. The status-color presets match the `set_status_color()` function you will see below.

### NeoPixel Library

The `neopixel` module is built into MicroPython. Before the code, here is what the parameters mean: `Pin(18)` selects GPIO 18, and `2` is the number of LEDs in the strip.

```python
import neopixel
from machine import Pin
import config

np = neopixel.NeoPixel(Pin(config.NEOPIXEL_PIN), config.NUMBER_NEOPIXELS)

# Set LED 0 to red, LED 1 to blue
np[0] = (255, 0, 0)
np[1] = (0, 0, 255)
np.write()   # send the data to the LEDs
```

Always call `np.write()` after setting colors. The colors don't update until you write them.

### LED Animation

**LED animation** means changing the LEDs over time — fading, cycling colors, chasing patterns. A simple color cycle loops through hues:

```python
from time import sleep
import neopixel
from machine import Pin
import config

np = neopixel.NeoPixel(Pin(config.NEOPIXEL_PIN), config.NUMBER_NEOPIXELS)

colors = [(255,0,0), (0,255,0), (0,0,255), (255,200,0), (0,200,255)]

try:
    while True:
        for color in colors:
            np[0] = color
            np[1] = color
            np.write()
            sleep(0.3)
except KeyboardInterrupt:
    pass
finally:
    np[0] = (0,0,0); np[1] = (0,0,0)
    np.write()
```

### LED Status Indicators

**LED status indicators** use specific colors to communicate robot state — a traffic light pattern that anyone can read at a glance.

A common convention:

- **Green** = running normally, path clear
- **Yellow/orange** = caution, obstacle getting close
- **Red** = stop, obstacle very close
- **Blue** = standby / idle
- **White flash** = sensor reading in progress

```python
def set_status_color(distance_cm):
    if distance_cm > 50:
        np[0] = (0, 255, 0)    # green — clear
    elif distance_cm > 20:
        np[0] = (255, 200, 0)  # yellow — caution
    else:
        np[0] = (255, 0, 0)    # red — stop
    np.write()
```

---

## The OLED Display

Your robot's "face" is a small screen called an **OLED display**. **OLED** stands for Organic Light-Emitting Diode. Unlike LCD screens, each pixel in an OLED display emits its own light — there is no backlight. This gives OLED displays high contrast and sharp images, even at small sizes.

The display on this robot is 128 pixels wide and 64 pixels tall — a **128×64** resolution. It looks small (about 0.96 inches diagonal), but it is plenty of space for text, graphs, and animated faces.

### SSD1306 Driver Chip

The **SSD1306** is the controller chip built into most small OLED modules. It handles the low-level task of refreshing each pixel. You communicate with the SSD1306 over I2C (or SPI) using the `ssd1306.py` driver library. Copy `ssd1306.py` to your board's flash storage before using the display.

### I2C Display Mode and SPI Display Mode

The SSD1306 supports both I2C and SPI connections. The module sold with this course uses I2C — four wires: VCC, GND, SDA, SCL. This is the simplest wiring.

**SPI display mode** uses six wires (VCC, GND, SCK, MOSI, DC, CS) but updates the screen faster — important for high frame-rate animations. For this course, I2C is sufficient.

### Display Resolution and the Framebuffer

The **display resolution** is 128×64 — meaning 128 columns and 64 rows of pixels. Each pixel is either ON (white) or OFF (black). There is no color.

The **framebuffer** is an array in the microcontroller's memory that mirrors the display. When you draw text or shapes, you write to the framebuffer first. Nothing appears on the screen until you call `show()`, which copies the entire framebuffer to the display at once. This prevents flickering — instead of updating pixels one at a time, the whole frame updates in one fast transfer.

Before the code, here is what the parameters mean: `I2C(0, ...)` creates the I2C bus. `SSD1306_I2C(128, 64, i2c)` creates the display object with 128-column, 64-row resolution on that I2C bus.

```python
from machine import I2C, Pin
import ssd1306
import config

i2c = I2C(0, scl=Pin(config.I2C_SCL_PIN),
             sda=Pin(config.I2C_SDA_PIN),
             freq=400000)

display = ssd1306.SSD1306_I2C(128, 64, i2c)
```

### Blit Operation

A **blit** (block transfer) copies a rectangular region of pixels from one framebuffer to another. You use it to draw sprites — pre-drawn images — onto the display at specific positions. For simple robot programs, direct drawing functions are more common than blitting, but it's useful for displaying icons or custom fonts.

The framebuffer is easier to understand when you can see it. The MicroSim below shows two things side by side: the framebuffer in memory and the screen you can see. Drawing changes only the framebuffer. The screen changes only when you press "show()".

#### Diagram: OLED Framebuffer and show()

<iframe src="../../sims/oled-framebuffer-show-demo/main.html" width="100%" height="502px" scrolling="no"></iframe>
[Run OLED Framebuffer and show() Fullscreen](../../sims/oled-framebuffer-show-demo/main.html){ .md-button }

<details markdown="1">
<summary>Interactive MicroSim showing that drawing calls change the framebuffer and only show() updates the screen</summary>
Type: microsim
**sim-id:** oled-framebuffer-show-demo<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design. It can share the 128 x 64 scaled pixel grid drawing from oled-coordinate-explorer.

Learning objective: Explain (Bloom L2) — the student can explain why the code calls `display.fill(0)`, then draws, then calls `display.show()`, and can predict what the screen looks like if a step is left out.

Canvas layout: Width fills the page (up to 700 px). Height 500 px. Two panels sit side by side, each showing a 128 x 64 grid at 2.5x scale (320 x 160 px). On narrow screens they stack. The left panel is "Framebuffer (in memory)". The right panel is "OLED screen (what you see)". Below them are a code list and the controls.

Visual elements:
- Both panels have a black background with white pixels for ON.
- A blue arrow labeled "show() copies" points from the framebuffer panel to the screen panel. It flashes when `show()` runs.
- A numbered code list, five steps: `display.fill(0)`, `display.text("Hello!", 0, 0)`, `display.ellipse(64, 32, 20, 20, 1)`, `display.rect(10, 10, 50, 30, 1)`, `display.show()`. The step that just ran is highlighted.
- A status line: "Screen is out of date" (orange) when the panels differ, and "Screen matches framebuffer" (green) when they match.
- A frame counter for the "Loop mode" described below.

Interactive controls:
- Buttons for each of the five code steps. Each runs only that call.
- Button "Run all in order".
- Checkbox "Skip fill(0) in loop mode".
- Button "Loop mode: move the ellipse" runs a loop that shifts the ellipse 8 pixels right every 500 ms and wraps at x = 127. Each pass runs the drawing calls, then `show()`.
- Button "Reset" clears both panels.

Behavior:
- Drawing calls change only the framebuffer panel.
- "show()" copies the whole framebuffer to the screen panel in one step.
- "fill(0)" sets every framebuffer pixel to OFF. The screen stays as it was until the next `show()`.
- In loop mode with fill(0) on, each pass clears, draws the ellipse at the new x, and shows. The screen shows one ellipse.
- In loop mode with "Skip fill(0)" checked, old ellipses stay in the framebuffer, so the screen fills with a trail of ellipses. A note says "Old drawings never got erased - add display.fill(0)".
- If the student draws and never calls `show()`, the screen stays blank and the status line stays orange.

Default state: Both panels black. The status line reads "Screen matches framebuffer".

Assessment/Challenge: Press "display.text" and then look at the screen. What do you see? (Answer: Nothing new. The text is only in the framebuffer until `show()` runs.) Then run loop mode with "Skip fill(0)" checked. What appears, and how do you fix it? (Answer: A smeared trail of ellipses. Call `display.fill(0)` at the start of every pass.)

Responsive: redraw on window resize.
</details>

This is the same pattern as in your robot's loop: clear, draw, `show()`. Because the screen updates in one transfer, you avoid flicker. If your OLED ever shows a smeared mess, check whether you forgot `fill(0)` or whether a drawing call comes after `show()`.

---

## Drawing on the OLED

The `ssd1306` library provides drawing functions. Let's learn each one before putting them together in projects.

The pattern for every drawing operation: call the drawing function to update the framebuffer, then call `display.show()` to push the framebuffer to the screen.

### Display Text Output

Before the code, here is what the parameters mean: `text(string, x, y)` draws a string starting at column `x`, row `y`. The origin `(0, 0)` is the top-left corner. Each character is 8 pixels wide and 8 pixels tall (the built-in font).

```python
display.fill(0)              # clear the screen (0 = black)
display.text("Hello!", 0, 0)  # top-left corner
display.text("Distance: 25cm", 0, 16)
display.show()
```

### Drawing Lines, Circles, and Rectangles

The display library also draws shapes. Before the code, here is the parameter order for each: `line(x1, y1, x2, y2, color)`, `ellipse(x, y, xr, yr, color)`, `rect(x, y, w, h, color)`.

- `color=1` draws white (ON pixels)
- `color=0` draws black (erases pixels)

```python
display.fill(0)             # clear

# Draw a horizontal line across the top
display.line(0, 0, 127, 0, 1)

# Draw a circle (ellipse) centered at (64, 32), radius 20
display.ellipse(64, 32, 20, 20, 1)

# Draw an unfilled rectangle at (10, 10), 50 wide, 30 tall
display.rect(10, 10, 50, 30, 1)

# Draw a filled rectangle
display.fill_rect(70, 10, 50, 30, 1)

display.show()
```

!!! mascot-tip "fill(0) before drawing"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Always call `display.fill(0)` before redrawing the screen in a loop. Without it, new content overlaps old content and the display turns into a muddy mess. Clear the framebuffer first, draw everything fresh, then call `show()` — that's the standard pattern for smooth-looking displays.

---

## Practical Display Projects

Now let's build four practical projects that combine the drawing API with sensors and motors.

### Bar Chart of Live Sensor Data

A **bar chart on display** shows the ToF sensor distance as a vertical bar that grows and shrinks in real time. This is a live data visualization — a simple version of the charts in scientific instruments.

Before the code, here is the math: if the max expected distance is 200 cm, we scale the current distance to fit in 50 pixels of bar height (0–50). `bar_height = int(distance_cm / 200 * 50)`.

```python
def draw_distance_bar(distance_cm, max_cm=200):
    display.fill(0)
    bar_height = int(distance_cm / max_cm * 50)
    bar_height = min(bar_height, 50)   # clamp to 50 max

    # Draw bar from bottom of area (y=63) upward
    display.fill_rect(20, 63 - bar_height, 20, bar_height, 1)

    # Label
    display.text(f"{distance_cm:.0f}cm", 45, 28)
    display.text("Distance", 0, 0)
    display.show()
```

### Distance Meter Display

A **distance meter display** shows the current distance as text in large format, updating every loop iteration:

```python
def draw_meter(distance_cm):
    display.fill(0)
    display.text("DISTANCE", 20, 0)
    display.text(f"{distance_cm:.1f}", 30, 28)
    display.text("cm", 90, 28)
    display.line(0, 20, 127, 20, 1)   # horizontal separator line
    display.show()
```

The bar chart, the meter, and the status colors all start from one distance number. The MicroSim below shows all three at once. Slide the distance and see how one reading turns into a bar height, a text label, and an LED color.

#### Diagram: Distance to Display Mapper

<iframe src="../../sims/distance-display-mapper/main.html" width="100%" height="422px" scrolling="no"></iframe>
[Run Distance to Display Mapper Fullscreen](../../sims/distance-display-mapper/main.html){ .md-button }

<details markdown="1">
<summary>Interactive MicroSim turning one distance reading into an OLED bar, meter text, and NeoPixel status color</summary>
Type: microsim
**sim-id:** distance-display-mapper<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design. It applies the formula from the range-mapping-explorer MicroSim in Chapter 7 (see that sim for the general idea).

Learning objective: Apply (Bloom L3) — the student can predict the OLED bar height and NeoPixel status color for any distance, and can explain why `min(bar_height, 50)` and the 50 cm / 20 cm thresholds are in the code.

Canvas layout: Width fills the page (up to 700 px). Height 470 px. Three panels sit side by side: "OLED bar chart" (left), "OLED meter" (middle), and "NeoPixel status" (right). On narrow screens they stack. A control strip is at the bottom. Each OLED panel is a 128 x 64 pixel grid at 2x scale (256 x 128 px), with black background and white pixels.

Visual elements:
- Bar chart panel: draws the bar exactly like `draw_distance_bar()`. That is a filled rectangle at x = 20, width 20, from y = 63 - bar_height up to y = 63, plus the text "Distance" at (0, 0) and the text "<distance>cm" at (45, 28). A dashed line marks the 50-pixel maximum.
- Meter panel: draws like `draw_meter()`. That is "DISTANCE" at (20, 0), the value with one decimal at (30, 28), "cm" at (90, 28), and a horizontal line at y = 20.
- NeoPixel panel: one big circle for `np[0]` colored by `set_status_color()`. The two color zones appear on a small vertical scale: green above 50 cm, yellow from 20 to 50 cm, red below 20 cm.
- Below the panels, a formula line: "bar_height = int(distance / 200 x 50) = 12".

Interactive controls:
- Distance slider, 0 to 300 cm, step 1, default 100. Values above 200 are "beyond the chart".
- Slider "max_cm" for the bar chart, 100 to 300, step 10, default 200. It matches the `max_cm` parameter.
- Checkbox "Use min(bar_height, 50) clamp", on by default.
- Button "Sweep": moves the distance slowly from 300 down to 0 and back, like a wall getting closer.

Behavior:
- bar_height = int(distance_cm / max_cm x 50). If the clamp is on, bar_height = min(bar_height, 50).
- Without the clamp and with distance above max_cm, the bar grows above the panel top (y goes negative). Draw it in red past the panel edge with the note "Bar leaves the screen!".
- Status color: distance > 50 gives green (0, 255, 0), distance > 20 gives yellow (255, 200, 0), otherwise red (255, 0, 0).
- The bar chart text shows distance with no decimals. The meter shows one decimal.
- Pixel-accurate drawing: each text character is 8 x 8 pixels and each pixel is one grid cell.

Default state: Distance 100 cm, max_cm 200, clamp on. The bar is 25 pixels tall and the LED is green.

Assessment/Challenge: At what distance does the LED turn from green to yellow, and how tall is the bar there? (Answer: At 50 cm or less it turns yellow. At 50 cm the bar is 12 pixels tall, because 50 / 200 x 50 = 12.5 and `int()` drops the decimal.) Then set max_cm to 100 and the distance to 250 with the clamp off. What goes wrong? (Answer: The bar height is 125, far beyond the 50-pixel area, so it leaves the screen.)

Responsive: redraw on window resize.
</details>

On the robot, one `tof.read()` value feeds the OLED and the NeoPixels through the same distance number. Use the sim to check your thresholds before you upload code. Then test them on the real robot with your hand as the obstacle.

### Animated Faces on OLED

**Animated faces on OLED** use ellipses and rectangles to draw eyes and a mouth, then change their shape to show different robot states — happy, thinking, surprised. This is the same kind of code that makes Sparky's face change expression on the screen!

```python
def draw_face(state="happy"):
    display.fill(0)
    if state == "happy":
        # Eyes — two medium circles
        display.ellipse(40, 28, 12, 12, 1)
        display.ellipse(88, 28, 12, 12, 1)
        # Smile — arc approximated with a rect
        display.fill_rect(50, 45, 28, 4, 1)
    elif state == "alert":
        # Wide eyes
        display.ellipse(40, 28, 16, 16, 1)
        display.ellipse(88, 28, 16, 16, 1)
        # Straight mouth
        display.fill_rect(50, 48, 28, 3, 1)
    display.show()
```

#### Diagram: OLED Coordinate System Explorer


<iframe src="../../sims/oled-coordinate-explorer/main.html" width="100%" height="402px" scrolling="no"></iframe>
[Run OLED Coordinate System Explorer Fullscreen](../../sims/oled-coordinate-explorer/main.html)

<details markdown="1">
<summary>Interactive MicroSim showing the OLED pixel coordinate system and drawing primitives</summary>
Type: MicroSim
**sim-id:** oled-coordinate-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Show a scaled-up representation of the 128×64 OLED display (rendered 4× actual size = 512×256 pixels on canvas).

Features:
- A black background rectangle representing the OLED screen.
- A grid overlay (toggle button "Show grid") showing pixel positions every 8 pixels.
- Mouse hover shows a tooltip: "Pixel: (x, y)" at the cursor position (in OLED coordinates, 0–127 x, 0–63 y).
- Four buttons: "Draw Text", "Draw Line", "Draw Circle", "Draw Rect".
  - Each button draws the corresponding element at a random position and displays the corresponding ssd1306 Python code in a code box below the display.
- A "Clear" button resets the display.

Learning objective (Bloom's Taxonomy — Applying): students practice placing drawing commands at specific coordinates and reading back the code equivalent.

Responsive: redraw on window resize.
</details>

### Servo Meter Display

A **servo meter display** shows the current servo angle as a gauge — a horizontal bar from left (0°) to right (180°) with a moving indicator. This makes it easy to see the physical servo position on the screen without watching the servo:

```python
def draw_servo_meter(angle):
    """Draw a gauge for servo angle (0-180 degrees)."""
    display.fill(0)
    display.text("Servo Angle", 20, 0)
    display.text(f"{angle:.0f} deg", 45, 48)

    # Draw gauge bar background
    display.rect(4, 20, 120, 16, 1)

    # Draw filled indicator
    fill_width = int(angle / 180 * 118)
    display.fill_rect(5, 21, fill_width, 14, 1)

    display.show()
```

---

## Putting It All Together — Live Sensor Dashboard

Here is a complete program that reads the ToF sensor and displays a live bar chart while the NeoPixels show status color. This combines displays, sensors, and LEDs in one program.

```python
from machine import I2C, Pin
from time import sleep
import neopixel, ssd1306
import vl53l0x
import config

# Set up display
i2c = I2C(0, scl=Pin(config.I2C_SCL_PIN),
             sda=Pin(config.I2C_SDA_PIN), freq=400000)
display = ssd1306.SSD1306_I2C(128, 64, i2c)
tof = vl53l0x.VL53L0X(i2c)

# Set up NeoPixels
np = neopixel.NeoPixel(Pin(config.NEOPIXEL_PIN), config.NUMBER_NEOPIXELS)

def set_status(dist_cm):
    if dist_cm > 50:
        np[0] = (0, 200, 0)
    elif dist_cm > 20:
        np[0] = (200, 150, 0)
    else:
        np[0] = (200, 0, 0)
    np.write()

try:
    while True:
        dist_cm = tof.read() / 10
        set_status(dist_cm)

        display.fill(0)
        bar = int(min(dist_cm, 150) / 150 * 50)
        display.fill_rect(10, 63 - bar, 30, bar, 1)
        display.text(f"{dist_cm:.0f}cm", 50, 28)
        display.show()
        sleep(0.05)

except KeyboardInterrupt:
    pass

finally:
    np[0] = (0,0,0); np.write()
    display.fill(0); display.show()
    print("Display and LEDs off.")
```

!!! mascot-thinking "Frame rate matters"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The `sleep(0.05)` gives 20 frames per second — smooth enough for a live chart. You could go faster, but the ToF sensor only updates reliably at about 50 Hz. Going faster than the sensor just wastes CPU time reading the same stale value. Always match your display refresh rate to your sensor's actual update rate.

---

## Key Takeaways

- **NeoPixel LEDs** use a single data wire to control color (RGB, 0–255 per channel) — call `np.write()` to update
- **LED status indicators** use color to communicate robot state (green=clear, yellow=caution, red=stop)
- The **OLED display** is 128×64 pixels, controlled by the **SSD1306** chip over I2C
- The **framebuffer** stores the image in RAM — draw to the framebuffer, then call `show()` to update the screen
- `display.text()` draws 8×8 characters; `display.line()`, `.ellipse()`, `.rect()`, `.fill_rect()` draw shapes
- Always call `display.fill(0)` before redrawing to clear the previous frame
- **Live sensor dashboards** combine sensors, displays, and LEDs for real-time data visualization

!!! mascot-celebration "Your robot has a face, a voice, and now a dashboard!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, engineer! NeoPixels, OLED drawing, live data visualization — you now have every output tool in the course. In Chapter 10, we wire sensors and motors together and the robot starts navigating on its own. That's the milestone the whole course has been building toward!

