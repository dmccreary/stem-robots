# Session Log: Standardized `config.py` Across All Robot Kits, Upload Scripts, and READMEs

**Date:** 2026-08-12
**Repository:** stem-robots
**Branch:** main
**Hardware referenced:** Cytron Maker Pi RP2040 (all `*-bot` kits), bare
Raspberry Pi Pico breadboard kits (`compass-hmc5883l`, `imu-mpu6050`, used
only as style/schema precedent, not modified)

## Overview

Two related requests in one session, covering all seven driveable robot
kits under `src/kits/`: `base-bot`, `display-bot`, `rainbow-bot`,
`ultrasonic-bot`, `wi-fi-bot`, `wifi-display-bot`, and `line-follower-bot`.

1. Design one standardized `config.py` schema and apply it to every kit,
   rewriting each kit's sample code to import hardware constants from it
   instead of hardcoding pins inline.
2. Add a per-kit `upload-code.sh` (based on the `imu-mpu6050` template) and
   a `README.md` documenting the kit's files and how to upload them — no
   kit under `src/kits/*-bot/` had a `README.md` before this session.

---

## 1. Surveying the existing (inconsistent) state

Before designing anything, a background `Explore` agent inventoried every
`.py` file across the six populated kits (`line-follower-bot` was empty at
the time) plus `src/lib/*.py` to catalog every hardware constant in use and
how each kit's constructor signatures worked (`VL53L0X(i2c, address=0x29)`,
`SSD1306_SPI(width, height, spi, dc, res, cs)`).

This surfaced real, pre-existing inconsistencies, not just naming drift:

- **Motor pin naming** varied: `RIGHT_FORWARD_PIN` (base/display/wifi/
  wifi-display) vs. `MOTOR_RIGHT_FORWARD_PIN` (rainbow-bot).
- **ToF I2C pin naming** had three different names for the same wires:
  `I2C_SDA_PIN`/`I2C_SCL_PIN` (base/wifi), `TOF_SDA_PIN`/`TOF_SCL_PIN`
  (rainbow), `TOF_DATA_PIN`/`TOF_CLOCK_PIN` (display).
  Physical bus also differed: base-bot's ToF is on I2C bus 0, display-bot's
  is on bus 1.
- **NeoPixel count** was named `NUMBER_NEOPIXELS` in `config.py` files but
  `NUMBER_PIXELS` in the actual code that used them — inconsistent even
  within the same kit.
- **`ultrasonic-bot` actively disagreed with itself**: `main.py`,
  `stop-motors.py`, and `test-drive-all.py` each hardcoded *different* motor
  pin numbers, and `stop-motors.py` had a bug where `SPEAKER_PIN = 21`
  collided with `LEFT_REVERSE_PIN = 21` in the same file.
  `display-logo-ping.py` used a different HC-SR04 trigger/echo pair (14/15)
  than `main.py` (16/17).
- **`wifi-display-bot` had no `config.py` or `secrets.py` at all**, despite
  four scripts (`main.py`, `19-display-hello-world-config.py`,
  `20-display-wifi.py`, `32-wifi-ping-display.py`) already doing
  `import config` and referencing fields like `config.SCL_PIN` that were
  never defined anywhere — those scripts would fail at runtime as shipped.

To resolve ambiguous cases rather than guess, the docs page
[`docs/kits/ultrasonic-bot/11-ping-lab.md`](../docs/kits/ultrasonic-bot/11-ping-lab.md)
was checked and confirmed `TRIGGER_PIN = 16` / `ECHO_PIN = 17` as the
documented, authoritative wiring — matching `main.py`, not
`display-logo-ping.py`. `main.py` was treated as canonical for motor pins
too, since it's the file MicroPython actually boots.

The already-well-crafted `config.py` files in the non-`-bot` sensor kits
([`compass-hmc5883l/config.py`](../src/kits/compass-hmc5883l/config.py),
[`imu-mpu6050/config.py`](../src/kits/imu-mpu6050/config.py)) were used as
the style precedent for naming SPI display pins (`SCL_PIN`/`SDA_PIN`/
`RES_PIN`/`DC_PIN`/`CS_PIN`) and for including an `init_display()` helper
function directly in `config.py`.

