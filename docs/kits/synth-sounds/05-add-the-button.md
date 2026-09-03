# Lab 5: Add the Button

So far your sounds play whenever a program runs. A robot needs to react
to the world instead. In this lab you will wire a push button and learn
why reading one is trickier than it looks.

!!! mascot-welcome "Welcome back, makers!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Time to give me an input! Buttons look simple, but they lie to you for
    a few milliseconds every time they're pressed. Let's find out how to
    catch them being honest.

## What You Need

- Your finished circuit from Lab 1
- A momentary push button
- Two jumper wires
- The Pico connected to your computer with a USB cable

## What You'll Learn

- How to wire a button with only two wires
- What a **pull-up resistor** does
- Why a pressed button reads as `0` and not `1`
- What **switch bounce** is and how to handle it

## Step-by-Step

### Step 1: Wire the Button

Disconnect power first. Then:

1. Connect one leg of the button to the Pico's **GP16**.
2. Connect the other leg to any **GND** pin.

That is the whole circuit. There is no resistor, and there is no wire to
3.3 volts.

### Step 2: Understand the Missing Resistor

An unconnected pin is not 0 and not 1. It floats, picking up stray
electrical noise, and reads randomly. A floating input pin is one of the
most common beginner bugs in all of electronics.

The fix is a **pull-up resistor** — a resistor that gently holds the pin
at 3.3 volts when nothing else is driving it. The Pico has one built in,
so we switch it on in software instead of adding a part:

```python
button = Pin(config.BUTTON_PIN, Pin.IN, Pin.PULL_UP)   # hold it HIGH
```

Now the pin sits at 1 while the button is untouched. Pressing the button
connects the pin straight to ground, so it reads 0.

!!! mascot-thinking "Why does pressed mean zero?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Hmm, it feels backwards, doesn't it? The pull-up holds the pin HIGH,
    and the button's only job is to yank it down to ground. So *not*
    pressed is 1, and pressed is 0. Almost every button works this way.

### Step 3: Watch the Button

Open **`00-button-only-test.py`** in Thonny and press **Run**. This
program creates no sound at all — it only watches the pin and prints
whenever the value changes:

```
GP16 = 1
GP16 = 0
GP16 = 1
```

Press and release the button a few times. You should see 1 while resting
and 0 while held down.

### Step 4: Know Why This Test Exists on Its Own

This program deliberately does nothing but read the button. That makes it
a **diagnostic** — a test that isolates one part of a system so you can
tell where a problem lives.

If the button behaves correctly here but misbehaves once sound is added,
the fault is in the audio side, not the button. Splitting a problem in
half like this is one of the most useful debugging habits there is.

### Step 5: Meet Switch Bounce

A button is two metal contacts springing together. For a few
milliseconds after they touch, they bounce apart and back several times.
The Pico is fast enough to see every one of those bounces, so a single
press can look like five presses.

Here is how the kit handles it:

```python
if button.value() == 0:                      # looks pressed
    time.sleep_ms(config.DEBOUNCE_MS)        # wait for the bouncing to settle
    if button.value() == 0:                  # still pressed? then it was real
```

We check, wait 20 milliseconds, and check again. A bounce will have
settled by then, so only a genuine press passes both tests. The wait is
`config.DEBOUNCE_MS`, so you can retune every lesson in the kit by
changing one number in `config.py`.

!!! mascot-tip "Waiting is a debugging tool"
    ![Sparky tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a trick that saves a lot of trouble: when hardware behaves
    erratically, ask whether it needs a moment to settle. Buttons bounce,
    sensors warm up, and amplifiers wake slowly. A 20 ms wait fixes more
    bugs than you'd expect!

### Step 6: Watch the Bounce Yourself

The test program does not contain the number 20 anywhere. It reads the
wait from `config.py`, so the whole kit can be retuned in one place:

```python
        time.sleep_ms(config.DEBOUNCE_MS)   # the wait lives in config.py
```

Open **`config.py`**, find `DEBOUNCE_MS = 20`, and change it to `1`:

```python
DEBOUNCE_MS = 1     # too short to hide the bouncing
```

Save both files and run the test again, pressing the button slowly
several times. You will likely see extra 1s and 0s from a single press.
That is bounce, made visible. Set it back to `20` when you are done.

## Try It Yourself

- Press the button very slowly and very gently. Does it bounce more?
- Hold the button down. Does the value stay at 0 the whole time?
- Wire a second button to a different free pin and watch both.
- Change the wait to 200 milliseconds. The button now feels sluggish —
  too much waiting is its own problem.

## What's Happening Under the Hood

The program polls the pin — it asks "what are you now?" over and over in
a loop, about a hundred times per second. That is simple to read and
plenty fast for a button a person presses.

It also prints only when the value *changes*, not on every check. Without
that, the console would fill with thousands of identical lines every
second and you would never spot the press.

## Check Your Understanding

1. What does a pull-up resistor do?
2. Does a pressed button read 1 or 0 in this kit? Why?
3. What is switch bounce?
4. Why does this test program deliberately avoid making any sound?

## Full Code

You can find the complete program at
[`src/kits/synth-sounds/00-button-only-test.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/synth-sounds/00-button-only-test.py).

!!! mascot-celebration "Your robot can listen now!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You wired an input, understood why pressed means zero, and saw switch
    bounce with your own eyes. Next we put your button and your sounds
    together!
