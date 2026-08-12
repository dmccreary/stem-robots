# Kits Cleanup — Open Items for Dan

Generated during a full inventory + cleanup pass over `docs/kits/`. Everything
mechanical (broken nav links, dead image paths that pointed at the wrong
file, duplicate files, obvious code bugs, typos) has already been fixed
directly. The items below need your input — a decision, a photo, real
hardware to verify against, or a call on scope — before they can be closed
out.

## Missing hardware photos (broken image links)

These `![]()` references point at files that don't exist anywhere in the
repo. Either supply the photo or remove the reference:

- [base-bot/11-ping-lab.md](kits/base-bot/11-ping-lab.md) → `../../img/HC-SP04P_Grove.jpg`, `../../img/Maker_Pi_RP2040-Ping.jpg`
- [base-bot/07-motor-connection-lab.md](kits/base-bot/07-motor-connection-lab.md) → `../../img/maker-pi-rp2040-motor-driver.jpg`
- [line-follower-bot/25-line-follower.md](kits/line-follower-bot/25-line-follower.md) → `../../img/ir-sensors.png`, `../../img/ir-sensor.jpeg`

## Orphaned base-bot pages — keep or cut?

Four lab pages exist under `kits/base-bot/` but are not in the `mkdocs.yml`
nav, so they're unreachable from the site (I left them out rather than
guessing your intent):

- [base-bot/08-servo-lab.md](kits/base-bot/08-servo-lab.md) — servo control lab
- [base-bot/11-ping-lab.md](kits/base-bot/11-ping-lab.md) — ultrasonic ping sensor test
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
names: `src/kits/wi-fi-bot/` vs `docs/kits/wifi-bot/` (hyphen differs), and
`src/kits/line-follower-bot/` currently exists but is empty. Decide whether
`src/` should match `docs/` exactly, and if so what should live in the empty
`line-follower-bot` source folder (right now that lab's code lives inline in
the markdown, not as separate `.py` files like other kits).

## Ultrasonic Bot overlaps with base-bot's ping lab

`kits/ultrasonic-bot/index.md` is a one-line stub linking to an external
site, while the real local content for ultrasonic/ping sensing already lives
in `kits/base-bot/11-ping-lab.md` (currently orphaned, see above). Decide
whether Ultrasonic Bot should be its own fleshed-out kit page, or whether it
should just point at (or absorb) the base-bot ping lab.

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
