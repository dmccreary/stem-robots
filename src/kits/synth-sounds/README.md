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
| Amplifier + speaker | PAM8403 module, speaker, 1k resistor, 33 nF and 10 uF capacitors | Loud, full, and has a volume knob on the amp board. |

## Wiring

| Signal | Pico pin | Notes |
|---|---|---|
| Audio out | GP0 | Through the filter below, into the amp's L input |
| Button | GP16 | Other leg to GND; internal pull-up, so pressed reads 0 |
| Volume knob (optional) | GP26 | ADC0; outer legs to 3V3 and GND. Set `USE_VOLUME_KNOB = True` |
| Amp power | VBUS (5V) and GND | **Not 3V3 OUT** - an amplifier under load browns out the Pico's regulator |

The filter between the Pico and the amplifier:

```
GP0 ---[ 1k ohm ]---+---[ 10 uF ]---> PAM8403 L input
                    |
                [ 33 nF ]
                    |
                   GND
```

The 1k resistor and 33 nF capacitor smooth off the square edges of the PWM
signal, starting at about 4.8 kHz. The 10 uF capacitor blocks the steady
voltage so only the sound reaches the amp.

Start with the amplifier's own volume knob near minimum. The Pico's 3.3 V
output is hotter than the line level these modules expect, so turning it up
from quiet is kinder than the other way round.

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
