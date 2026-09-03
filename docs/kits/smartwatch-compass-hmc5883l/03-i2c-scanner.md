# Lab 3: Find the Compass on the Bus

Time to wire up your first sensor. Before we try to read any magnetic
data, we need to prove the compass chip is actually connected and
talking to the Pico. This lab uses an **I2C scanner** to check.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Wiring is where a lot of bugs sneak in — so we always check the
    connection *before* we try to use it. Let's wire up the compass and
    take attendance on the bus!

## What You Need

- Your Pico, connected to your computer
- The HMC5883L compass breakout board
- 4 jumper wires
- A breadboard

## What You'll Learn

- What the **I2C bus** is and how devices share it
- What an **I2C address** is
- What a **pull-up resistor** does

## Step 1: Wire the Compass

| HMC5883L pin | Pico pin | Notes |
|---|---|---|
| VCC | 3.3V OUT | |
| GND | GND | |
| SDA | GPIO12 | I2C0 data line |
| SCL | GPIO13 | I2C0 clock line |

**I2C** (say it "eye-squared-see") is a communication system that lets
many chips share just two wires: **SDA** (data) and **SCL** (clock).
Think of it like a classroom with one shared hallway — lots of rooms
open onto it, but only two people can be talking on it at once, one
speaking and one keeping the beat.

Every chip on the bus has its own **I2C address**, a short number that
works like a name. When the Pico wants to talk to the compass, it says
the compass's address first — like calling out a name in a crowded room
— and only that chip answers.

!!! mascot-thinking "Why does SDA/SCL need a pull-up resistor?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    An I2C wire that nobody is actively driving would just float at a
    random voltage — neither clearly a 1 nor a 0. A **pull-up resistor**
    gently holds the wire at a high voltage (a 1) until a chip actively
    pulls it low to send a 0. Most breakout boards, including this one,
    include their own pull-up resistors right on the board.

## Step 2: Open and Run the Scanner

Open `03-i2c-scanner.py` and press **Run** (F5).

```python
i2c = machine.I2C(config.I2C_BUS, sda=sda, scl=scl, freq=400000)
devices = i2c.scan()
```

`i2c.scan()` does exactly what an I2C scanner sounds like — it asks
every possible address on the bus, "are you there?" and builds a list of
whoever answers. It's like a teacher taking attendance by calling out
every name on the roster and listening for "here!"

## Step 3: Read the Results

If your wiring is good, you should see:

```
Found 1 device(s):
  decimal  30  hex 0x1E  <-- HMC5883L

TEST PASS - HMC5883L found at 0x1E (decimal 30)
```

`0x1E` is written in **hexadecimal**, a counting system programmers use
a lot because it lines up neatly with binary. It's just another way of
writing the number 30 — both mean the exact same address.

**Try it now:** run the scanner. If you see `TEST FAIL`, double-check
each wire against the table above — a single loose connection is enough
to make the compass go silent on the bus.

!!! mascot-warning "Found nothing at all?"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    An empty scan almost always means a wiring problem, not a broken
    sensor — check VCC and GND first, since a sensor with no power can't
    answer no matter how correct SDA and SCL are.

## Try It Yourself

- Unplug just the SDA wire and run the scanner again. What happens?
- Look up what `0x1E` equals in plain decimal, without running any code.
  Then check your answer against what the program prints.

## What's Happening Under the Hood

Every I2C device ships from the factory with a fixed address burned into
its chip — the HMC5883L always answers at `0x1E`, on every board,
everywhere in the world. That's how the scanner knows which address
belongs to a compass and not some other kind of sensor.

## Check Your Understanding

1. What are the names of the two wires used by I2C?
2. What is an I2C address, and why does every chip need one?
3. What does a pull-up resistor do to a wire that nobody is driving?
4. What hexadecimal address does the HMC5883L always use?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/03-i2c-scanner.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/03-i2c-scanner.py).

!!! mascot-celebration "The compass answered!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You wired up a real sensor and confirmed it's talking to the Pico.
    Next, let's ask it for an actual reading!
