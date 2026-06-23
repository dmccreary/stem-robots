# Concept Taxonomy — Computational Thinking with STEM Robots

13 categories covering all 240 concepts. Each category has a 3–5 letter TaxonomyID.

---

| # | TaxonomyID | Category Name | Count | Description |
|---|-----------|---------------|-------|-------------|
| 1 | FOUND | Foundation Concepts | 10 | Computational thinking pillars and physical computing framing |
| 2 | ENV | Development Environment | 8 | Thonny IDE, REPL, firmware flashing, file upload |
| 3 | PROG | Python Programming | 36 | MicroPython syntax, data types, control flow, functions, modules, data structures |
| 4 | HW | Hardware Platform | 14 | RP2040, Raspberry Pi Pico, Cytron board, GPIO pins, connectors |
| 5 | ELEC | Electronics Fundamentals | 12 | Voltage, circuits, resistors, transistors, breadboard, batteries |
| 6 | MOTOR | Motors and Actuators | 27 | DC motors, H-bridge, PWM, servo motors, piezo buzzer |
| 7 | SENSOR | Sensors and Input | 19 | ToF, ultrasonic, IR, bump switches, ADC, calibration |
| 8 | DISPLAY | Display and Output | 22 | NeoPixels, OLED display, framebuffer, drawing primitives, charts |
| 9 | ROBOT | Robot Behaviors | 18 | Collision avoidance, line following, feedback loops, dance, config patterns |
| 10 | NET | Networking and Wireless | 18 | WiFi, web server, HTTP, sockets, IoT |
| 11 | BLE | Bluetooth and Swarm | 26 | BLE, GATT, swarm robotics, leader/follower, emergent behavior |
| 12 | COMM | Communication Protocols | 11 | I2C, SPI, GPIO interrupts, debouncing, timers, serial |
| 13 | ENG | Engineering Design | 19 | Design process, troubleshooting, documentation, git, advanced patterns |

---

## Category Descriptions

### FOUND — Foundation Concepts
Concepts that ground all subsequent learning. Covers the four pillars of computational
thinking (abstraction, algorithms, decomposition, pattern recognition), problem solving
strategy, debugging mindset, physical computing as a discipline, and experiential learning.
These concepts have no prerequisites — they are the entry points to the graph.

### ENV — Development Environment
Everything needed to get started writing and uploading code. Covers the Thonny IDE,
REPL interactive shell, UF2 firmware flashing, BOOTSEL button, and file upload workflow.

### PROG — Python Programming
Core MicroPython language constructs: variables, data types, operators, control flow
(if/for/while), functions, exception handling, modules, data structures (lists, tuples,
dictionaries), strings, and modular programming patterns. The largest single category
because programming fluency underpins every other skill.

### HW — Hardware Platform
The physical computing substrate: Raspberry Pi Pico, RP2040 chip, Cytron Maker Pi RP2040
board, Raspberry Pi Pico W, GPIO pins and numbering, flash memory, Grove and Dupont
connectors, castellated edge PCB, pinout diagram.

### ELEC — Electronics Fundamentals
Basic electronics concepts needed to understand how the robot's circuits work: voltage
and current, basic circuits, resistors, transistors, breadboard layout, Smart Car chassis,
batteries (AA and LiPo), power management, analog vs digital signals, ADC.

### MOTOR — Motors and Actuators
DC motor control from first principles through PWM-based code: motor direction (H-bridge),
motor speed (PWM duty cycle), differential drive, servo motors, servo calibration, piezo
buzzer and tone generation. The second-largest category, reflecting the robot's core identity
as a motor-driven platform.

### SENSOR — Sensors and Input
All sensor types used in the course: time-of-flight (VL53L0X), ultrasonic, infrared, bump
switches, and potentiometer. Includes I2C sensor setup, calibration (zero distance, scale
factor), data filtering, and sensor fusion concepts.

### DISPLAY — Display and Output
Output subsystems: NeoPixel LED strips (colors, animation), OLED display (text, drawing
primitives, framebuffer, blit), data visualization (bar charts, distance meter), animated
faces. Both I2C and SPI display modes covered.

### ROBOT — Robot Behaviors
Integrated robot programs that combine motors, sensors, and displays: collision avoidance,
line following, robot dance, timed patterns. Also covers configuration file patterns,
pin assignment constants, and secrets/gitignore file patterns for project hygiene.

### NET — Networking and Wireless
WiFi connectivity on the Raspberry Pi Pico W: WLAN object, access point connection,
ping tests, socket-based web server, HTTP GET/POST handling, HTML generation, JavaScript
fetch API, IoT concepts.

### BLE — Bluetooth and Swarm Robotics
Bluetooth Low Energy from fundamentals to multi-robot coordination: BLE advertising,
scanning, GATT protocol (services and characteristics), central/peripheral roles, BLE
pairing and messaging, and the Swarm Robotics lab (leader/follower, emergent behavior,
collective obstacle avoidance, convoy following).

### COMM — Communication Protocols
Hardware communication protocols and low-level I/O: I2C bus (SDA/SCL, frequency
configuration), SPI bus, GPIO interrupts (IRQ, falling edge), button debouncing, timers
and delays, serial communication, I2C scanner tool.

### ENG — Engineering Design
Engineering process and software craftsmanship: design-build-test cycle, prototyping,
mechanical design, no-soldering assembly, hardware and software troubleshooting, safety
practices, code documentation, project planning, version control (git), and advanced
programming patterns (state machines, multithreading, async, PID control).
