# Synthesizing Robot Sounds

!!! mascot-welcome "Let's make a robot that talks back!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    R2-D2 never says a word, yet you always know how he feels. In this kit
    you will build those feelings out of one wire and a handful of numbers -
    no sound files, no audio chip, and almost no money.

## Summary

This kit makes R2-D2 style robot sounds using a single GPIO pin. There is no
audio chip and no recorded sound stored on the Pico. Instead, the Pico
switches one pin on and off very fast, and how fast it switches is the pitch
you hear.

A sound chip that plays real recordings can cost as much as the whole robot
controller board. This kit trades away that recorded quality and keeps the
parts that carry the feeling: the way a pitch slides, the way a sound swells
and fades, and the rhythm of the beeps. Those three things are where a
robot's personality actually lives.

## What You Need

| Part | Notes |
|---|---|
| Raspberry Pi Pico | Any model, running MicroPython |
| XPT8871 amplifier module | A small mono board that runs on 5 volts |
| Speaker | 4 to 8 ohms |
| 1 kΩ resistor | Called R1 in the diagram |
| 100 Ω resistor | Called R2 |
| 470 nF capacitor | Called C1 |
| 10 µF capacitor | Called C2 |
| Momentary push button | Plays the next sound |

Building a robot on a Cytron Maker Pi RP2040? You can skip every part in this
table except the button. That board already has a small piezo buzzer wired to
GPIO 22, so the sounds cost you nothing at all. They are thinner and quieter,
but they work.

## The Amplifier Board

<figure markdown="span">
  ![Top view of a small green XPT8871 amplifier board. Six holes run down the left edge in three labelled pairs: plus 5 V and minus at the top, IN in the middle, and OUT at the bottom. The black eight-pin amplifier chip is marked U1, and a silver 220 microfarad 16 volt capacitor sits beside it. Small surface-mount parts are marked C2, C3, C4 and R3. There is no volume knob anywhere on the board](xpt8871-amp-board-top.jpg)
  <figcaption>The whole amplifier, about the size of a postage stamp. Every
  connection you need is on the left edge.</figcaption>
</figure>

Find the six holes down the left edge. They are grouped in pairs, and the
white lettering names them: **+5V** and **-** at the top for power, **IN** in
the middle for the sound coming from the Pico, and **OUT** at the bottom for
the speaker.

Now look for a volume knob. There isn't one. That is the most important thing
about this board, and it is why the circuit below needs two resistors instead
of one: nothing on the amplifier turns the sound down, so you have to hand it
a signal that is already the right size.

The silver can marked **220 16V** is a capacitor that steadies the power
supply, and it is already fitted. You do not need to add capacitors of your
own across the power pins.

## Wiring the Sound Circuit

Only four small parts sit between the Pico and the amplifier. Two of them set
how loud the signal is, and two of them clean it up.

#### Diagram: Synth Sounds Input Filter

<figure markdown="span">
  ![A Pico PWM pin feeds a 1 kilohm series resistor to a node with a 100 ohm resistor and a 470 nF capacitor to ground, then a 10 microfarad capacitor into the IN pin of an XPT8871 amplifier module powered from 5 volts, whose two bridge-tied outputs drive a floating loudspeaker](synth-sounds-input-filter.svg)
  <figcaption>R1 and R2 quiet the Pico's signal down to a level the amplifier
  expects. C1 smooths off the sharp edges. C2 passes the sound through while
  blocking the steady voltage behind it.</figcaption>
</figure>

**R1 and R2 make the signal smaller.** The Pico's pin swings a full 3.3 volts,
but the amplifier expects something closer to 0.3 volts and makes everything
it hears about twenty times louder. Hand it the full 3.3 volts and it runs out
of room, squaring off the tops of the sound into a harsh buzz. These two
resistors divide the signal by eleven so the amplifier gets a size it can
handle.

**C1 rounds off the sharp corners.** A pin that is only ever on or off makes a
square-edged wave, and those hard edges sound scratchy. C1 softens them.

**C2 blocks the steady voltage.** The signal from the Pico rides on top of a
constant voltage that the amplifier does not want. C2 lets the changing part -
the sound - pass through and holds the steady part back.

!!! mascot-warning "Never connect a speaker wire to ground"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    This amplifier drives both speaker wires at once, so neither one is
    ground. Connect the speaker across the two output terminals and to
    nothing else. Wiring either one to ground can destroy the amplifier
    chip - and so can touching one with a grounded oscilloscope probe.

!!! mascot-tip "If the Pico restarts when the sound gets loud"
    ![Sparky tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    That is not a bug in your program. A loud speaker pulls more current
    than a USB port likes to give. Turn the volume down, or give the
    amplifier its own 5 volt supply and connect the two grounds together.

## How a Sound Is Stored

Every sound in this kit is a short list of segments. Each segment is five
numbers:

```python
(duration_ms, freq_start, freq_end, volume_start, volume_end)
```

The pitch slides in a straight line from `freq_start` to `freq_end` while the
volume fades from `volume_start` to `volume_end`. A segment with a frequency
of 0 is a silence. That one pattern describes a chirp, a beep, a wobble, and a
pause - and the whole sad sound takes only eight of them.

These numbers were not guessed. A program measured the pitch and loudness of
real recorded R2-D2 sounds many times a second, then squeezed each recording
down to a few segments. When you play one, you are hearing a measurement of
the original.

!!! mascot-celebration "One pin, sixteen feelings"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    All sixteen sounds together take about 50 kB of memory and no storage
    space at all. The same Pico pin that blinks an LED can carry every one
    of them.

## The Labs

Work through these in order. Each one builds on the last.

| Lab | What you build |
|---|---|
| [Lab 1: Build the Sound Circuit](01-build-the-sound-circuit.md) | Wire the amplifier and play your first note |
| [Lab 2: Sliding Pitches](02-sliding-pitches.md) | Make a beep sound curious, then disappointed |
| [Lab 3: Shaping the Volume](03-shaping-the-volume.md) | Get soft and loud out of an on/off pin |
| [Lab 4: Sounds From Measurements](04-sounds-from-measurements.md) | Play all sixteen sounds and read one as data |
| [Lab 5: Add the Button](05-add-the-button.md) | Wire an input and catch it bouncing |
| [Lab 6: The Sound Jukebox](06-the-sound-jukebox.md) | Finish the device and cut the cord |

The code for this kit lives in `src/kits/synth-sounds/`, along with the tools
that measured the recordings and the schematic source for the diagram above.
