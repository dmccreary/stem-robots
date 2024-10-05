## Order of Lessons and Concept

This section provides you with
sample prompts you can give to any
generative AI system.  The first
is a general prompt that just
returns a list of concepts.  The
next prompt is much more detailed
and includes exactly the tools
you have in your lab.

## Sample General Prompt

```linenums="0"
You are an expert at teaching MicroPython to high school
students using fun sensors and displays to create fun
STEM robots.

List the 100 most important concepts that you would teach
in your courses.  For each concept, just return the
name of the concept without any definition. 
Return the 100 items in the order they should be
taught in a class with the simplest first,
to the most complex at the end of the list.  
```

## ChatGPT response

1. Introduction to MicroPython
1. Setting Up the Thonny Development Environment
1. Basic Syntax and Variables
1. Data Types
1. Arithmetic Operators
1. Comparison Operators
1. Logical Operators
1. Control Structures: If Statements
1. Control Structures: Else and Elif
1. For Loops
1. While Loops
1. Functions
1. Parameters and Return Values
1. Importing Modules
1. Using Built-in Libraries
1. Working with LEDs
1. Reading Button Inputs
1. Serial Communication Basics
1. Using the REPL
1. Exception Handling
1. Lists
1. Tuples
1. Dictionaries
1. String Manipulation
1. Working with Time and Delays
1. Understanding Analog vs Digital Signals
1. GPIO Pin Basics
1. Pulse Width Modulation (PWM)
1. Reading Analog Sensors
1. Writing to LCD Displays
1. Using I2C Communication
1. Using SPI Communication
1. Handling Interrupts
1. Debouncing Buttons
1. Managing Power Consumption
1. Introduction to Robotics
1. Motor Control Basics
1. Using Servo Motors
1. Using DC Motors
1. Understanding H-Bridge Circuits
1. Using Motor Drivers
1. Reading from Ultrasonic Sensors
1. Using Temperature Sensors
1. Using Light Sensors
1. Using Accelerometers
1. Using Gyroscopes
1. Implementing Serial Protocols
1. Debugging Techniques
1. Introduction to Version Control with Git
1. Project Planning and Design
1. Building a Basic Robot Frame
1. Integrating Sensors and Actuators
1. Using Bluetooth Modules
1. Using Wi-Fi Modules
1. Implementing Bluetooth Communication
1. Implementing Wi-Fi Communication
1. Data Logging Techniques
1. Storing Data on SD Cards
1. Using Real-Time Clocks
1. Implementing Timers
1. PWM for LED Dimming
1. Creating a User Interface
1. Using Touch Sensors
1. Implementing Obstacle Avoidance
1. Line Following Algorithms
1. Introduction to PID Control
1. Using Encoders
1. Implementing Feedback Loops
1. Basics of Machine Learning
1. Creating Autonomous Behaviors
1. Implementing Remote Control
1. Introduction to Speech Recognition
1. Using Camera Modules
1. Basics of Image Processing
1. Integrating Multiple Sensors
1. Power Management for Robots
1. Wireless Charging Basics
1. Safety Practices in Robotics
1. Designing for Modularity
1. Implementing Error Recovery
1. Advanced Data Structures
1. Using Queues and Stacks
1. Multithreading in MicroPython
1. Asynchronous Programming
1. Implementing State Machines
1. Networking Protocols
1. Cloud Integration Basics
1. Using MQTT Protocol
1. Implementing REST APIs
1. Secure Communication Practices
1. Basics of Encryption
1. Advanced Sensor Fusion
1. Path Planning Algorithms
1. Introduction to SLAM (Simultaneous Localization and Mapping)
1. Using GPS Modules
1. Integrating with Mobile Devices
1. Using NFC Modules
1. Implementing Gesture Control
1. Voice Command Integration
1. Advanced AI for Object Recognition

## STEM Robotics Course

```linenums="0"
You are an expert at teaching MicroPython to high
school students using fun sensors and displays to
create fun STEM robots.  In your lab,
you have the following equipment:

1. Computers running the Thonny IDE
2. Raspberry Pi Picos mounted on breadboards
3. Basic electronic components (LEDs, resistors, transistors, motors, etc.)
4. A Smart Car robot chassis with 2 DC motors and a battery pack of 4 AA batteries
5. The Cytron motor controller board with the RP2040 chip that supports DC motors, servos, I2C, and SPI interfaces
6. 128x64 OLED displays that use the SPI interface
7. WS2816 LED strips (neopixels)

List the 100 most important concepts that you would
teach in your STEM Robots course.  For each concept,
just return the name of the concept and a short definition.
Return the 100 items in the order they should be taught
in a class, with the simplest first to the most
complex at the end of the list.
```

