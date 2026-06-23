---
title: Course Description for Computational Thinking with STEM Robots
description: A detailed course description for a 14-week hands-on high school course teaching computational thinking using low-cost MicroPython-programmable robots, including overview, topics covered, and learning objectives structured using the 2001 Bloom's Taxonomy.
quality_score: 97
---

# Computational Thinking with STEM Robots

**Title:** Computational Thinking with STEM Robots

**Target Audience:** High school students, grades 9–12, with little or no prior coding experience

**Prerequisites:** None. Basic familiarity with a keyboard and web browser is helpful but not required.

---

## Course Overview

This 14-week, hands-on course introduces high school students to computational thinking through
building and programming low-cost STEM robots. Students work with a ~$35 robot built on the
**Cytron Maker Pi RP2040** board — a powerful microcontroller platform featuring two DC motors,
a time-of-flight distance sensor, NeoPixel LEDs, a piezo buzzer, and a 128×64 OLED display.
All programming is done in **MicroPython** using the free, beginner-friendly **Thonny IDE**.

The course is organized around four cornerstones of computational thinking — **abstraction**,
**algorithms**, **decomposition**, and **pattern recognition** — and weaves these ideas through
every lab and project. Students begin by blinking LEDs, progress through motor control and sensor
reading, and culminate in open-ended capstone projects that integrate multiple subsystems of
the robot. Because all hardware fits in a single chassis that costs under $35 and requires no
soldering, the course is accessible to schools with modest budgets and no electronics background
requirement.

Beyond programming syntax, the course teaches students how physical computing connects the
digital world to the physical world through sensors (inputs) and actuators (outputs). Students
learn to read real-world data — distances, line positions, button states — and to make their
robots respond intelligently. The course introduces wireless control via a Raspberry Pi
Pico W variant, covering both WiFi (web server control) and **Bluetooth Low Energy (BLE)**
communication between robots. The Bluetooth unit culminates in a **Swarm Robots lab** where
pairs of robots coordinate through BLE messaging to exhibit collective behaviors — an
accessible introduction to distributed systems and emergent intelligence. The final weeks
are reserved for student-designed projects, encouraging creativity, persistence, and
engineering iteration.

---

## Main Topics Covered

1. **Computational Thinking Foundations** — abstraction, algorithms, decomposition, pattern recognition
2. **Physical Computing** — sensors, actuators, microcontrollers, and the hardware-software interface
3. **Robot Hardware** — Cytron Maker Pi RP2040 board, Smart Car chassis, DC motors, servo motors, sensors, displays
4. **MicroPython Programming** — syntax, variables, data types, control structures, functions, modules
5. **Electronics Fundamentals** — circuits, voltage, current, GPIO pins, PWM, H-bridge, I2C bus, SPI bus
6. **Sensor Integration** — time-of-flight, ultrasonic, infrared, and bump sensors; calibration and data interpretation
7. **Motor and Actuator Control** — DC motor direction and speed, servo angle, NeoPixel LEDs, piezo buzzer
8. **Display Programming** — text and graphics on OLED; data visualization; animated output
9. **Collision Avoidance and Line Following** — closed-loop feedback, threshold-based decisions, algorithm tuning
10. **Wireless and IoT Concepts** — WiFi connectivity, web servers on microcontrollers, HTTP GET/POST
11. **Bluetooth Communication** — Bluetooth Low Energy (BLE) on Raspberry Pi Pico W; advertising, scanning, GATT services, peer-to-peer robot messaging
12. **Swarm Robotics** — coordinating multiple robots via BLE; emergent behaviors, leader/follower patterns, collective obstacle avoidance
13. **Engineering Design Process** — iterative build-test-improve cycle, debugging, documentation
14. **Student Capstone Projects** — open-ended projects integrating sensors, displays, motors, and wireless

---

## Topics Not Covered

The following topics are adjacent to this course but are **explicitly out of scope** to keep the
course accessible to beginners and completable in 14 weeks:

