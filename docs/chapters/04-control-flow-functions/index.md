---
title: Control Flow, Functions, and Exception Handling
description: Build the programming structures that make robots behave intelligently — conditionals, loops, functions, exception handling, and timing — the patterns used in every robot program in this course.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 14:00:00
version: 0.08
---

# Control Flow, Functions, and Exception Handling

!!! mascot-welcome "Welcome, maker — let's give your robot a brain!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In Chapter 3 you learned to store values in variables. Now we teach your robot to *make decisions* and *repeat actions*. By the end of this chapter, your robot will respond differently depending on what its sensors detect. That's the real magic of programming.

## Summary

This chapter builds the programming structures that make robots behave intelligently.
Students learn to write conditional logic with if/elif/else, repeat actions with for
and while loops (including nested loops), and organize code into reusable functions
with parameters and return values. The chapter also covers scope, global variables,
exception handling with try/except/finally, KeyboardInterrupt for clean shutdown,
module imports, and timing with delays — all patterns used in every robot program
that follows.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. If Statement
2. Elif and Else Clauses
3. For Loop
4. While Loop
5. Nested Loops
6. Function Definition
7. Function Parameters
8. Return Values
9. Scope and Local Variables
10. Global Variables
11. Exception Handling
12. Try Except Finally
13. KeyboardInterrupt Handling
14. Importing Modules
15. Built-in Libraries
16. Timers and Delays

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: MicroPython and Development Environment Setup](../03-micropython-dev-environment/index.md)

---

## Making Decisions with if/elif/else

Every robot needs to make decisions. "Is there an obstacle ahead? Should I turn left or right? Is the battery low?" In MicroPython, we express decisions using **if statements**.

An **if statement** runs a block of code only when a condition is `True`. The condition is any expression that evaluates to `True` or `False` — exactly the boolean comparisons you learned in Chapter 3.

Here is the simplest form. The condition `distance_cm < 20` is either `True` or `False`. If it is `True`, the indented block runs. If it is `False`, nothing happens.

```python
distance_cm = 15

if distance_cm < 20:
    print("Obstacle detected!")
    print("Stopping motors.")
```

Notice the colon after the condition and the four-space indent on the block. Both are required. Leave out the colon and Python gives you a `SyntaxError`. Remove the indent and the print statement no longer belongs to the if block.

### Adding elif and else

An **elif clause** (short for "else if") checks a second condition only when the first one is `False`. An **else clause** runs when none of the above conditions are `True`. Together, they let you describe multiple outcomes:

```python
distance_cm = 35

if distance_cm < 20:
    print("Too close — stop!")
elif distance_cm < 50:
    print("Getting close — slow down.")
else:
    print("Path clear — full speed ahead!")
```

Python checks conditions from top to bottom. The moment one is `True`, it runs that block and skips the rest. Only one branch ever runs.

The table below shows how distance ranges map to robot responses:

| Distance | Condition | Response |
|----------|-----------|----------|
| Less than 20 cm | `distance_cm < 20` | Stop motors |
| 20–50 cm | `distance_cm < 50` | Slow down |
| 50 cm and above | else | Full speed |

#### Diagram: Collision Avoidance Decision Flow

<details markdown="1">
<summary>Interactive flowchart of the if/elif/else distance decision</summary>
Type: diagram
**sim-id:** collision-decision-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a Mermaid flowchart (graph TD) showing:
- Start node: "Read distance sensor"
- Diamond: "distance_cm < 20?" — Yes branch leads to "Stop motors" box, No branch continues
- Diamond: "distance_cm < 50?" — Yes branch leads to "Slow down" box, No branch continues
- Final box: "Full speed ahead"
- All terminal boxes have arrows back to "Read distance sensor" (loop)

Every decision diamond and action box has a click directive that opens an infobox explaining what that step does in plain language.

Canvas: 500 × 450 px. Responsive on window resize.
</details>

---

## Repeating Actions with Loops

Robots don't act once and stop. They run the same actions over and over — check the sensor, adjust the motors, check the sensor again. **Loops** make this possible.

### The for Loop

