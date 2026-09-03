# Lab 4: Read the Compass Once

The scanner proved the compass is there. Now let's actually ask it a
question: "what does the magnetic field look like right now?" This lab
grabs one real reading, prints it, and stops.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Time to get our first real magnetic data. Let's see what Earth's
    field looks like from right where you're sitting!

## What You Need

- Your kit from Lab 3, still wired up

## What You'll Learn

- What a **register** is, and how to read/write one over I2C
- Why sensor readings sometimes arrive in a strange order
- A real bug we hit, and how we fixed it

## Step 1: Set Up the Sensor's Registers

A chip like the HMC5883L stores its settings and its measurements in
small numbered storage slots called **registers**. Before reading a
measurement, we tell it how to take one:

```python
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_A, bytes([0x70]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_B, bytes([0x20]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.MODE, bytes([0x01]))
```

Each `writeto_mem()` call writes one byte into one register: how many
samples to average, how sensitive to be, and — with `0x01` — to take
**one single measurement** and then stop, instead of measuring
continuously forever.

## Step 2: Read the Measurement

```python
data = i2c.readfrom_mem(config.HMC5883L_ADDRESS, config.DATA_START, 6)
x, z, y = struct.unpack(">hhh", data)
```

`readfrom_mem()` grabs 6 raw bytes back from the chip — two bytes for
each of the three axes. `struct.unpack(">hhh", data)` is a tool that
turns those raw bytes into three actual numbers your program can use.

!!! mascot-warning "Wait — x, z, y? Not x, y, z?"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    This one trips up almost everyone the first time. The HMC5883L's
    registers store the axes in the order X, then Z, then Y — not the
    order you'd guess. Get this wrong, and Y and Z end up swapped in
    every reading you take.

## A Real Bug We Hit

While building this exact lab, reading the sensor kept crashing with an
error called `OSError 5` — even though Lab 3's scanner found the chip
just fine. That was confusing: if the chip answers a scan, why can't we
read it?

It turned out to be a quirk of this specific chip on this specific
board: the normal (hardware) I2C connection can find the chip, but has
trouble with the longer back-and-forth conversation a real reading
requires. Switching to `machine.SoftI2C` — a slightly slower, software
version of I2C — fixed it completely, with the exact same wires. That's
why this lab, and every lab after it that reads the sensor, uses
`SoftI2C` instead of the plain `machine.I2C` the scanner used.

!!! mascot-tip "A scan passing doesn't guarantee a read will work"
    ![Sparky with a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    A scan is a very short conversation — just "are you there?" A real
    reading is a longer one. If reads keep failing with a chip that
    scans fine, trying `SoftI2C` is worth it before assuming your wiring
    is wrong.

**Try it now:** run `04-get-compass-values.py`. You should see three
numbers print, something like `X: 426`, `Y: -537`, `Z: -834`. Slowly
turn the compass and run it again — the numbers should change.

## Try It Yourself

- Run the program several times without moving the board. Do you get
  the *exact* same numbers every time, or do they wiggle a little?
- Point the board straight up, then straight down. Which axis changes
  the most?

## What's Happening Under the Hood

Right now, these numbers are just raw counts from the sensor — they
don't mean "north" or "south" yet. Turning them into an actual
direction takes some math, which is exactly what Lab 10 builds up to.
For now, just notice that the numbers really do respond to how you hold
the board.

## Check Your Understanding

1. What is a register?
2. In what order does the HMC5883L actually send X, Y, and Z?
3. What kind of I2C connection did we switch to, and why?
4. What does `0x01` in the MODE register tell the chip to do?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/04-get-compass-values.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/04-get-compass-values.py).

!!! mascot-celebration "You read real magnetic data!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just pulled real numbers out of a magnetic sensor — and fixed the
    exact same bug real engineers hit building this kit. Next: let's put
    something on that round screen!
