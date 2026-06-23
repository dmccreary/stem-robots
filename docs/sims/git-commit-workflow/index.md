---
title: Git Commit Workflow
description: Type: diagram **sim-id:** git-commit-workflow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid flowchart (graph LR, left to right) showing the four Git areas:  1.
image: /sims/git-commit-workflow/git-commit-workflow.png
og:image: /sims/git-commit-workflow/git-commit-workflow.png
twitter:image: /sims/git-commit-workflow/git-commit-workflow.png
social:
   cards: false
status: implemented
library: Mermaid
bloom_level: TBD
---

# Git Commit Workflow

<iframe src="main.html" width="100%" height="300" scrolling="no"></iframe>

[Run the Git Commit Workflow MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: diagram **sim-id:** git-commit-workflow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid flowchart (graph LR, left to right) showing the four Git areas:  1.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/git-commit-workflow/main.html" width="100%" height="300" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: diagram **sim-id:** git-commit-workflow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid flowchart (graph LR, left to right) showing the four Git areas:  1.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md)
- [Git documentation](https://git-scm.com/doc)
- [Git (Wikipedia)](https://en.wikipedia.org/wiki/Git)

## Specification

The full specification below is extracted from [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).

```text
Type: diagram
**sim-id:** git-commit-workflow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a Mermaid flowchart (graph LR, left to right) showing the four Git areas:

1. "Working Directory" (yellow box) — where you edit files
2. "Staging Area" (orange box) — files marked for the next commit
3. "Local Repository" (blue box) — committed history on your laptop
4. "Remote (GitHub)" (green box) — optional cloud backup

Arrows between areas labeled with commands:
- Working Dir → Staging Area: `git add`
- Staging Area → Local Repo: `git commit -m "message"`
- Local Repo → Remote: `git push`
- Remote → Local Repo: `git pull`

Every box and every arrow has a click directive that opens an infobox with a plain-language explanation of what that area stores or what that command does.

Canvas: 700 × 200 px. Responsive on window resize.
```

