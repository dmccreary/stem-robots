# Session Log: MAX98357A Amp Kit — I2S Audio, GC9A01 Display, Button, and Pot Volume Lab

**Date:** 2026-08-29
**Repository:** stem-robots
**Branch:** main
**Hardware:** Plain Raspberry Pi Pico (RP2040, MicroPython v1.28.0, no Cytron
Maker Pi RP2040 board involved) + MAX98357A I2S class-D amplifier + a small
4-8Ω speaker + a round 240x240 GC9A01 SPI display + a momentary push button +
a 20K linear potentiometer, all on one breadboard. Every finding below was
confirmed by actually running code on this real hardware over `mpremote`
(and, for parts of the session, Thonny) — not just written and assumed
correct.

## Overview

Started from a one-line request ("test the new MAX98357A amp with a sine
wave") and grew, over one long session, into a small interactive lab in
[`src/kits/max98357a-amp/`](../src/kits/max98357a-amp/): tone tests, a
button-triggered R2D2 sound board, a round color display, a potentiometer
driving a live volume-gauge dial, and a combined "press button to hear a
sound, turn the knob to set the volume, watch the dial and the name on the
display" demo. Several real, non-obvious bugs were chased and fixed along
the way — most of the value of this log is in **why things failed**, not
just what the final code looks like.

---

## Key findings for future projects using this device

These are the things worth knowing *before* starting a new I2S/GC9A01/ADC
project on RP2040, distilled from the mistakes made in this session:

1. **RP2040 I2S pin constraint**: MicroPython's `machine.I2S` on the rp2 port
   requires `ws` (word select / LRC) to be **exactly `sck` (bit clock/BCLK) +
   1**. Any other pairing raises `ValueError: invalid ws (must be sck+1)` at
   `I2S()` construction. This is enforced in the driver source
   (`ports/rp2/machine_i2s.c`), not just documentation.

2. **Power the amp from VBUS, never the Pico's 3V3 OUT pin.** The onboard
   3.3V regulator only supplies a few hundred mA shared with the whole
   board. On 3V3, this amp played audio for about 1.2 seconds and then
   browned out. VBUS (5V, close to raw USB power) has the headroom a 3W
   class-D amp actually needs.

3. **A short audio buffer written in a tight loop causes audible static.**
   The first tone tests used a single-sine-cycle buffer (tens of bytes) and
   wrote it in a Python `while` loop — this produced a clear tone with
   audible static/crackle layered on top, almost certainly from buffer
   underruns between writes. Streaming in much larger chunks (4096 bytes)
   fixed it completely. Rule of thumb: don't write buffers smaller than a
   few KB to `machine.I2S` in a loop.

4. **The amp needs a moment after `SD` goes HIGH before it can pass real
   audio through — this cost most of a debugging session.** GPIO11-15 on a
   plain Pico *looked* completely broken: clean `machine.I2S` init, no
   exceptions, `write()` never errored, and yet **total silence**,
   reproduced across two separate physical Pico boards. Extensive
   investigation (including a wrong initial theory blaming a Cytron Maker
   Pi RP2040's onboard motor/servo pin reservations, ruled out once the
   user confirmed the board in use was a plain, green Raspberry Pi Pico)
   eventually isolated the real cause: the failing test played the
   *shortest* clip (~0.44s) almost immediately after driving `SD` HIGH.
   The MAX98357A likely mutes output briefly after coming out of shutdown
   to suppress power-on pop, and that short a clip, played that soon, can
   be entirely swallowed by the mute window. Adding a `SETTLE_MS = 200`
   delay after enabling the amp — and testing with a longer clip — fixed
   it immediately. **GPIO11-15 was never actually broken.** Lesson: when
   bringing up a new pin group for this amp, always test with a clip of at
   least 1-2 seconds and a real settle delay, or a working pin can look
   exactly like a dead one.

5. **WAV files can carry extra chunks before `data` — don't assume a fixed
   44-byte header.** The R2D2 sample clips have a `LIST`/`INFO` metadata
   chunk (genre, software tag) between `fmt ` and `data`. A proper RIFF
   chunk walker that reads chunk IDs/sizes and skips unknown ones (with
   word-alignment padding) is required; a fixed-offset read pulls garbage.
   See `find_data_chunk()` in `03-play-sounds-on-button.py`.

6. **The GC9A01 driver's `line()`/`pixel()` are slow — use `fill_rect()`
   for anything with many points.** `line()` calls `pixel()` in a loop, and
   every `pixel()` call re-sends a full SPI window-set sequence (column
   address + row address + memory-write command) just to send one pixel's 2
   bytes. `fill_rect()` (and `vline()`/`hline()`, which are thin wrappers
   around it) sets the SPI window **once** and streams every pixel in a
   batch. For a gauge/dial made of many short radial "spokes," computing
   each spoke's axis-aligned bounding box and calling `fill_rect()` on it
   instead of `line()` cut SPI transactions by roughly 10x and was the
   difference between a visibly laggy dial and an instant one. Combine
   this with redrawing only the pixels that changed since the last frame
   (not the whole shape every update) for a live/animated gauge.

7. **The MAX98357A's `GAIN` pin cannot do continuous/software volume
   control** — it only selects one of about five fixed dB steps via
   voltage thresholds (floating ≈9dB default, tied to GND/VDD directly or
   through a 100K resistor gives the other four). Real, smoothly variable
   volume has to happen in software: scale each 16-bit PCM sample by a
   0.0-1.0 factor before writing it to I2S.

8. **MicroPython gotcha: `array.array('h', a_memoryview_slice)` silently
   does the wrong thing.** Confirmed directly on this Pico's MicroPython
   build (v1.28.0, rp2 port):
   ```python
   buf = struct.pack('<5h', 100, -200, 300, -32768, 32767)
   list(array('h', buf))                 # [100, -200, 300, -32768, 32767]  correct
   list(array('h', memoryview(buf)))     # [100, 0, 56, 255, 44, 1, 0, 128, 255, 127]  WRONG
   list(array('h', bytearray(buf)))      # [100, -200, 300, -32768, 32767]  correct
   ```
   Passing a `bytes` or `bytearray` object reinterprets the raw memory as
   16-bit samples (correct). Passing a `memoryview` **silently iterates it
   byte-by-byte instead**, producing twice as many tiny, scrambled
   "samples" with no error raised. This was the actual root cause of
   "volume control makes the sound very quiet and sounds like AM radio
   static" in `07-play-sounds-with-volume.py` — two other theories (a
   linear-vs-perceptual volume taper, then I2S buffer underrun from too
   much per-chunk processing) were chased and partially "fixed" first
   before the real bug was found by testing the array constructor directly
   on-device. **Takeaway: build typed arrays from the underlying
   bytes/bytearray buffer, never from a memoryview slice of it**, even
   though a memoryview is exactly the right type to hand to
   `f.readinto()`.