A **for loop** repeats a block of code a fixed number of times, or once for each item in a sequence. Before the code example, here is what the key piece does: `range(5)` produces the sequence `[0, 1, 2, 3, 4]` — five values starting at 0. The loop variable `i` takes each value in turn.

```python
for i in range(5):
    print("Blink number:", i)
```

This prints five lines, counting from 0 to 4. You can also loop over a list:

```python
colors = ["red", "green", "blue"]
for color in colors:
    print("Setting LED to:", color)
```

Use `for` loops when you know exactly how many repetitions you need.

### The while Loop

A **while loop** repeats as long as a condition is `True`. It is perfect when you don't know in advance how many times to repeat — like running the collision-avoidance check forever, or waiting until the sensor reads below a threshold.

```python
# Run forever until the program is stopped
while True:
    print("Checking sensors...")
```

`while True` runs forever. This is the standard way to write the main loop of a robot program. We stop it by pressing Ctrl+C in Thonny, which we handle in the exception section below.

You can also use a condition that eventually becomes `False`:

```python
distance_cm = 100

while distance_cm > 20:
    print("Moving forward. Distance:", distance_cm)
    distance_cm -= 5    # simulate getting closer to a wall
```

!!! mascot-thinking "Think about infinite loops"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `while True` sounds dangerous — won't it run forever? Yes, that's the point! A robot's main program *should* run until you decide to stop it. The key is having clean shutdown code inside a `try/except` block, which we'll write in a few minutes.

### Nested Loops

A **nested loop** is a loop inside another loop. The inner loop runs completely for each single step of the outer loop. We use nested loops for things like NeoPixel animations where we repeat a color pattern many times.

```python
# Blink 3 different colors, 4 times each
for color_index in range(3):
    for blink in range(4):
        print("Color", color_index, "blink", blink)
```

The outer loop runs 3 times (colors 0, 1, 2). For each outer step, the inner loop runs 4 times. Total iterations: 3 × 4 = 12.

Be careful with nested loops: adding one nesting level multiplies the total iterations. A triple-nested loop over `range(100)` would run a million times — likely too slow for a real-time robot control loop.

---

## Organizing Code with Functions

As programs grow, repeating the same lines in multiple places becomes a problem. If you want to change how the robot stops, you'd need to find every stop in the code and update each one. **Functions** solve this by giving a name to a block of code. Write it once, use it anywhere.

### Defining a Function

The keyword `def` defines a function. Give it a name, a pair of parentheses, and a colon. Indent the body.

```python
def stop_motors():
    print("Motors stopped.")
```

Now `stop_motors()` can be called anywhere in your program. The function body runs each time it is called.

### Parameters and Return Values

Functions become much more powerful with **parameters** — inputs that the function receives when it is called. A **return value** is the output the function sends back. Before the code, here is the idea: `move_forward` needs to know the speed (a number 0–100) and how long to move (in seconds). It uses those inputs and prints what it would do.

```python
def move_forward(speed, duration):
    print("Moving at speed", speed, "for", duration, "seconds.")
    # Motor control code goes here in Chapter 7

move_forward(75, 2)     # speed=75, duration=2 seconds
move_forward(50, 0.5)   # speed=50, duration=0.5 seconds
```

A **return value** sends data back to the caller. This is useful for sensor-reading functions that compute a result. The `return` statement ends the function immediately and sends a value back.

```python
def apply_scale(raw_value):
    distance_cm = raw_value * 0.092   # scale factor converts raw to cm
    return distance_cm

dist = apply_scale(1500)
print("Distance:", dist, "cm")
```

!!! mascot-tip "Functions are your robot's vocabulary"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Name your functions like actions: `move_forward()`, `stop_motors()`, `read_distance()`, `play_tone()`. When your main loop reads like plain English — "move forward, check distance, if close then stop" — your code is at the right level of abstraction. That's the decomposition pillar of computational thinking in action.

### Scope and Local Variables

**Scope** determines where a variable can be seen and used. A variable created inside a function is a **local variable** — it only exists inside that function. When the function ends, the variable disappears.

```python
def compute_speed(raw_value):
    scaled = raw_value * 0.5    # local variable — only lives here
    return scaled

result = compute_speed(100)
# print(scaled)    # NameError — scaled is gone after function ends
```

