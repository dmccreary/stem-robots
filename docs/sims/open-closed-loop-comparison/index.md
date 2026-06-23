---
title: Open-Loop vs. Closed-Loop Control
description: Type: diagram **sim-id:** open-closed-loop-comparison<br/> **Library:** Mermaid<br/> **Status:** Specified  Create two Mermaid flowcharts side by side (use subgraph):  Left subgraph "Open-Loop": Controller → Actuator (Motors) → Output (R...
image: /sims/open-closed-loop-comparison/open-closed-loop-comparison.png
og:image: /sims/open-closed-loop-comparison/open-closed-loop-comparison.png
twitter:image: /sims/open-closed-loop-comparison/open-closed-loop-comparison.png
social:
   cards: false
status: implemented
library: Mermaid
bloom_level: TBD
---

# Open-Loop vs. Closed-Loop Control

<iframe src="main.html" width="100%" height="560" scrolling="no"></iframe>

[Run the Open-Loop vs. Closed-Loop Control MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: diagram **sim-id:** open-closed-loop-comparison<br/> **Library:** Mermaid<br/> **Status:** Specified  Create two Mermaid flowcharts side by side (use subgraph):  Left subgraph "Open-Loop": Controller → Actuator (Motors) → Output (R...

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/open-closed-loop-comparison/main.html" width="100%" height="560" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: diagram **sim-id:** open-closed-loop-comparison<br/> **Library:** Mermaid<br/> **Status:** Specified  Create two Mermaid flowcharts side by side (use subgraph):  Left subgraph "Open-Loop": Controller → Actuator (Motors) → Output (R...

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md)
- [Control theory (Wikipedia)](https://en.wikipedia.org/wiki/Control_theory)
- [Feedback (Wikipedia)](https://en.wikipedia.org/wiki/Feedback)

## Specification

The full specification below is extracted from [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md).

```text
Type: diagram
**sim-id:** open-closed-loop-comparison<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create two Mermaid flowcharts side by side (use subgraph):

Left subgraph "Open-Loop":
Controller → Actuator (Motors) → Output (Robot Motion)
No feedback arrow.

Right subgraph "Closed-Loop":
Controller → Actuator (Motors) → Output (Robot Motion) → Sensor (Distance) → Error Calculation → Controller (loop back)

Every node has a click directive opening an infobox explaining that component's role. Error node infobox explains: "Error = Goal distance - Measured distance. If error > 0, speed up. If error < 0, slow down or stop."

Canvas: 700 × 300 px. Responsive on window resize.
```

