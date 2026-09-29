---
title: I2C vs SPI Wiring Comparison
description: Wire the robot's devices to an I2C bus and to an SPI bus side by side, count the wires and GPIO pins each one uses, and decide which bus fits each task.
image: /sims/i2c-vs-spi-wiring/i2c-vs-spi-wiring.png
og:image: /sims/i2c-vs-spi-wiring/i2c-vs-spi-wiring.png
twitter:image: /sims/i2c-vs-spi-wiring/i2c-vs-spi-wiring.png
social:
   cards: false
quality_score: 100
---

# I2C vs SPI Wiring Comparison

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the I2C vs SPI Wiring Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/i2c-vs-spi-wiring/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Your robot can talk to its devices over two kinds of bus. This MicroSim wires
the same devices both ways, side by side.

- **I2C** uses just two shared wires: **SDA** (blue) and **SCL** (green).
  Every device connects to the same two wires, and the controller picks a
  device by its **address**, such as `0x29` for the distance sensor.
- **SPI** uses three shared wires: **MOSI** (orange), **MISO** (purple), and
  **SCK** (green). It also needs one extra **CS** (chip select) wire, drawn in
  red, for *each* device. The controller picks a device by pulling its CS wire
  low.

The **GPIO used** badge on each panel counts the pins. I2C always uses 2. SPI
uses 3 plus one for every device. The speed bars show why SPI is still worth
those pins: at 10 MHz it moves data about 25 times faster than I2C at 400 kHz.

Not every device can use both buses. The **VL53L0X** distance sensor only
speaks I2C. The **SD card** and the **fast color display** only use SPI. The
**SSD1306 OLED** can use either. A device that cannot use a bus appears as a
dashed gray box and does not count toward that bus's wires.

The summary table under the panels updates as you add devices, and a green
cell marks the winner in each row. Real SPI displays often need one or two
more control pins (such as D/C and reset); the sim counts only the bus wires.

## How to Use

1. Check the devices you want: **VL53L0X**, **SSD1306 OLED**, **SD card**, and
   **Fast color display**. Watch the wires and the **GPIO used** badges change.
2. Choose a **Task** and read the verdict line under the table.
3. Press **Send data** to watch data move along both buses. The SPI dots move
   much faster.
4. Compare the **Time to move 1 KB** line for both buses.
5. Press **Reset** to return to the robot's usual devices: the VL53L0X and
   the OLED.

This MicroSim goes with the SPI section of
[Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md).
Try the [I2C Bus Explorer](../i2c-bus-explorer/index.md) first to see how
addresses work on the I2C bus.

## Lesson Plan

### Grade Level

Grades 8–12 (introductory electronics with a physical robot)

### Duration

15–20 minutes

### Prerequisites

- The I2C bus, SDA, SCL, and device addresses (Chapter 6, "I2C Bus — A Two-Wire Network")
- The SPI bus wires: MOSI, MISO, SCK, and CS (Chapter 6, "SPI Bus — High-Speed Serial")
- GPIO pins on the Maker Pi RP2040
  ([Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md))

### Learning Objective

Students will be able to **compare** (Bloom's Taxonomy: Analyze) the wires and
GPIO pins that I2C and SPI need as devices are added, and justify which bus
fits a device or a task.

### Activities

1. **Count as you add (4 min).** Starting from Reset, students add one device
   at a time and record the I2C and SPI pin counts in a table. They write a
   rule for each bus.
2. **Find the gaps (3 min).** Students note which devices cannot use each bus
   and explain what that means for a robot that needs an SD card log.
3. **Match the task (5 min).** For each of the four tasks, students predict
   the better bus, then check the verdict line. They use the 1 KB timing to
   explain why the full-color screen needs SPI.
4. **Design decision (4 min).** In pairs, students design the bus plan for a
   robot with a distance sensor, an OLED, and an SD card, and count the total
   GPIO pins.

### Assessment

- **Challenge:** With all four devices checked, how many GPIO pins does SPI
  need, and how many does I2C need? *Answer:* SPI needs 6 (3 shared wires plus
  3 CS wires for the OLED, the SD card, and the color display; the VL53L0X
  cannot use SPI), and I2C needs 2. Then pick which bus you would use for a
  robot with 3 small sensors, and explain why. *Answer:* I2C, because it uses
  only 2 pins and its speed is enough for a few bytes at a time.
- **Exit ticket:** "Write the rule for the number of SPI pins with *n*
  devices." *Answer:* 3 + *n*.
- **Rubric (4-point):** *Exemplary* states both pin-count rules, uses the 1 KB
  timing to justify bus choices, and accounts for devices that support only
  one bus. *Proficient* states both rules and matches every task to a
  reasonable bus. *Developing* counts pins correctly but cannot justify a
  choice. *Beginning* believes SPI and I2C use the same number of pins.

## References

1. [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md) - the I2C and SPI buses and the comparison table.
2. [MicroPython machine.SPI](https://docs.micropython.org/en/latest/library/machine.SPI.html) - the `SPI` class and its pins.
3. [MicroPython machine.I2C](https://docs.micropython.org/en/latest/library/machine.I2C.html) - the `I2C` class used for the distance sensor and OLED.
4. [Serial Peripheral Interface (Wikipedia)](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) - how MOSI, MISO, SCK, and chip select work.
5. [I²C (Wikipedia)](https://en.wikipedia.org/wiki/I%C2%B2C) - how a two-wire bus shares devices by address.
6. [Protocol Comparison (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/protocol-comparison) - the earlier side-by-side protocol MicroSim this one adapts.