Local variables prevent naming conflicts. Two different functions can both have a local variable called `speed` without interfering with each other.

### Global Variables

Sometimes you need a variable that every function can see and change. A **global variable** is defined outside all functions. To modify it inside a function, you must declare it with the `global` keyword.

```python
is_moving = False    # global variable

def start_motors():
    global is_moving    # tell Python we want the global one
    is_moving = True
    print("Motors on. is_moving =", is_moving)

start_motors()
print("After call:", is_moving)    # True
```

Without `global`, Python would create a new local `is_moving` inside `start_motors()` instead of changing the global one. Always use `global` when a function needs to modify a global variable.

In robot programs, global variables are common for state flags: `is_moving`, `obstacle_detected`, `current_speed`. Keep the list short — too many globals make code hard to follow.

---

## Exception Handling and Clean Shutdown

Things go wrong. A sensor gives a bad reading. A motor stalls. The user presses Ctrl+C to stop the program. If your code doesn't handle these situations, the robot might freeze with the motors still running.

**Exception handling** lets you catch these problems and respond safely. An **exception** is an error that occurs while the program runs. Python reports it and normally stops the program. Before the code, here is the structure: the `try` block runs your normal code. If something goes wrong, Python jumps to the matching `except` block. The `finally` block runs no matter what — even if there was an error. This is where we put motor-shutdown code.

```python
try:
    print("Starting main loop...")
    while True:
        print("Running...")

except KeyboardInterrupt:
    print("Ctrl+C pressed — shutting down.")

finally:
    print("Cleanup: stopping motors.")
    # Motor stop code goes here in Chapter 7
```

### KeyboardInterrupt Handling

**KeyboardInterrupt** is the specific exception Python raises when you press Ctrl+C. In Thonny, pressing the Stop button sends this signal. Catching it lets you run cleanup code before the program exits.

Without this pattern, pressing Stop might leave your motors running. With it, `finally` always runs the cleanup — guaranteed.

The full pattern for every robot main loop looks like this:

```python
from time import sleep

try:
    print("Robot started. Press Ctrl+C to stop.")
    while True:
        # Main robot logic goes here
        sleep(0.1)

except KeyboardInterrupt:
    print("Stopping.")

finally:
    print("Motors off. Goodbye!")
```

Memorize this pattern. Every robot program you write in this course uses it.

!!! mascot-warning "Always write the finally block"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Forgetting the `finally` block means your motors could keep running after your program crashes or stops. A robot spinning with no code running can damage the wheels or battery connector. Always shut down hardware in `finally` — it runs even when the program exits with an error.

---

## Importing Modules

MicroPython comes with many built-in tools called **modules**. A **module** is a file of ready-made functions and objects. Before you can use a module's features, you must **import** it.

Two import styles exist. The first imports the whole module:

```python
import time
time.sleep(1)   # call sleep() from the time module
```

The second imports only what you need:

```python
from time import sleep
sleep(1)        # shorter — no module prefix needed
```

The second style is more common in short robot programs because it makes code less verbose.

### Built-in Libraries You'll Use

MicroPython includes several **built-in libraries** — pre-installed modules that work without any extra download. The table below lists the ones you will use most often in this course.

Before the table, here is a brief explanation of each: `machine` controls GPIO pins, PWM, and I2C directly. `time` gives you delays and timestamps. `neopixel` drives RGB LED strips. `network` handles WiFi on the Pico W. `bluetooth` enables BLE communication.

| Module | What it provides | First chapter used |
|--------|-----------------|-------------------|
| `machine` | GPIO pins, PWM, I2C, SPI | Chapter 7 |
| `time` | `sleep()`, `ticks_ms()` | This chapter |
| `neopixel` | NeoPixel LED control | Chapter 9 |
| `network` | WiFi connection on Pico W | Chapter 11 |
| `bluetooth` | BLE advertising and scanning | Chapter 12 |

---

## Timers and Delays

Robot programs often need to wait. Wait 2 seconds after startup. Wait 100 milliseconds between sensor readings. Wait half a second while the motor runs. The `sleep()` function creates these pauses.