1. **Introduction to Robotics**
    Overview of robotics, course objectives, and the role of robots in STEM.

1. **Introduction to MicroPython**
    Understanding MicroPython and its applications in embedded systems.

1. **Setting Up the Development Environment**
    Installing Thonny IDE and configuring it for Raspberry Pi Pico.

1. **Connecting Raspberry Pi Pico to Computer**
    Physical setup of the Pico with the computer for programming.

1. **Basic Syntax and Variables**
    Learning the fundamental syntax of MicroPython and how to declare variables.

1. **Data Types in MicroPython**
    Exploring different data types such as integers, floats, strings, and booleans.

1. **Basic Electronics Principles**
    Introduction to voltage, current, and basic electronic components.

1. **Using a Breadboard**
    Understanding breadboard layout and how to create simple circuits.

1. **Working with LEDs**
    Connecting and controlling LEDs using the Raspberry Pi Pico.

1. **Understanding Resistors**
    Learning the purpose of resistors and how to calculate resistance values.

1. **GPIO Pin Basics**
    Overview of General Purpose Input/Output pins on the Pico.

1. **Digital Input and Output**
    Reading digital inputs and controlling digital outputs.

1. **Using Push Buttons**
    Connecting and reading input from push buttons.

1. **Control Structures: If Statements**
    Implementing conditional logic in MicroPython.

1. **Control Structures: Else and Elif**
    Expanding conditional logic with else and elif statements.

1. **For Loops**
    Creating loops to execute code multiple times.

1. **While Loops**
    Implementing loops that run based on a condition.

1. **Functions in MicroPython**
    Defining and calling functions to organize code.

1. **Parameters and Return Values**
    Using parameters and return values in functions.

1. **Lists in MicroPython**
    Creating and manipulating lists to store multiple values.

1. **String Manipulation**
    Working with strings, including concatenation and formatting.

1. **Basic Arithmetic Operations**
    Performing arithmetic calculations in code.

1. **Using Built-in Libraries**
    Importing and utilizing MicroPython's built-in libraries.

1. **Serial Communication Basics**
    Understanding serial communication between devices.

1. **Using the REPL**
    Utilizing the Read-Eval-Print Loop for interactive coding.

1. **Exception Handling**
    Managing errors and exceptions in your programs.

1. **Introduction to PWM (Pulse Width Modulation)**
    Understanding PWM and its applications in controlling devices.

1. **Controlling LED Brightness with PWM**
    Using PWM to adjust LED brightness levels.

1. **Working with Transistors**
    Learning how transistors can control larger currents.

1. **Introduction to the Cytron Motor Controller**
    Overview of the Cytron board and its capabilities.

1. **Connecting DC Motors**
    Wiring DC motors to the motor controller and Pico.

1. **Basic Motor Control**
    Writing code to start and stop DC motors.

1. **Controlling Motor Speed with PWM**
    Using PWM to adjust the speed of DC motors.

1. **Understanding Motor Direction**
    Changing the direction of motor rotation.

1. **Building a Simple Robot Frame**
    Assembling the Smart Car chassis with motors and battery pack.

1. **Powering the Raspberry Pi Pico**
    Connecting the battery pack to power the Pico and motors.

1. **Using Servo Motors**
    Connecting and controlling servo motors for precise movements.

1. **Introduction to I2C Communication**
    Understanding the I2C protocol for connecting peripherals.

1. **Connecting the OLED Display via SPI**
    Wiring the 128x64 OLED display using the SPI interface.

1. **Displaying Text on OLED**
    Writing code to show text messages on the OLED screen.

1. **Using the WS2816 LED Strips (Neopixels)**
    Connecting and controlling Neopixel LED strips.

1. **Creating LED Animations**
    Programming dynamic lighting effects on LED strips.

1. **Reading Analog Inputs**
    Using analog sensors to read varying voltage levels.

1. **Using Light Sensors**
    Connecting light sensors and interpreting their data.

1. **Using Temperature Sensors**
    Reading temperature data from connected sensors.

1. **Debouncing Buttons**
    Implementing software techniques to stabilize button inputs.

1. **Implementing Timers and Delays**
    Managing timing in your programs for precise control.

1. **Introduction to Dictionaries**
    Using dictionaries to store key-value pairs of data.

1. **Using Tuples**
    Understanding and utilizing tuples for immutable data.

1. **Advanced String Operations**
    Performing complex manipulations on string data.

