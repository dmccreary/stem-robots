---
title: Collision Avoidance Decision Flow
description: Type: diagram **sim-id:** collision-decision-flow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid flowchart (graph TD) showing: - Start node: "Read distance sensor" - Diamond: "distance_cm < 20?" — Yes branch leads...
image: /sims/collision-decision-flow/collision-decision-flow.png
og:image: /sims/collision-decision-flow/collision-decision-flow.png
twitter:image: /sims/collision-decision-flow/collision-decision-flow.png
social:
   cards: false
status: implemented
library: Mermaid
bloom_level: TBD
---

# Collision Avoidance Decision Flow

<iframe src="main.html" width="100%" height="960" scrolling="no"></iframe>

[Run the Collision Avoidance Decision Flow MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: diagram **sim-id:** collision-decision-flow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid flowchart (graph TD) showing: - Start node: "Read distance sensor" - Diamond: "distance_cm < 20?" — Yes branch leads...

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/collision-decision-flow/main.html" width="100%" height="960" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: diagram **sim-id:** collision-decision-flow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid flowchart (graph TD) showing: - Start node: "Read distance sensor" - Diamond: "distance_cm < 20?" — Yes branch leads...

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- [Obstacle avoidance (Wikipedia)](https://en.wikipedia.org/wiki/Obstacle_avoidance)
- [MicroPython documentation](https://docs.micropython.org/)

## Specification

The full specification below is extracted from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

```text
Type: diagram
**sim-id:** collision-decision-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a Mermaid flowchart (graph TD) showing:
- Start node: "Read distance sensor"
- Diamond: "distance_cm < 20?" — Yes branch leads to "Stop motors" box, No branch continues
- Diamond: "distance_cm < 50?" — Yes branch leads to "Slow down" box, No branch continues
- Final box: "Full speed ahead"
- All terminal boxes have arrows back to "Read distance sensor" (loop)

Every decision diamond and action box has a click directive that opens an infobox explaining what that step does in plain language.

Canvas: 500 × 450 px. Responsive on window resize.
```

