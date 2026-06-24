# Quiz: MicroPython and Development Environment Setup

Test your understanding of MicroPython, the Thonny IDE, data types, and operators with these questions.

---

#### 1. What is the purpose of holding the BOOTSEL button while plugging in the USB cable?

<div class="upper-alpha" markdown>
1. It saves the current program to the computer before uploading new firmware
2. It puts the board into bootloader mode so it appears as a USB drive for firmware flashing
3. It resets the board and clears all stored programs
4. It enables the serial port so Thonny can communicate with the board
</div>

??? question "Show Answer"
    The correct answer is **B**. Holding BOOTSEL (Boot Select) while connecting USB tells the RP2040 chip to start in bootloader mode instead of running the stored program. In this mode, the board appears on your computer as a USB drive named `RPI-RP2`. You then drag the UF2 firmware file onto it. Releasing BOOTSEL after the drive appears allows normal operation.

    **Concept Tested:** BOOTSEL Button

---

#### 2. What is a UF2 file and how is it used?

<div class="upper-alpha" markdown>
1. A MicroPython source code file saved to the board's flash storage
2. A compressed backup of all programs stored on the robot
3. A firmware file in USB Flashing Format that is dragged onto the board to install MicroPython
4. A configuration file that sets the WiFi network name and password
</div>

??? question "Show Answer"
    The correct answer is **C**. UF2 stands for USB Flashing Format. It is a standardized file format that allows you to install new firmware by simply dragging and dropping the file onto the board when it appears as a USB drive. No special programming hardware is needed. Source code files (A) are `.py` files, not UF2. Configuration (D) is handled by `config.py` and `secrets.py`.

    **Concept Tested:** UF2 Firmware File

---

#### 3. What does REPL stand for and what does it do?

<div class="upper-alpha" markdown>
1. Robot Event Processing Layer — handles sensor interrupts in real time
2. Read-Evaluate-Print Loop — an interactive prompt that runs code one line at a time
3. Raspberry Pi Environment Loader — initializes the board when it powers on
4. Remote Execution Protocol Link — connects Thonny to the board over WiFi
</div>

??? question "Show Answer"
    The correct answer is **B**. REPL stands for Read-Evaluate-Print Loop. It is the interactive shell in Thonny's bottom pane (the `>>>` prompt). You type one line of MicroPython, press Enter, and the board runs it immediately and prints the result. This is ideal for experiments — testing one idea at a time without writing and saving a full program.

    **Concept Tested:** REPL Interactive Shell

---

#### 4. Why is the file `main.py` special on the Cytron Maker Pi RP2040?

<div class="upper-alpha" markdown>
1. It is the only file that can import other modules from the board's flash storage
2. It contains the pin configuration constants that all other programs must import
3. The board automatically runs this file every time it powers up or resets
4. It is the only file format that the Thonny IDE can upload to the board
</div>

??? question "Show Answer"
    The correct answer is **C**. When the Cytron board powers up or is reset, MicroPython looks for a file named `main.py` on the flash storage and runs it automatically. Any other filename requires you to manually run it from Thonny. This auto-run behavior is what allows the robot to operate standalone — unplugged from a laptop.

    **Concept Tested:** Thonny File Upload

---

#### 5. In MicroPython, what is the result of the expression `7 / 2`?

<div class="upper-alpha" markdown>
1. `3` (integer, decimal truncated)
2. `3.5` (float, because division always returns a float)
3. `4` (rounded up to nearest whole number)
4. `1` (remainder only, like modulo)
</div>

??? question "Show Answer"
    The correct answer is **B**. In Python and MicroPython, the `/` operator always returns a float, even when both operands are integers. `7 / 2` gives `3.5`. To get integer division (discard the decimal), use `//`: `7 // 2` gives `3`. To get the remainder, use `%`: `7 % 2` gives `1`. This is a common source of bugs for programmers coming from other languages.

    **Concept Tested:** Arithmetic Operators / Float Data Type

---

#### 6. What is wrong with writing `if distance = 15:` in MicroPython?

<div class="upper-alpha" markdown>
1. The variable name `distance` is a reserved Python keyword
2. Using a single `=` inside an if statement assigns a value instead of comparing — this is a SyntaxError
3. The number 15 must be written as `15.0` (a float) inside an if statement
4. The colon at the end is not needed for a single-line if statement
</div>

??? question "Show Answer"
    The correct answer is **B**. In Python, a single `=` is the assignment operator (store a value). The comparison operator is `==` (two equal signs). Writing `if distance = 15:` tries to assign inside a condition, which Python catches as a `SyntaxError` before the program even runs. You must write `if distance == 15:`. The colon at the end is always required.

    **Concept Tested:** Comparison Operators

---

#### 7. Which data type would you use to store the text "Sparky" in MicroPython?

<div class="upper-alpha" markdown>
1. Integer (`int`)
2. Boolean (`bool`)
3. Float (`float`)
4. String (`str`)
</div>

??? question "Show Answer"
    The correct answer is **D**. A string (`str`) is a sequence of characters enclosed in quotes — either single or double. `"Sparky"` is a string. Integers store whole numbers, floats store decimal numbers, and booleans store only `True` or `False`. Strings are used for display text, WiFi credentials, status messages, and robot names.

    **Concept Tested:** String Data Type

---

#### 8. What does the `and` logical operator do in MicroPython?

<div class="upper-alpha" markdown>
1. Returns `True` if at least one of the two conditions is `True`
2. Flips a boolean value — `True` becomes `False` and vice versa
3. Returns `True` only when both conditions are `True`
4. Joins two strings together into one longer string
</div>

??? question "Show Answer"
    The correct answer is **C**. The `and` operator returns `True` only when both sides are `True`. For example, `obstacle_close and robot_moving` is `True` only if both conditions hold simultaneously. Option A describes `or`, option B describes `not`, and option D describes string concatenation with `+`. Using `and` lets you build compound conditions for robot decisions.

    **Concept Tested:** Logical Operators

---

#### 9. What is the purpose of syntax highlighting in the Thonny IDE?

<div class="upper-alpha" markdown>
1. It automatically fixes indentation errors before the program runs
2. It colors different parts of code — keywords, strings, numbers — to make it easier to read and spot typos
3. It underlines any line that will cause a runtime error when executed
4. It converts Python code into machine language that the RP2040 can understand
</div>

??? question "Show Answer"
    The correct answer is **B**. Syntax highlighting colors different categories of code — keywords like `if` and `for` are one color, strings are another, numbers are a third. This makes code easier to read and can reveal typos: if a keyword doesn't get its expected color, something is misspelled. Thonny does not automatically fix errors (A) or compile Python (D). Runtime errors are not underlined in advance (C).

    **Concept Tested:** Syntax Highlighting

---

#### 10. What is the correct MicroPython convention for naming a constant like a maximum motor speed?

<div class="upper-alpha" markdown>
1. `maxSpeed = 65535` (camelCase)
2. `MAX_SPEED = 65535` (UPPERCASE with underscores)
3. `max-speed = 65535` (hyphenated lowercase)
4. `MaxSpeed = 65535` (PascalCase)
</div>

??? question "Show Answer"
    The correct answer is **B**. In Python and MicroPython, constants — values that never change at runtime — are written in UPPERCASE with underscores separating words: `MAX_SPEED = 65535`. This convention signals to any reader that the value is fixed on purpose. Variable names (non-constants) use lowercase with underscores (`motor_speed`). CamelCase (A) and PascalCase (D) are used in other languages. Hyphens (C) are not allowed in Python names.

    **Concept Tested:** Comments and Code Style

---
