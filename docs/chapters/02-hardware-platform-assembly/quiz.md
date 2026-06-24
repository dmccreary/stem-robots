# Quiz: Hardware Platform and Robot Assembly

Test your understanding of the Cytron Maker Pi RP2040 hardware, GPIO pins, connectors, and robot assembly with these questions.

---

#### 1. What does GPIO stand for, and what makes these pins useful on a microcontroller?

<div class="upper-alpha" markdown>
1. General Power Input/Output — they regulate voltage to the board
2. General Purpose Input/Output — they can send or receive digital signals to control hardware
3. Ground Pin Interface Output — they connect the board to electrical ground
4. Graphical Processing and Image Output — they drive the OLED display
</div>

??? question "Show Answer"
    The correct answer is **B**. GPIO stands for General Purpose Input/Output. Each GPIO pin can be configured in MicroPython as either an input (reading a sensor signal) or an output (controlling an LED or motor driver). This flexibility allows one microcontroller to interface with many different types of hardware. The other options are invented descriptions that do not apply.

    **Concept Tested:** GPIO Pin Basics

---

#### 2. What is the difference between a digital input pin and a digital output pin?

<div class="upper-alpha" markdown>
1. Input pins carry 5 V; output pins carry 3.3 V
2. Input pins are used only for motors; output pins are used only for sensors
3. Input pins listen for a signal from outside; output pins send a signal to the outside
4. Input pins are numbered GP0–GP14; output pins are numbered GP15–GP29
</div>

??? question "Show Answer"
    The correct answer is **C**. A digital input pin listens for an incoming HIGH or LOW signal (for example, reading a button or sensor). A digital output pin sends a HIGH or LOW signal outward (for example, switching an LED on or telling a motor driver to run). Both types of pins run at 3.3 V on the RP2040. The pin number does not determine its direction — you configure that in code.

    **Concept Tested:** Digital Input Pin / Digital Output Pin

---

#### 3. What is the advantage of Grove connectors over Dupont connectors?

<div class="upper-alpha" markdown>
1. Grove connectors carry higher voltage and are faster
2. Grove connectors are keyed so they can only plug in one direction, preventing wiring mistakes
3. Grove connectors have more pins and carry more current
4. Grove connectors are soldered permanently and cannot be disconnected
</div>

??? question "Show Answer"
    The correct answer is **B**. Grove connectors have a keyed shape that makes it physically impossible to plug them in backwards. This prevents the most common wiring mistake with sensors. Dupont connectors are generic single-wire jumpers that can be inserted backwards. Grove connectors carry 4 pins (two signal, VCC, GND) but are not inherently faster or higher voltage — the keyed direction safety is their key advantage.

    **Concept Tested:** Grove Connectors

---

#### 4. Why must you use nylon standoffs (not metal) when mounting the Cytron board to the chassis?

<div class="upper-alpha" markdown>
1. Metal standoffs are too heavy and will tip the robot over
2. Metal standoffs could create a short circuit by touching solder joints on the bottom of the board
3. Nylon standoffs provide better electrical contact between the board and chassis
4. Metal standoffs are too long and prevent the wheels from spinning
</div>

??? question "Show Answer"
    The correct answer is **B**. The bottom of the Cytron board has solder joints and exposed electrical traces. Metal standoffs could touch those joints, creating a short circuit — a direct path that bypasses components and can damage the board instantly. Nylon is non-conductive, so it provides physical support without electrical contact. The weight and height of standoffs are not the relevant concern here.

    **Concept Tested:** No-Soldering Assembly / Safety Practices

---

#### 5. What is flash memory used for on the robot board?

<div class="upper-alpha" markdown>
1. It stores the robot's sensor readings temporarily while the program runs
2. It provides the high-speed working memory the processor uses during calculations
3. It permanently stores MicroPython programs that survive power-off
4. It buffers audio data for the piezo buzzer to play tones
</div>

??? question "Show Answer"
    The correct answer is **C**. Flash memory is permanent storage — programs written to it stay even when the power is removed. This is why the board runs `main.py` automatically each time it powers up. RAM (Random Access Memory) is option B — it holds temporary data during program execution but is lost when power is cut. Options A and D are not functions of flash memory.

    **Concept Tested:** Flash Memory

