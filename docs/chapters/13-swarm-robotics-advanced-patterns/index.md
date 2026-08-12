---
title: Swarm Robotics and Advanced Engineering Patterns
description: Extend leader/follower swarm robotics into collective behaviors and professional software patterns, then build a second swarm using a 9-DOF IMU (L3GD20 gyroscope + LSM303D accelerometer/magnetometer) for WiFi-based heading synchronization.
generated_by: claude skill chapter-content-generator
date: 2026-08-11 08:07:14
version: 0.09
---

# Swarm Robotics and Advanced Engineering Patterns

!!! mascot-welcome "Welcome back, engineer — this is the big one!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    We paired two robots over BLE in Chapter 12. Now we turn that pair into a real **swarm** — robots that avoid obstacles together, follow in a convoy, and even dance in sync. Along the way we'll pick up the software patterns real robotics engineers use every day: state machines, multithreading, and PID control. Then, in the second half of this chapter, we'll build a *second* kind of swarm — one where robots don't send each other messages at all. Instead, they read their own 9-DOF motion sensor, agree on a shared heading over WiFi, and steer to match it. Let's activate our superpower one more time!

## Summary

This capstone chapter extends the BLE leader/follower pair from Chapter 12 into full
swarm robotics: collective obstacle avoidance, convoy following, and synchronized
dance routines, all organized with a state machine. Along the way, students learn the
software patterns professional robotics teams rely on — project planning, multithreading,
asynchronous programming, PID control, encoder feedback, and data logging. The chapter
then introduces a second, independent path to swarm coordination: a 9-DOF inertial
measurement unit (the L3GD20 gyroscope and LSM303D accelerometer/magnetometer) that each
robot calibrates and fuses into a stable heading estimate, broadcast over a WiFi access
point using UDP so every follower in the swarm can steer to match it — no pairing, no
per-robot connection, and no limit on how many robots can listen in.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. Swarm Robotics
2. Emergent Behavior
3. Leader-Follower Pattern
4. BLE Leader Robot Code
5. BLE Follower Robot Code
6. Collective Obstacle Avoid
7. Swarm Algorithm Design
8. Distributed Systems
9. Convoy Following
10. Synchronized Swarm Dance
11. State Machine Pattern
12. Project Planning
13. Team Collaboration
14. Multithreading Basics
15. Asynchronous Programming
16. PID Control Overview
17. Encoder Motor Feedback
18. Data Logging
19. 9-DOF IMU Overview
20. L3GD20 Gyroscope
21. LSM303D Accelerometer Magnetometer
22. Gyroscope Calibration
23. Magnetometer Hard Iron Calibration
24. Complementary Filter Sensor Fusion
25. Heading Estimation
26. WiFi Access Point Host Mode
27. UDP Broadcast Networking
28. Heading Synchronization Swarm Pattern
29. UDP Master Broadcast Code
30. UDP Follower Steering Code

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computational Thinking and Physical Computing](../01-intro-computational-thinking/index.md)
- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)
- [Chapter 5: Data Structures, Modular Programming, and Version Control](../05-data-structures-modular-code/index.md)
- [Chapter 6: Electronics, DC Motors, and Communication Protocols](../06-electronics-motors-protocols/index.md)
- [Chapter 7: PWM, Motor Speed Control, and Actuators](../07-pwm-motor-speed-actuators/index.md)
- [Chapter 8: Sensors and Data Input](../08-sensors-data-input/index.md)
- [Chapter 10: Robot Behaviors and Autonomous Navigation](../10-robot-behaviors-navigation/index.md)
- [Chapter 11: Wireless Networking and Web Servers](../11-wireless-networking-web-servers/index.md)
- [Chapter 12: Bluetooth Low Energy Fundamentals](../12-bluetooth-low-energy/index.md)

---

## From Pairs to Swarms

In Chapter 12, one robot connected to another and sent it commands. That is
communication between two robots. **Swarm robotics** is something different: it is the
study of how many robots, each following simple local rules, produce useful behavior as
a group — without any single robot knowing the whole plan.

Watch a flock of birds turn together, or a school of fish swerve around a predator. No
bird is in charge. Each one just reacts to its nearest neighbors, and the group-level
pattern — the turn, the swerve — appears on its own. Computer scientists call this
**emergent behavior**: a group-level pattern that isn't written down anywhere in any
single robot's code, but appears anyway from many robots following the same simple rules
at the same time.

That's the engineering promise of swarm robotics. You don't program "form a convoy." You
program "keep a fixed distance from the robot in front of you," give that rule to every
robot, and the convoy emerges.

!!! mascot-thinking "No robot sees the whole picture"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Here's the mind-bending part: in a real swarm, no single robot — and often no single human — has to know what the "big picture" behavior looks like. It just has to write one robot's local rule correctly. That's a very different kind of program than anything we've written so far in this course.

---

