# Concepts Covered — STEM Robots v1

This is a raw enumeration of all concepts covered across the markdown content
in this repository. Concepts are grouped thematically for readability; the
ordering within each group reflects approximate teaching sequence.

---

## 1. Hardware & Physical Computing

### Microcontroller Platform
- Raspberry Pi RP2040 chip
- Raspberry Pi Pico microcontroller
- Cytron Maker Pi RP2040 board
- BOOTSEL button (boot selection / UF2 flashing)
- GPIO (General Purpose Input/Output) pins
- GPIO pin numbering and pinout diagrams
- Flash memory
- RAM (264K SRAM on RP2040)
- USB cable for programming and power
- Raspberry Pi Pico W (with built-in WiFi)

### Robot Chassis & Mechanical
- Smart Car chassis
- DC motor mounting and wheel attachment
- Battery pack (4 AA batteries)
- AA batteries and voltage
- Robot chassis assembly (no-soldering approach)
- Castellated edge PCB connections
- Dupont connectors / jumper wires
- Grove connectors (standardized plug-and-play)
- Breadboards

### Motors & Actuators
- DC motors (6-volt hobby motors)
- Motor direction (forward / reverse)
- Motor speed control
- H-bridge circuit
- H-bridge switch states (S1–S4)
- DPDT (Double Pole Double Throw) switch
- SPST (Single Pole Single Throw) switch
- Motor driver / DC motor driver IC
- Servo motors (SG90 micro-servo)
- Servo angle control (–90° to +90°)
- Servo PWM frequency and duty cycle calibration
- Piezo buzzer / speaker

### Sensors
- Sensor types overview (bump, IR, ultrasonic, ToF, LIDAR)
- Time-of-Flight (ToF) distance sensor (VL53L0X)
- I2C address scanning for sensors
- Ultrasonic distance sensors
- Infrared (IR) distance sensors
- Bump switches / microswitches
- Potentiometer (analog input / sensor calibration)
- Analog vs. digital signals
- ADC (Analog-to-Digital Converter)
- Sensor calibration (zero distance, scale factor)
- Sensor fusion (combining multiple sensor inputs)

### Displays & LEDs
- NeoPixels / WS2816 individually addressable RGB LEDs
- LED strip animations
- RGB LED (Red, Green, Blue)
- GPIO status LEDs
- OLED display (128×64 monochrome)
- SSD1306 display driver chip
- Framebuffer
- Blit (copy operation for framebuffer)
- Resolution (width × height in pixels)
- SPI bus (for OLED display)
- I2C bus (for sensors and peripherals)
- SPI vs. I2C comparison

### Electronics Fundamentals
- Voltage, current, and basic circuits
- Power management and battery usage
- LiPo battery
- Transistors for motor control
- Resistors and resistance values
- Simple circuit construction
- Electrical safety
- Breadboard layout

---

## 2. Communication Protocols

- Serial communication basics
- I2C protocol (Inter-Integrated Circuit)
- I2C bus setup (SDA, SCL pins, frequency)
- I2C device scanning
- SPI protocol (Serial Peripheral Interface)
- SPI vs. I2C trade-offs
- GPIO interrupt-driven communication
- Network sockets
- HTTP protocol (GET and POST requests)
- WiFi connectivity (STA_IF mode)
- Secrets file (SSID / password management)
- Ping test (network reachability)
- Web server on microcontroller
- IP address assignment
- Port 80 (HTTP default port)
- Bluetooth (overview)

---

## 3. MicroPython Programming

### Environment & Setup
- MicroPython overview and purpose
- Thonny IDE installation and setup
- Thonny REPL (Read-Eval-Print Loop)
- Connecting Pico to computer via USB
- UF2 file (firmware flashing)
- MPFShell (file management over serial)
- Uploading files to microcontroller
- Syntax highlighting and autocomplete

### Core Language Concepts
- Variables and assignment
- Data types: integer, float, string, boolean
- Arithmetic operators
- Comparison operators
- Logical operators
- Control structures: `if`, `elif`, `else`
- `for` loops
- `while` loops
- Functions (`def`)
- Function parameters and return values
- Scope (local vs. global variables)
- `global` keyword
- Exception handling (`try` / `except` / `finally`)
- `KeyboardInterrupt` handling for clean shutdown
- Importing modules (`import`, `from … import`)
- Built-in libraries (`time`, `machine`, `utime`, etc.)
- Lists (creation, indexing, iteration)
- Tuples (immutable sequences)
- Dictionaries (key-value pairs)
- String manipulation (concatenation, slicing)
- Formatted strings / f-strings
- String interpolation (PEP 498)
- Comments and code documentation
- Recursion

### Hardware-Specific MicroPython
- `machine.Pin` (digital I/O)
- `machine.PWM` (Pulse Width Modulation output)
- `machine.I2C` (I2C bus object)
- `machine.SPI` (SPI bus object)
- `time.sleep` / `sleep_ms` / `ticks_ms`
- `neopixel.NeoPixel` (LED strip control)
- `urandom.random()` (randomness for robot behaviors)
- Pin interrupt registration (`irq`, `IRQ_FALLING`)
- Button debouncing (software technique)
- Duty cycle (`duty_u16`)
- PWM frequency setting

