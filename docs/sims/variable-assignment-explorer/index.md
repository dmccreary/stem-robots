---
title: Variable Assignment Interactive Explorer
description: Type: MicroSim **sim-id:** variable-assignment-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 350 canvas.
image: /sims/variable-assignment-explorer/variable-assignment-explorer.png
og:image: /sims/variable-assignment-explorer/variable-assignment-explorer.png
twitter:image: /sims/variable-assignment-explorer/variable-assignment-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# Variable Assignment Interactive Explorer

<iframe src="main.html" width="100%" height="352" scrolling="no"></iframe>

[Run the Variable Assignment Interactive Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** variable-assignment-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 350 canvas.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/variable-assignment-explorer/main.html" width="100%" height="352" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** variable-assignment-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 350 canvas.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md)
- [Python tutorial: an informal introduction](https://docs.python.org/3/tutorial/introduction.html)
- [Assignment (computer science) (Wikipedia)](https://en.wikipedia.org/wiki/Assignment_(computer_science))

## Specification

The full specification below is extracted from [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md).

```text
Type: MicroSim
**sim-id:** variable-assignment-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 350 canvas. Show a left panel with two input fields where the user can type a variable name and a value. When they click "Assign", an animated arrow flies from an "Assignment statement" box on the left to a "Memory box" on the right, and the memory box updates with the new variable name and value. Show up to 4 memory boxes stacked vertically on the right.

Add a "Reset" button that clears all memory boxes with a fade-out animation.

Hovering a memory box shows a tooltip: "Variable: [name] stores [value] of type [type]."

Learning objective (Bloom's Taxonomy — Applying): students practice the concept that assignment stores a value in a named location, not that two things are equal.

Responsive: redraw on window resize. Font size: 14px. Color scheme: navy blue memory boxes, yellow arrow animation, orange labels.
```

