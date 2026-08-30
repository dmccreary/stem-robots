# Lab 6: Volume Control Lab

This is the big one. You've tried the speaker, the button, the
display, and the knob separately. In this final lab, you'll look at
the program that uses **all four parts together at the same time** —
the exact same program that runs automatically every time you flip the
power switch on your kit.

!!! mascot-welcome "Welcome to the finale, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Speaker, button, screen, knob — you've met every part on its own.
    Now let's watch them all work together, at the exact same time, in
    one program!

## What You Need

- Your MAX98357A kit, connected to your computer with a USB cable
- Thonny, open and connected to the Pico

## What You'll Learn

- How one program can control several parts of a robot **at the same
  time**, not just one after another
- Why "twice as loud to a computer" doesn't always sound "twice as
  loud" to your ears
- How programmers combine small, tested pieces of code into one bigger
  program

## Step-by-Step

### Step 1: Open the File

In Thonny, open **`07-play-sounds-with-volume.py`**.

This is a long file — the longest one in the kit — because it's really
Lab 3, Lab 4, and Lab 5 all working together, plus one new idea:
controlling volume with the knob.

!!! mascot-encourage "Don't let the length scare you"
    ![Sparky encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Nearly 300 lines sounds like a lot, but you already know almost all
    of it — it's Lab 3, Lab 4, and Lab 5, combined into one program you
    can read piece by piece.

### Step 2: Run It

Press **Run** (F5). You should see the screen show **"Press button"**
with **"Ready"** underneath it — this is the exact same screen you saw
in Lab 1, the very first time you turned the kit on.

### Step 3: Press the Button

Press the button. A sound should play, and the top line of the screen
should change to that sound's name — like **"R2D2 Excited"**. Notice
that after the sound finishes, the name **stays on the screen**. It
does not disappear back to "Ready."

### Step 4: Turn the Knob While a Sound Plays

Press the button again, and while the sound is still playing, turn the
knob. The volume should change **immediately**, while the sound is
still going — not just the next time you press the button.

### Step 5: Find Where the Screen Text Sticks Around

Find this comment inside the `play_wav` function, near the end of the
file:

```python
    # No show_title("Ready") here on purpose - the title stays on screen
    # as the last sound played, so a student has time to read it instead
    # of it flashing back to "Ready" the instant a 1-3 second clip ends.
```

Most sounds on this kit only last one or two seconds. If the screen
flipped back to "Ready" the instant the sound stopped, you'd barely
have time to read what you just heard. Leaving the name on screen is a
small design choice that makes the kit easier to use.

### Step 6: Find the Volume Math

Find this function:

```python
def read_volume():
    linear = pot.read_u16() / 65535  # 0.0 - 1.0, straight from the pot
    return math.sqrt(linear)
```

You already know the first line from Lab 5 — it turns the knob's raw
reading into a fraction between 0.0 and 1.0. The new part is
`math.sqrt(linear)` — the **square root**.

## Try It Yourself

- Comment out `return math.sqrt(linear)` (put a `#` in front of it)
  and add `return linear` right below it instead, so the function
  returns the plain, un-square-rooted number. Run the program and
  slowly turn the knob from all the way down. Does the volume feel
  like it changes evenly, or does most of the change happen only near
  the very top?
- Put it back the way it was (delete your `return linear` line, remove
  the `#`) and compare. Which one felt more natural to control?
- Find `UPDATE_INTERVAL_MS = 150`. This controls how often, in
  milliseconds, the program checks the knob and updates the screen
  while a sound is playing. Change it to `500` (half a second) and
  play a longer sound (try turning the knob during "R2D2 Taking To
  Himself" or "R2D2 More Chatter" — check `sounds/metadata.json` for
  the full list). Does the volume change feel less smooth now?
- **Design challenge**: right now, the kit always plays sounds in the
  same order. Using what you learned in Lab 3, could you change it so
  it picks a **random** sound instead? (Hint: MicroPython has a
  `random` module with a function called `random.randint(low, high)`
  that picks a random whole number in a range.)

## What's Happening Under the Hood

**Why square root?** Your ears don't hear loudness the way a computer
measures it. If a computer's signal gets twice as strong, it does
**not** sound twice as loud to you — it sounds only a little louder.
This is true for a lot of human senses, not just hearing. Taking the
square root of the knob's reading before using it stretches out the
quiet end of the knob's travel and compresses the loud end, so turning
the knob feels more even across its whole range — closer to how a
"real" volume knob on a stereo or a phone behaves.

!!! mascot-thinking "Loudness doesn't feel the way it measures"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Doubling a number on a screen and doubling how loud something *feels*
    to your ears are two different kinds of "double." The square root is
    the trick that lines those two feelings back up.

**Why does everything happen together?** Notice the program never
stops to wait for one thing before checking another. Instead, it loops
very quickly, over and over: check the knob, check the button, check
the knob again, check the button again — thousands of times per
second. This pattern, where a program constantly re-checks several
inputs in a fast loop instead of handling them one at a time, is used
in almost every interactive device you own, from game controllers to
smart doorbells.

You now understand every single piece of the program that runs the
moment you flip the power switch. That's a real accomplishment —
`07-play-sounds-with-volume.py` is nearly 300 lines long, and you just
read the parts that matter most.

## Check Your Understanding

1. Why does the sound's name stay on the screen after the sound stops
   playing?
2. What math function makes the volume knob feel more natural to turn?
3. About how many times per second does the main loop check the
   button and the knob — roughly once, ten times, or thousands of
   times?
4. Name the four hardware parts this one program controls together.

## Full Code

You can find the complete program at
[`src/kits/max98357a-amp/07-play-sounds-with-volume.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/max98357a-amp/07-play-sounds-with-volume.py).
This is the program saved on your Pico as `main.py`, which is why it
starts automatically every time you turn the kit on.

!!! mascot-celebration "You finished the whole kit!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Speaker, button, screen, and knob, all working together under one
    program you understand line by line — that's not a small thing. You
    built and explained a real embedded audio device!
