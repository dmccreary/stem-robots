---
title: What Goes in Git Sorting Activity
description: Drag ten robot project files into "Commit to Git" or "Put in .gitignore", watch the repository preview and the generated .gitignore update, and check which files keep your WiFi password safe.
image: /sims/git-what-to-commit-sorter/git-what-to-commit-sorter.png
og:image: /sims/git-what-to-commit-sorter/git-what-to-commit-sorter.png
twitter:image: /sims/git-what-to-commit-sorter/git-what-to-commit-sorter.png
social:
   cards: false
quality_score: 100
---

# What Goes in Git Sorting Activity

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the What Goes in Git Sorting Activity Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/git-what-to-commit-sorter/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

Not every file in your robot project belongs in a Git repository. Your code
and documentation should be committed, so they are saved and shared. Files
that hold passwords, or files your computer makes automatically, belong in
`.gitignore`, the list of files Git should skip.

This MicroSim is a sorting game with ten real project files: `main.py`,
`config.py`, `motors.py`, `vl53l0x.py`, `README.md`, `secrets.py`,
`wifi_password.txt`, `__pycache__/`, `notes.pyc`, and `.DS_Store`. You drag
each card into one of two bins.

Two panels update after every drop:

- The **Repository preview** lists what would be public on GitHub. If a
  password file lands in the commit bin, the panel turns red with a lock and
  the warning "Your WiFi password is now public!"
- The **Generated .gitignore** panel builds the file you would create, one
  line per ignored file.

## How to Use

1. Drag each file card from **Project files** into **Commit to Git** or
   **Put in .gitignore**. Drop a card anywhere else to send it back to the pile.
2. Check **Show hints** if you want a one-line clue under each card in the pile.
3. Press **Check answers**. Each card gets a green check or a red X, and the
   score shows how many of the 10 are correct.
4. Click any card after checking to read why it belongs in its bin.
5. Press **Reset** to start again.

This MicroSim goes with the version control section of
[Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory programming with a physical robot)

### Duration

10–15 minutes

### Prerequisites

- The Git commit workflow: `git add` and `git commit` (Chapter 5, "Version Control with Git")
- The `config.py` pattern and module files (Chapter 5, "Modular Programming")
- Knowing that `secrets.py` stores the WiFi name and password (Chapter 5, "The .gitignore File")

### Learning Objective

Students will be able to **classify** (Bloom's Taxonomy: Understand) robot
project files as belonging in a Git repository or in `.gitignore`, and explain
why each choice protects the project or its secrets.

### Activities

1. **Sort without hints (4 min).** Students sort all ten cards with hints off
   and press **Check answers**. They record their first score.
2. **Learn from mistakes (3 min).** Students click each red X card, read the
   reason, and move it. They re-check until they reach 10 of 10.
3. **Group the reasons (4 min).** In pairs, students sort the five ignored
   files into two groups: "secrets" and "made automatically." They explain why
   each group stays out of Git.
4. **Build the real file (3 min).** Students compare the **Generated
   .gitignore** panel with the chapter's `.gitignore` and note that `*.pyc`
   covers every compiled file, not just `notes.pyc`.

### Assessment

- **Challenge:** Sort all ten cards with no hints and score 10 of 10. Then
  answer: what happens if you commit `secrets.py` before adding it to
  `.gitignore`? *Answer:* the password is stored in the repository history,
  so you should change the password right away.
- **Exit ticket:** "Name one file that must never be committed and one file
  that must always be committed. Give a reason for each."
- **Rubric (4-point):** *Exemplary* scores 10 of 10 without hints and explains
  both categories of ignored files, including why a leaked password must be
  changed. *Proficient* scores 9–10 and explains the password risk.
  *Developing* scores 7–8 or ignores library files such as `vl53l0x.py`.
  *Beginning* scores below 7 or commits password files.

## References

1. [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md) - the Git commit workflow and the `.gitignore` file for robot projects.
2. [Git documentation: gitignore](https://git-scm.com/docs/gitignore) - the official reference for `.gitignore` patterns.
3. [GitHub Docs: Ignoring files](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files) - how to create a `.gitignore` for a repository.
4. [GitHub Docs: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) - why a committed secret stays in history and must be changed.
5. [Git (Wikipedia)](https://en.wikipedia.org/wiki/Git) - background on the Git version control system.
