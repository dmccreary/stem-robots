# Quiz: Display Systems and Visual Output

Test your understanding of NeoPixel LEDs, OLED displays, the framebuffer model, and drawing operations with these questions.

---

#### 1. What makes NeoPixel LEDs different from standard RGB LEDs?

<div class="upper-alpha" markdown>
1. NeoPixels only display white light; standard RGB LEDs can show any color
2. NeoPixels have a built-in controller chip that receives color commands through a single data wire
3. NeoPixels require three separate GPIO pins per LED; standard LEDs only need one
4. NeoPixels operate at 5 V while standard LEDs work at 3.3 V
</div>

??? question "Show Answer"
    The correct answer is **B**. Each NeoPixel LED contains a WS2812B controller chip inside the LED package. This chip receives serial color data through a single data wire, which allows many NeoPixels to be chained together and controlled from one GPIO pin. Standard RGB LEDs require three separate PWM pins per LED (one for each color channel) and cannot be chained this way.

    **Concept Tested:** NeoPixel LEDs

---

#### 2. What RGB value produces pure green on a NeoPixel LED?

<div class="upper-alpha" markdown>
1. `(255, 255, 0)`
2. `(0, 255, 0)`
3. `(0, 0, 255)`
4. `(255, 0, 255)`
</div>

??? question "Show Answer"
    The correct answer is **B**. NeoPixel colors are specified as `(R, G, B)` tuples where each channel ranges from 0 (off) to 255 (full brightness). `(0, 255, 0)` sets red to 0, green to 255, blue to 0 — pure green. Option A is yellow (red + green), option C is blue, and option D is magenta (red + blue). Understanding color mixing is fundamental to LED animation and status indicator design.

    **Concept Tested:** RGB Color Values

---

#### 3. Why must you call `np.write()` after setting NeoPixel colors in MicroPython?

<div class="upper-alpha" markdown>
1. `np.write()` saves the color settings to flash memory so they survive a reboot
2. The LED colors are stored in a Python list until `np.write()` sends the data to the LEDs over the data wire
3. `np.write()` resets the NeoPixel driver after each color change to prevent overheating
4. Without `np.write()`, the colors are applied to only the first LED in the chain
</div>

??? question "Show Answer"
    The correct answer is **B**. The `neopixel.NeoPixel` object holds color data in memory as a Python array. Setting `np[0] = (255, 0, 0)` only updates this array — it does not immediately light the LED. Calling `np.write()` sends the entire color array to the LED strip over the data wire using the WS2812B serial protocol. This batching approach allows you to set many LEDs at once before a single write operation.

    **Concept Tested:** NeoPixel Library

---

#### 4. What is the resolution of the OLED display used in this course?

<div class="upper-alpha" markdown>
1. 320 × 240 pixels
2. 64 × 32 pixels
3. 128 × 64 pixels
4. 256 × 128 pixels
</div>

??? question "Show Answer"
    The correct answer is **C**. The OLED display is 128 pixels wide and 64 pixels tall — a 128×64 resolution. Despite its small physical size (about 0.96 inches diagonal), this is enough for text, shapes, and live sensor charts. Coordinates start at `(0, 0)` in the top-left corner and extend to `(127, 63)` in the bottom-right. The other options are not the resolution of this display.

    **Concept Tested:** Display Resolution

---

#### 5. What is the purpose of the framebuffer in the OLED display workflow?

<div class="upper-alpha" markdown>
1. The framebuffer stores the OLED's I2C address so the microcontroller can find it on startup
2. The framebuffer is a copy of the display image held in microcontroller RAM; drawing updates it first, then `show()` sends the whole frame at once
3. The framebuffer compresses image data before sending it to the display to save bandwidth
4. The framebuffer is a delay timer that prevents the display from refreshing faster than 30 fps
</div>

??? question "Show Answer"
    The correct answer is **B**. The framebuffer is an array in the microcontroller's RAM that mirrors the 128×64 pixel grid. All drawing functions (`text()`, `line()`, `rect()`, etc.) modify this buffer in memory. Nothing changes on the physical screen until you call `display.show()`, which transfers the entire buffer to the SSD1306 driver at once. This prevents pixel-by-pixel flickering during complex screen updates.

    **Concept Tested:** Framebuffer