## 2. Unified schema

One schema, with only the fields relevant to each kit's actual hardware:

| Section | Fields |
|---|---|
| Motors | `RIGHT_FORWARD_PIN`, `RIGHT_REVERSE_PIN`, `LEFT_FORWARD_PIN`, `LEFT_REVERSE_PIN`, `MAX_POWER_LEVEL`, `MOTOR_PWM_FREQUENCY` (only where a kit already set one consistently) |
| NeoPixels | `NEOPIXEL_PIN`, `NUMBER_NEOPIXELS` |
| Speaker | `SPEAKER_PIN` |
| ToF sensor | `I2C_BUS`, `I2C_SDA_PIN`, `I2C_SCL_PIN`, `TIME_OF_FLIGHT_I2C_ADDRESS` |
| SPI OLED | `SPI_BUS`, `SPI_BAUDRATE`, `SCL_PIN`, `SDA_PIN`, `RES_PIN`, `DC_PIN`, `CS_PIN`, `DISPLAY_WIDTH`, `DISPLAY_HEIGHT`, plus `init_display()` |
| Ultrasonic | `TRIGGER_PIN`, `ECHO_PIN` |
| Line sensors | `RIGHT_SENSOR_PIN`, `LEFT_SENSOR_PIN` |

Key decisions:

- **`MOTOR_PWM_FREQUENCY` was only added where a kit's code already set an
  explicit, consistent value** — 50 Hz for `base-bot` (matches
  `CLAUDE.md`'s documented convention), 1000 Hz for `wi-fi-bot` and
  `wifi-display-bot` (matches their existing `.freq(1000)` calls).
  `display-bot`, `ultrasonic-bot`, and `line-follower-bot` never set an
  explicit motor frequency, so none was added — deliberately not changing
  runtime behavior on hardware that wasn't re-tested.
- **Tuning/demo parameters stayed local, out of `config.py`** —
  `POWER_LEVEL`, `TURN_DISTANCE`, `zero_dist`/`max_dist`/`scale_factor`
  calibration constants, and `rainbow-bot`'s per-lab `PWM_FREQUENCY` (500 in
  one file, 50 in another — an intentional per-demo choice, not hardware
  wiring) were left as-is. Only physical-wiring facts moved into
  `config.py`.
- **`wi-fi-bot`/`wifi-display-bot` keep `secrets.py` separate from
  `config.py`** — network credentials vs. hardware pins stay in different
  files, matching the pattern `wi-fi-bot` already had.

## 3. Per-kit `config.py` and code retrofit

Each kit's `config.py` was hand-written first (fast, single source of
truth), then a background `Agent` per kit rewrote that kit's sample scripts
to `import config` and read pin values from it instead of hardcoding
literals — five agents in parallel (`base-bot`, `display-bot`,
`rainbow-bot`, `ultrasonic-bot`, `wi-fi-bot`), each briefed with the exact
`config.py` content and a file-by-file, line-by-line change list so the
retrofit was mechanical rather than interpretive.

Notable outcomes:

- **`ultrasonic-bot`**: fixing the pre-existing self-disagreement was the
  main event. `stop-motors.py` and `test-drive-all.py` now use the same
  canonical motor pins as `main.py` (19/21/18/20), `display-logo-ping.py`
  now uses the canonical trigger/echo pins (16/17), and the bogus
  `SPEAKER_PIN = 21` in `stop-motors.py` (this kit has no speaker) was
  deleted along with the three lines that used it.
- **`rainbow-bot`**: was already the most config-driven kit going in — this
  was a pure rename pass (`MOTOR_RIGHT_FORWARD_PIN` → `RIGHT_FORWARD_PIN`,
  `TOF_SDA_PIN` → `I2C_SDA_PIN`, `NUMBER_PIXELS` → `NUMBER_NEOPIXELS`, etc.)
  across all `config.` references, including duplicated occurrences inside
  `collision-avoidance-config.py`.