## Extending Leader-Follower into Collective Behaviors

Chapter 12's BLE pairing already used the **leader-follower pattern**: one robot (the
central) makes decisions and sends commands; the other (the peripheral) just executes
them. That pattern doesn't stop at two robots. The same **BLE leader robot code** you
wrote in Chapter 12 — scanning, connecting, writing to a characteristic — can address
more than one peripheral, and the same **BLE follower robot code** — advertising,
accepting a connection, executing received commands — runs unchanged on each follower.
Each follower just needs a unique BLE name so the leader can tell them apart.

With more than two robots connected, several new group behaviors become possible:

- **Collective obstacle avoidance** — every robot in the swarm shares what its own
  time-of-flight sensor sees. If one robot detects a wall, it broadcasts that to the
  others, and the whole group adjusts — not just the robot that "saw" the obstacle.
- **Swarm algorithm design** — the general engineering discipline of writing the *one
  local rule* that, repeated across every robot, produces the group behavior you want.
  This is decomposition and pattern recognition (Chapter 1) applied to a multi-robot
  system.
- **Distributed systems** — a broader computer science idea: a system made of multiple
  independent devices, none of which has the full picture, that still cooperates to get
  something done. A swarm of robots is a small, physical, easy-to-see example of the
  same idea that powers large computing systems like content delivery networks.
- **Convoy following** — each follower keeps a target distance from the robot ahead of
  it, using its own time-of-flight sensor from Chapter 8. The lead robot drives; the
  convoy shape emerges from every follower running the same distance-keeping rule.
- **Synchronized swarm dance** — building on the robot dance sequence from Chapter 10,
  the leader broadcasts a shared timing beat, and every robot performs its part of a
  choreographed routine on that beat.

The following table summarizes the four collective behaviors, all built from the same
BLE leader/follower plumbing you already have:

| Behavior | What the leader sends | What each follower does |
|---|---|---|
| Collective obstacle avoid | Distance reading from any robot that sees a wall | Adjusts path even if its own sensor sees nothing |
| Convoy following | Nothing extra — followers watch the robot ahead | Matches speed to hold a fixed following distance |
| Synchronized dance | A shared timing beat | Runs its part of a choreographed sequence on-beat |
| Heading synchronization *(this chapter, Part 2)* | A shared compass heading | Steers to match the broadcast heading |

---

## Organizing Multi-Behavior Code with a State Machine

A single robot in this swarm might need to switch between avoiding an obstacle,
following a convoy leader, and dancing — sometimes within the same run. Writing one
giant tangle of `if` statements to handle every combination gets unreadable fast. This
is exactly the problem a **state machine pattern** solves.

A state machine describes a program as a small set of named **states** — like `SEARCH`,
`FOLLOW`, and `AVOID` — plus the rules for **transitioning** from one state to another.
At any moment, the robot is in exactly one state, and only that state's code runs. This
mirrors a pattern you already know: the closed-loop feedback from Chapter 10 (sense,
decide, act) is really just a state machine with one state. A swarm robot needs several.

Before the diagram below, here is the plain-language version: the robot starts in
`SEARCH`, looking for the leader's signal. If it hears the leader, it moves to `FOLLOW`.
If its distance sensor ever reports something too close, it moves to `AVOID` — no
matter which state it was just in. Once the obstacle clears, it goes back to whatever it
was doing.

#### Diagram: Swarm Robot State Machine

<iframe src="../../sims/swarm-robot-state-machine/main.html" width="100%" height="420px" scrolling="no"></iframe>

[Run the Swarm Robot State Machine Fullscreen](../../sims/swarm-robot-state-machine/main.html){ .md-button }

<details markdown="1">
<summary>Interactive state machine diagram for a swarm robot's behavior modes</summary>
Type: diagram
**sim-id:** swarm-robot-state-machine<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Diagram Name: Swarm Robot State Machine

Bloom Taxonomy: Understand

Bloom Taxonomy Verb: classify

Learning objective: Explain how a state machine organizes a robot's competing behaviors (search, follow, avoid) into a single clear structure, and how a transition can interrupt any state.

Create a Mermaid flowchart (graph TD) with four rounded-rectangle nodes: SEARCH, FOLLOW, AVOID, and DANCE. Directed edges: SEARCH -> FOLLOW labeled "leader signal found", FOLLOW -> SEARCH labeled "signal lost", FOLLOW -> DANCE labeled "dance beat received", DANCE -> FOLLOW labeled "routine finished". From every one of SEARCH, FOLLOW, and DANCE, draw a dashed edge to AVOID labeled "obstacle too close", and one dashed edge from AVOID back to FOLLOW labeled "path clear".

Every node has a click directive opening an infobox with a plain-language definition: SEARCH — "robot is scanning for the leader's advertising signal, motors idle." FOLLOW — "robot is connected to the leader and executing convoy or command logic." AVOID — "robot's own time-of-flight sensor reported an obstacle — this state can interrupt any other state." DANCE — "robot is executing a timed choreography step synced to the leader's beat." Every edge also has a click directive that shows the transition condition in plain language.

