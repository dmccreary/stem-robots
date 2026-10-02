---
title: "Clean Shutdown Flow"
description: "Trace a robot program through try, except, and finally as you press Ctrl+C or cause a sensor error, and see why the motor stop code belongs in finally."
image: /sims/clean-shutdown-flow/clean-shutdown-flow.png
og:image: /sims/clean-shutdown-flow/clean-shutdown-flow.png
twitter:image: /sims/clean-shutdown-flow/clean-shutdown-flow.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Clean Shutdown Flow

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Clean Shutdown Flow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/clean-shutdown-flow/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Every robot program in this course wraps its main loop in the same safety
pattern: `try`, `except KeyboardInterrupt`, and `finally`. This MicroSim lets
you watch that pattern run. The left side is a flowchart of the program. The
right side shows a top-down robot, a short explanation, and a console like the
one in Thonny.

When you press **Start robot**, the `try` block starts the main loop and the
wheels begin to spin. Then you pick how the program ends. A gold outline moves
through the flowchart one box at a time, so you can trace the exact path the
program takes. Boxes the program has already run get a green check mark.

The key idea is simple. The `except` block only catches the error it names.
The `finally` block runs no matter what. That is why the "motors off" code
lives in `finally`.

## How to Use

1. Press **Start robot**. The console prints `Robot started. Press Ctrl+C to stop.`
   and the tag under the robot turns green: **MOTORS ON**.
2. Press **Press Ctrl+C**. Watch the gold outline move from `try` to `except`
   to `finally` to the end. The wheels stop when `finally` runs.
3. Press **Reset**, start again, and this time press **Cause a sensor error**.
   A `ValueError` is not a `KeyboardInterrupt`, so the path skips `except`.
   Notice that `finally` still runs and still stops the motors.
4. Uncheck **Include finally block**. The flowchart changes to a program with
   no `finally`. Try both events again. The program ends, but the wheels keep
   spinning and a red banner appears.
5. Hover over any box in the flowchart to read what that block does.

This connects straight back to the chapter:
[Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

15 minutes

### Prerequisites

- Writing a `while True:` main loop (Chapter 4, "Repeating Actions with Loops")
- Reading `if`/`elif`/`else` logic and indented code blocks (Chapter 4)
- Running a program in Thonny and stopping it with the Stop button or Ctrl+C
  ([Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md))

### Learning Objective

Students will be able to **trace** (Bloom's Taxonomy: Apply) the path a program
takes through `try`, `except`, and `finally` for a keyboard interrupt and for an
unhandled error, and explain why motor shutdown code belongs in `finally`.

### Activities

1. **Predict (3 min).** Before anyone clicks, students write down which blocks
   will run when Ctrl+C is pressed, and which will run when a sensor error
   occurs. Collect a few predictions on the board.
2. **Trace both events (5 min).** In pairs, students run each event with the
   `finally` block included and record the path shown by the gold outline and
   the order of the console lines. They compare the result with their
   predictions. Draw attention to the error case: "Motors off. Goodbye!" prints
   *before* the traceback, which shows that `finally` runs before Python
   reports the crash.
3. **Break it on purpose (4 min).** Students uncheck **Include finally block**
   and repeat both events. They describe, in one sentence each, what the robot
   does and why.
4. **Transfer (3 min).** Students look at the complete program at the end of
   the chapter and point to the exact line where real motor stop code would go.

### Assessment

- **Challenge question:** With **Include finally block** unchecked, cause a
  sensor error. What does the robot do? *Expected answer:* the program ends
  with a `ValueError`, but the motors keep running because nothing sent a stop
  command. Re-checking the box and repeating the event shows the motors stop.
- **Exit ticket:** "A student moves the motor stop code from `finally` into the
  `except KeyboardInterrupt` block. Which event will still leave the motors
  running?" *Expected answer:* any error other than Ctrl+C, such as the sensor
  `ValueError`.
- **Rubric (4-point):** *Exemplary* traces both paths correctly, including the
  order of console output, and justifies `finally` in terms of "runs on every
  exit." *Proficient* traces both paths correctly. *Developing* traces the
  Ctrl+C path but believes `except` catches every error. *Beginning* cannot
  identify which block stops the motors.

## References

1. [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md) - the `try`/`except`/`finally` pattern used in every robot program in this course.
2. [Python Tutorial: Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html) - official explanation of `try`, `except`, and clean-up actions with `finally`.
3. [Python Built-in Exceptions: KeyboardInterrupt](https://docs.python.org/3/library/exceptions.html#KeyboardInterrupt) - the exception raised when the user presses Ctrl+C.
4. [Exception handling (Wikipedia)](https://en.wikipedia.org/wiki/Exception_handling_(programming)) - background on how programming languages handle run-time errors.
5. [Mermaid Flowchart Syntax](https://mermaid.js.org/syntax/flowchart.html) - the library used to draw the flowchart in this MicroSim.
