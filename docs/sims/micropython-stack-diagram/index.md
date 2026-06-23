---
title: MicroPython in the Stack
description: Type: diagram **sim-id:** micropython-stack-diagram<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a vertical stack diagram using Mermaid showing the four layers of the system:  Layer 1 (top): "Your Code (the program you wr...
image: /sims/micropython-stack-diagram/micropython-stack-diagram.png
og:image: /sims/micropython-stack-diagram/micropython-stack-diagram.png
twitter:image: /sims/micropython-stack-diagram/micropython-stack-diagram.png
social:
   cards: false
status: implemented
library: Mermaid
bloom_level: TBD
---

# MicroPython in the Stack

<iframe src="main.html" width="100%" height="760" scrolling="no"></iframe>

[Run the MicroPython in the Stack MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: diagram **sim-id:** micropython-stack-diagram<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a vertical stack diagram using Mermaid showing the four layers of the system:  Layer 1 (top): "Your Code (the program you wr...

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/micropython-stack-diagram/main.html" width="100%" height="760" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: diagram **sim-id:** micropython-stack-diagram<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a vertical stack diagram using Mermaid showing the four layers of the system:  Layer 1 (top): "Your Code (the program you wr...

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md)
- [MicroPython documentation](https://docs.micropython.org/)
- [MicroPython (Wikipedia)](https://en.wikipedia.org/wiki/MicroPython)

## Specification

The full specification below is extracted from [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md).

```text
Type: diagram
**sim-id:** micropython-stack-diagram<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a vertical stack diagram using Mermaid showing the four layers of the system:

Layer 1 (top): "Your Code (the program you write)" — light blue background
Layer 2: "MicroPython Interpreter" — orange background, labeled "translates your code into machine instructions"
Layer 3: "MicroPython Firmware" — yellow background, labeled "lives on the RP2040 flash memory"
Layer 4 (bottom): "Hardware (RP2040 chip, motors, sensors)" — gray background

Use Mermaid graph TD (top-down). Each node has a click directive that opens an infobox describing that layer. Arrow labels show the direction of control (Your Code → MicroPython → Hardware) and the direction of data (Hardware → MicroPython → Your Code).

Canvas: 400 × 300 px. Responsive: redraw on window resize.
```

