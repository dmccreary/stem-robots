# Lab 2: Blink the Onboard LED

Time to control something for real. Every Raspberry Pi Pico has a small
LED built right onto the board — no wiring required. In this lab, you'll
make it blink, and learn the basic pattern every hardware program uses.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Blinking a light might sound simple, but it's the "Hello World" of
    hardware — the first real test that your code can control something
    in the physical world. Let's light it up!

## What You Need

- Your Raspberry Pi Pico, connected to your computer
- Thonny, open and connected

## What You'll Learn

- What a **GPIO pin** is, and how MicroPython controls one
- The difference between digital **on** and **off**
- How a `while True:` loop keeps a program running forever

## Step-by-Step

### Step 1: Find the Pin

Open `config.py` and find this line:

```python
LED_PIN = 25
```

GPIO stands for **General Purpose Input/Output** — a pin on the chip
that your program can turn on or off, or use to read a signal coming in.
GPIO 25 happens to be wired straight to the little LED already built
into the Pico.

### Step 2: Open and Run the Lab

Open `02-blink-onboard-led.py` and press **Run** (F5). Watch the small
LED on the Pico — it should start blinking on and off, about twice a
second.

### Step 3: Read the Code

```python
led = Pin(config.LED_PIN, Pin.OUT)

while True:
    led.toggle()
    time.sleep(0.5)
```

`Pin(config.LED_PIN, Pin.OUT)` tells the Pico "I want to control GPIO
25, and I'm going to send signals *out* on it" — as opposed to `Pin.IN`,
which would mean reading a signal coming in instead. `led.toggle()`
flips it: on becomes off, and off becomes on. `time.sleep(0.5)` pauses
the program for half a second before the loop runs again.

A digital pin only ever has two states — a **1** (on, full voltage) or
a **0** (off, no voltage). There's no "kind of on." That's what makes it
digital, as opposed to a dimmer switch, which can be anywhere in
between.

!!! mascot-thinking "Why 0.5 seconds twice, not once?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    One full blink — on, then off — actually takes a full second, because
    the loop pauses for 0.5 seconds *after turning it on* and 0.5 seconds
    *after turning it off*. Each `sleep()` is only half of one blink.

### Step 4: Change the Speed

Try changing `time.sleep(0.5)` to `time.sleep(0.1)`. Run it again. The
LED should blink much faster.

**Try it now:** stop the program (the red Stop button in Thonny), change
the sleep time to something new, and run it again to see the difference.

## Try It Yourself

- What's the fastest blink you can get before it starts to look like a
  dim, steady glow instead of separate blinks?
- What happens if you change `time.sleep(0.5)` to `time.sleep(2)`? Time
  how long one full blink cycle actually takes with a clock or your
  phone's stopwatch.

## What's Happening Under the Hood

`while True:` creates a loop that never ends on its own — the program
keeps running the same few lines over and over until you stop it. Almost
every robot and sensor program you'll write in this kit uses exactly
this pattern: do something, wait a moment, then do it again.

## Check Your Understanding

1. What does GPIO stand for?
2. What are the only two states a digital pin can be in?
3. What MicroPython command flips a pin from on to off or off to on?
4. What kind of loop keeps a program running until you stop it?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/02-blink-onboard-led.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/02-blink-onboard-led.py).

!!! mascot-celebration "You controlled real hardware!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    That blinking light was your code, running on a real chip, controlling
    real electricity. Next up: wiring in the compass sensor for the first
    time!
