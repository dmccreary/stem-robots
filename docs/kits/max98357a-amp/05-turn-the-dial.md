# Lab 4: Turn the Dial

The knob on your kit is called a **potentiometer** (say it
"po-TEN-she-AH-meter"), or "pot" for short. It's the same kind of part
inside a real volume knob or a dimmer light switch. In this lab, you
will watch the Pico read the knob's position and turn it into a
glowing dial on the screen.

## What You Need

- Your MAX98357A kit, connected to your computer with a USB cable
- Thonny, open and connected to the Pico

## What You'll Learn

- The difference between a **digital** signal (like the button — only
  on or off) and an **analog** signal (like the knob — anywhere in
  between)
- What an **ADC** is
- How to turn one range of numbers into a different range of numbers
  (this is called **mapping**)

## Step-by-Step

### Step 1: Open the File

In Thonny, open **`06-pot-gauge-test.py`**.

### Step 2: Run It

Press **Run** (F5). The screen should clear to black. Look at the
Thonny console — you'll see:

```
Turn the pot - the blue ring should grow and shrink smoothly.
```

### Step 3: Turn the Knob and Watch

Slowly turn the knob on the side of your kit. A blue ring should grow
around the edge of the screen, starting from the top and sweeping
clockwise, like the hand of a clock.

Turn the knob all the way one direction — the ring should mostly
disappear. Turn it all the way the other direction — the ring should
become a complete circle.

### Step 4: Read the Numbers

Look at the Thonny console while you turn the knob. You'll see lines
like:

```
raw=32768  percent= 50.0%
```

`raw` is the exact number the Pico's chip measured — anywhere from `0`
to `65535`. `percent` is that same number turned into something easier
for a human to think about: 0% to 100%.

### Step 5: Find the Math That Does the Conversion

Find this line in the code:

```python
percent = raw / 65535
```

`65535` is the biggest number the Pico's ADC can ever measure (that
number is `2` multiplied by itself 16 times, minus 1 — a very common
number in computing). Dividing `raw` by `65535` turns any reading into
a fraction between `0.0` and `1.0`, which the rest of the program can
easily turn into a percentage or an angle on the dial.

## Try It Yourself

- Turn the knob to exactly halfway (as best you can guess). Check the
  console — how close to `50.0%` did you get?
- Find `RADIUS_OUTER = 116` and `RADIUS_INNER = 106` near the top of
  the file. These two numbers control how thick the blue ring is. Try
  changing `RADIUS_INNER` to `80` (a much bigger gap) and run the
  program again. Turn the knob and see how the ring looks now.
- Find `config.DISPLAY_BLUE` in the `draw_spokes` line inside the main
  loop. Change it to `config.DISPLAY_WHITE`. Now the ring will draw in
  white instead of blue.

## What's Happening Under the Hood

The button you used in Lab 2 can only ever be **on** or **off** — a
**digital** signal. The knob is different. As you turn it, the voltage
on its wire smoothly slides between 0 volts and 3.3 volts, landing
anywhere in between — an **analog** signal.

The Pico's brain, though, only understands digital numbers. A special
piece of hardware called an **ADC** — Analog-to-Digital Converter —
constantly measures that smooth voltage and turns it into a number
between 0 and 65,535, over and over, many times a second. That's the
`raw` number you saw in the console.

Almost every "real world" measurement a robot makes — light level,
temperature, how far you've turned a knob — starts out analog and has
to be converted to digital before a computer can use it. You just
watched that conversion happen live.

## Check Your Understanding

1. What is the special name for the knob part on your kit?
2. What's the difference between a digital signal and an analog
   signal? Give one example of each from this kit.
3. What does ADC stand for, and what job does it do?
4. If `raw` reads `16384`, roughly what percent is that? (Hint: it's
   close to a simple fraction of 65535.)

## Full Code

You can find the complete program at
[`src/kits/max98357a-amp/06-pot-gauge-test.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/max98357a-amp/06-pot-gauge-test.py).
