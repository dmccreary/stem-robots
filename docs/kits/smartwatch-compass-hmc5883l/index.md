# Smartwatch Compass Kit

A round screen that looks like a smartwatch. A tiny chip that senses
Earth's magnetic field. Put them together, and you've built a working
digital compass you can hold in one hand.

!!! mascot-welcome "Welcome, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    We're building a real compass from scratch — sensing magnetism, doing
    the math to turn it into a direction, and drawing a needle on a round
    watch-style screen. Computational thinking is YOUR superpower — let's
    activate it!

## Summary

In this kit, we wire an HMC5883L digital compass sensor and a round
GC9A01 color screen to a Raspberry Pi Pico. We start small: checking that
the Pico works, then reading raw magnetic values, then drawing text on
the screen. Step by step, we combine those skills into a live compass
dial with a needle that always points north. Along the way we hit — and
fix — the same bugs real engineers run into with cheap sensors and
flicker-prone displays.

## Concepts Covered

This kit covers the following concepts:

1. Digital magnetometers and Earth's magnetic field
2. The I2C communication bus (addresses, SDA/SCL, pull-up resistors)
3. Reading and writing sensor registers
4. Hard-iron magnetic interference and calibration
5. Trigonometry (`atan2`, `sin`, `cos`) for turning sensor data into an angle
6. The SPI bus and RGB565 color
7. Drawing on a display with no frame buffer
8. Benchmarking code and reducing flicker in live animations
9. Mounting-offset calibration (correcting for how a sensor is physically installed)

## Prerequisites

This kit builds on concepts from:

- [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md) — the I2C and SPI buses
- [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md) — calibration and the I2C scanner tool
- [Chapter 9: Display Systems and Visual Output](../../chapters/09-display-systems-output/index.md) — drawing text and shapes on a screen

## What Is a Digital Magnetometer?

Earth is a giant magnet. Deep inside the planet, molten iron flows and
creates a magnetic field that stretches all the way out into space. That
field is why a compass needle always swings around to point north — the
needle is just a small magnet, free to spin, lining itself up with
Earth's much bigger one.

A **digital magnetometer** does the same job with no moving parts at all.
Instead of a spinning needle, it uses a tiny sensor whose electrical
properties change very slightly depending on the strength and direction
of the magnetic field around it. A microcontroller like the Pico reads
that tiny change as a number.

One sensor can only measure the field pushing in one direction, so a
useful compass chip actually packs **three** sensors inside, aimed at
right angles to each other: **X**, **Y**, and **Z**. Together they
measure how strongly the magnetic field is pulling left-right,
forward-back, and up-down, all at the same time.

!!! mascot-thinking "Your phone already has one"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Every smartphone has a magnetometer chip like this one inside it — it's
    what makes the little compass app work, and it's part of what keeps
    map apps pointed the right way as you walk. You're building the exact
    same kind of sensor system real phones use, just bigger and easier to
    take apart!

### Turning Magnetism Into a Direction

If you hold the sensor flat, the X and Y readings alone are enough to
figure out which way is north. A branch of math called **trigonometry**
turns those two numbers into a single angle — we'll use a function
called `atan2` to do exactly that in Lab 4.

There's a catch, though: nearby metal and magnets — batteries, wires,
even the breadboard's own components — add their own magnetic push on
top of Earth's. Engineers call this **hard-iron interference**, and
without correcting for it, a compass built this way can point in a
direction that's completely wrong. Lab 10 walks through how we measure
and cancel that interference out by slowly rotating the sensor through a
full circle.

## Parts List

<!-- NOTE for Dan: confirm exact prices/purchase links before publishing;
     the HMC5883L price below is the one real number confirmed during
     this kit's bring-up session. -->

| Part | Notes |
|---|---|
| Raspberry Pi Pico | Any RP2040-based Pico works |
| HMC5883L compass breakout (GY-271/273 style) | About $2 — see the note below about buying a spare |
| GC9A01 round SPI display (240×240) | The "smartwatch" style round screen |
| Breadboard | Half-size or larger |
| Jumper wires | 11 total: 4 for the compass, 7 for the display |

!!! mascot-tip "Buy a spare compass chip"
    ![Sparky with a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    While building this kit, one of our HMC5883L sensors worked perfectly
    and then, out of nowhere, stopped responding completely — even after
    unplugging and replugging everything. Swapping in a second sensor
    fixed it instantly. Cheap sensor chips like this one occasionally just
    fail, and that's not a mistake you made — it's a normal part of
    working with real hardware. Keep a spare or two on hand.

## Wiring

### HMC5883L compass (I2C0)

| HMC5883L pin | Pico pin | Notes |
|---|---|---|
| VCC | 3.3V OUT | |
| GND | GND | |
| SDA | GPIO12 | I2C0 data line |
| SCL | GPIO13 | I2C0 clock line |

### GC9A01 round display (SPI0)

| GC9A01 pin | Pico pin | Notes |
|---|---|---|
| SCL / CLK | GPIO2 | SPI0 clock |
| SDA / MOSI | GPIO3 | SPI0 data |
| DC | GPIO4 | |
| CS | GPIO5 | |
| RST | GPIO6 | |
| VCC | 3V3 | |
| GND | GND | |
| BL | 3V3 | Most bare modules leave the backlight on all the time |

<!-- NOTE for Dan: add a real photo of the assembled breadboard here once
     one is taken — never substitute a stock or AI-generated image. -->

## The Labs

1. [Lab 1: Meet the Pico](01-probe-pico.md) — check that your Pico is
   alive, with no wiring at all
2. [Lab 2: Blink the Onboard LED](02-blink-onboard-led.md) — your first
   program that controls hardware
3. [Lab 3: Find the Compass on the Bus](03-i2c-scanner.md) — wire up the
   sensor and scan the I2C bus for it
4. [Lab 4: Read the Compass Once](04-get-compass-values.md) — grab one
   real magnetic reading and print it
5. [Lab 5: Say Hello on the Screen](05-display-hello.md) — wire up the
   round display and draw your first text
6. [Lab 6: Show the Numbers](06-display-compass-values.md) — combine the
   sensor and the screen for the first time
7. [Lab 7: Watch It Live](07-continuous-display.md) — stream sensor
   readings to the screen continuously
8. [Lab 8: How Fast Is a Line?](08-drawing-lines.md) — benchmark two
   different ways of drawing on the screen
9. [Lab 9: Draw Bar Graphs](09-draw-bars.md) — turn three numbers into
   three live bars
10. [Lab 10: Build a Real Compass](10-draw-compass.md) — the capstone:
    a live needle that points north

## Uploading the Code

The source code for this kit, plus a shared `config.py`, lives in
[`src/kits/smartwatch-compass-hmc5883l/`](https://github.com/dmccreary/stem-robots/tree/main/src/kits/smartwatch-compass-hmc5883l).
To copy the whole kit — code, display driver, and fonts — onto the Pico
in one step, run [`upload-code.sh`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/upload-code.sh)
from a terminal:

```bash
./upload-code.sh
```

Any single lab script can also be opened and run directly from Thonny,
which is how each lab above is written to be used.
