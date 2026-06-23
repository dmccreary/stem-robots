# Content Generation Guidelines

This file is the single source of truth for all AI-generated content in the
**STEM Robots — Computational Thinking** textbook. Read this file before
writing or editing any student-facing chapters, quizzes, glossary entries,
or FAQs. Also read it before writing instructor-facing guides — the rules
differ significantly between the two audiences.

---

## Part 1: Student-Facing Content

**Audience:** Junior high and high school students, grades 8–12. Most have no prior coding
experience. They are building and programming a physical robot, often for the
first time.

**Target reading level:** 8th grade (Flesch-Kincaid Grade 7–9). Short sentences.
Common words. Concrete examples always before abstract definitions.

---

### 1.1 Voice and Tone

- Write in **second person** ("you") and **first-person plural** ("we", "let's").
  Never third-person passive ("the student should", "it is necessary to").
- Be **direct and friendly** — like a knowledgeable older student helping a peer,
  not a textbook reciting facts.
- **Normalize struggle.** Bugs, errors, and confusion are expected. Frame them
  as part of the engineering process, not failures.
- **Celebrate progress.** End sections with what the student has now accomplished,
  not what remains undone.
- **Never talk down.** Explain fully, but treat the reader as intelligent.

### 1.2 Sentence and Paragraph Rules

- Target **sentence length: 10–18 words**. Split any sentence over 25 words.
- Target **paragraph length: 3–5 sentences**. No wall-of-text paragraphs.
- Use **active voice** wherever possible.
- **Define every technical term** the first time it appears in a chapter.
  Put the definition in the sentence itself — do not force students to jump
  to the glossary mid-read.
- Prefer **common English words** over jargon. When jargon is unavoidable
  (it often is in hardware/software topics), give the plain-English equivalent
  first: "PWM, or Pulse Width Modulation, lets us control motor speed by
  rapidly switching the power on and off."

### 1.3 Vocabulary

Prefer these words:

| Instead of… | Use… |
|-------------|------|
| utilize | use |
| implement | build, write, add |
| commence | start |
| terminate | stop, end |
| functionality | feature, behavior |
| aforementioned | earlier, above |
| subsequently | then, next, after that |
| initialize | set up, start |
| instantiate | create |
| parameters | settings, inputs |

Reserve **MicroPython keywords** (variables, functions, loops, etc.) for
their technical meaning — never use them loosely in prose.

### 1.4 Code Examples

- Every code block must be **runnable as written** (no pseudocode in student chapters).
- Always include a **comment on any line that does something non-obvious**.
- Show **one concept at a time**. Do not introduce two new ideas in the same snippet.
- Follow every code block with a sentence explaining what the code *does*, not
  just what it *is*: "This loop runs forever, checking the sensor every 100 ms."
- Use the project's standard `config.py` pin names — never hard-code pin numbers
  in example code.
- Keep examples short: **5–15 lines** is ideal. If a complete working program
  needs more, break it into numbered sections with prose between them.

### 1.5 Chapter Structure

Every chapter must follow this structure in order:

1. **Sparky welcome admonition** (`mascot-welcome`) — 2–3 sentences previewing
   what the student will build or learn in this chapter. Sparky speaks directly
   to the student.
2. **Summary section** (`## Summary`) — 3–5 sentence prose overview of the chapter.
   Written at 8th-grade level. No code or bullet lists.
3. **Concepts Covered section** (`## Concepts Covered`) — numbered list of
   concepts from the learning graph covered in this chapter.
4. **Prerequisites section** (`## Prerequisites`) — what the student should
   already know; links to prior chapters.
5. **Body sections** — the actual content. Each major section (`##`) covers one
   concept or skill. Each section should include: explanation, at least one
   code example, and one hands-on step the student can do right now.
6. **Sparky celebration admonition** (`mascot-celebration`) — at the very end,
   summarizing what was built and celebrating the milestone.

### 1.6 Mascot Admonitions (Sparky)

The textbook mascot is **Sparky** — a friendly cartoon version of the actual
robot students build. Read the full character sheet before writing any
admonition text:

