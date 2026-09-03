# Lab 6: The Sound Jukebox

You have a circuit, sixteen sounds, and a working button. In this lab you
will put them together into a finished device: press the button, hear the
next sound. Then you will make it run without a computer attached at all.

!!! mascot-welcome "Last lab — let's finish this!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Everything we've built comes together now. When we're done you can
    unplug the computer, walk away, and I'll still answer every button
    press. Computational thinking is YOUR superpower — let's activate it!

## What You Need

- Your finished circuit from Lab 1
- The button you wired in Lab 5
- The Pico connected to your computer with a USB cable

## What You'll Learn

- How to step through a list and wrap around to the start
- What the **remainder operator** does and why it is perfect here
- How to wait for a button release before accepting the next press
- How to make a program run on power-up with no computer

## Step-by-Step

### Step 1: Run the Jukebox

Open **`05-button-jukebox.py`** in Thonny and press **Run**. The console
tells you it is ready:

```
Ready. Press the button on GP16 to play a sound.
16 sounds loaded. Ctrl-C to stop.
```

Press the button. You hear a sound and the console names it. Press again
for the next one. After the sixteenth, it starts over at the first.

### Step 2: See How It Steps Through the List

Two lines do all the stepping:

```python
name, recipe = sounds.ALL[index]          # take the sound at this position
index = (index + 1) % len(sounds.ALL)     # move on, wrapping back to 0
```

The first line pulls out the current sound. The second moves to the next
one.

### Step 3: Understand the Wrap-Around

That `%` is the **remainder operator**. It divides and keeps only what is
left over.

With 16 sounds, `index` counts 0, 1, 2, and so on. When it reaches 16,
`16 % 16` is 0, so it jumps straight back to the beginning. The counter
can never run off the end of the list.

Without it you would need an `if` statement to catch the overflow. The
remainder does the same job in one character.

!!! mascot-thinking "A counter that can never run off the end"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Hmm, here's why this is neat: it works for *any* number of sounds. Add
    a seventeenth recipe tomorrow and nothing else has to change. Code
    that adapts on its own is code you won't have to fix later.

### Step 4: Find the Release Loop

Look for these two lines after the sound plays:

```python
while button.value() == 0:    # still holding it down?
    time.sleep_ms(10)         # wait right here until it's let go
```

This does nothing until you release the button. Without it, holding the
button down would fire press after press, and all sixteen sounds would
blur past in a few seconds.

Comment out those two lines, run it again, and hold the button. Then put
them back. Feeling the difference is worth the ten seconds.

### Step 5: Make It Run Without a Computer

Right now the jukebox only runs when you press **Run** in Thonny. To make
it run on its own, the Pico needs a file named exactly `main.py`, which
it looks for and runs every time it powers up.

That file is already in the kit — it is a copy of this lab's program. If
you uploaded the whole kit with `upload-code.sh`, it is already on your
Pico.

### Step 6: Cut the Cord

1. Close Thonny, or disconnect it from the Pico. Only one program can
   talk to the Pico at a time.
2. Unplug the USB cable.
3. Plug the Pico into a USB power bank or phone charger.
4. Press the button.

Your jukebox works with no computer anywhere near it.

!!! mascot-warning "Thonny and main.py can fight"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Heads up — this one trips up almost everyone. If `main.py` is running
    on power-up, Thonny may struggle to connect. Press **Ctrl-C** in the
    Thonny console to stop the running program, and it will let you back
    in.

## Try It Yourself

- Change the order of sounds by rearranging `ALL` at the bottom of
  `sounds.py`.
- Make the jukebox skip backwards instead of forwards using `- 1`
  instead of `+ 1`. The remainder operator handles negatives correctly
  in MicroPython, so it still wraps.
- Add your own recipe from Lab 4 to `sounds.ALL` and hear it in the
  rotation.
- Fit the optional volume knob: wire a potentiometer's wiper to GP26 and
  its outer legs to 3V3 and GND, then set `USE_VOLUME_KNOB = True` in
  `config.py`.

## What's Happening Under the Hood

The whole program is one loop that repeats about a hundred times a
second. Each pass it asks a single question: is the button down?

Almost every time the answer is no, and the loop simply goes round again.
That is normal. A robot's main loop spends nearly all of its life finding
nothing to do, staying ready for the moment something happens.

When the answer is finally yes, the program debounces the press, plays a
sound, waits for the release, and returns to waiting. This shape —
**check, act, wait, repeat** — is the backbone of nearly every robot
program you will ever write.

## Check Your Understanding

1. What does `%` do, and why is it useful for stepping through a list?
2. What would happen if you deleted the release loop?
3. What must a file be named for the Pico to run it on power-up?
4. Why does the main loop find nothing to do most of the time?
5. How would you add a seventeenth sound to the rotation?

## Full Code

You can find the complete program at
[`src/kits/synth-sounds/05-button-jukebox.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/synth-sounds/05-button-jukebox.py).

!!! mascot-celebration "You built a finished instrument!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, engineer! You built a working audio system from four
    cheap parts, learned to describe sound as data, and shipped a device
    that runs on its own. You built this — that's engineering!
