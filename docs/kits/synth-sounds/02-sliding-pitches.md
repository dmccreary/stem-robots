# Lab 2: Sliding Pitches

In Lab 1 you played three steady notes. Steady notes sound like a
microwave oven finishing. In this lab you will make notes that *slide*
while they play, and you will hear a plain beep turn into something that
sounds alive.

!!! mascot-welcome "Welcome back, engineers!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Here's the secret to robot personality: it isn't the notes, it's the
    *sliding between* them. Let's make a beep sound curious, then make the
    very same beep sound disappointed.

## What You Need

- Your finished circuit from Lab 1
- The Pico connected to your computer with a USB cable
- Thonny, connected to the Pico

## What You'll Learn

- What a **glide** is and why it carries feeling
- How rising and falling pitches read as different emotions
- How to write a glide in one line of code
- How a real R2-D2 sound was measured and turned into numbers

## Step-by-Step

### Step 1: Run the Glide Program

In Thonny, open **`02-pitch-glide.py`** and press **Run**. Listen
carefully. You will hear three things: a sound that rises, a sound that
falls, and a longer sound that sags.

### Step 2: Look at the Rising Glide

Find this line in the file:

```python
r2d2.glide(400, 1200, 300)   # start at 400 Hz, end at 1200 Hz, take 300 ms
```

This slides the pitch smoothly from 400 Hz up to 1200 Hz over 300
milliseconds. Rising pitches sound curious, excited, or questioning —
the same way your voice rises at the end of a question.

### Step 3: Look at the Falling Glide

```python
r2d2.glide(1200, 400, 300)   # the same numbers, the other way round
```

The exact same two frequencies, in the opposite order. This one sounds
disappointed or tired. Nothing changed except the direction.

!!! mascot-thinking "Same two notes, opposite feelings"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Hmm, think about this for a second. Both glides use 400 Hz and
    1200 Hz. Only the *order* changed, and suddenly one asks a question
    and the other gives up. Direction carries meaning all by itself!

### Step 4: Play the Measured Sad Sound

The last part of the file plays something different. These three lines
came from measuring a real recorded R2-D2 sound:

```python
r2d2.glide(462, 477, 140, 14, 100)   # rise a little, growing louder
r2d2.glide(477, 409, 255, 100, 36)   # the long sag downward
r2d2.glide(409, 388, 220, 36, 7)     # settle and fade away
```

Run it and listen. It starts near 462 Hz, lifts slightly, then sags down
to 388 Hz while fading away. The five numbers per line are starting pitch,
ending pitch, duration, starting volume, and ending volume.

Nobody guessed those numbers. A program listened to the real recording
many times per second and wrote down what it heard.

### Step 5: Break the Sadness on Purpose

Change the middle line so the pitch rises instead of sags:

```python
r2d2.glide(477, 600, 255, 100, 36)   # now it climbs instead of sagging
```

Run it. The sound is no longer sad. Same length, same volume fade, same
starting note — but the feeling is gone. Change it back when you are
done listening.

## Try It Yourself

- Make a very fast rising glide: `r2d2.glide(300, 3000, 80)`. Short and
  steep sounds surprised.
- Make a very slow falling glide: `r2d2.glide(900, 300, 1500)`. Long and
  gentle sounds sleepy.
- Stack two glides back to back to make a wobble:
  `r2d2.glide(600, 700, 60)` then `r2d2.glide(700, 600, 60)`. Repeat that
  pair six times in a loop and you have a warble.
- Try a glide that barely moves, like `r2d2.glide(500, 510, 400)`. Can you
  hear the difference from a steady note?

## What's Happening Under the Hood

The Pico cannot actually slide a pitch. It can only pick one frequency at
a time. So `glide()` cheats in a way your ears cannot catch: it changes
the frequency a tiny bit every **4 milliseconds**.

Over a 300 millisecond glide that is 75 tiny steps. Each step is far too
small and far too fast for an ear to pick out, so the staircase sounds
like a smooth ramp. Movies use the same trick — still pictures shown fast
enough look like motion.

## Check Your Understanding

1. What are the three numbers in `r2d2.glide(400, 1200, 300)`?
2. Which direction of glide sounds like a question?
3. How often does the Pico change the frequency during a glide?
4. Where did the numbers in the sad sound come from?

## Full Code

You can find the complete program at
[`src/kits/synth-sounds/02-pitch-glide.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/synth-sounds/02-pitch-glide.py).

!!! mascot-celebration "You made a robot feel something!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just discovered that emotion in sound is mostly *direction* — and
    you proved it by breaking a sad sound on purpose. That's how sound
    designers think!
