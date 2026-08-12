# MicroSim Generation Session Log

**Date:** 2026-06-23
**Task:** Run the microsim-generator skill on each MicroSim specification in `docs/sims/TODO/*.json`
**Result:** 20 MicroSims generated, integrated into 12 chapters, validated at grade A, and committed to the working tree (not git-committed).

## Overview

The `docs/sims/TODO/` directory held 20 JSON specs extracted from the chapter
content. Each target sim directory already existed but contained only a
scaffold placeholder `main.html` ("MicroSim Not Yet Implemented"). This session
replaced every placeholder with a working implementation and ran the full
microsim-generator workflow (implement → integrate → validate → screenshot →
visual review). Execution was sequential, per the skill's default.

## Sims generated

### p5.js (14)

| Sim | Chapter | Iframe height | Notes |
|-----|---------|--------------|-------|
| physical-computing-explorer | 1 | 422 | 3-column sense→decide→act; clickable icons + Play Loop particles |
| cytron-board-explorer | 2 | 502 | 10 clickable board components + info panel |
| gpio-pin-explorer | 2 | 412 | Output/input schematic, mode dropdown, voltage bars, True/False |
| breadboard-layout-explorer | 2 | 422 | Clickable rows/rails; **renders 30 of 63 rows** (clickability) |
| robot-assembly-workflow | 2 | 522 | 8-step clickable workflow, detail panel, checkmarks |
| variable-assignment-explorer | 3 | 352 | Type name/value → animated arrow → memory boxes |
| robot-main-loop-timing | 4 | 402 | Animated loop timeline, NOW cursor, speed toggle, tooltips |
| list-index-explorer | 5 | 302 | 5 boxes, +/- indices, slider, iterate, click-select |
| analog-digital-signals | 6 | 352 | Two-panel analog vs digital, mouse readout, signal dropdown |
| h-bridge-simulator | 6 | 402 | 4 switches, fwd/rev/stop, animated current, switch tooltips |
| pwm-duty-cycle-explorer | 7 | 402 | PWM waveform, avg-voltage line, Ton/Toff, spinning motor |
| differential-drive-simulator | 7 | 452 | Top-down robot, L/R sliders, presets, fading trail |
| sensor-calibration-explorer | 8 | 402 | Ideal vs raw line, offset/scale sliders, calibrate, test point |
| oled-coordinate-explorer | 9 | 402 | Scaled 128×64 OLED, grid toggle, draw buttons + code box |

### Mermaid (6)

| Sim | Chapter | Iframe height | Notes |
|-----|---------|--------------|-------|
| micropython-stack-diagram | 3 | 760 | 4-layer stack, control-down / data-up arrows, hover info |
| collision-decision-flow | 4 | 960 | Decision flowchart with loop-back; tall layout |
| git-commit-workflow | 5 | 300 | 4-area LR flow, command-labeled arrows |
| open-closed-loop-comparison | 10 | 560 | Open-loop vs closed-loop subgraphs (stacked) |
| http-request-response-flow | 11 | 720 | 12-step sequence diagram; hover info on each message |
| wifi-vs-ble-topology | 12 | 380 | WiFi-via-router vs direct-BLE subgraphs |

## Per-sim files

Each directory now contains: `main.html`, `<sim-id>.js` (p5 only; Mermaid is
self-contained in `main.html`), `index.md`, `metadata.json`, and `<sim-id>.png`.

## Implementation conventions

- **p5.js:** `// CANVAS_HEIGHT:` comment within the first 10 lines, responsive
  `updateCanvasSize()`/`windowResized()`, canvas parented via
  `document.querySelector('main')`, native controls (createSlider/Button/Select),
  aliceblue draw area + white control area, `describe()` for accessibility.
- **Mermaid:** self-contained `main.html` with the schema meta tag and a `<main>`
  wrapper (for validation), robust `waitForMermaid()` polling, hover tooltips on
  `.node` elements (and `.messageText` for the sequence diagram),
  `subGraphTitleMargin` on subgraph diagrams.
- All iframes use `width="100%"` and `scrolling="no"`, no `style` attribute.

## Workflow steps run

1. **Implemented** all 20 sims from spec (sequential).
2. **Fixed metadata** — removed the template `"dementia"` subject bug from all 20
   `metadata.json`; added `educational` + `pedagogical` sections; set
   `completion_status: implemented`.
3. **Standardized index.md** — frontmatter preview images, About section,
   copy-paste iframe example, Lesson Plan, References (chapter link + 2 accurate
   external links each), preserved the original Specification block.
4. **Chapter integration** — inserted iframes into all 12 chapters via
   `add-iframes-to-chapter.py`. The tool had a bug that injected a stray `<br/>`
   into the sim path (`sims/foo<br/>/main.html`) for both the iframe `src` and the
   "Run Fullscreen" links; all 16 inserted references were corrected and heights
   synced. Chapter 2's four iframes pre-existed and were left intact.
5. **Iframe heights** — p5 synced via `fix-iframe-heights.py` (CANVAS_HEIGHT
   comment); Mermaid set manually and tuned after visual review.
6. **Validation** — `validate-sims.py`: all 20 score **A** (p5 = 98, Mermaid = 100).
7. **Screenshots** — captured all 20 with `bk-capture-screenshot`.
8. **Visual layout review** — viewed every screenshot; fixed defects and
   re-captured (see below).
9. **Navigation** — regenerated the MicroSims section of `mkdocs.yml`
   (26 entries total) and confirmed `mkdocs build` succeeds with no warnings
   referencing any new sim or iframe.

## Defects found and fixed during visual review

- **robot-assembly-workflow:** step titles rendered too low (text-box height bug);
  fixed to center within each card.
- **cytron-board-explorer:** LED dots overlapped the "LEDs" label; moved dots up.
- **collision-decision-flow:** clipped at 470 and 700 → 960 (full diagram visible).
- **micropython-stack-diagram:** clipped at 420 and 560 → 760 (all 4 layers).
- **http-request-response-flow:** clipped at 560 → 720 (all 12 steps).
- **open-closed-loop-comparison:** subgraphs stack vertically; clipped at 470 → 560.
- **git-commit-workflow:** bottom slightly tight at 240 → 300.

## Known caveats

- **breadboard-layout-explorer** shows a representative 30 of the 63 numbered rows
  to keep individual holes clickable; connection behavior is identical.
- Tall Mermaid diagrams (micropython-stack, collision) have cosmetic top
  whitespace from Mermaid centering a tall diagram scaled to full width — nothing
  is clipped.
- The p5 validator deducts 2 points for `createButton`/`createSelect` ("DOM
  functions"), which conflicts with the p5 guide's "always use native controls"
  rule. Kept the native controls; this is why p5 sims score 98 not 100.

## Source specs

`docs/sims/TODO/*.json` were left in place as the source-of-record. Their
`completion_status` still reads `specified`.

## Git state

Nothing was committed. Modified: `mkdocs.yml` + 12 chapter `index.md` files.
New (untracked): 20 sim directories plus `docs/sims/TODO/` and
`docs/prompts/generate-microsims-todo.md`.