- **`wifi-display-bot`**: needed zero code changes. Its four scripts already
  expected exactly `config.SCL_PIN`, `config.SPI_BUS`,
  `config.DISPLAY_WIDTH`, etc. — creating `config.py` with those exact
  field names (plus a new `secrets.py` placeholder) was the whole fix.
  Pin values for motors/NeoPixels/speaker were inferred from the repo's
  standard Cytron Maker Pi RP2040 layout (matching `base-bot`/`display-bot`/
  `wi-fi-bot`), since nothing in this kit's code had ever hardcoded them.
- **`line-follower-bot`** was empty at the start of the session. Mid-task,
  the user pointed to source code in a sibling repo:
  `/Users/dan/Documents/ws/learning-micropython/src/kits/maker-pi-rp2040-robots/line-follower/`
  (7 files: `main.py`, `drive-test.py`, `follow-line.py`,
  `motor-drive-test.py`, `play-tone.py`, `read-sensors-print.py`,
  `read-sensors-sound.py`). Those were copied in and adapted to import a
  new `config.py` (motors on GP8-GP11 in a different order than the other
  kits — GP11 forward-right, reflecting this chassis's actual wiring —
  plus `RIGHT_SENSOR_PIN`/`LEFT_SENSOR_PIN` for the IR line sensors).

## 4. Verification

After all five retrofit agents completed:

- Confirmed all 7 kits have a `config.py`.
- Ran `python3 -m py_compile` on every `.py` file in every kit — all pass.
- Cross-checked every `config.X` reference against that kit's `config.py`
  field list — zero undefined references, zero typos.
- Spot-read a couple of rewritten files directly to eyeball quality.
- Cleaned up `__pycache__` directories the compile check left behind.

One pre-existing, unrelated bug was found and flagged but deliberately
**not** fixed (out of scope for a config-refactor task): several
`display-bot` files do `from machine import Pin` but then call
`machine.Pin(...)` / `machine.I2C(...)` without `import machine`, which
would raise `NameError` on real hardware. Offered to fix separately; not
actioned this session.

The config.py + retrofit work was committed by the user outside this
session's own git actions, as commit `88ada06` "Refactor hardware
configuration across multiple bots" (40 files changed, 811 insertions,
214 deletions).

## 5. `upload-code.sh` for every kit

Using [`src/kits/imu-mpu6050/upload-code.sh`](../src/kits/imu-mpu6050/upload-code.sh)
as the template, added an `upload-code.sh` to all 7 kits, each tailored to
what that kit actually has on disk:

- All 7 kits: upload `config.py` first, then every other top-level `.py`
  file.
- `wi-fi-bot`, `wifi-display-bot`: also upload `secrets.py`, with a printed
  reminder to fill in real SSID/password before running the script (it
  uploads whatever is currently in the file, credentials included).
- `wifi-display-bot`: also `mkdir :lib` and upload `lib/ssd1306.py` first —
  the only kit among the seven with a `lib/` subdirectory, closest in shape
  to the original `imu-mpu6050` template.

All 7 scripts were `chmod +x`'d and syntax-checked with `bash -n`.

## 6. `README.md` for every kit

No kit under `src/kits/*-bot/` (or `line-follower-bot/`) had a `README.md`
before this session. Wrote one per kit, following the structure already
established by
[`compass-hmc5883l/README.md`](../src/kits/compass-hmc5883l/README.md) and
[`imu-mpu6050/README.md`](../src/kits/imu-mpu6050/README.md): a one-line
hardware description, a wiring summary pointing at `config.py`, a
file-by-file purpose table (written from having read every script in
detail during the retrofit — not guessed), and an "Uploading" section
covering both `./upload-code.sh` and running a single script headlessly via
`mpremote`.

Final verification cross-checked every backtick-quoted filename in every
README against what's actually on disk (via `find`/`grep`/`comm`) — the two
apparent mismatches it caught were both false positives (explanatory prose
mentioning `main.py` doesn't exist in `rainbow-bot`; a path-handling quirk
in the check script itself for `lib/ssd1306.py`, which does exist).

## Files touched this session

