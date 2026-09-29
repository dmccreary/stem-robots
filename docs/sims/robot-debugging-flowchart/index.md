---
title: Robot Debugging Flowchart
description: Pick a robot symptom and answer yes-or-no questions one step at a time to decide whether the problem is hardware or code and find one thing to change.
image: /sims/robot-debugging-flowchart/robot-debugging-flowchart.png
og:image: /sims/robot-debugging-flowchart/robot-debugging-flowchart.png
twitter:image: /sims/robot-debugging-flowchart/robot-debugging-flowchart.png
social:
   cards: false
quality_score: 100
---

# Robot Debugging Flowchart

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Robot Debugging Flowchart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

When your robot does not work, it is easy to feel stuck. Engineers get
unstuck by asking small yes-or-no questions, one at a time. Each answer rules
something out. A **flowchart** is a picture of those questions and where each
answer leads.

In this flowchart, yellow diamonds are **questions**. Blue boxes are
**actions**, or things to try. Green boxes are **fixes**. Every box also has a
tag that says whether the problem is in the **Hardware** (wires, batteries,
switches) or in the **Code**. Every path ends with just one thing to change.

## How to Use

1. **Pick a symptom** from the Symptom dropdown, such as "Robot spins instead
   of going straight."
2. **Read the question** with the orange outline.
3. **Press Yes or No.** The flowchart follows your answer. Questions you
   already answered turn gray and get a green check mark. A thick navy line
   shows the path you took.
4. **Read your trail.** The "What I have learned" strip lists every answer, so
   you can see your own reasoning.
5. **Finish the path.** When you reach the last box, change only that one
   thing on your robot, then test again. Press **Restart** to try a different
   answer.

**Challenge:** Choose "Robot spins instead of going straight" and answer No,
No, Yes. What is the last action box? Which step of the debugging table in
[Chapter 1](../../chapters/01-intro-computational-thinking/index.md#debugging-what-to-do-when-things-break)
does it match?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/robot-debugging-flowchart/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* a structured, one-question-at-a-time debugging
procedure to a robot symptom, *classify* the likely cause as hardware or
code, and *select* a single change to test (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12. No programming experience is required.

### Duration

15–20 minutes.

### Prerequisites

- The "A Strategy for Hard Problems" and "Debugging: What to Do When Things
  Break" sections of [Chapter 1](../../chapters/01-intro-computational-thinking/index.md),
  including the five-row debugging table.
- The difference between a syntax error and a logic error, as defined in the
  same section.

### Background

The flowchart operationalizes the chapter's five-step strategy (understand,
decompose, hypothesize, test one thing, learn from the result) as a binary
decision tree. Each question eliminates one class of causes, which is the same
half-splitting logic technicians use in fault isolation. The "Robot runs but
does the wrong thing" path deliberately contrasts *intermittent* faults, which
usually point to hardware, with *repeatable* faults, which usually point to
code.

### Activities

1. **Warm-up (3 min).** Ask students to describe the last time a device
   failed and what they checked first. Record the checks on the board, then
   sort them into "hardware" and "code".
2. **Guided walk-through (4 min).** Project the MicroSim. Choose "Nothing
   happens when I power on" and have the class vote on each answer before you
   press Yes or No. Point out the Hardware and Code tags on each result box.
3. **Paired practice (6 min).** Pairs work through the other three symptoms.
   For each path, one student reads the questions and the other records the
   log trail and the final box.
4. **Challenge (3 min).** Pairs complete the challenge on this page. The
   answer is "Add a print statement for each speed", which matches the "Add a
   print statement" row of the chapter's debugging table.
5. **Debrief (3 min).** Ask: "Why does every path end with only one thing to
   change?" Connect the answer to controlled experiments in science class.

### Assessment

- **Formative:** Collect each pair's recorded log trails and check that the
  final box follows logically from the answers.
- **Exit ticket:** Give a new symptom, such as "only the left wheel turns",
  and ask students to write the first two yes-or-no questions they would ask
  and whether each points to hardware or code.
- **Rubric (4-point):** *Exemplary* — questions are ordered from quickest
  check to slowest and each is tagged correctly; *Proficient* — questions are
  relevant and tagged correctly; *Developing* — questions are relevant but
  combine several changes at once; *Beginning* — proposes rewriting the
  program without isolating a cause.

## References

1. [Chapter 1: Introduction to Computational Thinking and Physical Computing](../../chapters/01-intro-computational-thinking/index.md) — the problem-solving strategy and debugging table that this flowchart follows.
2. [Debugging — Wikipedia](https://en.wikipedia.org/wiki/Debugging) — history of the term and common debugging techniques.
3. [Flowchart — Wikipedia](https://en.wikipedia.org/wiki/Flowchart) — standard shapes for decisions (diamonds) and process steps (boxes).
4. [Troubleshooting — Wikipedia](https://en.wikipedia.org/wiki/Troubleshooting) — half-splitting and other systematic fault-isolation methods.
5. [Thonny Python IDE](https://thonny.org/) — the editor where students read MicroPython error messages.