### Configuration & Modularity
- Hardware configuration file (`config.py`)
- Pin assignment constants (naming conventions)
- Modular programming (separating concerns)
- Reusable functions (motor on/off, get_distance)
- Secrets file pattern (`secrets.py`)
- `.gitignore` for sensitive files

### Advanced Programming Topics
- Interrupts and asynchronous events
- Timers and delays
- State machines
- Multithreading in MicroPython
- Asynchronous programming
- Data logging
- Storing data on SD cards (overview)
- Real-time clocks (overview)
- Queues and stacks (data structures)
- Regular expressions (overview)
- Version control with Git
- Integrated Development Environments (IDEs)

---

## 4. Pulse Width Modulation (PWM)

- PWM concept (duty cycle, frequency, period)
- PWM for LED brightness control
- PWM for DC motor speed control
- PWM for servo motor angle control
- 16-bit duty cycle values (0–65535)
- PWM frequency selection (e.g., 40 Hz for servos)
- Linear mapping / range conversion function
- PWM cleanup on shutdown

---

## 5. Robot Behaviors & Algorithms

- Motor control primitives (forward, reverse, turn left, turn right, stop)
- Open-loop motor control
- Closed-loop feedback control
- Collision avoidance algorithm
- Random turn direction (probabilistic behavior)
- Distance threshold–based decision making
- Line following algorithm
- IR sensor differential reading for line following
- Sensor-to-motor feedback loop
- Proportional-Integral-Derivative (PID) control (overview)
- Robot "dance" sequences (timed movement patterns)
- Displaying distance on LED bar graph
- Obstacle detection and path planning (overview)
- Maze navigation (overview)
- Autonomous robot behavior

---

## 6. Display Programming

- OLED display initialization (I2C and SPI modes)
- Displaying text on OLED
- Drawing primitives: lines, circles, rectangles, polygons
- Framebuffer drawing commands
- Data visualization: bar charts of sensor data
- Displaying real-time sensor readings
- Animated faces on OLED
- Display distance as graphical meter
- Servo position meter display

---

## 7. Wireless & IoT

- WiFi setup on Raspberry Pi Pico W
- Network WLAN object
- Connecting to access point (SSID / password)
- Checking connection status (`wlan.isconnected()`)
- IP address retrieval
- Ping test (slow vs. fast power modes)
- Simple web server (socket-based)
- HTTP GET and POST request handling
- Generating dynamic HTML from Python (f-strings)
- JavaScript `fetch()` API (client-side button click)
- LED control via web browser
- IoT concepts and applications
- Private network access configuration

---

## 8. Computational Thinking

- Abstraction (focusing on essential information)
- Algorithms (step-by-step problem solving)
- Decomposition (breaking problems into parts)
- Pattern recognition (identifying similarities)
- Explainability (can AI explain its decisions?)
- Bias in computing
- Events (what starts or changes a program)
- Loops (repeating tasks)
- Variables (referencing common values)
- Conditionals (if/then/else logic)
- Functions (grouping and naming code blocks)
- Function parameters (reusability)
- Data types in computational thinking
- Data structures (lists, dictionaries)
- Debugging (finding and fixing errors)
- Testing and iteration (iterative improvement)
- Output and visualization (text, graphics, serial)
- Feedback (user input and program response)
- Scope and variable protection
- Drawing as an on-ramp to computational thinking
- Recursion (functions calling themselves)
- Logging (keeping records of program execution)

---

## 9. Engineering & Design Process

- Design and prototyping methodology
- Mechanical design considerations (weight, balance)
- Iterative design process (build → test → improve)
- Project planning and management
- Integrating multiple sensors and actuators
- Safety practices in electronics labs
- Troubleshooting hardware and software
- Documentation and clear code
- Collaboration and teamwork
- Assessment and self-reflection

---

## 10. Educational Approaches & Pedagogy

- Physical computing as a learning approach
- Computational thinking pedagogy
- Rhizomatic learning (non-linear, interconnected knowledge)
- Learning graphs / dependency-based curriculum
- Bloom's Taxonomy (2001 revision: Remember, Understand, Apply, Analyze, Evaluate, Create)
- Exploration vs. competition in robotics education
- Inclusive robotics education (gender, race, socioeconomic equity)
- MicroSims (small web-based interactive simulations)
- Generative AI for customizing lesson plans
- Grade-level differentiation (5th grade through 12th grade)
- Hands-on / experiential learning
- Challenge-based extension activities
- Student-designed final projects

---

## 11. Advanced & Optional Topics

- Sensor fusion (combining ToF + ultrasonic + IR)
- Machine learning basics in robotics
- Image processing basics
- Camera modules (overview)
- GPS modules (overview)
- SLAM (Simultaneous Localization and Mapping) — overview
- Path planning algorithms
- NFC modules (overview)
- Gesture control (overview)
- Voice command integration (overview)
- Encoders for motor feedback
- Accelerometers and gyroscopes
- Bluetooth communication
- MQTT protocol (overview)
- REST APIs (overview)
- Cloud integration (overview)
- Advanced AI for object recognition (overview)
