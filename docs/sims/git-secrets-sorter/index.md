---
title: "Commit or Ignore Sorter"
description: "A drag-and-drop sorting activity where students decide which robot project files to commit to git and which to add to .gitignore, with a reason for every choice."
image: /sims/git-secrets-sorter/git-secrets-sorter.png
og:image: /sims/git-secrets-sorter/git-secrets-sorter.png
twitter:image: /sims/git-secrets-sorter/git-secrets-sorter.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Commit or Ignore Sorter

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Commit or Ignore Sorter MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every robot project folder holds two kinds of files.
Some files are your real work, like `main.py` and `config.py`. You want git to save them.
Other files should never be saved. Some hold secrets, like your WiFi password.
Others are junk files that your computer or Python makes on its own.

The `.gitignore` file tells git which files to skip.
In this MicroSim you sort ten files from a robot project into two bins:

- **Commit to git** (green) — files that belong in the repository.
- **Add to .gitignore** (red) — files git should skip.

After each drop, the card gets a green check or a red X, and the feedback panel tells you *why*.
The dark box on the right builds a live `.gitignore` file from everything in the red bin.
For `notes.pyc` it writes the pattern `*.pyc`, which skips every compiled Python file at once.

One card, `heading_log.csv`, is a discussion card. Either bin is fine, and the feedback explains when each choice makes sense.

## How to Use

1. Drag a file card from the pile into the green bin or the red bin.
2. Read the feedback. If you see a red X, drag the card to the other bin.
3. No mouse? Click a card (or use the **Up** and **Down** arrow keys) and press **Commit selected** or **Add selected to .gitignore**. The **C** and **I** keys work too.
4. Press **Check All** to color every sorted card and count what is left.
5. Press **Show Answers** to see the answer key, or **Reset** to start over.

**Try this challenge:** Get 10 out of 10. Then compare your preview with the `.gitignore` in
[Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md).
Which line protects your WiFi password?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/git-secrets-sorter/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *classify* robot project files as belonging in version control or in `.gitignore`, and will *explain* the reason for each decision using the ideas of secrets, rebuilt files, and shared hardware facts (Bloom's Taxonomy: Understand).

### Grade Level

Grades 8–12

### Duration

10–15 minutes

### Prerequisites

- Git basics (repository, commit) from [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md).
- The config, secrets, and `.gitignore` file patterns in [Chapter 10](../../chapters/10-robot-behaviors-navigation/index.md).
- Awareness that `secrets.py` holds the WiFi SSID and password used to connect the robot.

### Activities

1. **Cold sort (4 min).** Students sort all ten cards without reading the chapter again, writing down their reasoning for any card they hesitate on. The immediate feedback supports self-correction.
2. **Categorize the reasons (4 min).** In pairs, students group the ignored files by reason: *secret* (`secrets.py`), *rebuilt automatically* (`__pycache__/`, `notes.pyc`), and *operating-system clutter* (`.DS_Store`). They then state the rule for committed files: source code, configuration that is safe to share, documentation, and libraries the code imports.
3. **Discussion card (3 min).** The class debates where `heading_log.csv` belongs. Prompt: "When would a data log be private or too large to commit?"
4. **Transfer (3 min).** Students open their own project folder, list every file, and write the `.gitignore` they need, then check that `secrets.py` is on the first line.

### Assessment

- **Formative:** Watch for students who place `config.py` in the red bin. Ask them to name what is inside it (pin numbers and tuning constants) and whether a stranger could misuse that information.
- **Exit ticket:** "A classmate committed `secrets.py` last week and then added it to `.gitignore` today. Is the password safe now? What must they do?" (No — it remains in git history; they must change the WiFi password.)
- **Rubric (4-point):** *Exemplary* — 10 of 10 on the first attempt and a correct reason for every file, including the history problem for committed secrets. *Proficient* — 10 of 10 after at most two corrections, with correct reasons for the secret and rebuilt-file cases. *Developing* — correct sorting with feedback but reasons are vague ("it is not needed"). *Beginning* — commits `secrets.py` or ignores source code without recognizing the problem.

## References

1. [Chapter 10: Robot Behaviors and Autonomous Navigation](../../chapters/10-robot-behaviors-navigation/index.md) — the config, secrets, and `.gitignore` patterns this sim practices.
2. [gitignore documentation](https://git-scm.com/docs/gitignore) — the official Git reference for `.gitignore` patterns such as `*.pyc` and `__pycache__/`.
3. [Ignoring files (GitHub Docs)](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files) — how to create a `.gitignore` file for a repository.
4. [Removing sensitive data from a repository (GitHub Docs)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) — why a committed secret stays in history and must be changed.
5. ["Compiled" Python files](https://docs.python.org/3/tutorial/modules.html#compiled-python-files) — Python tutorial section on `__pycache__` and `.pyc` files.
6. [.DS_Store](https://en.wikipedia.org/wiki/.DS_Store) — Wikipedia article on the hidden folder file that macOS creates.
