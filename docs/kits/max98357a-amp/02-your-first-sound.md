# Lab 2: Your First Sound

In Lab 1, you turned the kit on and pressed buttons without ever
looking at the code. In this lab, you will connect the kit to a
computer for the first time and run a program yourself. You will make
the speaker play a musical tone, and then change the pitch of that
tone.

!!! mascot-welcome "Welcome back, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Time to open the hood. We're connecting to a real computer and running
    our first program together — let's make some noise on purpose this
    time!

## What You Need

- Your MAX98357A kit
- A computer (Windows, Mac, or Chromebook)
- A USB cable that fits your Pico (USB-A to Micro-USB, or USB-C —
  check your kit)
- The free program **Thonny**, installed on your computer (ask an
  adult or your teacher if it is not already installed)

## What You'll Learn

- How to connect a Raspberry Pi Pico to a computer
- How to open and run a MicroPython program in Thonny
- What **pitch** and **frequency** mean
- How to change one number in a program and see what happens

## Step-by-Step

### Step 1: Turn Off the Kit's Power Switch

Before you plug in the USB cable, flip the kit's power switch to
**off**. The Pico will get its power from the USB cable instead of the
batteries while you are programming it.

### Step 2: Plug In the USB Cable

Plug one end of the USB cable into the Pico's USB port (it's the small
port poking out of the box) and the other end into your computer.

### Step 3: Open Thonny

Open the Thonny program on your computer. You should see a code editor
window.

### Step 4: Connect Thonny to the Pico

Look at the bottom-right corner of the Thonny window. It shows which
device Thonny is talking to.

1. Click that bottom-right corner.
2. Choose the option that looks like **"MicroPython (Raspberry Pi
   Pico)"** along with a port name.

If you see the word **"Ready"** or the Thonny console shows a
`>>>` prompt, you are connected.

!!! mascot-warning "Only one program at a time"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A Pico can only talk to one program on your computer at a time. If
    Thonny won't connect, make sure nothing else — like `mpremote` in a
    terminal — is already connected to it.

### Step 5: Open the Sound Test File

In Thonny, open the file browser panel so you can see files on the
Pico (View → Files, if it is not already showing). Find and open
**`01-sine-wave-test.py`**.

### Step 6: Run It

Press the green **Run** button (or press F5). Look at the Thonny
console at the bottom of the screen. You should see a message like:

```
Playing 444.4 Hz tone for 5s - listen for a steady tone on the speaker.
```

Listen for a steady, single-pitch tone from the speaker for about 5
seconds.

### Step 7: Change the Pitch

Find this line near the top of the file:

```python
TONE_HZ = 440       # target pitch (A4); actual pitch is printed below
```

`440` is a **frequency**, measured in **Hertz (Hz)**. Frequency is how
many times per second the speaker's cone moves back and forth. A
higher number means a higher-sounding pitch — like a smaller bell
versus a bigger one.

Change `440` to `880` (exactly double). Run the program again. The
tone should sound like the same musical note, but a full octave
higher — noticeably higher-pitched.

Now try `220` (half of 440). Run it again. The tone should sound much
lower and deeper.

!!! mascot-thinking "Why does doubling sound like 'the same note, higher'?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Every time you double a frequency, your ears hear the exact same note,
    just one octave up. Try humming a note, then humming it again "an
    octave higher" — that jump is always a doubling, every time.

## Try It Yourself

- Try `TONE_HZ = 261` — that's close to middle C on a piano.
- Try a very low number like `50`. Can you still hear it clearly? Real
  speakers, including this one, aren't great at very low pitches.
- Try a very high number like `10000`. Some people (especially kids!)
  can hear pitches this high; some adults cannot.
- Find `DURATION_S = 5` in the same file. Change it to `2` so the tone
  plays for a shorter time.

## What's Happening Under the Hood

The program builds a **sine wave** — a smooth, repeating up-and-down
pattern — and sends it to the amplifier chip 440 times every second
(or however many times you set `TONE_HZ` to). The amplifier chip is
called a **MAX98357A**, and it turns that digital pattern into a real
electrical signal strong enough to move the speaker cone and make
sound.

The connection between the Pico and the amplifier that carries this
audio pattern is called **I2S** (say it "eye-two-ess"). You don't need
to remember that name, but you'll see it in the code as
`machine.I2S`.

## Check Your Understanding

1. What unit is used to measure the pitch of a sound in this program?
2. If you double the `TONE_HZ` value, does the pitch go up or down?
3. What is the name of the chip that turns the Pico's digital signal
   into real sound?
4. What did you have to do before plugging in the USB cable, and why?

## Full Code

You can find the complete program at
[`src/kits/max98357a-amp/01-sine-wave-test.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/max98357a-amp/01-sine-wave-test.py).

!!! mascot-celebration "You just wrote your first sound!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You connected real hardware to real code and changed a number to bend
    a sound wave on purpose. That's the same skill musicians, sound
    engineers, and robot builders all rely on!
