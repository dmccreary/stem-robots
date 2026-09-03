# Synth Sounds Kit

R2-D2 style robot sounds from a Raspberry Pi Pico with **no audio chip**.
One GPIO pin, a resistor, a capacitor, and a small class-D amplifier board
replace the MAX98357A I2S DAC, dropping the audio cost of a robot kit from
roughly the price of the controller board to roughly the price of a resistor.

The sounds are not recordings. Each one is a short list of pitch-and-volume
glides measured from the `.wav` files in this repo's `sounds/` folder and
replayed by switching a single pin on and off. All 16 sounds together use
about 50 kB of the Pico's 264 kB of RAM and no flash storage for audio.

## Why this exists

A teacher pointed out that a $10 I2S amplifier is hard to justify in a kit
whose controller board costs $12. This kit trades audio fidelity for cost:
you lose the clean sample playback of the MAX98357A, and you keep the
pitch glides, the volume envelopes, and the rhythm - which is where the
personality of the sounds actually lives.

There are two ways to build it:

| Build | Extra parts | Notes |
|---|---|---|
| Cytron onboard piezo | none | Set `AUDIO_PIN = 22` in `config.py`. Thin and quiet, but free. |
| Amplifier + speaker | XPT8871 module, speaker, 1 kΩ and 100 Ω resistors, 470 nF and 10 µF capacitors | Loud and full. Volume is set in software. |

The reference amplifier is a small **XPT8871 mono module** running from 5 V.
These modules have **no volume potentiometer** and run at a high fixed gain,
which is what makes the input divider below mandatory rather than optional. A
PAM8403 or any other small analog module works too - the Pico only ever
produces an ordinary audio signal.

## Wiring

| Signal | Pico pin | Notes |
|---|---|---|
| Audio out | GP0 | Through the divider and filter below, into the amp's IN |
| Button | GP16 | Other leg to GND; internal pull-up, so pressed reads 0 |
| Volume knob (optional) | GP26 | ADC0; outer legs to 3V3 and GND. Set `USE_VOLUME_KNOB = True` |
| Amp power | VBUS (5V) and GND | **Not 3V3 OUT** - an amplifier under load browns out the Pico's regulator |

![A Pico PWM pin feeds a 1 kilohm series resistor to a node with a 100 ohm resistor and a 470 nF capacitor to ground, then a 10 uF capacitor into the IN pin of an XPT8871 module powered from 5 V, whose two bridge-tied outputs drive a floating loudspeaker](../../../docs/kits/synth-sounds/synth-sounds-input-filter.svg)

*The divider drops the Pico's 3.3 V swing to about 0.30 V p-p, and the filter
rounds off the square edges near 3.7 kHz. The speaker floats across both
outputs, grounded at neither.*

### Why the divider is not optional

The Pico's pin swings a full 3.3 V. These modules expect a line-level input
of roughly 0.2-0.3 V and amplify whatever they get by a fixed factor of about
twenty. Feed one a raw logic swing and it clips against its supply rails on
most of the waveform, which you hear as a harsh, hissy buzz layered over the
sound. R1 and R2 divide that swing by eleven, down to about 0.30 V p-p.

**If you change R1 or R2, C1 must change with them.** The filter's corner is
set by the resistors in parallel, not by R1 alone: 1 kΩ ∥ 100 Ω is only 91 Ω,
so it takes 470 nF to corner at 3.7 kHz. Keeping the old 33 nF here would put
the corner at 53 kHz and remove the filter entirely.

If you would rather use smaller capacitors, 10 kΩ and 680 Ω with 68 nF lands
at the same corner and a slightly quieter 0.21 V.

Still buzzy? Add a second identical stage - another 1 kΩ in series followed by
another 470 nF to ground - for a steeper 12 dB per octave roll-off.

### Do not ground either speaker terminal

The XPT8871's speaker output is **bridge-tied (BTL)**. Both speaker terminals
swing, and neither one sits at ground.

