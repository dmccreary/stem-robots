---
title: "Robot Decomposition Tree"
description: 'Split a big robot goal such as "Avoid the wall" into smaller tasks, and keep splitting until every piece is small enough to write as a line or two of MicroPython.'
image: /sims/robot-decomposition-tree/robot-decomposition-tree.png
og:image: /sims/robot-decomposition-tree/robot-decomposition-tree.png
twitter:image: /sims/robot-decomposition-tree/robot-decomposition-tree.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Robot Decomposition Tree

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Robot Decomposition Tree MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

**Decomposition** means cutting a big problem into smaller pieces. A goal
like "Avoid the wall" is too big to code all at once. But "Stop both motors"
is small. You can write it in one line.

This MicroSim shows decomposition as a **tree**. The big goal sits at the
top. Each time you split a task, its smaller tasks grow underneath it. When a
task is small enough to code, it turns green and shows a one-line MicroPython
idea, such as `motor_forward(75)`. Your job is to keep splitting until every
piece is green.

## How to Use

1. **Pick a goal** from the Robot goal dropdown. "Avoid the wall" is the
   same example used in the chapter.
2. **Click a box** in the tree to select it. It gets an orange outline.
3. **Press Split it** to break the selected task into two or three smaller
   tasks.
4. **Press Small enough to code?** to test a task. If it is small enough, it
   turns green and shows a code idea. If not, you will see "Still too big. Can
   you split it more?"
5. **Watch the status panel.** It counts how many pieces are ready. When
   every piece is green, the tree glows and says "Fully decomposed!"
6. Press **Reset** to start the same goal again.

**Challenge:** Fully decompose "Avoid the wall." How many green pieces do you
end up with? Which of the four pillars of computational thinking did you just
use? You can check your answer in
[Chapter 1](../../chapters/01-intro-computational-thinking/index.md#decomposition-breaking-problems-apart).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/robot-decomposition-tree/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* decomposition to a robot goal by recursively splitting
it into sub-tasks, and will *judge* when a sub-task is small enough to
implement directly as one or two MicroPython statements (Bloom's Taxonomy:
Apply).

### Grade Level

Grades 8–12. No programming experience is required.

### Duration

15–20 minutes.

### Prerequisites

- The "What Is Computational Thinking?" section of
  [Chapter 1](../../chapters/01-intro-computational-thinking/index.md),
  especially the three-task breakdown of "avoid the wall" under
  *Decomposition: Breaking Problems Apart*.
- A general sense that a robot has motors and a distance sensor.

### Background

Decomposition is the pillar of computational thinking most directly tied to
program structure: each leaf of a well-formed decomposition tree typically
becomes a function call or a short block of statements (Wing, 2006). The
"Small enough to code?" check makes the stopping criterion explicit, which is
the step novices most often skip—they either stop splitting too early (a leaf
such as "stop and turn" still hides three actions) or split past the level of
useful abstraction.

### Activities

1. **Paper first (4 min).** Before opening the MicroSim, have pairs write the
   goal "Show distance on the OLED" on a sticky note and split it into smaller
   notes until each note could be one line of code.
2. **Compare (3 min).** Pairs load the same goal in the MicroSim and compare
   their paper tree with the answer bank. Discuss differences: is one tree
   wrong, or just different?
3. **Guided decomposition (5 min).** Pairs fully decompose "Avoid the wall."
   Ask them to press **Small enough to code?** on "If distance is under 20 cm,
   stop and turn" *before* splitting it, and explain why it is still too big.
4. **Challenge (3 min).** Pairs answer the challenge: 5 green pieces, using
   the pillar of decomposition.
5. **Transfer (3 min).** Pairs decompose "Follow a line" and point out which
   green pieces also appear in "Avoid the wall"—a bridge to *pattern
   recognition*.

### Assessment

- **Formative:** Circulate during Activity 3 and ask each pair why the
  "stop and turn" task failed the check.
- **Exit ticket:** Give a new goal ("Play a tune when a button is pressed")
  and ask students to draw a two-level decomposition tree and circle the
  leaves that are small enough to code.
- **Rubric (4-point):** *Exemplary* — every leaf maps to one clear action and
  no leaf hides a decision plus an action; *Proficient* — most leaves are
  codable, with at most one leaf needing another split; *Developing* — the
  tree has only one level or mixes several actions per leaf; *Beginning* —
  restates the goal without splitting it.

## References

1. [Chapter 1: Introduction to Computational Thinking and Physical Computing](../../chapters/01-intro-computational-thinking/index.md) — the four pillars of computational thinking and the "avoid the wall" example.
2. [Decomposition (computer science) — Wikipedia](https://en.wikipedia.org/wiki/Decomposition_(computer_science)) — breaking a system into parts that are easier to build and understand.
3. [Computational thinking — Wikipedia](https://en.wikipedia.org/wiki/Computational_thinking) — decomposition, abstraction, pattern recognition, and algorithm design.
4. Wing, J. M. (2006). [Computational thinking](https://doi.org/10.1145/1118178.1118215). *Communications of the ACM, 49*(3), 33–35.
5. [Decomposition in Action MicroSim (Moving Rainbow)](https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/decomposition-in-action) — the LED-strip decomposition tree this MicroSim was adapted from.