- Cloud platforms and cloud-based IoT services (AWS IoT, Azure IoT Hub)
- Machine learning and AI inference on microcontrollers (TinyML)
- Computer vision and camera modules
- GPS navigation and outdoor autonomous robots
- SLAM (Simultaneous Localization and Mapping)
- Soldering and custom PCB design
- Advanced robotics kinematics and dynamics
- ROS (Robot Operating System)
- 3D printing for custom chassis
- Advanced data structures (trees, graphs, linked lists) beyond lists and dictionaries
- Regular expressions
- MQTT, REST APIs, and cloud data logging (overview only)

---

## Learning Outcomes

After completing this course, students will be able to:

---

### Remember
*Retrieving, recognizing, and recalling relevant knowledge from long-term memory.*

- **List** the four pillars of computational thinking: abstraction, algorithms, decomposition, and pattern recognition.
- **Recall** the names and functions of the main components of the Cytron Maker Pi RP2040 robot: microcontroller, DC motors, time-of-flight sensor, NeoPixel LEDs, OLED display, and piezo buzzer.
- **Identify** the MicroPython syntax for variables, loops, conditionals, and function definitions.
- **Name** the two primary communication protocols used in the robot: I2C and SPI.
- **Recall** what Pulse Width Modulation (PWM) is and which robot components it controls (motor speed, servo angle, LED brightness, speaker tone).
- **State** the purpose of a hardware configuration file (`config.py`) and why pin assignments are centralized there.
- **Recognize** common MicroPython modules and their roles: `machine`, `time`, `neopixel`, `network`, `socket`, `bluetooth`.
- **Recall** the key terms of Bluetooth Low Energy: advertising, scanning, GATT, characteristic, central, peripheral.
- **Identify** the six levels of Bloom's 2001 Taxonomy and the type of thinking each level represents.

---

### Understand
*Constructing meaning from instructional messages, including oral, written, and graphic communication.*

- **Explain** how physical computing connects software decisions to physical actions (sensors as inputs, motors and LEDs as outputs).
- **Describe** how an H-bridge circuit reverses motor direction by changing the polarity of voltage across a DC motor.
- **Interpret** time-of-flight distance sensor readings and explain how calibration constants (zero distance, scale factor) affect the reported value.
- **Summarize** the difference between I2C and SPI communication protocols and give an example of when each is used on the robot.
- **Explain** how PWM duty cycle controls the speed of a DC motor and the angle of a servo motor.
- **Describe** the closed-loop feedback principle used in collision avoidance: sensor reads distance → algorithm decides action → motors respond.
- **Explain** why a `secrets.py` file is used for WiFi credentials and why it should be excluded from version-controlled repositories.
- **Interpret** a simple MicroPython program that uses functions, global variables, and exception handling to run and cleanly shut down a robot.
- **Describe** the difference between open-loop and closed-loop (feedback) motor control and give an example of each.
- **Explain** how Bluetooth Low Energy (BLE) differs from WiFi in terms of range, power consumption, and use case, and why BLE is preferred for robot-to-robot communication.
- **Describe** the concept of emergent behavior in swarm robotics: how simple per-robot rules produce complex group-level outcomes.

---

### Apply
*Carrying out or using a procedure in a given situation.*

- **Write** MicroPython programs that use variables, `for` loops, `while` loops, `if/elif/else` conditionals, and user-defined functions to control robot hardware.
- **Connect** the I2C bus in MicroPython to read distance data from the VL53L0X time-of-flight sensor.
- **Configure** PWM objects in MicroPython to set motor speed, servo angle, and speaker frequency.
- **Program** NeoPixel LEDs to display specific colors and sequences using the `neopixel.NeoPixel` library.
- **Assemble** the robot chassis by mounting motors, attaching the Cytron board, connecting the battery pack, and wiring sensors without soldering.
- **Use** the Thonny IDE to upload files, run programs, and interact with the MicroPython REPL for debugging.
- **Implement** a hardware configuration file and import it into programs to decouple pin assignments from logic.
- **Apply** `try/except/finally` blocks to ensure motors and sensors are cleanly shut down on `KeyboardInterrupt`.
- **Build** a basic web server on the Raspberry Pi Pico W that serves an HTML page and responds to HTTP GET and POST requests.
- **Program** the OLED display to show text, draw geometric shapes, and display a bar chart of live sensor data.
- **Implement** the collision avoidance algorithm, including reverse, random turn direction, and forward drive logic.

