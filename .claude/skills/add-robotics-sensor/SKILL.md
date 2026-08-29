---
name: add-robotics-sensor
description: End-to-end workflow for adding a new standalone sensor kit to this repo from a sensor description and the user's actual Raspberry Pi Pico wiring - scaffolds config.py and a diagnostic probe script, then walks through LIVE hardware bring-up over mpremote with the user's real Pico (closing Thonny, running real I2C scans and identity checks, diagnosing real failures including the SoftI2C-vs-hardware-I2C EIO quirk), then writes the raw-data lesson, a Thonny-Plotter visualization lesson, the upload script, README, and the published student guide, and wires the kit into mkdocs.yml/docs index. Use this whenever the user describes a new sensor plus how they wired it to a Pico (pins, GPIOs, I2C addresses), asks to add/bring-up/test a new sensor kit, wants a new docs/kits + src/kits pair created for a sensor, or asks to run a probe/scanner against a real board over mpremote for a sensor with no kit yet. Companion to the kit-quality-guide skill, which owns the quality checklist and generic templates - this skill owns the live end-to-end workflow, especially the hardware bring-up loop.
---

# Add Robotics Sensor

This skill turns "I bought sensor X and wired it up like this" into a
working, hardware-verified kit: a `docs/kits/<name>/index.md` guide plus a
`src/kits/<name>/` directory of MicroPython code, built and tested the same
way the `9-dof-imu` kit was built in a real session with Dan. Read
[docs/kits/9-dof-imu/index.md](../../../docs/kits/9-dof-imu/index.md) and
[src/kits/9-dof-imu/](../../../src/kits/9-dof-imu/) once before starting —
it's the concrete worked example every step below points back to.

**Read this first:** [`.claude/skills/kit-quality-guide/SKILL.md`](../kit-quality-guide/SKILL.md)
and its [`references/checklist.md`](../kit-quality-guide/references/checklist.md).
That skill owns the quality bar (what "done" looks like) and the generic
templates (`config.py.template`, `upload-code.sh.template`,
`README.md.template`, `docs-index.md.template`) — this skill owns the
*process* of getting there, especially the part kit-quality-guide doesn't
cover: actually bringing up the sensor on real hardware with the user before
writing a single word of the published guide. Use kit-quality-guide's
templates for the generic pieces; this skill adds two templates of its own
(`assets/templates/probe.py.template` and `plot-test-stream.py.template`)
for the parts that are specific to sensor bring-up.

## Why hardware-first, not docs-first

It's tempting to write the guide first and the code to match it. Don't.
Every genuinely useful detail in the 9-dof-imu guide — the real wiring table,
the real console output, the real bug and its real fix — only exists because
the code was tested on Dan's actual board *before* a word of the guide was
written. A guide written from assumptions reads fine until a student's board
doesn't match it. Treat every claim in the eventual guide ("wire SDA to
GPIO0", "you should see TEST PASS") as something that must be true on real
hardware first, and written down second.

## Phase 0 — Gather the inputs and name the kit

You need two things from the user before writing anything: a description of
the sensor (chip name(s), the protocol — almost always I2C in this repo —
and any address/register info they already know), and their *actual*
physical wiring (which GPIO each sensor pin lands on). Don't guess at pins
they haven't told you, and don't assume a datasheet's default I2C address is
correct — clone boards vary, which is exactly what Phase 2 confirms for
real.

Pick the kit name and type per kit-quality-guide's convention: no `-bot`
suffix for a standalone breadboard sensor kit (the normal case here), `-bot`
only if it's a complete driveable robot. **Use the identical name for both
`docs/kits/<name>/` and `src/kits/<name>/`.** This repo already has one
docs/src naming mismatch (`wifi-bot` vs `wi-fi-bot`) that kit-quality-guide's
own checklist calls out as a bug, not a pattern — never add a second one. If
the user already created one of the two directories under a different name
than you'd pick, ask before renaming rather than silently deciding, and
prefer renaming the newer/emptier side to match the more established one.

## Phase 1 — Scaffold the code that Phase 2 will actually run

Before touching real hardware, write:

