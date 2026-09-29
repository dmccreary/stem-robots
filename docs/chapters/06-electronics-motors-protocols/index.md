---
title: Electronics, DC Motors, and Communication Protocols
description: Bridge electronics theory and robot motion — learn how transistors, H-bridges, and motor driver ICs control DC motors, explore power management, analog/digital signals, and establish the I2C and SPI buses used by every sensor and display in the course.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 14:20:00
version: 0.08
---

# Electronics, DC Motors, and Communication Protocols

!!! mascot-welcome "Welcome, maker — let's electrify things!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This is the chapter where software meets hardware for real. We'll learn why motors spin, how to flip their direction, and how the microcontroller talks to every sensor and display on the robot. The electronics ideas here power everything from Chapter 7 onward.

## Summary

This chapter bridges electronics theory and robot motion. Students learn how
transistors enable H-bridge circuits to reverse DC motor direction, explore power
management with battery packs and LiPo cells, and understand analog versus digital
signals with ADC conversion. The chapter also establishes the I2C and SPI
communication buses that connect the microcontroller to sensors and displays in
all subsequent chapters.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Transistors
2. Battery Pack
3. Power Management
4. LiPo Battery
5. Analog vs Digital Signals
6. ADC Analog Digital Converter
7. DC Motor Overview
8. Motor Terminals
9. Motor Direction Control
10. Motor Forward Motion
11. Motor Reverse Motion
12. Motor Stop
13. H-Bridge Circuit
14. H-Bridge Switch States
15. DPDT Switch
16. Motor Driver IC
17. I2C Bus
18. I2C SDA SCL Pins
19. I2C Frequency Config
20. SPI Bus

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computational Thinking and Physical Computing](../01-intro-computational-thinking/index.md)
- [Chapter 2: Hardware Platform and Robot Assembly](../02-hardware-platform-assembly/index.md)
- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)

---

## Transistors — The Electronic Switch

A **transistor** is a tiny electronic switch. Unlike a physical light switch that you flip with your finger, a transistor is switched by electricity. A small electrical signal at one terminal controls whether a much larger current flows through the other two terminals.

Transistors are the foundation of modern electronics. The RP2040 chip inside your robot contains hundreds of millions of them. For our purposes, the most important use is simple: a GPIO pin on the microcontroller outputs a tiny signal, and that signal switches a transistor on or off. The transistor then controls a much larger current — enough to run a motor.

Without transistors, microcontrollers couldn't drive motors at all. A GPIO pin can only supply about 12 milliamps. A DC motor needs hundreds of milliamps. The transistor bridges that gap by acting as an amplifier: small signal in, large current out.

There are two main families of transistors: **BJTs** (bipolar junction transistors) and **MOSFETs** (metal-oxide-semiconductor field-effect transistors). The motor driver IC on the Cytron board uses MOSFETs internally because they are more efficient at higher currents and faster switching. You don't need to design transistor circuits yourself — the motor driver handles all of that — but knowing the principle explains why the circuit works.


#### Diagram: Transistor Switch Explorer

This MicroSim shows a transistor working as a switch. A small signal from a GPIO pin turns the transistor on, and a much larger current flows through a motor. You can raise and lower the GPIO signal and watch the motor current respond.

