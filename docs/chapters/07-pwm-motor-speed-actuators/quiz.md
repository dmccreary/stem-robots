# Quiz: PWM, Motor Speed Control, and Actuators

Test your understanding of PWM, motor speed control, servo motors, the piezo buzzer, and GPIO interrupts with these questions.

---

#### 1. What does PWM (Pulse Width Modulation) vary to control average power delivered to a motor?

<div class="upper-alpha" markdown>
1. The voltage level of the signal — switching between 1.5 V and 3.3 V
2. The proportion of time the signal is HIGH versus LOW within each cycle (the duty cycle)
3. The number of GPIO pins connected to the motor driver simultaneously
4. The I2C frequency used to communicate with the motor driver chip
</div>

??? question "Show Answer"
    The correct answer is **B**. PWM keeps the signal voltage the same (3.3 V HIGH or 0 V LOW) but changes the duty cycle — the percentage of each cycle spent at HIGH. A 50% duty cycle delivers approximately half the maximum power on average. The motor's mechanical inertia smooths out the rapid switching so it spins at approximately half speed. PWM does not change voltage levels or use I2C.

    **Concept Tested:** Pulse Width Modulation / PWM Duty Cycle

---

#### 2. In MicroPython, what value do you pass to `duty_u16()` to run a motor at exactly 50% speed?

<div class="upper-alpha" markdown>
1. `50`
2. `255`
3. `32767`
4. `65535`
</div>

??? question "Show Answer"
    The correct answer is **C**. MicroPython's `duty_u16()` accepts a 16-bit integer from 0 to 65535. To get 50% speed: `0.5 × 65535 ≈ 32767`. Full speed is 65535, stopped is 0. Passing `50` would give approximately 0.08% speed — not 50%. Passing `255` gives about 0.4%. Understanding the 16-bit range is essential for setting precise motor speeds.

    **Concept Tested:** 16-Bit Duty Cycle Values

---

#### 3. How does differential drive enable a two-wheeled robot to turn without a steering wheel?

<div class="upper-alpha" markdown>
1. Both wheels stop simultaneously and a servo rotates the chassis
2. The front wheels are reversed while the rear wheels continue forward
3. One wheel runs faster than the other, causing the robot to curve toward the slower wheel
4. Both wheels reverse direction, then resume forward at different speeds
</div>

??? question "Show Answer"
    The correct answer is **C**. Differential drive turns the robot by running the two drive wheels at different speeds. If the right wheel runs faster than the left, the robot curves left (toward the slower left wheel). For a sharp spin in place, one wheel goes forward and the other goes backward at the same speed. This is the entire steering system — no physical steering mechanism is needed.

    **Concept Tested:** Differential Drive

---

#### 4. What PWM pulse width commands a standard servo to move to approximately 90° (center position)?

<div class="upper-alpha" markdown>
1. 0.5 ms pulse
2. 1.5 ms pulse
3. 2.5 ms pulse
4. 10 ms pulse
</div>

??? question "Show Answer"
    The correct answer is **B**. A standard hobby servo interprets PWM pulse widths as angle commands: approximately 1 ms = 0°, 1.5 ms = 90° (center), 2 ms = 180°. These pulse widths are sent at 50 Hz (one pulse every 20 ms). A 0.5 ms pulse would push the servo past its mechanical limit. 10 ms would be half the entire 20 ms period and is not a valid servo signal.

    **Concept Tested:** Servo Angle Range

---

#### 5. What determines the pitch (frequency) of a tone played on the piezo buzzer?

<div class="upper-alpha" markdown>
1. The duty cycle — a higher duty cycle produces a higher pitch
2. The GPIO pin number — different pins produce different tones
3. The PWM frequency set on the buzzer pin — higher frequency produces higher pitch
4. The battery voltage — a fully charged battery produces cleaner tones
</div>

??? question "Show Answer"
    The correct answer is **C**. The piezo buzzer vibrates at the PWM switching frequency. Setting a higher PWM frequency makes the piezo element vibrate faster, which moves more air per second and produces a higher-pitched tone. Middle C is 262 Hz; A4 is 440 Hz. The duty cycle controls loudness (50% is loudest), not pitch. Pin number and battery voltage do not set the tone.

    **Concept Tested:** Tone Frequency Control

---

