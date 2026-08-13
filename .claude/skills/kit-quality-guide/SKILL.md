---
name: kit-quality-guide
description: Audits and scaffolds STEM robot "kits" in this repo -- the pairing of docs/kits/<name>/ (student lesson pages) and src/kits/<name>/ (MicroPython lesson code) that together make up either a driveable robot kit (directory ends in "-bot") or a standalone sensor kit (e.g. imu-mpu6050, compass-hmc5883l). Covers documentation completeness (parts/BOM lists, wiring photos, Sparky mascot usage, chapter structure), hardware config.py conventions, upload-code.sh completeness, dual-audience student+instructor READMEs, and graduated simple-to-complex lesson progressions. Use this whenever the user asks to audit, review, grade, check, score, or improve the quality/completeness of a kit; wants to add, create, scaffold, or start a new robot kit or sensor kit; mentions a kit that's missing docs, a config.py, an upload script, a README, or lesson code; or references anything under docs/kits/, src/kits/, a "-bot" kit, or consistency between a kit's docs and its code.
---

# Kit Quality Guide

A **kit** in this repo is the pairing of `docs/kits/<name>/` (student lesson
pages) and `src/kits/<name>/` (the MicroPython code that goes with it). Two
kinds:

- **Robot kit** -- directory name ends in `-bot` (chassis + motors, the
  student drives it).
- **Standalone sensor kit** -- no `-bot` suffix (breadboard + Pico + one
  sensor, e.g. `imu-mpu6050`, `compass-hmc5883l`).

This skill has two modes: **audit** an existing kit and report/fill gaps, or
**scaffold** a brand-new kit from a brief description. Both modes lean on the
same checklist.

Before doing either, skim
[`references/checklist.md`](references/checklist.md) -- it's the full
checklist this skill is built from, with the reasoning behind each item and
concrete examples (good and bad) pulled from a real audit of every kit in
this repo. This file (`SKILL.md`) is the workflow; that file is the
substance. Also read
[`CONTENT-GENERATION-GUIDELINES.md`](../../../CONTENT-GENERATION-GUIDELINES.md)
at the repo root before writing any student-facing prose -- it governs voice,
reading level, and the Sparky mascot rules that the checklist expects docs
pages to follow.

## Mode 1: Audit a kit

1. **Run the mechanical checker** from the repo root:
   ```bash
   python3 .claude/skills/kit-quality-guide/scripts/audit_kit.py <kit-name>
   ```
   Use `--all` to sweep every kit, or `--list` to see which kits exist on the
   docs side, the src side, or both (it already knows about the one confirmed
   docs/src naming mismatch in this repo, `wifi-bot`/`wi-fi-bot`). The script
   catches the *mechanical* half of the checklist: missing files, broken
   links/images, un-numbered lessons, duplicate files, missing
   `KeyboardInterrupt`/`finally` cleanup, an upload script that doesn't bundle
   a driver a lesson actually imports, and a few specific bug patterns that
   have recurred independently across kits in this repo (`machine.X()` called
   without `import machine`; `PWM(<pin>)` passed a bare pin instead of
   `PWM(Pin(<pin>))`; a lesson referencing a `config.py` attribute that was
   never defined). Trust its findings -- they're regex/AST-adjacent checks
   against real file contents, not guesses.

2. **Layer your own judgment on top using `references/checklist.md`.** The
   script only checks what's mechanically checkable, and only in the files
   its heuristics target (e.g. it checks `main.py`/`main-template.py` for
   `KeyboardInterrupt`/`finally` cleanup, but not other files that also drive
   motors in a loop -- read every lesson file, don't assume the script's
   scope is exhaustive). Things it can't see at all, so read for these by
   hand every time: whether a wiring photo is a real, in-focus photo of the
   actual build (see the Photo Policy below); whether Sparky's voice is
   specific to the content or generic filler; whether the lesson sequence is
   *genuinely* graduated (later lessons conceptually building on earlier ones)
   versus just numbered; whether a page claimed in the nav is actually
   *linked* from the kit's own `index.md`, not just reachable through the
   sidebar; whether a README's claims about the code (e.g. "every script
   imports `init_display()`") are actually true; whether a README's
   troubleshooting notes would actually help a nervous volunteer, or whether
   the kit has any instructor-facing content at all (checklist
   §"Instructor-facing content" -- this is missing from almost every kit
   today, so expect to flag it on nearly every audit, not just some).

