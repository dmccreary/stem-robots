# The MAX98357A I2S Amplifier

The MAX98357A I2S Amplifier is a mono amplifier with an input
voltage of 2.5 to 5.5 volts and a default gain of 9dB.

It is designed to be used with 4-8 ohm speakers and it is rated at 3W.

## Pico Connections

The pins are the following reading left to right from the top:

- BCLK connect to GPIO 11
- LRC connect to GPIO 12
- DIN connect to GPIO 13
- GAIN connect to GPIO 14
- SD connect to GPIO 15
- GND connect to GND
- VIN connected to the VBUS at 5v

MicroPython's `machine.I2S` driver on the RP2040 requires the `ws` (LRC)
pin to be exactly one GPIO number higher than the `sck` (BCLK) pin, so
BCLK and LRC are wired in that order here rather than left-to-right as
they appear on the board.