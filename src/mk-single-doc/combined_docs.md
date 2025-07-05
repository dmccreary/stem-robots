# Table of Contents

- [Home](#home)
- [About This Website](#about-this-website)
- [Course Description](#course-description)
- [Journey Map](#journey-map)
- [Robot Description](#robot-description)
- [Gallery](#gallery)
- [Great Ways To Teach](#great-ways-to-teach)
- Course Descriptions
  - [Introductions](#introductions)
  - [Two Hour Hands On](#two-hour-hands-on)
  - [14 Week Course](#14-week-course)
- Learning Graphs
- Getting Started
  - [Thonny](#thonny)
  - [Base Kit Assembly](#base-kit-assembly)
  - [Parts List](#parts-list)
  - [Cytron Maker Pi](#cytron-maker-pi)
  - [Time of Flight Sensor](#time-of-flight-sensor)
  - [WiFi Setup](#wifi-setup)
- [Personas](#personas)
- [Topics](#topics)
- Lessons
  - [Introduction](#introduction)
  - [Lesson Order](#lesson-order)
  - [Robot Parts](#robot-parts)
  - [Batteries](#batteries)
  - [Config File](#config-file)
  - [DC Motors](#dc-motors)
  - [Motor Direction](#motor-direction)
  - [H-Bridge](#h-bridge)
  - [Motor Speed](#motor-speed)
  - [Pulse Width Modulation](#pulse-width-modulation)
  - [Motor Connections](#motor-connections)
  - [Robot Dance](#robot-dance)
  - [I2C Bus](#i2c-bus)
  - [Sensors](#sensors)
  - [Time of Flight Sensor](#time-of-flight-sensor)
  - [Ultrasonic Sensor](#ultrasonic-sensor)
  - [Infrared Sensors](#infrared-sensors)
  - [Collision Avoidance](#collision-avoidance)
  - [Using Perf Boards](#using-perf-boards)
- Instructor's Guide
  - [Introduction](#introduction)
  - [Computational Thinking](#computational-thinking)
- MicroSims
  - [Introduction](#introduction)
  - [Learning Graph](#learning-graph)
  - [H-Bridge](#h-bridge)
  - [Pulse Width Modulation](#pulse-width-modulation)
  - [Collision Avoidance](#collision-avoidance)
- Kits
  - [Introduction to Kits](#introduction-to-kits)
  - Base Robot
    - [Introduction](#introduction)
  - Display Robot
    - [Intro](#intro)
    - [Display Setup](#display-setup)
    - [Time of Flight Range Test](#time-of-flight-range-test)
    - [Display Distance Chart](#display-distance-chart)
    - [Display Face](#display-face)
    - [Collision Avoidance Display](#collision-avoidance-display)
- Wireless Bot
  - [Introduction](#introduction)
  - [Ping Test Slow](#ping-test-slow)
  - [Ping Test Fast](#ping-test-fast)
  - [Simple Web Server](#simple-web-server)
  - [Web Server Test](#web-server-test)
- [Bump Switches](#bump-switches)
- [Line Follower](#line-follower)
- [Adjustabot](#adjustabot)
- [Ultrasonic](#ultrasonic)
- WiFi Display Bot
  - [Intro](#intro)
  - [Display Status](#display-status)
- Instructors Guide
  - [Intro](#intro)
  - [Computational Thinking](#computational-thinking)
- [FAQ](#faq)
- [Glossary](#glossary)
- [References](#references)
- [License](#license)
- [Contact](#contact)

---

# STEM Robots

![](images/img_056_display-robot.png)

Welcome to the STEM Robots website!  This site is dedicated to helping students learn computational thinking by using low-cost ($19) robots that
are custom-designed for teaching [computational thinking](./glossary.md#computational-thinking) skills.

The curriculum is designed around Generative AI tools so that
you can generate custom lesson plans for many personas
and grade levels.


---


# About the STEM Robotics Program

![](images/img_038_low-cost-fun.jpg)

This site was created to provide low-cost
yet fun ways that our students can learn computational thinking.
Over many years of organizing coding clubs, we have that kids
love robots!  When designed thoughtfully, robots combine
motion, color, sounds and displays that engage students
more than any other teaching tool we have tested.

But in the past, even simple robots offered by retailers
and promoted by commercial companies were designed first
to increase their stockholder value and second to
provide learning value.  A typical price for a retail
robot kit is $370.  They often justify this cost because
they claim that the lesson plans and program examples
took millions of dollars to create.  But generative
AI is changing this.  Today we have tools that can
generate customized lesson plans including working
programs for a small fraction of these costs.

We have heard many stories of schools that can't afford to give
each student their own robot.  But at $19 per robot, we can enable
many schools to dramatically decrease the robot-to-student ratios.

This site started in 2014 with our experiments on watching kids use
these projects.  Every year we would make small changes to increase
the fun and lower the cost.  We are convinced you don't need to spend
hundreds of dollars per robot to create a fun and engaging experience
that provides a measurable improvement in STEM engagement and interest in coding.

## Metrics for a Great STEM Robotics Curriculum

We use ChatGPT to come up with a way to measure the value of a STEM robotics
system.  Here is the prompt:

!!! prompt
    Our school is fed up with vendors trying to sell us $350 STEM
    robots kits that use cheep parts and batteries that are not
    replaceable. How can we come up with a simple set of objective
    measures to rate the quality of STEM robots?  Include the
    quality of instruction manuals and curriculum that can be
    customized to the needs of teachers, volunteers and students.

    Return the results in markdown level three headers.

## Response

Here is the response:

Developing objective measures to evaluate the quality of STEM robots, including the quality of instruction manuals and customizable curricula, is a great way to ensure value for money and educational effectiveness. Here are some key criteria you could consider:

### Hardware Quality

-   **Durability:** Assess the robustness of the robot's construction. Are the materials used sturdy enough for repeated use by students?
-   **Modularity:** Consider whether parts can be easily added or removed, which can aid in teaching different levels of complexity.
-   **Battery Life and Replacement:** Check the battery life per charge and ensure that batteries are replaceable and reasonably priced.
-   **Sensor and Actuator Quality:** Evaluate the performance and reliability of sensors and actuators, as these are crucial for the functionality of the robot.

### Cost Effectiveness

-   **Initial Cost vs. Part Quality:** Compare the cost of the robot with the quality and longevity of the components used.
-   **Maintenance Costs:** Consider long-term costs related to maintenance, part replacement, and upgrades.
### Ease of Use

-   **User-Friendly Design:** Is the robot easy to assemble and disassemble? This is important for younger students or those new to robotics.
-   **Documentation:** Look for clear, comprehensive, and well-organized instruction manuals that cater to different skill levels.
### Educational Value

-   **Curriculum Integration:** Evaluate how well the robot's features align with educational standards and curricular goals. Can it be integrated into subjects beyond technology, such as math, science, or arts?
-   **Progressive Learning:** Does the robot offer different levels of complexity for varied learning stages? This is essential to cater to both beginners and advanced students.
-   **Problem-Solving and Creativity:** Assess if the robot challenges students to solve real problems and encourages creativity.
### Customizability

-   **Software Customization:** Check if the software can be easily modified or programmed by teachers and students. Support for multiple programming languages can be a plus.
-   **Hardware Customization:** Determine if it's possible to modify or expand the hardware to meet different teaching needs or student projects.
### Support and Community

-   **Technical Support:** Reliable and accessible customer support is crucial for troubleshooting and guidance.
-   **Community Resources:** A strong user community can provide valuable support and resources such as shared lesson plans, tutorials, and project ideas.
### Feedback and Reviews

-   **User Feedback:** Gather feedback from other educators who have used the robots. User reviews can provide insights into reliability, usability, and educational impact.
-   **Pilot Testing:** Consider conducting a pilot test with a few robots in your school to see how they perform in real educational settings and gather firsthand feedback.

By establishing a rubric based on these categories, your school can systematically evaluate different STEM robots and select those that offer the best learning potential and value for money. This approach not only helps in making informed purchasing decisions but also supports the educational goals of your STEM programs.

## Why We Built This Website: Our Journey

![](images/img_065_motor-with-cable-tie.jpg)

Our journey to build an awesome STEM robotics website began with a simple
[blog post](https://datadictionary.blogspot.com/2014/10/motors-for-arduino-labs.html)
back in 2014 about repairing the motors in our old Arduino kits.  
Our insight was that by using a simple cable tie and some heat shrink, we prevented the
kids from breaking the wires to our motors.  This little change
lowered the frustration of broken kits
and allowed our labs with motors to be reliable.  Sometimes little changes
make a big difference.

We started wondering if other schools were also having these problems.  Why
didn't the people who supplied these kits realize how fragile the parts were?
Why did they skimp on quality and cause their kits to break so easily?

This was the first step on our journey.

### Our First Robot

![](images/img_024_4-wheeler.jpg)

Yes, kids love color and motion!  Robot classes were usually the first classes to get
full.
However, we were frustrated by the closed [Finch Robots](https://datadictionary.blogspot.com/2014/11/robot-kits-for-coderdojo-labs.html) and [here](https://store.birdbraintechnologies.com/collections/finch-robot/products/finch-robot-rohs-compliant) that were unreliable and had no
way to extend motors and sensors.
So we thought about building our own robot.

We did some research and ordered some random parts from
Amazon.  We used a four-motor chassis, a $35 Arduino Uno and a motor controller. 
It turns out that we only needed two motors by the way.
The total price was almost $70.  But our students loved the way we
had a breadboard on the top so they could add their own lights and sensors.
It was a hit!  But looking back, all those wires were difficult for the
kids to get right.  Pulling one wire out would make the robot
stop working.

### The Uno Robot: Cutting Costs and Increasing Content

![](images/img_086_uno-robot.jpg)

After talking to several others in the Minnesota Arduino club
we came across a relatively low-cost Arduino Nano that could
be mounted directly on the breadboard.  The [Uno Robot](https://datadictionary.blogspot.com/2015/01/30-coderdojo-robot-version-3.html) was only about $30
and was far more extensible than any of the commercial robots
schools were buying!  We also started putting our
[lesson plans](https://dmccreary.github.io/coderdojo-robots/arduino/00-intro/)
on GitHub to make it easier for other organizations to
reuse our content.

But the Arduino Uno ecosystem was not kind.  The lower-cost
Arduino Uno chips used a driver that was not supported
and each new release of the MacOS would make our drivers
difficult to install.  It required admin rights to install
software and it was impossible for our students to
use some of their home computers.  Despite frequent
posts to the Arduino community, nothing was done because
the drivers were not supported and they wanted us to
pay $35 for the official Arduino hardware.  We were
looking for options.  We also wanted to use
Python which had become the de facto first language
for most high schools  The change finally happened
in [January 2021](https://www.raspberrypi.com/news/raspberry-pi-silicon-pico-now-on-sale/)!

### The Switch to Raspberry Pi Pico and MicroPython

![](images/img_087_pico-bot.jpg)

The announcement of the [Raspberry Pi Pico](https://dmccreary.medium.com/how-a-small-charity-is-upsetting-the-trillion-dollar-silicon-chip-industry-ad8062e8c627) rocked
our world.  Not only was it only $4, but it also
fit right on our breadboard!  It ran MicroPython
and had the massive support of the entire Raspberry
Pi Foundation behind it.  We knew we had a solid
partner who would not try to hijack our education
to line the pockets of their shareholders.

By [May of 2021](https://dmccreary.medium.com/sustainable-classroom-robots-ea2399bb7abc)
we had started to upgrade old Arduino Nano robots to
the Raspberry Pi Pico.  We had a robot that had over 100 times as much
RAM and cost 1/8 of the Arduino UNO!

By [June of 2021](https://dmccreary.medium.com/raspberry-pi-pico-robot-in-micropython-51f956486270) we were sending
out robot kits to our COVID-era students in their homes.

Much of the content for this site has migrated from
the amazing [MicroPython for Kids](https://dmccreary.github.io/micropython/)
website.  Although there is a lot of useful content
on that site, some of our most popular STEM robot
content has got buried deep within the [Kits](https://dmccreary.github.io/micropython/micropython/kits/maker-pi-rp2040-robot/) structures.  So we decided that
the STEM robot really needed its own separate site.  Our
site will still link to the relevant pages on that site.

The Raspberry Pi Pico was not perfect.  Because the pin
labels were on the bottom of the board we could not
read any of them when they were on the breadboard.
This little "oversight" cause endless hours of headache
by forcing us to put colored marks on all our breadboards
and print out pin diagrams.  But wait.  There is more!

### The Cytron RP2040 Board

![](images/img_078_maker-pi-rp2040-tof-robot.jpg)

The next big advance came from a brilliant engineer from Malaysia
who worked at Cytron.  He developed the
[Cytron Maker Pi RP2040](https://dmccreary.medium.com/the-cytron-maker-pi-rp2040-robotics-board-b1dc7f0eab34).
This $12 board is so complete that has entirely changed
the ease of use of our robots.  Everything we need
is included on the board including buttons and LED
to test motor connections, a speaker and user
programmable buttons. WOW!  Now students
had far fewer wires to connect and fewer things
that could go wrong.  We have eliminated
all the need for soldering.  We could now spend more time
learning to code and teach computational thinking.

### The Time of Flight Sensor

![](images/img_067_time-of-flight-sensor-mounted.jpg)

The last small addition to our robot was to
upgrade the front distance sensor from the
old and fragile ultrasonic ping distance
sensor to the new shiny [time-of-flight sensor](https://dmccreary.medium.com/a-3d-printed-mount-for-time-of-flight-distance-sensor-8acea5480709).
This sensor uses the I2C bus and has both accuracy
and response times that are far better then
the ultrasonic sensors.  They are also about
the same price - about $3 each.

### The Rise of Generative AI

In December of 2022, ChatGPT rocked the world by
being able to generate large blocks of high-quality 
content just by giving it a small prompt.
Although we had been writing about [generating
lesson plans since 2020](https://dmccreary.medium.com/using-al-to-generate-detailed-lesson-plans-29a5af200a6a),
many people ignored us.  But after ChatGPT came out
everything changed.  We were teaching classes
on how to [generate highly personalized lesson plans](https://dmccreary.medium.com/chatgpt-brings-us-closer-to-the-diamond-age-b1469bee4949)
for not just STEM robotics classes but for many
other topics in schools.

### Adding MicroSims

![](images/img_057_pwm-microsim.png)

We can also use Generative AI to create online simulators
to help our students visualize what is going on
within our robot.  For example, many
students have a difficult time visualizing how
pulse-width modulation works.  This
simple [MicroSim](https://editor.p5js.org/dmccreary/sketches/xaNSzbNLS) is allowing us to
[hyper-personalize](https://dmccreary.medium.com/genai-is-hyper-personalizing-education-e28019027944) both
lesson plans as well as interactive simulations that
are generated by teachers and run in your browser.

We now have also included sample Python scripts so
that you can generate high-quality lesson plans
on many topics in the course for any grade level.

## Conclusion

Here is a summary of what we learned:

1. Open systems are more sustainable
2. Vendors focus on selling you new robots, not building maintainable STEM robots
3. Using interchangeable parts will lower your maintenance and repair costs
4. Teach breadboarding skills early
5. Python rocks - it is the language that kids want to learn and the language of data science and AI
6. Generating lesson plans, sample code, and simulations is revolutionizing STEM robots
7. Invest in your community and support open-source content

Good Luck!

## References

- [Sustainable Classroom Robots](https://dmccreary.medium.com/sustainable-classroom-robots-ea2399bb7abc) - Sustainable Classroom Robots - May 21, 2021
- [Raspberry Pi Pico Robot in Micropython](https://dmccreary.medium.com/raspberry-pi-pico-robot-in-micropython-51f956486270) - Sustainable Classroom Robots - Jun 6, 2021
- [The Cytron Maker Pi RP2040 Robotics Board](https://dmccreary.medium.com/the-cytron-maker-pi-rp2040-robotics-board-b1dc7f0eab34) - Dan McCeary's Medium Post - Aug 29, 2021

- [A 3D-Printed Mount for Time-of-Flight Distance Sensors](https://dmccreary.medium.com/a-3d-printed-mount-for-time-of-flight-distance-sensor-8acea5480709) - Dan McCeary's Medium Post - Sep 7, 2021

- [Our 2023 STEM Robot Update](https://medium.com/better-programming/our-2023-stem-robot-update-7bcf8a2fad2e) -  Dan McCeary's Medium Post - Apr 16, 2023

- [Raspberry Pi Pico Collision Avoidance Robot Programed with Micropython for Coding Clubs](https://www.youtube.com/watch?v=0d3tF1oXu90) - YouTube Video 

- [Doug Blanding GitHub Side](https://github.com/dblanding/Pico-MicroPython-smart-car?tab=readme-ov-file)




---


# STEM Robots Course Description

This course is designed for a year-long course that teaches
computational thining through the use of low-cost fun STEM robots.

The course puts a focus on 


---


# STEM Robot Journey Map

![](images/img_053_journey-map.png)


---


# Robot Description

## Description of the Base STEM Robot

The base STEM robot has the following descriptive text.  This text is important because it is used as a "seed" to generate lesson plans about the robot.

```linenums="0"
The STEM Robot is a low-cost but fun robot designed to teach kids
the principles of computational thinking.  It is built around the
Raspberry Pi RP2040 microcontrollers and is programed with MicroPython.
It is designed to cost under $19.

The base STEM robot has the following parts:

1. 2x 6-volt DC hobby motors with wires pre-soldered
2. 4x AA batteries in a battery pack with wires
3. A "Smart Car" chassis that parts are mounted to with screws
4. A Cytron Maker Pi RP2040 robotics board that
includes:
    1. 2x DC motor drivers
    2. 13x blue GPI statusLEDs
    3. 2x RGB LED NeoPixels
    4. a Piezo buzzer with mute switch
    5. two customizable momentary push buttons
    6. 7x Grove connectors with four wires
    7. 4x servo drivers
    8. a power on switch with a power indicator LED
    9. 4x red LEDs and buttons to test the motor connections
    10. a port for charging a LiPo battery
5. A VL53L0X time-of-flight distance sensor that
uses the I2C protocol to measure distance
6. A USB cable for programming the robot from a PC or Mac

The robot is programmed with the Thonny Integrated
Development for MicroPython.  Note that the RP2040 is
a dual-core micro-controller with 264K SRAM and 2MB
flash memory.  The RP2040 includes support for both I2C
and SPI bus.

The STEM Robot works with a website that stores lesson plans,
sample programs and assessments that can be integrated into
a school curriculum and the school's learning management system.
```

In the future, we will refer to this block of text as the
ROBOT_DESCRIPTION text. If you are generating other courses,
you can call this COURSE_DESCRIPTION.


---


# Gallery of Robots

## 2023

![](./parker.jpg)
![](./2023-arun.jpg)
![](./2023-alona.jpg)
![](./2023-bakken.jpg)

## 2022

![](./corral-2022.jpg)

## 2019

![](./teacher-ed-jan-2019.jpg)

![](./corral-2019.jpg)

## 2017

![](./2017-march-instructable.jpg)



---


# Great Ways to Teach

We strive to make this STEM Robot an example of the best way to teach.
Here are some good and bad ways to teach.

## Examples of Good Pedagogy

### Interactive Learning

-   **Description**: Engaging students in hands-on activities, group work, and discussions rather than just lecturing.
-   **Impact**: Increases understanding and retention of material by actively involving students in the learning process.

### Differentiated Instruction

-   **Description**: Tailoring lessons to meet the varied skill levels and learning styles of students.
-   **Impact**: Helps all students learn effectively, whether they need more challenge or more support, ensuring no one is left behind.

### Formative Assessment

-   **Description**: Using quizzes, discussions, and projects to gauge student understanding throughout the educational process, not just at the end.
-   **Impact**: Allows teachers to identify where students are struggling and adjust instruction accordingly, fostering a better learning environment.

### Incorporation of Technology

-   **Description**: Using tools like educational software, interactive whiteboards, and AI tutors to enhance learning.
-   **Impact**: Makes learning more engaging and accessible, and can provide personalized learning experiences.

## Examples of Bad Pedagogy

### One-Size-Fits-All Approach

-   **Description**: Delivering the same lesson in the same way to all students, regardless of their individual learning needs or abilities.
-   **Impact**: Can lead to disengagement and poor understanding among students who do not resonate with the general teaching method.

### Lack of Engagement

-   **Description**: Relying solely on lectures without interaction or practical application.
-   **Impact**: Students may become passive recipients of information, leading to lower retention rates and lack of interest in the subject matter.

### Overemphasis on Memorization

-   **Description**: Focusing heavily on rote learning and memorization without understanding the underlying concepts.
-   **Impact**: Students may perform well on tests but fail to apply knowledge in real-world situations, indicating a shallow level of learning.

### Neglecting Feedback

-   **Description**: Failing to provide students with timely or constructive feedback on their work.
-   **Impact**: Without feedback, students cannot learn from their mistakes or understand how to improve, which can hinder their academic progress.

These examples highlight the importance of adopting effective pedagogical strategies that cater to diverse learning needs and encourage active participation and deeper understanding.


---



# Course Descriptions

# Course Descriptions

[Two Hours Course for Teachers with No Coding Experience](./two-hour-hands-on.md)


---


# Two Hour Hands-On Course

## Sample Prompt

```linenums="0"
Create a derailed course description that describes a 2-hour
hands-on course on teaching computational thinking using
a low-cost STEM robot.

The target audience for this course is teachers that have
little or no experience with coding.  The goal is to get
them exposed to the ideas of teaching computational thinking
using a fun hands-on $35 STEM robot.

The robot is built around the Cytron RP2040 Maker Pi board.
It has two DC motors and a time-of-flight sensor as well
as a 128x64 monochrome display.

The students will need to have Thonny installed on their
desktops before the class begins.

The rough outline is:

1. What is computational thinking
2. Why are fun low-cost robots the best way to teach computational thinking
3. Overview of physical computing
4. Getting started with Thonny
5. Blinking an LED
6. Changing color on a NeoPixel
7. Playing a sound
8. Driving a motor
9. Reading the distance sensor
10. Updating the display
11. Running the collision avoidance program
12. Putting your robot in the robot corral

Use Bloom's taxonomy to create a prices list of learning objectives.
```

## ChatGPT Response

### Course Title: Teaching Computational Thinking with a Low-Cost STEM Robot

**Duration:** 2 Hours
**Target Audience:** Teachers with little or no experience in coding.

* * * *

### **Course Description**

This hands-on workshop introduces educators to the fundamentals of computational thinking using an engaging and affordable $35 STEM robot built around the Cytron RP2040 Maker Pi board. Participants will gain confidence in teaching computational concepts by experimenting with physical computing tasks. The robot features two DC motors, a time-of-flight sensor, and a 128x64 monochrome display, offering a rich playground for computational exploration.

Through guided activities, participants will learn to program the robot using MicroPython in the Thonny IDE, perform basic tasks like blinking LEDs, driving motors, and updating displays, and eventually run a collision avoidance program. This session emphasizes experiential learning and equips teachers with the skills and confidence to bring robotics into their classrooms.

* * * *

### **Learning Objectives** (Using Bloom's Taxonomy)

#### **Remembering**

1.  Define computational thinking and its core concepts.
2.  Identify the hardware components of the robot, including the Cytron RP2040 Maker Pi board, DC motors, time-of-flight sensor, and display.

#### **Understanding**

3.  Explain why low-cost robots are effective tools for teaching computational thinking.
4.  Describe the role of the Thonny IDE in programming and interacting with the robot.

#### **Applying**

5.  Blink an LED and modify its timing through basic Python programming.
6.  Change the color of a NeoPixel LED using RGB values in code.
7.  Play a sound using the robot's onboard buzzer.
8.  Drive the motors to move the robot forward or backward.

#### **Analyzing**

9.  Analyze data from the time-of-flight distance sensor to determine proximity to objects.
10.  Break down how the collision avoidance program combines sensor input, motor control, and decision-making.

#### **Evaluating**

11.  Evaluate the effectiveness of the collision avoidance program by testing it in a simulated environment (robot corral).
12.  Assess the potential of using the robot as a teaching tool in different classroom contexts.

#### **Creating**

13.  Write and execute a simple program to update the robot's display with custom text or graphics.
14.  Combine individual programs to design a custom behavior for the robot.

* * * *

### **Course Outline**

#### **Introduction (10 minutes)**

1.  **What is Computational Thinking?**
    -   Core principles: decomposition, pattern recognition, abstraction, and algorithm design.
2.  **Why Fun, Low-Cost Robots?**
    -   How hands-on activities make abstract concepts tangible and engaging.

#### **Exploring Physical Computing (15 minutes)**

3.  Overview of physical computing and how the Cytron RP2040 Maker Pi board interfaces with sensors, motors, and displays.

#### **Hands-on Activities (90 minutes)**

4.  **Getting Started with Thonny (5 minutes)**
    -   Brief walkthrough of installing and using Thonny to connect with the robot.
5.  **Blinking an LED (10 minutes)**
    -   Modify LED blink timings to understand basic code structures.
6.  **Changing Color on a NeoPixel (10 minutes)**
    -   Experiment with RGB values to create different LED colors.
7.  **Playing a Sound (5 minutes)**
    -   Code the onboard buzzer to play tones.
8.  **Driving a Motor (10 minutes)**
    -   Program motor controls for forward and backward movement.
9.  **Reading the Distance Sensor (10 minutes)**
    -   Write a script to read and print sensor data in real time.
10.  **Updating the Display (10 minutes)**
    -   Display text and simple graphics on the 128x64 monochrome screen.
11.  **Running the Collision Avoidance Program (15 minutes)**
    -   Load and test a pre-written collision avoidance script.

#### **Wrap-up Activity (5 minutes)**

12.  **Putting the Robot in the Corral**
    -   Test the robot's performance in a designated area to observe collision avoidance in action.

#### **Closing (5 minutes)**

-   Recap of key concepts.
-   Resources for continuing learning.
-   Q&A session.

* * * *

### **Required Pre-Class Preparation**

-   Install Thonny IDE on classroom desktops or laptops.
-   Ensure access to the STEM robot kit with Cytron RP2040 Maker Pi board.
-   Download workshop resources and pre-written scripts from the provided link.

* * * *

This course not only empowers educators with the tools to teach computational thinking but also inspires confidence through a fun and approachable introduction to robotics and coding.


---


# 

Create a derailed course description that describes a 2-hour
hands-on course on teaching computational thinking using
a low-cost STEM robot.

The target audience for this course is teachers that have
little or no experience with coding.  The goal is to get
them exposed to the ideas of teaching computational thinking
using a fun hands-on $35 STEM robot.

The robot is built around the Cytron RP2040 Maker Pi board.
It has two DC motors and a time-of-flight sensor as well
as a 128x64 monochrome display.

The students will need to have Thonny installed on their
desktops before the class begins.

The rough outline is:

1. What is computational thinking
2. Why are fun low-cost robots the best way to teach computational thinking
3. Overview of physical computing
4. Getting started with Thonny
5. Blinking an LED
6. Changing color on a NeoPixel
7. Playing a sound
8. Driving a motor
9. Reading the distance sensor
10. Updating the display
11. Running the collision avoidance program
12. Putting your robot in the robot corral

Use Bloom's taxonomy to create a prices list of learning objectives.


---



# Learning Graphs

# Learning Graphs

## Enumeration

## Dependencies

## Taxonomies



---


# Course Description

## Prompt

```linenums="0"
Please generate a detailed course description for the following course
using Bloom's 2001 taxonomy.

Create a derailed course description that describes a 14 week
hands-on course on teaching computational thinking using
a low-cost STEM robot.

The target audience for this course is students in the 9 to 12th grade
of high school that have
little or no experience with coding.  The goal is to get
them exposed to the ideas of computational thinking
using a fun hands-on $35 STEM robot.

The robot is built around the Cytron RP2040 Maker Pi board.
It has two DC motors and a time-of-flight sensor as well
as a 128x64 monochrome OLED display.  All coding
is done using MicroPython v1.24.1 using the Thonny.

The students will have access to Thonny installed on their
computer lab systems before the class begins.

The rough outline is:

1. What is computational thinking: algorithms, abstraction, decomposition and pattern matching
2. Why fun low-cost robots the best way to learn computational thinking
3. Overview of physical computing: sensors, motors, displays and controllers
5. Overview of the robot hardware (DC motor, Cytron board, Time-of-flight sensor, OLED display)
5. Getting started with Thonny: desktop, syntax of Python
6. Blinking an LED on the Cytron board
7. Changing color on a NeoPixel
8. Moving a pixel up and down a LED NeoPixel strip
9. Playing a sound
10. Driving a motor forward and reverse
12. The I2C bus
13. Reading the distance sensor
14. The SPI bus
15. Using the OLED display
16. Drawing commands (text, line, circle, polygon)
17. Drawing a chart of distance measurements
18. Running the collision avoidance program
19. Changing the collision avoidance parameters
20. Drawing a face on the robot
21. Student projects: adding sensors, breadboarding, displays, AI
22. Summary: What we have learned about computational thinking

Use Bloom's taxonomy to create a list of learning objectives.
```

## ChatGPT Response

### **Course Description**

This 14-week, hands-on course introduces high school students (grades 9--12) to computational thinking through engaging, interactive activities with a $35 STEM robot. Designed for students with little to no prior coding experience, the course leverages the Cytron RP2040 Maker Pi board, a platform featuring DC motors, a time-of-flight sensor, and a 128x64 monochrome OLED display. Students will explore the fundamentals of physical computing, programming in MicroPython using the Thonny IDE, and problem-solving through computational thinking.

Through weekly challenges and creative projects, students will gain proficiency in algorithms, decomposition, pattern recognition, and abstraction while building practical programming and engineering skills. This course emphasizes experiential learning, encouraging students to tinker, create, and innovate. The final project empowers students to extend their robot's capabilities by incorporating additional sensors or displays, fostering creativity and technical confidence.

* * * *

### **Learning Objectives**

Using Bloom's 2001 taxonomy, the course objectives are structured across cognitive levels to ensure comprehensive understanding and skill development:

* * * *

#### **Remembering**

-   Identify the key components of computational thinking: algorithms, decomposition, pattern matching, and abstraction.
-   Recognize the primary functions of the Cytron RP2040 Maker Pi board, including its sensors, motors, and display.
-   Recall the syntax and basic commands of MicroPython.

#### **Understanding**

-   Explain how physical computing integrates hardware (e.g., sensors, motors, and displays) with software.
-   Describe the purpose of the I2C and SPI communication protocols in robotics.
-   Interpret basic distance measurements from the time-of-flight sensor.

#### **Applying**

-   Demonstrate how to blink an LED and control a NeoPixel using MicroPython.
-   Write code to control motor movements, such as driving forward and reversing direction.
-   Create simple visualizations on the OLED display, such as text or charts.

#### **Analyzing**

-   Compare different collision avoidance parameters and their effects on robot behavior.
-   Examine the impact of distance sensor readings on motor control logic.
-   Distinguish between hardware and software issues when debugging a robot program.

#### **Evaluating**

-   Assess the efficiency of different algorithms for navigating the robot in various scenarios.
-   Critique student-created programs for clarity, functionality, and adherence to computational thinking principles.
-   Test and validate the accuracy of time-of-flight sensor readings using a visual chart on the OLED display.

#### **Creating**

-   Design and implement a custom program that integrates additional sensors or displays with the robot.
-   Build a unique robot behavior, such as drawing animated faces or creating interactive games.
-   Develop a creative final project that demonstrates mastery of computational thinking concepts and physical computing skills.

* * * *

### **Weekly Course Schedule Outline**

#### **Weeks 1--2**: **Foundations of Computational Thinking and Robotics**

-   Introduction to computational thinking principles and the benefits of learning through robotics.
-   Overview of robot hardware and physical computing.

#### **Weeks 3--5**: **Getting Started with MicroPython and Thonny IDE**

-   Familiarization with the Cytron Maker Pi board and basic Python syntax.
-   Hands-on activities: blinking LEDs, controlling NeoPixels, and playing sounds.

#### **Weeks 6--8**: **Exploring Sensors, Motors, and Communication Protocols**

-   Coding motor control for driving and reversing.
-   Using the I2C bus for distance sensing and the SPI bus for display communication.

#### **Weeks 9--10**: **Advanced Display Programming and Data Visualization**

-   Drawing shapes, text, and charts on the OLED display.
-   Implementing a collision avoidance program and tuning its parameters.

#### **Weeks 11--12**: **Creative Programming Challenges**

-   Drawing animated faces and customizing robot behaviors.
-   Adding new components via breadboarding and extending robot capabilities.

#### **Weeks 13--14**: **Final Project and Course Summary**

-   Student-designed projects integrating sensors, displays, and creative coding.
-   Reflection and discussion on computational thinking skills acquired throughout the course.

* * * *

### **Assessment Methods**

-   **Quizzes**: Weekly assessments on coding syntax, robotics concepts, and computational thinking principles.
-   **Hands-On Labs**: Regular programming assignments and challenges to reinforce skills.
-   **Final Project**: An open-ended robotics project demonstrating mastery of course objectives.
-   **Participation**: Active engagement in discussions, labs, and collaborative problem-solving.

This course offers an exciting introduction to computational thinking, sparking curiosity and fostering a lifelong interest in technology and engineering!

4o


---


# Enumerating Concepts

## Prompt

```linenums="0"
Given the course description in the prior section,
create a list of the 150 key concepts that must
be taught in this course.  Return a ordered list of the
concept labels with under 30 characters per label.
Use abbreviations when needed.  Order the concepts
in the order you think they should be taught.
```

## Response



## Workflow

**Identifying key concepts**

I'm tasked with identifying and listing 150 key concepts for a 14-week course on computational thinking using a STEM robot. The concepts will be ordered from foundational to advanced, spanning areas like algorithm basics, hardware fundamentals, and MicroPython essentials.

**Categorizing key concepts**

I'm mapping out a logical progression of 150 key concepts, focusing on computational thinking, MicroPython syntax, hardware, and specific functionalities like controlling LEDs, ensuring clarity and brevity.

**Mapping the course**

I'm outlining a 14-week course, categorizing concepts like computational thinking, hardware introduction, MicroPython syntax, and LED control, ensuring clarity with concise labels under 30 characters.

**Applying abbreviations**

I'm outlining a course by using abbreviations to efficiently condense key concepts, ensuring each label remains under 30 characters and maintaining clarity in the course structure.

**Mapping the curriculum**

I'm listing key concepts like computational thinking, sensors, and MicroPython syntax, ensuring labels are concise and under 30 characters to maintain clarity and progression in the course structure.

**Refining course concepts**

I'm refining course concepts, like coding LED actions, wiring sensors, and debugging, ensuring each step is clearly defined and builds upon previous knowledge, maintaining a logical progression.

**Focusing on details**

I'm honing in on advanced concepts like servo control, data smoothing, and AI classification, ensuring each label is concise and under 30 characters.


---


# Concept Dependency Generation

##

```linenums="0"
Return a single CSV file with the following three columns:

1. The ConceptID from the list above
2. The ConceptLabel from the list above
3. The Dependencies which is a list of pipe-delimited ConceptIDs

Make sure that all the concepts have at least one dependency. The only exception
are foundational prerequisite concepts that are assumed at the start of the course.
```

ou did not understand my request.  The third column you returned has all "1"s.  This is not useful to me.  I want a pipe-delimited list of the ConceptIDs that each concept depends on for learning.  For example, before you write a Blink LED program you must first understand:

 - Cytron Board (for pins) ConceptID=13
 - MicroPython Intro which has Concept ID=17
- The Thonny IED  ConceptID 18, 

The line for the Blink LED concept would be:

24,Blink LED, 13|17|18

Pay careful attention to the third column and make sure it has useful dependency information.

Also return the Concept Labels in Title Case.

## Response

```csv
ConceptID,ConceptLabel,Dependencies
1,Computational Think,
2,Algorithm Basics,1
3,Decompose Problems,1
4,Pattern Match,1
5,Abstraction,1
6,Robot Learning Fun,1
7,Low-Cost Robots,6
8,Physical Computing,7
9,Sensors Overview,8
10,Motors Overview,8
11,Displays Overview,8
12,Controllers Overview,8
13,Cytron Rp2040 Bd,12
14,Dc Motor Ops,10|13
15,Tof Sensor,9|13
16,Oled Display,11|13
17,Micropython Intro,1
18,Thonny Ide,17
19,Syntax: Vars,17
20,Syntax: Loops,19
21,Syntax: Cond,19
22,Syntax: Funcs,19
23,Syntax: Imports,19
24,Blink Led,13|17|18
25,Neopixel Intro,24
26,Change Led Color,25
27,Move Led Pixel,25
28,Play Sound,13|17
29,Drive Motor Fwd,14|17
30,Drive Motor Rev,29
31,I2c Bus Intro,13|17
32,Read Dist Sensor,15|31
33,Spi Bus Intro,13|17
34,Oled Init,16|33
35,Draw Text,34
36,Draw Line,34
37,Draw Circle,34
38,Draw Polygon,34
39,Chart Dist Data,32|34
40,Collision Avoid,32|29
41,Adjust Coll Param,40
42,Draw Robot Face,35|36|37|38
43,User Project Intro,1
44,Add Sensors,9|43
45,Breadboard Basics,13|43
46,Add Displays,11|43
47,Intro To Ai,1
48,Review Comp Think,1
49,Robot Assembly,7|13
50,Robo Wiring,49
51,Power Mgmt,49
52,Maker Pi Pins,13
53,Motor Driver Chip,14|52
54,Tof Wiring,15|50
55,Oled Wiring,16|50
56,Led Blink Code,24
57,Led On/Off,24
58,Led Timing,24
59,Neopxl Set Color,26
60,Neopxl Strip Idx,27
61,Neopxl Animate,59|60
62,Play Tone Freq,28
63,Play Melody,62
64,Fwd Motor Code,29
65,Rev Motor Code,30
66,Stop Motor Code,29|30
67,I2c Addrs,31
68,I2c Read,31
69,I2c Write,31
70,Dist Sensor Read,32
71,Dist Thresholds,70
72,Spi Concept,33
73,Spi Data,33
74,Oled Lib Use,34
75,Set Oled Pixel,34
76,Draw Shapes,35|36|37|38
77,Draw Charts,39
78,Dist Data Array,39
79,Coll Avoid Logic,40
80,Set Coll Limit,41
81,Face Pixels,42
82,Face Animate,81
83,Custom Sensors,44
84,Extra Breadboard,45
85,Ext Wiring,50|45
86,2nd Display,46
87,Basic Ai Logic,47
88,If-Else Refine,21
89,While Loops,20
90,For Loops,20
91,Func Params,22
92,Func Returns,22
93,Error Handle,17
94,Debug Print,19
95,Debug Led,24
96,Debug Sound,28
97,Data Types,17
98,Lists,97
99,Dict,97
100,Tuples,97
101,String Ops,97
102,Math Ops,17
103,Comp Ops,17
104,Logic Ops,17
105,Servo Ctrl,14
106,Pwm Signals,52
107,Motor Calibrate,14|105
108,Dist Calibrate,32
109,Sensor Noise,32
110,Data Smoothing,39|98
111,Data Logging,17|23
112,Memory Mgmt,17
113,File Save,111
114,Import Modules,23
115,Time Module,23
116,Utime Sleep,115
117,Ufunctools,23
118,Urandom,23
119,Pin Config,13
120,Pull-Ups,119
121,Gpio Read,119
122,Gpio Write,119
123,Encoders,14
124,Gear Ratios,14
125,Battery Life,51
126,Usb Power,51
127,Project Design,43
128,Project Planning,127
129,Idea Generation,43
130,Proto Build,127|45
131,Test Cycles,130
132,Refine Code,19|131
133,Refine Mech,131
134,Share Results,43
135,Doc Code,19
136,Comment Style,19
137,Version Ctrl,43|17
138,Teamwork,43
139,Problem Solve,1
140,Bug Fix,132
141,Feedback Loops,139
142,Eval Success,139
143,Scaling Up,43|78
144,Future Sensors,83
145,Oled Anim,42|82
146,Motor Patterns,107
147,Dist Mapping,78
148,Ai Classify,87
149,Final Review,48
150,Celebrate Learn,149
```




---


# A Taxonomy of Concepts for STEM Robots

## Prompt

Here is a cleaned up version of this CSV file.  Now please create a taxonomy with 10 classifiers for this list as well as one Miscellaneous classifier.  Return a list of each of the classifiers with a short classifier name (label) and a short description of each classifier.

## Response

**Classifier List with Short Names and Descriptions**

1.  **Computational Thinking**: Foundational concepts in computational thinking and problem-solving strategies.
2.  **MicroPython**: Core programming skills in MicroPython, including syntax, control structures, and functions.
3.  **MicroController Board**: Hardware fundamentals related to the Cytron RP2040 board, pin configurations, and wiring practices.
4.  **Actuators**: Motor and servo control concepts, including setup, calibration, and pattern development.
5.  **Sensors**: Sensor usage and integration, focusing on distance measurement, TOF sensors, and sensor data handling.
6.  **Displays**: Working with OLED and other displays---initialization, drawing text, shapes, charts, and animations.
7.  **Communication Protocols**: Communication protocols such as I2C and SPI, including addressing, reading, and writing data.
8.  **Beginning Electronics**: Breadboarding, electronics assembly, power management, and extending hardware capabilities.
9.  **Debugging Tips**: Techniques for debugging, data logging, smoothing, and using tools for refinement and testing.
10.  **Project Management**: Project planning, design, iterative development, version control, and teamwork strategies.
11.  **Miscellaneous**: Advanced topics and additional concepts like AI logic, classification, future sensors, and final review.

## Classified Responses

[STEM Robots CSV File](stem-robots.csv)

## Workflow

**Categorizing concepts**

I'm mapping Computational Thinking and Algorithm Basics to ground-breaking computational thinking, while conceptual robotics introductions align with these foundational ideas. Physical Computing might blend hardware and computation.

**Breaking down concepts**

Sensors Overview fits into sensors, Motors Overview matches actuators, Display Overview aligns with displays, Controllers Overview ties to boards/hardware, and Cytron RP2040 Board is rooted in hardware fundamentals.

**Deciding on category**

I'm concluding that the 'Blink LED Lab' should be classified under MicroPyProg, as it involves coding to control hardware, specifically the board's LED, making it a coding exercise with a hardware application.

**Mapping concepts**

OK, let me see. 'Change NeoPixel Color' and 'Move LED Pixels' clearly belong to MicroPyProg, as they center on controlling software with hardware. Likewise, 'Play Sound' fits here due to its coding-hardware control emphasis.

**Mapping concepts**

I'm aligning each concept with its classifier: Drive Motor Forward and Drive Motor Reverse fit under actuators, I2C Bus Intro and SPI Bus Intro go to communication protocols, and Collision Avoid spans sensors and logic.

**Piecing together concepts**

Adjusting collision parameters and adding sensors clearly fall under sensors. Projects are classified with project management, while breadboarding is linked to electronics construction and robot assembly to hardware fundamentals.

**Determining categories**

OK, let me see: Robot wiring and power management fit electronics construction. Maker Pi Pins align with board hardware, while the Motor Driver Chip is key to controlling actuators.

**Aligning with classifiers**

I'm noting that wiring Tof and Oled sensors falls under sensors and displays. Coding LED blink, on/off, timing, and controlling NeoPixels and Motor Driver Chips align with MicroPyProg and actuators.

**Categorizing sensor data**

Representing sensor data, especially after a distance reading, logically fits under the Sensors category. This helps us refine our approach to capturing and categorizing data effectively.

**Integrating collision logic**

Collision Avoid Logic and setting collision limits align with sensors. DebugPrint, DebugLED, and DebugSound tie data handling to debug data. Data Types, Lists, and Dictionaries link to programming concepts.

**Organizing concepts**

I'm putting 'Import Modules' and 'Time Module' under MicroPyProg. Pin Config and Pull-Ups go to BoardHW. Motor encoders and gear ratios fit Actuators. Battery life and USB power management align with ElecConstruct.

**Assigning concepts**

Test Cycles relate to project iteration. I'm considering it under ProjMgmt for systematic development progress. Code refinement involves reiteration, fitting into ProjMgmt as part of iterative progress.

**Focusing on project refinement**

OK, let me see: Refine Mechanical and Share Results align with project management. Documenting code and maintaining coding style fit under best practices, streamlining our approach to iterative development.

**Shifting focus**

I'm aligning concepts with project management methods, adjusting our approach to iterative development. This helps guide towards successful outcomes and effective teamwork.


---



# Getting Started

# STEM Robots



---


# Thonny Setup




---


# Base Kit Assembly

# Assembling Your Maker Pi RP2040 Robot

This kit is a $25 robot kit that we will use in our CoderDojo robotics classes.  This kit includes:

1. A SmartCar Chassis
    1. Two 3 to 6-volt DC geared hobby motors and wheels
    2. Plexiglass (acrylic) main-board
    3. Screws and nuts
    4. 4 AA battery pack
    5. Power switch
2. Cytron Maker Pi RP2040 kit
    1. Maker Pi RP2040 board
    2. 4x Grove to female header cables
    3. Screwdriver
    4. Silicone rubber feet (pack of 4)
3. Ultrasonic sensor
    1. mounting bracket
    2. 2 M2 6mm screws and nuts

You will need to provide 4 AA batteries and a Micro USB connector that works with your PC or Mac.

## Assemble the SmartCar Chassis

Robot configured with Time-of-Flight distance sensor.

![](images/img_078_maker-pi-rp2040-tof-robot.jpg)

Here is the bottom view of the robot with the batteries mounted on the bottom.
![](images/img_074_maker-pi-rp2040-robot-bottom.jpg)

In this version of the kit, the wires are pre-soldered onto the motors.

### Parts in Packages
Here is the robot kit in all the packaging:
![](images/img_040_a1-kit-in-pkg.jpg)

### Parts Check
Your first task is to remove the protective backing from the Plexiglass body.
![](images/img_079_a2-peel-cover.jpg)

Here are all the parts removed from the packaging:
![](images/img_063_a3-parts-unpackaged.jpg)

### Exploded View
Here is an exploded view showing how the motors are connected:
![](images/img_062_a4-exploded-view.png)

### Wires on Motors
We mount the motors with the wires on the inside and the heads of the bolts on the outside.
![](images/img_071_a6-wires-on-motors.jpg)

This photo shows cable ties I have added so that the wires don't get pulled out by our students.  These cable ties are optional.



![](images/img_028_a8-robot-rear.jpg)

### Battery Pack on Bottom

We like to mount the battery pack on the bottom.  This leaves more
room on the top for customization and a breadboard.

Next, we position the battery pack on the BOTTOM so 
that we have more room on the top for our circuit board, 
sensors and add-on displays.

The rear of the robot with battery pack mounted.

![](images/img_042_a6-drill-battery-pack-hold.jpg)

![](images/img_048_a7-battery-on-bottom.jpg)

![](images/img_047_a8-battery-screw.jpg)

### Mounting the Drag Wheel
Next, we put the four screws and spacers in the four holes at the 
bottom rear of the robot directly behind the battery pack.

We then add the four screws to mount the drag wheel.

Standoffs

![](images/img_026_a9-drag-wheel-standoffs.jpg)

Drag Wheel on Standoffs

![](images/img_044_a11-drag-wheel.jpg)

Next, line up the printed circuit board with the USB connector facing the rear.  Note where the holes are in the board and drill two 1/8" holes to mount the board.

![](images/img_069_a9-rear-top-view.jpg)

I used a 1/8th inch drill bit to put holes where the battery pack should be mounted.

Next, I put the flat-head screws in the battery pack.  We want to make sure the top of the screw is all the way in so that it does not get in the way of the battery.

### Optional Power Switch

The Cytron board has its own power switch.  So this switch does
not need to be used.

![](images/img_036_a12-optional-power-switch.jpg)

### Mounting Cytron Board

![](images/img_051_a10-rubber-feet.jpg)
![](images/img_039_maker-pi-rp2040-bottom-view.jpeg)

Next, we mount the rubber feet on the bottom of the Maker Pi RP2040 circuit board so that we have some space between the PC board and the main chassis.  I use the space next to the four corners to mount the feet.  Note that we must put the drag wheel on before we put the PC board on top of the chassis.

Now is a good time to check the spacing of the battery pack and the read drag wheel.  The rear drag wheel must be able to spin freely in a full circle without bumping into the battery.  If it bumps you might need to remount the battery pack before you proceed to the next step.

This figure has the switch that comes with the battery pack.  For our work, we will not need this switch since the Maker Pi RP2040 circuit board has an no-board power switch.  Most of our students put the switch in if they ever need to change circuit boards that don't have a built-in power switch.  If you do this, you can solder the switch between the red power of the battery and the positive terminal of VIN.

This photo shows the holes drilled with the screws in them.

This is the side view from the rear of the screws holding on the circuit board.
![](images/img_029_a14-rear-side-view.jpg)

Next use two 6 mm M3 screws to mount the ultrasonic distance sensor on top front of the robot.

Some of our students like to mount the ultrasonic sensor under the chassis and point the sensor up a little so the sensor does not reflect off the floor.  You can use a heat gun to soften the plastic mount to change the angle.

Next, I added a drop of hot glue under the front screws that mount the pc board.  I did this because the battery pack and motor mounts get in the way of adding a nut under the board.

I used a small rubber-coated twist tie to keep the wires under the robot away from the wheels and battery.  We don't want them to drag on the floor.

Next, we connect the motors to the screw headers on the printed circuit board.  There is a screwdriver that comes with the Cytron Maker Pi RP2040 that is handy for tightening the screws.

Don't worry about getting the connections all correct.  They can be adjusted in your software.

Press the wheels on the motors.


Lastly, we connect the battery to the VIN jumper, making sure to connect the red wire to the "+" terminal and the black wire to the "-" terminal.


Connect the Maker Pi RP2040 board to the top with the USB connector facing the rear.

Next, we put the four screws and spacers in the four holes at the 
bottom rear of the robot directly behind the battery pack.

### Motor and Power Connections

Connections of the two DC motors and 4AA battery pack:
![Maker Pi RP2040 Motor Connections](images/img_064_maker-pi-rp2040-motor-connections.jpg)

LiPi battery connection:
![](images/img_035_power-connections.jpg)

### Wire Management

![](images/img_033_a16-wires-under-robot.jpg)

We then add the four screws to mount the drag wheel.



Here is a short video of the assembly of a SmartCar Chassis.  Note that this video puts the battery on the top, where we put it on the bottom.
<iframe width="560" height="315" src="https://www.youtube.com/embed/lgCERugoVL4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


There are many videos online how to assemble to motors to the chassis.  The trick is orienting the motors correctly and making sure the bolts don't get in the way of the wheels.



---


# Purchasing Your Own Parts

Many schools have received sample kits from our programs.
But you can buy your own parts and assemble your own kits.

## 2WD "Smart Car" Kit

![](images/img_049_smartcar-parts.png)

There are many "Smart Car" kits available online retailers such as [eBay](https://www.ebay.com/sch/i.html?_from=R40&_nkw=2WD+robot+smart+car+chasis), [Amazon](https://www.amazon.com/s?k=2WD+Smart+car+robot+chassis) and [Walmart](https://www.walmart.com/search?q=2WD+Smart+Car+Robot+Chassis).
Purchasing these kits in quantity 10 or more can help you save on shipping costs.

Note that these kits often come with two black circular wheel encoders.  We
do not use these parts and they can be discarded.  We also do not
use the power switch since the Cytron board has its own power switch.

Our preferred vendor is the [Cytron 2WD Smart Robot Car Chassis](https://www.cytron.io/p-2wd-smart-robot-car-chassis) at $4.80.

We like the Cytron kit because the motors come with the wires soldered in place.  We also use a small cable tie to keep the wires from breaking off.  These kits frequently come with a small
screwdriver for tightening the screws.

Note that the prices for these kits vary widely, so be careful what you purchase.

## Cytron Motor Control Board

![Cytron Motor Control Board](images/img_082_maker-pi-rp2040-top-view.png)

There are many robotics controllers available that can be programmed with MicroPython.
But the one from Cytron stands out as having all the features we need for our
STEM Robot, and at $12.00 it is a great value.

[Our Review of the Cytron Maker Pi RP2040 Board on Medium](https://dmccreary.medium.com/the-cytron-maker-pi-rp2040-robotics-board-b1dc7f0eab34)

Cytron Maker Pi RP2040 Board

1. Powered by Raspberry Pi RP2040 MicroController
    1. Dual-core Arm Cortex-M0+ processor
    1. 264KB internal RAM
    1. 2MB of Flash memory
2. 4x Servo motors
3. 2x DC motors with quick test buttons
4. Versatile power circuit
5. Automatic power selection: USB 5V, LiPo (1-cell) or Vin (3.6-6V)
6. Built-in 1-cell LiPo/Li-Ion charger (over-charged & over-discharged protection)
7. Power on/off switch
8. 13x Status indicator LEDs for GPIO pins
9. 1x Piezo buzzer with mute switch
10. 2x Push button
11. 2x RGB LED (Neopixel Compatible)
12. 7x Grove ports (flexible I/O options: digital, analog, I2C, SPI, UART...)
13. 6x M3 screw hole

The Cytron board comes with a screwdriver and four rubber mounting tabs.

### Cytron
[Cytron Maker Pi RP2040](https://www.cytron.io/p-maker-pi-rp2040-simplifying-robotics-with-raspberry-pi-rp2040)

### Digikey

[Maker Pi RP2040 Board](https://www.digikey.com/en/products/detail/cytron-technologies-sdn-bhd/MAKER-PI-RP2040/14557836) - listed for $11

### Adafruit

[Adafruit $14.90](https://www.adafruit.com/product/5129)

### Time of Flight Distance Sensor

![](images/img_037_VL53L0X_GY-530.png)

VL53L0X Time-of-Flight Laser Ranging Module IR Distance Sensor

The VL53L0X is a low-cost ($5) time-of-flight light-based distance sensor that is easy to use. It comes packaged in an I2C board and gives precise distance measurements up to 1.5 meters away. It measures the time that light pulses take to travel to an object and back to estimate distance. Light travels about 1 foot every nanosecond, so the timing inside this little chip must be very accurate.

The VL53L0X integrates a group of Single Photon Avalanche Diodes (SPAD) and embeds ST Electronic's second generation FlightSense™ patented technology. The VL53L0X’s 940 nm emitter Vertical Cavity Surface-Emitting Laser (VCSEL), is safe for kids and totally invisible to the human eye. Coupled with internal physical infrared filters, the sensor enables longer-ranging distances, higher immunity to ambient light, and better robustness to cover glass optical crosstalk.

[Review and 3D Printed Mount](https://dmccreary.medium.com/a-3d-printed-mount-for-time-of-flight-distance-sensor-8acea5480709)

## M3 Bolts and Nuts

![](images/img_066_M3x6-bolts.png)

We use M3 metric screws for mounting the Cytron board to the back of the chassis and
mounting the time-of-flight sensor to the front of the robot.  We use 4x 10 mm screws
on the Cytron board and 2x 6mm screws for the time-fight sensor.

[eBay M3 pan head bolts](https://www.ebay.com/sch/i.html?_from=R40&_nkw=M3+Phillips+Pan+%2F+Round+Head+Machine+Screw+Bolts&Head%2520Style=Pan%2520Head&Screw%2520Size=%25233&rt=nc&Material=Stainless%2520Steel&_dcat=26217)

[M3 STAINLESS HEX FULL NUTS QTY 100 PACK $6 US](https://www.ebay.com/itm/220532417069)


---



## Cytron Maker Pi




---


# Time of Flight Distance Sensor

![](images/img_058_tof-vs-ultrasonic.png)

![](images/img_068_time-of-flight-side-by-side.png)

![](images/img_067_time-of-flight-sensor-mounted.jpg)

![](images/img_031_tof-sensor-side-view-2.png)


---


# Private Network Access

If you are using the Pico W or other wireless controllers you may have diffuculty accessing your web servers due to new security features added to Chrome.  This is called the blocking of "Private Networks".

## Symptom

You can access a host via IP address using `curl`, however you can't access that asme address with your browser.

Example:

```http://10.0.0.13``` will return the error: 


## Solution

## Sample Shell Script

This shell script will startup Chrome, but it will disable the feature that blocks access to your Pico W web server.

```sh
#!/bin/bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessChecks,IsolateOrigins,site-per-process,NetworkServiceInProcess,UseDNSHttpsSvcb \
--disable-network-service \
--user-data-dir=/tmp/test-profile
```

## References

[W3C Private Network Access](https://wicg.github.io/private-network-access/)


---


# STEM Robot Personas

When you generate content, make sure you mention one of
the personas that us this robot it a school.

## Sample Persona Prompt

```linenums="0"
For the following STEM robot kit and website, generate a list of personas that might be
involved in using this robot in a classroom to teach computational thinking.  The lesson plans must be integrated into the schools curriculum and learning management system.

The STEM Robot is a low-cost but fun robot designed to teach kids the principles of computational thinking. It is built around the Raspberry Pi RP2040 microcontrollers and is programmed with MicroPython. It is designed to cost under $19. The base STEM robot has the following parts:

1. 2 6-volt DC hobby motors. 
2. 4 AA batteries in a battery pack. 
3. A "Smart Car" chassis. 
4. A Cytron Maker Pi RP2040 robotics board that includes motor drivers, 13 blue LEDs for GPIO status, 2 NeoPixels, a Piezo buzzer with mute switch, two customizable momentary buttons, 7 Grove connectors, 4 servo drivers, a power on switch, a power indicator LED. and LEDs and buttons to test the motor connections. 
5. A VL53L0X time-of-flight distance sensor that uses the I2C protocol to measure distance. 
6. A USB cable for programming the car. The robot is programmed with the Thonny Integrated Development for Python. Note that the RP2040 is a dual-core MicroController with 264K SRAM and 2MB flash memory.

The STEM Robot works with a website that stores lesson plans, sample programs and assessments.

Return the list in markdown format with each persona as a level 3 header.
Sort the list from the most frequent users of the 
```

## ChatGPT Response

To effectively use the STEM Robot in a classroom setting to teach computational thinking, several personas would likely be involved, each with specific roles and responsibilities. Here's a list of potential personas:

### Students (Learners)

- **Role:** Primary users of the STEM Robot.
- **Responsibilities:** Engaging with the robot to learn computational thinking, participating actively in problem-solving tasks, and collaborating with peers to design and program the robot.

### Teacher (Computational Thinking/Computer Science)

- **Role:** Facilitates the learning experiences involving the STEM Robot.
- **Responsibilities:** Planning and delivering lessons that incorporate the robot, guiding students through programming exercises, and assessing students' progress in computational thinking.

### Volunteer/Mentor

- **Role:** Non-school staff that are drawn from the community to help teach computer science concepts
- **Responsibilities:** Subject matter experts on programming and hardware that help
students reach their learning objectives.

### Educational Technology Specialist

- **Role:** Evaluates its educational value, and ensures it aligns with curriculum standards.
- **Responsibilities:** Selecting suitable technology tools, training teachers, troubleshooting technical issues, and assessing the effectiveness of the robot in teaching computational principles.

### Parent/Guardian

- **Role:** Supports learning outside of the classroom.
- **Responsibilities:** Encouraging practice at home, understanding the educational value of the robot, and possibly assisting in troubleshooting or overseeing projects involving the robot.


### Curriculum Developer

-   **Role:** Designs educational content and activities that utilize the robot to teach key concepts in computational thinking.
-   **Responsibilities:** Creating lesson plans, tutorials, and projects that make effective use of the robot's capabilities, ensuring a progressive learning curve, and aligning activities with educational standards.

### School Administrator

-   **Role:** Supports and approves the integration of new technology like the STEM Robot into the educational offerings of the school.
-   **Responsibilities:** Allocating budget for technological tools, facilitating professional development for teachers, and ensuring the technology is used responsibly within the school environment.

### Technical Support Staff

-   **Role:** Provides backend support for the maintenance and functionality of the robots.
-   **Responsibilities:** Regular maintenance checks, updating software as needed, and repairing any hardware issues to ensure the robots are always ready for classroom use.  Ensures student can access the website and use a local learning management system.

Each of these personas plays a crucial role in the ecosystem around the STEM Robot, contributing to its goal of enhancing computational thinking skills among students.


---


# STEM Robotics Topics

Designing a low-cost STEM robot that runs MicroPython is a fantastic way to teach computational thinking. Here are key concepts you can teach using such a robot:

## Programming Concepts

### 1. Basic Programming Concepts

-   **Variables**: Understanding how to store and manipulate data.
-   **Loops**: Using `for` and `while` loops to repeat actions.
-   **Conditionals**: Using `if`, `elif`, and `else` to make decisions.
-   **Functions**: Writing reusable blocks of code.

### 2. Computational Thinking Skills

-   **Decomposition**: Breaking down a complex problem into smaller, more manageable parts.
-   **Pattern Recognition**: Identifying similarities or patterns in problems.
-   **Abstraction**: Focusing on important information only, ignoring irrelevant details.
-   **Algorithm Design**: Creating step-by-step instructions to solve a problem.

### 3. Robotics Fundamentals

-   **Sensors and Actuators**: Understanding how robots perceive their environment and act upon it.
    -   **Sensors**: Learning how to read data from sensors (e.g., distance, light, temperature).
    -   **Actuators**: Controlling motors, servos, and other actuators.
-   **Control Systems**: Using feedback from sensors to adjust actions (closed-loop vs. open-loop systems).

### 4. Electronics Basics

-   **Circuits**: Understanding simple circuits and how they work.
-   **Power Management**: Managing power supply and battery usage.
-   **Interfacing**: Connecting different components (e.g., sensors, motors) to the microcontroller.

### 5. Engineering Principles

-   **Design and Prototyping**: Creating and testing designs using iterative processes.
-   **Mechanical Design**: Basics of building structures, considering weight, balance, and durability.

### 6. Problem-Solving Skills

-   **Debugging**: Finding and fixing errors in the code and hardware.
-   **Testing and Iteration**: Testing designs and making iterative improvements.

### 7. Communication and Collaboration

-   **Documentation**: Writing clear and concise documentation for projects.
-   **Collaboration**: Working effectively in teams, sharing ideas, and dividing tasks.

### 8. Data Handling and Analysis

-   **Data Collection**: Gathering data from sensors.
-   **Data Processing**: Analyzing and interpreting data to make decisions.
-   **Visualization**: Displaying data in a meaningful way.

### 9. Real-World Applications

-   **Automation**: Understanding how robots are used in various industries.
-   **Ethics**: Discussing the ethical implications of robotics and automation.

### Practical Projects

-   **Line Following Robot**: A robot that follows a line using sensors.
-   **Obstacle Avoidance Robot**: A robot that navigates around obstacles.
-   **Remote-Controlled Robot**: A robot controlled via Bluetooth or Wi-Fi.
-   **Environment Monitoring Robot**: A robot that collects and reports environmental data.

### Resources and Tools

-   **MicroPython Documentation**: Official documentation and tutorials.
-   **Educational Kits**: Affordable robotics kits like micro:bit, Raspberry Pi Pico, or ESP32-based kits.
-   **Online Communities**: Forums and groups for sharing ideas and getting help (e.g., Reddit, GitHub).

Integrating these concepts into your curriculum will provide a comprehensive and engaging learning experience for students, equipping them with valuable skills for the future.

## Topics for a collision avoidance robot?

Using a low-cost time-of-flight (ToF) distance sensor for a collision avoidance robot provides a rich set of topics for teaching various STEM concepts. Here is a list of topics you could cover:

### Programming and Computational Thinking

1.  **Sensor Integration**

    -   How ToF sensors work and their applications.
    -   Reading distance data from the sensor using MicroPython.
    -   Interpreting sensor data to make decisions.
2.  **Algorithm Design**

    -   Designing algorithms for obstacle detection.
    -   Implementing collision avoidance algorithms (e.g., stopping, turning).
3.  **Control Structures**

    -   Using conditionals to react to sensor data.
    -   Implementing loops for continuous monitoring of obstacles.
4.  **Functions and Modular Programming**

    -   Writing functions to encapsulate sensor reading and movement logic.
    -   Reusing code for different parts of the robot's behavior.

### Robotics and Electronics

5.  **Basic Robotics Concepts**

    -   Understanding the role of sensors and actuators in robotics.
    -   Using motors and servos to control the robot's movement.
6.  **Circuit Design**

    -   Wiring the ToF sensor and other components to the microcontroller.
    -   Ensuring proper power management for all components.

### Engineering Principles

7.  **Design and Prototyping**

    -   Creating a chassis that can support the sensor and other components.
    -   Prototyping different configurations for optimal sensor placement.
8.  **Mechanical Design**

    -   Understanding the physical constraints and limitations of the robot.
    -   Designing mechanisms for smooth and efficient movement.

### Data Handling and Analysis

9.  **Data Collection and Processing**

    -   Collecting distance data from the ToF sensor.
    -   Filtering and smoothing sensor data to improve reliability.
10.  **Visualization and Debugging**

    -   Visualizing sensor data to understand robot behavior.
    -   Debugging issues with sensor readings and robot movement.

### Real-World Applications and Problem Solving

11.  **Collision Avoidance Strategies**

    -   Simple reactive behaviors: stopping and turning away from obstacles.
    -   More complex behaviors: path planning and navigation.
12.  **Testing and Iteration**

    -   Testing the robot in different environments and scenarios.
    -   Iterating on the design and code to improve performance.

### Advanced Topics

13.  **Sensor Fusion**

    -   Combining data from multiple sensors for more accurate obstacle detection.
14.  **Machine Learning (optional)**

    -   Using machine learning to improve collision avoidance over time.
    -   Training models to predict and react to obstacles more effectively.

### Practical Projects and Exercises

15.  **Basic Collision Avoidance Robot**

    -   Building a simple robot that stops or turns when an obstacle is detected.
16.  **Maze Navigation**

    -   Designing a robot that can navigate through a maze using the ToF sensor.
17.  **Dynamic Obstacle Avoidance**

    -   Creating a robot that can avoid moving obstacles in real-time.

### Resources and Tools

18.  **MicroPython Libraries**

    -   Exploring libraries and modules available for ToF sensors.
19.  **Simulation Tools**

    -   Using simulation environments to test and refine collision avoidance algorithms before deploying them on the physical robot.

By covering these topics, students will gain a comprehensive understanding of how to use ToF sensors for collision avoidance in robotics, while also learning valuable programming, electronics, and engineering skills.

2/2


---



# Lessons

# Sample Lessons for STEM Robots

## Base Lessons

Our base lessons target 9 to 12th grade students.
At the end of many lessons, you will find a list of
**Challenges** for more advanced students.
You will also find links to other lesson plans
that target older or younger students.  If
you don't find the grade level you need, you can
use generative AI programs such as ChatGPT to customize
the lesson plans to a new grade level.

## Lesson Order

We have used generative AI to suggest the first 100 lessons
and their order.  You can generate your own lesson
order by modifying the prompts we gave as examples.

[Lesson Order Prompts and Results](./01-lesson-order.md)

## Using Generative AI to Customize Lessons

```linenums='0'
Given this lesson plan, generate a new lesson 
plan for a 7th grade robotics class.
```


---


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
teach in your STEM Robots course that puts a focus
on computational thinking.  For each concept,
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


---


# Robot Parts

What are the key parts of a robot?  In our first lessons
we will review the key components of a robot and how
they 

## Batteries

## Motors

## Sensors

## Displays

## Microcontrollers


---


# STEM Robot Batteries

The standard STEM robot kit comes with a battery pack
that holds 4 AA batteries.  We will review this
strategy and discuss rechargeable options.

## 4 AA Batteries

## Rechargeable LiPo Batteries

## 18650 Batteries


---


# Hardware Configuration File

This file defines all the hardware in a robot and the pin 
assignments of the motors, sensors, speakers, and displays.

Because most of our robots use the Cytron board, the
pins are standardized for most of our kits.

Using a configuration file has tradeoffs.  The pros
is that it allows you to change a single file when
you change the wiring in your robot.  All the
example programs that use the config file
 will be automatically updated.

 The disadvantage is that it makes your programs
 a little more abstract.  New users will take
 some time to learn how to see how the configuration
 file is used to map a variable to the underlying
 hardware pins.

 ## Sample Config File

 All of the hardware pins should be defined in this file.

```python
NUMBER_PIXELS = 2
NEOPIXEL_PIN = 18
SPEAKER_PIN = 22
```

!!! Note
    Make sure there are no spaces in front of the variable names.

 Now in your main code you must do the following:
 
 1. Ddd the ```import config``` (without the .py)
 2. place the string ```config.``` in front of each variable.

 ```python
 import config

  # Get the data from the config file
NUMBER_PIXELS = config.NUMBER_PIXELS
NEOPIXEL_PIN = config.NEOPIXEL_PIN
  ```

  By placing the ```config``` in front of the variable name, you
  tell the Python interpreter to read the variable from that file.

###  Standard NeoPixel Blink

```python
from machine import Pin
from time import sleep
from neopixel import NeoPixel

NUMBER_PIXELS = 8
NEOPIXEL_PIN = 15

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    strip[0] = (255,0,0) # red=255, green and blue are 0
    strip.write()        # send the data from RAM down the wire
    sleep(1)             # keep on 1/10 of a second
    strip[0] = (0,0,0)   # change the RAM back but don't resend the data
    strip.write()
    sleep(1)
```

### Blink Using Config  File


---


# Lesson Using 6-Volt DC Hobby Motors

![](images/img_052_dc-motors.jpg)

## Sample Prompt

```linenums="0"
Create a lesson plan using two 6-volt DC hobby
motors with wheels for a 5th grade
classroom that is interested in building robots.
Assume you have a battery pack of 3 AA batteries,
wires, and a glue gun.
```
## Sample Response

### Lesson Plan: Building a Simple Robot with DC Motors

#### Objective:

Students will learn about basic electronics and robotics by building a simple robot using DC motors and a battery pack.

#### Materials:

-  2 DC motors (as shown in the image)
-  1 battery pack for 3 AA batteries
-  3 AA batteries
-  2 wheels (one attached to each motor)
-  Chassis (can be a small plastic container or cardboard)
-  Electrical tape and/or heat shrink tubing
-  Small switch (optional)
-  Connecting wires
-  Hot glue gun and glue sticks
-  Screwdriver
-  Scissors or wire cutters

Duration: About 2 hours

#### Lesson Steps:

**1\. Introduction to DC Motors and Robotics (15 minutes)**

-   Explain what a DC motor is and how it works.
-   Discuss how robots use motors to move.
-   Show examples of simple robots (videos or images).

**2\. Safety Briefing (5 minutes)**

-   Explain the importance of safety when working with batteries and hot glue.
-   Demonstrate how to safely use the hot glue gun.

**3\. Building the Robot (90 minutes)**

#### Step 1: Prepare the Motors

-  Attach a wheel to each motor securely.
-  Connect wires to the motor terminals if not already connected. Red wire to one terminal and black (or blue) to the other.

#### Step 2: Construct the Chassis

-   Use a small plastic container or piece of cardboard as the base.
-   Attach the motors to the bottom of the chassis using hot glue, making sure the wheels can rotate freely.

#### Step 3: Connect the Motors to the Battery Pack

-   Attach the battery pack to the top of the chassis using hot glue or tape.
-   Connect the red wire from each motor to the red wire from the battery pack.
-   Connect the black wire from each motor to the black wire from the battery pack.
-   Optionally, include a switch between the battery pack and the motors to turn the robot on and off.

#### Step 4: Test the Robot

-   Insert the AA batteries into the battery pack.
-   Turn on the switch (if included) and observe the robot move.
-   If the robot doesn't move, check the connections and ensure the batteries are inserted correctly.

#### Step 5: Customize the Robot

-   Allow students to decorate their robots with markers, stickers, or other craft supplies.
-   Encourage students to experiment with different chassis designs and motor placements.

#### Wrap-Up and Discussion (10 minutes)**

-   Ask students to share their experiences building the robot.
-   Discuss what they learned about motors and robotics.
-   Talk about potential improvements and modifications they could make to their robots.

**5\. Clean-Up (10 minutes)**

-   Ensure all materials are put away properly.
-   Make sure the classroom is tidy and free of any hazards.

#### Additional Resources:

- Provide links to simple robotics projects and tutorials.
- Suggest books or websites for further reading on robotics and electronics.

#### Assessment:

- Observe students during the activity to ensure they are following instructions and working safely.
- Assess the functionality of each student's robot.
- Encourage students to explain how their robot works and what they learned from the activity.

This lesson plan aims to provide a hands-on, engaging introduction to robotics and electronics, suitable for 5th-grade students.


---


# Motor Direction Lab

<iframe width="560" height="315" src="https://www.youtube.com/embed/3a2cNJKLYzo?si=iEpcKfJSfjV8_qlq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

In this lesson, we want to make a motor go both forward and reverse.

For an example simulation, see the [H-Bridge Simulation](../sims/h-bridge/index.md).

## Sample Prompt

```linenums="0"
Create a lesson plan for a 5th grade class that is interested in
learning how to make a robot move forward and backward.
Assume the students have access to a 6-volt DC hobby motors,
wheels, switches, and a battery pack with 3 AA batteries.
Generate a lesson plan that will get the students to learn how to connect
the battery so that the motors go forward or reverse.
```

### Lesson Plan: Making a Robot Move Forward and Backward

#### Objective:

By the end of the lesson, students will understand the basics of connecting a battery to motors to make a robot move forward and backward.

#### Materials:

-   6-volt DC hobby motors
-   Wheels compatible with the motors
-   Switches (DPDT or SPDT)
-   Battery pack with 3 AA batteries
-   Connecting wires
-   Screwdrivers
-   Electrical tape
-   Small robot chassis (optional)
-   Whiteboard and markers
-   Handouts with circuit diagrams and instructions

Duration: 1 hour

## Lesson Breakdown:

### Introduction (10 minutes)

#### Greeting and Introduction

-   Welcome the students and introduce the topic: "Today, we will learn how to make a simple robot move forward and backward using motors, switches, and a battery pack."
-   Briefly explain what each component does: motors convert electrical energy into motion, switches control the direction, and the battery pack provides power.

#### Explanation and Demonstration (15 minutes)

1.  **Basic Circuit Concepts**

-   Explain the basic concept of an electrical circuit.
-   Show how connecting the battery pack to the motor makes it spin.

2.  **Direction Control with Switches**

-   Explain how switches can change the direction of the motor.
-   Demonstrate using a Double Pole Double Throw (DPDT) switch or a Single Pole Double Throw (SPDT) switch.

#### Hands-On Activity (30 minutes)

1.  **Building the Circuit**

-   Divide the students into small groups and distribute the materials.
-   Provide step-by-step instructions on how to connect the components:

1.  **Connecting the Motors and Wheels:**
    -   Attach the wheels to the motors.
2.  **Connecting the Battery Pack:**
    -   Connect the battery pack to the motor terminals using connecting wires.
3.  **Adding the Switch:**
    -   Connect the switch between the battery pack and the motors.
    -   Show how flipping the switch changes the motor's direction, making the robot move forward or backward.

#### Testing and Troubleshooting

-   Allow students to test their connections.
-   Encourage them to troubleshoot and correct any issues, such as loose connections or incorrect wiring.
-   Walk around the room to assist and answer questions.

#### Conclusion (5 minutes)

1.  **Review and Reflect**

    -   Recap the key points: how to connect the battery to the motors, how switches control the direction, and the importance of secure connections.
    -   Ask students to share what they learned and any challenges they faced.

2.  **Preview of Next Lesson**

-   Briefly introduce what they will learn next (e.g., changing motor speed, adding more controls, using sensors, programming the robot).

### Handouts:

-   Simple circuit diagram showing the battery pack, motors, and switch connections.
-   Step-by-step instructions with illustrations.
-   Troubleshooting tips.

This lesson plan should help 5th graders understand the basics of building a simple robot and controlling its movement.

## H-Bridge

### Lesson Plan: Using an H-Bridge Circuit to Change Motor Direction

#### Objective:

By the end of the lesson, students will understand how to use 
an H-Bridge circuit with four Single Pole Single Throw (SPST) switches to change the direction of a motor.

#### Materials:

-   Web-based [simulation of the H-Bridge circuit](../sims/h-bridge/index.md)
-   Computers with internet access
-   Whiteboard and markers
-   Handouts with H-Bridge circuit diagrams and instructions

Duration: 1 hour

### Lesson Breakdown:

#### Introduction (10 minutes)

1.  **Greeting and Introduction**
    -   Welcome the students and introduce the topic: "Today, we will learn how to use an H-Bridge circuit to control the direction of a motor using four SPST switches."
    -   Explain what an H-Bridge is and its importance in controlling motor direction.

#### Explanation and Demonstration (15 minutes)

1.  **Basic Concept of H-Bridge**

-   Explain the basic concept of an H-Bridge circuit: it allows a voltage to be applied across a load in either direction.
-   Draw the H-Bridge diagram on the whiteboard and label each part: four switches (S1, S2, S3, S4), motor (M), and power source (V).

2.  **How H-Bridge Works**

    -   Explain the different states of the switches to change the motor direction:
        -   Forward: S1 and S4 are closed, S2 and S3 are open.
        -   Reverse: S2 and S3 are closed, S1 and S4 are open.
        -   Stop: All switches are open or opposing switches are closed (S1 and S2 or S3 and S4).
    -   Demonstrate these states using the web-based simulation.

#### Hands-On Activity (30 minutes)

1.  **Setting Up the Simulation**

-   Guide students to open the web-based simulation tool on their computers.
-   Provide step-by-step instructions to set up the H-Bridge circuit in the simulation:
    1.  **Creating the Circuit:**
        -   Place the motor, power source, and four SPST switches in the simulation.
    2.  **Wiring the Circuit:**
        -   Connect the components to form an H-Bridge circuit as shown in the diagram.
    3.  **Testing the Circuit:**
        -   Simulate closing different combinations of switches to see how the motor direction changes.

2.  **Exploration and Experimentation:**

-   Allow students to experiment with the circuit in the simulation.
-   Encourage them to try different combinations of switch states and observe the motor's behavior.
-   Walk around the room to assist and answer questions.

#### Conclusion (5 minutes)

1.  **Review and Reflect**

-   Recap the key points: how an H-Bridge circuit works, the role of SPST switches, and how to control motor direction.
-   Ask students to share their observations and any challenges they faced during the simulation.

2.  **Preview of Next Lesson**

-   Briefly introduce what they will learn next lesson.  Discuss
the need to control both the direction and speed of a motor.

### Handouts:

-   H-Bridge circuit diagram showing the motor, power source, and four SPST switches or a single DPDT switch.
-   Step-by-step instructions with illustrations for setting up the circuit in the simulation.
-   Troubleshooting tips for common issues in the simulation.

This lesson plan should help 5th graders understand the concept and application of an H-Bridge circuit for motor control using simulations.


---


# H-Bridge Lab

![](images/img_060_h-bridge.png)

The H-bridge circuit allows us to make a motor turn in opposite directions
if we close opposite switches.  To make the motor move one direction we close the upper left (Switch 1) and the lower right (Switch 4) switches.  To make the motor move in the opposite direction we close the lower left (Switch 2) and upper right (Switch 3) switches.

It is called an "H" bridge because the circuit forms the shape of the letter "H".

![](images/img_045_h-bridge-2.png)


In the figure above:

1. To move forward, close switches 1 and 4
2. To move in reverse, close switches 2 and 3

This circuit can also be demonstrated by using a single double-pole, double throw switch.

![](images/img_061_dpdt-switch.png)


<iframe width="560" height="315" src="https://www.youtube.com/embed/rtaaIjR2qmY?si=UHTfZRQHnEzNux3i" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>




---


# Controlling Motor Speed

## Battery Voltage

## Adjusting a Potentiometer


---


# Pulse Width Modulation Lab


---


# Testing Motor Connections




---


# Making Your Robot Dance




---


# The I2C Bus

## The I2C Scanner

## Testing For Your Sensor




---


# Sensors

![](images/img_030_sensors.jpg)

1. **Bump sensors** - microswitches
2. **IR Sensors** - Infrared distance sensors
3. **Ultrasonic Sensors** - using sound to measure distance
4. **Time of Flight Sensors** - our favorite sensor
5. **LIDAR** - high end sensors for moving robots




---


# The Time of Flight Sensor

In this lab, we will learn how to use a powerful low-cost Time-of-Flight sensor.





---



## Ultrasonic Sensor




---


# IR Distance Sensors


---



## Collision Avoidance




---


# Using Perfboards in Beginning Electronics Classes
## Sample Prompt

``` prompt "Prompt Text"
    Create a five-page tutorial on using perf boards for a junior high school student.  
    Return the tutorial using a single Markdown file using the following outline:

    # Using Perfboards in Beginning Electronics Classes
    ## What is a PerfBoard
    ## Different Types of PerfBoards
    ## When to use a PerfBoard vs. Solderless Breadboard

    Suggest various photos to use when appropriate.  For each photo, give a detailed description of the photo.

    You can assume the following photos are available:

    1. A photo of a perfboard for sale on e-bay
    2. A photo showing the different types of perfboards

    Include a list of supplies like solder, wire etc.

This tutorial is designed to introduce junior high school students to the basics of using perfboards in electronics projects. In it, we will discuss what a perfboard is, explain different types of perfboards, and help you understand when you should use a perfboard instead of a solderless breadboard. By the end of this tutorial, you should feel comfortable choosing and using a perfboard for your own electronic creations.

**Note:** Perfboards are sometimes called “protoboards” and come in many varieties. The skills you learn here will be useful no matter which type you use.

## What is a PerfBoard

A **perfboard** is a flat board made of a rigid material (often fiberglass or phenolic) that is perforated with a grid of evenly spaced holes. These holes are usually spaced about 0.1 inches (2.54 mm) apart. Each hole is surrounded by a small copper pad (a little ring of copper) on one side of the board. You can insert electronic components such as resistors, LEDs, capacitors, integrated circuits, and wires through these holes, and then solder the component leads on the other side. This creates a permanent (or semi-permanent) connection between components.

Perfboards are commonly used when you move beyond the initial planning and experimentation stage of your project. After you’ve tested a circuit on a solderless breadboard, a perfboard lets you solder it all together into a more stable and durable form. While not as fancy or as permanent as a fully designed printed circuit board (PCB), a perfboard is a great stepping stone that helps turn your prototype into a more reliable device.

**Suggested Photo:**
- *Photo of a perfboard for sale on e-bay:* Show a standard rectangular perfboard with regularly spaced holes and copper pads visible on one side. The photo would likely be a close-up image focusing on the uniform grid of holes, clearly showing the copper pads around them. This will give a good idea of the material, size, and typical appearance of a basic perfboard.

## Different Types of PerfBoards

Perfboards are not all the same. You can find different types that vary in size, material, and how their copper pads are arranged.

1. **Basic Single-Sided Perfboards:**  
   These have copper pads on one side only. Each hole has its own separate copper pad. This is the most common and straightforward type. You must connect pads together by soldering wires, component leads, or by using small pieces of wire to bridge connections between holes.

2. **Stripboard (Veroboard):**  
   Similar to a perfboard but with rows (or strips) of copper pads connected together. Instead of each pad being isolated, a stripboard’s holes are arranged along copper tracks. These tracks can be cut if needed. Stripboards make it easier to create rows of connected pads, reducing the amount of wiring you need.

3. **Double-Sided Perfboards:**  
   These have copper pads on both sides of the board. Double-sided boards make it possible to connect circuits on either side and sometimes simplify more complicated projects because you can route connections more easily.

4. **Pre-Soldered Protoboards with Buses:**  
   Some perfboards come with pre-connected power rails or “buses” to make it easier to provide power (e.g., 5V or ground) to all your components. This can reduce the amount of wiring you do for the common connections.

**Suggested Photo:**
- *Photo showing different types of perfboards:* A photo with multiple perfboards laid out side-by-side. Include a basic single-sided perfboard, a stripboard, and a double-sided perfboard. The image might show them at an angle so the viewer can see the copper pads and strips. Perhaps labels or captions in the image help identify each type. It might also show some boards partially populated with a few components so that students can see how they’re used.

## When to Use a PerfBoard vs. Solderless Breadboard

**Solderless breadboards** are great tools for beginners. They let you quickly build and change circuits without any soldering. Perfect for experiments and for making sure your design is correct before you commit to soldering.

**Perfboards**, on the other hand, require soldering. That’s a more advanced skill, but once you’ve tested your circuit and you’re confident it’s correct, moving it to a perfboard is a natural next step. Consider the following points:

- **Use a Solderless Breadboard:**  
  - When you’re designing a new circuit and not sure if it will work.  
  - If you want to quickly rearrange components and test new ideas.  
  - In a classroom setting where you want to focus on understanding circuit theory before worrying about soldering technique.

- **Use a PerfBoard:**  
  - After you’ve tested your circuit on a breadboard and know it works well.  
  - When you’re ready to make your circuit more reliable and long-lasting.  
  - If you’re creating a project you want to keep and show off rather than just experiment with.

By thinking of a perfboard as a “next step” after breadboards, you’re moving along the path from concept to a more permanent, usable device.

## How to Use a PerfBoard

1. **Plan Your Layout:**  
   Before you start soldering, draw out where each component will go. Think about where your power and ground lines should run, and how your signal paths should flow. Good planning makes soldering much simpler.

2. **Place Your Components on the Board:**  
   Insert the leads of your resistors, capacitors, IC sockets, or other components through the holes. Make sure to align integrated circuits so their notch or marking is oriented correctly. Keep similar parts grouped together to reduce confusion.

3. **Solder the Connections:**  
   Once components are placed, flip the board over to the copper pad side. Heat the pad and the component lead with your soldering iron, then apply a small amount of solder. The solder should flow nicely around the pad and the lead. Avoid using too much solder, as you could create solder bridges (unwanted connections between pads).

4. **Add Wires for Additional Connections:**  
   If certain pads need to be connected, solder in small pieces of wire between them. Pre-cut wire “jumpers” or stripped solid-core wire pieces work best. Keep your connections neat to avoid confusion.

5. **Check Your Work:**  
   After soldering, double-check your connections against your circuit diagram. Make sure there are no accidental shorts and that each component is correctly placed. Use a magnifying glass if needed.

## Useful Tips, Supplies, and Tools

**Tips:**
- Start with a simple circuit you already understand well.  
- Keep track of the polarity of components like electrolytic capacitors and LEDs.  
- Practice soldering on a spare perfboard first to build your confidence.  
- Use color-coded wires (e.g., red for power, black for ground) to keep your circuit organized.  

**Basic Supplies:**
- **PerfBoard:** A medium-sized, single-sided perfboard for your first project.  
- **Soldering Iron:** A low-wattage (around 25-40 watts) soldering iron with a fine tip is perfect for beginners.  
- **Solder:** Thin solder (e.g., rosin core 60/40) works well and melts easily.  
- **Wire:** Solid-core hookup wire for making connections on the perfboard and flexible stranded wire for external leads.  
- **Components:** Resistors, LEDs, capacitors, integrated circuits, switches, and any other parts for your project.  
- **Wire Strippers and Cutters:** To prepare your wires before soldering.  
- **Needle-Nose Pliers:** Helps in bending component leads and holding small parts in place.  
- **Multimeter:** Useful for checking continuity and verifying that connections are correct.

With these tools and knowledge, you’re ready to move beyond the breadboard stage. Experiment, have fun, and remember that practice makes perfect!

## References

[Using Perf Boards on Instructables](https://www.instructables.com/Using-Perfboard/)




---



# Instructor's Guide

# Instructors Guide

This section describes guidelines for people teaching STEM robotics
courses.  We don't just focus on the process of setting up a great
STEM Robotics event or course, we also review some of the underlying
processes we are attempting to teach.

## Computational Thinking

Computational thinking is a name we give to describing the underlying patterns that guide the development of computer science curriculum.  Our goal is to teach these
concepts using a fun curriculum.

[Read the Section on Computational Thinking](computational-thinking.md)


---


# Computational Thinking

Computational thinking is a name we give to describing the underlying patterns that guide the development of computer science curriculum.

There are four key patterns that are frequently discussed when we talk about computational thinking.

1. **abstraction** – focusing on the important information only, ignoring irrelevant detail.
2. **algorithms** - developing a step-by-step solution to the problem, or the rules to follow to solve the problem.
3. **decomposition** - breaking down a complex problem or system into smaller, more manageable parts.
4. **pattern recognition** – looking for similarities among and within problems.

We have to added the concept of expandability and bias to these concepts:

1. **explainability** - can a computer explain why it took a specific action or made a specific recommendation?
2. **bias** - is the result of the suggestion made by a computer skewed in a direction that makes it unfair to a group of people?


## Other Common Design Patterns

Although we have many different coding groups that are appropriate for beginners, there are several computer science concepts that we encourage everyone to adopt in your coding group curriculum.

**Events** - What events start a program?  What events change the behavior of a program?

**Loops** - How do repeat a set of tasks?

**Variables** - How do we reference a common value and make our programs easier to change?

**Conditionals** - How do we change program behavior based on rules.  How do we use comparisons to do this?  How do we implement if/then/else or switch/case logic to be easy to understand and maintain?

**Functions** - How do we group code sections together and give them names?

**Function Parameters** - How do we pass values to functions? How can parameters make functions more widely reusable? Why would we want to check the types of an input parameters?  What happens when we pass invalid data types to a function?

**Data types** - What is the difference between a string of characters, an integer, a floating point number or a datetime?  How do we use the right datatype and type checking to keep our programs reliable?

**Data Structures** - How do you create and manage lists, dictionaries, arrays and complex data structures?

**Sensors** - How do we gather input from the real world?

**Output** - How do we display text or graphic output on a small display screen or print statements to a serial console for debugging?

**Feedback** - how do we prompt users for input and respond to changes in output

**Debugging** - How do we find problems in our code?  How can we stop execution of our code using a debugger?  How do we inspect the value of variables when a program has paused?

**Drawing** - Drawing to a graphics device is a great way to learn other concepts where you get quick visual feedback.  Drawing can be our on ramp to drawing charts and graphs.  See our [SVG Labs](http://www.coderdojotc.org/web-ux/svg/01-intro/) for excellent examples of learning to program with graphics.

**Recursion** - What happens when a function calls itself?  How can you draw trees that have many smaller branches?

**Commenting** - How do we put hints in our code for others to better understand our code?  How do comments make code more maintainable?

**Scope** - How do we protect variables from unintended updates?  How do we use global variables sparingly.  How do we use local variables and when should move variables from global to local or vice versa?

## Advanced concepts
Here are a few topics that you can explore with your move advanced students.

**Files** - How do we read data in from files and write data out to files?  How do we append to the end of files?

**Regular Expressions** - How do we use a short set of special characters to look for patterns in strings and text?

**Integrated Development Environments** - How do we setup our desktop so that we can be productive debugging our programs?  What is syntax highlighting?  What is autocomplete?

**Logging** - How do we keep a record of what has happened in our programs?



---



# MicroSims


## Introduction




---


# Concept Graph Viewer

A learning graph is a network graph data structure where each vertex is
a concept a student will learn.  Arrows between the concepts represent
dependencies or prerequisites.

THe following graph was created by ChatGPT using three prompts:

1. Course Description using Bloom's 2001 taxonomy
2. Concept Enumeration
3. Concept Dependency
4. Concept Taxonomy

[View STEM Robotics Learning Graph](./graph-viewer.html)

!!! Tip
    You can use your mouse and scroll wheel to navigate around the graph.
    You can zoom in, pan and move the nodes around the graph.


---


# H-Bridge Circuit

![](./h-bridge.png){ width="400" }

An H-bridge circuit is four switches around a motor in the shape of the letter "H".
The motor is at the center of the letter "H".
When the upper-left and lower-right switches are closed, the motor spins one direction.
When the lower-left and upper-right switches are closed, the motor spins in the opposite direction.

![](images/img_060_h-bridge.png)

[H-Bridge Demo](./h-bridge.html){ .md-button .md-button--primary }

```linenums="0"
Generate a single p5.js sketch file.

Draw an H-bridge circuit for reversing the direction of a DC motor.

Have three state buttons for "Forward", "Stop" and "Reverse".
Place the positive power rail at the top of the circuit.
Place the negative rail at the bottom of the circuit.
Place the motor in the center of the H-brige ciricut.
Animate the motor moving clockwise for the Forward state.
Animate the motor going counter-clockwise for the Reverse state.
Make the motor stopped for the Stop state.
Have the upper left and lower right wires animate current for the Forward state.
Have the upper right and lower left wires animate current for the Reverse state.
Turn off all wire animation for the Stop state.

Create four knife switches.
Have the upper left and lower right be closed for Forward.
Have the upper right and lower left be closed for Reverse.
Have all the switches be open for Stop.

Use the following function to draw current in a wire:

function drawAnimatedWire(x1, y1, x2, y2, speed1, state) {
    if (state) {
        let distance = dist(x1, y1, x2, y2);
        let circlePos = map((millis() * speed1) % distance, 0, distance, 0, 1);

        // lerp generates the percent between two values
        let x = lerp(x1, x2, circlePos);
        let y = lerp(y1, y2, circlePos);

        stroke(0);
        strokeWeight(lineWidth)
        line(x1, y1, x2, y2); // Draw the wire

        fill(255, 0, 0);
        noStroke();
        circle(x, y, 10); // Draw the moving circle (electron)
    } else {
        stroke(0);
        strokeWeight(lineWidth)
        line(x1, y1, x2, y2); // Draw the wire
    }
}
```
## Response

Sure! Here's a p5.js sketch file that implements the H-bridge circuit with state buttons for "Forward," "Stop," and "Reverse":

```js
let forwardButton;
let stopButton;
let reverseButton;

const lineWidth = 2;

function setup() {
  createCanvas(400, 400);
  
  forwardButton = createButton('Forward');
  forwardButton.position(10, 10);
  forwardButton.mousePressed(forward);

  stopButton = createButton('Stop');
  stopButton.position(90, 10);
  stopButton.mousePressed(stop);

  reverseButton = createButton('Reverse');
  reverseButton.position(150, 10);
  reverseButton.mousePressed(reverse);
}

function forward() {
  // Code to control the H-bridge for forward motion
}

function stop() {
  // Code to stop the motor
}

function reverse() {
  // Code to control the H-bridge for reverse motion
}

function draw() {
  background(220);

  // Draw positive power rail
  stroke(0);
  strokeWeight(lineWidth);
  line(40, 60, width - 40, 60);

  // Draw negative power rail
  stroke(0);
  strokeWeight(lineWidth);
  line(40, height - 60, width - 40, height - 60);

  // Draw H-bridge circuit
  stroke(0);
  strokeWeight(lineWidth);
  line(width / 2 - 40, 60, width / 2 - 40, height - 60);
  line(width / 2 + 40, 60, width / 2 + 40, height - 60);
  line(width / 2 - 40, height / 2, width / 2 + 40, height / 2);

  // Draw motor
  noFill();
  stroke(0);
  strokeWeight(lineWidth);
  rect(width / 2 - 20, height / 2 - 20, 40, 40);

  // Draw wires with current
  let speed1 = 0.01;
  drawAnimatedWire(40, 60, width / 2 - 40, 60, speed1, forwardButton.elt.disabled);
  drawAnimatedWire(width / 2 + 40, 60, width - 40, 60, speed1, reverseButton.elt.disabled);
  drawAnimatedWire(40, height - 60, width / 2 - 40, height - 60, speed1, reverseButton.elt.disabled);
  drawAnimatedWire(width / 2 + 40, height - 60, width - 40, height - 60, speed1, forwardButton.elt.disabled);
}

function drawAnimatedWire(x1, y1, x2, y2, speed1, state) {
  if (state) {
    let distance = dist(x1, y1, x2, y2);
    let circlePos = map((millis() * speed1) % distance, 0, distance, 0, 1);

    // lerp generates the percent between two values
    let x = lerp(x1, x2, circlePos);
    let y = lerp(y1, y2, circlePos);

    stroke(0);
    strokeWeight(lineWidth);
    line(x1, y1, x2, y2); // Draw the wire

    fill(255, 0, 0);
    noStroke();
    circle(x, y, 10); // Draw the moving circle (electron)
  } else {
    stroke(0);
    strokeWeight(lineWidth);
    line(x1, y1, x2, y2); // Draw the wire
  }
}
```








---


# Pulse-Width Modulation

![PWM](./pwm.png)

[Run the Pulse-Width Modulation Demo](./pwm.html){ .md-button .md-button--primary }

[Edit the MicroSim](https://editor.p5js.org/dmccreary/sketches/xaNSzbNLS)

Pulse-width modulation is the way for microcontrollers to send a precise signal to a 
device such as a motor controller to control motor speed.  PWM signals
can also be used to change the brightness of an LED.
This simulation has a slider that allows the user to change the "duty cycle" of
a waveform.  The simulation is a bright green line on a black background, just like
the old CRT oscilloscope displays.

## Sample ChatGPT Prompt

```linenums="0"
Generate a p5.js sketch file of a simulation of a static pulse width
   modulation (PWM) waveform on a 600x300 canvas.
Add a range control slider to adjust the Duty Cycle of the waveform.
Make the default Duty Cycle be 50%.
The min should be 0% and the max should be 100%.
Place the range control slider at the bottom of the canvas.
Make the leftSliderMargin be 155.
Make sure the range control slider has a width of canvasWidth-leftSliderMargin-20 using the 
   style attribute.
At the end of the draw() function add a text() function that displays
   the label and value of the duty cycle.
```

I have tested this prompt several times using GPT-4 and it seems to work very well
except for the precise layout of the duty cycle label, value and slider positioning.
I had to tweak these by hand.

[Edit This MicroSim Using the P5.js Editor](https://editor.p5js.org/dmccreary/sketches/LuroLLnh9)

## Sample Response

```js
/// Pulse Wave Modulation (PWM) simulation
// Made to render like an old oscilloscope - lime green on black
// Most of this sim was generated by GPT-4 with some cleanup on placement of the slider
let canvasWidth = 600;
let canvasHeight = 200;
let dutyCycleSlider;
let dutyCycle = 0.5; // Initialize to 50%
let cycles = 6;
let waveHeight = canvasHeight/3;
let leftSliderMargin = 155; // at 16 point font

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  // uncomment if you are placing in an HTML page
  // canvas.parent('canvas-container');
  textSize(16);
  
  dutyCycleSlider = createSlider(0, 1, 0.5, 0.01); // Range from 0 to 1, default value 0.5, step size 0.01
  dutyCycleSlider.position(leftSliderMargin, canvasHeight - 35); // Position slider
  dutyCycleSlider.style('width', canvasWidth - leftSliderMargin - 20 + 'px'); // Set width of slider
}

function draw() {
  background('black');

  // Update duty cycle
  dutyCycle = dutyCycleSlider.value();
  
  // Set stroke for waveform
  stroke('limegreen');
  // disable the fill in the waveform
  noFill();
  // make the line be double wide
  strokeWeight(2);
  
  // Generate PWM waveform
  beginShape();
  for (let x = 0; x < width; x++) {
    // Map x to time period of waveform
    let t = map(x, 0, width, 0, TWO_PI * cycles);
    
    // Calculate value of waveform at this point in time
    // Draw high if in duty cycle, low otherwise
    let y = (sin(t) > 2 * dutyCycle - 1) ? 
        2*height/3 : height/3; 
    
    // Add vertex to waveform
    vertex(x, y);
  }
  endShape();
  
  // Display duty cycle
  fill('white');
  noStroke();
  // Display duty cycle as percentage
  text("Duty Cycle: " + nf(dutyCycle*100, 0, 0) + "%", 20, height - 20); 
}
```

## Key Learnings from the Simulation

1. We can use the ```map()``` function to transform the x coordinate into the time period of a waverform (t.)
1. We can draw a square wave using a ```sin()``` function with a threshold test.
2. We can use the ```beginShape()``` and ```endShape()``` around as set of ```vertex()``` point placements to generate waveforms.
3. We can use the "number format" function [```nf()```](https://p5js.org/reference/#/p5/nf) 
to display the percentage without a decimal point.

## Lesson Plan

### Lesson Plan Prompt

```linenums="0"
I have a webpage that simulates a pulse-width-modulation waveform. 
The page has a slider that allows students to change the duty cycle from 0% to 100%.
When the students change the slider, the waveform is updated with the duty cycle.
Generate a lesson plan for a 9th-grade robotics class that uses this simulation.
For follow up activities, we have Raspberry Pi Picos that we program with MicroPython.
Return the response in a single raw markdown file.
```

### Lesson Plan: Understanding Pulse-Width Modulation in Robotics

#### Objective:
Students will understand the concept of PWM and its application in controlling robotic components like motors and LEDs.

#### Materials Needed:
- Computers with internet access for the PWM simulation webpage.
- Projector for demonstrations.
- Optional: Physical components such as a small motor, LED, and Arduino for real-world demonstration.

#### Duration:
1 hour

### Lesson Outline:

#### 1. Introduction to PWM (15 minutes)
- Begin with a brief overview of PWM and its significance in robotics.
- Explain key terms: duty cycle, frequency, analog vs. digital signals.

#### 2. Demonstration of PWM Simulation (10 minutes)
- Project the PWM simulation on the screen.
- Show how changing the duty cycle affects the waveform.
- Relate this to how it would affect a motor's speed or an LED's brightness.

#### 3. Hands-On Activity with the Simulation (20 minutes)
- Students will use the simulation on their computers.
- Tasks:
  - Set the duty cycle to various levels (0%, 25%, 50%, 75%, 100%) and observe changes.
  - Students note their observations regarding the waveform changes.

#### 4. Real-World Application Discussion (10 minutes)
- Discuss how PWM is used in real-world robotics.
- If available, demonstrate using a motor or LED with an Arduino.
- Encourage students to think of examples where PWM might be used in everyday technology.

#### 5. Reflection and Q&A (5 minutes)
- Encourage students to ask questions.
- Discuss the importance of PWM in precise control in robotics.

### Assessment:
- Students will submit a brief report on their findings from the simulation.
- Include a few quiz questions at the end of the session to gauge understanding.

### Extension Activity:
- For advanced students or as a follow-up lesson, introduce a Python program that uses PWM to control a motor speed using a motor driver chip such as an L293D or control an LED brightness.

### Notes:
- Ensure that all students understand the basic concepts before moving to the hands-on activity.
- Assist students who might have difficulty with the simulation or concepts.
- Encourage group discussions and peer learning.




---


# Collision Avoidance Robot

<figure markdown>
   ![Image Name](./collision-avoidance-robot.png){ width="400" }
   <figcaption>Collision Avoidance Robot</figcaption>
</figure>

[Link to Collision Avoidance Demo](./collision-avoidance-robot.html){ .md-button .md-button--primary }

[Edit MicroSim](https://editor.p5js.org/dmccreary/sketches/OE3jdt40E)

## Sample Prompt

```linenums="0"
Create a p5.js simulation of a collision avoidance robot on a 400x400 canvas.
The robot moves in a circle of radius 200 which is centered in the canvas.
The robot is drawn as blue filled rectangle 40x40 with a 20 long red line
pointing at the front.
The robot has four modes: stopped, forward, backing up a turning.
There are three buttons at the bottom of the drawing region: Start, Stop
and Reset.
The initial state is stopped.  Place the robot in the center facing right.
When the user presses Start the robot goes into forward mode.
When the robot comes within 20 of the edge of the circle it will
backup 20 and then turn.
The turn will be 120 degrees either right or left.
After the robot turns it will then go forward.
When the user presses Stop the mode will be stopped.
When the user presses Reset the robot will be placed stopped
at the center of the canvas.
```



---



# Kits

# Introduction to STEM Robot Kits

## Base Bot

- Total cost: $18
- Cytron board: $11
- Chassis Kit: $4
- Time of Flight Distance Sensor: $3

## Base Bot with 8-Element NeoPixel

- Total cost: $19
- Cytron board: $11
- Time of Flight Distance Sensor: $3
- 8 Element NeoPixel Strip

## Display Bot


---



## Base Robot

# Base Robot

![](images/img_041_maker-pi-rp2040-robot.jpg)

This is our classic low-cost robot that can be purchased for around $19 each and can be assembled without any soldering.  It is built on the powerful
[Cytron Maker Pi RP2040] board that is programmed by the same
software that powers the Raspberry Pi Pico.

[MicroPython for Kids](https://dmccreary.github.io/micropython/micropython/kits/maker-pi-rp2040-robot/)

# Introduction to the Base STEM Robot

Although there are many variations of our STEM Robot, this
robot was specifically designed for classrooms that
don't want to require any soldering and complex wiring.


---


# Testing Motor Connections

## Activity Overview
Students will work with a MicroPython-controlled robot to understand motor control, PWM signals, and basic robotics programming.

## Learning Objectives
Students will be able to:

- Understand how PWM controls motor speed and direction
- Identify the purpose of each pin configuration
- Observe and document motor behavior
- Modify code parameters to change robot behavior

## Materials Needed
- MicroPython-compatible microcontroller (Raspberry Pi Pico recommended)

- Robot chassis with two motors
- Jumper wires
- Computer with MicroPython IDE

## Student Activities

### Activity 1: Code Analysis
- Read through the provided code and identify the four motor control pins

- Explain what the `POWER_LEVEL` constant controls
- Predict what the robot will do when the code runs

### Activity 2: Initial Testing

- Connect the motors according to the pin assignments
- Run the code and observe which wheels move in which directions
- Record observations for each motor test phase
- Note any motors that don't work as expected

### Activity 3: Pin Calibration

- If wheels move in unexpected directions, modify the pin assignments
- Test different pin combinations until all motors work correctly
- Document the correct pin configuration for your robot

### Activity 4: Parameter Modification

- Change the `POWER_LEVEL` value and observe speed differences
- Modify the sleep times to make movements faster or slower
- Test values between 0-65535 for power level

### Activity 5: Movement Programming

- Create new functions for specific movements (forward, backward, turn left, turn right)
- Replace the test loop with a sequence of actual robot movements
- Program the robot to move in a square pattern

## Assessment Questions

- What happens if you set `POWER_LEVEL` to 0?
- Why does the code use separate pins for forward and reverse?
- How would you modify the code to make the robot turn in place?

## Sample Code

```python
from machine import Pin, PWM
from utime import sleep

POWER_LEVEL = 65025

# change these numbers until you get the right wheel and direction
RIGHT_FORWARD_PIN = 9
RIGHT_REVERSE_PIN = 8
LEFT_FORWARD_PIN = 10
LEFT_REVERSE_PIN = 11

# setup all the PWM objects with a frequency of 50 Hz
right_forward = PWM(Pin(RIGHT_FORWARD_PIN), freq=50)
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN), freq=50)
left_forward = PWM(Pin(LEFT_FORWARD_PIN), freq=50)
left_reverse = PWM(Pin(LEFT_REVERSE_PIN), freq=50)

def spin_wheel(pwm):
    pwm.duty_u16(POWER_LEVEL)
    # keep motor on for 3 seconds
    sleep(3)
    pwm.duty_u16(0)
    # turn motor off for two seconds
    sleep(2)

# the orientation is looking down from the back of the robot
while True:
    print('right forward')
    spin_wheel(right_forward)

    print('right reverse')
    spin_wheel(right_reverse)

    print('left foward')
    spin_wheel(left_forward)

    print('left_reverse')
    spin_wheel(left_reverse)

```


---


# Up Down Motor Speed Lab

In this lab, we will make the motor speed change as the mode changes.

<iframe width="560" height="315" src="https://www.youtube.com/embed/32BwKwWviZs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

```py
# Motor Setup
# motors just barely turn at this power level
MIN_POWER_LEVEL = 10000
MAX_POWER_LEVEL = 65025
POWER_STEP = int((MAX_POWER_LEVEL - MIN_POWER_LEVEL) / 10)
# lower right pins with USB on top
RIGHT_FORWARD_PIN = 8
RIGHT_REVERSE_PIN = 9
LEFT_FORWARD_PIN = 11
LEFT_REVERSE_PIN = 10

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

def drive_speed(power_level):
    right_forward.duty_u16(power_level)
    left_forward.duty_u16(power_level)
```

In the main we have:

```py
power_level = MIN_POWER_LEVEL + mode * POWER_STEP
# turn off the motor if we are at mode 0
if mode == 0: power_level = 0
drive_speed(power_level)
```

## Full Program

```py
# Mode Up/Down Lab
# Change a mode using the buttons on the Maker Pi RP2040 board
# Changes the NeoPixel color and the blue GPIO status LEDs
import time
from machine import Pin, PWM
# We are using a MicroPython NeoPixel library from here: https://github.com/blaz-r/pi_pico_neopixel
from neopixel import Neopixel

BUZZER_PORT = 22
buzzer = PWM(Pin(BUZZER_PORT))

NUMBER_PIXELS = 2
STATE_MACHINE = 0
NEOPIXEL_PIN = 18

# The Neopixels on the Maker Pi RP2040 are the GRB variety, not RGB
strip = Neopixel(NUMBER_PIXELS, STATE_MACHINE, NEOPIXEL_PIN, "GRB")

# have up to 13 that we can use
blue_led_pins = [0,1,2,3,4,5,6,7,16,17,26,27,28]
number_leds = len(blue_led_pins)
led_ports = []
# create a list of the port pin object instances
for i in range(number_leds):
   led_ports.append(machine.Pin(blue_led_pins[i], machine.Pin.OUT))

# Color RGB values as tuples - needs some Gamma corrections
red = (255, 0, 0)
orange = (255, 60, 0) # Gamma corrected from G=128 to be less like yellow
yellow = (255, 150, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
indigo = (75, 0, 130) # purple?
violet = (138, 43, 226) # mostly pink
cyan = (0, 255, 255)
lightgreen = (100, 255, 100)
white = (128, 128, 128) # not too bright
color_names = ('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'cyan', 'lightgreen', 'white')
num_colors = len(color_names)
colors = (red, orange, yellow, green, blue, indigo, violet, cyan, lightgreen, white)

# set to be 1 to 100 for percent brightness
strip.brightness(100)

# Sample Raspberry Pi Pico MicroPython button press example with a debounce delay value of 200ms in the interrupt handler

# Motor Setup
# motors just barely turn at this power level
MIN_POWER_LEVEL = 10000
MAX_POWER_LEVEL = 65025
POWER_STEP = int((MAX_POWER_LEVEL - MIN_POWER_LEVEL) / 10)
# lower right pins with USB on top
RIGHT_FORWARD_PIN = 8
RIGHT_REVERSE_PIN = 9
LEFT_FORWARD_PIN = 11
LEFT_REVERSE_PIN = 10

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

def drive_speed(power_level):
    right_forward.duty_u16(power_level)
    left_forward.duty_u16(power_level)

mode = 0 # the default mode on powerup and reset
mode_count = len(color_names)
last_time = 0 # the last time we pressed the button

builtin_led = machine.Pin(25, Pin.OUT)
# Give our pins some logical names
next_mode_pin = machine.Pin(20, machine.Pin.IN, machine.Pin.PULL_DOWN)
previous_mode_pin = machine.Pin(21, machine.Pin.IN, machine.Pin.PULL_DOWN)

# This function gets called every time the button is pressed.  The parameter "pin" is not used.
def button_pressed_handler(pin):
    global mode, last_time, power_level
    new_time = time.ticks_ms()
    # if it has been more that 1/5 of a second since the last event, we have a new event
    if (new_time - last_time) > 200:
        # this should be pin.id but it does not work
        if '20' in str(pin):
            mode +=1
            # power_level += POWER_STEP
        else:
            mode -=1
            # power_level -= POWER_STEP
        # wrap around to first mode
        if mode >= mode_count: mode = 0
        if mode < 0: mode = mode_count - 1
        last_time = new_time

def set_blue_led_mode(mode):
    global num_colors
    for i in range(0, num_colors):
        if i == mode:
            led_ports[i].high()
        else:
            led_ports[i].low()

# Register the handler function when either button is pressed
next_mode_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)
previous_mode_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)

# non-linear increase is frequency - note that some are lowder
tone_freq = [100, 150, 210, 280, 350, 450, 580, 750, 850, 950, 1000]
def playtone(frequency):
    buzzer.duty_u16(1000)
    buzzer.freq(frequency)

def bequiet():
    buzzer.duty_u16(0)
    
# This is for only printing when a new button press count value happens
old_mode = -1

power_level = MIN_POWER_LEVEL
print('found ', mode_count, ' modes.')
while True:
    # only print on change in the button_presses value
    if mode != old_mode:
        print('new mode:', mode, color_names[mode], tone_freq[mode], power_level)
        # get the color mode
        color = colors[mode]
        strip.set_pixel(0, color)
        strip.set_pixel(1, color)
        strip.show()
        set_blue_led_mode(mode)
        playtone(tone_freq[mode])
        time.sleep(.2)
        bequiet()
        power_level = MIN_POWER_LEVEL + mode * POWER_STEP
        # turn off the motor if we are at mode 0
        if mode == 0: power_level = 0
        drive_speed(power_level)
        old_mode = mode
```


---


# Motor Drive Connection Test

## Built-In Motor Driver

The Maker Pi RP2040 board contains a MX1508 dual-channel H-bridge chip and easy-to-connect screw headers for power and motor connections.  This is fantastic for teaching robotics since students can driver two motors without ever having to use a soldering iron.

!!! Note that the is designed to work with small DC-hobby motors and there is no documentation on exactly what motor driver chip is used or its precise current and power limitations.

The documentation only indicates that the maximum current is 1A continuous power and 1.5A for up to 5 seconds.  The input voltage is only rated at 6 volts, which find for our standard 4 AA battery packs.

If this motor driver chip is similar to the ubiquitous [L293x motor controllers](https://www.ti.com/document-viewer/L293D/datasheet/specifications#ESD_Rating_1), and the current should be 1A per motor.

I suspect that if you glued a small [heat sink](https://en.wikipedia.org/wiki/Heat_sink) like a [16 pin DIP fin](https://my.element14.com/fischer-elektronik/ick-14-16-b/heat-sink-dip-glue-on-50-c-w/dp/4620896) to the unknown motor driver IC on the main board you could drive slightly larger motors.

![Maker Pi RP2040 Motor Driver Chip](../../img/maker-pi-rp2040-motor-driver.jpg)
Close-up of the motor driver chip.  I can't quite make out the numbers on the chip, but the logo is not "TI".
## Testing The Connections

In our standard robot, the M1 is the right wheel as you are looking from the top-back of the robot.  The M2 wheel is the left wheel.  I connect the red to the right of the two connectors and it is also the right terminal of the motors as you are looking from the rear.
 
Look at the buttons near the motor connectors.  Press the M1A button and verify that the right wheel
is moving forward.  Press the M1B and the motor should turn in reverse.  Similarly the M2B button should turn the left wheel forward and the M2A should turn the left wheel in reverse.  If you don't wire these connections the same way I did it is not a worry.  It is easy to change the code.

## Motor Pin Definitions

Now that we know what buttons control what motors and directions they turn, we are ready to define the pins that are associated with each robot movement.  We have four pin assignments: both forward and reverse for both the right and left motors.

```py
RIGHT_FORWARD_PIN = 8
RIGHT_REVERSE_PIN = 9
LEFT_FORWARD_PIN = 11
LEFT_REVERSE_PIN = 10
```

## Testing Your Pin Definitions

The following program is called our motor connection test.  It will turn each motor direction for three seconds and it will print out the motor and direction in the console.

```py
from machine import Pin, PWM
import time

POWER_LEVEL = 65025
# lower right pins with USB on top
RIGHT_FORWARD_PIN = 8
RIGHT_REVERSE_PIN = 9
LEFT_FORWARD_PIN = 11
LEFT_REVERSE_PIN = 10

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

def spin_wheel(pwm):
        pwm.duty_u16(POWER_LEVEL)
        time.sleep(3)
        pwm.duty_u16(0)
        time.sleep(2)

while True:
    print('right forward')
    spin_wheel(right_forward)

    print('right reverse')
    spin_wheel(right_reverse)

    print('left foward')
    spin_wheel(left_forward)

    print('left_reverse')
    spin_wheel(left_reverse)
```



---


# Drive Square Lab

## Prerequsites

This lab assumes you have your Maker Pi RP2040 mounted on a SmartCar chassis with two motors and a battery hooked up.

In this lab we will program our robot to drive in a square pattern. We will start out doing a "bench test" that will require you to put the robot up on a block so you can see the wheels turn, but it will not drive off your desktop.  You can also observe the red LED lights on the many board to see which motor direction is on.

The main loop will look like this:

```py
while True:
    forward()
    sleep(FWD_TIME)
    
    stop()
    sleep(STOP_TIME)
    
    turn_right()
    sleep(TURN_TIME)
    
    stop()
    sleep(STOP_TIME)
```

We will need to adjust the TURN_TIME parameter to have the robot turn 90 degrees.  A good value for most robots is about 1/2 second or sleep(.5).

Since we will be calling the sleep function many times we will use the following import format to keep our code tidy:

```py
from utime import sleep
```
This says that whenever we want to pause our system we just use the ```sleep(time)``` function we mean to use the sleep function in the micropython time library.  This keeps our code small and portable.


## Adding a Keyboard Interrupt Handler (Control-C)

It is also a problem that when we stop a program running that the PWM circuits keep generating signals, which means the robot keeps moving even after we press the STOP/RESET button.  To clean this up we will allow you to run a special cleanup handler that will add a function to set all the motors to off using the ```stop()``` function.

```py
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('Cleaning up')
    print('Powering down all motors now.')
    stop()
```

## Full Program

You are now ready to test the full program.  Save the following to the main.py file, disconnect the USB connector and turn on the power on the main board.  Your robot should not we driving in a square!

```py
from machine import Pin, PWM
from utime import sleep

POWER_LEVEL = 65025
# lower right pins with USB on top
RIGHT_FORWARD_PIN = 8
RIGHT_REVERSE_PIN = 9
LEFT_FORWARD_PIN = 11
LEFT_REVERSE_PIN = 10

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

FWD_TIME = 2
TURN_TIME = .5 # adjust this to get the turn to be 90 degrees
STOP_TIME = 2

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))


def turn_motor_on(pwm):
   pwm.duty_u16(POWER_LEVEL)

def turn_motor_off(pwm):
   pwm.duty_u16(0)

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

print('Running Drive Square Lab')
print('Use Control-C to Stop All Motors')

def main():
    while True:
        print('forward')
        forward()
        sleep(FWD_TIME)
        
        print('stop')
        stop()
        sleep(STOP_TIME)
        
        print('turning right')
        turn_right()
        sleep(TURN_TIME)
        
        print('stop')
        stop()
        sleep(STOP_TIME)
    
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('Cleaning up')
    print('Powering down all motors now.')
    stop()
```


---


# Maker Pi RP2040 Servo Lab

Servo motors are ideal for controlling the angle of an item such as a steering angle or the direction of a sensor.  The servos used in these labs are inexpensive SG90 micro-servos that draw very little power and are ideal for a teaching lab.  They can be purchased for about [$3 each US on eBay](https://www.ebay.com/sch/i.html?_from=R40&_nkw=SG90+micro+servos&_sacat=0&rt=nc&LH_BIN=1).  To control a 180 degree servo, you just tell it what angle you would like it to move to.  The range of values is typically -90 to 90 degrees with 0 being the nominal resting position for many applications such as the steering wheel angle of a car.

The Maker Pi RP2040 has four servo ports in the upper left corner of the board (with the USB on the bottom) that use ports GP12, GP13, GP14 and GP15.  You can connect any small micro servo directly to these ports.  Just make sure to get the polarity correct.  The colors for servos may vary somewhat, but the two most common standards are:

* Orange, red and brown - signal, positive and ground
* White, red, black - signal, positive and ground

The general rule is that the lighter colors of orange and white will be the signal and the brown and black will be ground.

## Servo Control

We will use the PWM functions in our MicroPython library to send a PWM signal to each of the servos.  Servos are not controlled by the duty cycle directly.  They are controlled by the width of the pulses.  But we can control the approximate with of the pulses by holding the frequency constant and changing the duty cycle.

We will use a 40 hertz signal to send a PWM signal to each of the servos like this.

```py
SERVO_FREQ_HZ = 40
# SERVO_PERIOD_MS = 1000 / SERVO_FREQ_HZ is a 25 millisecond pulse width
my_pwm.freq(SERVO_FREQ_HZ)
```


## Calibration of the Servo
There are small manufacturing variations in servos.  This means to get the full sweep of a 180% servo you have to adjust the duty cycle.

* Minimum duty cycle: 1700
* Maximum duty cycle: 6300

By some experimentation I got the following results
```py
SERVO_MIN_DUTY = 1725 # -90 degrees
SERVO_MAX_DUTY = 6378 # 90 degrees
```

We can use a linear mapping function to convert the angle (from -90 to 90):

```py
# This will take in integers of range in (min and max) return a integer in the output range (min and max)
# Used to convert one range of values into another using a linear function like the Arduino map() function
def convert(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) // (in_max - in_min) + out_min

angle = 0
duty = convert(angle, -90, 90, SERVO_MIN_DUTY, SERVO_MAX_DUTY)
print('For angle: ', angle, ' the duty is: ', duty)
pwm.duty_u16(duty)
```

## Checking your Servo Calibration with Buttons
We can also use the buttons on the Maker Pi RP2040 to verify that the extreme angles are correct.  One button will increase the angle and one will decrease the angle.

```py
# Maker Pi RP2040 program to check the limits of a 180 degree servo such as a SG90 micro servo
from machine import Pin, PWM
import time

BUTTON_1_PIN = 20 # increment the angle
BUTTON_2_PIN = 21 # decrement the angle

SERVO_1_PIN = 12
SERVO_2_PIN = 13 # MAX=5749@40
SERVO_3_PIN = 14
SERVO_4_PIN = 15
# this is ususlly standard across most servos
SERVO_FREQ_HZ = 40

pwm = PWM(Pin(SERVO_2_PIN))

# the two button on the Maker Pi RP2040
increment_angle_button_pin = machine.Pin(BUTTON_1_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)
decrement_angle_button_pin = machine.Pin(BUTTON_2_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)

     
#  return int( ( (0.0015*SERVO_FREQ_HZ) + ((angle/90) * (0.0005*SERVO_FREQ_HZ)) ) * 65535 )
# This will take in integers of range in (min and max) return a integer in the output range (min and max)
# Used to convert one range of values into another using a linear function like the Arduino map() function
def convert(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) // (in_max - in_min) + out_min

# globals
angle = -90
last_time = 0 # the last time we pressed the button

# if the pin is 20 then increment, else decement
def button_pressed_handler(pin):
    global angle, last_time
    new_time = time.ticks_ms()
    # if it has been more that 1/5 of a second since the last event, we have a new event
    if (new_time - last_time) > 200:
        # this should be pin.id but it does not work
        if '20' in str(pin):
            angle +=1
        else:
            angle -=1
        last_time = new_time
 # now we register the handler function when the button is pressed
increment_angle_button_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)
decrement_angle_button_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)

pwm.freq(SERVO_FREQ_HZ)
old_angle = -1

while True:
    # only print on change in the button_presses value
    if angle != old_angle:
        duty = ServoDuty(angle)
        print('new angle:', angle, 'duty: ', duty)
        pwm.duty_u16(duty)
        old_angle = angle
```

## Sample Sweep Code

```py
from machine import Pin, PWM
import time

BUTTON_1_PIN = 20
BUTTON_2_PIN = 21

SERVO_1_PIN = 12
SERVO_2_PIN = 13
SERVO_3_PIN = 14
SERVO_4_PIN = 15
SERVO_FREQ_HZ = 50
SERVO_MIN_DUTY = 1725
SERVO_MAX_DUTY = 6378
# this is ususlly standard across most servos
SERVO_FREQ_HZ = 40

pwm = PWM(Pin(SERVO_2_PIN))

# the two button on the Maker Pi RP2040
clock_button_pin = machine.Pin(BUTTON_1_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)
counter_clock_button_pin = machine.Pin(BUTTON_2_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)

# globals
angle = 90
last_time = 0 # the last time we pressed the button

def button_pressed_handler(pin):
    global angle, last_time
    new_time = time.ticks_ms()
    # if it has been more that 1/5 of a second since the last event, we have a new event
    if (new_time - last_time) > 200:
        # this should be pin.id but it does not work
        if '20' in str(pin):
            angle +=1
        else:
            angle -=1
        # wrap around to first mode
        if mode >= mode_count: mode = 0
        if mode < 0: mode = mode_count - 1
        last_time = new_time
        
# now we register the handler function when the button is pressed
clock_button_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)
counter_clock_button_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)      
#  return int( ( (0.0015*SERVO_FREQ_HZ) + ((angle/90) * (0.0005*SERVO_FREQ_HZ)) ) * 65535 )

# Thisw will take in integers of range in (min and max) return a integer in the output range (min and max)
# Used to convert one range of values into another using a linear function like the Arduino map() function
def convert(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) // (in_max - in_min) + out_min

# -90 should generate 1725
# 90 should generate 7973

old_angle = -1

pwm.freq(50)
while True:
    for angle in range(-90, 90):
        duty = convert(angle, -90, 90, SERVO_MIN_DUTY, SERVO_MAX_DUTY)
        print('angle:', angle, 'duty: ', duty)
        pwm.duty_u16(duty)
        old_angle = angle
        time.sleep(.01)
    for angle in range(90, -90, -1):
        duty = convert(angle, -90, 90, SERVO_MIN_DUTY, SERVO_MAX_DUTY)
        print('angle:', angle, 'duty: ', duty)
        pwm.duty_u16(duty)
        old_angle = angle
        time.sleep(.01)
```

## Shutting Down All Servos

```py
from machine import Pin, PWM
import time

SERVO_1_PIN = 12
SERVO_2_PIN = 13
SERVO_3_PIN = 14
SERVO_4_PIN = 15

print('shutting down all servos!')
for i in range(12, 16):
    print('Servo', i, 'shutting down')
    pwm1 = PWM(Pin(SERVO_1_PIN))
    pwm1.duty_u16(0)
```

## Adding Cleanup Code

PWM signals continue to be generated even after you do a STOP/RESET on your microcontroller.  This could drain batteries and wear out your servo motors.  To stop the servos from getting PWM signals you can add an interrupt to your code to catch these signals and set the PWM duty cycle back to zero. This

```py

```

## References

[MicroPython Reference Page](https://docs.micropython.org/en/latest/pyboard/tutorial/servo.html) - this page is not very helpful.  The implication is that servo controls are standardized across MicroPython system.  This does not appear to be the case.


---


# I2C Scanner Test

How do we know that our connection to the distance sensor is wired correctly?  The quick way to test this is to run a program called the I2C scanner.  It will return a list of all the devices it finds on the I2C bus.

We first run the I2C scanner program to verify that the sensor is connected correct and is responding to the I2C bus scan.

```py
import machine
# Pins on the Grove Connector 1 on the Maker Pi RP2040 are GP0 and GP1
sda=machine.Pin(0)
scl=machine.Pin(1)
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)
print("I2C device ID list:", i2c.scan())
```

This should return a list of the devices it finds.  If you just have the Time-of-Flight sensor it will look like this:

```
[41]
``

```py
device_id = i2c.scan()[0]
```

## Testing for the Time-of-Flight Sensor

```py
import machine
sda=machine.Pin(0)
scl=machine.Pin(1)
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)

# i2c.scan() returns a list of devices that have been found
# i2c.scan()[0] is the first device found
device_id = i2c.scan()[0]
print("Device found at decimal", device_id)

if device_id == 41:
    print("TEST PASS")
else:
    print("No device found at decimal 41")
    print("TEST FAIL")
```



---


# Time of Flight Distance Sensor Lab

In this lab we create a program that will show the distance measured by the Time-of-Flight sensor by printing the distance on the console and also displaying the distance on 11 blue LEDs.

First, make sure you have your driver for the Time-of-Flight sensor installed.

You can copy the code from [here](https://github.com/CoderDojoTC/micropython/blob/main/src/drivers/VL53L0X.py) and save it in the file VL53L0X.py.  Note the zero between the "L" and "X" in the file name, not the letter "O".

We use a non-linear distance scale as we get closer to an object.  We store the numbers of each LED and the distance it should change in a lists:

```py
blue_led_pins = [2, 3, 4,  5,  6,  7,  16, 17, 26, 27, 28]
dist_scale =    [2, 6, 10, 20, 30, 40, 50, 60, 80, 110, 150]
```

## Calibration

There are three numbers you can change when you calibrate the sensor:

```py
ZERO_DIST = 60 # The value of the sensor when an object is 0 CM away
MAX_DIST = 1200 # max raw distance we are able to read
SCALE_DIST = .3 # multiplier for raw to calibrated distance in CM
```

## Full Program

```py
# Demo for Maker Pi RP2040 board using the VL32L0X time of flight distance sensor
# Note the driver I used came from here: https://github.com/CoderDojoTC/micropython/blob/main/src/drivers/VL53L0X.py
# Perhaps derived from here: https://github.com/uceeatz/VL53L0X/blob/master/VL53L0X.py

# This demo makes the blue LEDs show the distance and prints the distance on the console
import machine
import time
import VL53L0X

sda=machine.Pin(0) # row one on our standard Pico breadboard
scl=machine.Pin(1) # row two on our standard Pico breadboard
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)
# print("Device found at decimal", i2c.scan())

# The Maker Pi RP2040 has 13 fantastic blue GPIO status LEDs which we can use 11
# The distance scale is non linear
# GP0 and GP1 will always be on since they are the I2C Data and Clock
blue_led_pins = [2, 3, 4,  5,  6,  7,  16, 17, 26, 27, 28]
dist_scale =    [2, 6, 10, 20, 30, 40, 50, 60, 80, 110, 150]
number_leds = len(blue_led_pins)
led_ports = []
delay = .05

# initial calibration parameters
ZERO_DIST = 60
MAX_DIST = 1200 # max raw distance we are able to read
SCALE_DIST = .3 # multiplier for raw to calibrated distance

# create a list of the ports
for i in range(number_leds):
   led_ports.append(machine.Pin(blue_led_pins[i], machine.Pin.OUT))

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)


# get the normalized time-of-flight distance
def get_distance():
    global zero_dist, scale_factor
    tof_distance = tof.read()
    if tof_distance > MAX_DIST:
        return tof_distance
    # if our current time-of-flight distance is lower than our zero distance then reset the zero distance
    if tof_distance < ZERO_DIST:
        zero_dist = tof_distance
    return  int((tof_distance - ZERO_DIST) * SCALE_DIST)

# use the dist_scale to turn on LEDs
def led_show_dist(in_distance):
    global number_leds
    for led_index in range(0, number_leds):
        if in_distance > dist_scale[led_index]:
            led_ports[led_index].high()
        else:
            led_ports[led_index].low()

print('Using', number_leds, ' blue leds to show distance.')

# blue up
for i in range(0, number_leds):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()
# blue down
for i in range(number_leds - 1, 0, -1):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()
    
# start our time-of-flight sensor
tof.start()
# autocalibrate the minimum distance
min_distance = 1000


# loop forever
while True:
    raw_distance = get_distance()
    # recalibrate if we have a new min distance
    if raw_distance < min_distance:
        min_distance = raw_distance
    calibrated_distance = raw_distance - min_distance
    print(raw_distance, calibrated_distance)
    led_show_dist(calibrated_distance)
    time.sleep(0.05)

# clean up
tof.stop()

```

## References

[Kevin McAleer's GitHub Repo on the Vl53lx0](https://github.com/kevinmcaleer/vl53lx0)
[Kevin McAleer's 662 line driver](https://github.com/kevinmcaleer/vl53lx0/blob/master/vl53l0x.py) - I am not sure we need all 662 lines of code.
[Kevin McAleer's Time of Flight Test](https://github.com/kevinmcaleer/vl53lx0/blob/master/tof_test.py)


---


# Ultrasonic Ping Sensor Lab

The Grove sensors on our Maker Pi RP2040 only supply 3.3 volts.  So the standard very popular low cost HC-SR04 will not work, since it requires 5 volts of power.  We have two options.  One is to get a separate 5V power source, but the other is to purchase the new HC-SR04**P** (for Pico?) sensor that will work with our 3.3 volt power on our Grove connector.

Using the Grove 4 connection wire the HC-SP04P sensor with the trigger on GPIO-16 (White cable) and the echo on GPIO-17 (Yellow cable),  VCC (Red cable), and GND (Black cable)

![Ultrasonic Sensor](../../img/HC-SP04P_Grove.jpg)

All wired up 

![Maker Pi RP2040 with sensor](../../img/Maker_Pi_RP2040-Ping.jpg)

```
# Sample code to test HC-SR04 Ultrasonice Ping Sensor
# Connect GND to any GND pin on the Pico
# Connnect VCC to VBUS or 5 Volt power

from machine import Pin, Timer
import utime

TRIGGER_PIN = 16 # With USB on the top, this pin is the bottom left corner
ECHO_PIN = 17 # One up from bottom left corner

# Init HC-SR04 pins
trigger = Pin(TRIGGER_PIN, Pin.OUT) # send trigger out to sensor
echo = Pin(ECHO_PIN, Pin.IN) # get the delay interval back

def ping():
    trigger.low()
    utime.sleep_us(2) # Wait 2 microseconds low
    trigger.high()
    utime.sleep_us(5) # Stay high for 5 miroseconds
    trigger.low()
    while echo.value() == 0:
        signaloff = utime.ticks_us()
    while echo.value() == 1:
        signalon = utime.ticks_us()
    timepassed = signalon - signaloff
    distance = (timepassed * 0.0343) / 2
    return distance

while True:
    print("Distance:", ping(), "cm")
    utime.sleep(.25)
    
```

More advanced version with sound

```
# Sample code to test HC-SR04 Ultrasonice Ping Sensor
# Connect GND to any GND pin on the Pico
# Connnect VCC to VBUS or 5 Volt power

from machine import Pin, Timer, PWM
import utime

TRIGGER_PIN = 16 # With USB on the top, this pin is the bottom left corner
ECHO_PIN = 17 # One up from bottom left corner

# Init HC-SR04 pins
trigger = Pin(TRIGGER_PIN, Pin.OUT) # send trigger out to sensor
echo = Pin(ECHO_PIN, Pin.IN) # get the delay interval back

BUZZER_PORT = 22
buzzer = PWM(Pin(BUZZER_PORT))

#  Note the non-linear increases in frequency - note that some are louder
tone_freq = [100, 150, 210, 280, 350, 450, 580, 750, 850, 950, 1000]
def playtone(frequency):
    buzzer.duty_u16(1000)
    buzzer.freq(frequency)

def bequiet():
    buzzer.duty_u16(0)

def ping():
    trigger.low()
    utime.sleep_us(2) # Wait 2 microseconds low
    trigger.high()
    utime.sleep_us(5) # Stay high for 5 miroseconds
    trigger.low()
    while echo.value() == 0:
        signaloff = utime.ticks_us()
    while echo.value() == 1:
        signalon = utime.ticks_us()
    timepassed = signalon - signaloff
    distance = (timepassed * 0.0343) / 2
    return distance

while True:
    dist=round(ping())
    print("Distance:", dist, "cm")
    if dist < 20:
        print("Panic")
        playtone(350)
        # Beep faster the closer you get
        utime.sleep(.05/(20/dist))
        bequiet()
    utime.sleep(.1)
    
```


## Link to Sample Ping Lab
This code is very similar to the previous ping lab but with the different GPIO lines used. 

[Link to Standard Ping Lab](../../sensors/03-ping.md)



---


# Time of Flight Distance Sensor Test

```py
# Demo for Maker Pi RP2040 board

from machine import Pin,PWM
import time
import VL53L0X
buzzer=PWM(Pin(22))

sda=machine.Pin(0) # row one on our standard Pico breadboard
scl=machine.Pin(1) # row two on our standard Pico breadboard
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)
# print("Device found at decimal", i2c.scan())

# The Maker Pi RP2040 has 13 fantastic blue GPIO status LEDs
blue_led_pins = [2, 3,  4,  5,  6,  7, 16, 17, 26, 27, 28]
# dist_scale =    [2, 4, 6, 8, 10, 13, 16, 20, 25, 35, 50, 75, 100]
dist_scale =    [2, 4, 6, 8, 10, 15, 20, 25, 50, 100, 150, 200, 300]

number_leds = len(blue_led_pins)
led_ports = []
delay = .05

# calibration parameters
zero_dist = 65 # distance measure when an object is about 1/2 cm away
max_dist = 350 # max distance we are able to read
scale_factor = .2

# create a list of the ports
for i in range(number_leds):
   led_ports.append(machine.Pin(blue_led_pins[i], machine.Pin.OUT))

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

# blue up
for i in range(0, number_leds):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()
# blue down
for i in range(number_leds - 1, 0, -1):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()

# get the normalized time-of-flight distance
def get_distance():
    global zero_dist, scale_factor
    tof_distance = tof.read()
    if tof_distance > max_dist:
        return tof_distance
    # if our current time-of-flight distance is lower than our zero distance then reset the zero distance
    if tof_distance < zero_dist:
        zero_dist = tof_distance
    return  int((tof_distance - zero_dist) * scale_factor)

def led_show_dist(in_distance):
    global number_leds
    for led_index in range(0, number_leds):
        if in_distance > dist_scale[led_index]:
            led_ports[led_index].high()
        else:
            led_ports[led_index].low()

def playtone(frequency):
    buzzer.duty_u16(1000)
    buzzer.freq(frequency)

def bequiet():
    buzzer.duty_u16(0)
    
def play_no_signal():
    playtone(100)
    time.sleep(0.1)
    bequiet()

def play_turn():
    playtone(500)
    time.sleep(0.1)
    bequiet()
    
# start our time-of-flight sensor
tof.start()
valid_distance = 1

# loop forever
def main():
    while True:
        global valid_distance
        distance = get_distance()
        if distance > 1000:
            # only print if we used to have a valid distance
            if valid_distance == 1:
                print('no signal')
                
            valid_distance = 0
        else:
            print(distance)
            if distance < 30:
                play_turn()
            valid_distance = 1
            led_show_dist(distance)
        time.sleep(0.05)

# clean up


# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard intrrup
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('turning off sound')
    buzzer.duty_u16(0)
    tof.stop()
```


---


# Maker Pi RP2040 Collision Avoidance Robot

This robot works very similar to our standard CoderDojo Collision Avoidance Robot but all the pins are now configured to use the connections on the Maker Pi RP2040 board.

The board is mounted on a SmartCar Chassis and Grove Connector 0 is used to connect to a Time-of-Flight distance sensor that is using the I2C bus.

## Random Turn Direction

```py
if dist < TURN_DIST:
    play_reverse()
    reverse()
    sleep(REVERSE_TIME)
    # half right and half left turns
    if urandom.random() < .5:
        turn_right()
        play_turn_right()
    else:
        turn_left()
        play_turn_left()
    sleep(TURN_TIME)
    forward()
```


```py
# Demo for Maker Pi RP2040 board

from machine import Pin,PWM
from time import sleep, sleep_ms
import urandom
import VL53L0X

# Piezo Buzzer is on GP22
buzzer=PWM(Pin(22))

# this is the max power level
POWER_LEVEL = 65025

# Motor Pins are A: 8,9 and B: 10,11
RIGHT_FORWARD_PIN = 8
RIGHT_REVERSE_PIN = 9
LEFT_FORWARD_PIN = 11
LEFT_REVERSE_PIN = 10

# our PWM objects
right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))


def turn_motor_on(pwm):
   pwm.duty_u16(65025)

def turn_motor_off(pwm):
   pwm.duty_u16(0)

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

# Time of flight sensor is on the I2C bus on Grove connector 0
sda=machine.Pin(0) # row one on our standard Pico breadboard
scl=machine.Pin(1) # row two on our standard Pico breadboard
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)
# print("Device found at decimal", i2c.scan())

# The Maker Pi RP2040 has 13 fantastic blue GPIO status LEDs
blue_led_pins = [2, 3,  4,  5,  6,  7, 16, 17, 26, 27, 28]
# dist_scale =    [2, 4, 6, 8, 10, 13, 16, 20, 25, 35, 50, 75, 100]
dist_scale =    [2, 4, 6, 8, 10, 15, 20, 25, 50, 100, 150, 200, 300]

number_leds = len(blue_led_pins)
led_ports = []
delay = .05

# calibration parameters
zero_dist = 65 # distance measure when an object is about 1/2 cm away
max_dist = 350 # max distance we are able to read
scale_factor = .2

# create a list of the ports
for i in range(number_leds):
   led_ports.append(machine.Pin(blue_led_pins[i], machine.Pin.OUT))

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

# blue up
for i in range(0, number_leds):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()
# blue down
for i in range(number_leds - 1, 0, -1):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()

# get the normalized time-of-flight distance
def get_distance():
    global zero_dist, scale_factor
    tof_distance = tof.read()
    if tof_distance > max_dist:
        return tof_distance
    # if our current time-of-flight distance is lower than our zero distance then reset the zero distance
    if tof_distance < zero_dist:
        zero_dist = tof_distance
    return  int((tof_distance - zero_dist) * scale_factor)

def led_show_dist(in_distance):
    global number_leds
    for led_index in range(0, number_leds):
        if in_distance > dist_scale[led_index]:
            led_ports[led_index].high()
        else:
            led_ports[led_index].low()

def playtone(frequency):
    buzzer.duty_u16(1000)
    buzzer.freq(frequency)

def bequiet():
    buzzer.duty_u16(0)
    
def play_no_signal():
    playtone(100)
    time.sleep(0.1)
    bequiet()

def play_turn():
    playtone(500)
    sleep(0.1)
    bequiet()
    
# start our time-of-flight sensor
tof.start()
valid_distance = 1

# loop forever
def main():
    global valid_distance
    while True:  
        distance = get_distance()
        if distance > 1000:
            # only print if we used to have a valid distance
            if valid_distance == 1:
                print('no signal')      
            valid_distance = 0
        else:
            print(distance)
            if distance < 30:
                play_turn()
                # back up for 1/2 second
                reverse()
                sleep(0.5)
                turn_right()
                sleep(0.75)
                forward()
            else:
                print('forward')
                forward()
            valid_distance = 1
            led_show_dist(distance)
        sleep(0.05)

# clean up


# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard intrrup
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('turning off sound')
    buzzer.duty_u16(0)
    print('powering down all motors')
    stop()
    print('stopping time of flight sensor')
    tof.stop()
```


---


# Maker Pi RP2040 Collision Avoidance Robot With Ping Sensor

This robot works very similar to our standard CoderDojo Collision Avoidance Robot but all the pins are now configured to use the connections on the Maker Pi RP2040 board.

The board is mounted on a SmartCar Chassis and Grove Connector 4 is used to connect
the ultrasonic ping sensor.  Connect the Trigger on white and Echo on yellow.  The black should be connected to GND and the Red is connected to the VCC which on the 

The robot has an initial mode of 0, which will run the blue LEDs and change colors on the Neopixels.  By pressing the on-board button you will start the collision avoidance program.

## Robot Parameters

There are four different robot parameters you can adjust.  They change the speed and distance before the robot backs up.  You can also adjust the time the robots goes into reverse and the time it turns.

```py
POWER_LEVEL = 35000 # max is 
TURN_DISTANCE = 20 # distance in cm we decide to turn - try 20
REVERSE_TIME = .4 # how long we backup
TURN_TIME = .4 # how long we turn
```
## Full Source Code

```py
# Demo for Maker Pi RP2040 board using Ping sensor
from machine import Pin, PWM, Timer
import utime
import urandom
from neopixel import Neopixel

# Adjust these parameters to tune the collision avoidance behavior

POWER_LEVEL = 35000
TURN_DISTANCE = 20 # distance we decide to turn - try 20
REVERSE_TIME = .4 # how long we backup
TURN_TIME = .4 # how long we turn

# startup mode is 0 - motors off and LEDs flashing
# mode 1 is slow
# mode 2 is medium
# mode 3 is fast
mode = 0

# Use the Grove 4 Connector and put trigger on white and echo on yellow
TRIGGER_PIN = 16 # With USB on the top, this pin is the bottom left corner
ECHO_PIN = 17 # One up from bottom left corner

# Init HC-SR04P pins
trigger = Pin(TRIGGER_PIN, Pin.OUT) # send trigger out to sensor
echo = Pin(ECHO_PIN, Pin.IN) # get the delay interval back

faster_pin = machine.Pin(20, machine.Pin.IN, machine.Pin.PULL_DOWN)
slower_pin = machine.Pin(21, machine.Pin.IN, machine.Pin.PULL_DOWN)

last_time = 0 # the last time we pressed the button

# This function gets called every time the button is pressed.  The parameter "pin" is not used.
def button_pressed_handler(pin):
    global mode, last_time
    new_time = utime.ticks_ms()
    # if it has been more that 1/5 of a second since the last event, we have a new event
    if (new_time - last_time) > 200:
        # this should be pin.id but it does not work
        if '20' in str(pin):
            mode +=1
        else:
            mode -=1
        # deal with ends
        if mode > 4: mode = 2
        if mode < 0: mode = 0
        last_time = new_time

# now we register the handler function when the button is pressed
faster_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)
slower_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)

# Piezo Buzzer is on GP22
buzzer=PWM(Pin(22))

MAX_POWER_LEVEL = 65025

MAX_DISTANCE = 100 # ignore anything above this

# Motor Pins are A: 8,9 and B: 10,11
RIGHT_FORWARD_PIN = 11
RIGHT_REVERSE_PIN = 10
LEFT_FORWARD_PIN = 9
LEFT_REVERSE_PIN = 8

# our PWM objects
right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

# returns distance in cm
def ping():
    print('in ping')
    trigger.low()
    utime.sleep_us(2) # Wait 2 microseconds low
    trigger.high()
    utime.sleep_us(5) # Stay high for 5 miroseconds
    trigger.low()
    while echo.value() == 0:
        signaloff = utime.ticks_us()
    print('echo is 1')
    while echo.value() == 1:
        signalon = utime.ticks_us()
    timepassed = signalon - signaloff
    distance = (timepassed * 0.0343) / 2
    print(distance)
    return int(distance)

def turn_motor_on(pwm):
   pwm.duty_u16(65025)

def turn_motor_off(pwm):
   pwm.duty_u16(0)

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

# The Maker Pi RP2040 has 13 fantastic blue GPIO status LEDs
# remove 16 and 17 since the are used for the ping sensor
blue_led_pins = [0, 1, 2, 3,  4,  5,  6,  7, 26, 27, 28]
# dist_scale =    [2, 4, 6, 8, 10, 13, 16, 20, 25, 35, 50, 75, 100]
dist_scale =    [2, 4, 6, 8, 10, 15, 20, 25, 50, 100, 150, 200, 300]

NUMBER_PIXELS = 2
STATE_MACHINE = 0
NEOPIXEL_PIN = 18

# The Neopixels on the Maker Pi RP2040 are the GRB variety, not RGB
strip = Neopixel(NUMBER_PIXELS, STATE_MACHINE, NEOPIXEL_PIN, "GRB")
strip.brightness(100)

number_leds = len(blue_led_pins)
led_ports = []
red = (255, 0, 0)
orange = (255, 60, 0) # Gamma corrected from G=128 to be less like yellow
yellow = (255, 150, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
indigo = (75, 0, 130) # purple?
violet = (138, 43, 226) # mostly pink
cyan = (0, 255, 255)
lightgreen = (100, 255, 100)
white = (128, 128, 128) # not too bright
pink = (255, 128, 128)
color_names = ('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'cyan', 'lightgreen', 'white')
num_colors = len(color_names)
colors = (red, orange, yellow, green, blue, indigo, violet, cyan, lightgreen, white, pink)

# create a list of the ports
for i in range(number_leds):
   led_ports.append(machine.Pin(blue_led_pins[i], machine.Pin.OUT))

LED_DELAY = .08
def run_lights():
    for i in range(0, number_leds):
        led_ports[i].high()
        strip.set_pixel(0, colors[i])
        strip.set_pixel(1, colors[i])
        strip.show()
        utime.sleep(LED_DELAY)
        led_ports[i].low()
    # blue down
    for i in range(number_leds - 1, 0, -1):
        led_ports[i].high()
        strip.set_pixel(0, colors[i])
        strip.set_pixel(1, colors[i])
        strip.show()
        utime.sleep(LED_DELAY)
        led_ports[i].low()

def led_show_dist(in_distance):
    global number_leds
    for led_index in range(0, number_leds):
        if in_distance > dist_scale[led_index]:
            led_ports[led_index].high()
        else:
            led_ports[led_index].low()

def play_no_signal():
    playnote(100, 0.1)
    sound_off()

def play_turn():
    playnote(500, .1)
    sound_off()

def setfreq(frequency):
    buzzer.freq(frequency)

def playnote(frequency, time):
    buzzer.duty_u16(1000)
    setfreq(frequency)
    utime.sleep(time)
    
def sound_off():
    buzzer.duty_u16(0)

def rest(time):
    buzzer.duty_u16(0)
    utime.sleep(time)
    
def play_startup():
    playnote(600, .2)
    rest(.05)
    playnote(600, .2)
    rest(.05)
    playnote(600, .2)
    rest(.1)
    playnote(800, .4)
    sound_off()
    
valid_distance = 1
# loop forever
def main():
    global valid_distance
    print("running main()")
    
    play_startup()
    
    while True:
        if mode == 0:
            stop()
            run_lights()
        else:
            distance = ping()
            print('Distance:', distance)
            if distance > MAX_DISTANCE:
                # only print if we used to have a valid distance
                if valid_distance == 1:
                    print('no signal')      
                valid_distance = 0
            else:
                print(distance)
                if distance < TURN_DISTANCE:
                    play_turn()
                    # back up for a bit
                    reverse()
                    utime.sleep(REVERSE_TIME)
                    # half right and half left turns
                    if urandom.random() < .5:
                        turn_right()
                    else:
                        turn_left()
                    utime.sleep(TURN_TIME)
                    forward()
                else:
                    print('forward')
                    forward()
                valid_distance = 1
                led_show_dist(distance)
            utime.sleep(0.05)

# clean up

# This allows us to stop the sound and motors when we do a Stop or Control-C which is a keyboard interrupt
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('turning off sound')
    buzzer.duty_u16(0)
    print('shutting motors down')
    stop()

```

## Experiments

1. Adjust the power level and the distance before turning.  See how these change the performance of the robot.
2. Adjust the angle of the ping sensor by gently heating the plexiglass holder.  How does this change the robot behavior?
3. Add additional modes that change the power and the turn distance.  You can have one mode for slow, one for medium and one for fast.
4. Change the Neopixel colors to indicate the distance to an object.
5. Change the pattern of the blue LEDs to indicate the distance to the object.


---


# MicroSwitch Robot using the Cytron Maker Pi RP2040

This robot was inspired by my friend, Michael York.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ui4kJgjIIuo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Microswitches can be purchased for [under $1](https://www.amazon.com/Twidec-Straight-Switch-Action-KW11-3Z04/dp/B07P4CJ8TV/ref=sr_1_3).  They can be mounted on the front of our robot.  When the robot hits a wall in front of it the switch will open (or close) and the robot controller can make the robot go in reverse or turn.

In the example below, we attached a stiff wire to the lever of the microswitch.

![](images/img_083_microswitch-bot-2.jpg)



In the example below, we connected three microswitches to the front of our robot.

![](images/img_076_microswitch-bot-1.jpg)

If the left switch is activated, the robot should turn to the right.  If the right switch is activated, the robot should go to the left.

This image shows how we used two of the Grove connectors to read in the values of the switches.

![](images/img_090_microswitch-bot-3.jpg)

## Testing Switches
The following code can be used to test your switches.  A line on the console prints out which of the three switches are activated using the pin ```value()``` function.

```py
from machine import Pin
from time import sleep

# GPIO is the internal built-in LED
led0 = Pin(0, Pin.OUT)
led1 = Pin(1, Pin.OUT)
led2 = Pin(2, Pin.OUT)

# input on the lower left of the Pico using a built-in pull-down resistor to keep the value from floating
middle_switch = Pin(7, Pin.IN, Pin.PULL_DOWN) 
right_switch = Pin(28, Pin.IN, Pin.PULL_DOWN)
left_switch = Pin(27, Pin.IN, Pin.PULL_DOWN)

while True:
    if middle_switch.value(): # if the value changes
        led0.on()
        print('middle')
    else: led0.off()

    if right_switch.value(): # if the value changes
        led1.on()
        print('right')
    else: led1.off()
    
    if left_switch.value(): # if the value changes
        led2.on()
        print('left')
    else: led2.off()
    sleep(.1)
```

## Sample Collision Avoidance Robot Code

```py
from machine import Pin, PWM
from time import sleep

# GPIO is the internal built-in LED
led0 = Pin(0, Pin.OUT)
led1 = Pin(1, Pin.OUT)
led2 = Pin(2, Pin.OUT)

# input on the lower left of the Pico using a built-in pull-down resistor to keep the value from floating
middle_switch = Pin(7, Pin.IN, Pin.PULL_DOWN) 
right_switch = Pin(28, Pin.IN, Pin.PULL_DOWN)
left_switch = Pin(27, Pin.IN, Pin.PULL_DOWN)

# Go slow to avoid bending wires
POWER_LEVEL = 25000 # max is 65000

# These values depend on motor wiring
RIGHT_FORWARD_PIN = 10
RIGHT_REVERSE_PIN = 11
LEFT_FORWARD_PIN = 9
LEFT_REVERSE_PIN = 8

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

def turn_motor_on(pwm):
   pwm.duty_u16(POWER_LEVEL)

def turn_motor_off(pwm):
   pwm.duty_u16(0)

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

def main():
    while True:
        if middle_switch.value(): # if the value changes
            print('middle')
            led0.on()
            reverse()
            sleep(1)
            turn_right()
            sleep(.75)
            forward()
        else:
            led0.off()
            forward()

        if right_switch.value(): # if the value changes
            print('right')
            led1.on()
            reverse()
            sleep(.75)
            turn_left()
            sleep(.5)
            forward()
        else:
            led1.off()
            forward()
        
        if left_switch.value(): # if the value changes
            led2.on()
            print('left')
            reverse()
            sleep(.75)
            turn_right()
            sleep(.5)
            forward()
        else:
            led2.off()
            forward()

print('middle', middle_switch.value())
print('left', left_switch.value())
print('right', right_switch.value())

try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('turning off sound')
    # sound_off()
    print('turning off motors')
    stop()

```


---


# Cytron Maker Pi RP2040 Ping Servo Meter Bot

This robot works very similar to our standard CoderDojo Collision Avoidance Robot.  However it adds a 180 degree servo to show the distance to the object in front of it.  It also uses a OLED display to present instructions and display the distance to the object.

This program was contributed by [Joe Glenn](https://www.linkedin.com/in/jeglenn/) for the Minneapolis Bakken Museum Droid December event in December 2021.

![](images/img_025_ping-servo-meter-bot.jpg)

## Test Servo

This program tests the servo by sweeping the angle from 0 to 180 and back.

```py
# servo sweep test
# Brown: GND
# Orange/Red : VCC
# Yellow: Signal
#
# Time for high level (Radio Shack Micro-servo @ 5V)
# 0.5 ms :   0 degree
# 1.0 ms :  45 degree
# 1.5 ms :  90 degree
# 2.0 ms : 135 degree
# 2.5 ms : 180 degree

from machine import Pin, PWM
from time import sleep

SERVO_PIN = 15
servoPin = PWM(Pin(SERVO_PIN))
servoPin.freq(50)

def servo(degrees):
    if degrees > 180: degrees=180
    if degrees < 0: degrees=0
    maxDuty=8000 # duty*100
    minDuty=2000 # duty*100
    #maxDuty=2000 # test
    #minDuty=8000 # test
    newDuty=minDuty+(maxDuty-minDuty)*(degrees/180)
    servoPin.duty_u16(int(newDuty))
        
while True:

  for degree in range(0,180,1):
    servo(degree)
    sleep(0.01)
    print("increasing -- "+str(degree))
    
  for degree in range(180, 0, -1):
    servo(degree)
    sleep(0.01)
    print("decreasing -- "+str(degree))
```

## Main Python Code

```py
# Demo for Maker Pi RP2040 board using Ping sensor, servo and i2c display

from machine import Pin, PWM, Timer
import utime
import urandom
from ssd1306 import SSD1306_I2C
from neopixel import Neopixel
from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import framebuf
import math
import utime
#
# Ping Sensor
# Use the Grove 4 Connector and put trigger on white and echo on yellow
#
PING_TRIGGER_PIN = 7 # GP7
PING_ECHO_PIN = 28 # GP28

#
# i2c OLED 128x32
#
OLED_SDA_PIN = 26 # GP26
OLED_SCL_PIN = 27 # GP27

#
# Servo
# GND: Brown
# VCC: Orange/Red
# GP15 Yellow: Signal
#
# Time for high level (Radio Shack Micro-servo @ 5V)
# 0.5 ms :   0 degree
# 1.0 ms :  45 degree
# 1.5 ms :  90 degree
# 2.0 ms : 135 degree
# 2.5 ms : 180 degree
SERVO_PIN = 15

# IQR Pins
FASTER_PIN = 20
SLOWER_PIN = 21

# built-in Buzzer
BUZZER_PIN = 22

# Adjust these parameters to tune the collision avoidance behavior

POWER_LEL = 35000
TURN_DISTANCE = 20 # distance we decide to turn - try 20
REVERSE_TIME = .4 # how long we backup
TURN_TIME = .4 # how long we turn

# startup mode is 0 - motors off and LEDs flashing
# mode 1 is slow
# mode 2 is medium
# mode 3 is fast
mode = 0

# Init HC-SR04P pins
trigger = Pin(PING_TRIGGER_PIN, Pin.OUT) # send trigger out to sensor
echo = Pin(PING_ECHO_PIN, Pin.IN) # get the delay interval back

faster_pin = machine.Pin(FASTER_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)
slower_pin = machine.Pin(SLOWER_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)

last_time = 0 # the last time we pressed the button

#
# DISPLAY STUFF
#
# Display Image & text on I2C driven ssd1306 OLED display 


WIDTH  = 128 # oled display width
HEIGHT = 32  # oled display height

# Explicit Method
sda=machine.Pin(OLED_SDA_PIN)
scl=machine.Pin(OLED_SCL_PIN)
i2c=machine.I2C(1,sda=sda, scl=scl, freq=40000) # 400k is too fast and has issues
print( 'i2c={:02X}'.format( i2c.scan()[0] ) )
#print(help(i2c))
#print(help(i2c.init))
#print(help(i2c.scan))
#print(help(i2c.start))
#print(help(i2c.stop))
#print(help(i2c.readinto))
#print(help(i2c.write))
#print(help(i2c.readfrom))
#print(help(i2c.readfrom_into))
#print(help(i2c.writeto))
#print(help(i2c.writevto))
#print(help(i2c.readfrom_mem))
#print(help(i2c.readfrom_mem_into))
#print(help(i2c.writeto_mem))
#exit

oled = SSD1306_I2C(128, 32, i2c)

# Raspberry Pi logo as 32x32 bytearray
buffer = bytearray(b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00|?\x00\x01\x86@\x80\x01\x01\x80\x80\x01\x11\x88\x80\x01\x05\xa0\x80\x00\x83\xc1\x00\x00C\xe3\x00\x00~\xfc\x00\x00L'\x00\x00\x9c\x11\x00\x00\xbf\xfd\x00\x00\xe1\x87\x00\x01\xc1\x83\x80\x02A\x82@\x02A\x82@\x02\xc1\xc2@\x02\xf6>\xc0\x01\xfc=\x80\x01\x18\x18\x80\x01\x88\x10\x80\x00\x8c!\x00\x00\x87\xf1\x00\x00\x7f\xf6\x00\x008\x1c\x00\x00\x0c \x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00")

# Load the raspberry pi logo into the framebuffer (the image is 32x32)
fb = framebuf.FrameBuffer(buffer, 32, 32, framebuf.MONO_HLSB)

def blk():
    oled.fill(0)
    oled.show()
    
def horiz(l,t,r,c):  # left, right , top
    n = r-l+1        # Horizontal line
    for i in range(n):
        oled.pixel(l + i, t, c)

def vert(l,t,b,c):   # left, top, bottom
    n = b-t+1        # Vertical line
    for i in range(n):
        oled.pixel(l, t+i,c)

def box(l,t,r,b,c):  # left, top, right, bottom
    horiz(l,t,r,c)   # Hollow rectangle
    horiz(l,b,r,c)
    vert(l,t,b,c)
    vert(r,t,b,c)
    
def ring2(cx,cy,r,c):   # Centre (x,y), radius, colour
    for angle in range(0, 90, 2):  # 0 to 90 degrees in 2s
        y3=int(r*math.sin(math.radians(angle)))
        x3=int(r*math.cos(math.radians(angle)))
        oled.pixel(cx-x3,cy+y3,c)  # 4 quadrants
        oled.pixel(cx-x3,cy-y3,c)
        oled.pixel(cx+x3,cy+y3,c)
        oled.pixel(cx+x3,cy-y3,c)

#print(help(oled.text()))
#print(help())
#help('modules')
#help(oled)
#help(oled.text)
#help(framebuf.FrameBuffer)
#help(framebuf.FrameBuffer.help())

# Clear the oled display in case it has junk on it.
oled.fill(0) # Black

# Blit the image from the framebuffer to the oled display
oled.blit(fb, 96, 0)

# Basic stuff
oled.text("Raspberry Pi",5,5)
oled.text("RP2040",5,15)
oled.text("press GP21",5,25)
oled.pixel(10,60,1)

#ring2(50,43,20,1)  # Empty circle             
# Finally update the oled display so the image & text is displayed
oled.show()
utime.sleep(1)


#
# Back to the motor control stuff. (sorry... i'm soppy today)
# 
# This function gets called every time the button is pressed.  The parameter "pin" is not used.
def button_pressed_handler(pin):
    global mode, last_time
    new_time = utime.ticks_ms()
    # if it has been more that 1/5 of a second since the last event, we have a new event
    if (new_time - last_time) > 200:
        # this should be pin.id but it does not work
        if '21' in str(pin):
            mode +=1
        else:
            mode -=1
        # deal with ends
        if mode > 4: mode = 2
        if mode < 0: mode = 0
        last_time = new_time

# now we register the handler function when the button is pressed
faster_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)
slower_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler = button_pressed_handler)

# Piezo Buzzer is on GP22
buzzer=PWM(Pin(BUZZER_PIN))

MAX_POWER_LEVEL = 65025

MAX_DISTANCE = 100 # ignore anything above this

# Motor Pins are A: 8,9 and B: 10,11
RIGHT_FORWARD_PIN = 11 # this must be wired backword?
RIGHT_REVERSE_PIN = 10 
LEFT_FORWARD_PIN = 9
LEFT_REVERSE_PIN = 8

# our PWM objects
right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

# returns distance in cm
def ping():
    #print('in ping')
    trigger.low()
    utime.sleep_us(2) # Wait 2 microseconds low
    trigger.high()
    utime.sleep_us(5) # Stay high for 5 miroseconds
    trigger.low()
    while echo.value() == 0:
        signaloff = utime.ticks_us()
    #print('echo is 1')
    while echo.value() == 1:
        signalon = utime.ticks_us()
    timepassed = signalon - signaloff
    distance = (timepassed * 0.0343) / 2
    print(distance)

    return int(distance)

def turn_motor_on(pwm):
   #pwm.duty_u16(65025)
   pwm.duty_u16(16000)

def turn_motor_off(pwm):
   pwm.duty_u16(0)

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

# The Maker Pi RP2040 has 13 fantastic blue GPIO status LEDs
blue_led_pins = [0, 1, 2, 3, 4, 5, 6, 7, 26, 27, 28]
blue_led_pins.remove(PING_TRIGGER_PIN)
blue_led_pins.remove(PING_ECHO_PIN)
blue_led_pins.remove(OLED_SDA_PIN)
blue_led_pins.remove(OLED_SCL_PIN)


# dist_scale =    [2, 4, 6, 8, 10, 13, 16, 20, 25, 35, 50, 75, 100]
dist_scale =    [2, 4, 6, 8, 10, 15, 20, 25, 50, 100, 150, 200, 300]

NUMBER_PIXELS = 2
STATE_MACHINE = 0
NEOPIXEL_PIN = 18

# The Neopixels on the Maker Pi RP2040 are the GRB variety, not RGB
strip = Neopixel(NUMBER_PIXELS, STATE_MACHINE, NEOPIXEL_PIN, "GRB")
strip.brightness(100)

number_leds = len(blue_led_pins)
led_ports = []
red = (255, 0, 0)
orange = (255, 60, 0) # Gamma corrected from G=128 to be less like yellow
yellow = (255, 150, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
indigo = (75, 0, 130) # purple?
violet = (138, 43, 226) # mostly pink
cyan = (0, 255, 255)
lightgreen = (100, 255, 100)
white = (128, 128, 128) # not too bright
pink = (255, 128, 128)
color_names = ('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'cyan', 'lightgreen', 'white')
num_colors = len(color_names)
colors = (red, orange, yellow, green, blue, indigo, violet, cyan, lightgreen, white, pink)

# create a list of the ports
for i in range(number_leds):
   led_ports.append(machine.Pin(blue_led_pins[i], machine.Pin.OUT))

LED_DELAY = .08
def run_lights():
    for i in range(0, number_leds):
        led_ports[i].high()
        strip.set_pixel(0, colors[i])
        strip.set_pixel(1, colors[i])
        strip.show()
        utime.sleep(LED_DELAY)
        led_ports[i].low()
    # blue down
    for i in range(number_leds - 1, 0, -1):
        led_ports[i].high()
        strip.set_pixel(0, colors[i])
        strip.set_pixel(1, colors[i])
        strip.show()
        utime.sleep(LED_DELAY)
        led_ports[i].low()

def led_show_dist(in_distance):
    global number_leds
    for led_index in range(0, number_leds):
        if in_distance > dist_scale[led_index]:
            led_ports[led_index].high()
        else:
            led_ports[led_index].low()

def play_no_signal():
    playnote(100, 0.1)
    sound_off()

def play_turn():
    playnote(500, .1)
    sound_off()

def setfreq(frequency):
    buzzer.freq(frequency)

def playnote(frequency, time):
    buzzer.duty_u16(1000)
    setfreq(frequency)
    utime.sleep(time)

def sound_off():
    buzzer.duty_u16(0)

def rest(time):
    buzzer.duty_u16(0)
    utime.sleep(time)

def play_startup():
    playnote(600, .2)
    rest(.05)
    playnote(600, .2)
    rest(.05)
    playnote(600, .2)
    rest(.1)
    playnote(800, .4)
    sound_off()

def servo(degrees):
    if degrees > 180: degrees=180
    if degrees < 0: degrees=0
    maxDuty=8000 # duty*100
    minDuty=2000 # duty*100
    #maxDuty=2000 # test
    #minDuty=8000 # test
    newDuty=minDuty+(maxDuty-minDuty)*(degrees/180)
    servoPin.duty_u16(int(newDuty))

servoPin = PWM(Pin(SERVO_PIN))
servoPin.freq(50)

valid_distance = 1

def main():
    global valid_distance
    print("running main()")

    play_startup()
    oled_count=0 # repeat every
    oled_count_max=0 # times through loop
    servo_count=0 
    servo_count_max=0 # when to update
    servo_degrees = 0
    servo(servo_degrees) # start in that pos
    
    # loop forever
    while True:
        if mode == 0:
            stop()
            run_lights()
        else:
            distance = ping()
            print('Distance:', distance)
            oled_count += 1
            if oled_count > oled_count_max:
                oled.fill(0) # Black
                oled.text("Distance:",5,5)
                oled.text("{:f}".format(distance),5,15)
                oled.show()
                oled_count = 0
            
            servo_count += 1
            if servo_count > servo_count_max:
                if distance > MAX_DISTANCE:
                    servo_degrees = 0
                else:
                    servo_degrees = 180-distance/MAX_DISTANCE*180
                servo(servo_degrees)
                servo_count = 0

            if distance > MAX_DISTANCE:
                # only print if we used to have a valid distance
                if valid_distance == 1:
                    print('no signal')      
                valid_distance = 0
            else:
                print(distance)
                #note=distance*10
                #playnote(note, .025)

                if distance < TURN_DISTANCE:
                    play_turn()
                    # back up for a bit
                    reverse()
                    utime.sleep(REVERSE_TIME)
                    # half right and half left turns
                    if urandom.random() < .5:
                        turn_right()
                    else:
                        turn_left()
                    utime.sleep(TURN_TIME)
                    forward()
                else:
                    print('forward')
                    forward()
                valid_distance = 1
                led_show_dist(distance)
            utime.sleep(0.05)

# clean up

# This allows us to stop the sound and motors when we do a Stop or Control-C which is a keyboard interrupt
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
except Exception as e: print(e)
finally:
    # Optional cleanup code
    print('turning off sound')
    buzzer.duty_u16(0)
    print('shutting motors down')
    stop()
```


---


# Line Follower Robot

<iframe width="560" height="315" src="https://www.youtube.com/embed/cmBz65zH0GQ?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Line following robot projects is a favorite project for our students.  They teach the students the concept of
feedback to keep a robot following a line on a track or on the floor.  They are not easy to get working
and require careful calibration of the sensor sensitivity and carefully adjusting the right and left motor
power to keep the robot on track.  Once the student gets the robot working it is a time for celebration!

The total cost of the kit is about $20.

## Parts List
|Part Name|Description|Price|Link|
|---------|-----------|-----|----|
|Cytron Board|Main board with RP2040 and motor driver. Kits come with Grove connectors and a screwdriver.|$12||
|SmartCar Chassis|SmartCar chassis with wheels and 4 AA battery pack||
|IR Sensors (2)|Low cost IR light sensors|$1||

## IR Sensors

![](../../img/ir-sensors.png)

We can purchase IR sensors on eBay for about $1 each in quantity 10.
The sensors send a digital 0/1 signal to the microcontroller depending on if they are over the line.
Our job is to write some MicroPython code to keep the robot following the line.
Each IR sensor has a small trim potentiometer that we must adjust for the correct sensitivity for each room. 

![](../../img/ir-sensor.jpeg)

Each IR sensor has a small trim potentiometer that we must adjust for the correct sensitivity for each room.  Some
of our rooms have a white floor with a black line and some
of our rooms have a dark floor with a white line.  You may have to
adjust both the trim potentiometer and the logic of the code for different situations.

Use the Grove connectors to hook up the IR sensors.  I used the red (VCC), black (GDN) and white wires (Data) and
I just cut off the yellow wires to keep them out of the way.  I then connected the Grove connectors
to ports 2 and 3 of the Cytron board.

I connected the motors to the **MOTOR 1** and **MOTOR 2** headers with a screwdriver and I hooked
the battery wires up to the power header of the board.

```py
from machine import Pin
from utime import sleep

RIGHT_SENSOR_PIN = 2
LEFT_SENSOR_PIN = 4

right_sensor = Pin(RIGHT_SENSOR_PIN)
left_sensor = Pin(LEFT_SENSOR_PIN)

while True:
    r = right_sensor.value()
    l = left_sensor.value()
    print("r", r, "l=", l)
    if r == 0:
        print("right over white")
    if l == 0:
        print("left over white")
    sleep(.2)
```

## Full Source Code

```py
from machine import Pin, PWM
from time import sleep

# sensor setup
RIGHT_SENSOR_PIN = 2
LEFT_SENSOR_PIN = 4

right_sensor = Pin(RIGHT_SENSOR_PIN)
left_sensor = Pin(LEFT_SENSOR_PIN)

# speaker pin on the Cytron Maker Pi RP2040
SPEAKER_PIN = 22
# create a Pulse Width Modulation Object on this pin
speaker = PWM(Pin(SPEAKER_PIN))
# set the duty cycle
speaker.duty_u16(1000)

# Motor setup
RIGHT_FORWARD_PIN = 11
RIGHT_REVERSE_PIN =10
LEFT_FORWARD_PIN = 8
LEFT_REVERSE_PIN = 9

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

MAX_POWER_LEVEL = 65025
QUARTER_POWER = 65025 >> 2
SLOW_DRIVE_POWER = 16000
BOOST_LEVEL = 15000

# while True:
def spin_wheel(pwm):
    pwm.duty_u16(SLOW_DRIVE_POWER)
    sleep(2)
    pwm.duty_u16(0)
    sleep(1)

def forward():
    right_forward.duty_u16(SLOW_DRIVE_POWER)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(SLOW_DRIVE_POWER)
    left_reverse.duty_u16(0)
    speaker.duty_u16(0)

def right():
    right_forward.duty_u16(SLOW_DRIVE_POWER - BOOST_LEVEL)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(SLOW_DRIVE_POWER + BOOST_LEVEL)
    left_reverse.duty_u16(0)
    speaker.duty_u16(1000)
    speaker.freq(800)

def left():
    right_forward.duty_u16(SLOW_DRIVE_POWER + BOOST_LEVEL)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(SLOW_DRIVE_POWER - BOOST_LEVEL)
    left_reverse.duty_u16(0)
    speaker.duty_u16(1000)
    speaker.freq(1000)

def stop():
    right_forward.duty_u16(0)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(0)
    left_reverse.duty_u16(0)
    speaker.duty_u16(0)
    
def main():
    while True:
        r = right_sensor.value()
        l = left_sensor.value()
        if r == 0 and l == 1:
            print("right over white - turning left")
            right()
        if l == 0:
            print("left over white")
            left()
        else:
            forward()
            
# end of main()

try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Cleanup code
    print('Cleaning up')
    print('Powering down all motors now.')
    stop()
```


---


# NeoPixel Blink Test

## Simple Blink Test

This program blinks the first pixel in a NeoPixel strip red.

```python
from machine import Pin
from utime import sleep
from neopixel import NeoPixel

NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    # turn first red pixel on for 1/2 second
    strip[0] = (255,0,0)
    strip.write()
    sleep(.5)

    # turn off for 1/2 second
    strip[0] = (0,0,0)
    strip.write()
    sleep(.5)
```

## Color Blink

This will make the first pixel blink red and the second pixel blink green.

```python
from machine import Pin
from utime import sleep
from neopixel import NeoPixel

NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2

strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

while True:
    # turn first [0] pixel red on for 1/2 second
    # use a red brightness of 10 out of 255 (r, g, b)
    strip[0] = (10,0,0)
    # turn the second pixel [1] green
    strip[1] = (0,10,0)
    # send data to the strip
    strip.write()
    # pause for 1/2 second
    sleep(.5)

    # turn both off for 1/2 second
    strip[0] = (0,0,0)
    strip[1] = (0,0,0)
    strip.write()
    sleep(.5)
```

## Color Wheel

Each pixel will slowly change color as they move around the color wheel.
The wheel function takes in a number from 0 to 255 and return the r,g and b
values as it walks around the color wheel.  See the [Moving Rainbow](https://dmccreary.github.io/moving-rainbow/lessons/05-color-wheel/) labs for details.

```python
import machine
from neopixel import NeoPixel
from utime import sleep

NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2

strip = NeoPixel(machine.Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

def wheel(pos):
    # Input a value 0 to 255 to get a color value.
    # The colors are a transition r - g - b - back to r.
    if pos < 0 or pos > 255:
        return (0, 0, 0)
    if pos < 85:
        return (255 - pos * 3, pos * 3, 0)
    if pos < 170:
        pos -= 85
        return (0, 255 - pos * 3, pos * 3)
    pos -= 170
    return (pos * 3, 0, 255 - pos * 3)

counter = 0
while True:
    # set the color moduo 255
    # start of color wheel
    strip[0] = wheel(counter % 255)
    # 1/2 way around the wheel
    strip[1] = wheel((counter + 128) % 255)
    strip.write()
    sleep(.05)
    counter += 1
    # reset the counter
    if counter == 255:
        counter = 0
```


---


 # Testing the Robot Speaker

This Python code is designed to make a small speaker or buzzer play different sounds! It's written for a microcontroller (like a Raspberry Pi Pico) that can control electronic components.

## What the Code Does

Think of this code like a simple music player that can play beeps and tones through a speaker. Here's how it works:

## The Setup

```python
from machine import Pin, PWM
from utime import sleep

SPEAKER_PIN = 22
speaker = PWM(SPEAKER_PIN)
```

This part imports the tools needed to control the hardware and sets up the speaker on pin 22 of the microcontroller. **PWM** stands for "Pulse Width Modulation" - it's a way to control how much power goes to the speaker, which affects the volume and tone.

## The Main Functions

**playnote(frequency, time)** - This is like pressing a key on a piano. The `frequency` determines how high or low the sound is (like different piano keys), and `time` determines how long the note plays.

**setfreq(frequency)** - This changes the pitch of the sound. Higher numbers make higher-pitched sounds, lower numbers make lower-pitched sounds.

**sound_off()** - This turns the speaker off completely, like lifting your finger off a piano key.

**rest(time)** - This creates silence for a specific amount of time, like a pause between musical notes.

## The Different Sound Effects

The code creates three different sound patterns:

**play_no_signal()** - Plays a very low, short beep (100 Hz for 0.1 seconds). This might be used to indicate something isn't working.

**play_turn()** - Plays a medium-pitched, quick beep (500 Hz for 0.1 seconds). This could be used when someone takes a turn in a game.

**play_startup()** - Plays a little melody: three quick medium beeps followed by a longer, higher beep. This sounds like something you'd hear when a device turns on.

## What Happens When You Run It

When you run this code, it automatically plays the startup sound - three quick beeps followed by a longer, higher-pitched tone. It's like the "power on" sound for whatever device this code is controlling.

## Real-World Comparison

This is similar to how your phone makes different notification sounds, or how a microwave beeps when it's done cooking. The code is creating these simple electronic sounds by rapidly turning the speaker on and off at different speeds (frequencies).

## Full Sample Code

 ```python
 from machine import Pin, PWM
from utime import sleep

SPEAKER_PIN = 22

speaker = PWM(SPEAKER_PIN)

def playnote(frequency, time):
    speaker.duty_u16(1000)
    setfreq(frequency)
    sleep(time)

def play_no_signal():
    playnote(100, 0.1)
    sound_off()

def play_turn():
    playnote(500, .1)
    sound_off()

def setfreq(frequency):
    speaker.freq(frequency)

def sound_off():
    speaker.duty_u16(0)

def rest(time):
    speaker.duty_u16(0)
    sleep(time)

def play_startup():
    playnote(600, .1)
    rest(.05)
    playnote(600, .1)
    rest(.05)
    playnote(600, .1)
    rest(.1)
    playnote(800, .5)
    sound_off()

play_startup()
```


---



## Display Robot

# Display Bot

![](images/img_056_display-robot.png)

One of the best ways to see what is going on in a STEM robot is to add
a small display.  One of our favorite displays is a 2.42" 128x64 OLED display.
Although it is not full color, it is large and bright enough that we can read the numbers while we are standing and the robot is on the floor.

[Display Setup](display-setup.md)

[Time of Flight Range Test](./tof-range-display-test.md)

[Displaying Distance Chart](./display-distance.md)





---


# Display Setup

There are two types of display connections.  One uses a four-wire I2C connection.  The other is a 7-wire SPI connection.  In this example we will use the 7-wire SPI interface.

## Creating a Display Cable

One of the first steps is to connect the OLED to the ports of the robot.  Here is a photo of the connections on the back of the OLED screen.

![](./oled-back.jpg)

On the right you will see the following connections from top to bottom:

| Label | Description |
| --- |  --- |
| CS | Chip Select (Slave Select) - Selects this device on the SPI bus |
| --- |  --- |
| DC | Data/Command - Indicates whether data being sent is a command (LOW) or display data (HIGH) |
| RES | Reset - Active LOW reset pin to initialize the display |
| SDA | Serial Data - SPI data line (MOSI) for sending data to the display |
| SCLK | Serial Clock - SPI clock signal for data synchronization |
| VDD | 3.3 to 5 volt power |
| VSS | Ground |

These pins represent the standard SPI interface for OLED displays:

- **CS** is pulled LOW to activate communication with this specific device
- **DC** switches between command mode (LOW) and data mode (HIGH)
- **RES** should be pulled LOW briefly during initialization to reset the display
- **SDA** carries the serial data from the microcontroller to the display (also known as MOSI - Master Out Slave In)
- **SCLK** carries the clock signal that synchronizes data transmission

We will connect wires to these connections.

![](images/img_011_display-harness-display-end.png)

## Cytron Display Connection

![](images/img_010_cytron-display-connection.jpg)

The Cytron uses a four pin Grove connector.  This can be used
to connect the power, ground, data and clock.  We can then use
the servo pins for the other three connections.

## Cytron ROBO PICO

![](images/img_007_cytron-pico-robot.jpg)

The Cytron PICO ROBOT has a female header that can be used to directly connect
the display cable.  You do not need to use any of the Grove connectors to 
connect the display.

## Testing the Display

After you have created your display cable you can test your display with the following code:

```python
import machine
import ssd1306

SCK=machine.Pin(2)
SDL=machine.Pin(3)
spi=machine.SPI(0,sck=SCK, mosi=SDL)
CS = machine.Pin(15)
DC = machine.Pin(14)
RES = machine.Pin(13)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

oled.fill(0)
oled.text('Hello World!', 0, 0)
oled.show()
```

Note this is an example of the `hardware` SPI interface.  There is also a software interface that includes the baudrate parameter.

Details on how the SSD1306 is used can be found on the [MicroPython Tutorial Docs Site](https://docs.micropython.org/en/latest/esp8266/tutorial/ssd1306.html) for the ESP.  The code will run the same on the RP2.




---


# Time of Flight Display Range Test

![](./time-of-flight-range-test.jpg)

We can use the display to track the range of of values being measured by the time-of-flight sensor.

The following program will track the current raw value but also remember the min and max values.  Note that a value of 8190 is used to indicate there was no signal.


```python
# Test program for VL53L0X
import time
from machine import Pin, I2C
import ssd1306
import VL53L0X

sda=machine.Pin(26)
scl=machine.Pin(27)
i2c=machine.I2C(1,sda=sda, scl=scl, freq=400000)

WIDTH = 128
HEIGHT = 64
SCK=machine.Pin(2)
SDL=machine.Pin(3)
spi=machine.SPI(0,baudrate=100000,sck=SCK, mosi=SDL)
# servo pins
RES = machine.Pin(13)
DC = machine.Pin(14)
CS = machine.Pin(15)
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

tof = VL53L0X.VL53L0X(i2c)

tof.start()
minimum = 1000
maximum = 0
while True:
    dist = tof.read()
    
    # store max if under 8191
    if dist > maximum: 
        if dist < 8190:
            maximum = dist
            
    # store min
    if dist < minimum: 
        minimum = dist
    print(tof.read())
    oled.fill(0)
    oled.text("Time of Flight", 0, 0)
    oled.text("Sensor", 3, 10)
    oled.text("Raw:" + str(dist), 0, 20)
    oled.text("Max:" + str(maximum), 0, 30)
    oled.text("Min:" + str(minimum), 0, 40)
    oled.show()
    time.sleep(0.05)

# tof.stop()
```


---


# Display Distance

![](images/img_009_dist-chart.jpg)

We can display the distance using a chart.  Here is the Python code
for this chart.

```python
# Display Time of Flight Distance Chart On OLED Display

from machine import Pin
from utime import sleep
import ssd1306
import VL53L0X
from neopixel import NeoPixel

TOF_DATA_PIN = 26
TOF_CLOCK_PIN = 27

sda=machine.Pin(TOF_DATA_PIN) # row one on our standard Pico breadboard
scl=machine.Pin(TOF_CLOCK_PIN) # row two on our standard Pico breadboard
i2c=machine.I2C(1, sda=sda, scl=scl, freq=400000)

WIDTH = 128
HEIGHT = 64
SCK=Pin(2)
SDL=Pin(3)
# servo pins
RES = machine.Pin(13)
DC = machine.Pin(14)
CS = machine.Pin(15)

spi=machine.SPI(0,baudrate=100000,sck=SCK, mosi=SDL)
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

def turn_motor_on(pwm):
   pwm.duty_u16(POWER_LEVEL)

delay = .05

# time of flight calibration parameters
zero_dist = 35 # distance measure when an object is about 1/2 cm away
max_dist = 500 # the max distance we gooing to display
scale_factor = .15

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)
tof.start()

# get the normalized time-of-flight distance
def get_distance():
    global zero_dist, scale_factor
    tof_distance = tof.read()
    if tof_distance > max_dist:
        return tof_distance
    # if our current time-of-flight distance is lower than our zero distance then reset the zero distance
    if tof_distance < zero_dist:
        zero_dist = tof_distance
    return  int((tof_distance - zero_dist) * scale_factor)

x = 0
def update_distance_chart(distance):
    global x
    print(distance)
    # put any values above 63
    if distance > 63:
        distance = 63
    oled.pixel(x, HEIGHT - int(distance) - 1, 1)
    # don't scroll until we get 61 samples
    if x > WIDTH - 3:
        oled.scroll(-1,0)
    else:
        x += 1
    oled.show()

mode = 0
# loop forever
def main():
    global valid_distance
    while True:
        distance = get_distance()
        update_distance_chart(distance)

# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard interrupt
print('Running Collision Avoidence with Time-of-Flight Sensor Version 3.0')

try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    print('turning off time-of-flight sensor')
    tof.stop()
```




---


# Display Face

We can use the OLED display to put a fun face on our robot.
We can do this by using the `ellipse()` function to draw
eyes and a mouth.

We have two functions.  One that is a basic face with no parameters.
The other version allows you to pass a parameter of the eye gaze
direction as a number between -25 (left) to 25 (right).

```python
# Display face with eye with gaze movement

from machine import Pin
from utime import sleep
import ssd1306
import VL53L0X
from neopixel import NeoPixel

WIDTH = 128
HEIGHT = 64
SCK=Pin(2)
SDL=Pin(3)
# servo pins
RES = machine.Pin(13)
DC = machine.Pin(14)
CS = machine.Pin(15)

spi=machine.SPI(0,baudrate=100000,sck=SCK, mosi=SDL)
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

HALF_HEIGHT = HEIGHT >> 1
QUARTER_HEIGHT = HALF_HEIGHT >> 1
HALF_WIDTH = WIDTH >> 1
QUARTER_WIDTH = HALF_WIDTH >> 1
ONE_THIRD_HEIGHT = int(HEIGHT/3)

# draw readability
ON = 1
OFF = 0
NO_FILL = 0
FILL = 1
phm = 18 # pupal horizontal movement range 
eye_dist_from_top = 21
eyeWidth = 27
eyeHeight = 10
mouth_vpos = 45
mouth_width = 40

def display_face_eye(i):
    oled.fill(0)

    # left eye
    oled.ellipse(32, eye_dist_from_top, eyeWidth, eyeHeight, ON, FILL)
    oled.ellipse(32+i, eye_dist_from_top, 5, 5, OFF, FILL)

    # right eye
    oled.ellipse(94, eye_dist_from_top, eyeWidth, eyeHeight, ON, FILL)
    oled.ellipse(94+i, eye_dist_from_top, 5, 5, OFF, FILL)

    # draw mouth
    # draw bottom half by doing a bitwise and of 8 and 4
    oled.ellipse(HALF_WIDTH, mouth_vpos, mouth_width, 10, ON, NO_FILL, 12)
    oled.show()

while True:
    display_face_eye(0)
    sleep(1)
    # look forward
    for i in range(0, 23):
        display_face_eye(i)
        sleep(0.05)
    # gaze to the right
    for i in range(23, -22, -1):
        display_face_eye(i)
        sleep(0.05)
    # gaze to the left
    for i in range(-22, 0):
        display_face_eye(i)
        sleep(0.05)
```


---



# Wireless Bot

# Wireless STEM Robot

![](images/img_002_wireless-stem-robot.jpg)

This robot uses the [Cytron Robo Pico](https://www.cytron.io/p-robo-pico-simplifying-robotics-with-raspberry-pi-pico) board that allows us to use a Raspberry Pi Pico W board as our microcontroller.  The "W" has builtin WiFi and Bluetooth hardware
so we can control our robot wirelessly.

## Cytron Robo Pico Pinout

![](images/img_034_cytron-robo-pico-pinout.png)

Note that the GPIO breakout female header allows us to connect our display cable directly to the board without using Grove connectors!

## Source Code

We can use the [base robot source code](https://github.com/dmccreary/stem-robots/tree/main/src/kits/base) as
a starting point for our wireless robot.

## MicroPython Wireless Functions

When you stop/restart Thonny you MUST make sure you have loaded the Pico "W" version of software.

```
MicroPython v1.25.0 on 2025-04-15; Raspberry Pi Pico W with RP2040
```

[Raspbeery Pi Pico MicroPython Wireless Functions](https://dmccreary.github.io/learning-micropython/basics/06-wireless/)

## Secrets File

Our WiFi connection stores the local wireless network name and password in a file called `secrets.py`.  It has the following format:

```python
SSID = "MY_WIFI_NETWORK_NAME"
PASSWORD = "MY_WIFI_PASSWORD"
```

Note that you should take steps to make sure the `secrets.py` file is not checked into public GitHub repositories.
The best way to do this is to add the following line to your .gitignore file:

```
secrets.py
```

This will work even though the file is at any level of the GitHub repository.

## Testing Your Secrets File

Once you have your `secrets.py` file configured you can test it with a simple "ping test" program

```python
import network
import secrets
from utime import sleep

print('Connecting to WiFi Network Name:', secrets.SSID)
wlan = network.WLAN(network.STA_IF)
wlan.active(True) # power up the WiFi chip
print('Waiting for wifi chip to power up...')
sleep(3) # wait three seconds for the chip to power up and initialize

wlan.connect(secrets.SSID, secrets.PASSWORD)
print('Waiting for access point to log us in.')
sleep(2)

if wlan.isconnected():
  print('Success! We have connected to your access point!')
  print('Try to ping the device at', wlan.ifconfig()[0])
else:
  print('Failure! We have not connected to your access point!  Check your secrets.py file for errors.')
```

Here is the Thonny console log when that prgram is running.

```
Connecting to WiFi Network Name: anndan
Waiting for wifi chip to power up...
Waiting for access point to log us in.
Success! We have connected to your access point!
Try to ping the device at 10.0.0.57
```

To test this you must open your Terminal application (or PowerSheel on Windows) and run the ping commend:

```sh
ping 10.0.0.57
```

Sample result:

```
PING 10.0.0.57 (10.0.0.57): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
64 bytes from 10.0.0.57: icmp_seq=1 ttl=255 time=2741.073 ms
64 bytes from 10.0.0.57: icmp_seq=2 ttl=255 time=1740.994 ms
64 bytes from 10.0.0.57: icmp_seq=3 ttl=255 time=740.691 ms
```

Note that your IP address might be different.  In this mode, ping will usually have three timeouts and then repond in about three seconds.  The is slow because the Raspberry Pi Pico is in a power saving mode by default.  It takes time to load the networking code into the WiFi chip.  We will fix this in the next labs.

## Ping Test Slow

In this lab we 

[Ping Test Slow Lab](./02-ping-test-slow.md)

## Ping Test Slow

[Ping Test Fast Lab](./03-ping-test-fast.md)

## Simple Web Server

[Simple Web Server Lab](./05-simple-web-server.md)

## References

[MicroPython Docs for the RP2 WiFi](https://docs.micropython.org/en/latest/rp2/quickref.html#networking)


---


# Ping Test

Here is a more detailed ping test program that will give use feedback.

## Source Code

```python
import network
import secrets
import time
from machine import Pin

# Optional: Use onboard LED for status indication
led = Pin("LED", Pin.OUT)

def blink_led(times=1, delay=0.2):
    """Blink the onboard LED for status indication"""
    for _ in range(times):
        led.on()
        time.sleep(delay)
        led.off()
        time.sleep(delay)

def connect_wifi(max_retries=10):
    """Connect to WiFi with retry logic"""
    print(f'Connecting to WiFi Network: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    print('Powering up WiFi chip...')
    time.sleep(3)
    
    retry_count = 0
    while retry_count < max_retries:
        try:
            print(f'Connection attempt {retry_count + 1}/{max_retries}')
            wlan.connect(secrets.SSID, secrets.PASSWORD)
            
            # Wait for connection with timeout
            timeout = 15  # seconds
            start_time = time.time()
            
            while not wlan.isconnected() and (time.time() - start_time) < timeout:
                time.sleep(1)
                print('.', end='')
            
            print()  # New line after dots
            
            if wlan.isconnected():
                return wlan
            else:
                print(f'Timeout on attempt {retry_count + 1}')
                retry_count += 1
                time.sleep(2)
                
        except Exception as e:
            print(f'Error on attempt {retry_count + 1}: {e}')
            retry_count += 1
            time.sleep(2)
    
    return None

def display_network_info(wlan):
    """Display detailed network information"""
    config = wlan.ifconfig()
    status = wlan.status()
    
    print('\n' + '='*50)
    print('NETWORK CONNECTION SUCCESSFUL!')
    print('='*50)
    print(f'IP Address:     {config[0]}')
    print(f'Subnet Mask:    {config[1]}')
    print(f'Gateway:        {config[2]}')
    print(f'DNS Server:     {config[3]}')
    print(f'WiFi Status:    {status}')
    print(f'Network SSID:   {secrets.SSID}')
    print('='*50)
    print(f'\nTo test connectivity, run this command on your computer:')
    print(f'ping {config[0]}')
    print('\nPress Ctrl+C to stop the program')
    print('='*50)

def keep_alive_loop(wlan):
    """Keep the device alive and monitor connection"""
    last_status_time = time.time()
    status_interval = 30  # Print status every 30 seconds
    
    try:
        while True:
            current_time = time.time()
            
            # Check if still connected
            if wlan.isconnected():
                # Blink LED to show device is alive
                blink_led(1, 0.1)
                
                # Print periodic status
                if current_time - last_status_time >= status_interval:
                    print(f'[{time.ticks_ms()}ms] Device alive - IP: {wlan.ifconfig()[0]}')
                    last_status_time = current_time
                    
            else:
                print('WiFi connection lost! Attempting to reconnect...')
                blink_led(3, 0.2)  # Fast blinks for error
                wlan = connect_wifi()
                if wlan:
                    display_network_info(wlan)
                else:
                    print('Failed to reconnect. Restarting in 10 seconds...')
                    time.sleep(10)
                    continue
            
            time.sleep(1)  # Short delay to prevent excessive CPU usage
            
    except KeyboardInterrupt:
        print('\nProgram stopped by user')
        led.off()
    except Exception as e:
        print(f'Unexpected error: {e}')
        blink_led(5, 0.1)  # Error indication

def main():
    """Main program function"""
    print('Raspberry Pi Pico W - Enhanced Ping Test')
    print('========================================')
    
    # Initial LED indication
    blink_led(2, 0.5)
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    if wlan:
        display_network_info(wlan)
        blink_led(3, 0.2)  # Success indication
        keep_alive_loop(wlan)
    else:
        print('\nFAILED TO CONNECT!')
        print('Check your secrets.py file for correct SSID and PASSWORD')
        print('Ensure your WiFi network is available and credentials are correct')
        blink_led(10, 0.1)  # Error indication

if __name__ == '__main__':
    main()
```

## Thonny Console

```
To test connectivity, run this command on your computer:
ping 10.0.0.57

Press Ctrl+C to stop the program
==================================================
[905892ms] Device alive - IP: 10.0.0.57
[935923ms] Device alive - IP: 10.0.0.57
[965953ms] Device alive - IP: 10.0.0.57
[995982ms] Device alive - IP: 10.0.0.57
```

## UNIX Ping

```
$ ping 10.0.0.57
PING 10.0.0.57 (10.0.0.57): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
64 bytes from 10.0.0.57: icmp_seq=1 ttl=255 time=2741.073 ms
64 bytes from 10.0.0.57: icmp_seq=2 ttl=255 time=1740.994 ms
64 bytes from 10.0.0.57: icmp_seq=3 ttl=255 time=740.691 ms
Request timeout for icmp_seq 6
64 bytes from 10.0.0.57: icmp_seq=4 ttl=255 time=3689.621 ms
64 bytes from 10.0.0.57: icmp_seq=5 ttl=255 time=2688.303 ms
64 bytes from 10.0.0.57: icmp_seq=6 ttl=255 time=1685.861 ms
64 bytes from 10.0.0.57: icmp_seq=7 ttl=255 time=683.353 ms
64 bytes from 10.0.0.57: icmp_seq=8 ttl=255 time=3668.818 ms
64 bytes from 10.0.0.57: icmp_seq=9 ttl=255 time=2670.315 ms
64 bytes from 10.0.0.57: icmp_seq=10 ttl=255 time=1670.126 ms
64 bytes from 10.0.0.57: icmp_seq=11 ttl=255 time=668.585 ms
64 bytes from 10.0.0.57: icmp_seq=12 ttl=255 time=3698.265 ms
64 bytes from 10.0.0.57: icmp_seq=13 ttl=255 time=2697.344 ms
64 bytes from 10.0.0.57: icmp_seq=14 ttl=255 time=1696.499 ms
64 bytes from 10.0.0.57: icmp_seq=15 ttl=255 time=693.715 ms
64 bytes from 10.0.0.57: icmp_seq=16 ttl=255 time=3641.492 ms
64 bytes from 10.0.0.57: icmp_seq=17 ttl=255 time=2640.483 ms
64 bytes from 10.0.0.57: icmp_seq=18 ttl=255 time=1637.462 ms
64 bytes from 10.0.0.57: icmp_seq=19 ttl=255 time=636.293 ms
^C
--- 10.0.0.57 ping statistics ---
24 packets transmitted, 19 packets received, 20.8% packet loss
round-trip min/avg/max/stddev = 636.293/2104.700/3698.265/1089.064 ms
```

No, this is not ideal since the average respons time is 3600 millisecond (3.6) seconds.
However, it's common for microcontrollers like the Pico W which by default goes into "deep sleep" between pings.

What you're seeing indicates the device is entering power-saving modes between network activity. Here's what's happening:

What Those Results Mean

1. **Initial Timeouts:** The Pico W was likely in a deep sleep or power-saving mode and took time to "wake up" to network requests.
2. **High Initial Latency:** The extremely high response times (3+ seconds) show the WiFi chip and network stack were initializing/waking up.

In our next lab we will Disable WiFi Power Management to get under 20 millisecond response times.


---


# Ping Test 2

Although having your device responed in three seconds may not be a problem for some
applications, for real-time control of a robot the delay is too long.  To get
a faster response, we need to add a single line of code that will remove the low-power option:

```python
# Disable power management for better ping responsiveness
wlan.config(pm=0xa11140)  # Disable WiFi power management
```

By default the wireless chip will active power-saving mode when it is idle, which might lead it to being less responsive. If
you are running a server or need more responsiveness, you can change this by toggling the power mode.

This is usually done immediatly after you make the WiFi chip active:

```python
import network

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.config(pm = 0xa11140)
```

## Full Source Code for Fast Ping

```python
import network
import secrets
import time
from machine import Pin

# Optional: Use onboard LED for status indication
led = Pin("LED", Pin.OUT)

def blink_led(times=1, delay=0.2):
    """Blink the onboard LED for status indication"""
    for _ in range(times):
        led.on()
        time.sleep(delay)
        led.off()
        time.sleep(delay)

def connect_wifi(max_retries=10):
    """Connect to WiFi with retry logic"""
    print(f'Connecting to WiFi Network: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    # Disable power management for better ping responsiveness
    wlan.config(pm=0xa11140)  # Disable WiFi power management
    
    print('Powering up WiFi chip...')
    time.sleep(3)
    
    retry_count = 0
    while retry_count < max_retries:
        try:
            print(f'Connection attempt {retry_count + 1}/{max_retries}')
            wlan.connect(secrets.SSID, secrets.PASSWORD)
            
            # Wait for connection with timeout
            timeout = 15  # seconds
            start_time = time.time()
            
            while not wlan.isconnected() and (time.time() - start_time) < timeout:
                time.sleep(1)
                print('.', end='')
            
            print()  # New line after dots
            
            if wlan.isconnected():
                return wlan
            else:
                print(f'Timeout on attempt {retry_count + 1}')
                retry_count += 1
                time.sleep(2)
                
        except Exception as e:
            print(f'Error on attempt {retry_count + 1}: {e}')
            retry_count += 1
            time.sleep(2)
    
    return None

def display_network_info(wlan):
    """Display detailed network information"""
    config = wlan.ifconfig()
    status = wlan.status()
    
    print('\n' + '='*50)
    print('NETWORK CONNECTION SUCCESSFUL!')
    print('='*50)
    print(f'IP Address:     {config[0]}')
    print(f'Subnet Mask:    {config[1]}')
    print(f'Gateway:        {config[2]}')
    print(f'DNS Server:     {config[3]}')
    print(f'WiFi Status:    {status}')
    print(f'Network SSID:   {secrets.SSID}')
    print(f'Power Mgmt:     DISABLED (for better ping response)')
    print('='*50)
    print(f'\nTo test connectivity, run this command on your computer:')
    print(f'ping {config[0]}')
    print('\nExpected ping response: <50ms (much improved!)')
    print('Press Ctrl+C to stop the program')
    print('='*50)

def keep_alive_loop(wlan):
    """Keep the device alive and monitor connection with active networking"""
    last_status_time = time.time()
    status_interval = 10  # Print status every 10 seconds
    ping_counter = 0
    
    try:
        while True:
            current_time = time.time()
            
            # Check if still connected
            if wlan.isconnected():
                # Blink LED to show device is alive
                blink_led(1, 0.05)
                
                # Print periodic status with ping counter
                if current_time - last_status_time >= status_interval:
                    ping_counter += 1
                    print(f'[Alive #{ping_counter}] IP: {wlan.ifconfig()[0]} - Ready for ping')
                    last_status_time = current_time
                    
            else:
                print('WiFi connection lost! Attempting to reconnect...')
                blink_led(3, 0.2)  # Fast blinks for error
                wlan = connect_wifi()
                if wlan:
                    display_network_info(wlan)
                else:
                    print('Failed to reconnect. Restarting in 10 seconds...')
                    time.sleep(10)
                    continue
            
            time.sleep(0.1)  # Very short delay to keep system responsive
            
    except KeyboardInterrupt:
        print('\nProgram stopped by user')
        led.off()
    except Exception as e:
        print(f'Unexpected error: {e}')
        blink_led(5, 0.1)  # Error indication

def main():
    """Main program function"""
    print('Raspberry Pi Pico W - Enhanced Ping Test')
    print('========================================')
    
    # Initial LED indication
    blink_led(2, 0.5)
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    if wlan:
        display_network_info(wlan)
        blink_led(3, 0.2)  # Success indication
        keep_alive_loop(wlan)
    else:
        print('\nFAILED TO CONNECT!')
        print('Check your secrets.py file for correct SSID and PASSWORD')
        print('Ensure your WiFi network is available and credentials are correct')
        blink_led(10, 0.1)  # Error indication

if __name__ == '__main__':
    main()
```

## Sample Thonny Console

```
==================================================
IP Address:     10.0.0.57
Subnet Mask:    255.255.255.0
Gateway:        10.0.0.1
DNS Server:     75.75.75.75
WiFi Status:    3
Network SSID:   YOUR_SSID
Power Mgmt:     DISABLED (for better ping response)
==================================================
```

## Sample Ping Response

```
$ ping 10.0.0.57
PING 10.0.0.57 (10.0.0.57): 56 data bytes
Request timeout for icmp_seq 0
64 bytes from 10.0.0.57: icmp_seq=1 ttl=255 time=16.394 ms
64 bytes from 10.0.0.57: icmp_seq=2 ttl=255 time=14.642 ms
64 bytes from 10.0.0.57: icmp_seq=3 ttl=255 time=14.630 ms
64 bytes from 10.0.0.57: icmp_seq=4 ttl=255 time=7.264 ms
64 bytes from 10.0.0.57: icmp_seq=5 ttl=255 time=19.538 ms
64 bytes from 10.0.0.57: icmp_seq=6 ttl=255 time=17.745 ms
^C
--- 10.0.0.57 ping statistics ---
7 packets transmitted, 6 packets received, 14.3% packet loss
round-trip min/avg/max/stddev = 7.264/15.036/19.538/3.877 ms
```

Note that the average is now about 19 milliseconds!

## What We Achieved

**Before**: 3+ second delays, multiple timeouts, inconsistent performance
**After**: Consistent 7-19ms response times with just one initial timeout

## The Results Breakdown

**Single Initial Timeout**: This is normal - the very first ping packet sometimes gets lost while the network stack finishes initializing. This is much better than the multiple timeouts you had before.

**Consistent Sub-20ms Latency**: Your 7-19ms range is excellent for a microcontroller! For comparison:
- Typical PC WiFi devices on local network: 5-10ms
- Raspberry Pi Pico W: 10-30ms (now achieved!)
- Previous version: 1000-3000ms (terrible!)

**Stable Performance**: No more wake-up delays - the device stays responsive to all subsequent pings.

## Why This Worked

The `wlan.config(pm=0xa11140)` command disabled WiFi power management, preventing the chip from:
- Entering deep sleep between packets
- Taking seconds to wake up from power-saving modes
- Causing those massive latency spikes

Your Pico W is now behaving like a proper network device that's always ready to respond. This makes it suitable for applications that need reliable network connectivity, like IoT sensors, web servers, or remote monitoring systems.

Perfect for any project where you need dependable network responsiveness!

## References

[Connecting to the Internet with Raspberry Pi Pico W-series](https://datasheets.raspberrypi.com/picow/connecting-to-the-internet-with-pico-w.pdf) - documentation by the Raspberry Pi Foundation


---


# Simple Web Server



![](./simple-web-ui.png)

# Simple LED Web Server - Code Walkthrough

## Introduction

This tutorial explains how to create a web server on a Raspberry Pi Pico W that can control an LED through a web page. Think of it like creating your own mini-website that can control real hardware!

## What You'll Learn

- How to connect your Pico W to WiFi
- How to create a simple web server
- How to control hardware (LED) from a webpage
- Basic Python programming concepts

## Prerequisites

- You need a `secrets.py` file with your WiFi credentials:

```python
SSID = "YourWiFiName"
PASSWORD = "YourWiFiPassword"
```

## Section 1: Importing Libraries

```python
import network
import socket
import secrets
import time
from machine import Pin
```

**What's happening here?**

**`import`** statements tell Python to load special tools (called libraries) that we need:

- **`network`** - Tools for connecting to WiFi
- **`socket`** - Tools for creating web servers (like a mailbox for internet messages)
- **`secrets`** - Your WiFi password file (keeps it separate and safe)
- **`time`** - Tools for waiting and timing
- **`Pin`** - From the `machine` library, this controls the physical pins on your Pico W

Think of imports like getting tools from a toolbox - you only take out what you need for the job.

## Section 2: Setting Up the LED

```python
# Setup the onboard LED
led = Pin("LED", Pin.OUT)
led_state = False  # Track LED state
```

**What's happening here?**

**`led = Pin("LED", Pin.OUT)`** - This creates a connection to the built-in LED on your Pico W
- **"LED"** tells it which pin to use (the built-in one)
- **Pin.OUT** means we want to control it (send signals OUT to it)

**`led_state = False`** - This creates a variable to remember if the LED is on or off
- **`False`** means "off" 
- **`True`** would mean "on"
- This is like a sticky note that says "remember: LED is currently off"

## Section 3: Connecting to WiFi

```python
def connect_wifi():
    """Connect to WiFi network using credentials from secrets.py"""
    print(f'Connecting to WiFi: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(secrets.SSID, secrets.PASSWORD)
    
    # Wait for connection
    while not wlan.isconnected():
        print('.', end='')
        time.sleep(1)
    
    print(f'\nConnected! IP: {wlan.ifconfig()[0]}')
    return wlan
```

**What's happening here?**

**`def connect_wifi():`** - This creates a function (a reusable block of code) called `connect_wifi`
- Functions are like recipes - you write them once, then use them whenever needed

**`print(f'Connecting to WiFi: {secrets.SSID}')`** - Shows which network we're connecting to
- **`f'...'`** is called an f-string - it lets you put variables inside text
- **`secrets.SSID`** gets your network name from the secrets file

**`wlan = network.WLAN(network.STA_IF)`** - Creates a WiFi object
- Think of this like turning on your phone's WiFi

**`wlan.active(True)`** - Turns on the WiFi radio
**`wlan.connect(secrets.SSID, secrets.PASSWORD)`** - Attempts to connect using your credentials

**The while loop:**

```python
while not wlan.isconnected():
    print('.', end='')
    time.sleep(1)
```
- **`while`** means "keep doing this as long as..."
- **`not wlan.isconnected()`** means "as long as we're NOT connected"
- **`print('.', end='')`** prints a dot without going to a new line
- **`time.sleep(1)`** waits 1 second
- This creates the "Connecting..." dots you see

**`return wlan`** - Gives back the WiFi object so other parts of the code can use it

## Section 4: Controlling the LED

```python
def toggle_led():
    """Toggle the LED on/off and return current state"""
    global led_state
    led_state = not led_state
    
    if led_state:
        led.on()
        print("LED turned ON")
    else:
        led.off()
        print("LED turned OFF")
    
    return "ON" if led_state else "OFF"
```

**What's happening here?**

**`global led_state`** - This tells Python we want to change the `led_state` variable we created earlier
- Without `global`, Python would create a new, separate variable

**`led_state = not led_state`** - This flips the state
- If `led_state` was `False`, **`not False`** becomes `True`
- If `led_state` was `True`, **`not True`** becomes `False`
- It's like a light switch - if it's off, turn it on; if it's on, turn it off

**The if/else statement:**
```python
if led_state:
    led.on()
    print("LED turned ON")
else:
    led.off()
    print("LED turned OFF")
```
- **`if led_state:`** means "if led_state is True"
- **`led.on()`** physically turns the LED on
- **`else:`** means "otherwise" (if led_state is False)
- **`led.off()`** physically turns the LED off

**`return "ON" if led_state else "OFF"`** - This is a shortcut way to return text
- If `led_state` is `True`, return `"ON"`
- If `led_state` is `False`, return `"OFF"`


## Section 5: Creating the Web Page

```python
def generate_html():
    """Create simple HTML page with LED toggle button"""
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>LED Control</title>
</head>
<body>
    <h1>Simple LED Control</h1>
    <p>LED Status: <strong>{toggle_led.__globals__['led_state'] and "ON" or "OFF"}</strong></p>
    <button onclick="toggleLED()">Toggle LED</button>
    
    <script>
        function toggleLED() {{
            fetch('/toggle', {{method: 'POST'}})
            .then(() => location.reload());
        }}
    </script>
</body>
</html>"""
    return html
```

**What's happening here?**

**`html = f"""..."""`** - Creates a multi-line string containing HTML code
- **`f"""..."""`** lets us put Python variables inside the HTML
- HTML is the language used to create web pages

**Key HTML parts:**
- **`<title>LED Control</title>`** - Sets the browser tab title
- **`<h1>Simple LED Control</h1>`** - Creates a big heading
- **`<p>LED Status: <strong>...</strong></p>`** - Shows the current LED status
- **`<button onclick="toggleLED()">Toggle LED</button>`** - Creates a clickable button

**The JavaScript part:**
```javascript
function toggleLED() {
    fetch('/toggle', {method: 'POST'})
    .then(() => location.reload());
}
```
- This runs when someone clicks the button
- **`fetch('/toggle', {method: 'POST'})`** sends a message to our server
- **`.then(() => location.reload())`** refreshes the page after the LED toggles


## Section 6: The Web Server

```python
def start_server(wlan):
    """Start web server and handle requests"""
    # Create socket and bind to port 80
    s = socket.socket()
    s.bind(('0.0.0.0', 80))
    s.listen(1)
    
    print(f'Web server running at: http://{wlan.ifconfig()[0]}')
    
    while True:
        # Accept incoming connection
        client, addr = s.accept()
        print(f'Client connected: {addr}')
        
        # Read the request
        request = client.recv(1024).decode('utf-8')
        
        if 'GET / ' in request:
            # Serve main page
            html = generate_html()
            client.send('HTTP/1.1 200 OK\r\n\r\n')
            client.send(html)
            
        elif 'POST /toggle' in request:
            # Toggle LED and send response
            state = toggle_led()
            client.send('HTTP/1.1 200 OK\r\n\r\n')
            client.send(f'LED is {state}')
        
        client.close()
```

**What's happening here?**

**Setting up the server:**
```python
s = socket.socket()
s.bind(('0.0.0.0', 80))
s.listen(1)
```
- **`socket.socket()`** creates a "mailbox" for internet messages
- **`s.bind(('0.0.0.0', 80))`** says "listen on all network connections, port 80"
- Port 80 is the standard port for websites
- **`s.listen(1)`** says "allow 1 person to connect at a time"

**The main server loop:**
```python
while True:
    # This runs forever, handling one visitor at a time
```

**Handling visitors:**
```python
client, addr = s.accept()
print(f'Client connected: {addr}')
request = client.recv(1024).decode('utf-8')
```
- **`s.accept()`** waits for someone to visit our website
- **`client.recv(1024)`** reads their request (what page they want)
- **`.decode('utf-8')`** converts the message to readable text

**Understanding the request:**
```python
if 'GET / ' in request:
    # Someone wants to see the main page
    html = generate_html()
    client.send('HTTP/1.1 200 OK\r\n\r\n')
    client.send(html)
    
elif 'POST /toggle' in request:
    # Someone clicked the toggle button
    state = toggle_led()
    client.send('HTTP/1.1 200 OK\r\n\r\n')
    client.send(f'LED is {state}')
```

- **`GET /`** means "show me the main page"
- **`POST /toggle`** means "toggle the LED"
- **`HTTP/1.1 200 OK`** is like saying "Everything's fine, here's what you asked for"

**`client.close()`** - Ends the conversation with that visitor


## Section 7: The Main Program

```python
def main():
    """Main program - connect to WiFi and start server"""
    print('Simple LED Web Server')
    print('====================')
    
    # Turn off LED initially
    led.off()
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    # Start web server
    start_server(wlan)

# Run the program
if __name__ == '__main__':
    main()
```

**What's happening here?**

**`def main():`** - Creates the main function that runs our program

**`led.off()`** - Makes sure the LED starts in the "off" position

**`wlan = connect_wifi()`** - Calls our WiFi function and saves the result

**`start_server(wlan)`** - Starts the web server (this runs forever)

**`if __name__ == '__main__':`** - This is Python's way of saying "if this file is being run directly (not imported), then run the main() function"


## How Everything Works Together

1. **Startup:** Program turns off LED and connects to WiFi
2. **Server starts:** Creates a "mailbox" at your Pico's IP address
3. **Waiting:** Server waits for someone to visit the website
4. **Visitor arrives:** Someone types the IP address in their browser
5. **Send webpage:** Server sends the HTML page with the button
6. **Button clicked:** Visitor clicks "Toggle LED"
7. **Message sent:** Browser sends a "toggle" message to the server
8. **LED changes:** Server runs the toggle function, changing the LED
9. **Response sent:** Server tells the browser "LED is now ON/OFF"
10. **Page refreshes:** Browser reloads to show the new status
11. **Repeat:** Back to step 5, ready for the next click

## Key Programming Concepts You Learned

**Variables:** Storing information (like `led_state`)

**Functions:** Reusable blocks of code (like `toggle_led()`)

**Loops:** Repeating actions (`while` loops)

**Conditionals:** Making decisions (`if/else` statements)

**Libraries:** Using pre-written code (`import` statements)

**Global variables:** Sharing data between functions

**Return values:** Functions giving back results

**String formatting:** Putting variables in text (`f"..."`)

## Real-World Applications

This same pattern is used in:

- Smart home devices (controlling lights, thermostats)
- IoT (Internet of Things) sensors
- Industrial control systems
- Home automation projects
- Remote monitoring systems

You've just built the foundation for controlling any device over the internet!

## Full Source Code

Here is the full source code.  It is about 70 lines.

```python
import network
import socket
import secrets
import time
from machine import Pin

# Setup the onboard LED
led = Pin("LED", Pin.OUT)
led_state = False  # Track LED state

def connect_wifi():
    """Connect to WiFi network using credentials from secrets.py"""
    print(f'Connecting to WiFi: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(secrets.SSID, secrets.PASSWORD)
    
    # Wait for connection
    while not wlan.isconnected():
        print('.', end='')
        time.sleep(1)
    
    print(f'\nConnected! IP: {wlan.ifconfig()[0]}')
    return wlan

def toggle_led():
    """Toggle the LED on/off and return current state"""
    global led_state
    led_state = not led_state
    
    if led_state:
        led.on()
        print("LED turned ON")
    else:
        led.off()
        print("LED turned OFF")
    
    return "ON" if led_state else "OFF"

def generate_html():
    """Create simple HTML page with LED toggle button"""
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>LED Control</title>
</head>
<body>
    <h1>Simple LED Control</h1>
    <p>LED Status: <strong>{toggle_led.__globals__['led_state'] and "ON" or "OFF"}</strong></p>
    <button onclick="toggleLED()">Toggle LED</button>
    
    <script>
        function toggleLED() {{
            fetch('/toggle', {{method: 'POST'}})
            .then(() => location.reload());
        }}
    </script>
</body>
</html>"""
    return html

def start_server(wlan):
    """Start web server and handle requests"""
    # Create socket and bind to port 80
    s = socket.socket()
    s.bind(('0.0.0.0', 80))
    s.listen(1)
    
    print(f'Web server running at: http://{wlan.ifconfig()[0]}')
    
    while True:
        # Accept incoming connection
        client, addr = s.accept()
        print(f'Client connected: {addr}')
        
        # Read the request
        request = client.recv(1024).decode('utf-8')
        
        if 'GET / ' in request:
            # Serve main page
            html = generate_html()
            client.send('HTTP/1.1 200 OK\r\n\r\n')
            client.send(html)
            
        elif 'POST /toggle' in request:
            # Toggle LED and send response
            state = toggle_led()
            client.send('HTTP/1.1 200 OK\r\n\r\n')
            client.send(f'LED is {state}')
        
        client.close()

def main():
    """Main program - connect to WiFi and start server"""
    print('Simple LED Web Server')
    print('====================')
    
    # Turn off LED initially
    led.off()
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    # Start web server
    start_server(wlan)

# Run the program
if __name__ == '__main__':
    main()
```


---


# Web Server Test

In this lab we will create a web interface to test all your robot's hardware:

1. LED control with visual feedback
2. NeoPixel colors with real-time status updates
3. Speaker tones at different frequencies
4. Motor movements with automatic 2-second safety timeouts
5. Emergency stop functionality

The debugging output in the Thonny console should also help you understand exactly what's happening when each command is executed. This makes it a great development and testing tool for your STEM robot project.

![Web Test Form](./web-test-form.png)

## Thonny Console Log

```
>>> %Run -c $EDITOR_CONTENT

MPY: soft reboot
Robot Web Server Test Interface
===================================
NeoPixels set to off
Connecting to WiFi Network: anndan
Powering up WiFi chip...
Connection attempt 1/10


==================================================
WIFI CONNECTION SUCCESSFUL!
==================================================
IP Address: 10.0.0.57
Network: anndan
==================================================

Web server started!
Open your browser and go to: http://10.0.0.57
Robot control interface ready!
==================================================
Client connected from ('10.0.0.2', 58686)
Full request received (482 bytes)
Client connected from ('10.0.0.2', 58687)
Full request received (420 bytes)
Unknown request: GET /favicon.ico HTTP/1.1
Host: 10.0.0.57
Connection: keep-alive
Pragma: no-cache
Cache-Control:...
Client connected from ('10.0.0.2', 58688)
Full request received (422 bytes)
POST request received, length: 422
Request body: 'cmd=toggle_led'
Executing command: 'toggle_led'
LED turned ON
Command 'toggle_led' executed successfully
Client connected from ('10.0.0.2', 58690)
Full request received (493 bytes)
Client connected from ('10.0.0.2', 58691)
Full request received (422 bytes)
POST request received, length: 422
Request body: 'cmd=toggle_led'
Executing command: 'toggle_led'
LED turned OFF
Command 'toggle_led' executed successfully
Client connected from ('10.0.0.2', 58692)
Full request received (424 bytes)
POST request received, length: 424
Request body: 'cmd=neopixel_red'
Executing command: 'neopixel_red'
NeoPixels set to red
Command 'neopixel_red' executed successfully
Client connected from ('10.0.0.2', 58693)
Full request received (493 bytes)
Client connected from ('10.0.0.2', 58694)
Full request received (426 bytes)
POST request received, length: 426
Request body: 'cmd=neopixel_green'
Executing command: 'neopixel_green'
NeoPixels set to green
Command 'neopixel_green' executed successfully
Client connected from ('10.0.0.2', 58698)
Full request received (425 bytes)
POST request received, length: 425
Request body: 'cmd=neopixel_blue'
Executing command: 'neopixel_blue'
NeoPixels set to blue
Command 'neopixel_blue' executed successfully
Client connected from ('10.0.0.2', 58699)
Full request received (424 bytes)
POST request received, length: 424
Request body: 'cmd=neopixel_off'
Executing command: 'neopixel_off'
NeoPixels set to off
Command 'neopixel_off' executed successfully
Client connected from ('10.0.0.2', 58700)
Full request received (421 bytes)
POST request received, length: 421
Request body: 'cmd=play_tone'
Executing command: 'play_tone'
Played tone: 1000Hz for 0.5s
Command 'play_tone' executed successfully
Client connected from ('10.0.0.2', 58701)
Full request received (424 bytes)
POST request received, length: 424
Request body: 'cmd=move_forward'
Executing command: 'move_forward'
Moving forward
Command 'move_forward' executed successfully
Client connected from ('10.0.0.2', 58702)
Full request received (423 bytes)
POST request received, length: 423
Request body: 'cmd=stop_motors'
Executing command: 'stop_motors'
Command 'stop_motors' executed successfully
Client connected from ('10.0.0.2', 58703)
Full request received (424 bytes)
POST request received, length: 424
Request body: 'cmd=move_reverse'
Executing command: 'move_reverse'
Moving reverse
Command 'move_reverse' executed successfully
Client connected from ('10.0.0.2', 58704)
Full request received (423 bytes)
POST request received, length: 423
Request body: 'cmd=stop_motors'
Executing command: 'stop_motors'
Command 'stop_motors' executed successfully
```

## Source Code

```python
import network
import socket
import secrets
import time
from machine import Pin, PWM
import neopixel
import config

# Hardware setup based on config.py
led = Pin("LED", Pin.OUT)

# Motor PWM setup
right_forward = PWM(Pin(config.RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(config.RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(config.LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(config.LEFT_REVERSE_PIN))

# Set PWM frequency for motors (1000 Hz is good for motors)
right_forward.freq(1000)
right_reverse.freq(1000)
left_forward.freq(1000)
left_reverse.freq(1000)

# NeoPixel setup
np = neopixel.NeoPixel(Pin(config.NEOPIXEL_PIN), config.NUMBER_NEOPIXELS)

# Speaker setup
speaker = PWM(Pin(config.SPEAKER_PIN))

# Global variables for state tracking
led_state = False
current_neopixel_color = "off"

def blink_led(times=1, delay=0.2):
    """Blink the onboard LED for status indication"""
    for _ in range(times):
        led.on()
        time.sleep(delay)
        led.off()
        time.sleep(delay)

def connect_wifi(max_retries=10):
    """Connect to WiFi with retry logic"""
    print(f'Connecting to WiFi Network: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    # Disable power management for better responsiveness
    wlan.config(pm=0xa11140)
    
    print('Powering up WiFi chip...')
    time.sleep(3)
    
    retry_count = 0
    while retry_count < max_retries:
        try:
            print(f'Connection attempt {retry_count + 1}/{max_retries}')
            wlan.connect(secrets.SSID, secrets.PASSWORD)
            
            timeout = 15
            start_time = time.time()
            
            while not wlan.isconnected() and (time.time() - start_time) < timeout:
                time.sleep(1)
                print('.', end='')
            
            print()
            
            if wlan.isconnected():
                return wlan
            else:
                print(f'Timeout on attempt {retry_count + 1}')
                retry_count += 1
                time.sleep(2)
                
        except Exception as e:
            print(f'Error on attempt {retry_count + 1}: {e}')
            retry_count += 1
            time.sleep(2)
    
    return None

def stop_motors():
    """Stop all motors"""
    right_forward.duty_u16(0)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(0)
    left_reverse.duty_u16(0)

def move_forward():
    """Move robot forward"""
    stop_motors()
    time.sleep(0.1)
    right_forward.duty_u16(32000)  # About 50% power
    left_forward.duty_u16(32000)
    print("Moving forward")

def move_reverse():
    """Move robot in reverse"""
    stop_motors()
    time.sleep(0.1)
    right_reverse.duty_u16(32000)
    left_reverse.duty_u16(32000)
    print("Moving reverse")

def turn_right():
    """Turn robot right"""
    stop_motors()
    time.sleep(0.1)
    left_forward.duty_u16(32000)   # Left wheel forward
    right_reverse.duty_u16(32000)  # Right wheel reverse
    print("Turning right")

def turn_left():
    """Turn robot left"""
    stop_motors()
    time.sleep(0.1)
    right_forward.duty_u16(32000)  # Right wheel forward
    left_reverse.duty_u16(32000)   # Left wheel reverse
    print("Turning left")

def set_neopixels(color):
    """Set NeoPixels to specified color"""
    global current_neopixel_color
    current_neopixel_color = color
    
    if color == "red":
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (255, 0, 0)
    elif color == "green":
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (0, 255, 0)
    elif color == "blue":
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (0, 0, 255)
    else:  # off
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (0, 0, 0)
    
    np.write()
    print(f"NeoPixels set to {color}")

def play_tone(frequency=1000, duration=0.5):
    """Play a tone on the speaker"""
    speaker.freq(frequency)
    speaker.duty_u16(32768)  # 50% duty cycle
    time.sleep(duration)
    speaker.duty_u16(0)  # Turn off
    print(f"Played tone: {frequency}Hz for {duration}s")

def toggle_led():
    """Toggle the onboard LED"""
    global led_state
    led_state = not led_state
    if led_state:
        led.on()
        print("LED turned ON")
    else:
        led.off()
        print("LED turned OFF")

def generate_html():
    """Generate the HTML page for robot control"""
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Robot Test Interface</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f0f0;
        }}
        .container {{
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            text-align: center;
        }}
        .section {{
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }}
        .section h3 {{
            margin-top: 0;
            color: #555;
        }}
        button {{
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }}
        button:hover {{
            background-color: #45a049;
        }}
        .motor-btn {{
            background-color: #2196F3;
        }}
        .motor-btn:hover {{
            background-color: #1976D2;
        }}
        .stop-btn {{
            background-color: #f44336;
        }}
        .stop-btn:hover {{
            background-color: #d32f2f;
        }}
        .status {{
            margin-top: 20px;
            padding: 10px;
            background-color: #e8f5e8;
            border-radius: 5px;
        }}
        .color-buttons {{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }}
        .red-btn {{ background-color: #f44336; }}
        .green-btn {{ background-color: #4CAF50; }}
        .blue-btn {{ background-color: #2196F3; }}
        .off-btn {{ background-color: #757575; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Robot Test Interface v2</h1>
        
        <div class="section">
            <h3>Onboard LED</h3>
            <button onclick="sendCommand('toggle_led')">Toggle LED</button>
            <p>Current state: <span id="led-status">{'ON' if led_state else 'OFF'}</span></p>
        </div>
        
        <div class="section">
            <h3>NeoPixels</h3>
            <div class="color-buttons">
                <button class="red-btn" onclick="sendCommand('neopixel_red')">Red</button>
                <button class="green-btn" onclick="sendCommand('neopixel_green')">Green</button>
                <button class="blue-btn" onclick="sendCommand('neopixel_blue')">Blue</button>
                <button class="off-btn" onclick="sendCommand('neopixel_off')">Off</button>
            </div>
            <p>Current color: <span id="neopixel-status">{current_neopixel_color}</span></p>
        </div>
        
        <div class="section">
            <h3>Speaker</h3>
            <button onclick="sendCommand('play_tone')">Play Tone (1000Hz)</button>
            <button onclick="sendCommand('play_tone_low')">Low Tone (500Hz)</button>
            <button onclick="sendCommand('play_tone_high')">High Tone (1500Hz)</button>
        </div>
        
        <div class="section">
            <h3>Motor Control</h3>
            <div>
                <button class="motor-btn" onclick="sendCommand('move_forward')">Forward</button>
                <button class="motor-btn" onclick="sendCommand('move_reverse')">Reverse</button>
            </div>
            <div>
                <button class="motor-btn" onclick="sendCommand('turn_left')">Turn Left</button>
                <button class="motor-btn" onclick="sendCommand('turn_right')">Turn Right</button>
            </div>
            <div>
                <button class="stop-btn" onclick="sendCommand('stop_motors')">STOP</button>
            </div>
            <p><em>Note: Motors will run for 2 seconds then auto-stop</em></p>
        </div>
        
        <div class="status">
            <h3>System Status</h3>
            <p>WiFi: Connected</p>
            <p>Last command: <span id="last-command">None</span></p>
        </div>
    </div>

    <script>
        function sendCommand(command) {{
            console.log('Sending command:', command);
            document.getElementById('last-command').textContent = 'Sending: ' + command;
            
            fetch('/command', {{
                method: 'POST',
                headers: {{
                    'Content-Type': 'application/x-www-form-urlencoded',
                }},
                body: 'cmd=' + encodeURIComponent(command)
            }})
            .then(response => {{
                console.log('Response status:', response.status);
                return response.text();
            }})
            .then(data => {{
                console.log('Response data:', data);
                document.getElementById('last-command').textContent = command + ' (' + data + ')';
                
                // Update status displays based on command
                if (command === 'toggle_led') {{
                    // Will be updated on next page load or we can toggle the display
                    setTimeout(() => location.reload(), 500);
                }}
                if (command.startsWith('neopixel_')) {{
                    const color = command.replace('neopixel_', '');
                    document.getElementById('neopixel-status').textContent = color;
                }}
            }})
            .catch(error => {{
                console.error('Error:', error);
                document.getElementById('last-command').textContent = 'Error: ' + command + ' - ' + error.message;
            }});
        }}
        
        // Add some debug info
        console.log('Robot control interface loaded');
    </script>
</body>
</html>
"""
    return html

def handle_command(command):
    """Handle robot commands from web interface"""
    try:
        if command == "toggle_led":
            toggle_led()
        elif command == "neopixel_red":
            set_neopixels("red")
        elif command == "neopixel_green":
            set_neopixels("green")
        elif command == "neopixel_blue":
            set_neopixels("blue")
        elif command == "neopixel_off":
            set_neopixels("off")
        elif command == "play_tone":
            play_tone(1000, 0.5)
        elif command == "play_tone_low":
            play_tone(500, 0.5)
        elif command == "play_tone_high":
            play_tone(1500, 0.5)
        elif command == "move_forward":
            move_forward()
            time.sleep(2)  # Run for 2 seconds
            stop_motors()
        elif command == "move_reverse":
            move_reverse()
            time.sleep(2)
            stop_motors()
        elif command == "turn_left":
            turn_left()
            time.sleep(2)
            stop_motors()
        elif command == "turn_right":
            turn_right()
            time.sleep(2)
            stop_motors()
        elif command == "stop_motors":
            stop_motors()
        else:
            print(f"Unknown command: {command}")
            return False
        return True
    except Exception as e:
        print(f"Error executing command {command}: {e}")
        return False

def start_web_server(wlan):
    """Start the web server"""
    addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(addr)
    s.listen(1)
    
    ip = wlan.ifconfig()[0]
    print(f'\nWeb server started!')
    print(f'Open your browser and go to: http://{ip}')
    print(f'Robot control interface ready!')
    print('='*50)
    
    while True:
        try:
            cl, addr = s.accept()
            print(f'Client connected from {addr}')
            
            # Set a timeout for receiving data
            cl.settimeout(2.0)
            
            # Read the request in chunks to ensure we get it all
            request = b''
            try:
                while True:
                    chunk = cl.recv(1024)
                    if not chunk:
                        break
                    request += chunk
                    # Check if we have the complete request
                    if b'\r\n\r\n' in request:
                        break
            except:
                # Timeout or error reading - proceed with what we have
                pass
            
            request = request.decode('utf-8')
            print(f"Full request received ({len(request)} bytes)")
            
            # Parse the request
            if 'GET / ' in request:
                # Serve the main page
                response = generate_html()
                cl.send('HTTP/1.1 200 OK\r\n')
                cl.send('Content-Type: text/html\r\n')
                cl.send(f'Content-Length: {len(response)}\r\n')
                cl.send('\r\n')
                cl.send(response)
                
            elif 'POST /command' in request:
                # Handle command - improved parsing with debugging
                print(f"POST request received, length: {len(request)}")
                
                # Find the body of the request
                body_start = request.find('\r\n\r\n')
                if body_start != -1:
                    body = request[body_start + 4:]
                    print(f"Request body: '{body}'")
                    
                    # Parse URL-encoded data
                    if body.startswith('cmd='):
                        command = body[4:].strip()  # Remove 'cmd=' prefix and whitespace
                        print(f"Executing command: '{command}'")
                        success = handle_command(command)
                        
                        if success:
                            response = "OK"
                            print(f"Command '{command}' executed successfully")
                        else:
                            response = "ERROR"
                            print(f"Command '{command}' failed")
                        
                        cl.send('HTTP/1.1 200 OK\r\n')
                        cl.send('Content-Type: text/plain\r\n')
                        cl.send('Access-Control-Allow-Origin: *\r\n')
                        cl.send(f'Content-Length: {len(response)}\r\n')
                        cl.send('\r\n')
                        cl.send(response)
                    else:
                        print(f"Invalid body format: '{body}'")
                        cl.send('HTTP/1.1 400 Bad Request\r\n\r\n')
                else:
                    print("No body found in POST request")
                    cl.send('HTTP/1.1 400 Bad Request\r\n\r\n')
            else:
                # 404 for other requests
                print(f"Unknown request: {request[:100]}...")
                cl.send('HTTP/1.1 404 Not Found\r\n\r\n')
                
        except Exception as e:
            print(f'Web server error: {e}')
        finally:
            try:
                cl.close()
            except:
                pass

def main():
    """Main program function"""
    print('Robot Web Server Test Interface')
    print('===================================')
    
    # Initialize hardware
    stop_motors()
    set_neopixels("off")
    led.off()
    
    # Initial LED indication
    blink_led(2, 0.5)
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    if wlan:
        config = wlan.ifconfig()
        print('\n' + '='*50)
        print('WIFI CONNECTION SUCCESSFUL!')
        print('='*50)
        print(f'IP Address: {config[0]}')
        print(f'Network: {secrets.SSID}')
        print('='*50)
        
        blink_led(3, 0.2)  # Success indication
        
        # Start the web server
        start_web_server(wlan)
    else:
        print('\nFAILED TO CONNECT!')
        print('Check your secrets.py file for correct SSID and PASSWORD')
        blink_led(10, 0.1)  # Error indication

if __name__ == '__main__':
    main()
```


---


# MicroSwitch Robot

This robot was inspired by my friend, Michael York.  Michael noted that you don't need complex sensors to build a robot.  You can use microswitches.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ui4kJgjIIuo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Microswitches can be purchased for [under $1](https://www.amazon.com/Twidec-Straight-Switch-Action-KW11-3Z04/dp/B07P4CJ8TV/ref=sr_1_3).  They can be mounted on the front of our robot.  When the robot hits a wall in front of it the switch will open (or close) and the robot controller can make the robot go in reverse or turn.

In the example below, we attached a stiff wire to the lever of the microswitch.

![](images/img_004_microswitch-bot-2.jpg)


In the example below, we connected three microswitches to the front of our robot.

![](images/img_003_microswitch-bot-1.jpg)

If the left switch is activated, the robot should turn to the right.  If the right switch is activated, the robot should go to the left.

This image shows how we used two of the Grove connectors to read in the values of the switches.

![](images/img_005_microswitch-bot-3.jpg)

## Testing Switches
The following code can be used to test your switches.  A line on the console prints out which of the three switches are activated using the pin ```value()``` function.

```py
from machine import Pin
from time import sleep

# GPIO is the internal built-in LED
led0 = Pin(0, Pin.OUT)
led1 = Pin(1, Pin.OUT)
led2 = Pin(2, Pin.OUT)

# MicroSwitch inputs on the Grove connector using a built-in pull-down resistor to keep the value from floating.  The other end of the switches go to the 3.3volt connectors of the Grove connectors.
middle_switch = Pin(7, Pin.IN, Pin.PULL_DOWN) 
right_switch = Pin(28, Pin.IN, Pin.PULL_DOWN)
left_switch = Pin(27, Pin.IN, Pin.PULL_DOWN)

while True:
    if middle_switch.value(): # if the value changes
        led0.on()
        print('middle')
    else: led0.off()

    if right_switch.value(): # if the value changes
        led1.on()
        print('right')
    else: led1.off()
    
    if left_switch.value(): # if the value changes
        led2.on()
        print('left')
    else: led2.off()
    sleep(.1)
```

## Sample Collision Avoidance Robot Code

```py
from machine import Pin, PWM
from time import sleep

# GPIO is the internal built-in LED
led0 = Pin(0, Pin.OUT)
led1 = Pin(1, Pin.OUT)
led2 = Pin(2, Pin.OUT)

# input on the lower left of the Pico using a built-in pull-down resistor to keep the value from floating
middle_switch = Pin(7, Pin.IN, Pin.PULL_DOWN) 
right_switch = Pin(28, Pin.IN, Pin.PULL_DOWN)
left_switch = Pin(27, Pin.IN, Pin.PULL_DOWN)

# Go slow to avoid bending wires
POWER_LEVEL = 25000 # max is 65000

# These values depend on motor wiring
RIGHT_FORWARD_PIN = 10
RIGHT_REVERSE_PIN = 11
LEFT_FORWARD_PIN = 9
LEFT_REVERSE_PIN = 8

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(LEFT_REVERSE_PIN))

def turn_motor_on(pwm):
   pwm.duty_u16(POWER_LEVEL)

def turn_motor_off(pwm):
   pwm.duty_u16(0)

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

def main():
    while True:
        if middle_switch.value(): # if the value changes
            print('middle')
            led0.on()
            reverse()
            sleep(1)
            turn_right()
            sleep(.75)
            forward()
        else:
            led0.off()
            forward()

        if right_switch.value(): # if the value changes
            print('right')
            led1.on()
            reverse()
            sleep(.75)
            turn_left()
            sleep(.5)
            forward()
        else:
            led1.off()
            forward()
        
        if left_switch.value(): # if the value changes
            led2.on()
            print('left')
            reverse()
            sleep(.75)
            turn_right()
            sleep(.5)
            forward()
        else:
            led2.off()
            forward()

print('middle', middle_switch.value())
print('left', left_switch.value())
print('right', right_switch.value())

try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('turning off sound')
    # sound_off()
    print('turning off motors')
    stop()

```

## References

[Microswitch Robot on the Learning MicroPython Site](https://dmccreary.github.io/learning-micropython/kits/maker-pi-rp2040-robot/23-microswitch-bot/)


---


# Line Follower Robot

* [Line Follower Robot on the MicroPython for Kids Site](https://dmccreary.github.io/micropython/kits/maker-pi-rp2040-robot/25-line-follower/)


---


# Adjustabot

This robot allows the parameters of collision avoidance to be
adjusted by turning knobs.  You can effectively "program" this
robot to change its behavior by adjusting parameters such as:

1. Motor power - which determines the speed
2. Distance threshold - which changes when a robot turns
3. Turn time - which changes that angle of turn after a collision

This robot is ideal for projects that don't have a lab of PCs that are
used to customize a robot's program.

## Parts List

We start with our [Display](../display/index.md) robot and add three potentiometers
that can be adjusted to change the parameters.






---


# Ultrasonic Robot

[Ultrasonic Robot on the MicroPython for Kids Site](https://dmccreary.github.io/micropython/kits/maker-pi-rp2040-robot/11-ping-lab/)


---



# WiFi Display Bot

# WiFi Display Bot

![](./wifi-display-bot.jpg)

This robot starts with the [WiFi Bot](../wifi-bot/index.md) but then adds an OLD display to
view the status of the bot as it starts up, connects to a WiFi access
point and then display a driver form on a web server.

## Display Status Screens

[Display Status Screens](./display-status.md)





---


# Display Status

We can modify the wifi-bot to also display the the internal status of the robot.

## Display Startup Status

We can add the following function which will display only during
the connecting to the access point.  It will also show a counter
that shows how many times the connection has been started.

```python
def display_startup(counter):
    oled.fill(0)
    oled.text('Running startup', 0, 10, 1)
    oled.text('Connecting to', 0, 20, 1)
    oled.text(secrets.SSID, 0, 30, 1)
    oled.text(str(counter), 0, 40, 1)
    oled.show()
```

## Display Web Server Status

The following function can be used after the web server starts up.

```python
def display_status(counter):
    oled.fill(0)
    # display the network name
    oled.text('n:' + secrets.SSID, 0, 0, 1)

    # display the connection time
    oled.text('t:', 0, 10, 1)
    oled.text(str(connection_time)+ ' ms', 15, 10, 1)

    # display the MAC address
    oled.text(mac_address_fmt(), 0, 20, 1)

    # display the IP address
    oled.text('ip:' + wlan.ifconfig()[0], 0, 30, 1)
    oled.text('c:' + str(counter), 0, 40, 1)
    oled.show()

```


---



# Instructors Guide

# Instructors Guide

This section describes guidelines for people teaching STEM robotics
courses.  We don't just focus on the process of setting up a great
STEM Robotics event or course, we also review some of the underlying
processes we are attempting to teach.

## Computational Thinking

Computational thinking is a name we give to describing the underlying patterns that guide the development of computer science curriculum.  Our goal is to teach these
concepts using a fun curriculum.

[Read the Section on Computational Thinking](computational-thinking.md)


---


# Computational Thinking

Computational thinking is a name we give to describing the underlying patterns that guide the development of computer science curriculum.

There are four key patterns that are frequently discussed when we talk about computational thinking.

1. **abstraction** – focusing on the important information only, ignoring irrelevant detail.
2. **algorithms** - developing a step-by-step solution to the problem, or the rules to follow to solve the problem.
3. **decomposition** - breaking down a complex problem or system into smaller, more manageable parts.
4. **pattern recognition** – looking for similarities among and within problems.

We have to added the concept of expandability and bias to these concepts:

1. **explainability** - can a computer explain why it took a specific action or made a specific recommendation?
2. **bias** - is the result of the suggestion made by a computer skewed in a direction that makes it unfair to a group of people?


## Other Common Design Patterns

Although we have many different coding groups that are appropriate for beginners, there are several computer science concepts that we encourage everyone to adopt in your coding group curriculum.

**Events** - What events start a program?  What events change the behavior of a program?

**Loops** - How do repeat a set of tasks?

**Variables** - How do we reference a common value and make our programs easier to change?

**Conditionals** - How do we change program behavior based on rules.  How do we use comparisons to do this?  How do we implement if/then/else or switch/case logic to be easy to understand and maintain?

**Functions** - How do we group code sections together and give them names?

**Function Parameters** - How do we pass values to functions? How can parameters make functions more widely reusable? Why would we want to check the types of an input parameters?  What happens when we pass invalid data types to a function?

**Data types** - What is the difference between a string of characters, an integer, a floating point number or a datetime?  How do we use the right datatype and type checking to keep our programs reliable?

**Data Structures** - How do you create and manage lists, dictionaries, arrays and complex data structures?

**Sensors** - How do we gather input from the real world?

**Output** - How do we display text or graphic output on a small display screen or print statements to a serial console for debugging?

**Feedback** - how do we prompt users for input and respond to changes in output

**Debugging** - How do we find problems in our code?  How can we stop execution of our code using a debugger?  How do we inspect the value of variables when a program has paused?

**Drawing** - Drawing to a graphics device is a great way to learn other concepts where you get quick visual feedback.  Drawing can be our on ramp to drawing charts and graphs.  See our [SVG Labs](http://www.coderdojotc.org/web-ux/svg/01-intro/) for excellent examples of learning to program with graphics.

**Recursion** - What happens when a function calls itself?  How can you draw trees that have many smaller branches?

**Commenting** - How do we put hints in our code for others to better understand our code?  How do comments make code more maintainable?

**Scope** - How do we protect variables from unintended updates?  How do we use global variables sparingly.  How do we use local variables and when should move variables from global to local or vice versa?

## Advanced concepts
Here are a few topics that you can explore with your move advanced students.

**Files** - How do we read data in from files and write data out to files?  How do we append to the end of files?

**Regular Expressions** - How do we use a short set of special characters to look for patterns in strings and text?

**Integrated Development Environments** - How do we setup our desktop so that we can be productive debugging our programs?  What is syntax highlighting?  What is autocomplete?

**Logging** - How do we keep a record of what has happened in our programs?



---


# STEM Robotics Frequently Asked Questions (FAQ)


## Can we print our own robot chassis using a 3D printer?

Yes!  We have samples here:

* [Cytron Board 3D Model](https://www.printables.com/en/model/258867-maker-pi-rp2040-model-by-cytron-step-stl-files)
* [3D Printed Parts for the Donkey Car](https://medium.com/@dmccreary/custom-3d-printed-parts-for-the-donkeycar-202cd2371a4f)

## Can we print our own mounts for sensors?

Yes! We have a sample here: [A 3D-printed Mount for Time-of-Flight Distance Sensors](https://medium.com/p/8acea5480709)


---


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

![](../img/castellated-edge.png)

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

#### PWM
A type of output signal used to control items with continuous values.  For example, we use PWM to control the brightness of a light or the speed of a motor.  We use pulse-width modulation (PWM) to control the speed of our DC motors.

![](../img/PWM-duty-cycle.png)

#### Physical Computing

The process of using computers to read data from sensors about the world around us and then taking action on this incoming data stream. These actions are typically doing things like blinking an LED, moving a motor, or updating a display.

#### Pico Pinout Diagram

The Pico pinout diagram shows you the ways that each Pin can be used.  Different colors are used for GPIO numbers, I2C, and SPI interfaces.

![](../img/pi-pico-pinout.png)

* [Pinout PDF](https://datasheets.raspberrypi.org/pico/Pico-R3-A4-Pinout.pdf)

#### Piezo buzzer

An electronic device that produces sound, often used for alerts and notifications in electronic circuits.

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

#### SPI
An interface bus commonly used to send data between microcontrollers and small peripherals such as sensors, displays and SD cards. SPI uses separate clock and data lines, along with a select line to choose the device you wish to talk to.

Also known as: Serial Peripheral Interface
See also: [I2C](#i2c)

#### SPI bus

Serial Peripheral Interface bus, a synchronous serial communication protocol used for short-distance communication.

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



---


# References

## MicroPython for Kids

This is the original website that we built for our students.  It has hundreds of step-by-step tutorials on learning how to use MicroPython to write programs that control robots.

[MicroPython for Kids Website](https://dmccreary.github.io/micropython/micropython/)

## Introduction to Python with Trinket

This site is our most popular site for students who are new to Python programming.  This has a well-designed set of lessons that use the Trinket site which is a kid-safe place to learn Python with turtle graphics.

[Introduction to Python Website](https://www.coderdojotc.org/python/trinket/00-introduction/)


## AI Racing League

This project uses an RC car body with a full Raspberry Pi and camera to
teach the basics of machine learning and computer vision.  The cost of the hardware is about $300/car and we use a $900 PC with a GPU to train models.

[AI Racing League Website](https://www.coderdojotc.org/ai-racing-league/)

## Robot Faces

For students who want to put faces on their robots, this is the site for you.  The site starts with learning basic drawing commands for squares and circles and then builds up to drawing complex faces with eyes, smiles and eyebrows.  You can even teach your robot to wink!

[Robot Faces Website](https://dmccreary.github.io/robot-faces/)

## Clocks and Watches

[Clocks and Watches Website](https://dmccreary.github.io/micropython-clocks-and-watches/)

## Internet of Things Course

For advanced high-school students, we encourage you to continue your learning by understanding how microcontrollers are used in the Internet of Things (IoT) field.

[Internet of Things Course](https://dmccreary.github.io/iot-course/)

## Resources for Teachers and Mentors

[CoderDojo Mentor Resources](https://www.coderdojotc.org/CoderDojoTC/)

## Instructable

[$25 Robot Platform for Teaching Programming](https://www.instructables.com/Collision-Avoidance-Robot-for-Teaching-Programming/) - March 22nd 2017


---


# Creative Commons License

![License](images/img_054_license.png)

All content in this repository is governed by the following license agreement:

## License Type

Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0 DEED)

## Link to License Agreement

[https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en)

## Your Rights

You are free to:

* **Share** — copy and redistribute the material in any medium or format
* **Adapt** — remix, transform, and build upon the material

The licensor cannot revoke these freedoms as long as you follow the license terms.

## Restrictions

* **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
* **NonCommercial** — You may not use the material for commercial purposes.
* **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
* **No additional restrictions** — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

!!! Notices
    You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation.

    No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.

    This deed highlights only some of the key features and terms of the actual license. It is not a license and has no legal value. You should carefully review all of the terms and conditions of the actual license before using the licensed material.


---


# Contact

Please contact me on [LinkedIn](https://www.linkedin.com/in/danmccreary/)

Thanks! - Dan



---


# STEM Robotics Prompts


---


# MicroSim Template

<figure markdown>
   ![Image Name](./image.png){ width="400" }
   <figcaption>Figure caption.</figcaption>
</figure>

[Link to Demo](./template.html){ .md-button .md-button--primary }

## About this MicroSim

This MicroSim teaches us how to
specify the drawing of a static filled circle.

## Sample Prompt

```linenums="0"
Create a single file p5.js sketch.
Draw a green circle on a 600x400 canvas with a radius of 200.
```

## Sample Response

```javascript
let canvasHeight = 400;
let aspectRatio = 1.91; // Open Graph standard
let canvasWidth = canvasHeight * aspectRatio;
let radius = 200;
function setup() {
const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  fill(245);
  rect(0,0, canvasWidth, canvasHeight);
  fill('green');
  circle(canvasWidth/2, canvasHeight/2, radius);
}
```

## Lesson Plan

### Grade Level, Subject and Topic

9th grade geometry. Circle and radius.

### Activities

#### Fill Color

Change the color in the prompt.  You
can specify any one of the [140 named colors](https://www.w3schools.com/tags/ref_colornames.asp).

#### Border Weight

Change the prompt to include a black border of
width 10.

#### Border Color

Change the prompt to make the border purple.

#### Change the Radius

Change the prompt to make the circle smaller
or larger by changing the radius from 10 to 200.

#### Change the Location

Change the prompt to move the circle to the left or right.




---