- **`config.py`** — every pin the user told you about, named with a `_PIN`
  suffix, plus I2C bus/address constants and any identity-register constants
  you already know from the datasheet. Use
  [kit-quality-guide's `config.py.template`](../kit-quality-guide/assets/templates/config.py.template)
  as the skeleton. Use the user's *stated* wiring — if they haven't told you
  a pin, leave it out rather than inventing one.
- **`01-probe.py`** — use
  [`assets/templates/probe.py.template`](assets/templates/probe.py.template)
  in this skill. It follows the exact structure used in `compass-hmc5883l`,
  `imu-mpu6050`, and `9-dof-imu`'s probe scripts: board/system info, a raw
  SDA/SCL idle-level check, an I2C scan, and — critically — a real identity
  check per chip, not just a bare scan. A scan proves *something* answered
  at an address; it doesn't prove it's the chip you think it is. Pick the
  right identity technique per chip from the datasheet:
    - A `WHO_AM_I`-style register that returns a fixed value (most modern
      ST/InvenSense parts) — read it and compare.
    - No identity register at all (a real limitation of some chips, like the
      LSM303DLHC's accelerometer sub-device) — write a control register and
      read it back as the closest available check.
    - Fixed identification bytes at a specific address (like the LSM303DLHC
      magnetometer's "H43" bytes, or the HMC5883L's ID registers).

Don't write `02`, `03`, or the guide yet. Phase 1's only job is to produce
something Phase 2 can run for real.

## Phase 2 — The live hardware bring-up loop

This is the part that makes this skill worth having. Do it with the user,
turn by turn, on their real board — never simulate or narrate a plausible
result.

1. **Find the port and confirm it's free.** `mpremote` cannot open a serial
   port that Thonny (or anything else) already has open. If a copy or run
   command fails with something like "failed to access ... it may be in use
   by another program," that's not a bug to work around — ask the user to
   close Thonny (or whatever else has the port) and try again. Find the port
   with `ls /dev/cu.usbmodem*` (macOS) if you don't already know it.
2. **Copy `config.py` and `01-probe.py` onto the device and run the probe**:
   ```bash
   mpremote connect /dev/cu.usbmodemXXXXX fs cp config.py :config.py
   mpremote connect /dev/cu.usbmodemXXXXX fs cp 01-probe.py :01-probe.py
   mpremote connect /dev/cu.usbmodemXXXXX run 01-probe.py
   ```
3. **Read the real output and report it plainly** — what scanned, what
   didn't, any error text verbatim. Don't round a partial result up to
   success.
4. **If it doesn't pass, work through causes in this order** before asking
   the user to change anything physical (each one is cheap to rule out over
   `mpremote` without touching a single wire):
   - Wrong pin numbers in `config.py`, or SDA/SCL swapped — re-check against
     what the user told you, then try a swapped-pin scan as a diagnostic.
   - A board with a regulated **output** pin that looks like a power input —
     e.g. a pin labeled `3Vo` or similar sitting right next to the real
     power-input pin (`VIN`/`VCC`). If a board photo or datasheet is
     available, check it rather than guessing which pin is which.
   - A hardware `machine.I2C` peripheral that **scans fine but throws
     `OSError: [Errno 5] EIO` on every real read/write.** This is a real,
     confirmed bug class (hit on this exact project's Pico firmware), not a
     hypothetical — see
     [`references/hardware-bringup.md`](references/hardware-bringup.md) for
     the full diagnostic and why `machine.SoftI2C` on the identical pins is
     the fix, and proof, that it's a peripheral quirk and not a pull-up
     problem. **Never suggest external pull-up resistors as a first
     response** — this project's firm rule is internal pull-ups only, and
     jumping to resistors both contradicts that rule and is very often not
     the actual cause. If you're ever tempted to suggest them, first run the
     `SoftI2C`-vs-hardware-`I2C` comparison in that reference file — it's a
     decisive, five-minute test that tells you definitively whether pull-ups
     are even a plausible explanation.
   - A dead sensor unit. This happens with inexpensive breakout boards. If
     everything above checks out and the bus stays completely silent, say so
     plainly and ask if the user has (or can get) a second unit to swap in.
5. **Iterate**: change one thing, re-run the probe, read the real result,
   repeat. Don't batch multiple untested guesses together — you can't tell
   which one worked.
6. **Stop the moment you have a clean, real, single-run pass.** That
   confirmed pin/address/bus configuration is now the source of truth for
   every remaining phase — go back and update `config.py`'s comments to
   match what actually worked, including a one-line note of what didn't (see
   the content-safety note below for how to phrase this without implying a
   quality problem).

**If you cannot reach a real device at all** (no `mpremote`, no port, a
sandboxed environment with nothing physically attached), say so plainly and
stop this phase rather than inventing plausible-looking console output.
Fabricated hardware output is worse than no output — it produces a guide
that confidently tells a real student to expect a result nobody has actually
seen. Tell the user what's missing and offer to write everything else,
clearly marked as unverified, or wait until they can run it with you.

## Phase 3 — The rest of the lesson sequence

Once wiring is confirmed:

- **`02-<name>-test-stream.py`** — stream real values using small driver
  classes. If the chip might plausibly get reused by a future kit (a
  gyroscope, an accelerometer, anything ST/InvenSense-style with a register
  map), put the driver in `src/lib/<chip>.py` rather than inline in the
  lesson file — that's what made `src/lib/l3gd20.py` and
  `src/lib/lsm303dlhc.py` immediately useful to the swarm-bot plan. If it's
  a one-off, inline is fine.
- **`03-plot-test-stream.py`** (optional but recommended whenever there are
  2+ channels with different natural ranges) — use
  [`assets/templates/plot-test-stream.py.template`](assets/templates/plot-test-stream.py.template).
  It streams every channel to the Thonny Plotter with each channel
  independently rescaled to 0–100 using its own running min/max, so a
  small-range signal doesn't look flat next to a large-range one on the same
  graph. This is a general pattern, not specific to IMUs — reuse it for any
  multi-channel sensor.

Test each new script live the same way as Phase 2, briefly — a bounded loop
via `mpremote exec` is enough to confirm real numbers come back sanely; you
don't need to re-run the full diagnostic loop for every subsequent script.

## Phase 4 — Package it

- **`upload-code.sh`** — adapt
  [kit-quality-guide's template](../kit-quality-guide/assets/templates/upload-code.sh.template).
  It already globs `[0-9][0-9]-*.py` and conditionally bundles a `lib/`
  folder — just point `LIB_DIR` at `src/lib/` if the drivers live there
  rather than in a kit-local `lib/`. Run it for real and confirm the file
  listing it prints back matches what you expect.
- **`README.md`** — adapt
  [kit-quality-guide's template](../kit-quality-guide/assets/templates/README.md.template).
  It already has the dual-audience shape (student wiring/files tables, a
  "For Instructors and Mentors" section). See the content-safety note below
  for what belongs in the instructor section versus what doesn't belong
  anywhere in the published guide.

## Phase 5 — Write the published guide

Write `docs/kits/<name>/index.md` following
[`CONTENT-GENERATION-GUIDELINES.md`](../../../CONTENT-GENERATION-GUIDELINES.md)
§1.5 exactly, using
[kit-quality-guide's `docs-index.md.template`](../kit-quality-guide/assets/templates/docs-index.md.template)
as the skeleton: Sparky welcome → Summary → Concepts Covered → Prerequisites
→ Parts List → Wiring → numbered Step sections (one per lesson file) → Key
Takeaways → Sparky celebration → References.

A few things worth naming explicitly because they came up as real
corrections in the session this skill is based on:

- **Explain every abbreviation the first time it appears**, even ones that
  feel obvious to an engineer. "IMU," "MEMS," a manufacturer name shortened
  to an abbreviation — none of these are safe to leave unexplained for an
  8th–12th grade audience. If you're not sure whether a term needs spelling
  out, spell it out; a sentence of explanation costs little and a confused
  reader costs a lot.
- **Never fabricate a part price, purchase link, or citation.** If you
  genuinely don't know it, write an explicit `{{TODO: price}}` /
  `{{TODO: purchase link}}` placeholder and tell the user directly what's
  missing, rather than inventing something plausible.
- **Never substitute a stock or AI-generated image for a missing hardware
  photo.** Every image in this textbook is a real photo. If a wiring or
  board photo doesn't exist yet, say so and treat it as something to shoot,
  not something to generate.
- **Real photos change what you can claim.** If the user has photos of the
  actual board (not just a stock listing), read them before writing the
  "Meet the Sensor" section — a board's silkscreen and back-of-PCB text
  often say things the seller's listing doesn't (the 9-dof-imu module's
  actual chip turned out to be a different part than its listing implied,
  caught only by reading the physical board).

### Content-safety note: what belongs where

Keep any narrative about a *specific* hardware failure — a dead unit, a bad
batch, "the first one we got didn't work" — **out of the published student
guide entirely.** The project owner does not want students inferring a
supply-chain quality problem from a debugging story that's really just
normal hardware bring-up. Two ways to preserve the value without that risk:

- A **generic, forward-looking** troubleshooting entry ("if nothing scans
  and wiring checks out, a dead unit is possible — try swapping it") is fine
  in the *README's* instructor/mentor section, since that's a different
  audience reading for practical session-running advice, not a narrative
  about this kit's specific history.
- A **genuinely reusable technical lesson** — like the `SoftI2C` vs hardware
  `I2C` fix — is fine to keep in *both* the student guide and the README,
  because it's teaching a transferable fact about how the hardware works,
  not a claim about part quality.

## Phase 6 — Wire it in and verify

1. Add a nav entry to `mkdocs.yml`'s `Robot Kits` block, next to the other
   standalone sensor kits.
2. Add a short blurb + link on `docs/kits/index.md`.
3. Run the mechanical checker from the repo root and fix whatever it flags
   before calling the kit done:
   ```bash
   python3 .claude/skills/kit-quality-guide/scripts/audit_kit.py <name>
   ```
   Confirm `--list` shows `docs=yes src=yes` under one matching name.

## Quick reference

| Need | Where |
|---|---|
| Quality bar / what "done" means | `.claude/skills/kit-quality-guide/references/checklist.md` |
| Generic templates (config, upload script, README, docs index) | `.claude/skills/kit-quality-guide/assets/templates/` |
| Probe-script template (this skill's own) | `assets/templates/probe.py.template` |
| Auto-scaling Plotter template (this skill's own) | `assets/templates/plot-test-stream.py.template` |
| Hardware bring-up diagnostics, SoftI2C fix in full | `references/hardware-bringup.md` |
| Concrete worked example | `docs/kits/9-dof-imu/index.md` + `src/kits/9-dof-imu/` |
