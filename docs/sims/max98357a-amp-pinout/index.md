---
title: MAX98357A Amplifier Pinout
description: Students will identify each pin and component on the MAX98357A I2S amplifier breakout board and explain what it does in the audio circuit.
image: /sims/max98357a-amp-pinout/max98357a-amp-pinout.png
og:image: /sims/max98357a-amp-pinout/max98357a-amp-pinout.png
twitter:image: /sims/max98357a-amp-pinout/max98357a-amp-pinout.png
social:
   cards: false
status: implemented
library: diagram.js
hide: toc
bloom_level: Understand (L2) — Explain the purpose of each pin on the MAX98357A amplifier board.
---

<iframe src="main.html" width="100%" height="1191" scrolling="no"></iframe>

[Run the MAX98357A Amplifier Pinout MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

This is an interactive, hover-to-explore infographic built directly on top of
a real photo of the [MAX98357A Amp Kit](../../kits/max98357a-amp/index.md)
breakout board. **Explore** mode lets you hover (or tap, on a touch screen)
over any numbered marker or label to see what that part does. **Quiz** mode
hides the labels and asks you to find each part from a visual hint instead.

**Bloom's Taxonomy level:** Understand (L2) — Explain the purpose of each pin
on the MAX98357A amplifier board.

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/max98357a-amp-pinout/main.html" width="100%" height="1191" scrolling="no"></iframe>
```

## Labeled Parts

1. **Speaker Output** — the green screw terminal that connects to a 4-8 ohm speaker
2. **MAX98357A Chip** — the black square IC that turns digital audio into amplified sound
3. **LRC** — Left-Right Clock (Word Select), connects to GPIO 12
4. **BCLK** — Bit Clock, connects to GPIO 11
5. **DIN** — Data In, connects to GPIO 13
6. **GAIN** — sets the amplifier's volume boost, connects to GPIO 14
7. **SD** — Shutdown, turns the amp on/off, connects to GPIO 15
8. **GND** — ground reference, connects to the Pico's GND
9. **Vin** — power input (2.5-5.5V), connects to the Pico's VBUS (5V), not 3V3 OUT

## Lesson Plan

**Learning objective:** Students will identify each pin and component on the
MAX98357A amplifier board and explain what it does in the audio circuit.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before hovering anything, ask students to guess what
   the green terminal and the seven bottom pins are for, just from the
   printed labels.
2. **Explore.** Have students hover every numbered marker and read each
   description and tip.
3. **Quiz.** Switch to Quiz mode and have students identify each part from
   its visual hint alone, without the printed label to rely on.
4. **Connect to wiring.** Compare the labeled pins here to the actual wiring
   table in the [MAX98357A Amp Kit](../../kits/max98357a-amp/index.md) page
   before students wire up their own board.

**Discussion questions:**

- Why does the amplifier need both a digital "data" pin (DIN) and a
  separate "clock" pin (BCLK)?
- What would happen to the sound if Vin were connected to the Pico's 3V3 OUT
  pin instead of VBUS?
- Why do LRC and BCLK need to be on specific, related GPIO numbers on the
  Pico, while GND does not?

## References

- [MAX98357A Amp Kit](../../kits/max98357a-amp/index.md)
- [Adafruit MAX98357A I2S Class-D Mono Amp datasheet](https://www.adafruit.com/product/3006)
