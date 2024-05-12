# About the STEM Robotics Program

![](./img/low-cost-fun.jpg)

One of the primary goals of this site is to provide low-cost yet fun ways that our students can learn computational thinking.  We have heard many stories of schools that can't afford to give each student their own robot.  But at $19 per robot, we can enable many schools to dramatically decrease the robot-to-student ratios.

This site started in 2014 with our experiments on watching kids use these projects.  Every year we would make small changes to increase the fun and lower the cost.  We are convinced you don't need to spend hundreds of dollars per robot to create a fun and engaging experience that provides a measurable improvement in STEM engagement and interest in coding.

## Description of the Base STEM Robot

The base STEM robot has the following descriptive text.  This text is important because it is used as a "seed" to generate lesson plans about the robot.

```linenums="0"
The STEM Robot is a low-cost but fun robot designed to teach kids
the principles of computational thinking.  It is built around the
Raspberry Pi RP2040 microcontrollers and is programed with MicroPython.  It is designed to cost under $19.

The base STEM robot has the following parts:

1. 2 6-volt DC hobby motors.
2. 4 AA batteries in a battery pack.
3. A "Smart Car" chassis.
4. A Cytron Maker Pi RP2040 robotics board that
includes:
    1. 2 DC motor drivers
    2. 13 blue GPI statusLEDs
    3. 2 NeoPixels
    4. a Piezo buzzer with mute switch
    5. two customizable momentary push buttons
    6. 7 Grove connectors
    7. 4 servo drivers
    8. a power on switch with a power indicator LED
    9. red LEDs and buttons to test the motor connections
    10. a port for charging a LiPo battery
5. A VL53L0X time-of-flight distance sensor that
uses the I2C protocol to measure distance.
6. A USB cable for programming the car.

The robot is programmed with the Thonny Integrated
Development for Python.  Note that the RP2040 is
a dual-core micro-controller with 264K SRAM and 2MB
flash memory.
```

We will use this description to create task and age-appropriate lesson plans that teach computational thinking using MicroPython.
In the future, we will refer to this block of text as the ROBOT_DESCRIPTION text.

## Integration of Generative AI

Starting in [September of 2020](https://medium.com/@dmccreary/using-al-to-generate-detailed-lesson-plans-29a5af200a6a) we started our first experiments at integrating generative AI into our curriculum.  These were initially simple experiments to generate lesson plans with GPT-3.  In the [summer of 2023](https://medium.com/@dmccreary/micro-simulations-for-education-6989eae8d85d), we also started to generate [MicroSims](glossary.md#microsims) as companions to our hands-on kits.  We believe that AI is the future
of education and we hope you take time to try both the physical and virtual labs.