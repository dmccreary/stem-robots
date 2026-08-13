# Kit Quality Checklist

This is the full checklist behind the `kit-quality-guide` skill. It was built by
auditing all 11 `docs/kits/` directories and all 10 `src/kits/` directories in this
repo (August 2026) and extracting what separates the strongest kits from the
weakest ones. Treat every item as something to *check for*, not something to
blindly enforce — a kit can reasonably skip an item if there's a good reason,
but the skill should always surface the gap so a human decides.

Findings cited here (file paths, bug descriptions, "as of writing" facts) are a
snapshot from the original audit. Re-verify before relying on them — the repo
moves.

## Contents
- [What is a "kit"?](#what-is-a-kit)
- [Rating scale](#rating-scale)
- [Documentation checklist (`docs/kits/<name>/`)](#documentation-checklist-docskitsname)
- [Instructor-facing content](#instructor-facing-content-the-biggest-systemic-gap)
- [Source code checklist (`src/kits/<name>/`)](#source-code-checklist-srckitsname)
- [Cross-cutting consistency](#cross-cutting-consistency)
- [Reference kits to model against](#reference-kits-to-model-against)
- [Known repo-wide pitfalls](#known-repo-wide-pitfalls)

---

## What is a "kit"?

A kit is the pairing of `docs/kits/<name>/` (the student-facing lesson pages) and
`src/kits/<name>/` (the MicroPython code that goes with it). Two kinds:

- **Robot kit** — directory name ends in `-bot` (e.g. `base-bot`, `display-bot`,
  `line-follower-bot`). Has a chassis and motors; the student drives it.
- **Standalone sensor kit** — no `-bot` suffix (e.g. `compass-hmc5883l`,
  `imu-mpu6050`). Breadboard + Pico + one sensor (+ usually an OLED). No chassis,
  no motors.

A kit can also be **planned-but-not-built** — a `docs/kits/<name>/plan.md` with no
`index.md` and no matching `src/kits/` directory (e.g. `swarm-bot` at time of
writing). Grade a planned kit against the [plan-quality checklist](#planned-kits)
below, not the full checklist — it isn't meant to have code yet.

`docs/` and `src/` directory names **should match exactly**. They don't always
(see [cross-cutting consistency](#cross-cutting-consistency)) — treat any
mismatch as a finding, not something to silently work around.

## Rating scale

Use these four bands when summarizing a kit's overall state. They're the same
vocabulary used throughout this checklist and in `audit_kit.py`'s output.

| Rating | Meaning |
|---|---|
| **Complete** | Every checklist section has real content; only minor polish items remain. |
| **Partial** | Core kit is functional and mostly documented, but multiple sections (BOM, instructor content, error handling, etc.) are thin or missing. |
| **Minimal** | Bare skeleton exists (an index.md, maybe some code) but most sections are missing or stub-quality. |
| **Stub** | A heading or a placeholder promise with no real content — e.g. a "Parts List" header with nothing under it. |

A kit's docs side and src side can — and often do — have different ratings.
Report them separately, then give an overall rating for the kit as a whole.

---

## Documentation checklist (`docs/kits/<name>/`)

Cross-reference [`CONTENT-GENERATION-GUIDELINES.md`](../../../../CONTENT-GENERATION-GUIDELINES.md)
at the repo root — it's the canonical style guide for everything below. Read it
before writing new student-facing prose; this checklist tells you *what
sections must exist*, the guidelines tell you *how to write them*.

- [ ] **`index.md` exists** and is reachable from `docs/kits/index.md` (the kit
  landing page links to it) — not just present on disk.
- [ ] **Wired into `mkdocs.yml` nav.** Every `.md` file under the kit's docs
  directory that's meant to be published appears in the `Robot Kits` nav block.
  A page that exists on disk but isn't in the nav is invisible on the live site
  — this happened to 4 real lab pages in the audited repo (`base-bot/08-servo-lab.md`,
  `base-bot/21-collision-avoidance-ping.md`, `base-bot/24-ping-servo-meter.md`,
  `ultrasonic-bot/11-ping-lab.md`).
- [ ] **Chapter structure follows §1.5 of the content guidelines**: Sparky
  welcome admonition → `## Summary` → `## Concepts Covered` → `## Prerequisites`
  → body sections → Sparky celebration admonition. Most existing kit pages skip
  the `Summary`/`Concepts Covered`/`Prerequisites` triad even when they use
  Sparky correctly elsewhere — don't assume mascot usage implies full structure.
- [ ] **Sparky mascot admonitions used, and used correctly** (§1.6): exactly one
  `mascot-welcome` (first element), exactly one `mascot-celebration` (last
  element), 2–3 uses each of `mascot-thinking`/`mascot-tip`, never two
  back-to-back, max 6 total. Most kit pages in this repo have **zero** mascot
  usage even though the rest of the textbook uses Sparky heavily — this is the
  single most common documentation gap. Don't add mascot admonitions as filler;
  each one must be specific to that section's content.
- [ ] **Parts/BOM list is a real table**, not a sentence. Columns: part name,
  price, purchase link (or "reused from kit X"). A `## Parts List` heading with
  no list under it is a **stub**, not a minimal pass.
- [ ] **Wiring is shown, not just described.** A real photo of the actual
  breadboard/wiring (per [Dan's photo policy](#photo-policy) below), OR a pin
  table (GPIO number → sensor/display pin name), ideally both. Sensor kits
  especially need a breadboard photo — code alone doesn't teach wiring.
- [ ] **Step-by-step instructions are numbered**, whether they're assembly
  steps or programming steps (`01-probe.py`, `02-...`, etc., each with a "try it
  now" instruction). Prose paragraphs describing "connect the sensor" with no
  numbered sequence is weaker than a numbered list.
- [ ] **Links to the matching `src/kits/` source**, including a mention of the
  kit's `upload-code.sh` (or equivalent) so a student/teacher knows how to get
  the code onto the device.
- [ ] **All images referenced actually exist** and have alt text + a caption
  (MkDocs Material figure syntax, §1.8). Check this mechanically — broken image
  refs are easy to miss by eye.
- [ ] **All internal relative links resolve** to real files. A link like
  `../../sensors/03-ping.md` pointing at a directory that doesn't exist is a
  real bug found in this repo (`ultrasonic-bot/11-ping-lab.md`).
- [ ] **No TODO/FIXME/"coming soon"/placeholder text** anywhere in
  student-facing content.
- [ ] **Sub-lab pages are linked from `index.md`**, not only reachable through
  the nav sidebar. `line-follower-bot/index.md` is a real example of this gap:
  the actual lab content lives in `25-line-follower.md`, but `index.md` never
  links to it.
- [ ] **Reading level lands around 8th grade** for student content (short
  sentences, jargon defined inline, active voice) — see guidelines §1.1–§1.3.

### Photo policy

Every image in this textbook is meant to be an **original photo Dan took**, not
a stock photo or AI-generated image. If a kit page is missing a wiring/hardware
photo, the fix is "ask for or take a real photo of this build," not "generate
one." Flag missing photos as a gap to fill with real photography, and don't
substitute a placeholder image yourself.

---

## Instructor-facing content (the biggest systemic gap)

At time of writing, **zero kits** in `docs/kits/` have instructor-facing
content that matches Part 2 of the content guidelines. A couple of kit pages
(`base-bot/01-testing-motor-connections.md`, `swarm-bot/plan.md`) have
instructor-*adjacent* material (learning objectives, a session schedule) but
don't follow the guideline structure and don't cleanly serve either audience.

When auditing a kit, always ask: **is there a place a teacher/mentor/volunteer
running this kit in a classroom can go to get what they need?** If not, that's
a finding — even though it's true for almost every kit today, so don't let "the
other 10 kits don't have this either" excuse skipping it.

What instructor content should cover (guidelines §2.4), whether as a section in
`index.md` or a separate `instructor-guide.md`:

- [ ] **Learning Objectives** — 3–5 Bloom's-Taxonomy verbs mapped to measurable
  outcomes.
- [ ] **Background/Rationale** — why this topic matters, any research framing.
- [ ] **Time and Materials** — exact quantities for a class of 20–24 students.
- [ ] **Preparation Steps** — numbered, what must happen before class starts.
- [ ] **Delivery Guide** — facilitation notes with time estimates, common
  student questions.
- [ ] **Differentiation Notes** — supporting struggling students, extending for
  advanced ones.
- [ ] **Assessment** — a 4-point rubric (Exemplary/Proficient/Developing/
  Beginning), both process and product criteria.
- [ ] **Accessibility and Inclusion notes** — physical accessibility,
  participation equity, language access (guidelines §2.7).
- [ ] **References** — APA citations for any pedagogical claims.
- [ ] Written at **college reading level** (guidelines §2.1–§2.3), **no
  mascot**, third-or-second-person as appropriate.

If a kit's src `README.md` already has strong troubleshooting/setup content
aimed at whoever is running the session, note that as a *partial* instructor
asset — but it's not a substitute for learning objectives, a rubric, or
accessibility notes.

---

## Source code checklist (`src/kits/<name>/`)

### `config.py`
- [ ] Exists and **centralizes every hardware pin and constant** — motor pins,
  I2C pins, NeoPixel pin/count, speaker pin, display pins, sensor
  addresses/registers. No lesson file should hardcode a pin number that could
  live in `config.py`. This was violated in `compass-hmc5883l`, where every
  lesson file re-declares the sensor's I2C pins and register constants instead
  of importing them.
- [ ] Uses the project's naming convention: pin constants end in `_PIN`
  (`RIGHT_FORWARD_PIN`, `LEFT_REVERSE_PIN`, `I2C_SDA_PIN`, `SPEAKER_PIN`, …).
  `src/kits/8-pixel/config.py` breaks this (`MOTOR_RIGHT_FORWARD`, no `_PIN`
  suffix) and inconsistently mixes `BACKWARD`/`REVERSE` for the same pin role —
  treat inconsistent internal naming as its own finding, not just
  convention-drift from other kits.
- [ ] If the kit has motors, defines a **`MOTOR_PWM_FREQUENCY`** constant (the
  project convention is 50 Hz per `CLAUDE.md`) rather than letting each lesson
  file pick its own PWM frequency. Several kits get this wrong in different
  ways: no frequency set at all (falls back to hardware default), or two
  different lesson files in the *same* kit using two different hardcoded
  frequencies.
- [ ] Organized in clearly commented sections (motor driver / NeoPixel /
  speaker / I2C / display), banner-comment style. `base-bot/config.py` is the
  model for this.
- [ ] If the kit needs network credentials, they live in a separate
  **`secrets.py`** (gitignored or clearly a template), never mixed into
  `config.py`. `wi-fi-bot` does this correctly and is worth copying.

### `upload-code.sh` (or equivalent)
- [ ] Exists. A kit with no one-command way to push code to the device is an
  automatic **Partial at best**, regardless of how good the lesson code is.
- [ ] **Actually bundles every runtime dependency**, not just the kit's own
  `.py` files. If any lesson imports `ssd1306`, `VL53L0X`, or another
  non-builtin module, the upload script must either copy a local `lib/` copy
  or pull the shared one from `src/lib/`. This is a real, common bug: 5 of the
  10 audited kits import a driver they never bundle, so running
  `upload-code.sh` alone leaves a freshly-flashed board unable to run the code.
- [ ] Handles `secrets.py` specially if present (upload it once, warn the
  student to edit it first, don't silently overwrite a device's existing
  secrets) — `wi-fi-bot`'s script is the model.
- [ ] Conditionally uploads any device-generated file that legitimately doesn't
  exist yet in a fresh clone (e.g. a `calibration.json` produced by a
  calibration lesson) rather than assuming it's always present.
  `imu-mpu6050/upload-code.sh` is the reference for this pattern.
- [ ] Uses `set -e` (or equivalent) and prints something useful at the end
  (e.g. a device file listing) so a student can tell the upload actually
  worked.

### `README.md`
This file has to serve **two audiences at once** — don't grade it against only
one.

- [ ] **Student angle**: a wiring table, a per-file table explaining what each
  lesson program does and what concept it teaches, and clear "how do I run
  this" instructions.
- [ ] **Instructor/mentor/volunteer angle**: setup prerequisites, common
  failure modes and how to diagnose them (not just wiring — also things like
  "if you see X error, check Y"), and ideally an estimated time. A README that
  documents a *real debugging story* — e.g. "a bad breadboard power rail
  caused an earlier 'no I2C devices found' failure" (from
  `compass-hmc5883l/README.md`) or "SDA/SCL were physically swapped on the test
  breadboard, here's how `01-probe.py` catches that" (from
  `imu-mpu6050/README.md`) — is far more useful to a volunteer running the kit
  than generic wiring instructions, because it's the failure they're actually
  going to hit.
- [ ] Almost every kit in this repo nails the student angle and skips the
  instructor angle almost entirely (troubleshooting narratives are the
  exception, not vice versa). Don't just check "does a README exist" — check
  whether it would actually help a nervous first-time volunteer running the
  lab, not just a student typing commands.

### Lesson progression
- [ ] Lesson files use a **numeric prefix** (`01-probe.py`, `02-...py`, …) that
  signals teaching order. Kits without numbering (`line-follower-bot`,
  `ultrasonic-bot`, `display-bot`) make it much harder for a student to know
  what order to run things in. Numbers that exist but don't track actual
  complexity (`wi-fi-bot` jumps `01`, `02`, then `62`, `68`, `10`, `70`) are
  arguably worse than no numbers, since they actively mislead.
- [ ] The sequence is **genuinely graduated**: each early lesson introduces
  exactly one new concept in isolation (blink an LED, read one sensor value,
  test one motor), and later lessons explicitly combine and build on earlier
  ones. The strongest example in the repo is `imu-mpu6050`, where lesson `08`
  writes a `calibration.json` that lessons `09` and `12` both load and use —
  the later lessons have a hard dependency on the earlier one's output, which
  is a real, checkable signal of "this teaches mastery," not just "these are 12
  unrelated demo scripts in a folder."
- [ ] A final **combined program** exists — usually `main.py` — that
  demonstrates mastery by using multiple concepts from the lesson sequence
  together (e.g. sensor + motors + NeoPixel feedback in one collision-avoidance
  loop). If the kit deliberately avoids shipping a literal `main.py` (to avoid
  silently overwriting whatever's already on a student's device), a
  differently-named template file plus a README instruction to promote it is
  an acceptable substitute — `imu-mpu6050/main-template.py` is the model for
  this pattern. A kit with **no** final combined program at all, or one that
  requires manual copy/rename with no explanation (`rainbow-bot`'s README does
  explain it, so that's fine; an undocumented version wouldn't be), is a real
  gap.
- [ ] No duplicate or near-duplicate files without a documented reason. Check
  for byte-identical files (a strong signal one was a forgotten copy/rename)
  and near-duplicates that differ only in a tuned constant (also worth
  consolidating, or at minimum explaining in a comment why both exist).

### Code quality
- [ ] **Error handling**: every program with a loop (especially anything
  driving motors) wraps its main loop in `try/except KeyboardInterrupt:
  finally:` and shuts down motors/sensors/sound in the `finally` block, per
  `CLAUDE.md`'s stated convention. A `main.py` — the file that auto-runs on
  boot and is hardest to interrupt safely — missing this is a real safety gap,
  not just a style nit.
- [ ] **No dead/commented-out code** left in the "final"/most-complete program
  in a kit. A few leftover commented lines are forgivable in an early lesson
  script; they're a real problem in the file meant to model best practice.
  Double-check for duplicate/no-op assignments too (e.g. `x = x = Something(...)`).
- [ ] **`import machine` is present whenever `machine.Something(...)` is called
  directly.** `from machine import Pin, PWM` does *not* import the `machine`
  name itself — calling `machine.Pin(...)` after only that import raises
  `NameError` at runtime. This exact bug recurred independently in multiple
  files in this repo (`src/kits/8-pixel`'s collision-avoidance scripts,
  `src/lib/23-tof-sound.py`) — it's mechanical and worth grepping for
  explicitly rather than trusting a read-through.
- [ ] **PWM objects wrap a `Pin`, not a bare pin number.** The correct pattern
  is `PWM(Pin(SPEAKER_PIN))`; passing the raw int/config constant directly —
  `PWM(SPEAKER_PIN)` — is a real bug found in `base-bot/15-test-sound.py` and
  will likely raise a `TypeError` on real hardware. If a `config.py` constant
  ending in `_PIN` is passed straight into `PWM(...)` with no `Pin(...)`
  wrapper in between, that's the bug.
- [ ] **Every `config.py` attribute referenced in a lesson file actually
  exists in `config.py`.** A mismatch here (lesson imports
  `config.MOTOR_RIGHT_FORWARD_PIN`, but `config.py` only defines
  `MOTOR_RIGHT_FORWARD`) raises `AttributeError` immediately — this happened in
  `src/kits/8-pixel`.
- [ ] If a kit vendors its own copy of a shared driver from `src/lib/`
  (`ssd1306.py`, `VL53L0X.py`) instead of referencing the shared file directly,
  **check it hasn't silently drifted** from the canonical copy (diff them).
  `src/kits/wifi-display-bot/lib/ssd1306.py` had already diverged (missing a
  method, different constants) at time of writing. Prefer referencing
  `src/lib/` directly over vendoring when the upload tooling allows it; if
  vendoring is unavoidable, note the drift risk in a comment.
- [ ] **Device-specific generated data files** (a `calibration.json` with real
  numbers from one physical sensor) shouldn't be committed as if they were
  generic template data — either gitignore them or clearly label the committed
  copy as illustrative, not authoritative.

---

## Cross-cutting consistency

- [ ] **`docs/kits/<name>` and `src/kits/<name>` use the same directory name.**
  At time of writing this is violated once (`docs/kits/wifi-bot` vs.
  `src/kits/wi-fi-bot`) — not a broken link (the doc text correctly points at
  the real `wi-fi-bot` path), but exactly the kind of drift that breaks
  tooling that assumes the names match. Prefer fixing the mismatch to match
  `CLAUDE.md`'s naming-convention discipline over encoding the alias
  permanently.
- [ ] **Every kit named/promised in `docs/kits/index.md` actually has
  somewhere to go.** The landing page described a "Base Bot with 8-Element
  NeoPixel" variant with a cost breakdown but no link and no
  `docs/kits/` subdirectory at time of writing — likely meant to correspond to
  `src/kits/8-pixel/`, which exists in code but was never given docs. A
  described-but-unlinked kit is worse than an absent one — it promises
  something a reader can't find.
  <a id="planned-kits"></a>
- [ ] **A `src/kits/` directory with no `docs/kits/` counterpart is either an
  abandoned prototype or work in progress — figure out which, don't assume.**
  `src/kits/8-pixel` at time of writing had no docs page **and** had real bugs
  (`NameError`/`AttributeError` in its most "advanced" programs) — it should
  be fixed-and-documented or archived, not left as dead code someone might
  copy as a model.
- [ ] **A `docs/kits/` kit with no `src/kits/` counterpart and its code
  embedded inline in the markdown page** bypasses the whole
  config.py/upload-script/lesson-progression architecture — flag this
  explicitly as "should be extracted into `src/kits/<name>/`" rather than
  grading the inline code against the src checklist directly.
  `docs/kits/bump-switch-bot/index.md` is this case at time of writing.
- [ ] **A kit that's genuinely just a forward-looking plan** (a `plan.md` with
  no `index.md`, and files it references under `src/` don't exist yet — like
  `docs/kits/swarm-bot/plan.md` at time of writing) should be graded as a
  *plan*: does it have a real BOM, a wiring table, a proposed file layout, and
  phased build steps with code skeletons? That's a different, legitimate genre
  from an unfinished built kit — don't penalize it for lacking a `README.md` or
  `upload-code.sh` it was never meant to have yet.

---

## Reference kits to model against

No single kit in the repo is perfect on both docs and src, but two come close
enough to use as concrete models when scaffolding or reviewing:

- **`imu-mpu6050`** — the strongest overall. On the src side: the most
  complete `upload-code.sh` (bundles `lib/`, conditionally uploads
  `calibration.json` if present), the best README (a real hardware-debugging
  anecdote, a per-file table, forward-links into the curriculum), and the most
  deliberately graduated lesson sequence (later scripts load state a `08-`
  calibration script produced). On the docs side: real photos (breadboard,
  box, part-listing screenshots), a parts table, purchasing links, numbered
  steps, correct Sparky usage — though it skips the formal
  `Summary`/`Concepts Covered`/`Prerequisites` block.
- **`compass-hmc5883l`** — the strongest on documentation *structure*
  specifically: the only kit page that fully implements the guidelines'
  chapter structure (Summary → Concepts Covered → Prerequisites → body → Key
  Takeaways → celebration → cited References). Its src side is a clean 6-step
  graduated sequence with a good troubleshooting-driven README, held back only
  by missing `upload-code.sh` and un-centralized sensor constants in
  `config.py`.

When scaffolding a new kit, aim for **imu-mpu6050's asset/upload-script/lesson
pattern combined with compass-hmc5883l's documentation structure** — that
combination doesn't fully exist anywhere yet, which is exactly why it's worth
building new kits toward it rather than copying either one wholesale.

---

## Known repo-wide pitfalls

These showed up more than once across independent kits at time of writing —
worth checking for by default even when nothing else prompts it:

1. Sparky mascot admonitions present in only a small minority of kits, even
   though the rest of the textbook uses them heavily.
2. No formal parts/BOM table in most kits — loose prose costs or nothing.
3. No physical *assembly* instructions anywhere (as opposed to *programming*
   instructions) — every kit explains wiring/uploading, none walk through
   chassis/motor assembly.
4. "index.md is a thin stub, the real content is in an unlinked sub-page"
   pattern.
5. Zero dedicated instructor-facing content anywhere (see above).
6. Upload scripts that don't bundle every imported driver module.
7. PWM frequency handling that's inconsistent within a single kit, let alone
   across kits.
8. `import machine` omitted while `machine.X(...)` is still called.
9. Vendored copies of shared `src/lib/` drivers silently drifting from the
   canonical source.
10. Duplicate or near-duplicate files (sometimes byte-identical) left in place
    with no comment explaining why both exist.

None of these should be assumed still true without checking — they're a
starting hypothesis for where to look, not a permanent scorecard.
