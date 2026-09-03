# Lab 8: How Fast Is a Line?

There's more than one way to draw lines on this screen — and it turns
out some ways are dramatically faster than others. This lab draws the
same amount of "line" two different ways and times each one.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Time to put on our stopwatch hats! We're about to measure something
    surprising about how this screen actually works.

## What You'll Learn

- The difference between `hline()`/`vline()` and `line()`
- How to **benchmark** code — measure exactly how long it takes
- Why "fewer, bigger instructions" usually beats "many small ones"

## Step 1: Two Kinds of Lines

```python
def draw_grid():
    for x in range(0, config.WIDTH, GRID_SPACING):
        display.vline(x, 0, config.HEIGHT, WHITE)
    for y in range(0, config.HEIGHT, GRID_SPACING):
        display.hline(0, y, config.WIDTH, WHITE)

def draw_spokes():
    for i in range(SPOKE_COUNT):
        angle = radians(360 * i / SPOKE_COUNT)
        x = cx + int(r * sin(angle))
        y = cy - int(r * cos(angle))
        display.line(cx, cy, x, y, WHITE)
```

`draw_grid()` uses `hline()` and `vline()` — lines that only go straight
up-down or side-to-side. `draw_spokes()` uses `line()` — a general
diagonal line from the center out to a point on a circle, calculated
using `sin()` and `cos()` (the same trigonometry idea from the compass
math, just used in reverse: turning an angle *into* a point instead of a
point into an angle).

## Step 2: Timing the Difference

```python
from utime import ticks_us, ticks_diff

def time_drawing(draw, repeats):
    draw()                              # warm-up, not counted
    started = ticks_us()
    for _ in range(repeats):
        draw()
    return ticks_diff(ticks_us(), started) // repeats
```

`ticks_us()` reads the Pico's internal clock in **microseconds** — a
millionth of a second. Running `draw()` once first as a "warm-up" and
throwing that result away, then timing several more runs and averaging
them, is how you get a trustworthy measurement instead of one lucky (or
unlucky) reading.

**Try it now:** run `08-drawing-lines.py`. It cycles between drawing the
grid, showing its time, drawing the spokes, and showing that time.

## Step 3: The Surprising Result

Building this lab, the grid pattern measured around **87,000
microseconds** (87 milliseconds) to draw. The spoke pattern — the exact
same *number* of lines — measured around **1,770,000 microseconds**
(1.77 *seconds*). That's roughly **20 times slower**, just from changing
which drawing function was used.

!!! mascot-thinking "Same number of lines — why so different?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Every single call to draw one pixel on this screen costs a small
    "setup" step over the wire, before the actual color data. `hline()`
    and `vline()` do that setup **once** and then send a whole row or
    column of pixels in one go. `line()` has no shortcut for a diagonal —
    it has to set up fresh for nearly every pixel along the way.

Think of it like mailing letters. Sending one big envelope with 40 pages
inside is much faster than mailing 40 separate envelopes with one page
each — even though the same total amount of paper gets delivered either
way. Every envelope needs its own address and stamp, and that overhead
adds up.

## Try It Yourself

- Predict, before running it: if you double `SPOKE_COUNT`, does the
  spoke time roughly double too? Check your guess.
- Look at `shapes.py` in the `lib/` folder used by Lab 10. Can you find
  where it uses `hline()` instead of drawing a curve pixel by pixel?

## What's Happening Under the Hood

This lesson — batch your work into fewer, bigger requests instead of
many tiny ones — shows up everywhere in computing, not just on this
screen. It's why downloading one large file is usually faster than
downloading a thousand tiny ones, and why later labs in this kit are
careful about exactly what they redraw and how.

## Check Your Understanding

1. What's the difference between `hline()`/`vline()` and `line()`?
2. Why does the lab run `draw()` once before starting the timer?
3. About how many times slower was the spoke pattern than the grid?
4. What's the "envelope" analogy for why fewer, bigger drawing calls
   are faster?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/08-drawing-lines.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/08-drawing-lines.py).

!!! mascot-celebration "You measured real performance!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just ran a real benchmark and found a 20x speed difference hiding
    in plain sight. That's exactly how professional engineers decide
    which code to trust. Next: let's turn sensor numbers into bars!