**Committed separately by the user (`88ada06`):** `config.py` in all 7
kits; retrofitted sample scripts in `base-bot`, `display-bot`,
`rainbow-bot`, `ultrasonic-bot`, `wi-fi-bot`; all 7 new files in
`line-follower-bot`; new `config.py` in `wifi-display-bot`.

**Still uncommitted at end of session** (`upload-code.sh` + `README.md`,
14 new files, one pair per kit):

```
src/kits/base-bot/{README.md,upload-code.sh}
src/kits/display-bot/{README.md,upload-code.sh}
src/kits/rainbow-bot/{README.md,upload-code.sh}
src/kits/ultrasonic-bot/{README.md,upload-code.sh}
src/kits/wi-fi-bot/{README.md,upload-code.sh}
src/kits/wifi-display-bot/{README.md,upload-code.sh}
src/kits/line-follower-bot/{README.md,upload-code.sh}
```

---

## 7. `docs/TODO.md` written, then a follow-up autonomous cleanup pass

Two more requests landed later in the same session.

First, asked to summarize the whole session, this log was written. Then
asked to update `docs/TODO.md` with what should happen next: five new items
were added (docs missing an "Uploading" section, stale pre-rename
`src/kits/base`/`src/kits/wi-fi` links found while checking those docs, the
ultrasonic-bot pin corrections and wifi-display-bot's inferred pins needing
a bench check, and the display-bot `import machine` bug), and one existing
item (`src/kits/line-follower-bot/` being empty) was corrected in place
since this session had just resolved it.

Then: **"continue on any cleanup tasks you can resolve without my help — you
have my permission to look into the ../learning-micropython project for
missing code since that is where this textbook was derived from."** Mid-turn,
the user added: **"remember this - all images in these textbooks are my
original images with very few exceptions"** — saved as a new memory
(`images_are_original_photos.md`) before continuing, since it directly bore
on whether pulling images from the sibling repo was appropriate (it is —
they're Dan's own photos, just living in the project they were first taken
for).

Everything below was resolved without asking, since each was either
mechanical (a stale path, a missing import) or directly recoverable from the
sibling repo — nothing here was a judgment call reserved for Dan in
`TODO.md`.

**Missing hardware photos, recovered from `learning-micropython`:**
`HC-SP04P_Grove.jpg` and `Maker_Pi_RP2040-Ping.jpg` for
`ultrasonic-bot/11-ping-lab.md` (this lab page had, at some point between
sessions, already moved from `base-bot/` to `ultrasonic-bot/`, and Dan had
already dropped one of the two images in place — the other was still
missing), `maker-pi-rp2040-motor-driver.jpg` for
`base-bot/07-motor-connection-lab.md`, and `ir-sensors.png`/`ir-sensor.jpeg`
for `line-follower-bot/25-line-follower.md`. Each was placed directly beside
its markdown file, matching the per-kit image convention already used by
most other kits (confirmed by checking: nearly every kit already does this),
and each markdown reference was fixed to match.

A follow-up site-wide scan for any other broken `![]()` targets (not just
the ones already flagged in `TODO.md`) turned up two more, both pure
relative-path bugs rather than missing files: `glossary.md` and
`learning-graph/mascot-render-test.md` used `../../img/...`, one directory
level too deep, landing outside `docs/` entirely instead of at
`docs/img/...` — fixed to `../img/...` and `img/...` respectively. Chasing
down `glossary.md`'s target confirmed `pi-pico-pinout.png` itself was
genuinely missing (not just mispathed) and it too was recovered from the
sibling repo. A final `mkdocs build --strict` plus a hand-rolled
broken-image-link scanner both came back clean.

**The `display-bot` `import machine` bug turned out to be repo-wide.** The
4 files flagged in `TODO.md` were fixed, then a grep sweep for the same
pattern (`machine.X` used somewhere in the file, no bare `import machine`
anywhere) found it in **10 more files** across `rainbow-bot`,
`wifi-display-bot`, `ultrasonic-bot`, and `base-bot` — all fixed the same
way. The sweep also caught it in 6 files under `src/kits/8-pixel/`, which
was deliberately left alone: that folder isn't referenced anywhere in
`docs/` or `mkdocs.yml`, so it reads as unpublished/legacy code entangled
with the still-open "Rainbow Bot has no real lab content" decision in
`TODO.md` — fixing latent bugs in code that might get deleted outright
seemed like the wrong kind of helpful, so it's called out in `TODO.md`
instead of touched.

