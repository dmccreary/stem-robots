# Kits Cleanup — Open Items for Dan

Generated during a full inventory + cleanup pass over `docs/kits/`. Everything
mechanical (broken nav links, dead image paths that pointed at the wrong
file, duplicate files, obvious code bugs, typos) has already been fixed
directly. The items below need your input — a decision, a photo, real
hardware to verify against, or a call on scope — before they can be closed
out.

## Missing hardware photos — RESOLVED 2026-08-12

All five photos below were recovered from the `learning-micropython` sibling
repo this textbook was derived from (same original photos Dan took — see the
[`config.py` standardization session](#from-the-srckits-configpy-standardization-session-2026-08-12)
below) and placed beside their markdown files, matching the per-kit image
convention already used by most other kits:

- [ultrasonic-bot/11-ping-lab.md](kits/ultrasonic-bot/11-ping-lab.md) → `HC-SP04P_Grove.jpg`, `Maker_Pi_RP2040-Ping.jpg` (this page moved from `base-bot/` to `ultrasonic-bot/` at some point after this list was first generated; both images now live directly in `kits/ultrasonic-bot/`)
- [base-bot/07-motor-connection-lab.md](kits/base-bot/07-motor-connection-lab.md) → `maker-pi-rp2040-motor-driver.jpg`
- [line-follower-bot/25-line-follower.md](kits/line-follower-bot/25-line-follower.md) → `ir-sensors.png`, `ir-sensor.jpeg`

A full site-wide scan for broken `![]()` targets after this fix found two
more, also fixed: `glossary.md` and `learning-graph/mascot-render-test.md`
both used a relative path one directory level too deep (`../../img/...`
instead of `../img/...`), pointing outside `docs/` entirely — not missing
files, just a path bug. `pi-pico-pinout.png` (used by `glossary.md`) also
had to be recovered from the sibling repo the same way.

## Orphaned base-bot pages — keep or cut?

Four lab pages exist under `kits/base-bot/` but are not in the `mkdocs.yml`
nav, so they're unreachable from the site (I left them out rather than
guessing your intent):

