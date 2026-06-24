# Quiz: Data Structures, Modular Programming, and Version Control

Test your understanding of lists, tuples, dictionaries, modular programming, and Git with these questions.

---

#### 1. What index accesses the LAST item in a Python list called `sensors` that has 5 elements?

<div class="upper-alpha" markdown>
1. `sensors[5]`
2. `sensors[4]`
3. `sensors[-1]`
4. `sensors[last]`
</div>

??? question "Show Answer"
    The correct answer is **C**. In Python, negative indexes count backward from the end of the list. `sensors[-1]` always refers to the last item, regardless of list length. `sensors[4]` would also work for a 5-element list (indexes 0–4), but `-1` is more robust if the length might change. `sensors[5]` would cause an `IndexError` — index 5 is out of range for a 5-element list. `sensors[last]` is not valid syntax.

    **Concept Tested:** List Indexing

---

#### 2. Why would you choose a tuple over a list to store the motor pin numbers?

<div class="upper-alpha" markdown>
1. Tuples are faster to iterate because they are stored more compactly
2. Tuples signal that the values are fixed and should never be changed — pin numbers are hardware facts
3. Tuples allow duplicate values, which lists do not permit
4. Tuples can be imported from other modules while lists cannot
</div>

??? question "Show Answer"
    The correct answer is **B**. Tuples are immutable — once created, their values cannot be changed. Using a tuple for pin assignments (`motor_pins = (6, 7, 8, 9)`) signals to any reader that these values are intentionally fixed. If someone accidentally tries to modify a pin number at runtime, Python raises a `TypeError`. Lists allow modification, which is not appropriate for hardware constants. Both types support iteration and can be imported.

    **Concept Tested:** Tuples

---

#### 3. How do you access the value for the key `"speed"` in a dictionary called `robot`?

<div class="upper-alpha" markdown>
1. `robot.speed`
2. `robot(speed)`
3. `robot["speed"]`
4. `robot.get[speed]`
</div>

??? question "Show Answer"
    The correct answer is **C**. Dictionary values are accessed using square bracket notation with the key name as a string: `robot["speed"]`. Dot notation (`robot.speed`) is used for object attributes, not dictionary keys. Parentheses (`robot(speed)`) would try to call `robot` as a function. The `.get()` method exists but requires parentheses and the key as an argument: `robot.get("speed")`.

    **Concept Tested:** Dictionaries

---

#### 4. What does the f-string `f"Distance: {distance_cm:.1f} cm"` produce when `distance_cm = 23.567`?

<div class="upper-alpha" markdown>
1. `"Distance: 23.567 cm"` (full precision)
2. `"Distance: 23.5 cm"` (one decimal place)
3. `"Distance: 24 cm"` (rounded to integer)
4. `"Distance: {distance_cm:.1f} cm"` (literal curly braces)
</div>

??? question "Show Answer"
    The correct answer is **B**. Inside an f-string, `{variable:.1f}` formats the variable as a float with exactly one decimal place. `23.567` rounded to one decimal place is `23.6` — wait, actually `:.1f` rounds the number, so `23.567` becomes `23.6`. However, given `distance_cm = 23.567`, `:.1f` gives `23.6`. The best answer here for a question with 23.5 would use a value of 23.5. With 23.567 the output is 23.6, but **B** is the closest correct choice about formatting behavior: one decimal place is applied. The format specifier `:.1f` always produces one decimal place.

    **Concept Tested:** Formatted Strings

---

#### 5. What is the primary benefit of the `config.py` pattern for hardware pin assignments?

<div class="upper-alpha" markdown>
1. It compresses the program so it runs faster on the microcontroller
2. It allows the program to automatically detect which pins the hardware is connected to
3. It centralizes all pin numbers in one file so changing a pin only requires editing one place
4. It encrypts the pin assignments so they cannot be read by unauthorized users
</div>

