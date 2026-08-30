# Lab 3: Light Up the Display

The round screen on your kit can show any word, in any color, at any
spot on the circle. In this lab, you will draw your own message on the
screen and pick your own colors.

## What You Need

- Your MAX98357A kit, connected to your computer with a USB cable
- Thonny, open and connected to the Pico

## What You'll Learn

- How a screen is made of a grid of tiny colored dots called
  **pixels**
- How colors are built from red, green, and blue light
- How to place text at an exact spot on the screen using **x, y**
  coordinates

## Step-by-Step

### Step 1: Open the File

In Thonny, open **`05-display-hello-world.py`**.

### Step 2: Run It

Press **Run** (F5). The screen should go black, and then the words
**"Hello World!"** should appear in white text, roughly in the middle.

`"Hello World!"` is a famous first message — almost everyone who
learns to program writes some version of it as their very first
working program, on every kind of computer.

### Step 3: Change the Message

Find this line:

```python
display.text(config.DISPLAY_FONT, "Hello World!", 72, 112,
             config.DISPLAY_WHITE, config.DISPLAY_BLACK)
```

Change `"Hello World!"` to your own name, like `"Hi, I'm Alex!"`. Run
the program again. Your message should appear where "Hello World!"
used to be.

!!! tip "Watch the Edges"
    The screen is round, but the picture underneath it is actually a
    square. If your message is too long, the ends of it can disappear
    under the black plastic ring (called the **bezel**) around the
    glass. Keep your message short, or move it closer to the middle.

### Step 4: Understand X and Y

The two numbers `72` and `112` after your message tell the screen
**where** to start drawing:

- The first number (**x**) is how many pixels from the **left** edge.
- The second number (**y**) is how many pixels from the **top** edge.

The screen is 240 pixels wide and 240 pixels tall, so the very middle
of the screen is around x=120, y=120.

Try changing `72, 112` to `40, 40`. Run it. Your message should now
start much closer to the top-left corner instead of the middle.

### Step 5: Change the Color

Find `config.DISPLAY_WHITE` in the same line. Open **`config.py`** (in
the same folder) and find this section:

```python
DISPLAY_BLACK = 0x0000
DISPLAY_WHITE = 0xFFFF
DISPLAY_BLUE = 0x001F
```

Each color is written as a strange-looking code starting with `0x`.
That's a color recipe made of three ingredients mixed together: how
much **red** light, how much **green** light, and how much **blue**
light. Mixing different amounts creates different colors — the same
way mixing red, green, and blue stage lights creates any color you can
see on a screen.

Go back to `05-display-hello-world.py` and change `config.DISPLAY_WHITE`
to `config.DISPLAY_BLUE`. Run the program. Your message should now be
blue instead of white.

## Try It Yourself

- Change `config.DISPLAY_BLACK` (the background color, the *last*
  argument on the `display.text(...)` line) to `config.DISPLAY_BLUE`
  too. What happens when the text color and the background color are
  the same?
- Try drawing two messages, one under the other. Copy the whole
  `display.text(...)` block, paste it right below itself, change the
  message and the y value (try `112 + 20`) so it doesn't overlap the
  first one.
- Look at `display.fill(config.DISPLAY_BLACK)` near the top of the
  file. What do you think happens if you delete that line entirely and
  run the program twice in a row without turning the kit off? (Try it
  and see if you were right!)

## What's Happening Under the Hood

Your round screen is called a **GC9A01** display. It has 240x240 =
57,600 individual pixels, and each one can be lit up in any of over
65,000 colors. The Pico talks to the screen over a fast connection
called **SPI**, sending it exact instructions: which pixels to light,
and what color to make them.

Unlike some screens, this one has no "memory" of its own for a whole
picture — every time you draw something, it goes straight onto the
glass immediately. That's why the program doesn't need any kind of
"show my drawing now" command at the end.

## Check Your Understanding

1. What do the letters **x** and **y** represent when drawing on the
   screen?
2. Which corner of the screen is x=0, y=0?
3. What three colors of light are mixed to create every color on the
   screen?
4. What is the black ring around the round glass called, and why does
   it matter when placing text?

## Full Code

You can find the complete program at
[`src/kits/max98357a-amp/05-display-hello-world.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/max98357a-amp/05-display-hello-world.py).
