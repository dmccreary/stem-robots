# Learning Graph Generator Session Log

**Skill Version:** 0.05  
**Date:** 2026-06-23  
**Course:** Computational Thinking with STEM Robots  
**Project:** stem-robots  

---

## Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| analyze-graph.py | (skill v0.05) | DAG validation, quality metrics |
| csv-to-json.py | v0.04 | CSV → vis-network JSON conversion |
| taxonomy-distribution.py | (skill v0.05) | Taxonomy balance analysis |

---

## Steps Completed

| Step | Action | Status |
|------|--------|--------|
| 0 | Setup — verified docs/, mkdocs.yml, learning-graph/ directory | ✅ |
| 1 | Quality check — score 97/100 in metadata, skipped re-analysis | ✅ Skipped (score > 85) |
| 2 | Generated 240 concept labels → concept-list.md | ✅ |
| 3 | Generated dependency CSV → learning-graph.csv (240 nodes, 453 edges) | ✅ |
| 4 | Ran analyze-graph.py → quality-metrics.md | ✅ |
| 5 | Created 13-category taxonomy → concept-taxonomy.md | ✅ |
| 5b | Created taxonomy-names.json (13 human-readable names) | ✅ |
| 6 | TaxonomyID column included in CSV from Step 3 (combined step) | ✅ |
| 7 | Created metadata.json | ✅ |
| 8 | Created color-config.json (13 named CSS colors) | ✅ |
| 9 | Ran csv-to-json.py → learning-graph.json | ✅ |
| 10 | Ran taxonomy-distribution.py → taxonomy-distribution.md | ✅ |
| 11 | Created index.md from index-template.md | ✅ |
| 12 | This session log | ✅ |

---

## Graph Statistics

| Metric | Value |
|--------|-------|
| Total concepts | 240 |
| Total edges | 453 |
| Foundational concepts (no prerequisites) | 3 |
| Terminal nodes | 77 (32.1%) |
| Orphaned nodes | 0 |
| Connected components | 1 |
| Valid DAG | Yes (0 cycles) |
| Average dependencies per concept | 1.91 |
| Maximum chain length | 20 |

## Foundational Entry Points

1. **Computational Thinking** (ID: 1)
2. **Voltage and Current** (ID: 69)
3. **Smart Car Chassis** (ID: 74)

## Top Prerequisites by Indegree

| Rank | Concept | Indegree |
|------|---------|---------|
| 1 | Function Definition | 24 |
| 2 | GPIO Pin Basics | 14 |
| 3 | Variables and Assignment | 12 |
| 4 | Importing Modules | 12 |
| 5 | Voltage and Current | 11 |

## Taxonomy Summary

| TaxonomyID | Name | Count | % |
|-----------|------|-------|---|
| FOUND | Foundation Concepts | 10 | 4.2% |
| ENV | Development Environment | 8 | 3.3% |
| PROG | Python Programming | 36 | 15.0% |
| HW | Hardware Platform | 14 | 5.8% |
| ELEC | Electronics Fundamentals | 12 | 5.0% |
| MOTOR | Motors and Actuators | 27 | 11.3% |
| SENSOR | Sensors and Input | 19 | 7.9% |
| DISPLAY | Display and Output | 22 | 9.2% |
| ROBOT | Robot Behaviors | 18 | 7.5% |
| NET | Networking and Wireless | 18 | 7.5% |
| BLE | Bluetooth and Swarm | 26 | 10.8% |
| COMM | Communication Protocols | 11 | 4.6% |
| ENG | Engineering Design | 19 | 7.9% |

---

## Files Created

- `concept-list.md` — Numbered list of 240 concept labels
- `learning-graph.csv` — Full dependency graph with TaxonomyID (240 rows, 453 edges)
- `concept-taxonomy.md` — 13-category taxonomy with descriptions
- `taxonomy-names.json` — Taxonomy ID to human-readable name mapping
- `metadata.json` — Dublin Core metadata for the learning graph
- `color-config.json` — CSS color assignment per TaxonomyID
- `learning-graph.json` — Complete vis-network JSON (metadata + groups + nodes + edges)
- `quality-metrics.md` — Graph quality validation report
- `taxonomy-distribution.md` — Category distribution analysis
- `index.md` — Introduction page for learning graph section
- `logs/learning-graph-generator-0.05-2026-06-23.md` — This session log

---

## Notes

- The graph was generated in a single pass with taxonomy embedded in the CSV from the start (Steps 3 and 6 were combined).
- Python tool `csv-to-json.py` version 0.04 was used; it auto-assigns white/black font based on background color.
- The `Thonny IDE` concept (11) shows an unusual dependency on `MicroPython Overview` (19) because Thonny is introduced as the tool to *run* MicroPython — students learn what MicroPython is before being shown the IDE. This is intentional.
- BLE and Swarm concepts (185–210) form a well-connected sub-cluster that converges at `Bluetooth Low Energy BLE` (186) and `Swarm Robotics` (201).
