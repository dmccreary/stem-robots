---
title: "Hardware Troubleshooting Detective"
description: "Solve broken-robot cases by choosing which of the six hardware checks to run, reading the clues, and naming the hidden fault with as few checks as possible."
image: /sims/hardware-troubleshooting-detective/hardware-troubleshooting-detective.png
og:image: /sims/hardware-troubleshooting-detective/hardware-troubleshooting-detective.png
twitter:image: /sims/hardware-troubleshooting-detective/hardware-troubleshooting-detective.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Hardware Troubleshooting Detective

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Hardware Troubleshooting Detective MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every robot in this MicroSim has one hidden problem. Your job is to find it,
like a detective. You get a **symptom**, such as "The robot spins in a
circle instead of driving straight." Then you choose which checks to run.

The six checks are the same ones in the chapter's hardware checklist. Each
check looks at one part of the robot and draws a ring around it:

- A **green** ring means that part looks fine.
- An **amber** ring means a clue. Something is off, but this is not the
  cause.
- A **red** ring means you found the problem.

Each check costs 10 points, so think before you click. The best detectives
pick the check that rules out the most suspects first.

## How to Use

1. **Read the symptom** in the case panel.
2. **Pick a check.** Ask yourself which check fits the symptom best, and
   which one is fastest.
3. **Read the result** in the results log and look at the ring on the robot.
4. **Choose your hypothesis** from the dropdown and press **Submit
   hypothesis**. A wrong guess costs 20 points. A hint costs 10.
5. When you solve the case, read the fix. Then press **New broken robot**
   for another case.

**Challenge:** Solve three robots in a row with a score of 60 or more each.
Then decide which check you would run first if your robot's motors do not
spin at all, and explain why. The checklist is in
[Chapter 2: Hardware Troubleshooting](../../chapters/02-hardware-platform-assembly/index.md#hardware-troubleshooting).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/hardware-troubleshooting-detective/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *analyze* a robot symptom, *select* the troubleshooting check
most likely to isolate the fault, and *justify* the order of their checks in
terms of cost and diagnostic value (Bloom's Taxonomy: Analyze).

### Grade Level

Grades 8–12.

### Duration

20 minutes.

### Prerequisites

- The "Hardware Troubleshooting" checklist in
  [Chapter 2](../../chapters/02-hardware-platform-assembly/index.md),
  including the GP16/GP17 Grove port for the time-of-flight sensor and the
  onboard pin LEDs.
- The one-change-at-a-time debugging strategy from
  [Chapter 1](../../chapters/01-intro-computational-thinking/index.md#a-strategy-for-hard-problems).

### Background

Expert troubleshooters differ from novices less in what they know than in
how they sequence tests: they begin with inexpensive checks that eliminate
large classes of faults (Jonassen & Hung, 2006). The scoring model makes this
trade-off explicit. Every check costs points, wrong hypotheses cost more, and
amber "clue" results reward students who reason from partial evidence. For
example, "every LED is dark" does not identify a fault by itself, but it
points strongly toward power.

### Activities

1. **Model (4 min).** Project one case. Think aloud: read the symptom, list
   two or three suspects, and choose the check that separates them. Run it
   and interpret the ring color.
2. **Paired cases (10 min).** Pairs solve cases, taking turns as "detective"
   (chooses and justifies each check) and "recorder" (writes the symptom,
   the checks in order, and the result). Aim for the three-case challenge.
3. **Compare strategies (3 min).** Two pairs who solved the same symptom
   compare their check order and scores.
4. **Transfer (3 min).** Each student answers: "Your robot's motors do not
   spin at all. Which check do you run first, and why?" A strong answer is
   *Is it powered?*, because it is fast and rules out a whole group of
   faults at once.

### Assessment

- **Formative:** Review the recorder sheets for justified check choices,
  not just correct final answers.
- **Performance task:** Three solved cases in a row with a score of 60 or
  more.
- **Rubric (4-point):** *Exemplary* — first check matches the symptom and
  each later check is justified by earlier results, including amber clues;
  *Proficient* — relevant first check and correct diagnosis within three
  checks; *Developing* — reaches the right answer by trying most checks in
  list order; *Beginning* — guesses hypotheses without running checks.

## References

1. [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md) — the six-item hardware troubleshooting checklist.
2. [Troubleshooting — Wikipedia](https://en.wikipedia.org/wiki/Troubleshooting) — systematic methods for isolating faults.
3. [Polarity (electrical) — Wikipedia](https://en.wikipedia.org/wiki/Electrical_polarity) — why battery orientation matters.
4. [Cytron Maker Pi RP2040 product page](https://www.cytron.io/p-maker-pi-rp2040-simplifying-robotics-with-raspberry-pi-rp2040) — the board's Grove ports, motor terminals, and pin LEDs.
5. Jonassen, D. H., & Hung, W. (2006). Learning to troubleshoot: A new theory-based design architecture. *Educational Psychology Review, 18*(1), 77–114.
