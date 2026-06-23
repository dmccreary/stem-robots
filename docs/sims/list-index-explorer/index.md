---
title: List Index Explorer
description: Type: MicroSim **sim-id:** list-index-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 300 canvas.
image: /sims/list-index-explorer/list-index-explorer.png
og:image: /sims/list-index-explorer/list-index-explorer.png
twitter:image: /sims/list-index-explorer/list-index-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: TBD
---

# List Index Explorer

<iframe src="main.html" width="100%" height="302" scrolling="no"></iframe>

[Run the List Index Explorer MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: MicroSim **sim-id:** list-index-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 300 canvas.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/list-index-explorer/main.html" width="100%" height="302" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: MicroSim **sim-id:** list-index-explorer<br/> **Library:** p5.js<br/> **Status:** Specified  Create a p5.js MicroSim with a 700 × 300 canvas.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md)
- [Python lists tutorial](https://docs.python.org/3/tutorial/introduction.html#lists)
- [Array data structure (Wikipedia)](https://en.wikipedia.org/wiki/Array_data_structure)

## Specification

The full specification below is extracted from [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).

```text
Type: MicroSim
**sim-id:** list-index-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 300 canvas. Show a horizontal array of 5 colored boxes labeled with values (e.g., "red", "green", "blue", "orange", "purple"). Above each box, display the positive index (0, 1, 2, 3, 4). Below each box, display the negative index (-5, -4, -3, -2, -1).

Controls:
- A slider "Index" from -5 to 4 selects a box, which highlights yellow with a glowing border.
- A text display shows: "colors[X] = 'value'" where X is the current index.
- A "Iterate" button animates the highlight moving left to right through all items with a 500ms delay between steps.

Clicking any box directly selects it and updates the index display.

Learning objective (Bloom's Taxonomy — Applying): students practice accessing specific items by index, including negative indexing.

Responsive: redraw on window resize.
```