`sleep(seconds)` pauses the program for the given number of seconds. You can use a float for sub-second delays:

```python
from time import sleep

sleep(2)        # pause for 2 seconds
sleep(0.5)      # pause for 500 milliseconds
sleep(0.1)      # pause for 100 ms (a common sensor poll rate)
```

For timing that does not pause the program — useful for checking "has 500 ms passed since the last reading?" — use `ticks_ms()` and `ticks_diff()`. `ticks_ms()` returns milliseconds since the board booted. `ticks_diff()` subtracts two tick values correctly even when the counter wraps around.

```python
from time import ticks_ms, ticks_diff

start = ticks_ms()
# ... do some work here ...
elapsed = ticks_diff(ticks_ms(), start)
print("Elapsed:", elapsed, "ms")
```

Always use `ticks_diff()` instead of plain subtraction when measuring time. Plain subtraction fails when the counter wraps around after about 12 days of uptime.

#### Diagram: Robot Main Loop with Timing

<details markdown="1">
<summary>Interactive MicroSim showing the main loop timing pattern</summary>
Type: MicroSim
**sim-id:** robot-main-loop-timing<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Show a timeline animation of the robot's main loop:

- A horizontal "time" axis runs left to right.
- Each loop iteration is shown as a stacked block. Inside the block, colored segments represent: "Read sensor" (blue, ~5ms), "Make decision" (orange, ~1ms), "Move motor" (green, ~2ms), "Sleep 100ms" (gray, ~100ms).
- An animated "NOW" cursor moves along the timeline in real time.
- A "Speed" toggle button cycles through 1×, 5×, 10× animation speed.
- A "Loop #" counter in the top right increments each iteration.
- Hovering each segment type shows a tooltip with the MicroPython function name and approximate duration.

Learning objective (Bloom's Taxonomy — Understanding): students grasp that each loop iteration has distinct phases, and that sleep() determines the polling rate.

Responsive: redraw on window resize. Canvas min-width: 400px.
</details>

---

## Putting It All Together

Let's write a complete program that uses every concept in this chapter. This is the skeleton of every robot program you will write in the course.

Before the code, here is what each section does: we define helper functions (`check_obstacle` and `respond`) that we can call from the main loop. The main loop runs forever inside `try`, reading a sensor and calling those functions. The `except` block catches Ctrl+C. The `finally` block shuts down hardware.

```python
from time import sleep

# Global state
is_running = True

# Functions
def check_obstacle(distance):
    if distance < 20:
        return "stop"
    elif distance < 50:
        return "slow"
    else:
        return "go"

def respond(action):
    if action == "stop":
        print("Stopping!")
    elif action == "slow":
        print("Slowing down.")
    else:
        print("Moving forward.")

# Main program
print("Robot starting...")

try:
    while True:
        distance_cm = 30    # real code reads from sensor in Chapter 8
        action = check_obstacle(distance_cm)
        respond(action)
        sleep(0.1)

except KeyboardInterrupt:
    print("Ctrl+C received.")

finally:
    print("Motors off. Program ended.")
```

Run this in Thonny. Change `distance_cm` to `15` and re-run. Change it to `45`. Watch how the output changes. You now have a working decision-making loop.

---

## Key Takeaways

- **if/elif/else** lets the robot make decisions based on sensor data
- **for loops** repeat a fixed number of times; **while loops** repeat while a condition is True
- **Functions** organize code into named, reusable blocks with parameters and return values
- **Local variables** live inside functions; **global variables** are shared across the whole program
- **try/except/finally** catches errors and guarantees cleanup code runs
- **KeyboardInterrupt** is how you stop a robot program with Ctrl+C
- **import** loads built-in modules like `time`, `machine`, and `neopixel`
- **sleep()** pauses the program; **ticks_ms()** measures elapsed time without pausing

!!! mascot-celebration "Your robot now has a brain!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, engineer! You now know how to write programs that make decisions, repeat actions, organize code into functions, and shut down safely. These patterns appear in every robot program in this course. The next chapter adds data structures and the tools to write clean, modular code across multiple files. You're building momentum!
