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


<iframe src="../../sims/collision-decision-flow/main.html" width="100%" height="960px" scrolling="no"></iframe>
[Run Collision Avoidance Decision Flow Fullscreen](../../sims/collision-decision-flow/main.html)

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


#### Diagram: Robot Loop Pattern Explorer

This MicroSim lets you run a `for` loop, a `while` loop, and a nested loop side by side. Each one makes a robot blink its LEDs. You watch the loop variable change, one step at a time, and count how many times the inner code runs.

<iframe src="../../sims/robot-loop-pattern-explorer/main.html" width="100%" height="602px" scrolling="no"></iframe>
[Run Robot Loop Pattern Explorer Fullscreen](../../sims/robot-loop-pattern-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Step through for, while, and nested loops and count the iterations</summary>
Type: microsim
**sim-id:** robot-loop-pattern-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** computer-science / loop-patterns-comparison (https://github.com/dmccreary/computer-science/tree/main/docs/sims/loop-patterns-comparison). Keep the side-by-side step-through layout. Replace the generic counting examples with robot examples (NeoPixel blinks, distance countdown) and add the nested-loop iteration counter.

Learning objective: Predict (Bloom L3, Apply) — the student can predict how many times a loop body runs and choose `for` or `while` for a given robot task.

Canvas layout: 700 px wide (responsive), 600 px tall. Top band (60 px) holds the mode tabs and controls. Below it, a left column (code panel, 300 px wide) and a right column (robot panel, rest of width). A bottom strip (100 px) shows the iteration counter and a step history.

Visual elements:
- Code panel: monospace listing of the active loop, 14 px font. The line being executed is highlighted in yellow. The loop variable value is shown in a small orange badge next to the `for` or `while` line.
- Robot panel: a top-down robot body (rounded rectangle, 120 x 90 px, dark gray) with two NeoPixels drawn as 24 px circles on the front. Each blink lights the pixel in the current color for one step, then dims it to dark gray.
- Distance-countdown scene (only in the while tab): a wall drawn as a thick red bar on the right edge and the robot on the left, with a horizontal double arrow labeled with the current `distance_cm`.
- Bottom strip: text "Iterations: N" in large type, plus a row of small squares, one per finished iteration. Squares are blue for the outer loop, teal for the inner loop.

Interactive controls:
- Tab buttons: "for loop", "while loop", "nested loops" (default: "for loop").
- "Step" button runs one iteration. "Run" plays automatically at the speed set by a slider. "Reset" returns to the start.
- Speed slider, 1 to 10 steps per second, default 2.
- Number input "range(n)", integers 1 to 8, default 5 (for tab).
- Number input "start distance", 40 to 120 cm in steps of 10, default 100, and "step size", 5 to 20 cm in steps of 5, default 5 (while tab). The condition is fixed as `distance_cm > 20`.
- Two number inputs "outer" (1 to 5, default 3) and "inner" (1 to 6, default 4) (nested tab).
- Checkbox "Forget to update distance_cm" (while tab only, default off).

Behavior:
- for tab: `for i in range(n)` runs exactly n times with i = 0 to n-1. The robot blinks pixel 0 on even i and pixel 1 on odd i.
- while tab: each step prints "Moving forward. Distance: X" and subtracts the step size. The loop stops when distance_cm is 20 or less. Iterations = ceil((start - 20) / step) when start is above 20. With the defaults (100, 5) it runs 16 times.
- If "Forget to update distance_cm" is on, the distance never changes. After 30 steps the sim stops and shows a red banner: "Infinite loop! Press Ctrl+C in Thonny to stop." This shows why `while` needs a condition that can change.
- nested tab: total iterations = outer x inner. The outer variable `color_index` picks the pixel color (red, green, blue, yellow, purple). The inner variable `blink` counts flashes. Show the formula "3 x 4 = 12" updated live. If the total goes above 20, show the hint "Each new nesting level multiplies the work."
- Reset any time a control changes.

Default state: "for loop" tab, range(5), paused at step 0, counter reads 0.

Assessment/Challenge: Set the nested loop to outer = 4 and inner = 5 before pressing Run. Predict the total, then check the counter. Answer: 20. Then use the while tab with start 60 and step 10 and predict the number of iterations. Answer: 4 (60, 50, 40, 30 run; 20 does not).

Responsive: redraw on window resize.
</details>

You now have a way to see exactly how many times a loop runs. When you write the main loop of your robot, ask yourself the same question: will the condition ever change? Use `for` when you know the count, and use `while` when the robot must keep going until a sensor says stop.

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


#### Diagram: Local vs Global Scope Explorer

This MicroSim shows the two places a variable can live. You watch a global variable sit in a big box, and you watch a local variable appear and vanish each time a function runs. You can also remove the `global` keyword and see what breaks.

<iframe src="../../sims/scope-local-global-explorer/main.html" width="100%" height="562px" scrolling="no"></iframe>
[Run Local vs Global Scope Explorer Fullscreen](../../sims/scope-local-global-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Trace where variables live and see what `global` changes</summary>
Type: microsim
**sim-id:** scope-local-global-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** moving-rainbow / variable-scope-explorer (https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/variable-scope-explorer). Keep the nested-box scope drawing. Swap the example code for the `is_moving` / `start_motors()` and `compute_speed()` examples from this chapter.

Learning objective: Explain (Bloom L2) — the student can explain why a local variable disappears after a function ends and why `global` is needed to change a global variable.

Canvas layout: 700 px wide (responsive), 560 px tall. Left column (330 px): code panel. Right column: scope diagram. Bottom strip (80 px): message area and controls.

Visual elements:
- Code panel: monospace listing with the highlighted current line (yellow). Line numbers in gray.
- Scope diagram: one large rounded rectangle labeled "Global scope (the whole program)" with a light blue fill. Inside it, a smaller rounded rectangle labeled with the function name, light orange fill, that only appears while the function is running (it slides in when the function is called and slides out when it returns).
- Variables are drawn as small labeled cards showing name and value, for example `is_moving = False`. Global cards are blue. Local cards are orange.
- When the function ends, its orange cards fade to 0 opacity and a puff-of-smoke icon appears.
- A red "NameError" tag pops up if the code tries to read a variable that is not in scope.

Interactive controls:
- Dropdown "Example": (1) "Local variable: compute_speed", (2) "Global with `global` keyword: start_motors", (3) "Global without `global` (the bug)". Default is example 1.
- "Step" button runs one line. "Reset" restarts. "Run" plays at 1 line per second.
- Toggle "Show global keyword" (only in examples 2 and 3): switches between example 2 and example 3 code so students see the one-line difference.

Behavior:
- Example 1 runs `scaled = raw_value * 0.5` with raw_value = 100. A local card `scaled = 50.0` appears inside the function box. On return, the value 50.0 is passed to `result` in the global box, and `scaled` fades. The last line, `print(scaled)`, causes the NameError tag and the message "scaled only lives inside compute_speed()."
- Example 2 starts with the global card `is_moving = False`. Inside `start_motors()`, the `global is_moving` line draws a dashed arrow from the function box to the global card. Then `is_moving = True` changes the global card to True (card flashes green). After the call, `print` shows True.
- Example 3 removes the `global` line. Now `is_moving = True` creates a new orange local card inside the function. The blue global card stays False. After the call, `print` shows False and the message says "Python made a new local variable. The global one did not change."
- The message area always explains the last step in one plain sentence.

Default state: Example 1 loaded, paused before line 1.

Assessment/Challenge: Run example 3, then find the one-line fix. Answer: add `global is_moving` as the first line inside `start_motors()`. The student checks it by toggling "Show global keyword" and confirming the global card becomes True.

Responsive: redraw on window resize.
</details>

In a real robot program, the flags `is_moving` and `obstacle_detected` are the kind of global variables this sim shows. If your robot ignores a change you made inside a function, check for a missing `global` line first. It is one of the most common bugs in student robot code, and now you know how to spot it.

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


#### Diagram: Clean Shutdown Flow

This MicroSim runs the `try` / `except` / `finally` pattern from above with a small animated robot. You press the Stop button (Ctrl+C) or trigger an error and watch which blocks run. The motors only stop when the `finally` block runs.

<iframe src="../../sims/clean-shutdown-flow/main.html" width="100%" height="522px" scrolling="no"></iframe>
[Run Clean Shutdown Flow Fullscreen](../../sims/clean-shutdown-flow/main.html){ .md-button }

<details markdown="1">
<summary>Trigger Ctrl+C or an error and watch try, except, and finally run</summary>
Type: microsim
**sim-id:** clean-shutdown-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified<br/>
**Reuse:** computer-science / try-except-flow (https://github.com/dmccreary/computer-science/tree/main/docs/sims/try-except-flow). Keep the flow diagram with highlighted path. Change the labels to the robot main loop and add the robot with spinning wheels that stops in `finally`.

Learning objective: Trace (Bloom L3, Apply) — the student can trace the path through try, except, and finally for each kind of event, and explain why motor shutdown belongs in `finally`.

Canvas layout: 700 px wide (responsive), 520 px tall. Left half (350 px): Mermaid flowchart (graph TD). Right half: robot scene (top 300 px) and a console panel (bottom 160 px).

Visual elements:
- Flowchart nodes: "Start" (rounded), "try: while True: robot logic" (blue box), "except KeyboardInterrupt: print Stopping" (orange box), "finally: motors off" (green box), "Program ends" (rounded). Arrows: Start to try; try to except (label "Ctrl+C"); try to finally (label "any other exit or error"); except to finally; finally to end.
- The active node is outlined in bright yellow with a thick border. Nodes already visited get a check mark.
- Robot scene: top-down robot with two wheels drawn as dark rectangles. While the motors are on, the wheels show moving gray stripes and a green "MOTORS ON" tag. After `finally` runs, the stripes stop and the tag turns red: "MOTORS OFF".
- Console panel: black background, green monospace text. It prints the lines from the code as each block runs.

Interactive controls:
- "Start robot" button starts the main loop (robot wheels spin, console prints "Robot started. Press Ctrl+C to stop.").
- "Press Ctrl+C" button (enabled while running).
- "Cause a sensor error" button (enabled while running): raises a `ValueError`.
- Checkbox "Include finally block" (default checked).
- "Reset" button.

Behavior:
- Ctrl+C: highlight moves try to except to finally to end. Console prints "Stopping." then "Motors off. Goodbye!". Wheels stop.
- Sensor error with an `except KeyboardInterrupt` only (no matching handler): highlight moves try to finally to end. Console prints "Motors off. Goodbye!" then a red line "ValueError: bad sensor reading". Wheels stop because `finally` still ran.
- With "Include finally block" unchecked: after Ctrl+C the except block prints "Stopping." but the wheels keep spinning and the tag stays "MOTORS ON". After a sensor error, the program ends with the red error and the wheels still spin. A red warning banner reads "The motors never got the stop command."
- Each event is animated over about 1.5 seconds, one node at a time.

Default state: Program not started, all nodes gray, wheels stopped, "Include finally block" checked.

Assessment/Challenge: With "Include finally block" unchecked, cause a sensor error and describe what the robot does. Answer: the program ends, but the motors keep running. Then re-check the box and confirm the motors stop.

Responsive: redraw on window resize.
</details>

This is the exact pattern you will put around every robot main loop. When the real motors are running, `finally` is your safety net. It runs on Ctrl+C, on a crash, and on a normal exit. Put your motor stop code there and your robot will never run away when your program stops.

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


<iframe src="../../sims/robot-main-loop-timing/main.html" width="100%" height="402px" scrolling="no"></iframe>
[Run Robot Main Loop with Timing Fullscreen](../../sims/robot-main-loop-timing/main.html)

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


#### Diagram: Sleep vs Timer Explorer

The earlier timing sim showed one loop. This one compares two ways to wait. With `sleep()`, the robot does nothing else while it waits. With `ticks_ms()` and `ticks_diff()`, the robot keeps checking its sensor while the LED blinks on a schedule.

<iframe src="../../sims/sleep-vs-ticks-explorer/main.html" width="100%" height="442px" scrolling="no"></iframe>
[Run Sleep vs Timer Explorer Fullscreen](../../sims/sleep-vs-ticks-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Compare a blocking sleep with a non-blocking ticks_ms timer</summary>
Type: microsim
**sim-id:** sleep-vs-ticks-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-micropython / blocking-vs-nonblocking (https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/blocking-vs-nonblocking). Keep the two-timeline comparison. Change the tasks to a 500 ms LED blink and a 20 cm obstacle check, and use the chapter's `ticks_diff` code.

Learning objective: Compare (Bloom L4, Analyze) — the student can explain how `sleep()` blocks other work and how `ticks_ms()` lets a robot do two jobs at once.

Canvas layout: 700 px wide (responsive), 440 px tall. Three horizontal bands. Top (120 px): controls. Middle (160 px): "Version A: sleep(0.5)" timeline. Bottom (160 px): "Version B: ticks_ms timer" timeline. Both share the same time axis, 0 to 3000 ms, with tick marks every 500 ms.

Visual elements:
- Each timeline has two lanes: "LED blink" and "Obstacle check".
- LED blink lane: green blocks when the LED is on, gray when off.
- Obstacle check lane: small blue vertical marks each time the sensor is read. Marks that the robot missed (because it was sleeping) are drawn as empty red dashed outlines.
- In version A, the sleep periods are drawn as a wide gray hatched bar across both lanes, labeled "sleeping - can't do anything else".
- A vertical orange NOW cursor sweeps left to right across both timelines together.
- A wall icon appears at a random time on the right of each timeline as a red triangle labeled "Obstacle appears". A yellow arrow shows the delay between the obstacle appearing and the first blue mark that detects it, with the number in ms.
- Two code snippets below each timeline title (12 px monospace): version A uses `sleep(0.5)`, version B uses `if ticks_diff(ticks_ms(), last) >= 500:`.

Interactive controls:
- "Play / Pause" and "Reset" buttons. Speed toggle 1x, 2x, 4x (default 1x).
- Slider "Blink interval" 100 to 1000 ms, default 500, step 100.
- Slider "Sensor check every" 10 to 100 ms, default 20, step 10 (version B only; version A can only check once per loop).
- Button "Drop an obstacle now" places the obstacle at the current NOW time.

Behavior:
- Version A: each loop toggles the LED, then sleeps for the blink interval. It reads the sensor once per loop, right after waking up. The delay to detect an obstacle is the time until the next wake-up, up to the full interval (up to 500 ms with defaults).
- Version B: the loop never sleeps. It reads the sensor every "Sensor check every" ms, and toggles the LED only when `ticks_diff()` shows the blink interval has passed. The worst-case detection delay equals the sensor check interval (20 ms by default).
- A results panel at the bottom right shows "Detection delay: A = X ms, B = Y ms" after each obstacle. At 40 cm/s driving speed the panel also shows "Robot A traveled Z cm before it noticed" using Z = 40 x delay / 1000.
- A small note appears when the blink interval is over 500 ms: "Longer sleep = a longer blind spot."

Default state: paused at 0 ms, blink interval 500 ms, sensor check every 20 ms, no obstacle placed.

Assessment/Challenge: Drop an obstacle just after version A starts a 500 ms sleep. How many centimeters does the robot travel before version A sees it at 40 cm/s? Answer: about 20 cm (500 ms x 40 cm/s). Version B reacts in 20 ms or less, which is under 1 cm.

Responsive: redraw on window resize.
</details>

You saw that `sleep()` is fine for short pauses, but a robot that sleeps cannot watch its sensor. When your robot has to blink an LED and watch for walls at the same time, use `ticks_ms()` and `ticks_diff()` instead. This is the timing pattern behind the collision avoidance programs later in the course.

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
