# Computational Thinking with STEM Robots — FAQ

This FAQ covers the most common questions from students, parents, and educators
about the course, the hardware, the software, and the programming concepts.
Questions are organized into six categories that follow the course's learning
progression.

---

## Getting Started

### What is this course about?

This 14-week, hands-on course teaches **computational thinking** through building
and programming a low-cost wheeled robot. Students assemble a two-wheeled Smart
Car chassis powered by the **Cytron Maker Pi RP2040** microcontroller board,
then progressively program it in **MicroPython** — starting with blinking LEDs
and ending with wirelessly connected robots that coordinate with each other over
Bluetooth. Every lab reinforces the four pillars of computational thinking:
abstraction, algorithm design, decomposition, and pattern recognition.

See the full [course description](course-description.md) for topics, learning
outcomes, and assessment methods.

### Who is this course designed for?

The course targets **grades 8–12** — junior high and high school students — with
**no prior coding experience required**. The only prerequisite is basic comfort
with a keyboard and web browser. Because the robot costs under $35 and requires
no soldering, it is accessible to schools with modest budgets and no electronics
lab. Advanced students will find plenty of depth in the later chapters on
wireless networking, Bluetooth Low Energy, and swarm robotics.

### What will I be able to do by the end of the course?

By the end of the course you will be able to write complete MicroPython programs
that control motors, read multiple sensor types, draw graphics on an OLED
display, and communicate wirelessly. Specifically, you will build a collision
avoidance robot, a line follower, a browser-controlled WiFi robot, and a pair of
Bluetooth robots that coordinate with each other. You will also understand the
engineering design process well enough to design and build your own original
capstone project. See [course description](course-description.md) for the full
list of Bloom's-taxonomy-aligned learning outcomes.

### Do I need any previous coding experience?

No. The course starts from the very beginning — what a variable is, how to write
a loop, how to define a function. You do not need to have used Python,
MicroPython, or any other language before. Students who have coded before will
move through the early chapters quickly and will find new challenges in the
hardware and wireless units.

### How much does the robot cost?

The complete robot — Cytron Maker Pi RP2040 board, Smart Car chassis, DC motors,
time-of-flight sensor, NeoPixel LEDs, OLED display, piezo buzzer, and battery
pack — costs approximately **$35 USD** when parts are sourced from typical
online retailers. A Raspberry Pi Pico W variant that adds WiFi and Bluetooth
capability costs a few dollars more. See the [parts list](setup/20-parts-list.md)
for a detailed cost breakdown.

### What hardware and software do I need to get started?

**Hardware:** The Cytron Maker Pi RP2040 robot kit (or equivalent), four AA
batteries, and a USB cable for connecting to your computer.

**Software:** The **Thonny IDE**, which is free, beginner-friendly, and available
for Windows, macOS, and Linux. The robot itself runs **MicroPython**, which you
install on the board once using a UF2 firmware file — no separate Python
installation needed. See [Getting Started](setup/index.md) and
[Thonny Installation](setup/05-thonny-installation.md) for step-by-step guides.

### How long does the course take?

The course is designed for **14 weeks**, typically meeting two to three times per
week. Each week introduces one major topic through a combination of reading,
interactive simulations (MicroSims), and hands-on lab work. The final two weeks
are reserved for student-designed capstone projects.

### Is soldering required to build the robot?

**No.** This is an explicit design goal of the course. All components connect
using Grove connectors and Dupont jumper wires — plug-and-play connections that
require no soldering iron, no flux, and no heat. This makes the course safe and
accessible in any classroom. See [Base Kit Assembly](setup/10-base-kit-assembly.md)
for the full assembly guide.

### What is a MicroSim?

A **MicroSim** is an interactive browser-based simulation embedded directly in
the textbook pages. MicroSims let you experiment with concepts — adjusting PWM
duty cycles, watching an H-bridge switch states, exploring how collision avoidance
decisions branch — without needing the physical hardware. There are over 20
MicroSims in this textbook covering topics from analog vs. digital signals to
swarm robot communication topology. See the [MicroSims list](sims/index.md).

### Who is Sparky?

**Sparky** is the course mascot — a cartoon version of the two-wheeled robot you
build in this course. Sparky appears in six roles throughout each chapter:
welcoming you at the start, helping you think through hard concepts, sharing
practical tips, warning you about common pitfalls, encouraging you when things
get difficult, and celebrating with you at the end of each chapter. Sparky never
appears randomly — each appearance has a clear teaching purpose.

### How is this textbook organized?

The textbook follows a deliberate **learning graph** structure where each chapter
builds on the previous one. The 13 chapters progress from computational thinking
fundamentals (Chapter 1) through hardware assembly, MicroPython programming,
electronics, motors, sensors, displays, autonomous navigation, WiFi networking,
Bluetooth Low Energy, and swarm robotics (Chapter 13). Each chapter lists its
prerequisite concepts and the new concepts it introduces. See the
[chapters overview](chapters/index.md) and the [learning graph](learning-graph/index.md).

### What is the capstone project?

The capstone project (Weeks 13–14) is an **open-ended student-designed project**
that must integrate at least two sensor types, a display, and a novel algorithm.
Students document their design process, present their robot, and write a short
reflection connecting the project to the four pillars of computational thinking.
Example capstone ideas include an automated plant-watering alerter, a maze-solving
robot, a musical instrument robot, and a multi-robot formation system.

### What programming language does this course use?

All robot programming is done in **MicroPython**, a compact, efficient version
of Python 3 designed for microcontrollers. MicroPython syntax is nearly identical
to standard Python, so skills transfer directly if you move on to data science,
web development, or general programming. The course uses the free **Thonny IDE**
as the development environment. See
[MicroPython and Development Environment](chapters/03-micropython-dev-environment/index.md).

---

## Core Concepts

### What is computational thinking?

**Computational thinking** is a problem-solving methodology that applies computer
science techniques to understand and address complex problems — even outside of
computing. It consists of four core skills: **decomposition** (breaking a problem
into smaller parts), **abstraction** (focusing on what matters and ignoring
irrelevant details), **algorithm design** (creating a step-by-step solution), and
**pattern recognition** (identifying similarities that let you reuse solutions).