3. **Rate the docs side and src side separately**, then give an overall
   rating, using the four-band scale from the checklist: Stub / Minimal /
   Partial / Complete. Cite specific files and line numbers for every finding
   -- "no BOM table" is less useful than "`index.md` has a `## Parts List`
   heading with nothing under it."

4. **If asked to close the gaps**, don't just describe what's missing --
   write it, using `assets/templates/` as a starting skeleton and
   `imu-mpu6050`/`compass-hmc5883l` (the two reference kits, see checklist) as
   the target model for structure and depth. Two hard limits:
   - **Never fabricate a part price, purchase link, citation, or wiring
     detail.** If you don't know the real answer, leave it as a `{{TODO: ...}}`
     placeholder and say so explicitly, rather than inventing a plausible
     one.
   - **Never substitute a stock or AI-generated image for a missing hardware
     photo.** Every image in this textbook is meant to be a real photo Dan
     took of the actual build. Flag a missing photo as something to shoot,
     not something to generate.

   After editing, re-run `audit_kit.py` on the kit to confirm the mechanical
   checks pass before calling the work done.

## Mode 2: Scaffold a new kit

1. **Pick the kit type and name** from the user's description: does it end
   up as a driveable robot (`-bot` suffix) or a standalone sensor kit (no
   suffix)? Use the same name for both `docs/kits/<name>/` and
   `src/kits/<name>/` -- don't introduce a new docs/src naming mismatch (the
   checklist flags the one that already exists in this repo as a bug, not a
   pattern to repeat).

2. **Copy and customize the templates** in `assets/templates/`:
   - `config.py.template` -- hardware constants, `_PIN`-suffixed naming,
     `MOTOR_PWM_FREQUENCY` if it has motors.
   - `upload-code.sh.template` -- bundles `lib/` (if any), `secrets.py` (if
     any), `config.py`, and every numbered lesson.
   - `README.md.template` -- wiring table + per-file table +
     **instructor/mentor section** (don't skip this one just because most
     existing kits do).
   - `docs-index.md.template` -- full chapter structure per
     `CONTENT-GENERATION-GUIDELINES.md` §1.5 (Sparky welcome → Summary →
     Concepts Covered → Prerequisites → numbered body → Key Takeaways →
     Sparky celebration → References).
   - `lesson.py.template` -- one skeleton per numbered lesson; each lesson
     teaches exactly one new concept.
   - `main-template.py.template` -- the combined "mastery" program; decide
     whether to ship it as a literal `main.py` or as a template a
     student/instructor promotes manually (see the template's own comment
     for when each makes sense).

3. **Design the lesson sequence before writing code.** Start with a
   diagnostic/probe lesson if the kit involves a new sensor (confirms wiring
   before anything else depends on it -- see `01-probe.py` in both reference
   kits). Then one lesson per isolated concept. Then the combined program.
   If a later lesson can meaningfully depend on an earlier one's output
   (like `imu-mpu6050`'s calibration file), that's a strong signal of a
   well-designed sequence -- look for that opportunity rather than writing 12
   independent demos.

4. **Wire it into the site**: add an entry to `docs/kits/index.md` and to the
   `Robot Kits` nav block in `mkdocs.yml`. A kit that exists on disk but isn't
   linked/navigable is exactly the "orphaned page" failure mode the checklist
   calls out.

5. **Run `audit_kit.py <name>`** once the skeleton is in place, fix whatever
   it flags, then hand off remaining human-only gaps (real photos, real
   prices, a bench to actually build and test the wiring against) as an
   explicit list rather than silently leaving them out.

## Quick reference

| Need | Where |
|---|---|
| Full checklist with rationale and examples | `references/checklist.md` |
| Mechanical checker (run this first, always) | `scripts/audit_kit.py` |
| Scaffold templates | `assets/templates/` |
| Voice/style/reading-level rules for prose you write | `CONTENT-GENERATION-GUIDELINES.md` (repo root) |
| The two kits to model new/fixed work against | `imu-mpu6050` (best src+assets), `compass-hmc5883l` (best docs structure) -- see checklist for why |
