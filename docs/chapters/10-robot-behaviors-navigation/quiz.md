# Quiz: Robot Behaviors and Autonomous Navigation

Test your understanding of open-loop and closed-loop control, collision avoidance, line following, and project file organization with these questions.

---

#### 1. What is the primary weakness of open-loop motor control for autonomous navigation?

<div class="upper-alpha" markdown>
1. Open-loop control requires more lines of code than closed-loop control
2. Open-loop control cannot control motor speed — only on/off states
3. Without sensor feedback, open-loop control drifts over time because motors are imperfect and battery voltage changes
4. Open-loop control only works for forward motion — it cannot turn the robot
</div>

??? question "Show Answer"
    The correct answer is **C**. Open-loop control sends commands to motors without checking whether the intended action actually happened. Real motors vary slightly in speed, and dropping battery voltage causes speed changes over time. Without correction, these errors accumulate — the robot drifts off course. Closed-loop control solves this by continuously measuring the result and correcting errors. Open-loop code is not necessarily longer nor limited to on/off control.

    **Concept Tested:** Open-Loop Motor Control

---

#### 2. What defines a closed-loop feedback system for robot navigation?

<div class="upper-alpha" markdown>
1. The robot uses two closed electrical circuits — one for left motor, one for right motor
2. The system continuously senses the actual state, compares it to the goal, and adjusts motor output to reduce the difference
3. The program wraps all motor code inside a closed `try/finally` block
4. Both sensors and motors share the same closed I2C bus
</div>

??? question "Show Answer"
    The correct answer is **B**. A closed-loop system has a feedback path: sense → compare → act → sense again. The controller measures the actual result, computes the error (difference from the goal), and adjusts its output to reduce that error. For collision avoidance, the sensor reading feeds back into the motor control decision. "Closed" refers to the loop being complete, not to electrical circuits or code structure.

    **Concept Tested:** Closed-Loop Feedback / Feedback Loop

---

#### 3. In the collision avoidance algorithm, why is a random turn direction chosen after stopping?

<div class="upper-alpha" markdown>
1. Random turns use less battery power than always turning the same direction
2. Random turns prevent the robot from getting trapped in corners by varying its recovery direction
3. The random number generator is required by MicroPython's motor control library
4. Random turns allow the robot to map its environment more quickly
</div>

??? question "Show Answer"
    The correct answer is **B**. If the robot always turned left when hitting an obstacle, it could end up in a left-corner trap — repeatedly hitting the same wall and turning into it again. By randomly choosing left or right with equal probability, the robot explores the space more effectively and avoids getting stuck in repetitive loops. Randomness here is an engineering choice for robust navigation, not a library requirement.

    **Concept Tested:** Random Turn Direction

---

#### 4. In the line-following logic, what should the robot do when the left IR sensor detects the line but the right sensor does not?

<div class="upper-alpha" markdown>
1. Stop both motors immediately and wait for the sensors to re-detect the line
2. Spin left in place to find the center of the line
3. Slow the left motor and keep the right motor at full speed to turn right toward the center
4. Increase both motor speeds to drive through the error quickly
</div>

??? question "Show Answer"
    The correct answer is **C**. When the left IR sensor is over the black line and the right is not, the robot has drifted to the right — the line is under the left side. To return to center, the robot turns left, which means slowing the left wheel and running the right wheel faster. This gradual motor differential approach is smoother than spinning in place. Stopping (A) would end the following behavior.

    **Concept Tested:** Motor Differential Adjust / Dual IR Sensor Reading

---

#### 5. What is the `STOP_DIST_CM` constant in the collision avoidance program, and where should it be defined?

<div class="upper-alpha" markdown>
1. It is the minimum safe distance the ToF sensor can accurately measure, defined inside the sensor driver library
2. It is the threshold distance (in cm) below which the robot stops, defined as a constant in `config.py`
3. It is the distance the robot reverses before turning, defined as a parameter in the `turn_left()` function
4. It is the maximum range of the ToF sensor, defined automatically by the VL53L0X driver
</div>

??? question "Show Answer"
    The correct answer is **B**. `STOP_DIST_CM` is a tunable threshold constant — if the sensor reads below this value, the robot stops and turns. Placing it as a named constant (in UPPERCASE) in `config.py` makes it easy to adjust during tuning without digging through logic code. The chapter specifically notes that 20 cm and 50 cm are starting points — actual values must be tuned for each specific environment.

    **Concept Tested:** Distance Threshold / Config File Pattern

