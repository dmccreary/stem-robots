---
title: "Swarm Collective Behaviors"
description: "Change the one local rule that every robot runs and watch a convoy, collective obstacle avoidance, or a leader-broadcast group emerge, with live gap and AVOID readouts."
image: /sims/swarm-collective-behaviors/swarm-collective-behaviors.png
og:image: /sims/swarm-collective-behaviors/swarm-collective-behaviors.png
twitter:image: /sims/swarm-collective-behaviors/swarm-collective-behaviors.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Swarm Collective Behaviors

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Swarm Collective Behaviors MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/swarm-collective-behaviors/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

This MicroSim shows a small swarm on a 480 cm by 320 cm field. The purple robot with the
crown is the **leader**. The green robots are **followers**. Every follower runs the
**same local rule**: a rule that only uses what that one robot can sense by itself.
Nobody tells the group what shape to make. The shape **emerges** from all the robots
following the same rule at the same time.

The **Behavior** menu swaps the rule for every follower at once:

| Behavior | The one local rule | What emerges |
|---|---|---|
| **Convoy following** | Find the nearest robot ahead within sensor range. Turn toward it. Set speed = 0.5 + Kp × (gap − target gap), limited to 0 to 1, where 1 means 30 cm/s. | A chain that follows the leader |
| **Collective obstacle avoidance** | Drive straight and bounce off the field edge. If the wall is closer than 20 cm, turn 90 degrees. With **Share wall alerts** on, also tell every robot within 200 cm to turn away. | The group swerves around the wall |
| **Leader broadcast** | Turn = Kp × (leader's heading − my heading). This is the only rule that uses information from the leader. | Every robot points the same way |

The speed rule works just like the `steer()` function in the chapter: a base speed of
0.5 plus a correction, then limited to the range 0 to 1. Colors show each robot's state:
green is FOLLOW, gray is SEARCH (nothing ahead in range, so it wanders slowly), and
crimson is AVOID. The AVOID reflex can interrupt any state, just like the state machine
later in this chapter. Thin gray lines join each follower to the robot it is following,
and each faint circle is a robot's sensor range.

To keep the model honest, real robots have delays. Each follower reads its distance
sensor and updates its speed only every 0.6 s, and its motors take about 0.6 s to reach
a new speed. The leader slows down for every corner. The simulation clock runs twice as
fast as real time.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Extending Leader-Follower into Collective Behaviors."

## How to Use

1. Press **Run**. Watch the convoy form behind the leader. Look at the **Gap error**
   readout.
2. Watch a corner. The leader slows down, and a slow-down wave travels back along the
   chain. No robot sent that message. Each one just reacted to the robot in front of it.
3. **Challenge:** raise **Follower gain Kp** to 0.1 and watch the gaps. Then lower it to
   0.005. Which value keeps the convoy tight but calm?
4. Drag the purple leader with your mouse to steer it. Drag the gray wall into the
   convoy's path.
5. Switch to **Collective obstacle avoidance** and press **Scatter robots**. Count how
   many robots hit the wall's 20 cm zone. Then check **Share wall alerts** and compare.
6. Switch to **Leader broadcast**. What happens to the robots' headings? Is this rule
   still "local"?

**Reset** puts the robots back in a line and pauses, but keeps your settings.

## Lesson Plan

### Learning Objective

Students will *analyze* (Bloom's Taxonomy: Analyze) how a single local rule and its
settings (target gap, gain Kp, sensor range) produce a group-level pattern, and will
*explain* why no individual robot needs knowledge of the overall plan.

### Grade Level

Grades 8–12

### Duration

25–30 minutes

### Prerequisites

- Time-of-flight distance sensing from
  [Chapter 8: Sensors and Data Input](../../chapters/08-sensors-data-input/index.md)
- Closed-loop, proportional feedback from
  [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md)
- The leader-follower pattern from
  [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md)

### Activities

1. **Rule reading (5 min):** Before running the sim, students read the convoy rule aloud
   and predict the shape six robots will make. Record predictions on the board.
2. **Emergence observation (5 min):** Run the convoy for one full lap. Students describe
   the slow-down wave at each corner and identify which robot "caused" it. Emphasize that
   the wave is emergent: it is written in no robot's code.
3. **Gain experiment (8 min):** Pairs test Kp = 0.005, 0.03, and 0.1 for one lap each and
   record the Gap error readout and a sentence describing the chain's motion. Expected
   pattern: a low Kp reacts too slowly, so followers bunch up at corners; a high Kp
   over-corrects, so the chain stretches and squeezes like an accordion; a middle value
   near 0.03 is tight but calm.
4. **Information sharing (5 min):** In Collective obstacle avoidance, pairs compare the
   number of robots that must personally sense the wall with Share wall alerts off and
   on. Connect this to distributed systems, where one node's observation benefits others.
5. **Local versus global (5 min):** Contrast the Leader broadcast rule, which uses the
   leader's heading, with the convoy rule, which uses only the robot's own sensor.
   Students argue which one would still work if the leader's radio failed.

### Discussion Questions

- Where exactly does the convoy's shape "live" if it is not written in any robot's code?
- Why does a very high Kp make the chain oscillate even though every robot is following
  the rule correctly?
- What happens to the convoy when you lower **Sensor range** below the target gap? Why?
- Which behaviors still work if one follower breaks down in the middle of the chain?

### Assessment

- **Formative:** The gain-experiment table from Activity 3, checked for the U-shaped
  relationship between Kp and gap error.
- **Exit ticket:** "Write a one-line local rule that would make the robots spread out
  evenly across the field instead of forming a line." Evaluate whether the rule uses only
  locally sensed information.
- **Rubric (4-point):** *Exemplary* — links a specific rule parameter to a specific group
  pattern and explains why the pattern emerges without a global plan; *Proficient* —
  correctly describes the effect of Kp or sensor range on the group; *Developing* —
  describes the group pattern but attributes it to the leader "controlling" everyone;
  *Beginning* — cannot connect the rule to the pattern.

## References

1. [Swarm robotics (Wikipedia)](https://en.wikipedia.org/wiki/Swarm_robotics) — overview
   of local rules, emergence, and applications of multi-robot swarms.
2. [Emergence (Wikipedia)](https://en.wikipedia.org/wiki/Emergence) — how group-level
   patterns arise from simple interactions between parts.
3. [Boids (Wikipedia)](https://en.wikipedia.org/wiki/Boids) — Craig Reynolds' classic
   flocking model, the inspiration for this local-rule design.
4. [Distributed computing (Wikipedia)](https://en.wikipedia.org/wiki/Distributed_computing) —
   systems of independent nodes that cooperate without any one node holding the full
   picture.
5. [Proportional control (Wikipedia)](https://en.wikipedia.org/wiki/Proportional_control) —
   why the gain Kp trades reaction speed against oscillation.
