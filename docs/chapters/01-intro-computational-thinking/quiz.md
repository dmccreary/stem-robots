# Quiz: Introduction to Computational Thinking and Physical Computing

Test your understanding of computational thinking, physical computing, and electronics basics with these questions.

---

#### 1. Which of the four pillars of computational thinking involves breaking a large problem into smaller, more manageable pieces?

<div class="upper-alpha" markdown>
1. Abstraction
2. Pattern Recognition
3. Decomposition
4. Algorithm Design
</div>

??? question "Show Answer"
    The correct answer is **C**. Decomposition means taking a big problem and cutting it into smaller, manageable pieces. For example, the challenge of "avoid walls" decomposes into three tasks: make motors spin, read the sensor, and if distance is too small, stop and turn. Abstraction hides details, pattern recognition finds repeating structures, and algorithm design writes the precise steps.

    **Concept Tested:** Decomposition

---

#### 2. In the context of robot programming, what does abstraction allow you to do?

<div class="upper-alpha" markdown>
1. Repeat a block of code a fixed number of times
2. Focus on what the robot should do without worrying about low-level electrical details
3. Break the collision avoidance task into sensor, decision, and motor steps
4. Find patterns that appear in multiple robot behaviors
</div>

??? question "Show Answer"
    The correct answer is **B**. Abstraction means focusing on what matters and hiding details that don't. Writing `motor_forward(speed=75)` hides dozens of low-level pin-level details so you can focus on what the robot should do rather than how electricity makes it happen. The other options describe decomposition (A and C) or pattern recognition (D).

    **Concept Tested:** Abstraction

---

#### 3. When you press the gas pedal in a car without thinking about the fuel injectors, you are using which pillar of computational thinking?

<div class="upper-alpha" markdown>
1. Algorithm Design
2. Decomposition
3. Pattern Recognition
4. Abstraction
</div>

??? question "Show Answer"
    The correct answer is **D**. The gas pedal is an abstraction — it hides the complexity of the engine from the driver. You interact with the simple interface (pedal) without needing to know how fuel injection works. This is the same principle used when calling `motor_forward(speed=75)` instead of writing all the low-level pin control code.

    **Concept Tested:** Abstraction

---

#### 4. What is a logic error in programming?

<div class="upper-alpha" markdown>
1. A typo or grammar mistake that prevents the code from running
2. An error that occurs when a wire is disconnected from the circuit
3. A bug where the code runs but produces the wrong behavior
4. A missing colon at the end of an if statement
</div>

??? question "Show Answer"
    The correct answer is **C**. A logic error means your code runs without crashing, but it does the wrong thing. This is the harder type of bug to find because no error message appears automatically. Options A and D describe syntax errors (grammar mistakes Python catches before running). Option B describes a hardware issue, not a code error.

    **Concept Tested:** Debugging Fundamentals

---

#### 5. What does physical computing mean in the context of this course?

<div class="upper-alpha" markdown>
1. Using a physical keyboard to type code faster
2. Storing programs on a physical USB drive
3. Connecting a program to the real world through sensors and motors
4. Writing code that simulates physical motion on screen
</div>

??? question "Show Answer"
    The correct answer is **C**. Physical computing connects software to the physical world through sensors (inputs that read real-world quantities) and actuators like motors (outputs that cause physical actions). Most programs are purely digital. Physical computing is different because code directly causes physical movement and reads real-world measurements.

    **Concept Tested:** Physical Computing

---

#### 6. Four AA batteries are connected end-to-end to power a robot. What is the total voltage?

<div class="upper-alpha" markdown>
1. 1.5 V
2. 3.0 V
3. 6.0 V
4. 9.0 V
</div>

??? question "Show Answer"
    The correct answer is **C**. Each AA alkaline battery provides 1.5 volts. Four batteries connected in series (end-to-end) add their voltages together: 4 × 1.5 V = 6.0 V. This 6 V powers the microcontroller, motors, and sensors on the robot. Connecting in series multiplies voltage; connecting in parallel would keep voltage the same but increase capacity.

    **Concept Tested:** AA Batteries

---

#### 7. What is an algorithm?

<div class="upper-alpha" markdown>
1. A physical wire that connects two components
2. A type of sensor that detects light
3. A precise set of steps that solves a problem
4. The voltage difference between two points in a circuit
</div>

??? question "Show Answer"
    The correct answer is **C**. An algorithm is a precise set of steps that solves a problem. A recipe, driving directions, and shoe-tying instructions are all algorithms. In robotics, algorithms are written in MicroPython — for example, the collision avoidance algorithm specifies exactly when to stop, reverse, and turn. The other options describe hardware components or electrical quantities.

    **Concept Tested:** Algorithm Design

---

#### 8. What is a circuit in electronics?

<div class="upper-alpha" markdown>
1. A program stored in flash memory
2. A complete loop that allows electricity to flow from a power source, through components, and back
3. A sensor that detects when the robot bumps into an object
4. A table listing all the GPIO pin numbers on the board
</div>

??? question "Show Answer"
    The correct answer is **B**. A circuit is a complete loop for electricity to travel through — from the positive terminal of a power source, through components, and back to the negative terminal. If any part of the loop breaks, current stops and nothing works. Options A, C, and D describe software, sensors, and hardware documentation respectively.

    **Concept Tested:** Basic Circuits

---

#### 9. What does the build-test-improve cycle teach you about engineering?

<div class="upper-alpha" markdown>
1. Engineers write perfect code before testing it
2. Hardware problems are always caused by software bugs
3. Improvement comes from writing as many lines of code as possible
4. Engineers iterate by testing their work and fixing one thing at a time
</div>

??? question "Show Answer"
    The correct answer is **D**. The build-test-improve cycle means you create a working prototype, test it, observe what breaks, and improve it — then repeat. No engineer writes perfect code on the first try. The key discipline is changing only one thing at a time during improvement, so you know which change fixed the problem. This is the same approach as the scientific method.

    **Concept Tested:** Build-Test-Improve Cycle

---

#### 10. Which of the following is an example of pattern recognition in robotics?

<div class="upper-alpha" markdown>
1. Writing the exact steps to reverse a motor when an obstacle is detected
2. Hiding pin-level voltage details behind a `motor_forward()` function
3. Noticing that "read sensor, decide, move motor" appears in collision avoidance AND line following
4. Splitting the "avoid walls" problem into sensing, deciding, and moving subtasks
</div>

??? question "Show Answer"
    The correct answer is **C**. Pattern recognition means finding structure that repeats and reusing it. The sense-decide-act loop is a pattern that appears in collision avoidance, line following, and light tracking — once you spot it, you understand all three behaviors. Option A is algorithm design, option B is abstraction, and option D is decomposition.

    **Concept Tested:** Pattern Recognition

---
