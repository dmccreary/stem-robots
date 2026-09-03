# Lab 9: Draw Bar Graphs

Numbers are useful, but a bar you can read at a glance is often faster
to understand. This lab turns X, Y, and Z into three live bar graphs
that grow up or down from a shared center line.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Let's turn plain numbers into something you can read in a glance —
    three living bars, reacting to the world in real time!

## What You'll Learn

- How to turn a sensor reading into a bar's height
- How a baseline lets a bar show both positive and negative values
- A second flicker-avoidance trick, for shapes instead of text

## Step 1: Mapping a Number to a Height

```python
FULL_SCALE = 800
MAX_BAR_HEIGHT = 70

def bar_height(value):
    scaled = int(abs(value) * MAX_BAR_HEIGHT / FULL_SCALE)
    return min(scaled, MAX_BAR_HEIGHT)
```

`FULL_SCALE` is a guess at the biggest reading we'd normally expect
indoors. `bar_height()` scales any value down proportionally to fit
inside `MAX_BAR_HEIGHT` pixels — and `min()` **clips** it, so a reading
bigger than expected doesn't try to draw a bar taller than the screen
has room for.

## Step 2: Positive and Negative Bars

```python
if value >= 0:
    display.fill_rect(bar_x, BASELINE_Y - height, BAR_WIDTH, height, color)
else:
    display.fill_rect(bar_x, BASELINE_Y + 1, BAR_WIDTH, height, color)
```

A positive reading draws upward from the baseline; a negative reading
draws downward. This is the same idea as a thermometer that can go
above or below zero — the baseline itself carries information, not just
the bar's length.

## Step 3: A Second Flicker Fix

Lab 7 fixed flicker for *text* by always drawing into the same
fixed-width spot. Bars are different — a `fill_rect()` shape doesn't
have a built-in "erase the old shape" trick the way text does, so a bar
that shrinks would leave old color behind if we didn't clear something.

The fix here is to clear **only each bar's own narrow column**, not the
whole screen:

```python
display.fill_rect(column_x, COLUMN_TOP, COLUMN_WIDTH, COLUMN_HEIGHT, BLACK)
display.hline(bar_x, BASELINE_Y, BAR_WIDTH, WHITE)
# ...then draw the new bar and its number...
```

Everything that never changes — the background, the outer baseline
line, and the "X"/"Y"/"Z" letters — gets drawn **once**, before the loop
even starts, in a function called `setup_static()`. Only the three
narrow bar columns get touched every frame after that.

!!! mascot-tip "Same lesson, different tool"
    ![Sparky with a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Lab 7 avoided a clear entirely; this lab still clears, but only a
    small column instead of the whole screen. Both are the same idea —
    touch only the pixels that actually need to change.

**Try it now:** run `09-draw-bars.py`. Move a magnet near the sensor and
watch the bars react — smoothly, with no flicker.

## Try It Yourself

- Hold the board very still. Do the bars sit perfectly steady, or do
  they jitter slightly? What might cause that?
- Change `FULL_SCALE` to `200`. What happens to the bars now — do they
  clip at the top more often?

## What's Happening Under the Hood

A bar chart is really just a number, drawn as a length instead of
digits — and picking the right `FULL_SCALE` is a real design decision.
Scale it too small, and every bar looks maxed out all the time. Scale it
too large, and small changes become hard to see.

## Check Your Understanding

1. What does `bar_height()` do to a reading that's bigger than
   `FULL_SCALE`?
2. Why does a negative value draw its bar downward instead of upward?
3. Why does clearing only a bar's own column avoid flicker, without
   redrawing the whole screen?
4. What gets drawn once, before the loop starts, instead of every frame?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/09-draw-bars.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/09-draw-bars.py).

!!! mascot-celebration "Numbers you can read at a glance!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built a live, flicker-free bar chart from raw sensor data. Now
    for the grand finale — turning all of this into a real working
    compass!
