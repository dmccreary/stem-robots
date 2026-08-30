# Lab 3: Press the Button

In Lab 1, pressing the button on your kit played a different R2D2
sound every time. In this lab, you will run that same program from
Thonny, watch the code decide which sound to play, and change how many
sounds are in the list.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Ready to see how I pick which sound to play next? We're diving into
    the code behind the button — a list, a counter, and a clever bit of
    math that keeps everything in order.

## What You Need

- Your MAX98357A kit, connected to your computer with a USB cable
  (power switch **off**, same as Lab 2)
- Thonny, open and connected to the Pico

## What You'll Learn

- What a **digital input** is
- What "**debounce**" means and why buttons need it
- How a program can keep a list of items and remember its place in
  that list
- How to read a simple `if` statement and a loop that never stops

## Step-by-Step

### Step 1: Open the File

In Thonny's file browser, open **`03-play-sounds-on-button.py`**.

### Step 2: Run It

Press **Run** (F5). Look at the Thonny console. You should see
something like:

```
Loaded 16 sound(s) from /sounds.
Press the button (GPIO16) to play the next one in order. Ctrl-C to stop.
```

### Step 3: Press the Button and Watch the Console

Press the button on the side of your kit. Two things should happen:

1. A sound plays through the speaker.
2. A new line appears in the Thonny console, like `Playing R2D2
   Excited`.

Press the button several more times. Watch the console print a
different sound name each time, in the same order, every time you run
the program.

### Step 4: Find the List of Sounds

Near the bottom of the file, find this line:

```python
sound_files = sorted(name for name in os.listdir(SOUND_DIR) if name.endswith(".wav"))
```

This line asks the Pico: "look in the `sounds` folder, and give me
every file that ends with `.wav`, sorted alphabetically." Every sound
file on your kit ends in `.wav` — that's a common format for storing
digital audio.

### Step 5: Find the Counter

Just below that, find:

```python
sound_index = 0
```

`sound_index` is a number that starts at 0 and keeps track of which
sound to play next. Every time you press the button, look for this
line further down:

```python
sound_index = (sound_index + 1) % len(sound_files)
```

This line adds 1 to `sound_index` — **and then wraps it back to 0**
once it reaches the end of the list, using the `%` symbol (called
**modulo**). That's why the sounds never repeat until you've heard
every single one.

### Step 6: Stop the Program

Click the red **Stop** button in Thonny, or press Ctrl-C in the
console, to stop the program. You should see:

```
Done - amp shut down.
```

## Try It Yourself

- Run the program again and count how many sounds play before the
  first one repeats. Does it match the number from Lab 1?
- Find the line `print("Loaded {} sound(s)...` — that number tells you
  exactly how many `.wav` files are in the `sounds` folder without you
  having to count button presses.
- Look at the `if button.value() == 0:` line. Can you find where the
  code checks the button value **a second time**, a few lines later?
  That second check is what makes sure you were really pressing the
  button, and not just picking up electrical noise for an instant.

## What's Happening Under the Hood

The button is a **digital input** — a pin on the Pico that can only
read one of two values: `1` (not pressed) or `0` (pressed). The pin is
wired so it normally reads `1`; pressing the button connects it
straight to the ground wire, pulling it down to `0`.

Real buttons are a little "bouncy" — when you press one, the electrical
signal can flicker between `0` and `1` a few times in a few
thousandths of a second before settling down. If the code checked the
button only once, it might accidentally count one press as two or
three. Waiting a tiny bit (`time.sleep_ms(20)`) and checking again is
called **debouncing**, and it's a trick used in almost every button
project you'll ever build.

!!! mascot-thinking "Have you ever double-clicked by accident?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    That's the same bounce happening on a mouse button instead of mine.
    Debouncing is why a single, deliberate click almost always registers
    as exactly one click, not two.

## Check Your Understanding

1. What value does the button pin read when it is **not** pressed —
   `0` or `1`?
2. What does the `%` (modulo) operator do to `sound_index` once it
   reaches the end of the list?
3. Why does the code check the button's value twice, with a short wait
   in between?
4. If you added 4 more `.wav` files to the `sounds` folder, would the
   program automatically include them, or would you need to change the
   code?

## Full Code

You can find the complete program at
[`src/kits/max98357a-amp/03-play-sounds-on-button.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/max98357a-amp/03-play-sounds-on-button.py).

!!! mascot-celebration "You just decoded a button's memory trick!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You read a real `if` statement, traced a list, and figured out how
    modulo keeps a counter from running off the end. That's exactly how
    programmers manage lists in every kind of software!