In this course, computational thinking is the lens through which every robot
challenge is approached — from "how do I make the robot stop before hitting a
wall?" to "how do I coordinate multiple robots over Bluetooth?" See
[Chapter 1](chapters/01-intro-computational-thinking/index.md).

### What are the four pillars of computational thinking?

The four pillars are:

1. **Decomposition** — Breaking a complex problem into smaller, solvable pieces. Example: splitting "build a collision avoidance robot" into motor control, sensor reading, and decision logic.
2. **Abstraction** — Hiding complexity behind a name. Example: calling `drive_forward()` without needing to remember pin numbers and duty cycles.
3. **Algorithm Design** — Writing a precise, ordered sequence of steps. Example: the collision avoidance loop: read sensor → if distance < threshold → stop and turn → else drive forward.
4. **Pattern Recognition** — Noticing repeating structures you can reuse. Example: every robot program has a setup section, a main loop, and a cleanup section.

These four pillars appear in every chapter. See
[Chapter 1](chapters/01-intro-computational-thinking/index.md).

### What is physical computing?

**Physical computing** is the practice of using hardware and software together to
sense the physical world (via inputs like sensors and buttons) and affect it (via
outputs like motors, LEDs, and speakers). Your robot is a physical computing
device: MicroPython programs read distance from a sensor (input), make a decision
in code, then drive motors (output) in response. Physical computing is the
connecting thread between the software you write and the real-world behavior of
the robot. See [Chapter 1](chapters/01-intro-computational-thinking/index.md).

### What is MicroPython?

**MicroPython** is a lean implementation of Python 3 that runs directly on
microcontrollers. It gives you standard Python syntax — variables, loops,
functions, lists, modules — in a form small enough to fit on a chip with only
264 KB of RAM. On this robot, MicroPython runs on the RP2040 chip and provides
built-in modules for controlling GPIO pins, PWM, I2C, SPI, Bluetooth, and more.
The free Thonny IDE connects to the robot over USB so you can write, upload, and
run programs immediately. See
[Chapter 3](chapters/03-micropython-dev-environment/index.md).

### What is the Cytron Maker Pi RP2040?

The **Cytron Maker Pi RP2040** is the robot's "brain" — a printed circuit board
built around the Raspberry Pi RP2040 microcontroller chip. It includes two DC
motor drivers (H-bridges), four NeoPixel RGB LEDs, a piezo buzzer, Grove
connectors for sensors and displays, and a battery holder for four AA batteries.
It costs roughly $12–$15 USD. The Raspberry Pi Pico W is an alternative that
adds WiFi and Bluetooth capability. See
[Chapter 2](chapters/02-hardware-platform-assembly/index.md) and the
[Cytron Maker Pi setup guide](setup/25-cytron-maker-pi-rp2040.md).

### What is a GPIO pin?

**GPIO** stands for General-Purpose Input/Output. These are numbered electrical
connection points on the microcontroller that your programs can control. A GPIO
pin set as an **output** can be driven HIGH (3.3 V) or LOW (0 V) to turn an LED
on or off, trigger a motor driver, or generate a signal. A pin set as an
**input** reads whether an external signal is HIGH or LOW — useful for buttons
and digital sensors. The Cytron board exposes GPIO pins via Grove connectors.
See [Chapter 2](chapters/02-hardware-platform-assembly/index.md).

### What is a microcontroller?