**Stale pre-rename `src/kits/` and `kits/` links, all fixed:**
`docs/kits/wifi-bot/index.md` (`src/kits/base` → `src/kits/base-bot`),
`docs/kits/swarm-bot/plan.md` (`src/kits/base/` and `src/kits/wi-fi/` → the
`-bot`-suffixed versions, 4 occurrences), and one more found by the same
sweep that wasn't in the original `TODO.md` list: `docs/faq.md` linked to
`kits/base/09-i2c-scanner-test.md` (a docs-internal link, not a source-code
path) — fixed to `kits/base-bot/`.

**"Uploading the Code" sections added** to all 7 remaining kit `index.md`
pages (`base-bot`, `display-bot`, `rainbow-bot`, `ultrasonic-bot`,
`wifi-bot`, `wifi-display-bot`, `line-follower-bot`), matching the wording
already established in `imu-mpu6050/index.md`: a link to `upload-code.sh`
on GitHub, the `./upload-code.sh` one-liner, and an `mpremote ... run`
example for running a single script headlessly. The two Wi-Fi kits' sections
also note that the script uploads `secrets.py` as-is. For `ultrasonic-bot`
and `rainbow-bot` specifically — both flagged in `TODO.md` as having
thin/stub `index.md` content pending a scope decision from Dan — only this
upload section was added; the rest of each page was left untouched rather
than pre-empting that decision.

`docs/TODO.md` was then updated in place: four items marked resolved with
what was actually done, two stale `base-bot/11-ping-lab.md` links (inside
still-open decision items) corrected to point at the file's new home in
`ultrasonic-bot/`, and the "Hardware pin corrections need a bench check"
item left exactly as it was — genuinely not something resolvable without
physical hardware.

### Files touched in this follow-up pass

```
docs/TODO.md                                         (updated)
logs/kit-cleanup-tasks.md                             (this section)
docs/img/pi-pico-pinout.png                           (new, recovered)
docs/glossary.md                                      (path fix)
docs/faq.md                                           (stale link fix)
docs/learning-graph/mascot-render-test.md             (path fix, x14)
docs/kits/ultrasonic-bot/Maker_Pi_RP2040-Ping.jpg      (new, recovered)
docs/kits/ultrasonic-bot/11-ping-lab.md                (path fix)
docs/kits/base-bot/maker-pi-rp2040-motor-driver.jpg    (new, recovered)
docs/kits/base-bot/07-motor-connection-lab.md          (path fix)
docs/kits/line-follower-bot/ir-sensors.png             (new, recovered)
docs/kits/line-follower-bot/ir-sensor.jpeg             (new, recovered)
docs/kits/line-follower-bot/25-line-follower.md        (path fix)
docs/kits/wifi-bot/index.md                            (stale link + new section)
docs/kits/swarm-bot/plan.md                            (stale links, x6)
docs/kits/base-bot/index.md                            (new section)
docs/kits/display-bot/index.md                         (new section)
docs/kits/rainbow-bot/index.md                         (new section)
docs/kits/ultrasonic-bot/index.md                      (new section)
docs/kits/wifi-display-bot/index.md                    (new section)
docs/kits/line-follower-bot/index.md                   (new section)
src/kits/display-bot/{display-dist-chart.py,display-face.py,main.py,tof-range-display-test.py}  (import machine)
src/kits/rainbow-bot/{collision-avoidance-config.py,20-tof-test-config.py}                        (import machine)
src/kits/wifi-display-bot/{18-display-hello-world.py,20-display-wifi.py,19-display-hello-world-config.py}  (import machine)
src/kits/ultrasonic-bot/{display-logo-ping.py,main.py,test-drive-all.py}                          (import machine)
src/kits/base-bot/{50-collision-avoidance-tof.py,main.py}                                         (import machine)
```
