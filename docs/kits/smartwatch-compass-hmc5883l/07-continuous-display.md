# Lab 7: Watch It Live

Reading the compass once is useful, but a real compass updates
constantly as you turn. This lab streams live readings to the screen —
and along the way, we hit a genuinely annoying bug and had to fix it.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Let's make the numbers move! This lab reads the sensor ten times a
    second and keeps the screen up to date, live.

## What You'll Learn

- **Continuous mode**, where the sensor keeps measuring on its own
- Why redrawing a screen the "obvious" way can cause an annoying flicker
- A trick called a **fixed-width field** that fixes it

## Step 1: Continuous Mode

Lab 4 set the compass to take one measurement and stop. This lab sets a
different mode:

```python
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.MODE, bytes([0x00]))
```

`0x00` means **continuous mode** — the chip keeps measuring on its own
in the background, updating its registers automatically, instead of
waiting for us to ask for each new reading. All our program has to do is
keep asking for the latest value.

## Step 2: The Naive Way (and Why It Flickers)

The simplest way to redraw a changing number is to clear the whole
screen and draw everything fresh, every single time:

```python
while True:
    x, y, z = read_xyz()
    display.fill(config.BLACK)   # clears ALL 57,600 pixels
    # ...then draw the new numbers...
```

That works — but this display has **no memory of its own picture**
(you learned that in Lab 5). Every `fill()` call really does send all
57,600 pixels down the wire before anything gets drawn back on top. Do
that ten times a second, and the whole screen visibly flashes black
before each redraw — an annoying strobe effect.

!!! mascot-warning "A real bug we hit building this lab"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The very first version of this lab did exactly that, and it was
    genuinely hard to look at — a visible flicker, ten times a second.
    Clearing the *whole* screen every frame was the problem, even though
    every individual drawing call was already fast.

## Step 3: The Fix — a Fixed-Width Field

Instead of clearing the screen, the finished lab draws each number
directly on top of the old one, using a trick called a **fixed-width
field**:

```python
text = "%s %6d" % (label, value)
display.text(config.BIG_FONT, text, TEXT_X, row_y, config.WHITE, config.BLACK)
```

`%6d` always formats the number into exactly 6 characters, padded with
spaces on the left if it's short — so `39` becomes `"    39"` and
`-1234` becomes `" -1234"`. Both take up the *exact same width* on
screen.

That matters because `display.text()` already paints a background color
behind every letter it draws — passing `config.BLACK` as the background
means every new digit automatically erases whatever was there before,
in that same spot. If the text always lands in the exact same place at
the exact same width, there's nothing left to clear separately, and no
flicker.

!!! mascot-thinking "Why not just clear a small box around the number?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    That would also work, and is a completely reasonable idea! But it's
    still two steps — clear, then draw — instead of one. Letting the
    text's own background color do the erasing is simpler and needs
    fewer instructions sent to the screen.

**Try it now:** run `07-continious-display.py`. The numbers should
update smoothly with no visible flicker. Try moving a magnet near the
sensor and watch the numbers react live.

## Try It Yourself

- Open `config.py` and check `FIELD_WIDTH`. What happens if you shrink
  it to `3`? (Try it, then watch closely if a number ever needs more
  than 3 digits plus a sign.)
- Time how long it takes for the display to react after you move a
  magnet close to the sensor. Does it feel instant?

## What's Happening Under the Hood

This isn't just a compass-screen trick — it's a general rule for
*anything* that redraws on a schedule, from video games to phone apps:
redrawing only the part of the screen that actually changed is almost
always faster and smoother than redrawing everything from scratch.

## Check Your Understanding

1. What does continuous mode mean for the HMC5883L?
2. Why did clearing the whole screen every frame cause flicker?
3. What is a fixed-width field, and why does it stop the flicker?
4. What general rule about redrawing does this lab teach?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/07-continious-display.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/07-continious-display.py).

!!! mascot-celebration "You fixed a real flicker bug!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your screen now updates live and smooth — and you learned a redraw
    trick real game and app developers use every day. Next, let's measure
    exactly how fast this screen really is!
