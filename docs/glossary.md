# STEM Robots Glossary of Terms

If you are new to STEM robotics, this glossary is a good place to review your terminology.

#### 6-volt DC hobby motors

Small electric motors designed for various hobby projects, typically running on a 6-volt power supply.

#### AA batteries

Standard size of dry cell battery typically used in portable electronic devices.

#### Analog to Digital Converter
A component that takes an analogue signal and changes it to a digital one.

Every ADC has two parameters, its [resolution](#resolution), measured in digital bits, and its [channels](#channels), or how many analogue signals it can accept and convert at once.

* Also know as: ADC

#### BOOTSEL

A button on the pico that when pressed during power up will allow you to mount the device as a USB drive.  You can then drag-and-drop any uf2 image file to reset or update the runtime libraries.

![](img/boot-selection.png)

* Also known as: Boot Selection

#### Blit
A special form of copy operation; it copies a rectangular area of pixels from one framebuffer to another.  It is used in MicroPython when doing drawing to a display such as an OLED display.

#### Castellated Edge
Plated through holes or vias located in the edges of a printed circuit board that make it easier to solder onto another circuit board.

![](img/castellated-edge.png)

The word "Castellated" means having grooves or slots on an edge and is derived from the turrets of a castle.

#### Computational Thinking

Computational thinking is a problem-solving methodology that involves applying concepts and techniques from computer science to understand and address complex issues.

Computational thinking encompasses skills such as algorithmic thinking, pattern recognition, abstraction, and decomposition. This approach encourages breaking down problems into manageable parts, identifying patterns, abstracting out details to focus on the core issue, and developing step-by-step solutions (algorithms). Computational thinking is not just for computer scientists but is a fundamental skill for everyone, applicable in various fields including business, education, and research. It aids in developing logical reasoning and efficient problem-solving approaches.

The lesson plans on this site put a strong focus on increasing computational thinking skills.  Many lessons start with a difficult problem and then proceed to divide the problem into smaller components.

[Computational Thinking Page](./instructors-guide/computational-thinking.md)

#### Cytron Maker Pi RP2040

A robotics board featuring the Raspberry Pi RP2040 microcontroller, designed for use in educational and hobbyist robotics projects.

#### DC motor drivers

Electronic components that control the direction and speed of DC motors.

#### Dupont Connectors

Pre-made low-cost used and used to connect breadboards to hardware such as sensors and displays.

The connectors are available in male and female ends and are typically sold in lengths of 10 or 20cm.  They have a with a 2.54mm (100mill) pitch so they are easy to align with our standard breadboards.  They are typically sold in a ribbon of mixed colors for around $2.00 US for 40 connectors.

* Also known as: Jumper Wires
* [Sample eBay Search for Jumper Wires](https://www.ebay.com/sch/92074/i.html?_from=R40&_nkw=jumper+wire+cables)


#### ESP32
A series of low-cost, low-power system on a chip microcontrollers with integrated Wi-Fi and dual-mode Bluetooth.

Typical costs for the ESP32 is are around $10 US on eBay.

* [Sample on eBay](https://www.ebay.com/itm/ESP32-ESP-32S-NodeMCU-Development-Board-2-4GHz-WiFi-Bluetooth-Dual-Mode-CP2102/392899357234) $5
* [Sample on Amazon](https://www.amazon.com/HiLetgo-ESP-WROOM-32-Development-Microcontroller-Integrated/dp/B0718T232Z/ref=sr_1_1_sspa) $11
* [Sample on Sparkfun](https://www.sparkfun.com/products/13907) $21
* [ESP32 Quick Reference](http://docs.micropython.org/en/latest/esp32/quickref.html)
* [Sample eBay Search for ESP32 from $5 to $20](https://www.ebay.com/sch/i.html?_from=R40&_nkw=esp32&_sacat=175673&LH_TitleDesc=0&LH_BIN=1&_udhi=20&rt=nc&_udlo=5)

#### Flash memory

A type of non-volatile memory that retains data even when the power is turned off.

#### Formatted Strings

The ability to use a simplified syntax to format strings by added the letter "f" before the string.  Values within curly braces are formatted from variables.

```py
name = "Lisa"
age = 12
f"Hello, {name}. You are {age}."
```

returns

```
Hello, Lisa. You are 12.
```

Formatted string support was added to MicroPython in release 1.17.  Most formats work except the date and time formats.  For these we must write our own formatting functions.

* Also known as: f-strings
* Also known as: Literal String Interpolation
* From Python Enhancement Proposal: PEP 498
* [Official Python documentation on string formatting](https://docs.python.org/3/library/string.html#string-formatting)
* Link to Formatted Strings Docs: [formatted strings](https://www.python.org/dev/peps/pep-0498/)
* PyFormat library for formatting strings: [PyFormat.info](https://pyformat.info/)

#### Framebuffer

A region of your microcontroller RAM that stores a bitmap image of your display.

For a 128X64 monochrome display this would be 128 * 64 = 8,192 bits or 1,024 bytes (1K).  Color displays must store up to 8 bytes per color for each color (red, green and blue).

* [Wikipedia page on Framebuffer](https://en.wikipedia.org/wiki/Framebuffer)
* [MicroPython Documentation on FrameBuffer](https://docs.micropython.org/en/latest/library/framebuf.html)
]

#### GPI status LEDs

General Purpose Input status Light Emitting Diodes used for indicating the state of inputs.

#### Grove connectors

Standardized connectors used for connecting various sensors and modules to microcontrollers easily.

#### I2C
A communications protocol common in microcontroller-based systems, particularly for interfacing with sensors, memory devices and liquid crystal displays.

I2C is similar to SPI, it's a synchronous protocol because it uses a clock line.

* Also Known as: Inter-integrated Circuit
* See also: [SPI](#spi)

#### I2C protocol

Inter-Integrated Circuit protocol, a serial communication protocol used for connecting low-speed peripherals to microcontrollers.

#### Interrupts
A type of signal used to pause a program and execute a different program.  We
use interrupts to pause our program and execute a different program when a
button is pressed.

#### LiPo battery

Lithium Polymer battery, a type of rechargeable battery commonly used in portable electronics.

#### MPG Shell
A simple MicroPython shell based file explorer for ESP8266 and WiPy MicroPython based devices.

The shell is a helper for up/downloading files to the ESP8266 (over serial line and Websockets) and WiPy (serial line and telnet). It basically offers commands to list and upload/download files on the flash FS of the device.

[GitHub Repo for MPFShell](https://github.com/wendlers/mpfshell)

#### MicroPython

A lean and efficient implementation of the Python programming language that is designed to run on microcontrollers and in constrained environments.

#### MicroSims

Small web-based programs that use simulations and animations to explain concepts.  MicroSims (short for Micro-Simulations) are small enough that a first draft can be created by generative AI programs such as ChatGPT.

Many lessons on this site also feature MicroSims that reinforce concepts and that can be quickly extended by teachers or mentors.

* [MicroSims website](https://dmccreary.github.io/microsims/)

#### NeoPixels

Individually addressable Red-Green and Blue (RGB) Light Emitting Diodes (LEDs) that can be controlled to display a wide range of colors and patterns.

#### OLED Display

OLED (Organic polymer Light Emitting Diode) displays are small but bright displays with high contrast, low power and a wide viewing angle.

We use these displays throughout our labs.  The small displays are around 1" (diagonal) and only cost around $4 to $5.  Larger 2.24" displays cost around $20.  These displays work both with 4-wire I2C and 7-wire SPI connections.  We use the larger displays with a faster SPI for our robots with faces.

Typical chips that control the OLED include the SSD1306 driver chips.

* See: [Graph Displays](../displays/graph/01-intro.md)

#### Physical Computing

The process of using computers to read data from sensors about the world around us and then taking action on this incoming data stream. These actions are typically doing things like blinking an LED, moving a motor, or updating a display.

#### Pico Pinout Diagram

The Pico pinout diagram shows you the ways that each Pin can be used.  Different colors are used for GPIO numbers, I2C, and SPI interfaces.

![](../img/pi-pico-pinout.png)

* [Pinout PDF](https://datasheets.raspberrypi.org/pico/Pico-R3-A4-Pinout.pdf)

#### Piezo buzzer

An electronic device that produces sound, often used for alerts and notifications in electronic circuits.

#### Pulse Width Modulation (PWM)

A type of output signal used to control items with continuous values.  For example, we use PWM to control the brightness of a light or the speed of a motor.  We use pulse-width modulation (PWM) to control the speed of our DC motors.

![](img/pwm-microsim.png)

See also: [PWM MicroSim](./sims/pwm/index.md)

#### RGB LED

Light Emitting Diodes that can emit Red, Green, and Blue light, used in various applications for color display.

#### RP2040 chip
A custom chip created by the [Raspberry Pi Foundation](raspberry-pi-foundation) to power the [Raspberry Pi Pico](#raspberry-pi-pico).

#### Raspberry Pi Foundation

The company that builds the Raspberry Pi hardware and provides some software.

#### Raspberry Pi Pico
A microcontroller designed by the Raspberry Pi foundation for doing real-time control systems.

The Pico was introduced in 2020 with a retail list price of $4.  It was a key development because it used a custom chip that had 100 times the RAM of an Arduino Nano.

#### Raspberry Pi RP2040

A dual-core microcontroller developed by Raspberry Pi, featuring 264K SRAM and 2MB of flash memory.

#### Resolution

The size of our OLED screen as measured in a width x height number.

**Example:** Our 2.44" OLED displays have a resolution of 128x64 pixels.

#### Rhizomatic Learning

An approach to learning that uses a non-linear, organic process, where knowledge is interconnected and grows in multiple directions, much like a rhizome. 

Rhizomatic learning is an educational concept that draws its analogy from the rhizome, a type of plant root system.

It emphasizes the importance of context, personal interpretation, and the idea that knowledge and learning are not static but are constantly evolving. Rhizomatic learning encourages learners to create their own paths through content, fostering critical thinking, adaptability, and collaboration. This approach contrasts with traditional hierarchical models of education, offering a more fluid and dynamic understanding of knowledge acquisition.

#### Serial Peripheral Interface

An interface bus commonly used to send data between microcontrollers and small peripherals such as sensors, displays and SD cards. SPI uses separate clock and data lines, along with a select line to choose the device you wish to talk to.

* Also known as: SPI
* See also: [I2C](#i2c)

#### SPI bus

Serial Peripheral Interface bus, a synchronous serial communication protocol used for short-distance communication.

* See also: [SPI](#serial-peripheral-interface)

#### STEM

An acronym for Science, Technology, Engineering, and Mathematics education.

#### Smart Car chassis

The physical frame of the robot to which all other parts are mounted.

#### Thonny

A lightweight Python IDE ideal for writing simple Python programs for first-time users.

Thonny runs on Mac, Windows and Linux.

* [Thonny web site](https://thonny.org/)

#### Thonny Integrated Development Environment (IDE)

A user-friendly IDE for learning and teaching programming, particularly well-suited for use with MicroPython.

#### Time-of-flight distance sensor

A sensor that measures the distance to an object by calculating the time taken for a signal to travel to the object and back.

#### UF2 File

The file must be uploaded into the Raspberry Pi Pico folder to allow it to be used.
The file name format looks like this:

```rp2-pico-20210205-unstable-v1.14-8-g1f800cac3.uf2```

#### USB cable

A cable used for data transfer and power supply, commonly used to connect devices to computers.

#### VL53L0X

A specific model of a time-of-flight distance sensor that uses the I2C protocol for communication.

## References

* [MicroPython for Kids Glossary](https://dmccreary.github.io/micropython/misc/glossary/)#### rshell
* [MicroPython Glossary](https://docs.micropython.org/en/latest/reference/glossary.html)