---

### Analyze
*Breaking material into constituent parts and determining how the parts relate to one another and to an overall structure or purpose.*

- **Compare** the behavior of the robot under different collision distance thresholds and analyze how each parameter affects performance.
- **Examine** a MicroPython program and identify which sections handle sensing, which handle decision-making, and which handle actuation.
- **Distinguish** between hardware bugs (loose wires, wrong pin, incorrect voltage) and software bugs (logic errors, off-by-one, wrong variable) when troubleshooting a malfunctioning robot.
- **Analyze** the relationship between PWM duty cycle values and real-world motor speed or servo position.
- **Break down** the line-following algorithm into its sensor-reading, comparison, and motor-adjustment components, and explain how each part contributes to staying on track.
- **Examine** the trade-offs of using a time-of-flight sensor versus an ultrasonic sensor versus an infrared sensor for collision avoidance.
- **Differentiate** between synchronous communication (I2C, SPI with clock line) and event-driven interrupt-based programming.
- **Analyze** how the web server handles different HTTP request types (GET vs. POST) and routes each to the appropriate hardware action.

---

### Evaluate
*Making judgments based on criteria and standards through checking and critiquing.*

- **Assess** the quality of a MicroPython program for readability, modularity, use of a configuration file, and correctness of error handling.
- **Evaluate** the effectiveness of a collision avoidance algorithm in a real test environment and propose specific improvements.
- **Judge** whether a robot's behavior is caused by a sensor accuracy problem, a calibration error, or a logic flaw — and justify the diagnosis.
- **Test** and **validate** time-of-flight sensor accuracy by comparing programmatic readings to physical measurements and evaluating the sensor's limits.
- **Critique** the design of a peer's robot project for completeness, safety (proper cleanup code), and adherence to computational thinking principles.
- **Evaluate** the trade-offs between exploration-based and competition-based robotics events in terms of engagement, inclusion, and learning outcomes.
- **Select** the most appropriate sensor type for a given navigation scenario and defend the choice with technical reasoning.
- **Assess** the security implications of storing WiFi credentials in plain text versus using a secrets file excluded from version control.

---

### Create
*Putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure.*

- **Design and build** a custom robot behavior (e.g., a "dance" routine, a sound-and-light show, a distance-triggered alarm) by combining motor, LED, and audio subsystems.
- **Develop** a complete collision avoidance robot program from scratch, including configuration constants, movement functions, sensor reading, and clean shutdown logic.
- **Construct** a line-following robot that reads dual IR sensors and adjusts motor differential to stay on track.
- **Design** a hardware configuration file for a new robot variant and refactor existing programs to use it.
- **Build** a wireless robot that serves a web interface for LED or motor control using the Raspberry Pi Pico W.
- **Produce** an OLED data visualization that displays live sensor readings as a scrolling bar chart or distance meter.
- **Create** a capstone project that integrates at least two sensor types, a display, and a novel algorithm — demonstrating end-to-end computational thinking from problem decomposition through testing and iteration.
- **Compose** a short written reflection that connects the robot project to the four pillars of computational thinking, identifying specific moments of abstraction, decomposition, pattern recognition, and algorithm design.
- **Extend** an existing robot program with a new feature (servo-mounted sensor sweep, animated face, WiFi control) by following a modular design pattern.

---

## Assessment Methods

- **Weekly Labs**: Hands-on programming assignments tied to each module; evaluated on functionality and code quality.
- **Lab Reflections**: Short written responses connecting each lab to computational thinking concepts.
- **Peer Code Reviews**: Students critique a partner's program for readability, modularity, and correctness.
- **Midterm Challenge**: Multi-step challenge combining motor control, sensor reading, and display output.
- **Capstone Project**: Open-ended final project with requirements for sensor integration, original algorithm, display output, and a brief presentation.
- **Portfolio**: Collected code files, reflections, and project documentation demonstrating growth over the course.
