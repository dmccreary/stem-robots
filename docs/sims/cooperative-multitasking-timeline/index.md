---
title: "Cooperative Multitasking Timeline"
description: "Compare a blocking robot loop that calls time.sleep() with uasyncio tasks that pause at await, and see which BLE messages and obstacles each program handles late."
image: /sims/cooperative-multitasking-timeline/cooperative-multitasking-timeline.png
og:image: /sims/cooperative-multitasking-timeline/cooperative-multitasking-timeline.png
twitter:image: /sims/cooperative-multitasking-timeline/cooperative-multitasking-timeline.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Cooperative Multitasking Timeline

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Cooperative Multitasking Timeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/cooperative-multitasking-timeline/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A swarm robot has three jobs that all feel like they happen "at once": blink a status
LED, check for new BLE messages, and read its distance sensor. MicroPython runs one line
at a time, so the robot's single **thread** (one stream of instructions) has to take
turns. This MicroSim draws that thread as a timeline so you can see exactly what it is
doing at every moment.

- **Panel A (Blocking)** runs one `while True:` loop: blink, check BLE, read the sensor,
  then call `time.sleep(0.5)`. The red stripes show the sleep. During a sleep the whole
  thread is stuck, so nothing else can happen.
- **Panel B (Cooperative)** runs the same three jobs as separate `uasyncio` tasks. Each
  task does a tiny bit of work and then pauses at `await asyncio.sleep(...)`. While one
  task waits, the **event loop** (the part of `uasyncio` that picks the next task) hands
  the thread to another task that is ready.

Each job takes the same amount of work time in both panels. The only difference is what
the thread does while it waits. Outside events arrive as triangles under each panel: a
green triangle is a BLE message, and a red triangle is an obstacle. A green check means
the event was handled within 50 ms. A red X shows how many milliseconds late it was.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section on multithreading and asynchronous programming.

## How to Use

1. **Predict first.** Before you press anything, guess: if a BLE message arrives while
   Panel A is sleeping, how long will it wait?
2. Press **BLE message** or **Obstacle**. The clock starts, and the event appears at the
   purple playhead in both panels. Watch how long each panel takes to notice it.
3. Press **Random events** to drop a new event every 0.3 to 1 second. Let it run, then
   compare the **On time**, **Late**, and **Thread idle** counters.
4. Drag **Sensor read** up to 100 ms. Panel B now gets late events too. The red warning
   explains why: a long job with no `await` still blocks everyone.
5. Uncheck **Long time.sleep() in Panel A**. Panel A now sleeps for only the BLE poll
   time. Does it catch up with Panel B?
6. The code box to the right of each panel highlights the line that is running right now.
   In Panel B, the light purple lines are tasks that are paused at `await`.

## Lesson Plan

### Learning Objective

Students will *compare* (Bloom's Taxonomy: Analyze) a blocking loop built on
`time.sleep()` with cooperative `uasyncio` tasks built on `await asyncio.sleep()`,
*explain* why the cooperative version lets other tasks run during a pause, and *predict*
which outside events a blocking program will handle late.

### Grade Level

Grades 8–12

### Duration

20–25 minutes

### Prerequisites

- `while` loops, functions, and `time.sleep()` from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- Reading a distance sensor from
  [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md)
- Checking for BLE messages from
  [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md)
- The `uasyncio` example in the Chapter 13 section "Doing Two Things at Once"

### Activities

1. **Prediction (5 min):** Project the sim in its paused state. Ask students to write a
   prediction: "A BLE message arrives 0.1 s into Panel A's 0.5 s sleep. How many
   milliseconds late will it be handled?" Collect a few predictions before running it.
2. **Guided exploration (8 min):** Pairs press **Random events** and run the clock for
   about 10 seconds, then record the three counters for each panel. Pairs then set
   **Sensor read** to 100 ms and record the counters again. They should notice that
   Panel B's lateness now clusters around 100 ms, which is the length of the
   un-awaited sensor read.
3. **Variable isolation (5 min):** Pairs uncheck the long-sleep box and vary the
   **Blink period** and **BLE poll** sliders one at a time. Ask them to state which
   setting controls the worst-case delay in each panel.
4. **Transfer to hardware (5 min):** Students annotate a copy of the chapter's
   `uasyncio` example and mark every line where the event loop is allowed to switch
   tasks. They should mark only the `await` lines.

### Discussion Questions

- Panel A's thread is idle about 95% of the time, yet it handles most events late. How
  can a thread be "idle" and still unable to respond?
- Why does Panel B's worst-case delay depend on the *longest* job that has no `await`,
  rather than on the blink period?
- When would a real `_thread` sensor loop (from the chapter's multithreading example) be
  a better choice than a `uasyncio` task?

### Assessment

- **Formative:** During Activity 2, each pair reports the worst-case lateness for both
  panels and explains the number in one sentence that names the blocking line of code.
- **Exit ticket:** "A student adds `time.sleep(0.2)` inside one `uasyncio` task. Predict
  what happens to BLE messages, and name the one-word fix." (Expected answer: every task
  stalls for up to 0.2 s; replace it with `await asyncio.sleep(0.2)`.)
- **Rubric (4-point):** *Exemplary* — correctly predicts lateness in both panels and
  explains it through the blocking line; *Proficient* — correct prediction with a partial
  explanation; *Developing* — identifies that Panel A is slower but cannot say why;
  *Beginning* — cannot connect `sleep()` to missed events.

## References

1. [MicroPython asyncio library documentation](https://docs.micropython.org/en/latest/library/asyncio.html) —
   official reference for `asyncio.run()`, `create_task()`, and `asyncio.sleep()`.
2. [MicroPython time module documentation](https://docs.micropython.org/en/latest/library/time.html) —
   explains the blocking `time.sleep()` and the `ticks_ms()` helpers used for
   non-blocking timing.
3. [Application of uasyncio to hardware interfaces (Peter Hinch)](https://github.com/peterhinch/micropython-async/blob/master/v3/docs/TUTORIAL.md) —
   a detailed community tutorial on cooperative scheduling in MicroPython.
4. [Cooperative multitasking (Wikipedia)](https://en.wikipedia.org/wiki/Cooperative_multitasking) —
   background on task switching that happens only at voluntary pause points.
5. [Event loop (Wikipedia)](https://en.wikipedia.org/wiki/Event_loop) — the scheduling
   idea behind the "event loop" lane in Panel B.
6. [Blocking vs Non-Blocking MicroSim (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/blocking-vs-nonblocking) —
   the earlier MicroSim this timeline was adapted from.
