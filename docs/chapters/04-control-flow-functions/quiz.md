# Quiz: Control Flow, Functions, and Exception Handling

Test your understanding of conditionals, loops, functions, scope, and exception handling with these questions.

---

#### 1. In an if/elif/else chain, how does Python decide which branch to execute?

<div class="upper-alpha" markdown>
1. It runs every branch that has a True condition
2. It checks conditions from top to bottom and runs the first branch that is True, then skips the rest
3. It always runs the else branch last, in addition to whichever branch matched
4. It evaluates all conditions simultaneously and picks the most specific one
</div>

??? question "Show Answer"
    The correct answer is **B**. Python evaluates conditions in order, from the first `if` downward. The moment one condition is `True`, it runs that block and skips all remaining `elif` and `else` branches. Exactly one branch runs per execution. This is important for the collision avoidance code: only the most urgent distance condition (closest match first) triggers the robot's response.

    **Concept Tested:** Elif and Else Clauses

---

#### 2. What is the key difference between a `for` loop and a `while` loop?

<div class="upper-alpha" markdown>
1. `for` loops can only iterate over numbers; `while` loops can iterate over strings
2. `for` loops repeat a fixed number of times or over a sequence; `while` loops repeat as long as a condition is True
3. `while` loops are faster than `for` loops at the same task
4. `for` loops require a `break` statement to stop; `while` loops stop automatically
</div>

??? question "Show Answer"
    The correct answer is **B**. A `for` loop is used when you know in advance how many repetitions you need, or when iterating over every item in a list. A `while` loop continues as long as its condition is `True` — ideal for running the robot's main loop forever (with `while True:`) or waiting until a sensor reads below a threshold. Neither loop type requires `break` to stop in normal usage.

    **Concept Tested:** For Loop / While Loop

---

#### 3. What happens when you call `stop_motors()` in the following code? `def stop_motors(): print("Motors stopped.")`

<div class="upper-alpha" markdown>
1. An error occurs because `stop_motors` was never assigned a value
2. The function definition runs again and redefines the function
3. The code inside the function runs — it prints "Motors stopped."
4. Nothing happens because function definitions only run when the program starts
</div>

??? question "Show Answer"
    The correct answer is **C**. Calling a function by writing its name followed by parentheses causes the body of the function to execute at that moment. The `def` keyword only defines the function — it does not run it. Calling `stop_motors()` makes the program jump into the function body, run `print("Motors stopped.")`, and then return to where it was called.

    **Concept Tested:** Function Definition

---

#### 4. What is a local variable in MicroPython?

<div class="upper-alpha" markdown>
1. A variable defined in `config.py` that only controls the left motor
2. A variable created inside a function that exists only for the duration of that function call
3. A variable that stores data on the board's local flash memory, not in RAM
4. A variable that can be read by any function in the entire program
</div>

??? question "Show Answer"
    The correct answer is **B**. A local variable is created inside a function and disappears when the function ends. It cannot be accessed from outside the function. This prevents naming conflicts — two different functions can both have a local variable named `speed` without interfering with each other. Option D describes a global variable, which lives outside all functions.

    **Concept Tested:** Scope and Local Variables

---

#### 5. Why do robot programs use `while True:` as the main loop?

<div class="upper-alpha" markdown>
1. It is the only loop type that can call functions
2. It makes the program use less memory than a `for` loop
3. The robot should continuously check sensors and respond to the environment until explicitly stopped
4. `while True` is the only valid way to import the `time` module
</div>

??? question "Show Answer"
    The correct answer is **C**. A robot's job is never "done" in the traditional sense — it should keep sensing and reacting until you decide to stop it. `while True` creates an infinite loop that runs forever. You stop it deliberately (by pressing Ctrl+C in Thonny), which the program handles using a `try/except KeyboardInterrupt` block. It has no relationship to function calls or imports.

    **Concept Tested:** While Loop

---

#### 6. What is the purpose of the `finally` block in a try/except/finally structure?

<div class="upper-alpha" markdown>
1. It catches errors that the `except` block missed
2. It runs only when no exception occurred — it is the success path
3. It runs no matter what — even if an exception occurred or Ctrl+C was pressed — so cleanup always executes
4. It restarts the `try` block from the beginning after an exception is handled
</div>

??? question "Show Answer"
    The correct answer is **C**. The `finally` block is guaranteed to run regardless of whether the `try` block succeeded, an exception was caught by `except`, or the program was stopped with Ctrl+C (`KeyboardInterrupt`). This makes it the correct place for hardware cleanup code — stopping motors, turning off LEDs — so the robot always shuts down safely even after a crash.

    **Concept Tested:** Try Except Finally

---

#### 7. When a function modifies a global variable, what keyword must be used inside the function?

<div class="upper-alpha" markdown>
1. `extern`
2. `global`
3. `shared`
4. `public`
</div>

??? question "Show Answer"
    The correct answer is **B**. To modify a global variable from inside a function, you must declare it with the `global` keyword at the start of the function: `global is_moving`. Without this, Python creates a new local variable with the same name inside the function, leaving the global unchanged. The keywords `extern`, `shared`, and `public` do not exist in Python — they come from other languages.

    **Concept Tested:** Global Variables

---

#### 8. What does `from time import sleep` do differently from `import time`?

<div class="upper-alpha" markdown>
1. `from time import sleep` is faster because it skips loading the rest of the `time` module
2. `from time import sleep` allows you to call `sleep(1)` directly; `import time` requires `time.sleep(1)`
3. `from time import sleep` makes `sleep()` available only inside functions, not at the top level
4. `from time import sleep` imports an older, slower version of the `sleep` function
</div>

??? question "Show Answer"
    The correct answer is **B**. When you write `from time import sleep`, you import just the `sleep` name into your local namespace. You can then call it as `sleep(1)`. With `import time`, the module is loaded under the name `time`, and you must call `time.sleep(1)`. Both access the same function — the difference is how you reference it. The `from...import` style is more concise for frequently used functions.

    **Concept Tested:** Importing Modules

---

#### 9. How does `ticks_diff()` differ from simply subtracting two `ticks_ms()` values?

<div class="upper-alpha" markdown>
1. `ticks_diff()` measures time in microseconds while subtraction measures milliseconds
2. `ticks_diff()` handles the counter wrapping around (overflow) correctly; plain subtraction fails after about 12 days of uptime
3. `ticks_diff()` pauses the program while waiting; subtraction returns immediately
4. `ticks_diff()` only works inside interrupt handlers; subtraction works everywhere
</div>

??? question "Show Answer"
    The correct answer is **B**. The `ticks_ms()` counter has a maximum value and wraps back to zero (overflows) after a period of time. When this happens, plain subtraction gives a negative or incorrect result. `ticks_diff(newer, older)` is designed to handle this overflow correctly, always returning the right elapsed time. For a robot that might run for hours, using `ticks_diff` is the safe choice.

    **Concept Tested:** Timers and Delays

---

#### 10. What is the correct way to write a function that returns the larger of two numbers?

<div class="upper-alpha" markdown>
1. `def bigger(a, b): print(a if a > b else b)`
2. `def bigger(a, b): return a if a > b else b`
3. `def bigger(a, b): bigger = a if a > b else b`
4. `bigger(a, b) = a if a > b else b`
</div>

??? question "Show Answer"
    The correct answer is **B**. The `return` keyword sends a value back to the caller. Using `print()` (A) only displays the result — the caller cannot use the value in further calculations. Option C stores the result in a local variable but never sends it back. Option D is not valid Python syntax — function definitions require the `def` keyword and the body must be indented.

    **Concept Tested:** Return Values

---
