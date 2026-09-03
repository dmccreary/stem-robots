# Lab 10: Build a Real Compass

This is the capstone. Everything from the last nine labs — reading the
sensor, drawing on the screen, avoiding flicker, and the math to turn
magnetism into a direction — comes together here into one live compass
dial with a needle that points north.

!!! mascot-welcome "Welcome to the finale, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Everything we've built so far leads here — a real, working compass
    with a needle that tracks true north. Let's finish this!

## What You'll Learn

- How to turn X/Y readings into an angle with `atan2`
- Why a compass needs **two** different calibration steps, not one
- A third way to avoid screen flicker — erasing a moving shape

## Step 1: Turning Numbers Into an Angle

```python
def raw_heading_degrees(x, y):
    heading_rad = math.atan2(y, x)
    if heading_rad < 0:
        heading_rad += 2 * math.pi
    return int(heading_rad * 180 / math.pi) % 360
```

`atan2(y, x)` is a trigonometry function that takes two numbers and
returns the angle between them — exactly like reading an angle off a
protractor, except the "protractor" here is the invisible shape of
Earth's magnetic field. The rest of the math converts that angle from
**radians** (the unit trigonometry naturally works in) into ordinary
degrees, and makes sure it always lands between 0 and 359.

## Step 2: Calibration, Part 1 — Removing Magnetic Bias

Nearby metal and other magnets push on the sensor too, adding a steady
bias on top of Earth's real field — the same **hard-iron interference**
you read about on the kit's main page. The fix: rotate the board
through a full flat circle and track the smallest and largest reading
on each axis.

```python
x_offset = (min_x + max_x) // 2
y_offset = (min_y + max_y) // 2
```

The true center of the circle the sensor traces sits halfway between
its minimum and maximum — subtracting that midpoint from every future
reading cancels the bias out.

**Try it now:** run `10-draw-compass.py`. When it says "Calibrating,"
slowly rotate the board flat through one full circle.

## Step 3: Calibration, Part 2 — Finding "Straight Up"

Here's a real problem we hit building this exact lab: after the first
calibration finished, we pointed the top of the board due north — and
the screen read **"E 80"**, not north at all!

That wasn't a bug in the math. The compass chip is mounted at some fixed
angle *inside* its little breakout board, and that angle doesn't
necessarily line up with what we consider the "top" of the assembled
kit. Rotating in a circle fixes magnetic bias, but it can't fix a fixed
mechanical rotation like this one.

The solution is a second calibration step: point the board due north and
hold still, and let the program measure exactly what it reads at that
moment.

```python
sin_sum = 0.0
cos_sum = 0.0
for i in range(mount_samples):
    raw = raw_heading_degrees(x - x_offset, y - y_offset)
    sin_sum += math.sin(math.radians(raw))
    cos_sum += math.cos(math.radians(raw))

MOUNTING_OFFSET_DEGREES = int(math.degrees(math.atan2(sin_sum, cos_sum))) % 360
```

!!! mascot-thinking "Why sin and cos instead of a plain average?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Imagine averaging the headings 359 and 1 — a plain average gives 180,
    which is exactly backwards! Averaging each reading's `sin` and `cos`
    first, then converting back to an angle at the end, handles that
    wraparound correctly. This trick is called a **circular mean**.

Every reading after that subtracts this measured offset, so 0 really
does mean "pointing at true north":

```python
def heading_degrees(x, y):
    return (raw_heading_degrees(x, y) - MOUNTING_OFFSET_DEGREES) % 360
```

**Try it now:** when the screen says "Point the board due north," aim
the top of the board at true north (a phone compass app helps a lot
here) and hold it steady for a few seconds.

!!! mascot-tip "Two calibrations, not one"
    ![Sparky with a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    It's tempting to think "we already calibrated" after the rotation
    step. But that step fixes *magnetism*; this step fixes how the chip
    is *mounted*. They're two completely different problems that happen
    to both be called "calibration."

## Step 4: Drawing a Needle That Moves

The ring around the edge is drawn **once**, before the loop, since it
never moves. The needle is different — it changes every frame, so it
needs its own flicker-avoidance trick:

```python
def draw_needle(heading):
    global prev_needle_x, prev_needle_y
    needle_x = CENTER_X + int(NEEDLE_LENGTH * math.sin(heading_rad))
    needle_y = CENTER_Y - int(NEEDLE_LENGTH * math.cos(heading_rad))
    if prev_needle_x is not None:
        display.line(CENTER_X, CENTER_Y, prev_needle_x, prev_needle_y, BLACK)
    display.line(CENTER_X, CENTER_Y, needle_x, needle_y, WHITE)
    prev_needle_x, prev_needle_y = needle_x, needle_y
```

Instead of clearing a whole area, this remembers exactly where the
*previous* needle pointed and redraws that same line in black —
erasing only that one line — before drawing the new needle in white.
That's the third flicker-avoidance trick in this kit: Lab 7 overwrote
fixed-width text, Lab 9 cleared a small column, and this lab erases
exactly the shape that moved.

## Try It Yourself

- Walk to a different room and run the calibration again. Does the
  needle still track correctly?
- Hold a magnet near the sensor while the needle is live. Watch it swing
  — that's the same hard-iron interference the first calibration step
  was designed to cancel out, overwhelming the correction in real time.

## What's Happening Under the Hood

A cheap sensor mounted by hand on a breadboard will never be perfectly
aligned — and that's completely normal. Real engineers handle
imperfect, real-world hardware by measuring what's actually true and
correcting for it in software, rather than assuming everything lines up
perfectly. That's exactly what both calibration steps in this lab do.

## Check Your Understanding

1. What does `atan2(y, x)` return?
2. What's the difference between the two calibration steps in this lab?
3. Why does averaging headings with `sin`/`cos` work better than a plain
   average?
4. How does the needle avoid leaving a trail as it moves?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/10-draw-compass.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/10-draw-compass.py).

!!! mascot-celebration "You built a real, working compass!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    From one blinking LED all the way to a calibrated compass dial that
    tracks true north — you built every piece of this yourself, and
    debugged real hardware problems along the way. That's the complete
    engineering process. Amazing work, maker!