- Wire the speaker **across the two output terminals only**, and to nothing else.
- Never connect either speaker terminal to GND. That shorts half the bridge
  and can destroy the amplifier chip.
- For the same reason, never clip a grounded oscilloscope probe onto a
  speaker terminal. To look at the output, probe differentially or not at all.

### Two more things that bite

**Volume lives in software.** There is no knob on the amplifier, so
`r2d2.set_volume()` and `FIXED_VOLUME` in `config.py` are the only controls.
For the best signal-to-noise ratio, keep the software volume high and pick
the speaker level with the divider ratio instead.

**Watch the current on VBUS.** A few watts into a 4 ohm speaker can pull well
over an amp on peaks, while USB VBUS gives you roughly 500 mA. If the Pico
resets or the sound stutters only on loud passages, that is a brownout, not a
software fault - turn the volume down, or give the amplifier its own 5 V
supply with the grounds tied together.

**You do not need extra supply capacitors.** These modules already carry a
220 µF bulk capacitor and ceramics next to the 5 V pins.

All pin numbers live in `config.py` - change them there, not in the lessons.

## Files

| File | Purpose |
|---|---|
| `config.py` | Pin assignments and synth settings for the whole kit |
| `r2d2.py` | The synth engine: `tone()`, `glide()`, `play()`, `set_volume()` |
| `sounds.py` | The 16 measured sound recipes. Auto-generated - see below |
| `00-button-only-test.py` | Check the button with no audio code running at all |
| `01-first-beep.py` | One pin, three notes: how a GPIO pin makes sound |
| `02-pitch-glide.py` | Sliding pitch, and why it sounds like a robot |
| `03-volume-and-envelope.py` | Duty cycle as volume; shaping a sound over time |
| `04-play-a-recipe.py` | Play all 16 measured sounds in order |
| `05-button-jukebox.py` | Capstone: button steps through the sounds |
| `main.py` | Copy of lesson 05, so the kit runs on power-up with no computer |
| `upload-code.sh` | Copy everything onto the Pico with `mpremote` |
| `tools/` | Laptop-side tools. Not uploaded to the Pico |

The wiring diagram above is generated by
`docs/kits/synth-sounds/synth-sounds-input-filter.py` (Schemdraw). Re-render
it after any change to the circuit:

```bash
cd ../../../docs/kits/synth-sounds && MPLBACKEND=Agg python3 synth-sounds-input-filter.py synth-sounds-input-filter.svg
```

## Recipes

A sound is a list of segments, each five numbers:

```python
(duration_ms, freq_start, freq_end, volume_start, volume_end)
```

Pitch glides in a straight line from `freq_start` to `freq_end` while volume
fades from `volume_start` to `volume_end`, both 0-100. A segment with
frequency 0 is a rest. That one format describes a chirp, a beep, a wobble,
and a pause. The whole `sad` sound is eight of them.

To add your own sound, write a list in this shape and hand it to
`r2d2.play()`. Nothing else is needed.

## Laptop tools

These run on a computer with `numpy` and `scipy`, not on the Pico.

| Tool | Purpose |
|---|---|
| `tools/extract_recipes.py` | Measures the `.wav` files in `sounds/` and writes `sounds.py` |
| `tools/render_wav.py` | Renders the recipes to `.wav` so you can hear them without hardware |
| `tools/simulate_pico.py` | Runs the real `r2d2.py` against a fake pin, to check the on-device code |

Regenerate the recipes after changing the extractor:

```bash
python3 tools/extract_recipes.py > sounds.py
```

Preview them, and build side-by-side comparisons against the originals:

```bash
python3 tools/render_wav.py
```

## Uploading

Edit `PORT` at the top of `upload-code.sh` to match your board, then:

```bash
./upload-code.sh
```

## Running

```bash
mpremote connect /dev/cu.usbmodem14401 run 01-first-beep.py
```

Work up through the numbered lessons in order. After `./upload-code.sh`,
`main.py` also runs on its own whenever the Pico is powered, so the finished
kit needs no computer attached.
