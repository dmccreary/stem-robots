# Robot Description

## Description of the Base STEM Robot

The base STEM robot has the following descriptive text.  This text is important because it is used as a "seed" to generate lesson plans about the robot.

!!! prompt
    The STEM Base Robot is a low-cost but fun robot designed to teach kids
    the principles of computational thinking.  I want you
    to think about fun labs that will teach students computational thinking.
    
    **Robot Description:** The base STEM robot is built around the
    Raspberry Pi RP2040 microcontrollers and is programed with MicroPython.
    We leverage the low-cost "Smart Car" Chassis that is widely available online
    from many resellers.
    The robot is designed to cost around $20 and bulk purchases may be less.

    The base STEM robot has the following parts:

    ** SmartCar Chassis Kit ($5 in bulk) :**
    1. 2x 6-volt DC hobby motors with wires pre-soldered
    2. 4x AA batteries in a battery pack with wires
    3. A "Smart Car" plexiglass chassis that parts are mounted to with screws
    4. A Cytron Maker Pi RP2040 robotics board ($11) that
    includes:
        1. 2x DC motor driver chips
        2. 13x blue GPI statusLEDs
        3. 2x RGB LED NeoPixels
        4. a Piezo buzzer with mute switch
        5. Two customizable momentary push buttons
        6. 7x Grove connectors with four wires so users can add new sensors without soldering
        7. 4x servo drivers pins
        8. A power on switch with a power indicator LED
        9. 4x red LEDs and buttons to test the motor connections
        10. a port for charging a LiPo battery
    5. A VL53L0X time-of-flight distance sensor ($3) that
    uses the I2C protocol to measure distance in front of the robot to an obstacle
    6. A USB cable ($1.25 in bulk) for programming the robot from a PC or Mac

    The robot is programmed with the Thonny Integrated
    Development for MicroPython.  Note that the RP2040 is
    a dual-core micro-controller with 264K SRAM and 2MB
    flash memory.  The RP2040 includes support for both I2C
    and SPI bus.

    The STEM Robot works with an interactive intelligent textbook website that stores lesson plans,
    sample programs and assessments that can be integrated into
    a school curriculum and the school's learning management system.
    These textbooks are designed to collect xAPI user events and send these events
    to a Learning Record Store (LRS).  The goal is to predict what concepts
    have been mastered by each student by using AI to watch the event stream.


In the future, we will refer to this block of text as the
BASE_ROBOT_DESCRIPTION text. If you are generating other courses,
you can call this COURSE_DESCRIPTION.