A **microcontroller** is a small, self-contained computer on a single chip. It
includes a processor, memory (RAM and flash), and input/output peripherals —
all in one package. Unlike a general-purpose computer, a microcontroller runs
one dedicated program and interacts directly with hardware. The RP2040
(Raspberry Pi's chip) is this course's microcontroller. It runs at up to 133 MHz,
has 264 KB of RAM, and controls everything on the robot — motors, sensors, LEDs,
and wireless radios. See [Chapter 2](chapters/02-hardware-platform-assembly/index.md).

### What is PWM?

**Pulse Width Modulation (PWM)** is a technique for simulating a variable voltage
using rapid on/off switching. The processor switches a pin between HIGH and LOW
thousands of times per second. The fraction of time spent HIGH — the **duty cycle**
— controls the effective power delivered to a component. A 50% duty cycle drives
a motor at roughly half speed; a 100% duty cycle drives it at full speed; 0%
stops it. PWM controls motor speed, servo angle, LED brightness, and speaker
tone on this robot. See [Chapter 7](chapters/07-pwm-motor-speed-actuators/index.md).

### What is an H-bridge circuit?

An **H-bridge** is a circuit made of four switches (transistors) arranged in an
H shape that allows current to flow through a motor in either direction. By
closing different pairs of switches, you can make a DC motor spin forward,
backward, or stop. The Cytron board includes two built-in H-bridge motor driver
ICs — one for each wheel — so you never need to wire the H-bridge yourself. See
[Chapter 6](chapters/06-electronics-motors-protocols/index.md) and the
[H-Bridge MicroSim](sims/h-bridge/index.md).

### What is differential drive?

**Differential drive** is the steering mechanism used by most two-wheeled robots:
speed each wheel independently to steer. If both wheels turn at the same speed,
the robot drives straight. If the right wheel turns faster than the left, the
robot curves left. If the left wheel spins forward while the right spins backward,
the robot pivots in place. All turning in this course is achieved through
differential drive — there is no separate steering mechanism. See
[Chapter 7](chapters/07-pwm-motor-speed-actuators/index.md).

### What is a time-of-flight sensor?

A **time-of-flight (ToF) sensor** measures distance by emitting a laser pulse
and timing how long it takes to reflect back from an object. The VL53L0X sensor
on this robot can measure distances from about 3 cm to 200 cm with millimeter
precision. It communicates with the microcontroller over the I2C bus. ToF sensors
are more accurate than ultrasonic sensors and work well in indoor robotics. See
[Chapter 8](chapters/08-sensors-data-input/index.md) and the
[Time-of-Flight Sensor setup guide](setup/30-tof-sensor.md).

### What is the I2C bus?

**I2C** (Inter-Integrated Circuit) is a two-wire serial communication protocol
that lets a microcontroller talk to multiple sensors and displays using only two
wires: **SDA** (data) and **SCL** (clock). Each device on the bus has a unique
address. On this robot, I2C connects the VL53L0X time-of-flight sensor and the
SSD1306 OLED display to the RP2040 using GPIO pins 16 (SDA) and 17 (SCL).
Multiple devices can share the same two wires as long as each has a different
address. See [Chapter 6](chapters/06-electronics-motors-protocols/index.md).

### What is an OLED display?

The robot's **OLED display** is a 128 × 64 pixel monochrome screen that can show
text, geometric shapes, bar charts, and animated graphics. It uses the SSD1306
driver chip and communicates over I2C. Programs draw to a **framebuffer** in
RAM and then flush the entire buffer to the screen at once. The display is small
but bright and readable, making it ideal for showing distance readings, robot
status, and even animated "face" expressions. See
[Chapter 9](chapters/09-display-systems-output/index.md).

### What is collision avoidance?

**Collision avoidance** is the behavior where a robot detects an obstacle ahead,
stops, turns in a random direction, and then drives forward again — repeating
continuously. It uses **closed-loop feedback**: the time-of-flight sensor
continuously measures distance, the program compares that reading to a threshold,
and the motors respond accordingly. The collision avoidance algorithm is one of
the first complete autonomous behaviors students implement in this course. See
[Chapter 10](chapters/10-robot-behaviors-navigation/index.md).

### What is line following?

**Line following** is a robot behavior where two infrared (IR) sensors mounted
under the robot detect a dark line on a light floor. Each sensor outputs a
digital HIGH or LOW signal depending on whether it sees the line. The program
reads both sensors and adjusts each wheel's speed to keep the robot centered on
the line using **motor differential adjust** — if the left sensor leaves the
line, the left wheel slows and the right wheel speeds up to steer back. See
[Chapter 10](chapters/10-robot-behaviors-navigation/index.md).

### What is closed-loop feedback?

**Closed-loop feedback** (also called a feedback loop) is a control strategy
where the robot continuously measures the result of its actions and adjusts its
behavior based on what it measures. This is opposed to open-loop control, where
commands are sent without checking whether they worked. Collision avoidance,
line following, and servo positioning all use closed-loop feedback. The sensor
reading closes the loop between the robot's actions and its environment. See
[Chapter 10](chapters/10-robot-behaviors-navigation/index.md).

### What is Bluetooth Low Energy?

**Bluetooth Low Energy (BLE)** is a wireless communication standard designed for
short-range, low-power data transfer. Unlike classic Bluetooth (used for audio),
BLE is optimized for sending small packets infrequently — ideal for robot commands.
The Raspberry Pi Pico W includes a BLE radio. In this course, BLE enables direct
robot-to-robot communication without a WiFi access point or internet connection.
Two robots can discover, pair, and send movement commands to each other in real
time. See [Chapter 12](chapters/12-bluetooth-low-energy/index.md).

### What is swarm robotics?

**Swarm robotics** is the study of how groups of simple robots can exhibit
complex collective behavior through local interactions — without central
coordination. Each robot follows simple rules, but the group-level outcome
(avoiding obstacles collectively, forming convoys, synchronized movement) is
more sophisticated than any single robot could achieve alone. In Chapter 13,
students implement leader-follower patterns, convoy following, and synchronized
dance routines using BLE. See
[Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### What is emergent behavior?

**Emergent behavior** occurs when simple rules applied to individual agents
produce complex, unpredicted patterns at the group level. A school of fish
maintains a fluid, coordinated shape with no leader — each fish simply follows
its neighbors. In this course, swarm robots exhibit emergent behavior when simple
rules like "mirror the leader's speed" or "stop if your neighbor stops" create
flock-like collective motion. Emergent behavior is a key concept in distributed
systems, ecology, and economics. See
[Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### What is the engineering design process?

The **engineering design process** is an iterative cycle of: **plan → build →
test → improve**. In robotics, this means designing a solution on paper, writing
code, running it on the robot, observing what goes wrong, and refining the
design. Students apply this process in every lab — collision avoidance thresholds,
sensor calibration values, and line-following gains are all tuned through
deliberate testing and iteration. Persistence and systematic debugging are core
engineering skills this process develops. See
[Chapter 1](chapters/01-intro-computational-thinking/index.md).

### What are NeoPixel LEDs?

**NeoPixel** is Adafruit's name for WS2812B addressable RGB LEDs — each LED in
a strip contains its own control chip and can be set to any of 16 million colors
independently using a single data wire. The Cytron board includes four NeoPixels.
In MicroPython, the `neopixel` module lets you set any LED's red, green, and
blue channels as integers from 0 to 255. NeoPixels are used in this course for
status indicators, animations, and visual feedback. See
[Chapter 9](chapters/09-display-systems-output/index.md).

### What is the Thonny IDE?

**Thonny** is a free, lightweight Python IDE (Integrated Development Environment)
designed for beginners. It includes a built-in MicroPython mode that connects
directly to the robot over USB — letting you write code on your computer, run it
immediately on the robot, and see output in the interactive REPL shell below the
editor. Thonny also handles uploading files to the robot's flash storage.
Download it free at thonny.org. See
[Thonny Installation](setup/05-thonny-installation.md).

### What is the REPL?

The **REPL** (Read-Eval-Print Loop) is an interactive command-line interface
where you type MicroPython commands one at a time and see the result immediately.
In Thonny, the REPL panel at the bottom of the screen lets you test code snippets
on the robot without writing a full program — perfect for checking sensor readings,
testing motor commands, and exploring new modules. The REPL is essential for
debugging and learning. See
[Chapter 3](chapters/03-micropython-dev-environment/index.md).

### What is WiFi IoT control?

**WiFi IoT control** is the capability to control the robot from a web browser
over a local wireless network. A Raspberry Pi Pico W can act as a tiny web
server: it connects to a WiFi access point, gets an IP address, and serves an
HTML control page. When a student clicks a button in their browser, the browser
sends an HTTP request to the robot, which then drives the motors in response.
This is a simple but complete example of the **Internet of Things** (IoT). See
[Chapter 11](chapters/11-wireless-networking-web-servers/index.md).

### What is a servo motor?

A **servo motor** is a motor that rotates to a specific angle and holds it,
rather than spinning continuously like a DC motor. Servos are controlled by
PWM: a pulse width sent 50 times per second tells the servo which angle to hold
(typically 0°–180°). On this robot, a servo can mount a sensor (like the ToF
sensor) to sweep and scan the environment, or drive a mechanism that requires
precise positioning. See [Chapter 7](chapters/07-pwm-motor-speed-actuators/index.md).

---

## Technical Detail Questions

### What is a PWM duty cycle?

The **duty cycle** is the percentage of time a PWM signal is HIGH (on) within
each cycle. On the RP2040, duty cycle is expressed as a 16-bit integer from
**0** (always off) to **65535** (always on). A duty cycle of 32767 (~50%)
drives a motor at roughly half speed. A duty cycle of 0 stops the motor. The
relationship between duty cycle and real-world motor speed is not perfectly
linear — motors need a minimum duty cycle (dead zone) to start spinning. See
[Chapter 7](chapters/07-pwm-motor-speed-actuators/index.md).

### What does the config.py file do?

The `config.py` file centralizes all hardware-specific constants — GPIO pin
numbers, PWM frequencies, I2C bus IDs, sensor addresses, and speed limits —
in one place. Every other program imports from `config.py` using
`from config import *`, so if you rewire the robot or change a sensor, you
update one file instead of hunting through multiple programs. This is the
**import config pattern**, a fundamental software engineering practice. See
[Chapter 5](chapters/05-data-structures-modular-code/index.md) and
[Chapter 10](chapters/10-robot-behaviors-navigation/index.md).

### What is a secrets.py file?

The `secrets.py` file stores sensitive credentials — specifically the WiFi
network name (SSID) and password — separately from the main program. The file is
listed in `.gitignore` so it is never accidentally committed to a public
repository. Programs import WiFi credentials from `secrets.py` using
`from secrets import SSID, PASSWORD`. This pattern is a best-practice security
measure: code is shareable but credentials stay private. See
[Chapter 5](chapters/05-data-structures-modular-code/index.md) and
[Chapter 11](chapters/11-wireless-networking-web-servers/index.md).

### What is the difference between a for loop and a while loop?

A **for loop** runs a fixed number of times, iterating over a sequence such as
a range of numbers or a list:
```python
for i in range(10):
    print(i)
```

A **while loop** runs as long as a condition is true — potentially forever:
```python
while distance > 20:
    drive_forward()
```

Robot main loops almost always use `while True:` (infinite loop) because the
robot needs to keep responding to its environment indefinitely. For loops are
used for fixed-count tasks like LED animations or sensor averaging. See
[Chapter 4](chapters/04-control-flow-functions/index.md).

### What is exception handling in MicroPython?

**Exception handling** uses `try/except/finally` blocks to catch errors and
run cleanup code even when something goes wrong:
```python
try:
    run_robot()
except Exception as e:
    print("Error:", e)
finally:
    stop_motors()
```
The `finally` block **always** runs — even after a `KeyboardInterrupt` (when
you press Ctrl+C to stop the program). This ensures motors are safely stopped
instead of running forever. Exception handling is required in every production
robot program in this course. See
[Chapter 4](chapters/04-control-flow-functions/index.md).

### What is the VL53L0X sensor?

The **VL53L0X** is the specific model of time-of-flight distance sensor used in
this course. Made by ST Microelectronics, it uses an invisible 940 nm laser to
measure distances from 3 cm to 200 cm. It communicates over I2C, typically at
address `0x29`. The sensor requires a MicroPython library (`vl53l0x.py`) that
handles initialization and polling. Raw readings must be calibrated using a
zero-distance offset and an optional scale factor. See
[Chapter 8](chapters/08-sensors-data-input/index.md).

### What is the SSD1306 display driver?

The **SSD1306** is the controller chip inside the robot's OLED display. The
MicroPython `ssd1306` library provides a `SSD1306_I2C` class that draws to an
in-memory **framebuffer**. You call methods like `.text()`, `.line()`, `.rect()`,
`.fill_rect()`, and `.ellipse()` to build a frame, then call `.show()` to push
the buffer to the screen. The display is 128 pixels wide and 64 pixels tall,
with pixel (0, 0) at the top-left corner. See
[Chapter 9](chapters/09-display-systems-output/index.md).

### What is the difference between I2C and SPI?

**I2C** uses two wires (SDA data + SCL clock) and supports multiple devices on
the same bus, each identified by a unique address. It is slower but uses fewer
wires — ideal for sensors and displays where cable economy matters.

**SPI** uses four wires (MOSI, MISO, SCK, CS) and is faster, but each device
needs its own chip-select wire. SPI is preferred for high-speed devices like
SD card readers. On this robot, I2C is used for the ToF sensor and OLED display;
SPI is available on the Cytron board for other peripherals. See
[Chapter 6](chapters/06-electronics-motors-protocols/index.md).

### What does a framebuffer do?

A **framebuffer** is a region of RAM that holds the pixel data for one complete
display frame. Instead of sending each drawing command directly to the screen
(which would cause visible flickering), you draw everything into the framebuffer
first, then call `.show()` to push the entire buffer to the display in one
operation. This technique produces smooth, flicker-free output. The SSD1306
library manages the framebuffer automatically. See
[Chapter 9](chapters/09-display-systems-output/index.md).

### What are GATT, central, and peripheral in BLE?

**GATT** (Generic Attribute Profile) is the BLE protocol that defines how data
is organized and exchanged. A **GATT service** is a logical grouping of related
data (e.g., a "Robot Control" service), and a **GATT characteristic** is one
specific data value within that service (e.g., "movement command").

A **peripheral** device advertises itself and waits for connections — typically
the robot being controlled. A **central** device scans for peripherals, connects,
and sends commands — typically the controller robot or phone. In the Swarm Robots
lab, the leader robot acts as central and the follower acts as peripheral. See
[Chapter 12](chapters/12-bluetooth-low-energy/index.md).

### What is the difference between open-loop and closed-loop motor control?

**Open-loop control** sends a fixed command to the motors without checking the
result. Example: `drive_forward(speed=50000)` runs for 2 seconds, hoping the
robot traveled the right distance. It is simple but inaccurate — motor
friction, battery voltage, and floor surface all cause unpredictable variation.

**Closed-loop control** continuously measures the outcome and adjusts the
command. Example: collision avoidance reads the sensor every iteration and
changes motor speed based on measured distance. Closed-loop control is more
complex but far more reliable for real-world navigation. See
[Chapter 10](chapters/10-robot-behaviors-navigation/index.md) and the
[Open vs. Closed Loop MicroSim](sims/open-closed-loop-comparison/index.md).

### What is the difference between BLE and WiFi for robot control?

**WiFi** provides higher bandwidth, longer range (up to 50+ meters), and connects
through a standard access point — letting you control the robot from any device
on the same network, including phones and laptops with a browser. Setup is more
complex and requires a network.

**BLE** has shorter range (roughly 10–30 meters), lower power consumption, and
enables **direct robot-to-robot communication** without a WiFi router. BLE is
preferred for robot swarms and peer-to-peer scenarios. WiFi is preferred for
browser-based dashboards and IoT telemetry. See
[Chapter 12](chapters/12-bluetooth-low-energy/index.md) and the
[WiFi vs BLE MicroSim](sims/wifi-vs-ble-topology/index.md).

### What is HTTP GET vs. POST?

**HTTP GET** requests retrieve information from a server. In the web server lab,
a GET request loads the robot's control web page in the browser.

**HTTP POST** requests send data to the server to trigger an action. When you
click "Forward" on the robot's web page, JavaScript sends a POST request with
the command in the body. The robot's web server reads the command and drives the
appropriate motors. POST is safer than GET for actions that change robot state
because browsers do not cache or pre-fetch POST requests. See
[Chapter 11](chapters/11-wireless-networking-web-servers/index.md).

### What is a UF2 firmware file?

A **UF2 file** is a special binary format used to flash firmware onto
microcontrollers like the Raspberry Pi Pico. To install MicroPython, you hold
the **BOOTSEL** button while plugging in the USB cable, which makes the Pico
appear as a USB drive on your computer. You then drag-and-drop the
`rp2-pico-micropython-XXXX.uf2` file onto that drive. The Pico automatically
flashes the firmware and reboots into MicroPython. See
[Chapter 3](chapters/03-micropython-dev-environment/index.md).

### What is the BOOTSEL button?

The **BOOTSEL** (Boot Selection) button is a small button on the Raspberry Pi
Pico board. Holding it down while connecting the USB cable puts the board into
USB mass storage mode, allowing you to drag a UF2 firmware file onto it.
Under normal operation (button not held), the Pico boots directly into
MicroPython. You only need to use BOOTSEL once during initial setup or when
re-flashing the firmware. See [Chapter 3](chapters/03-micropython-dev-environment/index.md).

### What is the `machine` module in MicroPython?

The **`machine`** module is MicroPython's hardware abstraction layer. It
provides classes for controlling all hardware peripherals on the RP2040:
`machine.Pin` for GPIO, `machine.PWM` for pulse-width modulation,
`machine.I2C` for I2C communication, `machine.SPI` for SPI, `machine.Timer`
for timed events, and more. Virtually every robot program in this course imports
from `machine`. See [Chapter 3](chapters/03-micropython-dev-environment/index.md).

### What is the `time` module used for?

The **`time`** module provides `time.sleep()` and `time.sleep_ms()` for pausing
execution, and `time.ticks_ms()` / `time.ticks_diff()` for measuring elapsed
time without blocking. In robot programs, `time.sleep_ms(100)` creates a 100 ms
pause between sensor readings. Precise timing lets you implement timed motor
patterns, pulsed LED animations, and debounced button reads. See
[Chapter 4](chapters/04-control-flow-functions/index.md).

### What is a potentiometer input?

A **potentiometer** (or "pot") is a variable resistor — a knob that outputs a
voltage proportional to its position. On the robot, a potentiometer connects to
an ADC (Analog-to-Digital Converter) pin, which reads a value from 0 to 65535
corresponding to the knob's position. Potentiometers are used to adjust
parameters at runtime — for example, tuning the collision distance threshold or
LED brightness — without changing and re-uploading code. See
[Chapter 8](chapters/08-sensors-data-input/index.md).

### What is the gitignore file for?

A **`.gitignore`** file tells the Git version control system which files to
exclude from commits. In this course, `.gitignore` must include `secrets.py`
to prevent WiFi credentials from being accidentally pushed to a public GitHub
repository. It may also exclude `__pycache__` directories and other generated
files. See [Chapter 5](chapters/05-data-structures-modular-code/index.md).

---

## Common Challenges

### Why won't my robot move when I run my program?

Check in this order:

1. **Battery:** Are four AA batteries installed and charged? Motors draw much more current than sensors or LEDs — weak batteries that keep the OLED lit may not power the motors.
2. **USB cable:** Some USB cables are charge-only (no data). If Thonny can't connect, the program may not be running on the robot at all.
3. **Pin assignments:** Open `config.py` and verify the `RIGHT_FORWARD_PIN`, `LEFT_FORWARD_PIN`, etc. match the physical wiring on your board.
4. **Duty cycle:** A duty cycle below the motor's dead zone (~15,000–20,000 on a 16-bit scale) won't produce enough torque to spin the wheels. Try a higher starting value.
5. **Motor direction test:** Run the motor connection test lab first to confirm each motor moves before adding more complex logic. See [Chapter 6](chapters/06-electronics-motors-protocols/index.md).

### Why does my distance sensor always read 0 or a very wrong value?

The most common causes are:

- **Wiring:** Double-check that SDA and SCL are connected to the correct Grove/Dupont pins and that the sensor has power (VCC) and ground (GND).
- **I2C scanner:** Run the I2C scanner program to verify the sensor appears at address `0x29`. If nothing shows up, the sensor is not communicating. See the [I2C Scanner lab](kits/base/09-i2c-scanner-test.md).
- **Library missing:** The `vl53l0x.py` library file must be uploaded to the robot's flash storage. Check the Files panel in Thonny.
- **Too close or too far:** The VL53L0X reads reliably between 3 cm and 200 cm. Readings below 3 cm or above 200 cm may return 0 or the maximum value.
- **Calibration:** A zero-distance offset may be needed. See [Chapter 8](chapters/08-sensors-data-input/index.md).

### Why does my robot drive in circles instead of straight?

DC motors of the same model have slightly different friction and winding
characteristics, so identical duty cycles produce slightly different speeds.
Solutions:

1. **Trim the duty cycle:** Add a small constant to one motor's duty cycle to compensate. This is often called a trim value in `config.py`.
2. **Check connections:** Confirm left and right motor wires are connected to the correct terminal block headers on the Cytron board.
3. **Check wheels:** Make sure both wheels are fully seated on the motor shafts with no wobble.
4. **Use closed-loop control:** Encoder feedback (advanced) is the only perfect solution; for this course, manual trimming is the standard approach.

See [Chapter 7](chapters/07-pwm-motor-speed-actuators/index.md).

### My motors keep running after I press Ctrl+C. How do I stop them?

This happens when your program does not have a `try/except/finally` block to
handle `KeyboardInterrupt`. Without it, pressing Ctrl+C abruptly stops the
Python interpreter, but the PWM signals already sent to the motor driver keep
running.

The fix is to always wrap your main loop in:
```python
try:
    main_loop()
finally:
    stop_motors()
```
The `finally` block runs even on Ctrl+C and calls `stop_motors()`, which sets
all motor duty cycles to 0. See
[Chapter 4](chapters/04-control-flow-functions/index.md).

### My WiFi won't connect. What should I check?

1. **secrets.py:** Verify that `SSID` and `PASSWORD` match your network exactly — WiFi credentials are case-sensitive.
2. **2.4 GHz network:** The Pico W only supports 2.4 GHz WiFi, not 5 GHz. Make sure you are connecting to the 2.4 GHz band.
3. **Network type:** Use a standard WPA2 personal network. Enterprise networks with certificate authentication are not supported.
4. **Ping test:** Run the ping test slow lab to confirm connectivity before building the web server. See the [Ping Test lab](kits/wifi-bot/02-ping-test-slow.md).
5. **WLAN timeout:** WiFi connection can take 5–15 seconds. Make sure your connection loop waits long enough before declaring failure. See [Chapter 11](chapters/11-wireless-networking-web-servers/index.md).

### Thonny says "No module named X". How do I fix it?

This error means the required library file (e.g., `vl53l0x.py`, `ssd1306.py`)
is not present in the robot's flash storage. To fix it:

1. In Thonny, go to **View → Files** to open the file manager panel.
2. Navigate to the library file on your computer (left panel).
3. Right-click it and choose **Upload to /** to copy it to the robot.
4. Verify the file appears in the right panel (the robot's filesystem).
5. Re-run your program.

Library files from `src/lib/` in this repository must be uploaded before the
first use. See [Chapter 3](chapters/03-micropython-dev-environment/index.md).

### Why is my OLED display showing nothing?

Check these in order:

1. **I2C wiring:** Verify SDA and SCL are connected to the correct pins (GPIO 16 and 17 by default). A loose wire on SDA or SCL prevents all communication.
2. **I2C address:** Run the I2C scanner to confirm the display appears (typically at `0x3C` or `0x3D`). If it doesn't appear, the display has no power or the wiring is wrong.
3. **show() call:** Drawing to the framebuffer is invisible until `.show()` is called. Make sure your code calls `oled.show()` after all drawing commands.
4. **Library upload:** The `ssd1306.py` library must be on the robot. See [Chapter 9](chapters/09-display-systems-output/index.md).

### My BLE robots won't find each other. What should I check?

1. **Both running:** Both the peripheral (follower) and central (leader) programs must be running simultaneously on separate Pico W boards.
2. **Advertising name:** The central scans for a specific advertised name. Verify the peripheral's advertised name in its code matches what the central scans for.
3. **Distance:** BLE range is typically 10–30 meters indoors. Start with robots 1–2 meters apart.
4. **One connection at a time:** A BLE peripheral can only be connected to one central at a time. If a previous session did not disconnect cleanly, restart both robots.
5. **Check the REPL:** Both programs should print connection status to the REPL in Thonny. Watch for error messages. See [Chapter 12](chapters/12-bluetooth-low-energy/index.md).

### Why does my servo motor jitter or not reach the right angle?

1. **PWM frequency:** Servos expect a 50 Hz PWM signal. If `machine.PWM` is initialized at the wrong frequency, the servo will behave erratically.
2. **Pulse width range:** The valid pulse width for most hobby servos is 500 µs (0°) to 2500 µs (180°). Values outside this range cause jitter or stalling.
3. **Power supply:** Servos draw significant current on startup. If the batteries are weak or the servo is on the same supply as the MCU without adequate filtering, voltage drops cause jitter.
4. **Calibration:** Use the servo calibration constants in `config.py` to map your servo's actual min/max pulse widths. See [Chapter 7](chapters/07-pwm-motor-speed-actuators/index.md).

### My program runs but the robot doesn't behave as expected. Where do I start?

Use the **debugging fundamentals** process from the course:

1. **Isolate subsystems:** Test motors alone, sensor alone, then together. Don't debug everything at once.
2. **Add print statements:** Insert `print(distance)`, `print(left_speed, right_speed)` to see real values at runtime in the Thonny REPL.
3. **Check logic flow:** Add a `print("reached if branch")` to confirm your conditionals are triggering when you expect.
4. **Simplify:** Comment out complex features and test the simplest version first.
5. **Distinguish hardware vs. software:** If the sensor reads correctly but the robot still misbehaves, the bug is in the decision logic, not the sensor.

See [Chapter 1](chapters/01-intro-computational-thinking/index.md) for debugging
fundamentals and [Chapter 2](chapters/02-hardware-platform-assembly/index.md)
for hardware troubleshooting.

### Why does my line follower lose the line on curves?

Line following on curves fails when the motor differential adjustment is too slow
or too small. Solutions:

1. **Increase speed differential:** When one sensor leaves the line, increase the correction magnitude — a larger speed difference between left and right wheels steers more aggressively.
2. **Lower overall speed:** Slower speed gives more time to react to sensor changes.
3. **Reduce sensor polling delay:** The `time.sleep_ms()` delay between sensor reads directly limits how quickly corrections are applied. Try 10–20 ms instead of 100 ms.
4. **Sensor height:** IR sensors must be 3–8 mm above the surface to read the line reliably. Check sensor mounting height.

See [Chapter 10](chapters/10-robot-behaviors-navigation/index.md).

### How do I handle a robot that crashes Thonny when I run my program?

Thonny loses its serial connection when the robot crashes or is power-cycled.
To reconnect:

1. Press the **STOP** button (red square) in Thonny to release the serial port.
2. If that doesn't work, close and reopen Thonny.
3. Check that the correct serial port is selected in the bottom-right corner of Thonny (it shows the COM port or `/dev/tty` device).
4. If the robot is in a crash loop (crashing repeatedly on boot), hold BOOTSEL while plugging in to enter bootloader mode, then re-flash MicroPython.

See [Chapter 3](chapters/03-micropython-dev-environment/index.md).

---

## Best Practices

### Why should I always use a config.py file?

Centralizing pin numbers, speed limits, and calibration constants in `config.py`
makes your code **portable** (change the hardware, change one file) and
**readable** (the main program says `LEFT_FORWARD_PIN`, not `17`). It also makes
sharing code easier — someone else can use your program with their robot just by
updating `config.py`. In production systems this pattern is called a "hardware
abstraction layer." Every robot program in this course uses it. See
[Chapter 5](chapters/05-data-structures-modular-code/index.md).

### How should I organize a robot program?

Follow the four-section structure used throughout this course:

1. **Imports and configuration** — import modules and constants from `config.py`
2. **Hardware initialization** — create PWM objects, I2C bus, sensor and display drivers
3. **Helper functions** — `drive_forward()`, `turn_left()`, `read_distance()`, `stop_motors()`
4. **Main loop** — `try: while True: [robot logic] finally: stop_motors()`

This structure makes programs readable, testable, and easy to extend. See
[Chapter 10](chapters/10-robot-behaviors-navigation/index.md) for a complete example.

### Why must I use try/except/finally in robot programs?

Motors continue running until their duty cycle is set to zero — they don't stop
just because the program ends. If you press Ctrl+C without a `finally` block,
the motors keep spinning and your robot drives away (or into something). The
`finally` block runs guaranteed cleanup code regardless of how the program ends:
normal exit, Ctrl+C, or any other error. This is a safety requirement in every
production robot program. See
[Chapter 4](chapters/04-control-flow-functions/index.md).

### When should I use open-loop vs. closed-loop motor control?

Use **open-loop** when exact positioning doesn't matter: driving a fixed
distance for a dance sequence, running a demo, or testing motor wiring. Open-loop
is simpler to code and sufficient for many lab tasks.

Use **closed-loop** whenever the robot needs to respond to real-world variation:
collision avoidance, line following, maintaining a target distance. Closed-loop
control is more robust against motor wear, battery voltage changes, and surface
friction — all of which affect actual wheel speed independently of the commanded
duty cycle. See [Chapter 10](chapters/10-robot-behaviors-navigation/index.md).

### How do I calibrate a sensor properly?

Two-point calibration is the standard method:

1. **Zero point:** Place the sensor at a known zero reference (e.g., hold it touching the target). Record the raw reading. This is your `ZERO_DISTANCE_OFFSET`.
2. **Scale point:** Place the sensor at a known reference distance (e.g., exactly 100 mm). Record the raw reading. Compute the scale factor: `SCALE_FACTOR = 100 / (raw_reading - offset)`.
3. **Apply:** In code, `calibrated = (raw - ZERO_DISTANCE_OFFSET) * SCALE_FACTOR`.
4. **Validate:** Test at several distances and check accuracy.

Store calibration constants in `config.py`. See the
[Sensor Calibration MicroSim](sims/sensor-calibration-explorer/index.md) and
[Chapter 8](chapters/08-sensors-data-input/index.md).

### Should I use WiFi or BLE for my robot project?

**Choose WiFi when:**
- You want to control the robot from a phone or laptop browser
- You need to log data to a server or display a dashboard
- Range over 30 meters is needed
- You're connecting only one robot to a controller

**Choose BLE when:**
- You want direct robot-to-robot communication
- You're building a swarm with multiple robots
- Low power consumption is important
- No WiFi access point is available (field use)

Both use the Raspberry Pi Pico W. See [Chapter 12](chapters/12-bluetooth-low-energy/index.md).

### How do I write readable MicroPython code for robots?

Follow these practices used throughout this course:

- **Name constants in ALL_CAPS**: `MAX_SPEED = 60000` instead of magic number `60000`
- **Name functions with verbs**: `drive_forward()`, `stop_motors()`, `read_distance()`
- **Keep functions short**: Each function does one thing. If a function is longer than 15 lines, break it up.
- **Use `config.py`**: No raw pin numbers in application code
- **Add one-line comments** only where the *why* is non-obvious (hardware quirks, calibration rationale)
- **Test incrementally**: Get motors working before adding sensors; get sensors working before adding collision logic

See [Chapter 5](chapters/05-data-structures-modular-code/index.md).

### What is the best way to debug a malfunctioning robot?

The systematic debugging process from this course:

1. **Reproduce the problem consistently** before trying to fix it
2. **Isolate** — test one subsystem at a time (motor, sensor, display)
3. **Add print statements** to observe values at runtime in the REPL
4. **Form a hypothesis** about the cause before making changes
5. **Change one thing at a time** and test after each change
6. **Distinguish hardware from software** — a wiring problem won't be fixed by changing code
7. **Consult the I2C scanner** if any sensor or display stops responding

Resist the urge to change multiple things at once — it makes it impossible to
know what fixed the problem. See
[Chapter 1](chapters/01-intro-computational-thinking/index.md).

### How do I choose the right sensor for my project?

| Sensor | Best For | Limitation |
|--------|----------|------------|
| Time-of-Flight (VL53L0X) | Accurate distance, 3–200 cm | Narrow beam angle, no outdoor use |
| Ultrasonic | Wide beam, 2–400 cm | Slower, affected by sound absorption |
| Infrared | Line detection, close proximity | Affected by ambient light, surface color |
| Bump switch | Hard contact detection | Only triggers on physical contact |
| Potentiometer | Manual input / parameter tuning | Requires human adjustment |

For collision avoidance, use the ToF sensor. For line following, use infrared.
For bumper protection, use bump switches. See
[Chapter 8](chapters/08-sensors-data-input/index.md).

### How do I use Git effectively for robot projects?

The basics taught in Chapter 5:

1. **Initialize a repo**: `git init` in your project folder
2. **Create .gitignore**: Always exclude `secrets.py` and `__pycache__/`
3. **Commit frequently**: After each lab milestone that works
4. **Write meaningful commit messages**: "Add collision avoidance with 20 cm threshold" not "update"
5. **Never commit credentials**: WiFi passwords and API keys must be in `secrets.py` and gitignored
6. **Use GitHub** to back up your work and share code

See [Chapter 5](chapters/05-data-structures-modular-code/index.md) and the
[Git Commit Workflow MicroSim](sims/git-commit-workflow/index.md).

### How do I safely test a robot program for the first time?

1. **Test on a desk first**: Prop the robot up so the wheels are off the surface. Run the program and watch the wheels instead of the robot.
2. **Start with low duty cycles**: Begin at 20–30% speed for new motor code so any surprises are slow surprises.
3. **Have your hand ready on the USB cable**: Pulling the USB cable instantly cuts power to the robot if anything goes wrong.
4. **Test in a clear area**: Remove fragile or expensive objects from the robot's operating area.
5. **Add a distance limit**: Test collision avoidance with a book wall — not a glass shelf.

See [Chapter 1](chapters/01-intro-computational-thinking/index.md) for the
engineering design process and safety practices.

---

## Advanced Topics

### What is a state machine pattern?

A **state machine** models a system as a set of discrete states (e.g., IDLE,
DRIVING, AVOIDING, TURNING) with defined transitions between them. Instead of
nested if-statements, the robot stores its current state in a variable and the
main loop executes the behavior for the current state:
```python
if state == "DRIVING":
    drive_forward()
    if distance < THRESHOLD:
        state = "AVOIDING"
elif state == "AVOIDING":
    stop_motors()
    turn_random()
    state = "DRIVING"
```
State machines make complex behaviors easier to reason about, test, and extend.
See [Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### How does PID control work?

**PID (Proportional-Integral-Derivative) control** is a feedback algorithm that
computes a correction based on three components:

- **P (Proportional)**: Correction proportional to the current error
- **I (Integral)**: Correction proportional to accumulated past error (removes steady-state offset)
- **D (Derivative)**: Correction proportional to the rate of error change (dampens oscillation)

PID produces smoother, more stable control than simple on/off logic. For example,
a PID line follower adjusts motor differential gradually rather than switching
between full-left and full-right. PID is introduced as an advanced topic in
[Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### What is multithreading on a microcontroller?

The RP2040 has two processor cores, so MicroPython can run two threads in
parallel using the `_thread` module. Example: one thread reads sensors
continuously while another handles web server requests or BLE messages. This is
useful when blocking I/O (like waiting for a web request) would otherwise stall
sensor reading. Multithreading adds complexity — shared data must be protected
with locks to prevent race conditions. See
[Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### How do I design a custom swarm behavior?

Designing a swarm behavior involves four steps:

1. **Define the goal**: What should the group do? (E.g., form a convoy, avoid obstacles collectively, synchronize movement)
2. **Write individual rules**: What does each robot sense and do? (E.g., "if my neighbor speeds up, I speed up")
3. **Define communication**: What messages do robots exchange over BLE? How often?
4. **Test with two robots first**: Scale to larger groups only after the two-robot version is reliable

The key insight is that emergent group behavior arises from simple local rules —
you do not program the group behavior directly. See
[Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### What is sensor fusion?

**Sensor fusion** is the technique of combining readings from multiple sensors
to produce a more accurate or reliable measurement than any single sensor can
provide. For example, combining ToF sensor data with ultrasonic data and IR
reflectance gives a more complete picture of the robot's surroundings. A simple
fusion technique is averaging — take N readings from different sensors and
average them. More sophisticated methods use Kalman filters to weight sensors
by their known accuracy. See
[Chapter 8](chapters/08-sensors-data-input/index.md).

### What is asynchronous programming in MicroPython?

**Asynchronous programming** uses `asyncio` (available in MicroPython) to
interleave multiple tasks without threads. Instead of blocking on `time.sleep()`,
an async function yields control with `await asyncio.sleep_ms()`, allowing
another coroutine to run in the meantime. This is especially useful for handling
BLE events and sensor reading simultaneously in a single-threaded style.
`asyncio` is more predictable than `_thread` for most robot use cases. See
[Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### What is data logging and why would I use it?

**Data logging** records sensor readings to flash memory or over serial for later
analysis. For example, logging distance readings every 100 ms during a test run
lets you graph the robot's path and identify where collision avoidance triggered.
On the RP2040, you can log to a CSV file in flash using `open()` and write mode.
Data logging turns anecdotal "it seemed to work" into measurable evidence —
essential for tuning algorithms scientifically. See
[Chapter 13](chapters/13-swarm-robotics-advanced-patterns/index.md).

### What are the physical limitations of this robot?

Understanding hardware limits helps you design realistic projects:

- **Speed**: Maximum wheel speed is approximately 0.5 m/s on a smooth floor
- **Distance sensing**: VL53L0X reliable range is 3–200 cm; targets smaller than the beam width may not register
- **WiFi range**: Pico W WiFi reaches ~30 meters indoors with clear line of sight
- **BLE range**: BLE reaches ~10–20 meters reliably indoors; walls reduce range significantly
- **Battery life**: Four AA batteries last approximately 1–3 hours depending on motor usage
- **Flash storage**: 2 MB flash; large programs or log files can fill it — check available space with `os.statvfs('/')`
- **RAM**: 264 KB shared between program and data; complex programs with large data structures can run out

Plan your capstone project with these constraints in mind. See
[Chapter 2](chapters/02-hardware-platform-assembly/index.md).

### What topics are NOT covered in this course?

The following topics are adjacent but explicitly out of scope to keep the course
completable in 14 weeks at the beginner level:

- Cloud IoT platforms (AWS IoT, Azure IoT Hub)
- Machine learning and TinyML on microcontrollers
- Computer vision and camera modules
- GPS and outdoor autonomous navigation
- SLAM (Simultaneous Localization and Mapping)
- Soldering and custom PCB design
- ROS (Robot Operating System)
- 3D printing for custom chassis
- MQTT, REST APIs, and cloud data logging (brief overview only)

These are excellent directions for independent study after completing this course.
See [course description](course-description.md) for the complete out-of-scope list.
