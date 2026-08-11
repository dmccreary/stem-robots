# Session Log: Swarm Robot Kit Plan + Chapter 13 Content Generation

**Date:** 2026-08-11
**Repository:** stem-robots
**Branch:** main

## Overview

This session had two related goals: (1) turn the abstract swarm-robotics design
report into a concrete, buildable plan for the 9-DOF IMU (L3GD20 gyroscope +
LSM303D accelerometer/magnetometer) the user had just purchased for the Cytron
ROBO-PICO + Raspberry Pi Pico W platform, and (2) fold that new hardware path
into the textbook itself — the learning graph, the course description, and the
capstone chapter (Chapter 13).

The session ran as five sequential tasks, each requested in a separate user
message:

1. Write the IMU build plan (`docs/kits/swarm-robot/plan.md`)
2. Add the new kit to the `mkdocs.yml` navigation
3. Add the Cytron ROBO-PICO product link to the plan
4. Add the Cytron ROBO-PICO datasheet link to the plan
5. Generate Chapter 13 content via the `chapter-content-generator` skill,
   updating the course description and learning graph first

---

## Task 1: Swarm Robot Build Plan

**File created:** [`docs/kits/swarm-robot/plan.md`](../docs/kits/swarm-robot/plan.md)

### Inputs read before writing

- `docs/appendices/swarm-robots/index.md` — the existing "Swarm Robotics Cluster
  — Design Report," which compared several IMU options in the abstract and
  recommended the L3GD20 + LSM303D combo on cost grounds.
- `docs/kits/swarm-robot/9-dof-imu.png` — a screenshot of the user's actual eBay
  purchase confirmation for the "9 Axis IMU L3GD20 LSM303D Module 9DOF Compass
  Acceleration Gyroscope" module ($5.96). Reading this image was necessary to
  get the real silkscreen pin labels (`VIN, GND, SDA, GRDY, LIN2` / `3Vo, SCL,
  GINT, LIN1, LRDY`) rather than guessing at a generic pinout.
- Existing project conventions, gathered via `Read`/`Bash`/`Explore`-style
  lookups rather than assumption:
  - `src/kits/base/config.py` and `src/kits/wi-fi/config.py` — confirmed the
    project's standard I2C pins (`I2C_SDA_PIN = 16`, `I2C_SCL_PIN = 17`) and
    motor pin names (`RIGHT_FORWARD_PIN`, etc.) already used on the ROBO-PICO.
  - `docs/img/cytron-robo-pico-pinout.png` — confirmed the ROBO-PICO has an
    onboard motor driver, LiPo connector, buzzer, NeoPixel, and Grove ports,
    which meant the design report's generic "separate TB6612FNG motor driver"
    line item was unnecessary for this specific board.
  - `src/lib/VL53L0X.py` — used as the style reference for the new register-
    level driver skeletons (`const()` register addresses, `readfrom_mem`/
    `writeto_mem`).
  - `src/kits/wi-fi/62-wi-fi-connect-test-v3.py` and
    `src/kits/wi-fi/68-simple-web-server.py` — used as the style reference for
    the `network`/`socket` code patterns (station-mode connect, retry logic).
  - `docs/kits/base/09-i2c-scanner-test.py` and its accompanying lab page —
    used as the reference for the I2C scan pattern.

### What the plan contains

A 12-phase, step-by-step build sequence:

| Phase | Topic |
|---|---|
| 0 | Bench setup — flash MicroPython, solder the IMU's header pins |
| 1 | Confirm both IMU chips answer on I2C (scan + `WHO_AM_I` register check) |
| 2 | Minimal drivers — `l3gd20.py`, `lsm303d.py` skeletons with register constants |
| 3 | Raw sensor read test + sanity checks |
| 4 | Magnetometer hard-iron calibration procedure |
| 5 | Complementary filter for heading fusion (`heading_filter.py`) |
| 6 | Validate a stable heading against a known reference |
| 7 | Master: WiFi AP + UDP broadcast |
| 8 | Follower: join AP + UDP receive |
| 9 | Follower steering (proportional controller) |
| 10 | Two-robot integration test |
| 11 | Scale to 3+ followers, with a flagged caveat about the Pico W soft-AP's undocumented client limit |
| 12 | Extension ideas (tilt-compensated heading, bump detection via the same accelerometer, interrupt-driven reads) |

