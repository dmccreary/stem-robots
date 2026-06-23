Run the /microsim-utils program that scans the @docs/chapters/*/index.md for #### Diagram files and generates a @docs/sims/TODO list of JSON specifications 

Launching skill: microsim-utils
The skill has been loaded and I can see the routing table. The user wants to scan `docs/chapters/*/index.md` for `#### Diagram` sections and generate a TODO list of JSON specifications. This matches the `create-microsim-todo-json-files.py` script route.

Let me run the Python script with the correct project directory.
This routes to the create-microsim-todo-json-files.py script. Let me run it now.

Ran
Run the TODO JSON extractor script on the stem-robots project
Bash
python3 /Users/danmccreary/.claude/skills/microsim-utils/scripts/create-microsim-todo-json-files.py --project-dir /Users/danmccreary/Documents/ws/stem-robots
Project root: /Users/danmccreary/Documents/ws/stem-robots
Chapters scanned: 13
Total diagram specs found: 20
Already implemented (have main.html): 0
TODO JSON files written: 20
Output directory: /Users/danmccreary/Documents/ws/stem-robots/docs/sims/TODO
The script completed successfully. Here's the summary:

Metric	Count
Chapters scanned	13
Diagram specs found	20
Already implemented	0
TODO JSON files written	20
All 20 specs were new (none had an existing main.html), so 20 JSON files were written to docs/sims/TODO/. You can now run the scaffold step to generate stub main.html, index.md, and metadata.json files for each — just say "scaffold the microsims from the TODO files."