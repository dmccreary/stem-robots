# Lab 1: Meet the Pico

Before you wire up a single sensor, let's make sure the brain of this
kit — the Raspberry Pi Pico — is alive and talking to your computer. No
breadboard, no sensor, no screen. Just the Pico and a USB cable.

!!! mascot-welcome "Welcome, maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every great build starts by checking that the basics work. Let's ask
    the Pico to introduce itself!

## What You Need

- Your Raspberry Pi Pico
- A USB cable
- Thonny, installed and open on your computer

## What You'll Learn

- What **MicroPython** is, and how to tell which version is running
- The difference between **RAM** (working memory) and **flash storage**
  (permanent storage)
- Why checking your tools *before* you build is good engineering practice

## Step-by-Step

### Step 1: Plug In and Connect

Plug the Pico into your computer with the USB cable. In Thonny, make
sure the bottom-right corner shows it's connected to a MicroPython
device.

### Step 2: Open and Run

Open `01-probe-pico.py`. Press **Run** (F5). You should see a wall of
text appear in the Shell at the bottom of Thonny.

### Step 3: Read the Board Info

Near the top, you'll see something like this:

```python
u = os.uname()
print("sysname :", u.sysname)
print("release :", u.release)
print("machine :", u.machine)
```

`os.uname()` asks the Pico's operating system — MicroPython — to
describe itself. `sysname` is the family of chip (`rp2`, for the RP2040
chip inside your Pico), `release` is the MicroPython version number, and
`machine` tells you the exact board.

### Step 4: Check the Memory

A little further down, the program checks how much working memory is
free:

```python
gc.collect()
free = gc.mem_free()
print("RAM free : {} bytes".format(free))
```

**RAM** is the Pico's short-term memory — it holds whatever your program
is doing *right now*, and it empties out every time the Pico loses
power. `gc.collect()` cleans up any memory your program isn't using
anymore before we measure it, the same way tidying your desk before
measuring how much space is left gives you a more honest number.

### Step 5: Check the Storage

The last section reports **flash storage** — the Pico's permanent
memory, which keeps your programs saved even after you unplug it:

```python
fs = os.statvfs("/")
flash_total = fs[0] * fs[2]
flash_free = fs[0] * fs[3]
```

Think of flash storage like the hard drive on a computer, and RAM like
the surface of your desk while you're working. Flash keeps things when
the power goes off; RAM does not.

**Try it now:** run the program and find the line that says
`TEST PASS - board is alive and MicroPython is running`. If you see it,
your Pico and Thonny are ready for the rest of this kit.

!!! mascot-tip "No output at all?"
    ![Sparky with a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If nothing prints, check the bottom-right corner of Thonny for the
    device connection. If it says "The interpreter," click it and pick
    your Pico's port before trying again.

## Try It Yourself

- How many kilobytes of RAM does your Pico report as free? Write the
  number down — later labs will use more of it as programs get bigger.
- Unplug the Pico, plug it back in, and run the program again. Does the
  RAM-free number change slightly? Why might that be?

## What's Happening Under the Hood

Every time you run a program, MicroPython is quietly managing two kinds
of memory behind the scenes: RAM for the program that's running right
now, and flash for anything saved permanently, like the `.py` files
themselves. Checking both before you start building is exactly what a
professional engineer does before trusting a new piece of hardware.

## Check Your Understanding

1. What command shows information about the Pico's version and chip?
2. What is the difference between RAM and flash storage?
3. Why does the program call `gc.collect()` before checking free memory?
4. What line of text tells you the test passed?

## Full Code

You can find the complete program at
[`src/kits/smartwatch-compass-hmc5883l/01-probe-pico.py`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/smartwatch-compass-hmc5883l/01-probe-pico.py).

!!! mascot-celebration "Your Pico just introduced itself!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You confirmed your Pico is alive and checked its memory — the same
    first step any engineer takes with a new piece of hardware. On to
    Lab 2!