1. **Storing and Accessing Data with Lists**
    Managing and accessing data stored in lists.

1. **Introduction to the Smart Car Chassis**
    Detailed overview of the Smart Car components and functionality.

1. **Connecting Multiple LEDs**
    Wiring and controlling multiple LEDs in a circuit.

1. **Using the Motor Controller's I2C Interface**
    Communicating with the motor controller via I2C.

1. **Basic Sensor Integration**
    Connecting simple sensors to the Raspberry Pi Pico.

1. **Reading Sensor Data**
    Collecting and interpreting data from various sensors.

1. **Displaying Sensor Data on OLED**
    Showing real-time sensor information on the OLED display.

1. **Using Transistors for Motor Control**
    Enhancing motor control with transistor circuits.

1. **Introduction to PWM for Servo Control**
    Using PWM signals to precisely control servos.

1. **Creating Interactive LED Displays**
    Programming LEDs to respond to sensor inputs.

1. **Implementing Basic Obstacle Avoidance**
    Using sensors to detect and avoid obstacles.

1. **Building a Line-Following Robot**
    Programming the robot to follow a line using sensors.

1. **Introduction to Encoders**
    Understanding encoders for tracking motor rotation.

1. **Implementing Motor Feedback**
    Using encoder data to control motor movements accurately.

1. **Using Accelerometers**
    Integrating accelerometers to measure movement and orientation.

1. **Using Gyroscopes**
    Adding gyroscopes for detecting rotational motion.

1. **Basic Data Logging**
    Recording sensor data for later analysis.

1. **Storing Data on SD Cards**
    Writing and reading data to/from SD cards.

1. **Using Real-Time Clocks (RTC)**
    Keeping track of time in your projects with RTC modules.

1. **Implementing State Machines**
    Managing complex behaviors using state machines.

1. **Introduction to Interrupts**
    Handling asynchronous events in your programs.

1. **Using Queues and Stacks**
    Managing data flow with queues and stacks.

1. **Multithreading in MicroPython**
    Running multiple threads for concurrent tasks.

1. **Asynchronous Programming**
    Implementing non-blocking code for efficient processing.

1. **Introduction to PID Control**
    Understanding Proportional-Integral-Derivative control for precise movement.

1. **Implementing Feedback Loops**
    Using sensor feedback to adjust motor control dynamically.

1. **Basic Networking Concepts**
    Understanding how devices communicate over networks.

1. **Using Bluetooth Modules**
    Connecting and communicating with Bluetooth devices.

1. **Using Wi-Fi Modules**
    Integrating Wi-Fi for wireless communication and control.

1. **Implementing Bluetooth Communication**
    Setting up Bluetooth to send and receive data.

1. **Implementing Wi-Fi Communication**
    Configuring Wi-Fi for internet connectivity and data exchange.

1. **Introduction to Version Control with Git**
    Managing code versions and collaborating using Git.

1. **Project Planning and Design**
    Planning and designing robotics projects effectively.

1. **Integrating Multiple Sensors**
    Combining data from various sensors for complex behaviors.

1. **Advanced Data Structures**
    Utilizing advanced structures like linked lists and trees.

1. **Introduction to Machine Learning**
    Basics of machine learning and its applications in robotics.

1. **Creating Autonomous Behaviors**
    Programming robots to operate independently without user input.

1. **Implementing Remote Control**
    Controlling the robot remotely via wireless connections.

1. **Using Touch Sensors**
    Integrating touch sensors for interactive control.

1. **Implementing Gesture Control**
    Using sensors to interpret and respond to user gestures.

1. **Voice Command Integration**
    Adding voice recognition to control the robot through speech.

1. **Using Camera Modules**
    Connecting and utilizing camera modules for vision-based tasks.

1. **Basics of Image Processing**
    Processing and interpreting images captured by the camera.

1. **Advanced Sensor Fusion**
    Combining multiple sensor inputs for accurate data interpretation.

1. **Path Planning Algorithms**
    Designing algorithms for efficient navigation and movement paths.

1. **Introduction to SLAM (Simultaneous Localization and Mapping)**
    Enabling robots to build maps and locate themselves within them.

1. **Using GPS Modules**
    Integrating GPS for location tracking and navigation.

1. **Integrating with Mobile Devices**
    Connecting the robot to smartphones or tablets for control and feedback.

1. **Using NFC Modules**
    Adding Near Field Communication for short-range interactions.

1. **Advanced AI for Object Recognition**
    Implementing artificial intelligence techniques to recognize and respond to objects.