---

#### 6. In the `display.text()` function, what does the second parameter (`x`) and third parameter (`y`) represent?

<div class="upper-alpha" markdown>
1. The width and height of the text box in pixels
2. The column (x) and row (y) position of the top-left corner of the text, measured in pixels from the top-left of the display
3. The font size and character spacing in pixels
4. The text color and background color codes
</div>

??? question "Show Answer"
    The correct answer is **B**. `display.text(string, x, y)` places text starting at pixel column `x` and pixel row `y`, where `(0, 0)` is the top-left corner of the 128×64 display. The built-in font is 8×8 pixels per character. There is no built-in text box, font size control, or color parameter — the display is monochrome (every pixel is either ON or OFF).

    **Concept Tested:** Display Text Output

---

#### 7. Why should you always call `display.fill(0)` before redrawing the OLED in a loop?

<div class="upper-alpha" markdown>
1. `fill(0)` powers off the display briefly to prevent OLED burn-in
2. Without clearing first, new content overlaps old content and the screen becomes unreadable
3. `fill(0)` resets the I2C bus before each frame to prevent communication errors
4. The SSD1306 requires a fill command before each `show()` or the transfer will fail
</div>

??? question "Show Answer"
    The correct answer is **B**. The framebuffer persists between draws. If you draw "Distance: 23 cm" on one loop and then "Distance: 9 cm" on the next without clearing, the old pixels from "23" remain alongside the new "9", creating overlapping text. Calling `display.fill(0)` sets every pixel to 0 (black/off), giving you a clean canvas before each frame. The SSD1306 does not require a fill before `show()`.

    **Concept Tested:** Framebuffer / Animated Faces on OLED

---

#### 8. How does the bar chart `draw_distance_bar()` function scale the distance to fit the display?

<div class="upper-alpha" markdown>
1. It directly uses the distance value in centimeters as the bar height in pixels
2. It converts distance to inches and uses the result as the bar height
3. It scales the distance proportionally: `bar_height = int(distance_cm / max_cm * 50)`
4. It calls an external library function that automatically scales any value to the display resolution
</div>

??? question "Show Answer"
    The correct answer is **C**. The formula maps the measured distance (0 to `max_cm`) to a bar height of 0 to 50 pixels using proportional scaling: `bar_height = int(distance_cm / max_cm * 50)`. This linear mapping is the same "linear range mapping" concept from the servo chapter — converting one range of values to another. Using the raw centimeter value directly as pixels would fail because distances can exceed 64 pixels.

    **Concept Tested:** Bar Chart on Display / Live Sensor on Display

---

#### 9. What visual convention does the chapter recommend for NeoPixel LED status indicators?

<div class="upper-alpha" markdown>
1. Blue for obstacle detected, red for path clear, green for low battery
2. Green for path clear, yellow/orange for caution, red for stop
3. White for moving, purple for stopped, orange for turning
4. Blinking means safe, solid color means danger
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter establishes a traffic-light convention: green means running normally with a clear path, yellow/orange means caution with an obstacle getting close, and red means stop because the obstacle is very close. This color vocabulary is intuitive to anyone familiar with traffic lights and does not require reading a screen to understand the robot's state at a glance.

    **Concept Tested:** LED Status Indicators

---

#### 10. Which method draws a filled (solid) rectangle on the OLED display?

<div class="upper-alpha" markdown>
1. `display.rect(x, y, w, h, 1)`
2. `display.fill_rect(x, y, w, h, 1)`
3. `display.solid_rect(x, y, w, h, 1)`
4. `display.box(x, y, w, h, 1)`
</div>

??? question "Show Answer"
    The correct answer is **B**. `display.fill_rect(x, y, w, h, color)` draws a solid filled rectangle. `display.rect(x, y, w, h, color)` draws only the outline (unfilled border). `solid_rect()` and `box()` do not exist in the SSD1306 MicroPython library. Using `fill_rect` is essential for drawing bar charts and progress indicators that need solid filled areas.

    **Concept Tested:** Drawing Rectangles

---
