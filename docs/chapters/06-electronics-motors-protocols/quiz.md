# Quiz: Electronics, DC Motors, and Communication Protocols

Test your understanding of transistors, H-bridges, motor control, analog signals, and communication buses with these questions.

---

#### 1. What is the role of a transistor in controlling a DC motor from a microcontroller GPIO pin?

<div class="upper-alpha" markdown>
1. It converts the motor's mechanical rotation back into a voltage the microcontroller can read
2. It acts as an electronic switch, using the GPIO's small signal to control the larger current the motor needs
3. It stores electrical charge and releases it in bursts to make the motor spin
4. It limits the current flowing into the GPIO pin to prevent damage to the RP2040
</div>

??? question "Show Answer"
    The correct answer is **B**. A GPIO pin can only supply about 12 milliamps — far too little to run a DC motor, which needs hundreds of milliamps. A transistor bridges this gap: a small control signal on one terminal switches a much larger current through the other two terminals. This amplification principle is why microcontrollers can control powerful motors without burning out their output pins.

    **Concept Tested:** Transistors

---

#### 2. How does a DC motor's spin direction change?

<div class="upper-alpha" markdown>
1. By increasing the voltage above 6 V to trigger a reverse-bias mode
2. By reversing which terminal receives the positive voltage
3. By reducing the PWM duty cycle below 25%
4. By connecting the motor to a different GPIO pin number
</div>

??? question "Show Answer"
    The correct answer is **B**. A DC motor's direction depends on which terminal receives the positive voltage. If terminal A is positive and B is ground, the motor spins clockwise. Swap the connections — B positive, A ground — and it spins counterclockwise. The H-bridge circuit automates this electronic reversal. Voltage level, duty cycle, and pin number selection do not by themselves reverse direction.

    **Concept Tested:** Motor Direction Control

---

#### 3. What is a "shoot-through" condition in an H-bridge, and why is it dangerous?

<div class="upper-alpha" markdown>
1. The motor accelerates too quickly and overshoots its target speed
2. Two switches on the same side close simultaneously, creating a short circuit from V+ directly to ground
3. The robot shoots past an obstacle because the sensors did not detect it in time
4. The firmware update fails and corrupts the stored program
</div>

??? question "Show Answer"
    The correct answer is **B**. In an H-bridge, if the top-left and bottom-left switches (or top-right and bottom-right) close at the same time, a direct path forms from the positive supply to ground — bypassing the motor entirely. This is called shoot-through or H-bridge fault. The resulting short circuit can draw enormous current and destroy the transistors instantly. Motor driver ICs include protection circuitry to prevent this.

    **Concept Tested:** H-Bridge Circuit / H-Bridge Switch States

---

#### 4. What does the ADC on the RP2040 do?

<div class="upper-alpha" markdown>
1. It converts digital PWM signals into analog voltages to drive servo motors
2. It converts analog voltages (continuous signals) into digital numbers (0–65535) that MicroPython can read
3. It measures the current flowing through the motor driver chips
4. It provides the clock signal that synchronizes I2C communication
</div>

??? question "Show Answer"
    The correct answer is **B**. ADC stands for Analog-to-Digital Converter. The physical world produces analog signals (smoothly varying voltages), but the RP2040's processor works with digital numbers. The ADC samples an analog voltage between 0 and 3.3 V and converts it to a 16-bit integer (0–65535) that MicroPython reads with `read_u16()`. Options A, C, and D describe different circuits — DAC, a current sensor, and I2C clock, respectively.

    **Concept Tested:** ADC Analog Digital Converter

---

#### 5. What are the two wires of the I2C bus and what role does each play?

<div class="upper-alpha" markdown>
1. VCC (power) and GND (ground) — they supply voltage to all I2C devices
2. MOSI (data out) and MISO (data in) — they carry data in opposite directions simultaneously
3. SDA (Serial Data) and SCL (Serial Clock) — SDA carries data, SCL synchronizes the timing
4. TX (transmit) and RX (receive) — they carry data in one direction each
</div>

??? question "Show Answer"
    The correct answer is **C**. I2C uses exactly two signal wires: SDA (Serial Data Line) carries data bits in both directions, and SCL (Serial Clock Line) carries a clock signal that synchronizes when each bit is valid. The clock makes I2C synchronous. Options A, B, and D describe other signals — power, SPI, and UART respectively. Both I2C wires also need a power and ground connection, but VCC and GND are not part of the I2C signaling.

    **Concept Tested:** I2C SDA SCL Pins

