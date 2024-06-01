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