9. **Human hearing is logarithmic; a plain linear pot reading is not a good
   volume curve.** Scaling samples directly by `pot_reading/65535` makes
   most of the knob's rotation feel like almost no change, with volume only
   ramping up near the very top. A cheap `sqrt()` of the linear 0.0-1.0
   reading gives a much more even-feeling response across the pot's full
   range. (Note: this was diagnosed as *a* contributing factor before the
   memoryview bug above was found to be the dominant one — both fixes are
   in the final code.)

10. **Reading the ADC and touching the display on every single audio chunk
    can starve the I2S buffer.** Once real per-chunk work (volume scaling,
    gauge redraws) was added to the playback loop, it's important to
    throttle the "expensive" operations (ADC read + display update, done at
    most a few times a second) separately from the "cheap" operation that
    must happen every chunk (writing the next buffer to I2S). Also worth
    giving the I2S peripheral a larger `ibuf` (16384 vs. the plain
    playback scripts' 8192) when a script does real work between writes.

---

## Session narrative

### 1. Basic sine wave test, and the `ws = sck+1` pin swap

The kit's original doc wiring (`LRC→GPIO11, BCLK→GPIO12`) violated the
`ws=sck+1` rule discovered via the MicroPython source and quickreference
docs. The user swapped the physical wires (`BCLK→GPIO11, LRC→GPIO12`)
before ever running the "wrong" config, so the constraint violation was
never actually tested on hardware — only the corrected wiring was.
[`01-sine-wave-test.py`](../src/kits/max98357a-amp/01-sine-wave-test.py)
ran cleanly and produced a real, audible tone. Verified over `mpremote` on
a live Pico at `/dev/cu.usbmodem14401` (the port number changed several
times across the session as USB was reconnected/moved between machines).

### 2. The GPIO11-15 silence mystery (see finding #4 above)

Two more Pico boards, both wired to `BCLK=11, LRC=12, DIN=13, GAIN=14,
SD=15`, produced clean execution and total silence. A detour chased a
theory that the *real* board in use was a Cytron Maker Pi RP2040 (whose
datasheet confirms GP8-11/GP12-15 are hardwired to an onboard motor driver
and servo headers) — the user firmly corrected this: **plain green
Raspberry Pi Pico, confirmed by board color and lack of Grove
connectors/motor terminals.** That ruled out the Cytron explanation
entirely and left the mystery genuinely open for a long stretch, until the
short-clip/no-settle-delay cause (finding #4) was isolated by systematic
elimination: an isolated button-only test (no crash), an isolated
single-file-playback test with no button (no crash, but also
unconfirmed-heard), then finally comparing the *working* button-driven
script's timing/clip-length against the *failing* isolated test — which is
what surfaced the real cause.

### 3. Power: VBUS vs. 3V3 OUT (see finding #2)

Confirmed by direct test: on 3V3, audio started and cut off after ~1.2s.
Switched back to VBUS. Documented in `index.md` and every script's header
comment as **"VIN → VBUS, not 3V3 OUT."**

### 4. `config.py` centralization

Once the pin experiments above were underway, all amp/button pins were
pulled into a single [`config.py`](../src/kits/max98357a-amp/config.py) so
a pin swap only needs one edit, and every numbered script imports from it.
This directly enabled the systematic pin-group testing in finding #4.

### 5. R2D2 sound board (`03-play-sounds-on-button.py`)

Button on a GPIO with `PULL_UP` (idle HIGH, pressed LOW), debounced with a
20ms re-check. WAV files (17 short R2D2 clips, mono/16-bit/8000Hz) are
streamed via a proper RIFF chunk parser (finding #5) in 4096-byte chunks
(finding #3). Originally picked a random clip per press; later changed to
**cycle through the sorted file list in order, wrapping at the end**, so a
student hears the whole set with no repeats before anything plays twice —
better for a classroom demo than random repeats.

### 6. GC9A01 round display bring-up

Added a 240x240 round SPI display, reusing the exact wiring and driver
(`lib/gc9a01.py`, MIT-licensed) from the sibling `robot-faces` repo's
smartwatch kit for consistency: `SCK=GPIO2, MOSI=GPIO3, DC=GPIO4, CS=GPIO5,
RST=GPIO6`. This required first moving the amp's own pins off GPIO2-6 (to
`BCLK=10, LRC=11, DIN=12, GAIN=13, SD=14`) to free that range.
[`05-display-hello-world.py`](../src/kits/max98357a-amp/05-display-hello-world.py)
confirmed the display and font (`lib/vga1_8x16.py`) work.

### 7. Potentiometer + fast gauge dial (see finding #6)

A 20K pot's wiper on GPIO26 (`ADC0` — GPIO26-29 are the Pico's only
ADC-capable pins) drives a blue ring gauge around the display's edge in
[`06-pot-gauge-test.py`](../src/kits/max98357a-amp/06-pot-gauge-test.py).
The first version redrew the entire 360° ring every poll using `line()`
and was visibly laggy (~1800 SPI transactions/update). Two rounds of
optimization: (1) redraw only the ring segments ("spokes") that changed
since the last reading, and (2) switch each spoke's draw from `line()` to
a single `fill_rect()` on its bounding box. The combination made the dial
feel instant.

### 8. Volume control (see findings #7-10)

[`07-play-sounds-with-volume.py`](../src/kits/max98357a-amp/07-play-sounds-with-volume.py)
combines the button-triggered player with the pot: the pot's reading (via
a `sqrt()` perceptual curve) scales every 16-bit sample before it's
written to I2S, and the same value drives the gauge ring live, both while
idle and mid-playback. Getting clean audio out of this required finding
and fixing the `array('h', memoryview)` bug (finding #8) — two other
theories were investigated and partially addressed first (a suspected
linear/perceptual volume mismatch, then a suspected I2S buffer underrun
from doing too much per-chunk work), before a direct on-device test of the
array constructor exposed the actual cause.

### 9. Display polish: Title Case names and a readable, persistent label

[`sounds/metadata.json`](../sounds/metadata.json) maps each filename to a
Title Case display name (e.g. `"r2d2-unsure.wav" → "R2D2 Unsure"`), loaded
via `config.load_sound_titles()` and used in both console output and the
on-screen label. The display was also changed from a single line that
reset to "Ready" the instant a clip finished (too fast to read a 1-3
second clip's name) to **two persistent lines**: the last sound played
stays on screen indefinitely, with a static "Ready" status line drawn
underneath it.

### 10. Making the kit self-contained

The R2D2 `.wav` files originally lived in a separate `robot-media` repo
checkout, referenced by an absolute path containing the developer's home
directory. Both problems (external dependency, hardcoded personal path)
were fixed by copying the files into this repo at
[`sounds/`](../sounds/) (repo root, alongside `docs/`, `src/`, `slides/`)
and having `upload-code.sh` compute `PROJECT_HOME` as three directories up
from its own location, then read `$PROJECT_HOME/sounds` — no absolute path,
no external checkout required for anyone who clones `stem-robots`.

---

## Final pin map

| Signal | GPIO | Notes |
|---|---|---|
| Amp BCLK (bit clock) | 10 | `I2S(sck=...)` |
| Amp LRC (word select) | 11 | must be `BCLK + 1` |
| Amp DIN (audio data) | 12 | `I2S(sd=...)` |
| Amp GAIN | 13 | left as `Pin.IN` (floating) = default 9dB |
| Amp SD (shutdown) | 14 | driven HIGH to enable |
| Push button | 15 | `Pin.IN, Pin.PULL_UP`; other leg → GND |
| Display SCK/CLK | 2 | SPI0 |
| Display MOSI/SDA | 3 | SPI0 |
| Display DC | 4 | |
| Display CS | 5 | |
| Display RST | 6 | |
| Potentiometer wiper | 26 | `ADC0` — outer legs → 3V3 and GND |

All confirmed working on a **plain Raspberry Pi Pico**. GPIO8-15/18/20-22
are known to be hardwired to onboard peripherals on a **Cytron Maker Pi
RP2040** instead (see finding above) and have not been tested on that
board with this kit at all — see
[`TODO.md`](../src/kits/max98357a-amp/TODO.md) for the pin tests still
worth running there.

## The interactive lab: how the button, pot, and display work together

`07-play-sounds-with-volume.py` is the kit's flagship demo, combining all
four peripherals into one small interactive lab:

- **Button (digital input)** — cycles through the sound library in order
  each press, so a student can explore every sample sound with no repeats.
  Demonstrates debounced digital input and simple state (an index that
  wraps around).
- **Potentiometer (analog input)** — a continuous knob read via the Pico's
  ADC, mapped through a perceptual (square-root) curve, and used to scale
  the actual audio sample data in software in real time. Demonstrates
  analog input, the difference between a linear sensor reading and
  perceived/human-scaled output, and that not every kind of "control" (like
  volume) can be done with a simple digital pin — some things genuinely
  require signal processing.
- **Round color display (SPI output)** — shows two things simultaneously
  and persistently: the *name* of the last sound played (readable Title
  Case, not a raw filename) and a live *gauge ring* that visually tracks
  the pot's position/volume in real time, updating smoothly even while
  audio is streaming. Demonstrates SPI displays, why naive per-pixel
  drawing is too slow for live animation, and how to batch drawing calls
  for responsiveness.
- **I2S audio output** — the actual payoff the other three peripherals are
  in service of: a student turns the knob (sees the dial move, hears the
  volume change) and presses the button (sees the name change, hears a new
  sound), with all three - button, knob, and screen - responding to and
  agreeing with each other in real time.

Together this is a small, self-contained lab in closing the loop between
an **input** (button or pot), **processing** (which sound, what volume),
and **two independent outputs that must stay in sync** (the speaker and
the display) — a pattern any more advanced robotics project (a "robot with
moods," a status display, a UI on a physical build) will need.

## File inventory (`src/kits/max98357a-amp/`)

- `config.py` — every pin assignment (amp/button/display/pot), display
  init helper, sound-metadata loader
- `00-button-only-test.py` — isolates the button from all I2S/display code
- `01-sine-wave-test.py` / `02-sine-wave-test-stereo.py` — tone generation,
  MONO vs STEREO I2S format
- `03-play-sounds-on-button.py` — button-triggered sequential sound player
- `04-play-one-file-test.py` — isolates file-streaming playback from the
  button; also where the settle-delay fix was proven
- `05-display-hello-world.py` — first GC9A01 display bring-up
- `06-pot-gauge-test.py` — pot-driven gauge ring, the `fill_rect()` speed
  fix
- `07-play-sounds-with-volume.py` — the combined interactive lab
- `TODO.md` — pin tests still worth running (including on a Cytron Maker
  Pi RP2040)
- `lib/gc9a01.py`, `lib/vga1_8x16.py` — display driver and font (MIT,
  from the `robot-faces` repo's smartwatch kit)
- `upload-code.sh` — pushes everything (config, scripts, lib/, and
  `$PROJECT_HOME/sounds`) to the device over `mpremote`
- `../../../sounds/` (repo root) — the 17 R2D2 `.wav` clips plus
  `metadata.json` (Title Case display names)
