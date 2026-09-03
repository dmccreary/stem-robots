# Lab 5: Say Hello on the Screen

Time to wire up the second half of this kit — the round, smartwatch-style
screen. In this lab, you'll draw your very first message on it.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    My round screen is a canvas made of 57,600 tiny colored dots. Let's
    light some of them up and say hello!

## What You Need

- Your Pico
- The GC9A01 round display
- 7 jumper wires

## Step 1: Wire the Display

| GC9A01 pin | Pico pin | Notes |
|---|---|---|
| SCL / CLK | GPIO2 | SPI0 clock |
| SDA / MOSI | GPIO3 | SPI0 data |
| DC | GPIO4 | |
| CS | GPIO5 | |
| RST | GPIO6 | |
| VCC | 3V3 | |
| GND | GND | |

This display talks over **SPI**, a different two-wire-plus protocol from
the I2C bus the compass uses. Both can run on the Pico at the same time
without conflict, because they use completely separate pins.

## What You'll Learn

- How a screen is a grid of tiny colored dots called **pixels**
- How colors are built from red, green, and blue light
- How to place text using **x, y** coordinates

## Step 2: Run It

Open `05-display-hello.py` and press **Run** (F5). The screen should go
black, then show **"Hello World!"** in large white letters near the
middle.

```python
display.fill(config.BLACK)
display.text(config.BIG_FONT, "Hello World!", 24, 104,
             config.WHITE, config.BLACK)
```

`display.fill(config.BLACK)` clears the whole screen to black first.
`display.text(...)` then draws your message: which font to use, what to
say, where to start (`24, 104`), and what color the letters and
background should be.

!!! mascot-thinking "Why two numbers for position?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The first number, **x**, counts pixels from the *left* edge. The
    second, **y**, counts pixels from the *top*. The screen is 240
    pixels wide and 240 tall, so the exact middle is around x=120, y=120.

## Step 3: Change the Message

Find the `"Hello World!"` text and change it to your own name. Run the
program again.

!!! mascot-warning "Watch the edges"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    My screen is round, but the picture underneath is actually a square.
    A message that's too long can vanish under the black plastic ring —
    called the **bezel** — around the edge of the glass. Keep it short,
    or move it closer to the middle.

## Step 4: Two Fonts, One Screen

Open `config.py` and find these two lines:

```python
import vga1_8x16 as FONT           # small: 8x16 pixels per letter
import vga1_bold_16x32 as BIG_FONT  # big: 16x32 pixels per letter
```

This display has **no built-in font** — unlike some screens, it doesn't
come with letters baked in, so every program has to import a font file
and hand it to `display.text()` directly. Try changing `config.BIG_FONT`
to `config.FONT` in `05-display-hello.py` and running it again. Notice
how much smaller the text gets — and how much more of it fits.

## Try It Yourself

- Change `config.WHITE` to `config.BLUE`. What other colors are defined
  in `config.py`?
- Move your message near the very edge of the screen (try `x=10, y=10`).
  Does part of it disappear under the bezel?

## What's Happening Under the Hood

Every color on this screen — and on your TV, your phone, and every
computer monitor you've ever used — is built by mixing different amounts
of red, green, and blue light. That system is called **RGB**, and it's
why `config.py` defines colors like `WHITE = 0xFFFF` as a single number
that secretly packs all three amounts together.

Unlike some displays, this one has **no memory of its own** for a whole
picture — there's no "frame buffer" holding the image. Every time you
draw something, it goes straight onto the glass immediately. That's why
the program never needs a "show my drawing now" command at the end.

## Check Your Understanding

1. What do the letters x and y mean when placing text on the screen?
2. What three colors of light combine to make every color on the screen?
3. What is the bezel, and why does it matter when placing text?
4. Why does this display need a font imported, when some screens don't?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/05-display-hello.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/05-display-hello.py).

!!! mascot-celebration "You just became a screen artist!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You placed text with exact coordinates and picked your own colors —
    the exact same toolkit real app designers use. Next, let's put your
    sensor data up on that screen!