<iframe src="../../sims/transistor-switch-explorer/main.html" width="100%" height="482px" scrolling="no"></iframe>
[Run Transistor Switch Explorer Fullscreen](../../sims/transistor-switch-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Turn a transistor on and off with a small GPIO signal to run a motor</summary>
Type: microsim
**sim-id:** transistor-switch-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** moving-rainbow / transistor-circuit-diagrams (https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/transistor-circuit-diagrams). Keep the circuit diagram and current animation. Replace the LED strip load with a DC motor and label the control side as an RP2040 GPIO pin.

Learning objective: Explain (Bloom L2) — the student can explain how a small GPIO signal switches a much larger motor current through a transistor.

Canvas layout: 700 px wide (responsive), 480 px tall. Left 60 percent: circuit diagram. Right 40 percent: two meters and a text panel. Bottom strip (70 px): controls.

Visual elements:
- Circuit diagram: a battery on top labeled "6 V battery pack (4 x AA)", a motor (circle with M) below it, and an N-channel MOSFET symbol (gate, drain, source) below the motor with the source going to ground. A separate control side on the left shows a box labeled "RP2040 GPIO" with a thin wire to the MOSFET gate through a 220 ohm resistor.
- Wires: thin, blue for the control path, thick orange for the motor path.
- Animated dots: small blue dots move on the thin gate wire when the GPIO is HIGH. Large orange dots move around the motor loop only when the transistor is on. The dot count and speed scale with current.
- The MOSFET symbol changes: when off, the channel is drawn as a gap and the transistor is gray. When on, the channel is drawn closed and the transistor is green.
- Motor icon: the shaft spins at a speed proportional to motor current.
- Right panel: two horizontal bar meters, "GPIO current (mA)" from 0 to 12 and "Motor current (mA)" from 0 to 500, and a text line such as "Small signal, big current".

Interactive controls:
- Button "GPIO: LOW / HIGH" toggles the control pin (default LOW).
- Slider "Gate voltage (V)" from 0.0 to 3.3 V in steps of 0.1 (default 0.0). The button sets it to 0 or 3.3.
- Dropdown "Load": "Robot motor (normal)" (default), "Stalled motor (blocked wheel)".
- Toggle "Connect motor directly to GPIO (no transistor)".

Behavior:
- The transistor turns on when the gate voltage is 1.5 V or more (the threshold). Below that, the motor current is 0 mA.
- From 1.5 to 3.3 V, the motor current rises linearly from 0 to 300 mA (normal load) or to 500 mA (stalled load).
- GPIO current is always small: it is 0 mA at 0 V and about 0.1 mA at 3.3 V because the gate draws almost no current.
- With "Connect motor directly to GPIO", the motor tries to pull the current from the pin. The GPIO meter goes past the 12 mA limit into red, the pin icon glows red, and the motor barely turns. The message reads "A GPIO pin can only give about 12 mA. The motor needs 300 mA."
- The text panel always names the ratio: "Motor current is about 3000 times the GPIO current" (computed as motor current divided by GPIO current when GPIO current is above 0).

Default state: GPIO LOW, gate voltage 0.0 V, transistor gray, motor still, both meters at 0.

Assessment/Challenge: Find the lowest gate voltage at which the motor starts to turn. Answer: 1.5 V. Then turn on "Connect motor directly to GPIO" and explain why the motor cannot work that way. Answer: the pin can only supply about 12 mA, and the motor needs hundreds of mA.

Responsive: redraw on window resize.
</details>

The motor driver chip on your Cytron board contains transistors just like this one. When your MicroPython code sets a pin HIGH, it is doing what the gate voltage slider does here: a tiny signal turns on a big current. This is why we never wire a motor straight to a GPIO pin.

---

## Power Management

Before we discuss motors, let's understand where the power comes from.

### Battery Pack

Your robot runs on a **battery pack** — a holder for AA or AAA batteries. AA alkaline batteries deliver about 1.5 V each. With four in series (connected end-to-end), you get 6 V total. This powers the motors and charges the onboard voltage regulator that supplies 3.3 V to the microcontroller and logic circuits.

The Cytron Maker Pi RP2040 can accept power from both the battery pack and the USB cable simultaneously. When both are connected, the board automatically selects the right source. When only the battery is connected, your robot runs fully standalone — no laptop required.

### LiPo Battery

A **LiPo battery** (Lithium Polymer) is a rechargeable alternative to AA cells. LiPo cells deliver 3.7 V each, and a two-cell (2S) pack delivers 7.4 V — enough to power the robot for longer than AA batteries.

LiPo batteries require careful handling. **Power management** with LiPo cells means never discharging below about 3.0 V per cell — deep discharge damages them permanently. Many robot kits include a low-battery indicator LED for this reason. If you use a LiPo, always disconnect it when storing the robot for more than a few days.

The table below compares the two power options:

| Feature | AA Battery Pack (4×) | LiPo 2S |
|---------|---------------------|---------|
| Voltage | 6.0 V (nominal) | 7.4 V (nominal) |
| Capacity | ~2000 mAh (alkaline) | 1000–2000 mAh typical |
| Rechargeable | No | Yes |
| Safety | Low risk | Must avoid overcharge/deep discharge |
| Cost | Low per use | Higher upfront, lower long-term |

!!! mascot-tip "Charge before class"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If your class uses LiPo batteries, charge them the night before. A fully charged battery gives you about 30–45 minutes of active robot use. Bring a charged spare if you can. Nothing ends a lab session faster than a dead battery.


#### Diagram: Battery Runtime Estimator

This MicroSim helps you estimate how long your robot runs on one set of batteries. You pick a battery type, choose how hard the motors work, and see the runtime and a draining battery gauge.

<iframe src="../../sims/battery-runtime-estimator/main.html" width="100%" height="472px" scrolling="no"></iframe>
[Run Battery Runtime Estimator Fullscreen](../../sims/battery-runtime-estimator/main.html){ .md-button }

<details markdown="1">
<summary>Estimate robot runtime from battery capacity and current draw</summary>
Type: microsim
**sim-id:** battery-runtime-estimator<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** moving-rainbow / battery-life-calculator (https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/battery-life-calculator). Keep the capacity-over-current formula and the drain gauge. Replace the LED loads with the robot's motor, sensor, and display loads.

Learning objective: Calculate (Bloom L3) — the student can estimate battery runtime using capacity divided by current, and can explain how motor use changes the answer.

Canvas layout: 700 px wide (responsive), 460 px tall. Left panel (330 px): controls. Right panel: battery gauge and results. Bottom strip (60 px): formula and notes.

Visual elements:
- Battery gauge: a large horizontal battery outline (260 x 90 px) with a fill that goes from green (above 50 percent) to yellow (20 to 50 percent) to red (below 20 percent). A percent label sits in the center.
- A load table under the gauge lists each load and its current: Microcontroller and sensors, OLED display, NeoPixels, Motors. Each row shows a small colored bar scaled to its mA value.
- A large result number: "Estimated runtime: 1 h 25 min".
- A voltage line: "Pack voltage: 6.0 V" with a red "LOW - shut down!" tag when a LiPo drops to the cutoff level.
- The bottom strip shows the live formula: "runtime (h) = capacity (mAh) / current (mA)".

Interactive controls:
- Dropdown "Battery": "4 x AA alkaline (2000 mAh, 6.0 V)" (default), "2S LiPo 1000 mAh (7.4 V)", "2S LiPo 2000 mAh (7.4 V)".
- Slider "Motor duty (percent)" 0 to 100, step 5, default 60.
- Checkbox "OLED display on" (default on), "NeoPixels on" (default off), each with a fixed current.
- Slider "Battery health (percent of rated capacity)" 50 to 100, step 5, default 100.
- "Run" button animates the gauge draining, at 1 hour of real time per second. "Reset" button.

Behavior:
- Current model: base draw (RP2040 + sensors) = 60 mA. OLED = 20 mA. NeoPixels (2 at half brightness) = 30 mA. Motors = 2 motors x (motor duty percent / 100) x 250 mA.
- Total current I = 60 + (OLED 20) + (NeoPixels 30) + motors.
- Usable capacity = rated capacity x battery health / 100. For LiPo packs, limit usable capacity to 80 percent of the rating to avoid deep discharge below 3.0 V per cell.
- Alkaline cells lose capacity at high current, so multiply usable capacity by 0.7 when total current is above 300 mA. LiPo packs get no extra derating.
- Runtime (hours) = usable capacity / total current. Show hours and minutes.
- With the defaults: total current = 60 + 20 + 300 = 380 mA. Runtime = 2000 x 0.7 / 380, about 3.7 hours.
- Motor duty at 100 percent uses 500 mA for motors alone and shows a hint: "Motors use most of your battery."
- During the "Run" animation the gauge drains at a rate matching the runtime. For LiPo, when the gauge reaches 20 percent the tag "LOW - shut down!" appears and the animation stops.

Default state: 4 x AA alkaline, motor duty 60, OLED on, NeoPixels off, gauge full, runtime shown.

Assessment/Challenge: Set motor duty to 100 percent with OLED on and NeoPixels off. Which lasts longer, the 4 x AA pack or the 2S LiPo 1000 mAh pack? Answer: the AA pack. It runs about 2.4 hours (2000 x 0.7 / 580 mA) and the LiPo runs about 1.4 hours (800 / 580 mA). Then find the pack that would last 3 hours at this duty. Answer: none of the three, so the student should lower the motor duty.

Responsive: redraw on window resize.
</details>

Battery life is one reason we drive motors with PWM at less than full power in later chapters. Slow down the wheels a little and your robot runs much longer. Charge or swap the pack before class, and stop a LiPo before it reaches the low tag.

---

## Analog vs. Digital Signals

The physical world is **analog** — temperature, distance, light, and pressure vary smoothly and continuously. Computers are **digital** — they work with discrete values, typically 0 or 1 (off or on). Understanding the difference between these two signal types is essential for reading sensors.

A **digital signal** has exactly two states: HIGH (3.3 V on the RP2040) or LOW (0 V). A button is digital — pressed or not pressed. An infrared sensor output is digital — detects line or does not detect line.

An **analog signal** can be any voltage in a range. A potentiometer (dial) is analog — it produces a smoothly varying voltage between 0 V and 3.3 V as you turn it. A light sensor, a temperature sensor, and a microphone are all analog.

The RP2040 cannot read analog voltages directly with its digital logic. It uses an **ADC** (Analog-to-Digital Converter) to sample the voltage and convert it to a number. The RP2040's ADC has 12-bit resolution, which means it maps the 0–3.3 V range to 0–4095. A reading of 2048 means the voltage is about 1.65 V — roughly halfway.

```python
from machine import ADC

pot = ADC(26)           # GPIO 26 is ADC channel 0
raw = pot.read_u16()    # read 16-bit value (0–65535)
voltage = raw * 3.3 / 65535
print(f"Voltage: {voltage:.2f} V")
```

Notice the example uses `read_u16()` which returns a 16-bit value (0–65535) rather than the raw 12-bit value. MicroPython scales it automatically.

#### Diagram: Analog vs Digital Signal Comparison


<iframe src="../../sims/analog-digital-signals/main.html" width="100%" height="352px" scrolling="no"></iframe>
[Run Analog vs Digital Signal Comparison Fullscreen](../../sims/analog-digital-signals/main.html)

<details markdown="1">
<summary>Interactive comparison of analog and digital signal waveforms</summary>
Type: MicroSim
**sim-id:** analog-digital-signals<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 350 canvas split into two panels side by side.

Left panel — "Analog Signal":
- Shows a smooth sine wave drawn in orange.
- A vertical dashed line follows the mouse X position and displays the voltage value at that point.
- Label: "Voltage: X.XX V"

Right panel — "Digital Signal":
- Shows a square wave (PWM-like) in blue — high and low states with sharp transitions.
- Same vertical cursor showing "HIGH (3.3V)" or "LOW (0V)" at the cursor position.

Below both panels, a "Signal Type" dropdown lets the student switch the left panel between: Sine wave, Potentiometer (sawtooth ramp), Microphone (noise).

Learning objective (Bloom's Taxonomy — Understanding): students distinguish continuous analog signals from discrete digital signals and understand why ADC conversion is needed.

Responsive: redraw on window resize.
</details>

---

## DC Motors and Direction Control

A **DC motor** (Direct Current motor) converts electrical energy into rotational mechanical energy. When current flows through the motor's coils, it creates a magnetic field that interacts with permanent magnets inside the motor housing, causing the shaft to spin.

### Motor Terminals

A simple DC motor has two **terminals** — two wires or contacts where you connect power. The direction the motor spins depends on which terminal receives the positive voltage and which receives the negative (ground).

If you connect terminal A to positive (+) and terminal B to negative (−), the motor spins clockwise. Swap the connections — terminal B to positive, terminal A to negative — and the motor spins counter-clockwise. That's the key principle of DC motor direction control.

### Motor Forward, Reverse, and Stop

Before the H-bridge circuit explains how we switch direction electronically, here are the three states we need:

- **Forward motion** — current flows through the motor in one direction. The robot's wheels spin forward.
- **Reverse motion** — current flows through the motor in the opposite direction. The wheels spin backward.
- **Motor stop** — no current flows, or both terminals are at the same voltage. The wheels stop.

We cannot simply connect the motor to a GPIO pin and reverse the connection in code — a GPIO pin only outputs a positive voltage, not a negative one. We need a special circuit called an H-bridge.

---

## The H-Bridge Circuit

An **H-bridge** is an electronic circuit that can apply voltage across a motor in either direction. The name comes from the shape of the circuit — four switches arranged in a shape that resembles the letter "H", with the motor in the middle crossbar.

The four switches are transistors (usually MOSFETs). Before examining the switch states, here is the concept: by closing two specific switches and opening the other two, we route current through the motor in one direction. By switching which pair is closed, we reverse the current direction.

### H-Bridge Switch States

The four switches in an H-bridge are often labeled SW1 (top-left), SW2 (bottom-right), SW3 (top-right), and SW4 (bottom-left). The motor connects between the midpoints. Let's trace three states:

| State | SW1 | SW2 | SW3 | SW4 | Motor |
|-------|-----|-----|-----|-----|-------|
| Forward | ON | ON | OFF | OFF | Spins CW |
| Reverse | OFF | OFF | ON | ON | Spins CCW |
| Stop (coast) | OFF | OFF | OFF | OFF | Free-spinning |
| Stop (brake) | ON | OFF | ON | OFF | Braked (locked) |

**Never close SW1 and SW3 at the same time, or SW2 and SW4 at the same time.** This creates a short circuit — direct path from positive to negative — that can damage or destroy the transistors. This condition is called a **shoot-through** or **H-bridge fault**. Motor driver ICs include built-in protection against this.

### A DPDT Switch as an Analogy

A **DPDT switch** (Double Pole Double Throw) is a physical switch that achieves the same result as an H-bridge. It has two poles (two separate circuits), each of which can connect to either of two positions. Wired correctly, flipping the switch reverses the motor connections manually.

The H-bridge is an electronic DPDT switch — it does the same thing, but controlled by GPIO signals instead of a physical flip.

#### Diagram: H-Bridge Switch States


<iframe src="../../sims/h-bridge-simulator/main.html" width="100%" height="402px" scrolling="no"></iframe>
[Run H-Bridge Switch States Fullscreen](../../sims/h-bridge-simulator/main.html)

<details markdown="1">
<summary>Interactive H-bridge circuit showing switch states and current flow</summary>
Type: MicroSim
**sim-id:** h-bridge-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Draw an H-bridge circuit schematically:

- Four switch symbols at the four corners of an "H" shape (SW1 top-left, SW2 bottom-left, SW3 top-right, SW4 bottom-right).
- A motor symbol (circle with M) in the horizontal center bar.
- Power supply (V+) at top, Ground at bottom.
- Current flow shown as animated dots moving along the wire when switches are in a valid state.
- The dot color indicates direction: orange for forward, blue for reverse.

Three buttons: "Forward", "Reverse", "Stop". Clicking each:
- Updates switch states (green circle = closed, red circle = open).
- Animates current flow dots in the correct direction.
- Updates a text label: "Motor: FORWARD / REVERSE / STOPPED".

Hovering each switch shows a tooltip: "SW1 — top-left switch. Closed = connects motor terminal A to V+."

Learning objective (Bloom's Taxonomy — Analyzing): students trace current paths through the H-bridge to predict motor direction.

Responsive: redraw on window resize.
</details>

### Motor Driver IC

Designing an H-bridge from individual transistors requires careful engineering. Instead, we use a **motor driver IC** (Integrated Circuit) — a pre-built chip that contains the H-bridge circuitry plus protection features. The Cytron Maker Pi RP2040 uses the MX1508 motor driver IC, which handles two DC motors simultaneously.

The motor driver exposes simple control pins: one pin per motor direction. Pulling a pin HIGH or LOW with the microcontroller's GPIO controls the transistors inside the IC. The motor driver handles the shoot-through protection internally — you can't accidentally short it through normal MicroPython code.

!!! mascot-warning "Never stall a motor at full power"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A **stalled motor** — one that is mechanically blocked from spinning but still receiving full voltage — draws very high current and heats up rapidly. Extended stalling can overheat the motor driver IC or the motor windings. If your robot hits a wall and can't move, it should stop trying within a few seconds. Always include a timeout or distance check in your motor loops.

---

## I2C Bus — A Two-Wire Network

The **I2C bus** (Inter-Integrated Circuit, pronounced "I-squared-C") is a communication protocol that lets a microcontroller talk to multiple sensors and devices using just two wires. It is the primary bus for sensors and displays on this robot.

Two wires carry all communication:

- **SDA** (Serial Data) — carries data bits in both directions.
- **SCL** (Serial Clock) — carries a clock signal that synchronizes data transfer.

The clock signal is what makes I2C **synchronous** — both devices agree on when each bit starts and ends by following the same clock. This makes I2C more reliable than asynchronous protocols, at the cost of needing a dedicated clock line.

### I2C Addresses

Every I2C device has a unique 7-bit **address** (from 0 to 127). When the microcontroller wants to talk to the distance sensor, it broadcasts the sensor's address on the SDA line. Only the device with that address responds. All other devices on the bus stay quiet.

This is how you can connect multiple I2C devices to the same two pins. The VL53L0X distance sensor uses address `0x29` (hexadecimal). The SSD1306 OLED display typically uses `0x3C` or `0x3D`. As long as addresses don't conflict, many devices share the bus.

### I2C SDA and SCL Pins

On the Cytron Maker Pi RP2040, the I2C bus uses GPIO pins 16 (SDA) and 17 (SCL). These are defined in `config.py`:

```python
I2C_SDA_PIN = 16
I2C_SCL_PIN = 17
```

In MicroPython, you create an I2C object like this. Before the code, here is what the parameters mean: `0` selects I2C bus 0 (the RP2040 has two), `scl` specifies the clock pin, `sda` specifies the data pin, and `freq` sets the communication speed in Hz.

```python
from machine import I2C, Pin
import config

i2c = I2C(0, scl=Pin(config.I2C_SCL_PIN),
             sda=Pin(config.I2C_SDA_PIN),
             freq=400000)   # 400 kHz — Fast mode
```

### I2C Frequency Config

**I2C frequency** is how fast bits travel on the bus. Standard mode is 100 kHz (100,000 bits per second). Fast mode is 400 kHz. The VL53L0X sensor works well at 400 kHz. If you use 400 kHz and get communication errors, try dropping to 100 kHz — some devices don't support Fast mode.

To scan all devices connected to the bus and print their addresses:

```python
devices = i2c.scan()
print("I2C devices found:", [hex(d) for d in devices])
```

This should print something like `['0x29', '0x3c']` if both the distance sensor and the OLED display are connected.


#### Diagram: I2C Bus Explorer

This MicroSim shows how one microcontroller shares two wires with two devices. You send a message to the distance sensor or the OLED display and watch the address, the ACK reply, and the data bits move along SDA and SCL.

<iframe src="../../sims/i2c-bus-explorer/main.html" width="100%" height="532px" scrolling="no"></iframe>
[Run I2C Bus Explorer Fullscreen](../../sims/i2c-bus-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Send messages on a shared two-wire I2C bus and watch addresses and ACKs</summary>
Type: microsim
**sim-id:** i2c-bus-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-micropython / protocol-comparison (https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/protocol-comparison) as a layout template. Otherwise a new design: one controller, two devices, and a bit-level SDA/SCL timing diagram.

Learning objective: Trace (Bloom L3-L4) — the student can trace an I2C transaction (start, address, ACK, data, stop) and explain how addresses let two devices share the same two wires.

Canvas layout: 700 px wide (responsive), 540 px tall. Top (240 px): bus wiring diagram. Middle (200 px): timing diagram with two waveform rows. Bottom (100 px): controls and a text log.

Visual elements:
- Wiring diagram: a box on the left, "RP2040 (controller)", with two horizontal lines running to the right: a blue line "SDA (GPIO 16)" and a green line "SCL (GPIO 17)". Two device boxes hang off the lines: "VL53L0X distance sensor, address 0x29" and "SSD1306 OLED display, address 0x3C". A third greyed device box, "Add device", is optional. Small resistor symbols labeled "pull-up 4.7 k" connect each line to the 3.3 V rail.
- Timing diagram: two rows, "SCL" (green) and "SDA" (blue), drawn as square waves over 30 or so clock pulses. Vertical dotted guide lines mark each bit. Segments are labeled below: START, ADDRESS (7 bits), R/W (1 bit), ACK, DATA (8 bits), ACK, STOP.
- A moving orange NOW marker sweeps the timing diagram as bits are sent.
- The device that is addressed lights up green when it answers with ACK. Other devices dim to gray and show "ignoring".
- Bits are labeled with 0 or 1 above the SDA wave and the address hex shown on the header line, for example "0x29 = 0101001".
- Text log at the bottom prints each step, for example "Controller: START", "Controller: address 0x29, write", "Sensor: ACK".

Interactive controls:
- Dropdown "Talk to": "VL53L0X (0x29)" (default), "SSD1306 (0x3C)", "Nobody home (0x50)".
- Dropdown "Clock speed": "100 kHz Standard" or "400 kHz Fast" (default 400).
- Dropdown "Data byte": 0x00, 0x40, 0xA5, 0xFF (default 0xA5).
- "Send" button, "Step" button for one bit at a time, "Reset" button.
- Button "Scan bus" runs `i2c.scan()`, trying all addresses from 0 to 127 and highlighting each device that ACKs.

Behavior:
- Send: START (SDA falls while SCL is high), then 7 address bits (most significant first), 1 R/W bit (0 = write), then the addressed device pulls SDA low for the ACK bit. Then 8 data bits, another ACK, and STOP (SDA rises while SCL is high).
- If the address matches a device, that device ACKs and the log ends with "Transfer OK". For "Nobody home (0x50)", SDA stays high on the ACK bit (a NACK). The log reads "No device answered. Check wiring or address." and an `OSError: [Errno 5] EIO` tag appears.
- Time for one transaction: 9 bits for the address byte plus 9 bits for the data byte = 18 bit times, each 1 / frequency. At 400 kHz, this is 45 microseconds. At 100 kHz, it is 180 microseconds. Show "Transaction time: X us".
- Scan bus: steps through addresses quickly and prints `['0x29', '0x3c']`.
- Every step only allows one device to answer at a time, which the diagram shows by lighting only one device.

Default state: Talk to VL53L0X, 400 kHz, 0xA5, nothing sent, both devices in their normal color.

Assessment/Challenge: Send to 0x50 and find out why nothing answers. Answer: no device uses that address, so nobody pulls SDA low for the ACK bit. Then run "Scan bus" and confirm the two addresses that do answer are 0x29 and 0x3c.

Responsive: redraw on window resize.
</details>

When you run `i2c.scan()` on your robot, the same steps happen on the real SDA and SCL pins. If the scan returns an empty list, think of the NACK case from this sim: check your wires and pins. Two sensors can share the bus only because each one has a different address.

---

## SPI Bus — High-Speed Serial

The **SPI bus** (Serial Peripheral Interface) is a second communication protocol for fast, short-distance connections. SPI uses four wires instead of I2C's two:

- **MOSI** — Master Out Slave In (data from microcontroller to device)
- **MISO** — Master In Slave Out (data from device to microcontroller)
- **SCK** — Serial Clock
- **CS** — Chip Select (one per device — selects which device is active)

The table below compares I2C and SPI. Understanding this comparison helps you choose the right bus for a given sensor.

Before the table, here is the key difference: I2C is slower but uses only 2 wires and supports many devices easily. SPI is faster but uses more wires and requires a separate CS pin per device.

| Feature | I2C | SPI |
|---------|-----|-----|
| Wires | 2 (SDA, SCL) | 4 (MOSI, MISO, SCK, CS) |
| Speed | 100–400 kHz (standard) | 1–10+ MHz |
| Device addressing | Address on the bus | Chip Select pin per device |
| Robot use cases | Distance sensor, OLED display | Some displays, SD cards |

In this course, we primarily use I2C. The OLED display supports both I2C and SPI modes — we use I2C mode because it requires fewer wires. You will see SPI referenced in data sheets and libraries, so knowing what it is prevents confusion.

!!! mascot-thinking "I2C or SPI — why does it matter?"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of I2C as a shared party phone line — many devices share the same two wires, each waiting its turn. SPI is like private phone lines — faster, but you need a separate line (CS pin) for each device. For this robot with a handful of sensors, I2C's simplicity wins. For a high-speed display update or SD card access, SPI's speed wins.


#### Diagram: I2C vs SPI Wiring Comparison

This MicroSim wires the same set of devices two ways. You add sensors to an I2C bus and to an SPI bus and count the wires and pins each choice uses. It helps you see when I2C's simplicity or SPI's speed is the better choice.

<iframe src="../../sims/i2c-vs-spi-wiring/main.html" width="100%" height="502px" scrolling="no"></iframe>
[Run I2C vs SPI Wiring Comparison Fullscreen](../../sims/i2c-vs-spi-wiring/main.html){ .md-button }

<details markdown="1">
<summary>Add devices to I2C and SPI buses and compare wires, pins, and speed</summary>
Type: microsim
**sim-id:** i2c-vs-spi-wiring<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-micropython / protocol-comparison (https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/protocol-comparison). Keep the side-by-side protocol layout. Limit it to I2C and SPI and use the robot's devices (VL53L0X, OLED, SD card, display).

Learning objective: Compare (Bloom L4, Analyze) — the student can count wires and pins for I2C and SPI as devices are added, and can justify which bus fits a device.

Canvas layout: 700 px wide (responsive), 480 px tall. Two equal panels, left "I2C bus" and right "SPI bus", each 340 px wide and 300 px tall. A summary table (700 x 100 px) sits under the panels. A control strip (70 px) sits at the bottom.

Visual elements:
- Each panel shows a microcontroller box on the left and device boxes on the right, connected by colored wires. I2C wires: SDA (blue) and SCL (green), shared by all devices. SPI wires: MOSI (orange), MISO (purple), SCK (green) shared by all devices, plus one separate CS wire (red) per device.
- Devices are small labeled boxes with a colored stripe: "VL53L0X sensor" (I2C only), "SSD1306 OLED" (both), "SD card" (SPI only), "Fast color display" (SPI only).
- Pin badges on the microcontroller box show the count of GPIO pins used, for example "GPIO used: 2".
- A data-rate bar under each panel shows the typical speed range: I2C 100 to 400 kHz (short bar), SPI 1 to 10+ MHz (long bar, 25 times longer).
- The summary table has rows: Wires, GPIO pins used, Speed, How a device is chosen. It updates when devices are added.

Interactive controls:
- Checkboxes "VL53L0X", "SSD1306 OLED", "SD card", "Fast color display" (default: VL53L0X and SSD1306 checked).
- Dropdown "Task": "Read distance 10 times per second", "Update OLED text", "Write a sensor log to SD card", "Refresh a full-color screen" (default: "Read distance 10 times per second").
- Button "Send data" animates bits as dots along the wires of both panels.
- Button "Reset".

Behavior:
- I2C wire count is always 2, and GPIO pins used is always 2. Each device picks its address (0x29, 0x3C) and there is no extra wire per device.
- SPI wire count = 3 shared wires + 1 CS wire per device on the bus. GPIO pins used = 3 + number of devices. With 2 devices this is 5 wires and 5 pins, with 4 devices it is 7.
- A device that does not support a bus (for example the VL53L0X on SPI) shows as "not available on SPI" in the SPI panel, in dashed gray, and does not count.
- Send data animation: I2C dots move at a slow speed and SPI dots move about 5 times faster for the chosen task. A result line shows time to move 1 KB: I2C at 400 kHz takes about 23 ms (8192 bits x 9/8 for ACK bits / 400,000 bits per second), and SPI at 10 MHz takes about 0.8 ms. The text says which bus is the better fit for that task, for example "Read distance: I2C is fine. Only a few bytes move." and "Full-color screen: SPI is much better. Lots of data moves."
- The summary table highlights the winner in each row with a green cell.

Default state: VL53L0X and SSD1306 added, "Read distance" task chosen, I2C shows 2 wires and SPI shows 5 wires.

Assessment/Challenge: With all four devices checked, how many GPIO pins does SPI need, and how many does I2C need? Answer: SPI needs 7 (3 shared plus 4 CS lines), and I2C needs 2. Then pick which bus you would use for a robot with 3 small sensors, and explain why. Answer: I2C, because it uses only 2 pins and the speed is enough.

Responsive: redraw on window resize.
</details>

Your robot uses I2C for the distance sensor and the OLED because those devices send only a few bytes at a time and the two-wire bus keeps the wiring simple. The sim shows why SPI wins when a lot of data moves, and why it costs extra pins on a small board.

---

## Key Takeaways

- **Transistors** act as electronic switches — a small GPIO signal controls large motor current
- **Battery packs** provide 6 V for motors; **LiPo batteries** provide 7.4 V with longer life
- **Analog signals** vary continuously; **digital signals** are HIGH or LOW
- The **ADC** converts analog voltages to numbers (0–65535 in MicroPython)
- A **DC motor** spins in the direction determined by which terminal gets positive voltage
- An **H-bridge** uses four transistor switches to reverse motor direction electronically
- The **motor driver IC** (MX1508) contains the H-bridge and shoot-through protection
- **I2C** uses two wires (SDA, SCL) with device addressing — 400 kHz Fast mode for this course
- **SPI** uses four wires and is faster than I2C — used for some displays and SD cards

!!! mascot-celebration "You understand the electronics that make robots move!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, engineer! Transistors, H-bridges, I2C, SPI — this is the layer between code and physical motion. Understanding it puts you ahead of most hobbyist programmers who just copy code without knowing why it works. Next chapter, we put all of this to use with PWM motor control — and make me actually roll!

