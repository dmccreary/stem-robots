---
title: Robot Loop Pattern Explorer
description: Step through a for loop, a while loop, and a nested loop that blink a robot's NeoPixels or drive it toward a wall, and predict how many times each loop body runs.
image: /sims/robot-loop-pattern-explorer/robot-loop-pattern-explorer.png
og:image: /sims/robot-loop-pattern-explorer/robot-loop-pattern-explorer.png
twitter:image: /sims/robot-loop-pattern-explorer/robot-loop-pattern-explorer.png
social:
   cards: false
quality_score: 100
---

# Robot Loop Pattern Explorer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Robot Loop Pattern Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/robot-loop-pattern-explorer/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Robots repeat the same actions again and again, so loops are everywhere in
robot code. This MicroSim lets you run three kinds of loops one step at a time
and count how many times the loop body runs.

- The **for loop** tab runs `for i in range(n)`. The loop variable `i` counts
  from 0 up to `n - 1`, and the robot blinks pixel 0 on even values of `i`
  and pixel 1 on odd values.
- The **while loop** tab runs the chapter's wall-approach code. The robot
  drives toward a wall while `distance_cm > 20`, and the distance shrinks by
  the step size each time.
- The **nested loops** tab puts one loop inside another. The outer loop picks
  a color and the inner loop flashes it. The total is outer × inner.

On the left you see the code. The yellow bar marks the lines that just ran,
and the orange badge shows the current value of the loop variable. On the
right you see the robot and the printed output. The counter at the bottom adds
one square for every finished iteration.

## How to Use

1. Pick a tab: **for loop**, **while loop**, or **nested loops**.
2. Set the numbers in the bottom row. Changing any number resets the loop.
3. **Predict** how many times the loop body will run. Write your guess down.
4. Press **Step** to run one iteration, or **Run** to play at the speed set by
   the slider. Press **Reset** to start over.
5. Compare the **Iterations** counter with your prediction.
6. In the while tab, check **Forget to update distance_cm**. The distance never
   changes, so the condition never becomes `False`. After 30 steps, a red
   banner tells you the loop would run forever.

This MicroSim goes with the loop section of
[Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

15–20 minutes

### Prerequisites

- Variables, numbers, and comparison operators such as `>`
  ([Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))
- The `if` statement and indented code blocks (Chapter 4, "Making Decisions with if/elif/else")

### Learning Objective

Students will be able to **predict** (Bloom's Taxonomy: Apply) how many times a
loop body runs for a `for` loop, a `while` loop, and a nested loop, and choose
`for` or `while` for a given robot task.

### Activities

1. **Warm-up prediction (3 min).** On the for tab, set `range(n)` to 6. Ask:
   "How many blinks? What is the last value of `i`?" Students write answers,
   then press **Run** to check. Many students expect the last value to be 6;
   the badge shows 5.
2. **While loop tracing (5 min).** On the while tab, students predict the
   iteration count for start 100 and step 5 (answer: 16), then for start 60
   and step 10 (answer: 4). Discuss why 20 does not run: the condition is
   `distance_cm > 20`, and `20 > 20` is `False`.
3. **The infinite loop (3 min).** Students check **Forget to update
   distance_cm** and press **Run**. Ask them to explain, in one sentence, why
   the loop never ends and what line fixes it.
4. **Nested loops (4 min).** Students set outer = 4 and inner = 5, predict the
   total (answer: 20), and check it. Then they try outer = 5 and inner = 6 to
   see how fast the total grows.
5. **Choose the loop (3 min).** Give three robot tasks: "blink 10 times",
   "drive until the wall is close", and "check the sensor forever". Students
   choose `for` or `while` for each and justify their choice.

### Assessment

- **Challenge:** Set the nested loop to outer = 4 and inner = 5 before pressing
  Run. Predict the total, then check the counter. *Answer: 20.*
- **Challenge:** Use the while tab with start 60 and step 10. Predict the
  number of iterations. *Answer: 4 (60, 50, 40, and 30 run; 20 does not).*
- **Exit ticket:** "Write a loop that blinks an LED 8 times. Which loop did you
  choose and why?"
- **Rubric (4-point):** *Exemplary* predicts all three loop counts correctly,
  including the `while` boundary case, and justifies `for` vs. `while` by
  whether the count is known in advance. *Proficient* predicts counts correctly
  but gives a vague justification. *Developing* is off by one on `range()` or
  the `while` boundary. *Beginning* cannot predict counts without running the
  loop.

## References

1. [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md) - the for, while, and nested loop examples used in this MicroSim.
2. [Python Tutorial: More Control Flow Tools](https://docs.python.org/3/tutorial/controlflow.html) - official guide to `for` statements and the `range()` function.
3. [For loop (Wikipedia)](https://en.wikipedia.org/wiki/For_loop) - background on counting loops across programming languages.
4. [While loop (Wikipedia)](https://en.wikipedia.org/wiki/While_loop) - how condition-controlled loops work.
5. [Infinite loop (Wikipedia)](https://en.wikipedia.org/wiki/Infinite_loop) - why a loop whose condition never changes never ends.
