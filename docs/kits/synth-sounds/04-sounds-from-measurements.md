# Lab 4: Sounds From Measurements

You now know how to slide a pitch and shape a volume. Real R2-D2 sounds
are just a lot of those, one after another. In this lab you will play all
sixteen measured sounds and learn how a recording gets turned into a
short list of numbers.

!!! mascot-welcome "Welcome back, engineers!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every sound I know is stored as a handful of numbers — no audio files
    anywhere. Let's play all sixteen of them and then take one apart to
    see how it was built.

## What You Need

- Your finished circuit from Lab 1
- The Pico connected to your computer with a USB cable
- Thonny, connected to the Pico

## What You'll Learn

- What a **recipe** is in this kit
- How five numbers describe any beep, chirp, wobble, or pause
- How a real recording was measured and shrunk down
- How much memory sixteen sounds actually take

## Step-by-Step

### Step 1: Play Everything

Open **`04-play-a-recipe.py`** in Thonny and press **Run**. All sixteen
sounds play in a row, and the console prints each name with how many
pieces it took to build:

```
sad                     8 segments
excited                75 segments
quick beep             16 segments
```

Listen for which ones sound most like a real robot. Then look at the
segment counts — the simplest sound in the whole set is `sad`, at just
eight pieces.

### Step 2: Learn the Recipe Format

A **recipe** is a list of segments. Each segment is five numbers:

```python
(duration_ms, freq_start, freq_end, volume_start, volume_end)
```

That is exactly the glide you already know from Lab 2, written as data
instead of as a line of code. The pitch slides from `freq_start` to
`freq_end` while the volume fades from `volume_start` to `volume_end`.

A segment with a frequency of `0` is a rest — silence for that long.

### Step 3: Read a Real Recipe

Open **`sounds.py`** in Thonny and find `SAD`. Here is the whole sound —
the simplest one in the kit:

```python
SAD = (
    (  35,  462,  461,  14,  79),   # fade in fast
    (  70,  461,  476,  79, 100),   # rise a little, up to full volume
    (  35,  476,  477, 100,  93),   # hold at the top
    ( 140,  477,  451,  93,  75),   # the sag begins
    (  80,  451,  409,  75,  36),   # falling faster now, fading
    (  35,  409,  409,  36,  57),   # a small catch on the way down
    ( 110,  409,  381,  57,  27),   # keep sinking
    ( 110,  381,  388,  27,   7),   # settle and fade away
)
```

Read it top to bottom like sheet music. Eight lines describe a sound
lasting about six tenths of a second. You can see the sadness in the
numbers: the pitch climbs to 477, then falls all the way to 381 while the
volume drops from 100 down to 7.

!!! mascot-thinking "Sixteen sounds, no sound files"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    All sixteen of my sounds together take about 50 kB of memory and zero
    storage space. A single second of recorded audio would use more than
    that. Describing a sound beats storing one!

### Step 4: Understand Where the Numbers Came From

Nobody typed those numbers by ear. A program on a laptop opened each real
recording and measured two things every 5 milliseconds: the pitch, and
the loudness.

That produced hundreds of measurements per sound — far too many to store.
So the program then found the fewest straight lines that could follow
those measurements closely. A long smooth slide becomes one segment. A
sudden jump becomes two.

When you play `SAD`, you are hearing a measurement of the original
recording, replayed by a pin.

### Step 5: Change a Recipe

In Thonny, edit the fourth line of `SAD` so the pitch climbs instead of
starting its sag:

```python
    ( 140,  477,  560,  93,  75),   # climbing instead of sagging
```

Save the file and run `04-play-a-recipe.py` again. The first sound is no
longer sad, even though seven of its eight segments are untouched. Change
it back afterward.

## Try It Yourself

- Write your own recipe from scratch and play it:

```python
import r2d2

MY_SOUND = (
    ( 120,  300, 1400, 40, 100),   # a fast rise
    (  60,    0,    0,  0,   0),   # a short rest
    ( 200, 1400,  500, 100,  0),   # and a fall
)
r2d2.play(MY_SOUND)
```

- Make it stutter by repeating the rest and the rise several times.
- Take any recipe in `sounds.py` and double every duration. The sound
  becomes slow and heavy.
- Count the segments in `EXCITED`. Why does an excited sound need so many
  more pieces than a sad one?

## What's Happening Under the Hood

`r2d2.play()` is short enough to read in one go. It walks the list and
hands each segment to the same `glide()` you used in Lab 2:

```python
for ms, f0, f1, v0, v1 in recipe:
    glide(f0, f1, ms, v0, v1)     # one segment at a time, in order
```

That is the whole player. Every sound in the kit — the chirps, the
wobbles, the long sad sag — runs through those two lines. Building one
small tool well and reusing it everywhere is a habit worth stealing.

## Check Your Understanding

1. What are the five numbers in a segment?
2. What does a segment with a frequency of 0 do?
3. How often did the measuring program check the pitch of a recording?
4. Why does the kit describe sounds instead of storing recordings?

## Full Code

You can find the complete program at
[`src/kits/synth-sounds/04-play-a-recipe.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/synth-sounds/04-play-a-recipe.py),
and all sixteen recipes at
[`src/kits/synth-sounds/sounds.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/synth-sounds/sounds.py).

!!! mascot-celebration "You read a sound like sheet music!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just looked at a list of numbers and *heard* the sadness in it
    before running the code. That's what it means to read data fluently —
    a real engineering superpower!
