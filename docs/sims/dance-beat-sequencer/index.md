---
title: Dance Beat Sequencer
description: An 8-beat timeline where students convert BPM into seconds per beat, arrange timed robot moves, preview the dance, and see the matching dance() code.
image: /sims/dance-beat-sequencer/dance-beat-sequencer.png
og:image: /sims/dance-beat-sequencer/dance-beat-sequencer.png
twitter:image: /sims/dance-beat-sequencer/dance-beat-sequencer.png
social:
   cards: false
quality_score: 100
---

# Dance Beat Sequencer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Dance Beat Sequencer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A robot dance is a list of moves, and each move lasts a set number of beats.
To turn beats into time, we use one simple rule:

**seconds per beat = 60 / BPM**

BPM means *beats per minute*. At 120 BPM, one beat lasts 60 / 120 = 0.5 seconds.
A move that lasts two beats runs for 2 x 0.5 = 1.0 second.

This MicroSim has three parts:

- **Timeline.** Eight beats, each split into two half-beat cells. Every colored block is one move. The block shows how many seconds its `sleep()` needs at the current tempo. Empty cells become gray "rest" blocks, which means `stop_motors()`.
- **Stage.** A top view of a small robot that performs the dance. Forward and Back move it 30 pixels per beat. A spin turns it 90 degrees every half beat.
- **Code box.** The `dance()` function that matches the timeline, in the same style as the dance in [Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md). The line for the move that is playing lights up.

A dance is **open-loop**, which means the robot never checks where it is.
The **Drift** slider makes one motor a little stronger than the other, like a real robot.
Each repeat adds a little more error, and a dashed outline shows where the robot *should* be.

## How to Use

1. The chapter's 8-beat dance is already loaded. Press **Play** and watch the red playhead, the robot, and the code box.
2. Move the **Tempo (BPM)** slider. Watch the seconds per beat, the block times, and the `sleep()` numbers change.
3. To build your own dance, press **Clear**. Pick a move button, pick a **Block length**, and click an empty cell. Click a placed block to remove it.
4. Leave the **Metronome click** box checked to hear a click on every beat. The circle in the top-right corner flashes on each beat.
5. Set **Drift** to 5 %. Press **Play** four times without pressing **Home**. Where does the robot end up? Press **Home** to start over.

**Try this challenge:** How many seconds long is the chapter's dance at 120 BPM? At 90 BPM?
Predict first, then check the **Dance length** line.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/dance-beat-sequencer/main.html"
        height="532px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *apply* the relationship seconds per beat = 60 / BPM to convert a tempo into `sleep()` durations, and will arrange timed open-loop moves into an 8-beat dance that fits the beat grid (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12

### Duration

20–30 minutes

### Prerequisites

- The robot dance sequence and timed motor patterns in [Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md).
- Calling functions and using `sleep()` from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).
- Motor functions such as `go_forward()` and `stop_motors()` from [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md).
- Open-loop versus closed-loop control, introduced at the start of Chapter 10.

### Activities

1. **Worked example (5 min).** With the chapter dance loaded at 120 BPM, students compute the length of each block by hand and check their answers against the timeline labels and the code box. They then predict the total dance length at 90 BPM before moving the slider (4.00 s at 120 BPM; 8 x 0.667 = 5.33 s at 90 BPM).
2. **Choreograph (10 min).** Students clear the timeline and design their own 8-beat dance that uses at least one half-beat block and one two-beat block. They pick a song tempo (for example 100 BPM) and copy the generated `dance()` lines into their notebook.
3. **Tempo transfer (5 min).** Students change the tempo to match a second song and explain which numbers in their code changed and which stayed the same (the move order and beat counts stay; every `sleep()` value scales by 60 / BPM).
4. **Drift investigation (5 min).** Students set Drift to 5 % and run the dance four times, then sketch the path and measure how far the robot ended from the dashed outline. They connect the result to the open-loop idea and propose a fix (a reset mark on the floor, or a sensor check between repeats).
5. **Hardware link (optional, 5 min).** Students run their dance on the real robot and compare the real drift with the simulated one.

### Assessment

- **Formative:** Ask each pair for the `sleep()` value of a half-beat move at 150 BPM (0.2 s) and of a two-beat move at 80 BPM (1.5 s).
- **Exit ticket:** "Your song is 96 BPM. Write the `dance()` line for a Forward move that lasts two beats, and explain how you got the number." (`go_forward(); sleep(1.25)`)
- **Rubric (4-point):** *Exemplary* — correct 60 / BPM conversions for whole, half, and two-beat moves, a complete 8-beat dance with no gaps or overlaps, and an explanation of drift that uses the term open-loop. *Proficient* — correct conversions for whole beats and a complete dance, with a partial drift explanation. *Developing* — correct conversion only when reading from the sim, dance incomplete. *Beginning* — cannot connect BPM to `sleep()` values.

## References

1. [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md) — the robot dance sequence this sim builds on.
2. [Tempo](https://en.wikipedia.org/wiki/Tempo) — Wikipedia article on tempo and beats per minute.
3. [Metronome](https://en.wikipedia.org/wiki/Metronome) — Wikipedia article on the device that clicks a steady beat.
4. [Open-loop controller](https://en.wikipedia.org/wiki/Open-loop_controller) — Wikipedia article on control without feedback, which explains why the dance drifts.
5. [MicroPython `time` module](https://docs.micropython.org/en/latest/library/time.html) — documentation for `sleep()` and the ticks functions used to time moves.