---

#### 6. What makes a robot dance sequence different from collision avoidance behavior?

<div class="upper-alpha" markdown>
1. Dance sequences use faster motor speeds that the sensors cannot process quickly enough
2. Dance sequences are open-loop timed patterns — the moves are pre-programmed, not reactive to sensor input
3. Dance sequences require a separate microcontroller to run the music synchronization
4. Dance sequences use a different set of motor pins than normal navigation
</div>

??? question "Show Answer"
    The correct answer is **B**. A robot dance is a choreographed series of timed motor commands — move forward for 0.5 s, spin for 0.5 s, etc. No sensor input changes the sequence. This is open-loop control, which is perfectly appropriate when the path is pre-planned and you want predictable, repeatable motion. Collision avoidance is the opposite: sensor-driven, closed-loop, and reactive. The same motor pins are used for both.

    **Concept Tested:** Robot Dance Sequence / Open-Loop Motor Control

---

#### 7. Which of the following best describes the concept of "motor differential adjust" in line following?

<div class="upper-alpha" markdown>
1. Running one motor faster than the other to steer the robot back toward the line without making a sharp spin
2. Reversing both motors simultaneously when the sensor detects the line was lost
3. Reducing the PWM frequency on one motor to create a smooth turning sound
4. Adjusting the I2C bus speed to read the IR sensors faster during turns
</div>

??? question "Show Answer"
    The correct answer is **A**. Motor differential adjustment means running one wheel at a different speed from the other to create a gradual curve rather than a sharp pivot. When the robot drifts left of the line, the right wheel slows while the left continues at full speed, curving the robot back right. This proportional correction produces smoother tracking than binary stop/spin responses.

    **Concept Tested:** Motor Differential Adjust

---

#### 8. Why does the `.gitignore` file exist in a robot project, and what should it always include?

<div class="upper-alpha" markdown>
1. It lists files that Git should automatically commit without asking for confirmation
2. It tells MicroPython which files to skip when loading modules at startup
3. It lists files and patterns that Git should never track — always includes `secrets.py` to protect WiFi credentials
4. It specifies the order in which files should be committed to maintain correct dependencies
</div>

??? question "Show Answer"
    The correct answer is **C**. A `.gitignore` file lists file names and patterns that Git should completely ignore — they will never be staged or committed. The most critical entry is `secrets.py`, which contains WiFi credentials. If `secrets.py` is committed to a public repository, anyone can read the network password. Other common entries include `__pycache__/` and `.DS_Store`. The file has no effect on MicroPython's module loading.

    **Concept Tested:** Gitignore File / Secrets File Pattern

---

#### 9. The line-following sensor table shows that when both IR sensors read LOW simultaneously, the robot should drive straight. Why might this state occur on a thick black line?

<div class="upper-alpha" markdown>
1. Both sensors have failed and are stuck in the LOW state
2. The thick line covers both sensors simultaneously, so both detect the line and the robot is centered
3. The robot has driven off the track entirely and both sensors are reading ground reflection
4. The I2C bus is saturated and both sensors are returning default LOW values
</div>

??? question "Show Answer"
    The correct answer is **B**. When both IR sensors read LOW (both detecting the line), the robot is positioned over the center of a thick line — both sensors are simultaneously over the black surface. The correct response is to drive straight since the robot is well-centered. This is different from both reading HIGH (both off the line — line is lost), which requires a recovery action.

    **Concept Tested:** Line Following / Dual IR Sensor Reading

---

#### 10. A student changes the `STOP_DIST_CM` from 20 to 30 in `config.py`. What effect does this have on collision avoidance behavior?

<div class="upper-alpha" markdown>
1. The robot now moves faster because it spends less time decelerating
2. The robot will stop and turn earlier — at 30 cm instead of 20 cm — giving more cushion before hitting an obstacle
3. The robot will stop only when it physically contacts the obstacle
4. The change has no effect unless the same value is also updated in `main.py`
</div>

??? question "Show Answer"
    The correct answer is **B**. Increasing `STOP_DIST_CM` from 20 to 30 means the robot now triggers its stop-and-turn response when the sensor reads below 30 cm rather than 20 cm. This gives 10 cm more safety margin before a potential collision — useful on a slippery surface where the robot takes longer to stop. Since all code imports from `config.py`, changing the constant there automatically affects the entire program. No changes to `main.py` are needed.

    **Concept Tested:** Distance Threshold / Config File Pattern

---
