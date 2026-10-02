---
title: "Heading Broadcast Network Topology"
description: "Interactive network diagram that compares the heading swarm's one-to-many UDP broadcast with one-to-one BLE pairing and router-hosted WiFi, and shows what the sender must change to add a follower."
image: /sims/heading-broadcast-topology/heading-broadcast-topology.png
og:image: /sims/heading-broadcast-topology/heading-broadcast-topology.png
twitter:image: /sims/heading-broadcast-topology/heading-broadcast-topology.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Heading Broadcast Network Topology

<iframe src="main.html" height="442px" width="100%" scrolling="no"></iframe>

[Run the Heading Broadcast Network Topology MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/heading-broadcast-topology/main.html"
        height="442px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

A **network topology** is the shape of a network: who is connected to whom, and which
way the messages flow. This diagram shows the topology of the heading swarm. One master
robot hosts its own WiFi network and sends a **UDP broadcast** (one packet that every
device on the network receives) with its compass heading. Every follower just listens.

The toolbar lets you switch between three topologies you have met in this course:

| View | Where it comes from | Shape |
|---|---|---|
| **UDP broadcast** | Chapter 13 (this section) | One sender, many listeners, one packet per update |
| **BLE pairing** | Chapter 12 | One leader with a separate connection to each follower |
| **Router WiFi** | Chapter 11 | A router someone else set up, with one-to-one TCP connections |

The **Compare** card at the top right always shows four facts for the current view: who
hosts the network, what the links look like, how many sends the leader makes per update,
and what changes when you add a robot.

This MicroSim goes with
[Chapter 13: Swarm Robotics and Advanced Engineering Patterns](../../chapters/13-swarm-robotics-advanced-patterns/index.md),
in the section "Hosting the Swarm Network: WiFi Access Point and UDP Broadcast."

## How to Use

1. Start on **UDP broadcast**. Hover over (or tap) the **Master Robot**, a **Follower**,
   one of the **UDP heading packet** labels, and the dashed network box. Read each
   explanation in the **Details** card.
2. Check **Add Follower 4**. Look at the Compare card. What changed for the master?
3. Switch to **BLE pairing** with Follower 4 still checked. How many writes does the
   leader make now for each update?
4. Switch to **Router WiFi**. Who hosts this network? Could your swarm work in a park
   with no router nearby?
5. Explain in one sentence why the heading swarm uses UDP broadcast instead of BLE.

## Lesson Plan

### Learning Objective

Students will *differentiate* (Bloom's Taxonomy: Analyze) the one-to-many UDP broadcast
topology used for heading synchronization from the one-to-one BLE pairing topology of
Chapter 12 and the router-hosted WiFi topology of Chapter 11, and *justify* which one
scales better as followers are added.

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Prerequisites

- Station-mode WiFi and TCP web servers from
  [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md)
- BLE central/peripheral roles and connections from
  [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md)
- The Chapter 13 section on WiFi access point host mode and UDP broadcast

### Activities

1. **Warm-up (3 min):** Ask students to sketch, without looking, how Chapter 12's BLE
   leader reached two followers. Collect whether their sketch shows one link or two.
2. **Guided comparison (7 min):** In pairs, students fill in a three-column table
   (UDP broadcast, BLE pairing, Router WiFi) with the four Compare-card facts, first with
   three followers and then with **Add Follower 4** checked. The instructor then asks which
   cells changed between the two runs; only the BLE sends-per-update and link count
   should change.
3. **Scaling argument (5 min):** Each pair writes a short claim–evidence–reasoning
   paragraph: "Which topology is best for a swarm of 10 robots, and why?" Evidence must
   cite a specific value from the Compare card.
4. **Transfer (3 min):** Show the chapter's `broadcast_loop()` and ask students to point
   to the single line that would have to become a loop in the BLE version (the
   `sendto()` call).

### Discussion Questions

- Why is a dropped UDP packet not a failure for a heading follower, when a dropped TCP
  packet would be retransmitted?
- The master both hosts the network and sends the broadcast. What happens to the swarm if
  the master's battery dies?
- Chapter 11's router topology needs a network that already exists. Where would that be a
  problem for a robot demonstration?

### Assessment

- **Formative:** The completed comparison table from Activity 2, checked for the correct
  sends-per-update values (1, N, and one per connection).
- **Exit ticket:** "A teammate adds Follower 5 to the UDP swarm. List every change needed
  on the master." (Expected answer: none; the new robot joins the access point and
  listens on the same UDP port.)
- **Rubric (4-point):** *Exemplary* — distinguishes all three topologies by host, link
  shape, and scaling cost, with evidence; *Proficient* — distinguishes UDP broadcast from
  BLE pairing correctly but is vague about the router case; *Developing* — describes the
  diagrams without explaining scaling; *Beginning* — treats all three as equivalent
  "wireless" links.

## References

1. [Broadcasting (networking) (Wikipedia)](https://en.wikipedia.org/wiki/Broadcasting_%28networking%29) —
   how one packet sent to a broadcast address reaches every host on a network.
2. [User Datagram Protocol (Wikipedia)](https://en.wikipedia.org/wiki/User_Datagram_Protocol) —
   connectionless, best-effort delivery used for the heading packets.
3. [Network topology (Wikipedia)](https://en.wikipedia.org/wiki/Network_topology) —
   background on star, point-to-point, and broadcast network shapes.
4. [MicroPython network.WLAN documentation](https://docs.micropython.org/en/latest/library/network.WLAN.html) —
   station mode (`STA_IF`) versus access point mode (`AP_IF`) on the Pico W.
5. [MicroPython socket documentation](https://docs.micropython.org/en/latest/library/socket.html) —
   the `SOCK_DGRAM` sockets and `sendto()` used by the master's broadcast loop.
6. [Swarm Robot Build Plan](../../kits/swarm-bot/plan.md) — the full master and follower
   scripts for this course's hardware.