---

#### 6. Which action is most likely to permanently damage the Cytron Maker Pi RP2040 board?

<div class="upper-alpha" markdown>
1. Leaving the USB cable plugged in while not running code
2. Connecting a 5 V sensor signal to a GPIO pin rated for 3.3 V maximum
3. Pressing the Reset button while a program is running
4. Uploading a new program over the same USB cable twice in one session
</div>

??? question "Show Answer"
    The correct answer is **B**. The RP2040's GPIO pins are rated for a maximum of 3.3 V. Applying 5 V exceeds this rating and can destroy the GPIO circuitry immediately. Leaving USB plugged in (A) and pressing Reset (C) are safe normal operations. Uploading code multiple times (D) is also standard practice. Always check a sensor's voltage rating before connecting it.

    **Concept Tested:** Safety Practices

---

#### 7. What does the pinout diagram for the Cytron Maker Pi RP2040 show?

<div class="upper-alpha" markdown>
1. A flowchart of the MicroPython program execution order
2. A circuit diagram of the internal transistors on the RP2040 chip
3. A reference drawing showing every pin's number, location, and special functions
4. A schematic of how the robot chassis attaches to the motor brackets
</div>

??? question "Show Answer"
    The correct answer is **C**. A pinout diagram is a reference drawing that maps physical pin locations to their GPIO numbers and lists any special functions (I2C, SPI, ADC, PWM) each pin supports. Engineers bookmark this diagram because it is needed every time a new sensor or component is wired up. It does not show internal chip circuitry or software logic.

    **Concept Tested:** Pinout Diagram

---

#### 8. The Raspberry Pi Pico W differs from the standard Raspberry Pi Pico in which key way?

<div class="upper-alpha" markdown>
1. The Pico W uses a faster processor running at 200 MHz instead of 133 MHz
2. The Pico W adds onboard WiFi and Bluetooth via a wireless module
3. The Pico W has 4 MB of flash memory compared to the Pico's 2 MB
4. The Pico W has 40 GPIO pins while the standard Pico has only 26
</div>

??? question "Show Answer"
    The correct answer is **B**. The Pico W adds a CYW43439 wireless chip that provides 2.4 GHz WiFi and Bluetooth 5.2. Both boards use the same RP2040 processor at up to 133 MHz, the same 2 MB flash, and the same 40-pin header. MicroPython programs written for the Pico run unchanged on the Pico W. The wireless module unlocks the networking chapters of this course.

    **Concept Tested:** Raspberry Pi Pico W

---

#### 9. In the robot assembly sequence, why must motor wires be routed through the chassis opening BEFORE mounting the Cytron board?

<div class="upper-alpha" markdown>
1. Routing wires before mounting allows the motors to be tested individually
2. Once the board is mounted, the opening is covered and wires cannot be threaded through cleanly
3. The motor driver chips must warm up before the wires are connected
4. Motor wires must be soldered before the board is installed
</div>

??? question "Show Answer"
    The correct answer is **B**. The assembly sequence is ordered by mechanical dependencies. Once the Cytron board sits on the standoffs above the chassis opening, there is no longer a clear path to thread the motor wires upward. Routing them first while access is unobstructed prevents having to disassemble and start over. No soldering is needed in this course, and no warmup is required.

    **Concept Tested:** No-Soldering Assembly / Mechanical Design Basics

---

#### 10. What do the 13 onboard LEDs on the Cytron Maker Pi RP2040 indicate?

<div class="upper-alpha" markdown>
1. The remaining battery charge level from full to empty
2. The WiFi signal strength of the current network connection
3. The state of each GPIO pin — each LED lights when its pin goes HIGH
4. The current PWM duty cycle percentage set for the motors
</div>

??? question "Show Answer"
    The correct answer is **C**. The 13 onboard LEDs are directly tied to GPIO pin states. Each LED lights up when its corresponding GPIO pin is set HIGH in code. This is extremely useful for debugging — if your code should be setting a pin HIGH but the LED stays dark, the program is not running as expected. They do not show battery level, WiFi strength, or PWM values.

    **Concept Tested:** Cytron Maker Pi RP2040

---
