# Hardware Bring-Up Diagnostics

This is the detailed version of Phase 2 in `SKILL.md` — read it when a
sensor's probe script doesn't pass cleanly on the first try. Every technique
here was actually run, live, against real hardware, while bringing up the
`9-dof-imu` kit. None of it is hypothetical.

## The core discipline: one change, one test, read the real result

It's tempting to change three things at once when a scan comes back empty —
swap the pins *and* try a different frequency *and* enable pull-ups. Don't.
You can't tell which change fixed it, which means you can't write down a
trustworthy fix for the guide, and you might re-break something that was
already fine. Every technique below is meant to be run in isolation, over
`mpremote exec`, without touching a single wire, so you can burn through the
software-side possibilities fast before asking the user to change anything
physical.

## Step 1: A scan finds nothing at all

```bash
mpremote connect /dev/cu.usbmodemXXXXX exec "
import machine
i2c = machine.I2C(0, sda=machine.Pin(<SDA>), scl=machine.Pin(<SCL>), freq=100000)
print('scan:', [hex(d) for d in i2c.scan()])
"
```

Work through, in order:

1. **Re-read the wiring back to the user before touching code.** Confirm
   which physical pin on the sensor board is actually the power input. Some
   boards break out a *regulated output* pin (e.g. `3Vo`) right next to the
   real power input (`VIN`/`VCC`) — wiring power into the output pin leaves
   the chip unpowered while looking correctly wired at a glance. If you have
   a board photo, read the silkscreen and any back-of-board text yourself
   rather than asking the user to describe it — a photo of the 9-dof-imu
   module revealed it was actually a different chip than its listing implied,
   caught only by reading the physical board.
2. **Try a swapped-pin scan** in case SDA/SCL landed on the opposite pins
   from what `config.py` assumes:
   ```python
   i2c = machine.SoftI2C(scl=machine.Pin(<SDA>), sda=machine.Pin(<SCL>), freq=100000)
   ```
3. **Try explicit internal pull-ups** on both pins, and a couple of
   different frequencies (400kHz, 100kHz, 10kHz) — cheap to rule out, even
   though a pull-up problem alone rarely explains a *totally* silent bus (see
   Step 3 for the more common false lead).
4. **Check for a loose, unsoldered header.** Several breakout board families
   ship with a header included but not soldered on. If the user says
   everything's plugged in but the header pins were never actually soldered
   to the board's pads, there's no real electrical connection regardless of
   how correct the breadboard wiring looks.
5. **If all of that checks out and the bus is still completely silent**, say
   so plainly and suggest trying a second physical unit if one is available.
   Don't spend more than a few rounds guessing at a dead unit in software —
   there's nothing left to diagnose remotely once wiring, power, and
   soldering are confirmed.

## Step 2: A scan finds devices, but every real read fails

This is the more interesting and less obvious failure: `i2c.scan()` finds
every expected address, but `readfrom_mem()` / `writeto_mem()` / even a bare
`readfrom()`/`writeto()` throws `OSError: [Errno 5] EIO` — on **every**
device on the bus, not just one.

**The instinct to resist:** this looks exactly like "the pull-ups are too
weak for real data transfer, even though they're strong enough for a bare
address probe." That's a real, textbook-correct failure mode in general —
but confirmed, on this project's actual Pico firmware, to *not* be the cause
here. Don't recommend external pull-up resistors on this symptom without
first running the decisive test below — this project's firm rule is
internal pull-ups only, and reaching for resistors as a first response both
violates that rule and is very often diagnosing the wrong problem.

**The decisive test:** swap the hardware peripheral for the bit-banged one,
on the exact same pins:

```python
import machine
# Whatever failed:
i2c_hw = machine.I2C(0, sda=machine.Pin(<SDA>), scl=machine.Pin(<SCL>), freq=100000)
# The diagnostic:
i2c_soft = machine.SoftI2C(sda=machine.Pin(<SDA>), scl=machine.Pin(<SCL>), freq=100000)
who = i2c_soft.readfrom_mem(<ADDRESS>, <REGISTER>, 1)
print('SoftI2C read:', hex(who[0]))
```

**Why this is decisive, not just "try another thing":** `SoftI2C` uses the
exact same physical wires and the exact same weak internal pull-up
resistors as the hardware peripheral did. If pull-up strength (an RC
charge-time problem) were the real cause, `SoftI2C` would fail too — it's
constrained by the same physics. If `SoftI2C` succeeds where hardware `I2C`
failed, that's proof the bug lives in the RP2040's hardware I2C peripheral
driver on that particular firmware build, not in the electrical bus. This
was confirmed on real hardware: hardware `I2C(0, ...)` scanned fine but
threw `EIO` on every read at 400kHz and 100kHz, with and without explicit
pull-ups; `SoftI2C` on the identical pins succeeded at every frequency
tested from 400Hz up to 100kHz.

**If `SoftI2C` fixes it:** that's not a workaround to mention in passing —
it's the shipped fix. Use `machine.SoftI2C` in every script for this kit
(`01-probe.py` through the final lesson), not just as a one-off diagnostic,
and say so in a code comment in `config.py` so the next person doesn't
re-diagnose it from scratch:

```python
# Use machine.SoftI2C (bit-banged), not machine.I2C (the hardware
# peripheral): on this board/firmware, the hardware peripheral could scan
# and find every chip but threw OSError EIO on every real read/write.
# SoftI2C performs identical transactions over the same pins/pull-ups with
# no failures at any frequency tested - this is a peripheral-driver quirk,
# not a wiring or pull-up problem.
```

## Step 3: One address is missing, others are found

If some chips on a multi-chip module answer and others don't, that's a
strong signal the *bus itself* is fine (power, SDA, SCL all reaching the
board) and the problem is local to one chip — a cold solder joint on that
specific chip's pins, or a wrong assumed address for that one chip
specifically. Re-check that chip's address against the datasheet (including
whether an address-select pin like `SA0`/`SDO` is tied high or low on this
particular board) before assuming a wiring fault across the whole module.

## Step 4: Sanity-checking real sensor values once bring-up passes

Once identity checks pass and you move to streaming real values, expect (and
tell the user to expect) two things that look like bugs but usually aren't:

- **A steady non-zero rest value on any gyroscope-style sensor.** Every
  MEMS gyroscope has a real, factory-baked zero-rate bias — sometimes tens
  of degrees per second on cheap parts — that a future calibration lesson,
  not perfect hardware, is what corrects.
- **An accelerometer magnitude noticeably below 1g at rest.** This almost
  always means the board isn't sitting perfectly level on the bench, not a
  driver bug. Only investigate the driver if the reading is wildly off (well
  under 0.5g or well over 1.5g), not just a little low.
