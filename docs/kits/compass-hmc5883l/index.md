# Compass Lab

Do you want to know what direction your robot is moving? If you build
a swarm of robots it is handy to have one robot tell the other
robots the direction it is moving.

!!! mascot-welcome "Welcome, maker — let's find north!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, we wire up a real digital compass chip, read raw magnetic field data over I2C, turn that data into a heading in degrees, and draw a live compass dial on an OLED screen. Computational thinking is YOUR superpower — let's activate it!

## Summary

In this lab, we build a standalone digital compass using the HMC5883L
sensor and a Raspberry Pi Pico. We start by scanning the I2C bus to
confirm our wiring works, then stream raw magnetic field readings to
the console. Next, we turn those readings into a heading in degrees
using trigonometry, and fix a common accuracy problem called hard-iron
interference. By the end, we draw a live, rotating compass needle on
an OLED display that remembers its calibration even after a power
cycle.

## Concepts Covered

This lab covers the following 8 concepts from the learning graph:

1. I2C Bus
2. I2C SDA SCL Pins
3. I2C Frequency Config
4. I2C Scanner Tool
5. OLED Display Overview
6. SSD1306 Driver Chip
7. Framebuffer
8. Magnetometer Hard Iron Calibration

## Prerequisites

This lab builds on concepts from:

- [Chapter 6: Electronics, Motors, and Protocols](../../chapters/06-electronics-motors-protocols/index.md) — the I2C bus, addresses, and pull-up resistors
- [Chapter 9: Display Systems and Output](../../chapters/09-display-systems-output/index.md) — the OLED display and drawing with `framebuf`

## Background on Digital Compass Sensors

Earth acts like a giant bar magnet. Its magnetic field lines stream
out of the magnetic south pole, curve around the planet, and flow
back in near the magnetic north pole. A traditional compass needle is
just a small magnet, free to spin, that lines up with those field
lines. That's why it always points north.

A **digital compass** does the same job without any moving parts. Instead
of a spinning needle, it uses a **magnetoresistive sensor** — a material
whose electrical resistance changes slightly depending on the strength
and direction of the magnetic field around it. The chip measures that
tiny resistance change and turns it into a number.

One sensor only tells you the field strength along one direction, so a
useful compass needs **three axes**: X, Y, and Z. Each axis is its own
tiny sensor, aimed at a right angle to the other two. Together, they
tell you how strong Earth's field is pulling in three directions at
once — left-right, forward-back, and up-down.

If you hold the sensor flat, only the X and Y readings matter for
finding north. We can use **trigonometry** — specifically the `atan2`
function — to turn those two numbers into a single angle. We'll do
exactly that in Step 3.

!!! mascot-thinking "Why not just use one axis?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Picture holding a flashlight and pointing it at a wall. How bright the wall looks depends on the angle you're holding the flashlight at, not just how strong the bulb is. A magnetic sensor works the same way — one axis alone can't tell you which direction you're facing, only how strong the field looks from that one angle.

### Hard Iron and Soft Iron Interference

Compasses do not just react to Earth's field. Anything magnetic
nearby — a battery, a motor, even a nearby laptop — adds its own field
on top of Earth's. Engineers call this **magnetic interference**, and
it comes in two flavors:

- **Hard iron interference** is a constant, steady push in one
  direction, caused by something that carries its own magnetic field
  along with the sensor (like a permanent magnet or magnetized metal
  riding on the same breadboard). It shifts every single reading by
  the same fixed amount.
- **Soft iron interference** comes from metal that reacts to the field
  instead of generating its own — it stretches or squishes the reading
  depending on which way the sensor is facing.

This lab only corrects for hard iron interference, since it's the
simpler fix and the bigger problem on a breadboard full of wires and
components. We'll measure and remove it in Step 4.

## The HMC5883L

The **HMC5883L** is a 3-axis digital compass chip made by Honeywell. It
combines three magnetoresistive sensors with a 12-bit analog-to-digital
converter (ADC) — a circuit that turns an analog signal into a digital
number a microcontroller can read. According to Honeywell's datasheet
(see References below), this combination is accurate enough to sense
heading within 1 to 2 degrees.

The chip talks over **I2C**, a two-wire communication protocol, at a
fixed 7-bit address of `0x1E`. Every setting and every measurement
lives in one of its internal **registers** — small storage slots inside
the chip, each with its own address:

| Address | Register | Access | What it does |
|---------|----------|--------|---------------|
| `0x00` | Configuration Register A | Read/Write | Sample averaging, output data rate, measurement mode |
| `0x01` | Configuration Register B | Read/Write | Sensor gain (measurement range) |
| `0x02` | Mode Register | Read/Write | Continuous, single-measurement, or idle mode |
| `0x03`–`0x08` | Data Output X, Z, Y | Read | The actual magnetic field readings |
| `0x09` | Status Register | Read | Whether new data is ready |
| `0x0A`–`0x0C` | Identification Registers | Read | Fixed values that confirm you're talking to a real HMC5883L |

!!! mascot-warning "The data registers are X, Z, Y — not X, Y, Z"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    This one trips up almost everybody the first time. The six data registers come out of the chip in the order X, then Z, then Y — not the order you'd expect. Every script in this lab reads them in that order and reorders them before using X, Y, and Z, so keep an eye out if you ever write your own driver from scratch.

The **DRDY pin** (data-ready) is a hardware signal, separate from I2C, that
the chip pulls low for 250 microseconds every time it finishes a new
measurement. Honeywell's datasheet notes it is "internally pulled
high" whenever the chip has power. That single fact explained a
real bug we hit while building this lab: before the sensor had a good
power connection, DRDY read `0`. Once it was properly powered, it read
`1` at idle, exactly as the datasheet predicts.

If your I2C scan never finds anything at `0x1E`, it's also worth
double-checking that you have a genuine HMC5883L. A lot of cheap
breakout boards sold online use a different, compatible-looking
chip instead.

## Wiring the Sensor

| HMC5883L pin | Pico pin | Notes |
|--------------|----------|-------|
| VCC | 3.3V OUT (physical pin 36) | Wire directly to this pin |
| GND | GND (physical pin 13) | Wire directly to this pin |
| SDA | GPIO10 | I2C1 SDA |
| SCL | GPIO11 | I2C1 SCL |
| DRDY | GPIO12 | Optional — only read by the probe script |

Here's a real bug we hit while building this lab, because debugging is
part of engineering, not a sign something went wrong. Our first
attempt ran VCC and GND through the breadboard's power rail, and the
I2C scan came back completely empty — not even the wrong address
responded. After checking that the data lines weren't shorted, we
traced it to a broken connection in the power rail itself. Running
VCC and GND as direct point-to-point wires, bypassing the breadboard
rail entirely, fixed it immediately.

!!! mascot-tip "Change one thing at a time"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a sensor won't respond, it's tempting to re-wire everything at once. Don't. Change one connection, test again, and watch what changes. That's exactly how we tracked our missing-sensor bug down to one bad power connection instead of rewiring the whole breadboard.

## Step 1 — 01-probe.py: Confirm the Wiring Before Writing Any Sensor Code

Before we try to read a compass heading, we need to know the chip is
actually there and responding. An **I2C scanner** does this by asking
every possible address, "are you there?" — like a teacher taking
attendance by calling out every name on the roster and listening for
"here!"

The probe script starts by printing information about the Pico itself:

```python
u = os.uname()
print("machine :", u.machine)
print("platform:", sys.platform)

gc.collect()
print("RAM free : {} bytes".format(gc.mem_free()))
```

`os.uname()` reports the hardware and firmware version. `gc.mem_free()`
reports how much RAM is free right now — useful for making sure a
program isn't running low on memory.

Next, the script checks the raw voltage level on SDA and SCL, with the
Pico's internal pull-up resistor turned on:

```python
sda_raw = machine.Pin(I2C_SDA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
scl_raw = machine.Pin(I2C_SCL_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
print("SDA idle level:", sda_raw.value())
print("SCL idle level:", scl_raw.value())
```

A **pull-up resistor** gently holds a wire at a high voltage (a `1`)
until something actively pulls it low. With the pull-up on, a healthy,
unshorted line should read `1`. If it reads `0` instead, something is
actively dragging the line down — a short, a reversed pin, or a dead
component. This check needs the pull-up turned on to mean anything at
all; without it, the reading would just float randomly.

The scan itself, though, does **not** turn the pull-up on:

```python
sda = machine.Pin(I2C_SDA_PIN, machine.Pin.IN)
scl = machine.Pin(I2C_SCL_PIN, machine.Pin.IN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

devices = i2c.scan()
if HMC5883L_ADDRESS in devices:
    print("TEST PASS - HMC5883L found at 0x1E")
```