Color scheme: SEARCH gray, FOLLOW OliveDrab (matches the ROBOT taxonomy color), AVOID Crimson (matches MOTOR/warning color), DANCE MediumPurple. Canvas responsive to container width, minimum 700px wide before scaling down.
</details>

Notice that every state has a path to `AVOID`, but nothing else does. That's a
deliberate design choice: safety behaviors should be able to interrupt anything. When
you design your own state machine, ask which state must always be reachable, no matter
what else is happening — that state gets the most incoming arrows.

---

## Planning a Swarm Project as a Team

A four-robot swarm is bigger than any single-robot project in this course, and it is
usually built by more than one person. Two engineering-process concepts become essential
here, not optional.

**Project planning** means breaking the swarm build into ordered milestones *before*
writing code — for example: (1) get one robot's state machine working alone, (2) get a
two-robot BLE pair working, (3) add a third robot, (4) add the chosen collective
behavior. Each milestone is testable on its own, so a bug shows up close to where it was
introduced instead of buried in a four-robot tangle.

**Team collaboration** means dividing that plan across people with clear ownership — one
student owns the state machine, another owns the BLE messaging, another owns the
distance-keeping math — and agreeing on the *interface* between those pieces (what
functions exist, what they're named, what they return) before anyone writes the
internals. This is the same modular programming idea from Chapter 5, applied to people
instead of just files.

---

## Doing Two Things at Once: Multithreading and Asynchronous Programming

A swarm robot in the `FOLLOW` state has to do several things that all feel "at the same
time": read its distance sensor, listen for new BLE messages, and update its motors.
MicroPython runs your code one line at a time, so "at the same time" needs a real
technique, not just optimism. This course covers two of them.

**Multithreading** runs a second, independent stream of instructions using the `_thread`
module. The main program and the new thread genuinely run concurrently, each with its
own call stack. Before the code below: `_thread.start_new_thread()` takes a function and
a tuple of arguments, and starts that function running on its own thread immediately —
the main program continues on to its next line without waiting.

```python
import _thread
import time

def watch_distance_sensor():
    while True:
        distance = read_distance()   # from Chapter 8's ToF driver
        if distance < 15:
            avoid_flag.set()          # signal the main loop, don't call motors directly
        time.sleep(0.05)

_thread.start_new_thread(watch_distance_sensor, ())
```

**Asynchronous programming** solves the same "do several things at once" problem a
different way: instead of a second real thread, `uasyncio` runs several *tasks* that
take turns on a single thread, each one voluntarily pausing at an `await`. Before the
code: `async def` marks a function as a task; `await asyncio.sleep(...)` is the pause
point where this task lets another task run.

```python
import uasyncio as asyncio

async def blink_status_led():
    while True:
        led.toggle()
        await asyncio.sleep(0.5)   # pause here — other tasks run during this pause

async def main():
    asyncio.create_task(blink_status_led())
    while True:
        check_ble_messages()
        await asyncio.sleep(0.02)

asyncio.run(main())
```

Both approaches let a robot appear to do several things "at once." The table below
compares them now that both have been explained in prose.

| | Multithreading (`_thread`) | Asynchronous (`uasyncio`) |
|---|---|---|
| How it shares CPU time | Real concurrent threads | One thread, cooperative task-switching |
| Where it pauses | Anywhere, unpredictably | Only at an explicit `await` |
| Risk of two tasks fighting over the same variable | Higher — needs care | Lower — tasks never interrupt mid-line |
| Typical use in this course | A sensor-reading loop that must never stall | Multiple lightweight tasks (blink, poll, log) |

!!! mascot-warning "Don't touch the motors from two places at once"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common bug: one thread reads the sensor and calls a motor function while the main loop is *also* calling a motor function, and the two calls interleave into garbage PWM values. The fix used above — the sensor thread only sets a flag, and the main loop is the only code that ever touches the motors — is the safest pattern for a first multithreaded program.

---

## Smoother Control: PID and Encoder Feedback

Chapter 10's closed-loop feedback loop compared a sensor reading to a target and reacted
—but it only reacted to *how far off* the robot currently was. **PID control overview**
generalizes that idea into three separate reactions, added together:

\[ \text{output} = K_p \cdot e + K_i \cdot \int e \, dt + K_d \cdot \frac{de}{dt} \]

Here \( e \) is the **error** — target minus current value. In plain language, not
calculus:

| Term | Reacts to | Plain-language effect |
|---|---|---|
| P (proportional) | How far off you are *right now* | Bigger error → bigger correction |
| I (integral) | How long you've *stayed* off | Corrects small, stubborn, lingering errors |
| D (derivative) | How *fast* the error is changing | Slows the correction down before it overshoots |

Most of the closed-loop code in this course — including the collision-avoidance robot
from Chapter 10 — only ever used the P term. That's called **proportional-only
control**, and it's often good enough. You'll use exactly that P-only idea again later
in this chapter, when a follower robot steers to match a broadcast heading.

<iframe src="../../sims/pid-feedback-loop-tuner/main.html" width="100%" height="480px" scrolling="no"></iframe>

[Run the PID Feedback Loop Tuner Fullscreen](../../sims/pid-feedback-loop-tuner/main.html){ .md-button }

<details markdown="1">
<summary>PID Feedback Loop Tuner MicroSim</summary>
Type: microsim
**sim-id:** pid-feedback-loop-tuner<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Template:** https://github.com/dmccreary/control-systems/tree/main/docs/sims/feedback-loop-simulator

Learning objective: Apply (Bloom L3) — adjust Kp, Ki, and Kd independently and observe how each changes a simulated robot's approach to a target heading, including overshoot and settling time.

Canvas layout:
- Left 500px: a strip-chart plot, target heading as a flat dashed line, actual heading as a solid animated line updating in real time
- Right 200px: control panel

Visual elements:
- Time-series plot, x-axis = time (seconds), y-axis = heading error in degrees
- A single simulated follower robot's heading value updated each frame using the PID formula against a step-change target

Interactive controls:
- Slider: Kp (0 to 1.0, default 0.2)
- Slider: Ki (0 to 0.2, default 0.0)
- Slider: Kd (0 to 0.5, default 0.0)
- Button: "Step Target" — jumps the target heading by 90 degrees
- Button: "Reset"

Default parameters: Kp=0.2, Ki=0.0, Kd=0.0, so the sim starts in the same proportional-only mode already used elsewhere in this chapter.

Behavior: raising Kp alone should visibly speed up the approach but eventually cause oscillation around the target; adding Kd should visibly damp that oscillation; adding Ki should visibly eliminate any small steady-state offset left over. Label the current Kp/Ki/Kd values and the live error value numerically next to the sliders so the connection between slider position and plotted behavior stays visible (Data Visibility Requirement).

Instructional Rationale: this is an Apply-level objective, so the sim uses direct parameter manipulation with an immediately visible, labeled numeric readout rather than a passive animation — the learner must be able to connect a specific slider position to a specific change in the plotted curve.

Implementation notes: adapt the referenced template's proportional-gain step-response simulator to this course's heading/degrees framing instead of a generic plant/setpoint framing, and add the Ki/Kd sliders and plot terms the template does not yet include.
</details>

Closed-loop control gets more precise when the feedback signal itself is more precise.
**Encoder motor feedback** adds a small sensor — often a slotted wheel and an optical or
magnetic sensor — that counts wheel rotations directly, instead of only inferring motion
from motor commands. If you add an encoder later, the wiring reuses the interrupt
pattern from Chapter 6:

```python
import machine

encoder_ticks = 0

def count_tick(pin):
    global encoder_ticks
    encoder_ticks += 1   # one tick = one fixed distance traveled

encoder_pin = machine.Pin(21, machine.Pin.IN, machine.Pin.PULL_UP)
encoder_pin.irq(trigger=machine.Pin.IRQ_FALLING, handler=count_tick)
```

Feeding `encoder_ticks` into a PID loop as the feedback signal — instead of a raw
distance sensor reading — is how professional robots achieve precise, repeatable
convoy-following distances.

---

## Recording What Happened: Data Logging

Tuning Kp by eye on a moving robot is hard. **Data logging** — writing sensor readings
and decisions to a file as the robot runs — lets you review a run afterward instead of
watching it live.

```python
log_file = open("heading_log.csv", "a")

def log_heading(t, target, actual):
    row = f"{t},{target},{actual}\n"
    log_file.write(row)
    log_file.flush()   # write to flash now, don't wait for a possible crash
```

Later, you can open `heading_log.csv` on your laptop and plot target vs. actual heading
over time — the exact same step-response curve the PID tuner MicroSim above simulates,
but from your own robot's real run.

!!! mascot-encourage "Advanced patterns take practice — that's expected"
    ![Sparky encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    State machines, threads, async tasks, and PID math are genuinely more advanced than anything earlier in this course. Professional robotics engineers spend years getting comfortable with these ideas. You don't need to master them today — you need to recognize the shape of the problem each one solves, so you know which tool to reach for later.

---

## A Second Path to Swarm Coordination

Every swarm behavior so far depends on BLE: each robot pairs with, or listens for
messages from, another specific robot. That works well for a handful of robots, but BLE
connections are one-to-one — a leader has to connect to each follower separately, and
Chapter 12 already noted that reliability drops with distance and interference.

The [Swarm Robotics Cluster design report](../../appendices/swarm-robots/index.md)
explores a different idea: instead of tracking another robot's *position*, or waiting
for a paired connection, what if every robot just matched a shared **heading** — the
compass direction it's currently facing? A master robot broadcasts its heading over
WiFi. Every follower reads that broadcast, compares it to its *own* heading, and steers
to close the gap. No pairing. No per-follower connection. Any robot within WiFi range
can listen in, at no extra cost to the master.

Matching a heading needs a robot that can measure its own heading precisely, which is a
harder sensing problem than anything earlier in this course.

---

## Meet the 9-DOF IMU: L3GD20 + LSM303D

A **9-DOF IMU overview**: "9-DOF" stands for nine degrees of freedom — three axes each
from a gyroscope, an accelerometer, and a magnetometer. A **gyroscope** measures
*rotation rate* (how fast the robot is turning, in degrees per second). An
**accelerometer** measures *linear acceleration* (including gravity, which is how it
senses "which way is down"). A **magnetometer** measures the *local magnetic field* —
essentially, a built-in compass. Combined, these nine numbers are enough to estimate
which way a robot is facing and how it's moving, far more precisely than the single
time-of-flight sensor from Chapter 8.

The module used in this course packs these onto two separate chips on one small board:
the **L3GD20 gyroscope** and the **LSM303D accelerometer/magnetometer**. Each chip has
its own I2C address on the same I2C bus from Chapter 6 — so reading this module means
writing two small drivers, one per chip, not one.

#### Diagram: 9-DOF IMU Chip Layout

<iframe src="../../sims/imu-chip-layout-diagram/main.html" width="100%" height="380px" scrolling="no"></iframe>

[Run the 9-DOF IMU Chip Layout Diagram Fullscreen](../../sims/imu-chip-layout-diagram/main.html){ .md-button }

<details markdown="1">
<summary>9-DOF IMU chip layout on a shared I2C bus</summary>
Type: diagram
**sim-id:** imu-chip-layout-diagram<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Diagram Name: 9-DOF IMU Chip Layout

Bloom Taxonomy: Understand

Bloom Taxonomy Verb: explain

Learning objective: Explain that a "9-DOF IMU module" is really two separate I2C sensor chips sharing one bus, each with its own address, rather than one combined chip.

Create a Mermaid flowchart (graph LR). Node "Pico W GPIO16/17 (I2C0)" connects with two labeled edges to two chip nodes: "L3GD20 Gyroscope (addr 0x6B)" and "LSM303D Accel + Mag (addr 0x1D)". Each chip node has a smaller child node beneath it: L3GD20 connects down to "3-axis rotation rate (deg/s)"; LSM303D connects down to two children, "3-axis acceleration (g)" and "3-axis magnetic field (gauss)".

Every node has a click directive with an infobox: the I2C bus node explains "one shared SDA/SCL pair, same as the ToF sensor and OLED display from earlier chapters — I2C allows multiple devices as long as addresses differ." The gyroscope node explains what a gyroscope measures and that it drifts slowly over time. The accel/mag node explains that acceleration senses gravity/tilt and magnetic field acts as a compass, and that motors nearby distort the magnetic reading. The three data-type leaf nodes each explain their unit and typical use.

Color scheme: I2C bus node DodgerBlue (SENSOR taxonomy color), chip nodes white with black outline, data leaf nodes light gray. Canvas responsive to container width.
</details>

Reading either chip means talking to its registers over I2C — the same `readfrom_mem`
pattern you used for the time-of-flight sensor in Chapter 8, just with different
register addresses. Before the code: `WHO_AM_I` is a fixed register every ST sensor
chip has, and reading it back confirms you're actually talking to the chip you think you
are, before trusting any of its data.

```python
import machine

i2c = machine.I2C(0, sda=machine.Pin(16), scl=machine.Pin(17), freq=400000)
found = i2c.scan()
print("Devices found:", [hex(d) for d in found])   # expect two addresses, not one

gyro_id = i2c.readfrom_mem(0x6B, 0x0F, 1)   # WHO_AM_I register
print("Gyro chip ID:", hex(gyro_id[0]))     # expect 0xD4 or 0xD7
```

The full driver code for both chips — with all the register constants — is in the
[Swarm Robot Build Plan](../../kits/swarm-bot/plan.md), written for the exact module
this course uses.

---

## Calibrating the Gyroscope and Magnetometer

Raw sensor numbers are rarely usable straight out of the box. Two calibration steps
matter most for a heading estimate.

**Gyroscope calibration** starts simple: with the robot sitting perfectly still, the
gyroscope should report exactly 0 degrees per second on every axis. In practice it
reports a small, steady non-zero number — its **bias**. You measure that bias once, at
startup, by averaging a few hundred readings while the robot doesn't move, and subtract
it from every later reading.

**Magnetometer hard-iron calibration** is trickier, because the error isn't a simple
number — it's an *offset* in two dimensions. Nearby metal and magnets (including the
robot's own DC motors) shift every magnetometer reading by a fixed amount in the X and Y
directions, called **hard-iron distortion**. Left uncorrected, the compass heading it
computes will be consistently wrong by some fixed angle, no matter which way the robot
actually faces.

<iframe src="../../sims/magnetometer-calibration-explorer/main.html" width="100%" height="480px" scrolling="no"></iframe>

[Run the Magnetometer Calibration Explorer Fullscreen](../../sims/magnetometer-calibration-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Magnetometer Hard-Iron Calibration Explorer MicroSim</summary>
Type: microsim
**sim-id:** magnetometer-calibration-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective: Apply (Bloom L3) — rotate a simulated magnetometer through a full turn, watch the raw X/Y readings trace an off-center circle, then compute and apply the hard-iron offset to re-center it.

Canvas layout:
- Left 450px: an X/Y scatter plot (magnetometer X on horizontal axis, Y on vertical axis) with grid lines and a marked origin (0,0)
- Right 250px: control panel and numeric readouts

Visual elements:
- A scatter trail of small dots plotted as the simulated robot "rotates" — dots accumulate to trace a circle
- The circle starts deliberately off-center (simulating hard-iron distortion) with a visible offset from the origin
- A large crosshair marking the circle's actual center, computed live from (max+min)/2 on each axis
- After calibration is applied, a second, overlaid circle in a different color shows the corrected, origin-centered trace

Interactive controls:
- Slider: "Rotate robot" (0 to 360 degrees) — dragging it plots one new raw (X, Y) point per few degrees, simulating slow hand-rotation
- Button: "Auto-rotate" — animates the slider through a full 360-degree sweep automatically
- Button: "Compute Calibration" — enabled once at least one full rotation of points exists; computes offset_x = (max_x + min_x) / 2 and offset_y = (max_y + min_y) / 2, draws the crosshair, and overlays the corrected circle
- Button: "Reset"
- Numeric readout: live offset_x and offset_y values, updating the moment "Compute Calibration" is pressed

Default parameters: simulated true hard-iron offset of (35, -20) in raw sensor units, simulated circle radius 200, small random sensor noise added to each plotted point.

Behavior: the raw circle never passes through the origin until "Compute Calibration" is pressed; after that, the corrected overlay circle is visibly centered on the origin, making the effect of the offset subtraction immediately visible rather than abstract.

Instructional Rationale: this is an Apply-level objective, so the learner performs the actual calibration procedure — rotate, then compute an offset from concrete min/max values — on a simulated sensor before doing it on real hardware, with the before/after circles making the correction's effect directly observable rather than described only in words.

Implementation notes: use p5.js; store raw points in an array; compute min/max per axis incrementally as points are added; responsive canvas that maintains aspect ratio on window resize.
</details>

!!! mascot-warning "Recalibrate after you remount the sensor"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A hard-iron offset depends on exactly where the IMU sits relative to the robot's motors and battery. Move the sensor, and the offset changes. This is the single most common reason a heading-following demo suddenly stops working after a robot gets reassembled — always recalibrate after remounting.

---

## Fusing Sensors: The Complementary Filter and Heading Estimation

Neither sensor alone gives a good heading. The gyroscope is smooth and fast, but its
small bias adds up over time into slow **drift** — a robot sitting perfectly still will
report a heading that slowly creeps away from the truth. The calibrated magnetometer
doesn't drift, but on its own it's noisy, reading-to-reading. This is the same tradeoff
the general **sensor fusion** idea from Chapter 8 described for combining
time-of-flight, ultrasonic, and infrared readings — just applied to a new pair of
sensors.

A **complementary filter sensor fusion** approach blends the two: mostly trust the
gyroscope from one instant to the next (it's smooth), but let the magnetometer slowly
correct any accumulated drift (it doesn't drift). One tunable number, \( \alpha \)
(alpha), controls the blend:

\[ \text{heading} = \alpha \cdot (\text{heading}_{prev} + \dot\theta \cdot \Delta t) + (1 - \alpha) \cdot \text{heading}_{mag} \]

Here \( \dot\theta \) is the gyroscope's rotation rate and \( \Delta t \) is the time
since the last update. An \( \alpha \) near 1.0 trusts the gyroscope almost completely
moment-to-moment; a lower \( \alpha \) leans more on the (calibrated) compass. The result
of running this filter every loop iteration is **heading estimation** — a single, stable
number in degrees that the rest of the swarm code can rely on.

```python
import math

class HeadingFilter:
    def __init__(self, alpha=0.98):
        self.alpha = alpha
        self.heading = 0.0

    def update(self, gyro_z_dps, mag_x, mag_y, dt):
        gyro_estimate = self.heading + gyro_z_dps * dt
        compass_estimate = math.degrees(math.atan2(mag_y, mag_x)) % 360
        self.heading = (self.alpha * gyro_estimate
                         + (1 - self.alpha) * compass_estimate) % 360
        return self.heading
```

<iframe src="../../sims/complementary-filter-heading-tuner/main.html" width="100%" height="480px" scrolling="no"></iframe>

[Run the Complementary Filter Heading Tuner Fullscreen](../../sims/complementary-filter-heading-tuner/main.html){ .md-button }

<details markdown="1">
<summary>Complementary Filter Heading Tuner MicroSim</summary>
Type: microsim
**sim-id:** complementary-filter-heading-tuner<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective: Analyze (Bloom L4) — compare a gyro-only heading estimate, a magnetometer-only heading estimate, and the fused complementary-filter estimate against a simulated true heading, and connect the alpha slider position to which sensor dominates the fused result.

Canvas layout:
- Left 450px: a compass-rose style circular dial showing four needles in different colors (true heading, gyro-only, mag-only, fused) rotating in real time
- Right 250px: controls and a small numeric error readout for each of the three estimates versus the true heading

Visual elements:
- Circular compass dial with degree tick marks
- Four colored needles: true heading (black, the reference), gyro-only estimate (orange, visibly drifting away over time), mag-only estimate (green, visibly jittering/noisy), fused estimate (blue, tracking the true heading closely)
- A live numeric table below the dial showing current error in degrees for gyro-only, mag-only, and fused

Interactive controls:
- Slider: alpha (0.80 to 0.999, default 0.98)
- Slider: simulated gyro bias / drift rate (0 to 2 degrees/second, default 0.5)
- Slider: simulated magnetometer noise (0 to 15 degrees, default 5)
- Button: "Start Turn" — commands the simulated true heading to rotate 90 degrees over 2 seconds, then hold
- Button: "Reset"

Default parameters: alpha=0.98, gyro drift=0.5 deg/s, mag noise=5 degrees.

Behavior: with alpha near 0.999, the blue fused needle should visibly drift away from true heading (like the orange gyro-only needle) — demonstrating alpha too high ignores the compass correction. With alpha near 0.80, the blue needle should visibly jitter (like the green mag-only needle) — demonstrating alpha too low ignores gyro smoothing. Near the default 0.98, the fused needle should track the true heading more closely than either individual estimate, with the numeric error table making "closely" concrete rather than just visual.

Instructional Rationale: this is an Analyze-level objective — the learner must compare three simultaneous estimates against ground truth and attribute the fused result's behavior to the alpha parameter, so all three needles plus a live true-heading reference and numeric error readout must be visible at once, not stepped through one at a time.

Implementation notes: use p5.js; simulate true heading as a controllable state; derive gyro-only estimate by integrating (true rate + configured bias) with no correction; derive mag-only estimate as true heading plus random noise scaled by the noise slider; derive fused estimate using the exact HeadingFilter update formula shown in the surrounding chapter text so the sim matches the code. Responsive canvas.
</details>

---

## Hosting the Swarm Network: WiFi Access Point and UDP Broadcast

Chapter 11's web server connected a Pico W to an *existing* WiFi network as a station.
**WiFi access point host mode** is the opposite: the Pico W creates its *own* network,
becomes the access point other devices join, with no router involved at all. The master
robot in a heading-synchronized swarm hosts its own access point, and every follower
joins it.

Once robots share a network, **UDP broadcast networking** is how the master reaches all
of them at once without addressing each one individually. Unlike the TCP sockets from
Chapter 11's web server — which require a connected, one-to-one link — a UDP broadcast
packet is sent once to a special broadcast address, and every device on the network
receives a copy. If a packet is dropped, nothing breaks; the next one arrives a fraction
of a second later.

#### Diagram: Heading Broadcast Network Topology

<iframe src="../../sims/heading-broadcast-topology/main.html" width="100%" height="380px" scrolling="no"></iframe>

[Run the Heading Broadcast Network Topology Fullscreen](../../sims/heading-broadcast-topology/main.html){ .md-button }

<details markdown="1">
<summary>One master robot broadcasting UDP heading packets to many followers</summary>
Type: diagram
**sim-id:** heading-broadcast-topology<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Diagram Name: Heading Broadcast Network Topology

Bloom Taxonomy: Analyze

Bloom Taxonomy Verb: differentiate

Learning objective: Differentiate a one-to-many UDP broadcast topology (this section) from the one-to-one BLE pairing topology used earlier in the chapter, and from the router-based WiFi topology from Chapter 11.

Create a Mermaid flowchart (graph TD). A single node "Master Robot (hosts WiFi AP + broadcasts UDP)" connects with three identically-labeled edges, each labeled "UDP heading packet", to three follower nodes: "Follower 1", "Follower 2", "Follower 3". Add a dashed box around all four nodes labeled "Same WiFi network, master-hosted — no internet router".

Every node has a click directive with an infobox: the master node explains it both hosts the access point and sends the broadcast, unlike Chapter 11's setup where the Pico W joined someone else's router. Each follower node explains it only listens — it never sends anything back, and a dropped packet is not a failure since the next one is a fraction of a second away. Every edge has a click directive noting that this same edge is physically identical to the other two — this is what makes adding a fourth follower free of any code change on the master.

Color scheme: master node DarkOrchid (NET taxonomy color), follower nodes lighter shade of the same hue, dashed boundary box gray. Canvas responsive.
</details>

Compare this to Chapter 12's BLE leader, which had to scan for and connect to each
follower by name, one at a time. A UDP broadcast doesn't know or care how many followers
are listening — the master's code doesn't change at all when you add a fourth or fifth
robot. That's the real engineering payoff of this pattern.

---

## Heading Synchronization: Master and Follower Code

Put together, the IMU heading estimate and the UDP broadcast form a complete second
swarm pattern — the **heading synchronization swarm pattern**: a master robot computes
its own fused heading and broadcasts it; every follower computes its *own* fused heading
from its *own* sensors, and steers to close the gap between the two.

**UDP master broadcast code** hosts the access point and sends the heading on a timer:

```python
import network, socket, json, time

def start_ap(ssid, password):
    ap = network.WLAN(network.AP_IF)
    ap.config(ssid=ssid, password=password)
    ap.active(True)
    while not ap.active():
        time.sleep(0.5)
    return ap

def broadcast_loop(get_heading, port=8000):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    while True:
        payload = json.dumps({"heading": get_heading()})
        sock.sendto(payload.encode(), ("192.168.4.255", port))   # AP broadcast address
        time.sleep(0.02)   # 50 Hz
```

**UDP follower steering code** joins that network, listens for the heading, and steers
using the same proportional-only control introduced earlier in this chapter:

```python
def heading_error(target, current):
    return (target - current + 180) % 360 - 180   # shortest turn direction, -180..+180

def steer(error, base_speed, Kp=0.02):
    turn = Kp * error
    left = max(0, min(1, base_speed + turn))
    right = max(0, min(1, base_speed - turn))
    return left, right
```

The full master and follower scripts — WiFi joining, the non-blocking receive loop, and
wiring `steer()`'s output into the motor pins from `config.py` — are written out
step by step, phase by phase, in the
[Swarm Robot Build Plan](../../kits/swarm-bot/plan.md), matched to the exact
Cytron ROBO-PICO and 9-DOF IMU hardware this course uses.

Before trying it on real robots, this checklist — pulled from that build plan — heads
off the most common problems:

| Symptom | Likely cause |
|---|---|
| I2C scan finds only one address | One chip's wiring or solder joint failed — check the side that's missing |
| Heading drifts while the robot sits still | Re-run magnetometer calibration |
| Heading jumps only while driving | IMU mounted too close to a motor — add a standoff, recalibrate |
| Follower never turns | Confirm it joined the master's access point, and that both sides use the same UDP port |
| Follower steering oscillates back and forth | `Kp` is too high — this is exactly the overshoot behavior the PID tuner MicroSim showed earlier in this chapter |

---

## Key Takeaways

- **Swarm robotics** studies how simple per-robot rules produce **emergent behavior** at
  the group level, with no single robot holding the whole plan
- The **leader-follower pattern** from Chapter 12 extends into **collective obstacle
  avoidance**, **convoy following**, and **synchronized dance** — all **distributed
  systems** running the same **swarm algorithm design** idea
- A **state machine pattern** organizes a robot's competing behaviors into named states
  with clear transitions, instead of tangled `if` statements
- Real swarm projects need **project planning** and **team collaboration**, just like
  professional engineering teams
- **Multithreading** and **asynchronous programming** are two different techniques for
  doing several things "at once" in MicroPython
- **PID control** generalizes closed-loop feedback into proportional, integral, and
  derivative terms; **encoder motor feedback** gives it a more precise input signal;
  **data logging** lets you review a tuning run after the fact
- A **9-DOF IMU** — here, the **L3GD20 gyroscope** and **LSM303D accelerometer/
  magnetometer** — needs **gyroscope calibration** and **magnetometer hard-iron
  calibration** before its readings mean anything
- A **complementary filter** fuses gyro and compass into a stable **heading estimate**
- **WiFi access point host mode** plus **UDP broadcast networking** let one master reach
  any number of followers with no per-robot connection — the network layer underneath
  the **heading synchronization swarm pattern**

!!! mascot-celebration "You just built two different kinds of swarm — that's real engineering!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Look at everything you can do now: pair robots over BLE, organize their behavior with a state machine, tune a PID controller, and build a completely independent WiFi-based swarm from a 9-DOF sensor you calibrated yourself. That's not "following a robotics tutorial" anymore — that's engineering judgment. Computational thinking is YOUR superpower, and you've just proven it on hardware. Congratulations, engineer!
