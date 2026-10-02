---
title: "Swarm Robot State Machine"
description: "Interactive state machine for a swarm robot's SEARCH, FOLLOW, DANCE, and AVOID modes, with event buttons that step the robot through transitions and a quiz that asks students to classify robot situations by state."
image: /sims/swarm-robot-state-machine/swarm-robot-state-machine.png
og:image: /sims/swarm-robot-state-machine/swarm-robot-state-machine.png
twitter:image: /sims/swarm-robot-state-machine/swarm-robot-state-machine.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Swarm Robot State Machine

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the Swarm Robot State Machine MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/swarm-robot-state-machine/main.html"
        height="472px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A **state machine** describes a program as a small set of named **states** plus the rules
for moving between them. At any moment, the robot is in exactly one state, and only that
state's code runs. A **transition** is an arrow from one state to another. It fires when
a matching **event** happens, such as "leader signal found."

This swarm robot has four states:

| State | Color | What the robot is doing |
|---|---|---|
| **SEARCH** | gray | Scanning for the leader's advertising signal, motors idle |
| **FOLLOW** | green | Connected to the leader and running its convoy or command logic |
| **DANCE** | purple | Doing a timed dance step, synced to the leader's beat |
| **AVOID** | red | Its own time-of-flight sensor reported an obstacle |

Look at the red dashed arrows. Every other state has an arrow into **AVOID** labeled
"obstacle too close." That is a deliberate design choice: a safety behavior has to be
able to interrupt anything the robot is doing.

The MicroSim has two modes:

- **Explore events:** the gold outline marks the current state. Press an event button. If
  the current state has an arrow for that event, the robot moves along it and the arrow
  lights up. If not, the robot ignores the event. Event buttons with a green background
  have an arrow out of the current state.
- **Classify quiz:** read a short description of what a robot is doing, then click the
  state box it belongs to.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Organizing Multi-Behavior Code with a State Machine."

## How to Use

1. Hover over (or tap) each state box and each arrow label. Read the **Details** card.
2. In **Explore events**, the robot starts in SEARCH. Press **leader signal found**, then
   **dance beat received**. Where is the robot now?
3. From DANCE, press **signal lost**. What happens, and why?
4. Press **obstacle too close** from three different states. Where does the robot end up
   each time?
5. Switch to **Classify quiz** and try all ten situations. Can you get them all right?
6. **Restart** puts the robot back in SEARCH.

## Lesson Plan

### Learning Objective

Students will *explain* (Bloom's Taxonomy: Understand) how a state machine organizes a
robot's competing behaviors (search, follow, dance, avoid) into a single clear structure,
*classify* robot situations into the correct state, and *explain* why the AVOID
transition can interrupt any state.

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Prerequisites

- `if`/`elif` decisions and loops from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- The sense-decide-act feedback loop from
  [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md)
- BLE advertising and connections from
  [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md)

### Activities

1. **Trace a run (5 min):** Read this event list aloud while students predict each state
   before pressing the button: found, beat, obstacle, clear, lost. (Expected path:
   SEARCH → FOLLOW → DANCE → AVOID → FOLLOW → SEARCH.)
2. **Ignored events (3 min):** Ask students to find three event and state pairs that do
   nothing, such as "routine finished" while in SEARCH, and explain why the robot ignores
   them.
3. **Classify quiz (5 min):** Students complete all ten quiz situations individually and
   then compare answers with a partner. Discuss any disagreements, especially the
   situations that start in one state and end in another.
4. **Code connection (5 min):** Students sketch the `while True:` loop as an
   `if state == "SEARCH": ... elif state == "FOLLOW": ...` chain, with the obstacle check
   placed before the chain so it can interrupt every state.

### Discussion Questions

- Why is it easier to debug four named states than one long chain of nested `if`
  statements?
- The AVOID state always returns to FOLLOW. What problem could that cause if the robot was
  in SEARCH before the obstacle, and how could you fix it?
- Which state gets the most incoming arrows, and what does that tell you about the
  designer's priorities?

### Assessment

- **Formative:** Quiz score in Classify mode (target: 9 of 10 or better) and the traced
  path from Activity 1.
- **Exit ticket:** "Add a new state, CHARGE, that the robot enters when its battery is low.
  Which existing states need an arrow to CHARGE, and does CHARGE need an arrow to AVOID?"
- **Rubric (4-point):** *Exemplary* — traces any event sequence correctly and justifies
  why safety transitions leave every state; *Proficient* — traces sequences correctly;
  *Developing* — identifies states but misses ignored events; *Beginning* — treats
  states as steps that always run in a fixed order.

## References

1. [Finite-state machine (Wikipedia)](https://en.wikipedia.org/wiki/Finite-state_machine) —
   states, events, and transitions, with everyday examples.
2. [State diagram (Wikipedia)](https://en.wikipedia.org/wiki/State_diagram) — how state
   machines are drawn as boxes and labeled arrows.
3. [Behavior-based robotics (Wikipedia)](https://en.wikipedia.org/wiki/Behavior-based_robotics) —
   organizing a robot as competing behaviors with priorities, such as safety first.
4. [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html) — the
   diagram language used to draw this state machine.
5. [MicroPython bluetooth module documentation](https://docs.micropython.org/en/latest/library/bluetooth.html) —
   the BLE advertising and connection events behind "leader signal found" and
   "signal lost."