We tested this both ways, and the scan found the sensor either way —
which tells us this particular breakout board already has its own
pull-up resistors built in. Not every board does, so if your scan
comes back empty, try adding `machine.Pin.PULL_UP` back to these two
lines before assuming your wiring is wrong.

**Try it now:** open `01-probe.py` in Thonny and press **F5**. You
should see `TEST PASS - HMC5883L found at 0x1E (decimal 30)` at the
bottom of the output.

## Step 2 — 02-test-compass.py: Watching the Raw Numbers Move

Now that we know the sensor is there, let's read real measurements.
First, we tell the chip how to take them by writing three configuration
bytes:

```python
i2c.writeto_mem(HMC5883L_ADDRESS, CONFIG_A, bytes([0x70]))  # 8-sample avg, 15 Hz
i2c.writeto_mem(HMC5883L_ADDRESS, CONFIG_B, bytes([0x20]))  # +/-1.3 Ga range
i2c.writeto_mem(HMC5883L_ADDRESS, MODE,     bytes([0x00]))  # continuous mode
```

Each of these bytes packs several settings into one number, bit by bit
— that's exactly what the register tables in Honeywell's datasheet
define. In **continuous mode**, the chip keeps measuring on its own
and updating its data registers, instead of waiting for us to ask for
each new reading.

To read a measurement, we grab six bytes starting at register `0x03`
and unpack them as three 16-bit numbers:

```python
def read_xyz():
    data = i2c.readfrom_mem(HMC5883L_ADDRESS, DATA_START, 6)
    x, z, y = struct.unpack(">hhh", data)
    return x, y, z
```

Remember the register order from the background section — X, then Z,
then Y — so we unpack them in that order and hand back `x, y, z` in the
order we actually want to use.

**Try it now:** run `02-test-compass.py` in Thonny with **View →
Plotter** open. Rotate the sensor flat in your hand and watch all
three lines move — that's Earth's magnetic field changing as you turn.

## Step 3 — 03-test-heading.py: Turning X and Y into an Angle

With the board held flat, X and Y together describe a point on a
compass rose. The `atan2` math function converts that point into an
angle — the same way a protractor tells you an angle from two
distances.

```python
def heading_degrees(x, y):
    heading_rad = math.atan2(y, x)
    if heading_rad < 0:
        heading_rad += 2 * math.pi
    return int(heading_rad * 180 / math.pi) % 360
```

`atan2` returns an angle in **radians**, and it can be negative, so we
add a full circle (`2 * math.pi`) when needed to keep it positive.
Multiplying by `180 / math.pi` converts radians to degrees, and `% 360`
guarantees the result wraps cleanly from 359 back to 0.

**Try it now:** run `03-test-heading.py` and rotate the board. You'll
likely see the heading behave strangely — jumping around instead of
sweeping smoothly. That's hard-iron interference at work, and it's
exactly what we fix next.

## Step 4 — 04-test-heading-calibrated.py: Removing the Bias

Remember the hard-iron interference we described earlier? Here's what
it looked like in real numbers: with the board sitting still, we
measured roughly `X = 32`, `Y = -882`, `Z = -341`. If Earth's field
were the only thing being measured, X and Y should be much closer in
size as the board rotates. That huge, constant imbalance is the
hard-iron bias.

**Calibration** finds that bias by rotating the sensor through a full
circle and recording the smallest and largest value seen on each axis:

```python
for i in range(samples):
    x, y, z = read_xyz()
    min_x, max_x = min(min_x, x), max(max_x, x)
    min_y, max_y = min(min_y, y), max(max_y, y)
    time.sleep_ms(SAMPLE_DELAY_MS)

x_offset = (min_x + max_x) // 2
y_offset = (min_y + max_y) // 2
```

If the interference is a constant push in one direction, the true
center of the circle traced by X and Y sits at the midpoint between
each axis's minimum and maximum. Subtracting that midpoint — the
**offset** — from every future reading cancels the bias out:

```python
heading = heading_degrees(x - x_offset, y - y_offset)
```

