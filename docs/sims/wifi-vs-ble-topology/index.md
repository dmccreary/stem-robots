---
title: WiFi vs BLE Communication Topology
description: Type: diagram **sim-id:** wifi-vs-ble-topology<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a side-by-side Mermaid graph showing two network topologies:  Left subgraph "WiFi (via router)": Browser -- HTTP --> Router -- Wi...
image: /sims/wifi-vs-ble-topology/wifi-vs-ble-topology.png
og:image: /sims/wifi-vs-ble-topology/wifi-vs-ble-topology.png
twitter:image: /sims/wifi-vs-ble-topology/wifi-vs-ble-topology.png
social:
   cards: false
status: implemented
library: Mermaid
bloom_level: TBD
---

# WiFi vs BLE Communication Topology

<iframe src="main.html" width="100%" height="380" scrolling="no"></iframe>

[Run the WiFi vs BLE Communication Topology MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: diagram **sim-id:** wifi-vs-ble-topology<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a side-by-side Mermaid graph showing two network topologies:  Left subgraph "WiFi (via router)": Browser -- HTTP --> Router -- Wi...

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/wifi-vs-ble-topology/main.html" width="100%" height="380" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: diagram **sim-id:** wifi-vs-ble-topology<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a side-by-side Mermaid graph showing two network topologies:  Left subgraph "WiFi (via router)": Browser -- HTTP --> Router -- Wi...

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md)
- [Bluetooth Low Energy (Wikipedia)](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy)
- [Wi-Fi (Wikipedia)](https://en.wikipedia.org/wiki/Wi-Fi)

## Specification

The full specification below is extracted from [Chapter 12: Bluetooth Low Energy Fundamentals](../../chapters/12-bluetooth-low-energy/index.md).

```text
Type: diagram
**sim-id:** wifi-vs-ble-topology<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a side-by-side Mermaid graph showing two network topologies:

Left subgraph "WiFi (via router)":
Browser -- HTTP --> Router -- WiFi --> Robot A
Robot B -- WiFi --> Router

Right subgraph "BLE (direct)":
Robot A (Central) -- BLE --> Robot B (Peripheral)

Use different node shapes: diamonds for routers, rectangles for robots/browsers.

Every node and connection has a click directive opening an infobox: Router infobox explains "single point of failure — if the router goes down, all robots lose contact." BLE connection infobox explains "direct peer link — works even without a network."

Canvas: 700 × 300 px. Responsive on window resize.
```

