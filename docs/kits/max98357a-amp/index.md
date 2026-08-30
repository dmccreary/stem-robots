# The MAX98357A I2S Amplifier

The MAX98357A I2S Amplifier is a mono amplifier with an input
voltage of 2.5 to 5.5 volts and a default gain of 9dB.

It is designed to be used with 4-8 ohm speakers and it is rated at 3W.

## Pico Connections

- BCLK connect to GPIO 2
- LRC connect to GPIO 3
- DIN connect to GPIO 4
- GAIN connect to GPIO 5
- SD connect to GPIO 6
- GND connect to GND
- VIN connected to the VBUS at 5v - **not** the Pico's 3V3 OUT pin. The
  onboard 3.3V regulator only supplies a few hundred mA shared with the
  rest of the board; on 3V3 this amp browned out and audio cut off after
  about 1.2 seconds of playback.

This pin choice satisfies one hard constraint and one board-specific
caution:

1. MicroPython's `machine.I2S` driver on the RP2040 requires the `ws`
   (LRC) pin to be exactly one GPIO number higher than the `sck` (BCLK)
   pin.
2. If this kit is later run on a **Cytron Maker Pi RP2040** instead of a
   plain Pico, GPIO 8-11 are hardwired to that board's onboard DC motor
   driver and GPIO 12-15 to its onboard servo headers (see the
   [MAKER-PI-RP2040 datasheet](https://www.mouser.com/pdfDocs/MAKER-PI-RP2040Datasheet.pdf)),
   so those pins aren't safe to reuse for I2S there. GPIO 2-6 are free
   Grove-port pins on that board too, so this wiring works on either.

GPIO 2-6 is not the *only* pin group that works on a plain Pico, though -
GPIO 11-15 (BCLK=11, LRC=12, DIN=13, GAIN=14, SD=15) works fine there too.
It initially looked broken (clean I2S execution, but no sound on two
separate Pico boards), which led to real doubt about whether those pins
were somehow bad. That turned out to be a testing artifact, not a pin
problem: a very short audio clip (~0.44s) played with almost no delay
after enabling the amp, likely swallowed by the amp's own brief power-on
mute. Adding a ~200ms delay after enabling the amp (before sending real
audio) resolved it - see `SETTLE_MS` in the kit's scripts. The lesson:
always test a new pin group with a clip of at least a second or two and a
short settle delay, not the shortest file available, or you can easily
mistake a playback-timing artifact for a wiring/pin fault.