!!! mascot-encourage "Slow, steady rotation wins"
    ![Sparky giving a thumbs-up](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Fifteen seconds can feel long when you're carefully rotating a breadboard. Keep the board flat and go slow enough to pass through a full circle — a rushed or partial turn gives the calibration less to work with, and the heading will be less accurate.

**Try it now:** run `04-test-heading-calibrated.py`. When it prints
"Calibrating," slowly rotate the board flat through a full circle.
Afterward, the heading should sweep smoothly through the full 0–359
range as you turn.

## Step 5 — 05-display-compass-oled.py: Drawing a Live Compass Dial

So far, every heading has been a plain number in the console. Now we
draw it as a real compass dial on an OLED screen. The display in this
kit connects over **SPI**, a different two-wire-plus protocol than the
I2C bus the compass uses — both can run on the Pico at the same time
without conflict, since they use completely separate pins.

The OLED chip, an **SSD1306**, is controlled through a **framebuffer** —
a block of memory that represents every pixel on the screen. Drawing
functions like `ellipse()`, `line()`, and `text()` change pixels in
that memory, and `show()` sends the whole picture to the display at
once:

```python
def draw_compass(heading):
    oled.fill(BLACK)
    oled.ellipse(CENTER_X, CENTER_Y, RADIUS, RADIUS, WHITE, NO_FILL)
    heading_rad = math.radians(heading)
    needle_x = CENTER_X + int(RADIUS * math.sin(heading_rad))
    needle_y = CENTER_Y - int(RADIUS * math.cos(heading_rad))
    oled.line(CENTER_X, CENTER_Y, needle_x, needle_y, WHITE)
    oled.show()
```

This uses the same trigonometry idea from Step 3, but in reverse.
Instead of turning X/Y into an angle, we turn an angle back into an
X/Y point — the tip of the needle — using `sin()` and `cos()` to find a
point on the edge of the circle at the current heading.

**Try it now:** run `05-display-compass-oled.py`, rotate through the
calibration circle, then watch the needle track your movement on the
OLED.

## Step 6 — 06-display-compass-oled.py: Remembering Calibration Between Runs

Recalibrating for 15 seconds every single time you power on the robot
gets old fast. This version saves the calibration offsets to a file
called `calibration.json` on the Pico's own flash storage, using
**JSON** — a simple, human-readable text format for saving structured
data.

```python
def save_calibration(x_offset, y_offset):
    with open(CALIBRATION_FILE, "w") as f:
        json.dump({"x_offset": x_offset, "y_offset": y_offset}, f)

def load_calibration():
    try:
        with open(CALIBRATION_FILE) as f:
            data = json.load(f)
        return data["x_offset"], data["y_offset"]
    except (OSError, KeyError, ValueError):
        return None
```

On startup, the program tries to load a saved calibration. If the file
doesn't exist yet, it calibrates once and saves the result. From then
on, boot is instant — no rotation required — unless you hold **Button
A**, which forces a fresh calibration and overwrites the saved file:

```python
if button_a.value() == 0:
    x_offset, y_offset = calibrate()
```

**Try it now:** run `06-display-compass-oled.py` once to create
`calibration.json`, then run it again. The second time, it should jump
straight to the compass dial. Hold Button A at any point to
recalibrate on demand.

## Key Takeaways

- A digital compass uses a magnetoresistive sensor to measure Earth's magnetic field along three axes
- `atan2(y, x)` turns two axis readings into a single heading angle
- Hard-iron interference shifts every reading by a constant amount; rotating through a full circle and finding the midpoint of the min and max values removes it
- The HMC5883L's data registers come out in X, Z, Y order — not X, Y, Z
- SPI and I2C can run on the same Pico at the same time, on separate pins
- Saving calibration data to a JSON file means you only need to calibrate once, not on every power-up

!!! mascot-celebration "You built a working digital compass — from raw magnetism to a live dial!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, engineer! You wired up a real sensor, debugged a genuine hardware problem, corrected for magnetic interference with real math, and drew the result on a screen. That's the full engineering process — sensing, correcting, and displaying — in one lab.

## References

[HMC5883L 3-Axis Digital Compass IC — Datasheet](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf) - Honeywell Solid State Electronics Center. The full register map, electrical specifications, and pin configuration for the sensor used in this lab.

[machine.I2C — MicroPython documentation](https://docs.micropython.org/en/latest/library/machine.I2C.html) - official reference for `scan()`, `readfrom_mem()`, and `writeto_mem()`, the three I2C methods used throughout this lab.

[framebuf — MicroPython documentation](https://docs.micropython.org/en/latest/library/framebuf.html) - official reference for the OLED drawing functions used in Step 5, including `ellipse()`, `line()`, and `text()`.

[Source code for this lab](https://github.com/dmccreary/stem-robots/tree/main/src/kits/compass-hmc5883l) - all six scripts, `config.py`, and the SSD1306 driver referenced in this lab.
