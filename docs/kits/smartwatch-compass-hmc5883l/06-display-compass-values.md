# Lab 6: Show the Numbers

Time to combine the two skills you've built so far — reading the
compass and drawing on the screen — into one program. This lab reads
X, Y, and Z once, and shows all three as numbers on the round display.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Two sensors, one screen — now we bring them together for the first
    time. This is where your kit really starts to feel like one machine!

## What You Need

- Your kit fully wired: both the compass (Lab 3) and the display (Lab 5)

## What You'll Learn

- How to combine an I2C sensor and an SPI display in the same program
- How to loop over a list of values instead of repeating code three
  times

## Step 1: Read, Then Draw

The first half of `06-display-compass-values.py` should look familiar —
it's the exact same sensor-reading code from Lab 4. The new part comes
after:

```python
display = config.init_display()
display.fill(config.BLACK)

ROW_Y = (64, 104, 144)
lines = ("X: {}".format(x), "Y: {}".format(y), "Z: {}".format(z))
for text, row_y in zip(lines, ROW_Y):
    text_x = config.CENTER_X - (len(text) * 16) // 2
    display.text(config.BIG_FONT, text, text_x, row_y, config.WHITE, config.BLACK)
```

Instead of writing three separate `display.text(...)` calls, this uses
a `for` loop with `zip()` to walk through the three lines of text and
their three row positions together, two at a time.

!!! mascot-thinking "What does zip() actually do?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `zip()` pairs up two lists item by item — the first line with the
    first row, the second line with the second row, and so on. It's like
    zipping a jacket: two separate tracks, one tooth at a time, becoming
    one combined thing.

`text_x = config.CENTER_X - (len(text) * 16) // 2` calculates where to
start each line so it lands centered on the screen, no matter how many
digits the number has — a longer number like `-1234` needs to start
further left than a short one like `39` to stay centered.

**Try it now:** run `06-display-compass-values.py`. You should see all
three axis readings appear on the screen at once, centered.

## Try It Yourself

- Point the board a different direction, run the program again. Which
  number changed the most?
- What happens to the centering if you change `16` in the formula above
  to `8`? (Hint: check what `16` actually represents in Lab 5.)

## What's Happening Under the Hood

This is the same idea every dashboard, phone app, and video game
display uses: read some data, then draw it. The two halves of this
program — sensing and displaying — don't need to know anything about
each other. The sensor doesn't care that a screen exists, and the
screen doesn't care where the numbers came from. That separation is
what makes it easy to reuse the same drawing code with completely
different data later.

## Check Your Understanding

1. What does `zip()` let you do with two lists?
2. Why does the text-centering formula use the length of the text?
3. Why can the sensor-reading code and the drawing code be written
   separately?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/06-display-compass-values.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/06-display-compass-values.py).

!!! mascot-celebration "Sensor and screen, working together!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just built your first complete sense-and-display program. Next,
    let's make it update live, instead of just once!
