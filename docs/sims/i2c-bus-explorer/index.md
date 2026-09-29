---
title: I2C Bus Explorer
description: Send a byte on a shared two-wire I2C bus and trace START, the 7-bit address, the ACK, the data bits, and STOP, then scan the bus to find which addresses answer.
image: /sims/i2c-bus-explorer/i2c-bus-explorer.png
og:image: /sims/i2c-bus-explorer/i2c-bus-explorer.png
twitter:image: /sims/i2c-bus-explorer/i2c-bus-explorer.png
social:
   cards: false
quality_score: 100
---

# I2C Bus Explorer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the I2C Bus Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/i2c-bus-explorer/main.html"
        height="532px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

The **I2C bus** lets one controller talk to many devices over just two wires:
**SDA** (Serial Data, GPIO 16 on the Maker Pi RP2040) and **SCL** (Serial
Clock, GPIO 17). Two pull-up resistors hold both wires at 3.3 V when nobody is
talking.

The top of this MicroSim shows the robot's bus: the RP2040 controller, the
**VL53L0X distance sensor** at address `0x29`, and the **SSD1306 OLED display**
at address `0x3C`. Both devices hear every message. They tell messages apart
by **address**, a 7-bit number that each device owns.

The middle shows a **timing diagram**: the SCL clock in green and the SDA data
in blue. One write transaction has seven parts:

1. **START**: SDA falls while SCL is high.
2. **ADDRESS**: 7 address bits, most significant bit first.
3. **R/W**: one bit, 0 for write.
4. **ACK**: the device with that address pulls SDA low to say "I'm here."
5. **DATA**: 8 data bits.
6. **ACK**: the device confirms it got the byte.
7. **STOP**: SDA rises while SCL is high.

Only the addressed device answers. It lights green, and the other device
turns gray and shows "ignoring." If no device has the address, nobody pulls
SDA low on the ACK bit. That is a **NACK**, and MicroPython reports
`OSError: [Errno 5] EIO`.

**Scan bus** does what `i2c.scan()` does on your robot. It probes every
usable address from `0x08` to `0x77` and lists the ones that answer.

## How to Use

1. Choose who to **Talk to**, the **Clock** speed, and the **Data byte**.
2. Press **Step** to send one bit at a time, or **Send** to watch the whole
   transaction. The orange marker shows the bit being sent.
3. Read the 0 and 1 above each SDA bit and compare them with the binary
   address in the header line.
4. Choose **Nobody home (0x50)** and send again. Watch the ACK bit.
5. Press **Scan bus** and read the list of addresses that answered.
6. Compare the transaction time at 100 kHz and 400 kHz.

This MicroSim goes with the I2C section of
[Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory electronics with a physical robot)

### Duration

20 minutes

### Prerequisites

- Binary numbers and hexadecimal notation such as `0x29`
  ([Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))
- GPIO pins and the `config.py` pin names (Chapter 5)
- The I2C bus, SDA, SCL, and addresses (Chapter 6, "I2C Bus — A Two-Wire Network")

### Learning Objective

Students will be able to **trace** (Bloom's Taxonomy: Apply) an I2C write
transaction (START, address, ACK, data, STOP) and explain how addresses let two
devices share the same two wires.

### Activities

1. **Decode the address (4 min).** Students convert `0x29` to 7-bit binary by
   hand (0101001), then step through the address bits and check each one.
2. **Trace a full write (5 min).** Students step through a transaction to the
   OLED and label each part of the timing diagram on a worksheet: START,
   address, R/W, ACK, data, ACK, STOP.
3. **Break it (4 min).** Students send to `0x50`, describe what happens on the
   ACK bit, and connect the EIO error to a real wiring mistake.
4. **Scan and compare (4 min).** Students run **Scan bus** and compare the
   result with the chapter's `i2c.scan()` example.
5. **Speed check (3 min).** Students compute the transaction time at 100 kHz
   and 400 kHz and verify it with the header line.

### Assessment

- **Challenge:** Send to `0x50` and find out why nothing answers. *Answer:* no
  device uses that address, so nobody pulls SDA low for the ACK bit. Then run
  **Scan bus** and confirm that the two addresses that answer are `0x29` and
  `0x3c`.
- **Exit ticket:** "Two sensors both use address `0x29`. What problem will you
  see on the bus, and how could you fix it?"
- **Rubric (4-point):** *Exemplary* traces every part of a transaction, decodes
  the address bits, and explains ACK vs. NACK in terms of who drives SDA.
  *Proficient* names the parts in order and explains why only one device
  answers. *Developing* identifies START and STOP but confuses the ACK bit.
  *Beginning* cannot explain how two devices share the wires.

## References

1. [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md) - the I2C bus, addresses, and the robot's SDA and SCL pins.
2. [MicroPython machine.I2C](https://docs.micropython.org/en/latest/library/machine.I2C.html) - the `I2C` class and `i2c.scan()`.
3. [I²C (Wikipedia)](https://en.wikipedia.org/wiki/I%C2%B2C) - how START, addresses, ACK, and STOP work on the bus.
4. [NXP UM10204: I2C-bus specification and user manual](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) - the official I2C specification.
5. [Protocol Comparison (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/protocol-comparison) - the earlier MicroSim whose layout this one follows.