- [base-bot/08-servo-lab.md](kits/base-bot/08-servo-lab.md) — servo control lab
- [ultrasonic-bot/11-ping-lab.md](kits/ultrasonic-bot/11-ping-lab.md) — ultrasonic ping sensor test (this page has since moved from `base-bot/` to `ultrasonic-bot/`, and its broken photos are now fixed — see above — but it's still not wired into the `mkdocs.yml` nav)
- [base-bot/21-collision-avoidance-ping.md](kits/base-bot/21-collision-avoidance-ping.md) — collision avoidance using the ping sensor instead of time-of-flight
- [base-bot/24-ping-servo-meter.md](kits/base-bot/24-ping-servo-meter.md) — ping + servo + OLED distance meter

**Decision needed:** were these deliberately dropped during the kit reorg
(e.g. because Ultrasonic Bot now covers the ping-sensor material), or should
they be added back to the Base Robot nav section? If they stay cut, consider
deleting the files rather than leaving them as dead weight.

## Rainbow Bot has no real lab content

`kits/rainbow-bot/index.md` is a one-paragraph stub that just links out to
the GitHub source folder. The source files in `src/kits/rainbow-bot/` are
config-variant scripts, not a numbered walkthrough like the other kits. If
you want a real "8x8 NeoPixel Matrix" / "Rainbow Bot Dance" lab (the nav used
to promise these two pages before I removed the dead links), that's new
content to write — happy to draft it from the source files if you point me
at what the dance patterns should demonstrate.

## Pin-number inconsistency across base-bot labs (no explanation given)

Motor pin assignments differ across labs with no note that it's expected:

- `01-testing-motor-connections.md`: `RIGHT_FORWARD=9, RIGHT_REVERSE=8, LEFT_FORWARD=10, LEFT_REVERSE=11`
- `07-motor-connection-lab.md`, `06-up-down-motor-lab.md`, `07b-drive-square-lab.md`, `20-collision-avoidance-robot.md`: `8, 9, 11, 10`
- `21-collision-avoidance-ping.md`, `24-ping-servo-meter.md`: `11, 10, 9, 8` (exact reverse of the previous group)

**Decision needed:** is this genuine per-robot wiring variance (some boards
get wired differently depending on which way the motors ended up mounted),
or should one convention be picked and applied everywhere? If it's real
variance, a one-line callout on each lab ("your pin numbers may differ from
the previous lab — this is normal, verify by testing") would stop it from
reading as a copy-paste error.

## I2C pin convention mismatch

[CLAUDE.md](../CLAUDE.md) documents the project standard as I2C on
GPIO16 (SDA) / GPIO17 (SCL), and the compass/IMU kits follow that. But the
older base-bot labs (`09-i2c-scanner-test.md`, `10-time-of-flight-lab.md`,
`20-collision-avoidance-robot.md`, `12-time-of-flight-sound-lab.md`) hardcode
I2C on GPIO0/GPIO1 (Grove Connector 1) instead. Worth reconciling, or adding
a note explaining the base kit intentionally uses a different Grove port.

## Content-quality gap: older kits vs. compass/IMU

`compass-hmc5883l` and `imu-mpu6050` were recently rewritten with the Sparky
mascot structure, learning-graph tie-ins, and clean, tested code. Every other
kit (base, display, wifi, bump-switch, line-follower, rainbow, ultrasonic,
adjusta) is still the older raw-code-dump style. This is a bigger call than
a cleanup pass — worth deciding whether/when to bring the rest up to the
same bar, and in what order.

## `src/kits/` naming still doesn't quite match `docs/kits/`

The `-bot` renaming convention (recorded in CLAUDE.md) applies to
`docs/kits/`. The `src/kits/` folders were renamed too, but not to matching
names: `src/kits/wi-fi-bot/` vs `docs/kits/wifi-bot/` (hyphen differs).
Decide whether `src/` should match `docs/` exactly, and if so whether to
rename the folder or just leave a note explaining the mismatch.

(Previously this item also noted `src/kits/line-follower-bot/` was empty —
it's now populated with a full set of scripts and a `config.py`, ported over
from a sibling repo during the 2026-08-12 config-standardization session
below, so that part is resolved.)

## Ultrasonic Bot overlaps with base-bot's ping lab

`kits/ultrasonic-bot/index.md` is mostly a stub linking to an external site
(I added an "Uploading the Code" section pointing at the new
`src/kits/ultrasonic-bot/upload-code.sh`, but left the rest alone — see
below). The real local content for ultrasonic/ping sensing already lives in
`kits/ultrasonic-bot/11-ping-lab.md` (moved there from `base-bot/` since this
item was first written, and its broken photos are now fixed — see above —
but it's still orphaned from the nav, see above). Decide whether Ultrasonic
Bot's `index.md` should absorb/link to `11-ping-lab.md` directly, or whether
it needs its own separate walkthrough content.

## "Base Bot with 8-Element NeoPixel" has no page

The section in [kits/index.md](kits/index.md) describes a Base Bot variant
with an 8-element NeoPixel strip but, unlike every other section, has no
`[Kit Name](link)` at the end — there's no page for it. Either it should
link somewhere (maybe this is what Rainbow Bot became?) or the section
should be removed if it was never actually built as a separate kit.

## Line Follower steering logic — verify on the bench

I fixed a real bug in `25-line-follower.md` where the turn and forward
actions could both fire in the same loop iteration (missing `elif`), and
corrected a print statement that said "turning left" while calling the
`right()` function. I could not verify on real hardware that turning right
is in fact the correct response when the right sensor reads white — please
confirm on the bench before trusting it in front of a class.

---

# From the `src/kits/` config.py standardization session (2026-08-12)

A follow-up session gave every kit under `src/kits/*-bot/` (plus
`line-follower-bot/`) a standardized `config.py`, an `upload-code.sh`, and a
`README.md` — see [`logs/kit-cleanup-tasks.md`](../logs/kit-cleanup-tasks.md)
for the full write-up. That work surfaced a few more open items.

## Docs don't mention the new upload workflow yet — RESOLVED 2026-08-12

Added an "Uploading the Code" section (matching the `imu-mpu6050` wording —
`./upload-code.sh`, plus the `mpremote ... run` pattern for a single script)
to all 7 remaining kit `index.md` pages: `base-bot`, `display-bot`,
`rainbow-bot`, `ultrasonic-bot`, `wifi-bot`, `wifi-display-bot`,
`line-follower-bot`. For the two Wi-Fi kits, the section also notes that
`upload-code.sh` pushes `secrets.py` as-is, so edit it with real credentials
first.

## Stale pre-rename `src/kits/` paths in docs — RESOLVED 2026-08-12

These predated the `-bot` rename and were missed by the earlier stale-link
cleanup — all fixed:

- [`kits/wifi-bot/index.md`](kits/wifi-bot/index.md) linked to
  `src/kits/base`, now `src/kits/base-bot`.
- [`kits/swarm-bot/plan.md`](kits/swarm-bot/plan.md) referenced
  `src/kits/base/` and `src/kits/wi-fi/` in four places, now
  `src/kits/base-bot/` and `src/kits/wi-fi-bot/`.
- Also found by the same sweep: [`faq.md`](faq.md) linked to
  `kits/base/09-i2c-scanner-test.md` (a docs-internal link, not a
  source-code path), now `kits/base-bot/09-i2c-scanner-test.md`.

A `mkdocs build --strict` pass confirms these were the only ones — no
remaining un-suffixed `kits/base/` or `src/kits/base/`-style references
anywhere in `docs/`.

## Hardware pin corrections need a bench check

Two kits had pin values corrected this session by reasoning from code/docs,
not by testing on physical hardware:

- **`ultrasonic-bot`**: `stop-motors.py` and `test-drive-all.py` previously
  hardcoded motor pins that disagreed with `main.py`; `display-logo-ping.py`
  used different HC-SR04 trigger/echo pins than `main.py`. All three were
  changed to match `main.py` (treated as canonical since it's what
  MicroPython boots, and it matches the `11-ping-lab.md` doc page). Please
  verify on the bench that this is actually correct for your wiring.
- **`wifi-display-bot`**: this kit never had a `config.py`, and its motor,
  NeoPixel, and speaker pins were never hardcoded anywhere in its existing
  code either — the new `config.py` values (motors on GP8-GP11, NeoPixel on
  GP18, speaker on GP22) are inferred from the same layout used by
  `base-bot`/`display-bot`/`wi-fi-bot`, not confirmed against this kit's own
  hardware. Please verify before trusting it in front of a class.

## Missing `import machine` bug — RESOLVED 2026-08-12, wider than first thought

The originally-flagged `display-bot` bug (`display-dist-chart.py`,
`display-face.py`, `main.py`, `tof-range-display-test.py` — all did
`from machine import Pin` but then called `machine.Pin(...)` /
`machine.I2C(...)` elsewhere without a plain `import machine`, which should
raise `NameError` on real hardware) is fixed.

A repo-wide sweep for the same pattern turned up **10 more instances**,
all fixed the same way (just adding `import machine`):
`rainbow-bot/collision-avoidance-config.py`,
`rainbow-bot/20-tof-test-config.py`,
`wifi-display-bot/18-display-hello-world.py`,
`wifi-display-bot/20-display-wifi.py`,
`wifi-display-bot/19-display-hello-world-config.py`,
`ultrasonic-bot/display-logo-ping.py`, `ultrasonic-bot/main.py`,
`ultrasonic-bot/test-drive-all.py`, `base-bot/50-collision-avoidance-tof.py`,
`base-bot/main.py`.

The same sweep also found this bug in `src/kits/8-pixel/` (6 files) —
**deliberately left alone**: that folder has zero references anywhere in
`docs/` or `mkdocs.yml`, so it looks like unpublished/legacy code tied up in
the still-open "Rainbow Bot has no real lab content" and "'Base Bot with
8-Element NeoPixel' has no page" decisions above. Fixing bugs in code that
might get deleted felt like the wrong kind of "helpful," so it's called out
here instead.