It also includes a proposed file layout under `src/kits/swarm/` and `src/lib/`,
a wiring table (IMU pin → ROBO-PICO pin, including a fallback from 3.3V to
VBUS if the clone board's onboard regulator needs more headroom), a
troubleshooting table, and a suggested per-session class schedule.

**Key judgment call:** the plan explicitly does not claim invented electrical
specs. Sensitivity constants (e.g., `0.00875` dps/LSB for the gyro at 250 dps
full scale) and I2C addresses (`0x6B` / `0x1D`) are presented as *starting
points to be confirmed against the `WHO_AM_I` register read in Phase 1*, since
this is a low-cost clone board without a definitive datasheet — the plan tells
the reader how to verify rather than asserting unverifiable specifics as fact.

---

## Task 2: Navigation Entry

**File modified:** `mkdocs.yml`

Added a new `Swarm Robot` entry under the existing `Robot Kits` nav section,
after `WiFi Display Bot`, matching the indentation and structure of its
sibling entries:

```yaml
    - Swarm Robot:
      - Build Plan: kits/swarm-robot/plan.md
```

---

## Task 3 & 4: Reference Links

**File modified:** `docs/kits/swarm-robot/plan.md`

- Added the Cytron ROBO-PICO product page link
  (`https://www.cytron.io/p-robo-pico-simplifying-robotics-with-raspberry-pi-pico`)
  to the bill-of-materials table row, matching the link style already used in
  `docs/kits/wifi-bot/index.md`.
- Added the Cytron ROBO-PICO datasheet link (a Google Doc:
  `https://docs.google.com/document/d/1X67yKga7m5pugBcogww6pyR2YHXwRJL79_nNDLTYcKU/edit?tab=t.0`)
  as a one-line reference directly under the BOM table.

---

## Task 5: Chapter 13 Content Generation

Invoked via `Skill(chapter-content-generator)`, following its documented
Phase 1 → Phase 2 → Phase 3 workflow in **sequential, single-chapter mode**
(the task was scoped to one chapter, so no parallel Task-agent fan-out was
used).

### Phase 1 — Shared context and validation

Read before writing anything:

- `docs/course-description.md` — confirmed target audience (grades 8–12) and
  the existing BLE-based Swarm Robots lab framing.
- `docs/learning-graph/learning-graph.csv` / `.json` — loaded the full
  240-concept graph.
- `docs/learning-graph/concept-taxonomy.md` — the 13-category taxonomy
  (`FOUND`, `ENV`, `PROG`, `HW`, `ELEC`, `MOTOR`, `SENSOR`, `DISPLAY`, `ROBOT`,
  `NET`, `BLE`, `COMM`, `ENG`).
- `CONTENT-GENERATION-GUIDELINES.md` — the project's own student-facing style
  rules (Sparky mascot rules, sentence-length targets, chapter structure),
  which take precedence over the skill's generic reading-level defaults.
- The existing Chapter 12 (`docs/chapters/12-bluetooth-low-energy/index.md`)
  as the concrete style/format precedent for Chapter 13, since it's the
  immediately preceding chapter and already telegraphs "swarm robotics" as
  the next topic in its closing text.

**Edge-direction validation (mandatory Step 1.3a):** ran a small Python check
against `learning-graph.json` confirming `prereqs[edge['from']].add(edge['to'])`
produces a small, sensible set of foundational (zero-prerequisite) concepts —
`Computational Thinking`, `Voltage and Current`, `Smart Car Chassis` — rather
than dozens of advanced concepts, which would indicate an inverted graph.

**Chapter dependency check (Step 1.3b):** before writing prerequisite-chapter
concepts into new nodes, grepped every other chapter's "Concepts Covered" list
to confirm which chapter already teaches each intended dependency:

| Concept the new nodes depend on | Already taught in |
|---|---|
| I2C Bus, I2C Frequency Config | Chapter 6 |
| Sensor Types Overview, Sensor Calibration Process, Sensor Fusion | Chapter 8 |
| Closed-Loop Feedback, Feedback Loop | Chapter 10 |
| PWM Motor Control Code | Chapter 7 |

Chapters 6 and 8 were **not** in Chapter 13's existing Prerequisites list, so
they were added — this was necessary to avoid a forward-reference violation,
since two of the new SENSOR-category concepts depend directly on material
first taught there.

### Learning graph changes

**File modified:** `docs/learning-graph/learning-graph.csv` — appended 12 new
rows (IDs 241–252):

| ID | Label | Dependencies | Category |
|---|---|---|---|
| 241 | 9-DOF IMU Overview | 108, 211 | SENSOR |
| 242 | L3GD20 Gyroscope | 241, 211 | SENSOR |
| 243 | LSM303D Accelerometer Magnetometer | 241, 211 | SENSOR |
| 244 | Gyroscope Calibration | 242, 124 | SENSOR |
| 245 | Magnetometer Hard Iron Calibration | 243, 124 | SENSOR |
| 246 | Complementary Filter Sensor Fusion | 244, 245, 126 | SENSOR |
| 247 | Heading Estimation | 246 | SENSOR |
| 248 | WiFi Access Point Host Mode | 167, 168 | NET |
| 249 | UDP Broadcast Networking | 176, 248 | NET |
| 250 | Heading Synchronization Swarm Pattern | 201, 247, 249 | BLE |
| 251 | UDP Master Broadcast Code | 250, 248, 34 | BLE |
| 252 | UDP Follower Steering Code | 250, 238, 96 | BLE |

Dependency choices deliberately reused existing concepts rather than inventing
parallel ones — e.g. `246` depends on the pre-existing generic `126 Sensor
Fusion` concept from Chapter 8, and `252` depends on the pre-existing `238 PID
Control Overview` concept (itself newly relevant in this same chapter),
tying the new material into the graph instead of bolting it on as an island.

**File regenerated:** `docs/learning-graph/learning-graph.json`, via the
project's own `csv-to-json.py` script (not hand-edited), using the existing
`color-config.json`, `metadata.json`, and `taxonomy-names.json` — no new
taxonomy IDs were needed since all 12 new concepts fit existing categories.

```
python3 csv-to-json.py learning-graph.csv learning-graph.json \
    color-config.json metadata.json taxonomy-names.json
```

Result: 252 nodes, 480 edges (up from 240 nodes / 453 edges), 3 foundational
concepts (unchanged — none of the new concepts are foundational, as expected).

**Post-generation validation** (Python, ad hoc — `validate-learning-graph.py`
in this repo required a schema file that wasn't available locally, so this
was done directly instead):

- No dangling edges (every `to`/`from` ID resolves to a real node).
- Full topological sort succeeds — the graph is a valid DAG, no cycles
  introduced by the new nodes.
- Manually inspected all 12 new nodes' resolved dependency lists to confirm
  they match the table above with no accidental ID transposition.

**File modified:** `docs/learning-graph/concept-taxonomy.md` — updated the
summary table (`240` → `252` total concepts; `SENSOR` 19→26, `NET` 18→20,
`BLE` 26→29) and extended the prose description of the `SENSOR`, `NET`, and
`BLE` category sections to describe the new IMU/calibration, WiFi-AP/UDP, and
heading-sync concepts respectively.

### Course description changes

**File modified:** `docs/course-description.md`:

- Extended the Course Overview paragraph to introduce the WiFi/IMU
  heading-sync path as a second swarm-coordination approach alongside the
  existing BLE lab.
- Extended topic #12 ("Swarm Robotics") in Main Topics Covered to mention the
  IMU and calibration/fusion work.
- Added new Learning Outcomes at four Bloom's levels:
  - **Understand:** why a complementary filter is needed (gyro drift vs.
    magnetometer noise); why per-robot magnetometer calibration is required.
  - **Apply:** reading raw IMU values; calibrating a magnetometer;
    implementing a complementary filter; hosting a WiFi AP and broadcasting
    UDP.
  - **Analyze:** comparing the BLE leader/follower pattern against the
    WiFi/UDP heading-sync pattern on scaling, dropped-message tolerance, and
    calibration dependence.
  - **Create:** building the full WiFi-based heading-sync swarm (master +
    calibrated followers).

### MicroSim reuse search

Before specifying any new interactive diagram, ran the project's
`search-microsims` embedding-based reuse tool (confirmed available via the
documented sentinel-file check) against five candidate elements:

| Candidate | Best match | Score | Decision |
|---|---|---|---|
| Complementary filter heading fusion | `linear-algebra/sims/sensor-fusion` | 0.57 | Below reuse/template threshold — write new spec |
| Magnetometer hard-iron calibration | `geometry-course/sims/rotation-origin` | 0.53 | Below threshold — write new spec |
| WiFi AP / UDP broadcast topology | This repo's own `wifi-vs-ble-topology` | 0.56 | Below threshold (topology genuinely differs — router-hop vs. AP-hosted broadcast) — write new spec |
| PID control feedback loop | `control-systems/sims/feedback-loop-simulator` | 0.64 | **Template tier** (0.60–0.75) — new spec written, with a `**Template:**` pointer to the matched repo |
| Swarm robot state machine | `automating-instructional-design/sims/state-machine-template` | 0.57 | Below threshold — write new spec |

Only the PID simulator crossed the template-reuse threshold; it was specified
as an adaptation of that existing p5.js sim (generic proportional-gain step
response) reframed around heading-degrees error, with the added Ki/Kd sliders
the template doesn't yet have.

### Chapter content

**File rewritten:** `docs/chapters/13-swarm-robotics-advanced-patterns/index.md`
(previously a title/summary/concepts-list stub ending in
`TODO: Generate Chapter Content`).

- **Length:** ~6,360 words.
- **Concepts covered:** all 30 (the original 18 plus the 12 new ones) —
  verified programmatically by substring-matching every concept label against
  the generated text; all 30 confirmed present.
- **Structure:** metadata frontmatter → mascot-welcome → Summary → Concepts
  Covered (30, in pedagogical rather than learning-graph order) → Prerequisites
  (now including Chapters 6 and 8) → thirteen body sections → Key Takeaways →
  mascot-celebration.
- **Two-part narrative arc:** Part 1 extends the Chapter 12 BLE leader/follower
  pair into collective behaviors (obstacle avoidance, convoy, dance) organized
  by a state machine, then layers in the "professional patterns" concepts
  (project planning, team collaboration, multithreading, async, PID, encoder
  feedback, data logging). Part 2 introduces the IMU-based WiFi/UDP
  heading-sync pattern as an independent second swarm implementation, explicitly
  cross-linked to `docs/appendices/swarm-robots/index.md` (design rationale)
  and `docs/kits/swarm-robot/plan.md` (full runnable driver/build-plan code)
  rather than duplicating their content wholesale.
- **Non-text elements (6):**
  1. Interactive Mermaid state machine diagram (swarm behavior modes)
  2. p5.js MicroSim — PID feedback loop tuner (template-reuse tier)
  3. Interactive Mermaid diagram — 9-DOF IMU two-chip I2C layout
  4. p5.js MicroSim — magnetometer hard-iron calibration explorer
  5. p5.js MicroSim — complementary filter heading tuner
  6. Interactive Mermaid diagram — UDP broadcast one-to-many network topology

  Plus several reinforcing tables (multithreading vs. async, PID term
  meanings, collective-behavior summary, troubleshooting checklist) and lists,
  each preceded by explanatory prose per the project's scaffolding rule
  (define before display).
- **Code examples:** kept to the 5–15 line, one-concept-at-a-time guideline
  from `CONTENT-GENERATION-GUIDELINES.md`, adapted down from the longer
  combined functions in `plan.md` rather than copied verbatim.

### Correction made during generation

The first draft used **8** mascot admonitions, exceeding this project's
documented maximum of 6 per chapter
(`CONTENT-GENERATION-GUIDELINES.md` §1.6). Caught this by grepping the draft
for `^!!! mascot-` and counting. Fixed by converting two `mascot-tip`
admonitions ("AVOID always wins" and "Adding a robot is free") into plain
prose sentences in their surrounding paragraphs — content was kept, just not
inside a mascot callout. Final count: 6 (`welcome`, `thinking`, `warning` ×2,
`encourage`, `celebration`), confirmed none are back-to-back.

### Other verification performed

- Confirmed all 6 `<details markdown="1">` blocks are properly closed and
  contain no leading whitespace/indentation (a documented formatting pitfall).
- Confirmed all 3 diagram elements have a `#### Diagram:` header immediately
  before their `<details>` block.
- Confirmed `docs/chapters/13-swarm-robotics-advanced-patterns/index.md` was
  already present in `mkdocs.yml`'s nav (line 52) — no nav change needed for
  this file.
- Wrote the skill's standard session-timing log to
  `logs/ch-13-content-generation.md` (start/end timestamps only, matching the
  format of the pre-existing `ch-01` through `ch-12` logs in this directory).

---

## Known Follow-Up Work (not done this session)

- The 6 new diagram/MicroSim specs in Chapter 13 are all `Status: Specified`
  — none have been scaffolded into real `docs/sims/<sim-id>/main.html`
  implementations yet, so their `<iframe>` embeds will 404 until the
  `microsim-generator` skill (or equivalent) is run against them.
- `docs/kits/swarm-robot/plan.md` is not yet cross-linked from
  `docs/chapters/13-swarm-robotics-advanced-patterns/index.md`'s "Concepts
  Covered" numbered list itself (it is linked inline from body prose, which is
  sufficient for now).
- No hardware in this plan has been physically tested — the I2C addresses,
  `WHO_AM_I` values, and sensitivity constants in `plan.md` and in Chapter 13
  are presented as points to verify against the real board (Phase 1 of the
  plan), not confirmed facts about this specific clone module.

## Files Touched This Session

**Created:**

- `docs/kits/swarm-robot/plan.md`
- `logs/ch-13-content-generation.md`
- `logs/add-swarm-chapter.md` (this file)

**Modified:**

- `mkdocs.yml`
- `docs/chapters/13-swarm-robotics-advanced-patterns/index.md`
- `docs/learning-graph/learning-graph.csv`
- `docs/learning-graph/learning-graph.json`
- `docs/learning-graph/concept-taxonomy.md`
- `docs/course-description.md`

Note: `git status` at the start of this session already showed several of
these files (`docs/course-description.md`, `docs/learning-graph/*`,
`mkdocs.yml`, and `docs/references.md`) as modified from prior, unrelated
work in this repository. `docs/references.md` was not touched in this
session — its modification predates this session and is called out here only
to avoid misattributing it in any future `git diff` review.