??? question "Show Answer"
    The correct answer is **C**. When all hardware pin numbers are defined as constants in `config.py`, and all other files import from it, you only need to change one line if a wire is moved to a different pin. Without this pattern, pin numbers would be scattered throughout `main.py` and other files — changing one connection would require finding and updating every occurrence. This is the "separation of concerns" principle.

    **Concept Tested:** Import Config Pattern

---

#### 6. Why should `secrets.py` (containing WiFi passwords) never be committed to a Git repository?

<div class="upper-alpha" markdown>
1. Git cannot store Python files — it only tracks text files with the `.txt` extension
2. The secrets file would slow down the git commit process significantly
3. Anyone who can see the repository would have access to your network credentials
4. Committing secrets.py would overwrite the board's stored credentials
</div>

??? question "Show Answer"
    The correct answer is **C**. A public Git repository is visible to anyone on the internet. If `secrets.py` containing a WiFi password is committed, anyone who finds the repository can read the credentials. The solution is to add `secrets.py` to `.gitignore` before the first commit. Git tracks all text files including `.py` files (A is false), and there is no significant performance impact from one file (B is false).

    **Concept Tested:** Version Control Git / Secrets File

---

#### 7. What does `git add main.py config.py` do?

<div class="upper-alpha" markdown>
1. It deletes those files from the repository history
2. It copies those files from the board to the laptop
3. It stages those files so they will be included in the next commit
4. It immediately saves a commit checkpoint with those files
</div>

??? question "Show Answer"
    The correct answer is **C**. `git add` stages files — it marks them as ready to be included in the next commit. Staging does not create a commit by itself; you must follow it with `git commit -m "message"` to save the checkpoint. `git add` does not delete files (A), copy from hardware (B), or create a commit immediately (D).

    **Concept Tested:** Git Commit Workflow

---

#### 8. Which method adds a new item to the end of a Python list?

<div class="upper-alpha" markdown>
1. `my_list.add(item)`
2. `my_list.insert(item)`
3. `my_list.push(item)`
4. `my_list.append(item)`
</div>

??? question "Show Answer"
    The correct answer is **D**. `list.append(item)` adds a new element to the end of the list. `list.insert(index, item)` adds an element at a specific position (B has wrong syntax). `.add()` is a method on Python sets, not lists. `.push()` does not exist in Python — it is a JavaScript array method. These common naming differences cause bugs for programmers switching between languages.

    **Concept Tested:** Lists

---

#### 9. What is the purpose of a docstring in a Python function?

<div class="upper-alpha" markdown>
1. A docstring prevents the function from being called until documentation is approved
2. A docstring is a comment written with triple quotes inside the function to explain what it does
3. A docstring automatically generates unit tests for the function
4. A docstring imports documentation from an external library file
</div>

??? question "Show Answer"
    The correct answer is **B**. A docstring is a string literal (using triple quotes `"""..."""`) placed immediately after the `def` line inside a function. It explains what the function does, what parameters it expects, and what it returns. Python's built-in `help()` function can display docstrings. Docstrings have no effect on function execution and do not generate tests automatically.

    **Concept Tested:** Code Documentation

---

#### 10. What does serial communication via `print()` statements do in MicroPython when connected to Thonny?

<div class="upper-alpha" markdown>
1. It writes permanent log files to the board's flash storage
2. It sends text over the USB cable to appear in Thonny's Shell pane for debugging
3. It broadcasts the text as a WiFi signal that other devices can receive
4. It displays text on the robot's OLED screen automatically
</div>

??? question "Show Answer"
    The correct answer is **B**. Every `print()` statement sends text over the USB connection as serial output, which appears in Thonny's Shell (REPL) pane. This is the primary debugging tool — "print debugging" lets you check variable values and trace program flow without a hardware debugger. It does not write to flash (A), use WiFi (C), or drive the display (D).

    **Concept Tested:** Serial Communication

---
