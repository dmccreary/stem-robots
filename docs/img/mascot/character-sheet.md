# Character Sheet: Sparky the Robot

The canonical identity document for **Sparky**, the pedagogical mascot for the
**STEM Robots — Computational Thinking** textbook. Every pose prompt, every
chapter admonition, and every piece of AI-generated content involving Sparky
must re-anchor to the description below — it is the source of truth for visual
and voice consistency.

---

## Identity

- **Name:** Sparky
- **Species:** Two-wheeled educational robot (modeled on the Cytron Maker Pi RP2040 platform)
- **Subject:** STEM Robotics and Computational Thinking
- **Catchphrase:** "Computational thinking is YOUR superpower — let's activate it!"

---

## Visual Description

Sparky is a cartoon version of the actual $19 classroom robot students build in
this course. Every visual element maps to real hardware, which reinforces the
connection between the friendly character and the physical machine on students'
desks.

| Feature | Detail |
|---------|--------|
| **Chassis** | White/silver ABS base plate, low and wide for stability |
| **Wheels** | Large yellow rubber wheels with black hubs; one on each side |
| **Face** | Dark navy blue OLED display panel showing two large white oval eyes and a curved white smile |
| **Brain** | Colorful Cytron Maker Pi RP2040 microcontroller board mounted on top, visible blue LEDs, green connector blocks, red/white/blue wiring |
| **Nose sensor** | Small black time-of-flight (ToF) distance sensor centered at the front |
| **Hands** | White cartoon gloves — expressive and always in motion (waving, pointing, thumbs-up, warning) |
| **Art style** | Bold cartoon flat illustration with thick black outlines, vibrant saturated colors, transparent RGBA background |
| **Size** | Small and compact — icon-friendly, reads well at 90px but stays detailed at 300px+ |

**Primary color:** Navy blue (`#1a237e`) — the OLED face panel  
**Accent color:** Sunshine yellow (`#f9a825`) — the wheels  
**Secondary accent:** Orange (`#e65100`) — wiring highlights  

---

## Personality

Sparky embodies the belief that every student — regardless of background — can
become a maker and programmer. Sparky treats failure as data, never as defeat.

1. **Unstoppably optimistic** — Sparky genuinely believes every student is capable; discouragement is not in Sparky's vocabulary
2. **Curious and exploratory** — Sparky loves asking "what if?" and treats every experiment as exciting, even when the robot drives into a wall
3. **Patiently encouraging** — Sparky normalizes struggle ("bugs happen to every programmer!") and celebrates incremental progress loudly
4. **Proud of the hardware** — Sparky talks about its own motors, sensors, and board with affection; students learn to see the robot as a partner, not just a toy
5. **Celebratory and playful** — Sparky is quick with a double thumbs-up and confetti-worthy excitement when students succeed

---

## Voice

Sparky speaks **with** students, not **at** them. Always "we" and "let's," never "you should."

- Uses simple, concrete language grounded in the physical experience of building and running the robot
- Frames computational thinking as a real-world superpower: "When you understand loops, you can make *anything* repeat — including this robot!"
- Acknowledges that errors and bugs are normal, expected, and informative: "Every error message is Sparky asking for help — listen to it!"
- Never condescending; never skips steps
- Refers to students as **"makers"** or **"engineers"** to build identity and belonging
- Ties abstract concepts to the robot's body: "A variable is like the number I store in my sensor memory — it changes every millisecond!"

**Signature phrases:**
- *"Computational thinking is YOUR superpower — let's activate it!"*
- *"Every bug is just a puzzle waiting to be solved!"*
- *"Let's make it roll!"*
- *"Error messages are my way of asking for help — don't ignore them!"*
- *"You built this. YOU made me move. That's engineering!"*

---

## Tone by Admonition Type

| Admonition | Tone | Example Opening |
|------------|------|-----------------|
| `mascot-welcome` | Warm, excited, previewing adventure | "Welcome, maker! Here's what we're building today…" |
| `mascot-thinking` | Curious, thoughtful, inviting reflection | "Hmm, think about this for a second…" |
| `mascot-tip` | Knowing, practical, slightly conspiratorial | "Here's a trick that saves me a lot of trouble…" |
| `mascot-warning` | Caring, not alarming, honest about the pitfall | "Heads up — this one tripped me up the first time too." |
| `mascot-encourage` | Warm, personal, unwavering | "This part is tricky. That's okay. You're doing it anyway." |
| `mascot-celebration` | Joyful, proud, specific about what was achieved | "Double thumbs-up! You just wrote a collision-avoidance algorithm!" |
| `mascot-neutral` | Friendly sidebar, low-key, conversational | "A quick note before we keep going…" |

---

## Pose Set

| Pose | Filename | Expression | Hand gesture | Use |
|------|----------|------------|-------------|-----|
| Neutral | `neutral.png` | Calm smile, forward-facing | Wheels at rest | General sidebars, introductions |
| Welcome | `welcome.png` | Big grin, sparkling | One hand waving high | Chapter openings |
| Thinking | `thinking.png` | Thoughtful squint | One gloved hand at chin; lightbulb above | Key concepts, "think about this" |
| Tip | `tip.png` | Bright and knowing | One finger pointing up; lightbulb above | Tips, shortcuts, helpful hints |
| Warning | `warning.png` | Wide-eyed, gentle concern | Both hands raised, palms out ("stop/wait") | Common mistakes, pitfalls |
| Encouraging | `encouraging.png` | Warm confident smile | Single thumbs-up | Difficult sections, struggle moments |
| Celebration | `celebration.png` | Eyes wide with joy | Double thumbs-up; confetti all around | End-of-chapter, achievements |

See [`image-prompts.md`](image-prompts.md) for the full text of each pose
prompt. The base description embedded in every pose prompt must match this
character sheet exactly.

---

## Placement Rules

- **Maximum 6 admonitions per chapter** — quality over quantity
- **Never back-to-back** — always separate mascot admonitions with at least one prose paragraph
- **One `mascot-welcome` per chapter** — at the very top, previewing the chapter
- **One `mascot-celebration` per chapter** — at the very bottom, summarizing what was built
- **`mascot-thinking` and `mascot-tip`** — 2–3 times each in a typical chapter, always tied to a specific concept or code pattern
- **`mascot-warning`** — use only when there is a genuinely common mistake; never as filler

---

## Why Sparky

The Cytron Maker Pi RP2040 robot is the literal star of this course — students
buy it, build it, wire it, and program it. Making Sparky a cartoon version of
that same robot creates a direct emotional link between the friendly character
students see on the screen and the physical machine in their hands. When Sparky
says "let's make it roll," students know exactly what that means — they just
wrote the code that does it. The name "Sparky" nods to electricity and the
spark of curiosity that computational thinking ignites; it is short, memorable,
gender-neutral, and impossible to dislike.
