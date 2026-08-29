# TODO: confirm which GPIO pins the MAX98357A amp can run on

Currently documented/working pins (bare Raspberry Pi Pico only):
BCLK=GPIO2, LRC=GPIO3, DIN=GPIO4, GAIN=GPIO5, SD=GPIO6.

This pin choice was never fully explained - GPIO11-15 (BCLK=11, LRC=12,
DIN=13, GAIN=14, SD=15) produced total silence on two separate bare Pico
boards with no software error, and moving to GPIO2-6 fixed it, but we
never confirmed *why* GPIO11-15 failed on hardware with no onboard
peripherals on those pins. The tests below are meant to close that gap
and build a real map of which pins work, not just one pin set that
happens to work.

## 1. Re-test the original failing pins (isolate wiring vs. hardware/software)

- [ ] Re-wire BCLK=11, LRC=12, DIN=13, GAIN=14, SD=15 very carefully
      (double/triple-check each jumper against the Pico pinout diagram,
      not by counting header holes) and re-run `01-sine-wave-test.py`.
- [ ] If it now works: the original failure was a wiring mistake, not a
      pin problem - document that conclusion and stop worrying about
      GPIO11-15 on a bare Pico.
- [ ] If it still fails silently: try swapping only DIN to a known-good
      pin (e.g. GPIO4) while keeping BCLK=11/LRC=12, to isolate whether
      the clock pair or the data pin is the actual problem.

## 2. Test on the Cytron Maker Pi RP2040 (this project's primary board)

Everything so far has been tested on a bare Pico. This kit is meant to
eventually run on the Cytron Maker Pi RP2040 per the project's primary
platform (see repo CLAUDE.md), which has NOT been tested at all yet.

- [ ] Run `01-sine-wave-test.py` unmodified (GPIO2-6) on a Cytron Maker Pi
      RP2040 and confirm it still produces clean audio there.
- [ ] Deliberately wire to GPIO8-11 (BCLK=8, LRC=9 - note this breaks the
      ws=sck+1 rule as-is, so pick an in-range pair like BCLK=10,LRC=11)
      and GPIO12-15 for DIN/GAIN/SD, run the test, and confirm it fails
      or degrades - this would be the first *empirical* confirmation
      that the Cytron board's onboard motor driver/servo headers really
      do interfere with I2S signals there (currently this is only a
      datasheet-based prediction, never actually tested).
- [ ] Run `03-play-sounds-on-button.py` on the Cytron board with the
      button on GPIO15 - GPIO15 is a servo header pin on that board, so
      confirm whether the button still reads correctly there or needs to
      move to a Grove-port pin.

## 3. Build a broader known-good pin map (bare Pico)

Only GPIO2-6 has been confirmed. Test at least one more free Grove-port
pin group to confirm the fix generalizes and isn't specific to GPIO2-6:

- [ ] BCLK=16, LRC=17, DIN=18 (or another free pin), GAIN/SD on any other
      free pins - run `01-sine-wave-test.py` with these pins temporarily
      edited in.
- [ ] BCLK=26, LRC=27, DIN=28, GAIN/SD elsewhere - same test.
- [ ] Confirm GAIN and SD do NOT need to be adjacent to BCLK/LRC/DIN -
      e.g. leave BCLK/LRC/DIN on GPIO2-4 but move GAIN/SD to two
      far-away free pins (like GPIO16/17) and confirm audio is
      unaffected. This would confirm only sck/ws/sd are timing-critical
      and GAIN/SD are just static control lines that can go anywhere.

## 4. Confirm the ws = sck + 1 failure mode precisely

- [ ] Deliberately set ws = sck - 1 (the original broken config) and
      capture the exact exception text `machine.I2S()` raises, so it's
      documented here instead of just "it doesn't work."
- [ ] Try ws = sck + 2 or some other non-adjacent pin and confirm it also
      raises rather than silently misbehaving.

## 5. Pins with ambiguous/undocumented roles

GPIO19, 23, 24, 25, and 29 have no listed function in the Cytron
datasheet's Grove/motor/servo/LED table, but 23/24/25/29 likely carry the
RP2040 reference-design special roles (SMPS mode, VBUS sense, onboard
LED, VSYS/3 ADC monitor) - unverified for this board specifically.

- [ ] Test GPIO19 as a spare digital pin (e.g. for GAIN or SD) on both
      bare Pico and Cytron board - should be safe on both, confirm it.
- [ ] Only if pin real estate ever gets tight: test whether GPIO23-25/29
      actually cause a problem when used as plain GPIO, or whether that
      concern is purely theoretical on this board.

## Not pin-related, but still open from this session

- [ ] The one-time USB disconnect seen during `03-play-sounds-on-button.py`
      testing was never reproduced again and its cause is unconfirmed.
      Worth a stress test (many rapid button presses back-to-back) to see
      if it's reproducible before assuming it was a one-off cable/USB
      glitch.
- [ ] Decide whether to keep, delete, or fold into docs the pure-debugging
      scripts `00-button-only-test.py` and `04-play-one-file-test.py`.
