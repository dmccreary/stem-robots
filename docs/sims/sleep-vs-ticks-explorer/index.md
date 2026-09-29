---
title: Sleep vs Timer Explorer
description: Compare a robot that blinks its LED with sleep() against one that uses a ticks_ms() timer, drop an obstacle, and measure how long each one takes to notice it.
image: /sims/sleep-vs-ticks-explorer/sleep-vs-ticks-explorer.png
og:image: /sims/sleep-vs-ticks-explorer/sleep-vs-ticks-explorer.png
twitter:image: /sims/sleep-vs-ticks-explorer/sleep-vs-ticks-explorer.png
social:
   cards: false
quality_score: 100
---

# Sleep vs Timer Explorer

<iframe src="main.html" height="517px" width="100%" scrolling="no"></iframe>

[Run the Sleep vs Timer Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/sleep-vs-ticks-explorer/main.html"
        height="517px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Two robots have the same two jobs: blink an LED every half second, and watch
for a wall with the distance sensor. They solve the timing problem in two
different ways.

- **Version A** uses `sleep(0.5)`. Each time through the loop it reads the
  sensor, toggles the LED, and then sleeps. While it sleeps it cannot do
  anything else, so its timeline is hatched gray almost all the way across.
  It only reads the sensor (blue marks) when it wakes up. The red dashed marks
  show the checks it missed.
- **Version B** never sleeps. It reads the sensor every few milliseconds and
  uses `if ticks_diff(ticks_ms(), last) >= 500:` to decide when it is time to
  toggle the LED. Its LED blinks on the same schedule, but its sensor lane is
  full of blue marks.

Both timelines share one time axis from 0 to 3000 ms. An orange **NOW** cursor
sweeps across them. When you drop an obstacle, a red triangle marks the moment
it appears. A gold arrow then shows how long each version takes to notice it,
and the panel converts that delay into centimeters traveled at 40 cm/s.

## How to Use

1. Press **Play** to start the NOW cursor. The dim part of each timeline is the
   future. **Speed** cycles 1x, 2x, and 4x (1x is slow motion, one quarter of
   real time).
2. Press **Drop an obstacle now** while the cursor moves. If you press it
   before you press Play, the obstacle appears at a random time.
3. Read the **Detection delay** for A and B, and how far each robot traveled
   before it noticed the wall.
4. Move the **Blink interval** slider. A longer sleep makes version A's blind
   spot longer.
5. Move the **Sensor check every** slider to see how often version B looks at
   its sensor. Only version B uses this setting.

This MicroSim goes with the timers section of
[Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

15–20 minutes

### Prerequisites

- `while True:` main loops (Chapter 4, "Repeating Actions with Loops")
- `if` statements (Chapter 4, "Making Decisions with if/elif/else")
- `sleep()`, `ticks_ms()`, and `ticks_diff()` (Chapter 4, "Timers and Delays")
- Speed as distance per unit of time (general math and science background)

### Learning Objective

Students will be able to **compare** (Bloom's Taxonomy: Analyze) a blocking
`sleep()` loop with a non-blocking `ticks_ms()` timer loop, and explain how
`sleep()` delays a robot's reaction to its sensor while `ticks_ms()` lets it do
two jobs at once.

### Activities

1. **Predict (3 min).** Before playing, ask: "Both robots blink every 500 ms.
   Which one will notice a wall faster, and by how much?" Students write a
   number of milliseconds for each.
2. **Measure (5 min).** Students play the timeline several times and drop
   obstacles at different moments. They record A's and B's detection delays
   in a table and find the largest delay they can produce for version A.
3. **Vary the interval (4 min).** Students set the blink interval to 1000 ms
   and repeat. They describe how A's worst-case delay relates to the interval
   (it equals the interval) and how B's relates to the check period.
4. **Connect to safety (3 min).** Using the centimeters-traveled line, students
   decide which version they would trust to stop a robot 20 cm from a wall,
   and justify the choice.

### Assessment

- **Challenge:** Drop an obstacle just after version A starts a 500 ms sleep.
  How many centimeters does the robot travel at 40 cm/s before version A sees
  it? *Answer:* about 20 cm (500 ms × 40 cm/s). Version B reacts in 20 ms or
  less, which is under 1 cm.
- **Exit ticket:** "Rewrite `led.toggle(); sleep(0.5)` so the robot can still
  check its sensor while it blinks." A correct answer uses `ticks_ms()` and
  `ticks_diff()` with a saved `last` time.
- **Rubric (4-point):** *Exemplary* states that A's worst-case delay equals the
  sleep time and B's equals the check period, and uses measured data to
  justify the choice of B. *Proficient* identifies B as faster with correct
  measurements. *Developing* notices B is faster but cannot explain why.
  *Beginning* believes the LED blink rate determines how fast the robot
  reacts in both versions.

## References

1. [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md) - the `sleep()` and `ticks_ms()` timing patterns this MicroSim compares.
2. [MicroPython time module](https://docs.micropython.org/en/latest/library/time.html) - official documentation for `sleep()`, `ticks_ms()`, and `ticks_diff()`.
3. [Busy waiting (Wikipedia)](https://en.wikipedia.org/wiki/Busy_waiting) - background on loops that repeatedly check a condition instead of sleeping.
4. [Polling (computer science) (Wikipedia)](https://en.wikipedia.org/wiki/Polling_(computer_science)) - why how often a program checks an input sets its reaction time.
5. [Blocking vs Non-Blocking (Learning MicroPython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/blocking-vs-nonblocking) - the earlier two-timeline MicroSim this one adapts.