#### 6. What is the difference between polling a button and using a GPIO interrupt?

<div class="upper-alpha" markdown>
1. Polling only works with analog signals; interrupts only work with digital signals
2. Polling checks the button state on every loop iteration; an interrupt calls a handler function the instant the pin changes state
3. Interrupts are slower than polling because they must wait for a rising edge
4. Polling requires the `machine` module; interrupts require a separate `interrupt` library
</div>

??? question "Show Answer"
    The correct answer is **B**. Polling means checking `button.value()` on every pass through the main loop — you might miss a very brief press between iterations. A GPIO interrupt (set with `pin.irq()`) fires a handler function immediately when the pin changes state, no matter what else the loop is doing. Interrupts are faster and more reliable for detecting short events like button presses.

    **Concept Tested:** GPIO Interrupt Setup

---

#### 7. Why does a button press often trigger an interrupt handler multiple times instead of once?

<div class="upper-alpha" markdown>
1. The `IRQ_FALLING` trigger fires on every clock cycle while the button is held down
2. Physical button contacts bounce — making and breaking contact rapidly for a few milliseconds
3. The interrupt handler runs continuously until the `finally` block resets it
4. MicroPython re-fires interrupts every 50 ms by default for reliability
</div>

??? question "Show Answer"
    The correct answer is **B**. Mechanical button contacts physically bounce when pressed, making and breaking the electrical contact 5–50 times in just a few milliseconds. Without debouncing, each bounce fires the interrupt — so one human press can trigger 10–20 handler calls. Debouncing solves this by ignoring any subsequent interrupt that arrives within a short time window (typically 150 ms) after the first.

    **Concept Tested:** Button Debouncing

---

#### 8. What should you NEVER do inside a GPIO interrupt handler function in MicroPython?

<div class="upper-alpha" markdown>
1. Read the value of global variables
2. Change the value of a boolean flag variable
3. Call `sleep()`, `print()`, or I2C functions — they can cause crashes in the interrupt context
4. Return from the function before checking all conditions
</div>

??? question "Show Answer"
    The correct answer is **C**. Interrupt handler functions run in a special context that cannot safely call blocking functions like `sleep()`, `print()`, or I2C operations. Doing so can cause program crashes or corrupted communication. The correct pattern is: set a boolean flag in the handler (`button_flag = True`), then check that flag in the main loop and take action there. Reading and writing simple variables (A, B) is safe in handlers.

    **Concept Tested:** GPIO Interrupt Setup / IRQ Falling Edge

---

#### 9. A servo is commanded to move from 0° to 180° in 5° steps with a 20 ms delay between steps. What programming construct is used to generate the angle sequence?

<div class="upper-alpha" markdown>
1. A `while True` loop that increments the angle variable manually
2. `range(0, 181, 5)` inside a `for` loop
3. A dictionary mapping each step number to the corresponding angle
4. A nested `if/elif` chain with one branch per angle value
</div>

??? question "Show Answer"
    The correct answer is **B**. `range(0, 181, 5)` generates the sequence `0, 5, 10, 15, ..., 180` — starting at 0, stopping before 181, stepping by 5. A `for angle in range(0, 181, 5):` loop iterates over this sequence cleanly. Using 181 (not 180) as the stop ensures 180° is included. A `while` loop (A) could work but is more verbose. Dictionary (C) and if/elif (D) would require enormous amounts of repetitive code.

    **Concept Tested:** Servo Sweep Code

---

#### 10. Why is `duty_u16(0)` called on the buzzer after a tone finishes playing?

<div class="upper-alpha" markdown>
1. To reset the PWM frequency to 50 Hz for motor control
2. To turn off the buzzer between notes, creating silence so tones are distinct
3. To free up the GPIO pin for other uses while the buzzer is not playing
4. To tell the I2C bus that the buzzer has finished transmitting
</div>

??? question "Show Answer"
    The correct answer is **B**. Setting `duty_u16(0)` stops the PWM signal — zero duty cycle means the pin is always LOW, which produces no vibration and therefore silence. Without this, the buzzer would continue playing the last frequency set. Silencing between notes is what makes a melody sound like separate tones rather than one continuous sound. The buzzer does not use I2C and the GPIO pin remains available for the buzzer's next note.

    **Concept Tested:** Sound Feedback / Piezo Buzzer

---