---

#### 6. How does a LiPo battery differ from a set of AA batteries for powering a robot?

<div class="upper-alpha" markdown>
1. LiPo batteries provide less voltage than AA batteries and are used for lower-power sensors
2. LiPo batteries are rechargeable and provide higher voltage (7.4 V for 2S) but require careful handling to avoid damage
3. LiPo batteries only work with SPI-connected sensors, not I2C devices
4. LiPo batteries replace both the motor power and USB cable connection simultaneously
</div>

??? question "Show Answer"
    The correct answer is **B**. A LiPo 2S battery provides 7.4 V (two 3.7 V cells), more than the 6 V from four AA batteries. LiPo cells are rechargeable and generally provide longer runtime, but they require careful handling: never discharge below about 3.0 V per cell (deep discharge causes permanent damage), and always disconnect when storing. They have no relationship to sensor bus types (C) and do not replace the USB connection for programming (D).

    **Concept Tested:** LiPo Battery / Power Management

---

#### 7. How does a DPDT switch relate to an H-bridge circuit?

<div class="upper-alpha" markdown>
1. A DPDT switch is the digital output pin that enables the motor driver IC
2. A DPDT switch achieves the same motor direction reversal as an H-bridge, but mechanically rather than electronically
3. A DPDT switch limits current through the motor to prevent overheating
4. A DPDT switch controls the frequency of the PWM signal sent to the motor
</div>

??? question "Show Answer"
    The correct answer is **B**. A DPDT (Double Pole Double Throw) physical switch can flip both motor connections simultaneously — effectively reversing which terminal gets positive voltage. An H-bridge does the same thing electronically using transistors controlled by GPIO signals. The text describes the H-bridge as "an electronic DPDT switch." Options A, C, and D do not describe the DPDT's function.

    **Concept Tested:** DPDT Switch

---

#### 8. Why does the I2C bus allow multiple sensors to share the same two wires?

<div class="upper-alpha" markdown>
1. Sensors take turns — each one activates for a fixed time slot in a round-robin schedule
2. Each I2C device has a unique address, and the microcontroller broadcasts that address to select which device responds
3. The SDA line carries multiple data streams in parallel, one per device
4. Each device has its own internal clock that prevents signal collisions
</div>

??? question "Show Answer"
    The correct answer is **B**. Each I2C device is assigned a unique 7-bit address (0–127). When the microcontroller wants to communicate with the VL53L0X (address `0x29`), it broadcasts that address on SDA. Only the device at that address responds; all others stay silent. This addressing scheme allows many devices to share the same two wires without interfering. Options A, C, and D do not accurately describe I2C addressing.

    **Concept Tested:** I2C Bus

---

#### 9. Compared to I2C, what is SPI's main advantage and main drawback?

<div class="upper-alpha" markdown>
1. SPI is simpler (fewer wires) and shorter range, while I2C supports more devices
2. SPI is slower but more reliable in electrically noisy environments
3. SPI is faster (1–10+ MHz vs 100–400 kHz) but requires more wires and a separate Chip Select pin per device
4. SPI supports wireless communication, while I2C only works with wired connections
</div>

??? question "Show Answer"
    The correct answer is **C**. SPI can run at 1 MHz or faster — significantly faster than I2C's 100–400 kHz. This makes SPI better for high-speed displays or SD cards. The tradeoff is wiring complexity: SPI needs four wires (MOSI, MISO, SCK, CS) plus a separate CS pin for each additional device, versus I2C's two shared wires with addressing. Neither protocol is wireless.

    **Concept Tested:** SPI Bus

---

#### 10. What is the risk of leaving a stalled motor running at full power?

<div class="upper-alpha" markdown>
1. The motor will spin in reverse direction automatically
2. The high current draw from a blocked motor can overheat the motor driver IC or motor windings
3. The motor will drain only the NeoPixel LEDs, not the main battery pack
4. The microcontroller will automatically reboot to prevent damage
</div>

??? question "Show Answer"
    The correct answer is **B**. A stalled motor (blocked from spinning but still receiving voltage) draws maximum current because there is no back-EMF limiting it. This excess current heats up the motor windings and the motor driver IC rapidly. Extended stalling can permanently damage both. Always include a timeout or sensor check in motor loops so the robot stops trying to push against an obstacle within a few seconds.

    **Concept Tested:** Motor Driver IC

---
