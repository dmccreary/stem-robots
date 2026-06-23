---
title: Robot Assembly Workflow
description: Students will sequence the eight assembly steps in the correct order and explain the mechanical reason each step precedes the next (e.g., why standoffs must be installed before the board is mounted).
image: /sims/robot-assembly-workflow/robot-assembly-workflow.png
og:image: /sims/robot-assembly-workflow/robot-assembly-workflow.png
twitter:image: /sims/robot-assembly-workflow/robot-assembly-workflow.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply (L3) — Assemble the Smart Car chassis by following the correct sequence of steps and explain why each step comes before the next.
---

# Robot Assembly Workflow

<iframe src="main.html" width="100%" height="522" scrolling="no"></iframe>

[Run the Robot Assembly Workflow MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Students will sequence the eight assembly steps in the correct order and explain the mechanical reason each step precedes the next (e.g., why standoffs must be installed before the board is mounted).

**Bloom's Taxonomy level:** Apply (L3) — Assemble the Smart Car chassis by following the correct sequence of steps and explain why each step comes before the next.

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/robot-assembly-workflow/main.html" width="100%" height="522" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Students will sequence the eight assembly steps in the correct order and explain the mechanical reason each step precedes the next (e.g., why standoffs must be installed before the board is mounted).

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md)
- [Cytron Maker Pi RP2040](https://www.cytron.io/p-maker-pi-rp2040)
- [Robot kit (Wikipedia)](https://en.wikipedia.org/wiki/Robot_kit)

## Specification

The full specification below is extracted from [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md).

```text
Type: workflow
**sim-id:** robot-assembly-workflow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3) — Assemble the Smart Car chassis by following the correct sequence of steps and explain why each step comes before the next.
Bloom Verb: Assemble

Learning Objective: Students will sequence the eight assembly steps in the correct order and explain the mechanical reason each step precedes the next (e.g., why standoffs must be installed before the board is mounted).

Layout:
- Eight vertical steps arranged as a top-to-bottom flowchart
- Each step is a rounded rectangle with a step number, short title, and a simple icon
- Downward arrow connectors between steps
- Right side: Expanded detail panel that appears when a step is clicked

Steps with icons and click-to-expand detail text:

Step 1 — Attach Motors
Icon: Motor + gear
Detail: "Mount each motor into its plastic bracket with two M3 screws. Both shafts point outward. Reason for first: motors are hardest to reach once the board is mounted above them."

Step 2 — Install Standoffs
Icon: Four pillars
Detail: "Thread four M3 nylon standoffs through the chassis corner holes; nuts below. Use nylon — metal standoffs can short the board. Reason: the board mounts onto these standoffs next."

Step 3 — Route Motor Wires
Icon: Two-color wire
Detail: "Thread red and black motor wires up through the chassis opening to the top surface. Reason: impossible to route wires cleanly after the board covers the opening."

Step 4 — Mount Cytron Board
Icon: PCB outline
Detail: "Lower the board onto the standoffs and secure with M3 screws. Board must sit flat with no rocking. Reason: the board must be in place before wires reach its terminals."

Step 5 — Connect Motor Terminals
Icon: Screw terminal
Detail: "Left motor wires go into M1, right into M2. Tighten each screw and tug to confirm grip. Reason: a loose wire causes erratic motor behavior that looks like a software bug."

Step 6 — Attach Wheels
Icon: Yellow wheel
Detail: "Press each wheel onto its shaft until it clicks. Spin by hand — must spin freely and sit perpendicular. Reason: a crooked wheel causes the robot to veer even when code is perfect."

Step 7 — Connect Battery Pack
Icon: AA batteries
Detail: "Red wire to + terminal, black to − terminal. Never reverse polarity. Reason: reversed polarity can permanently damage the motor driver chips."

Step 8 — Connect Sensor Cable
Icon: Grove plug
Detail: "Plug the time-of-flight sensor Grove cable into the GP16/GP17 port. Tuck excess cable. Reason: this sensor is used in every collision-avoidance lab starting in Chapter 8."

Visual style:
- Steps use a blue-to-green gradient (step 1 = blue, step 8 = green) to represent assembly progress
- Clicked step highlighted with orange border; all others remain their gradient color
- Detail panel slides in smoothly from the right on click
- Completed steps show a small green checkmark in the top-right corner after being clicked
- Arrow connectors: gray with directional arrowheads

Responsive behavior: Flowchart scales with window width. On narrow viewports, detail panel stacks below the flowchart. Step rectangles maintain a minimum 80 px height.

Instructional Rationale: A clickable workflow at the Apply level gives students a scaffold to consult during physical assembly. Revealing "why this step is here" turns a rote procedure into deliberate reasoning about mechanical dependencies — the same decomposition thinking introduced in Chapter 1.
```