> [`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md)

**Admonition format** — image always in the body, never the title:

```markdown
!!! mascot-welcome "Welcome, Maker!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this chapter, we'll wire up the motor driver and make Sparky roll
    for the very first time. Let's go!
```

**Image path depth:**
- Pages at `docs/chapters/XX-name/index.md` → use `../../img/mascot/`
- Pages at `docs/learning-graph/*.md` → use `../../img/mascot/`
- Pages at `docs/lessons/*.md` → use `../img/mascot/`
- Pages at `docs/*.md` (root level) → use `img/mascot/`

**Placement rules:**
- Maximum **6 mascot admonitions per chapter**
- Never place two mascot admonitions **back to back** — always at least one
  prose paragraph between them
- **One `mascot-welcome` per chapter** — first element after the `#` heading
- **One `mascot-celebration` per chapter** — last element before end of file
- Use `mascot-thinking` and `mascot-tip` 2–3 times each in a typical chapter
- Use `mascot-warning` only for genuinely common mistakes — not as filler
- Use `mascot-encourage` when a section is known to be difficult

**Sparky's voice in admonitions:**
- 1–3 sentences maximum in the body
- Always specific to the chapter content — never generic filler
- Uses "we" and "let's" — students are partners, not pupils
- Calls students **"makers"** or **"engineers"**
- Catchphrase: *"Computational thinking is YOUR superpower — let's activate it!"*
  (use sparingly — once per chapter maximum, usually in the welcome admonition)

**Admonition type quick reference:**

| Type | Pose image | Use for |
|------|-----------|---------|
| `mascot-welcome` | welcome.png | Chapter opening — preview what will be built |
| `mascot-thinking` | thinking.png | Key concept — invite the student to think deeply |
| `mascot-tip` | tip.png | Practical shortcut, pattern, or pro tip |
| `mascot-warning` | warning.png | A specific, named, common mistake to avoid |
| `mascot-encourage` | encouraging.png | A section where students often feel stuck |
| `mascot-celebration` | celebration.png | End of chapter — celebrate what was accomplished |
| `mascot-neutral` | neutral.png | General aside that does not fit another type |

### 1.7 MicroSims

Whenever a concept is easier to understand interactively, include a MicroSim.
Good candidates: PWM waveforms, H-bridge switching, collision avoidance logic,
coordinate systems, sensor ranges.

- MicroSims live at `docs/sims/CONCEPT-NAME/`
- Embed them in chapters using an iframe:
  ```markdown
  <iframe src="../../sims/pwm/main.html" width="100%" height="400px"
          scrolling="no" style="border:none;"></iframe>
  ```
- Always write **one paragraph before** the iframe explaining what the sim shows,
  and **one paragraph after** connecting the sim back to the robot hardware.

### 1.8 Diagrams and Images

- Prefer **Mermaid diagrams** for flowcharts and sequence diagrams — they render
  from text and are maintainable.
- Use **hardware photographs** from `docs/img/` when showing physical assembly steps.
- Every image must have **alt text** that describes what is shown.
- Caption images using the MkDocs Material figure syntax:
  ```markdown
  ![Motor connected to H-bridge](../../img/h-bridge.png)
  *The H-bridge circuit allows the motor to spin in both directions.*
  ```

### 1.9 What to Avoid

- **Do not use passive voice** to describe what code does: not "the function is
  called" but "we call the function."
- **Do not reference the future** ("in chapter 7, you will learn…") — refer to
  concepts the student already knows, not ones they haven't seen.
- **Do not leave TODOs or placeholders** in student-facing content.
- **Do not write multi-paragraph introductions** before the first heading — get
  to content quickly.
- **Do not use humor that alienates.** Light, inclusive humor is fine;
  nerd in-jokes that exclude newcomers are not.
- **Do not reproduce copyrighted material** (datasheets, third-party tutorials
  word-for-word). Summarize and cite.

---

## Part 2: Instructor-Facing Content

**Audience:** Teachers, workshop leaders, after-school program coordinators,
and curriculum developers. Most have some pedagogical training. Many have
engineering or computer science backgrounds; some do not.

**Target reading level:** College level (Flesch-Kincaid Grade 13–16). Full
technical vocabulary is acceptable. Longer, more complex sentences are fine
where precision requires them.

---

### 2.1 Voice and Tone

- Write in **third person or second person**, depending on section type.
  Use second person ("you") for direct instructional guidance
  ("Before class, test that all robots connect to the network").
  Use third person for research-backed claims and pedagogical background.
- Be **collegial and professional** — the tone of a conference proceedings
  paper or a curriculum design handbook, not a consumer how-to guide.
- **Cite research** when making pedagogical claims. Use inline citations
  (Author, Year) and include a References section at the end of each major guide.
- **Distinguish clearly** between what is required vs. recommended vs. optional.
  Use tables or labeled lists when enumerating options.

### 2.2 Sentence and Paragraph Rules

- No strict sentence-length limit, but avoid sentences over 40 words.
  Break complex ideas into structured paragraphs rather than mega-sentences.
- Paragraphs may be longer than in student content — up to 7–8 sentences —
  when developing a nuanced pedagogical argument.
- Use **headers liberally** to make the guide scannable. Instructors are busy;
  they skim before they read.
- Use **tables** to compare options (e.g., competition vs. exploration modes,
  assessment rubric choices, hardware variants).

### 2.3 Technical Vocabulary

Full use of domain vocabulary is appropriate:

- Pedagogical: *scaffolding, metacognition, formative assessment, Bloom's Taxonomy,
  zone of proximal development, differentiated instruction, learning objectives*
- Hardware: *PWM, H-bridge, I2C, SPI, GPIO, ADC, UART, BLE GATT profile,
  time-of-flight, pull-up resistor*
- Software: *MicroPython REPL, module import, interrupt handler, coroutine,
  memory allocation, garbage collection*

Define terms only when an instructor audience might genuinely not know them.

### 2.4 Structure of an Instructor Guide Section

1. **Learning Objectives** — 3–5 Bloom's Taxonomy verbs mapped to measurable
   outcomes for that lesson or module. Example: "Students will *analyze* sensor
   data to *diagnose* collision-avoidance failures."
2. **Background / Rationale** — why this topic matters; relevant research or
   pedagogical framing.
3. **Time and Materials** — exact list with quantities for a class of 20–24 students.
4. **Preparation Steps** — numbered, action-verb driven list. Anything that must
   be done *before* class begins.
5. **Delivery Guide** — step-by-step facilitation notes. Estimated time for each
   segment. Common student questions and suggested responses.
6. **Differentiation Notes** — how to support struggling students and extend
   for advanced students without bifurcating the class.
7. **Assessment** — formative (during class) and summative (end of unit) options
   with sample rubric criteria.
8. **References** — APA-formatted citations for any research claims.

### 2.5 No Mascot Admonitions

Instructor guides do **not** use Sparky or any mascot admonitions. The mascot
is a student-engagement device. Instructor content uses standard MkDocs
admonition types:

```markdown
!!! note "Classroom Management Tip"
    ...

!!! warning "Common Student Misconception"
    ...

!!! tip "Differentiation Opportunity"
    ...
```

### 2.6 Assessments and Rubrics

- Rubrics must use **4-point scales** (Exemplary / Proficient / Developing /
  Beginning) aligned to the stated learning objectives.
- Include **both process and product** criteria — a student who debugs
  methodically but whose robot still fails deserves credit for the process.
- Where possible, provide **sample student work descriptions** at each rubric
  level so instructors can calibrate scoring.

### 2.7 Accessibility and Inclusion Notes

Every major instructor guide should include a subsection on:

- **Physical accessibility** — which labs can be adapted for students with
  motor disabilities (e.g., voice-controlled interfaces, larger buttons).
- **Participation equity** — how to ensure all students get hands-on time,
  not just the most confident builders.
- **Language access** — which concepts benefit from visual or diagrammatic
  explanation for English-language learners.

### 2.8 What to Avoid

- **Do not write instructor guides at 8th-grade reading level** — instructors
  will find them condescending and will not trust the curriculum.
- **Do not make unsupported pedagogical claims** — if you assert that
  competition-based robotics reduces girls' participation, cite the research.
- **Do not duplicate student content verbatim** — quote sparingly and always
  explain the pedagogical purpose.
- **Do not use the mascot** in instructor-facing pages.
- **Do not leave assessment sections blank or vague** — "assess informally"
  is not a rubric.

---

## Quick Reference

| Rule | Student Content | Instructor Content |
|------|----------------|--------------------|
| Reading level | Grade 7–9 | Grade 13–16 |
| Person | 2nd ("you") / 1st plural ("we") | 2nd or 3rd |
| Tone | Friendly, encouraging, concrete | Professional, collegial, evidence-based |
| Mascot admonitions | Yes — follow Sparky rules (§1.6) | No |
| Technical jargon | Define every term inline | Full use, define only if unusual |
| Code examples | Runnable, 5–15 lines, heavily commented | Snippets OK, focus on pedagogy not syntax |
| Citations | Not required | Required for all pedagogical claims |
| Sentence length | 10–18 words target | Up to 40 words acceptable |
| Assessments | End-of-chapter quiz questions | Full rubrics, Bloom's-aligned objectives |

---

*For mascot visual identity and full character voice guide, see
[`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md).*
