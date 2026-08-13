#!/usr/bin/env python3
"""Mechanical quality checks for stem-robots kits.

Covers the grep-able half of ../references/checklist.md: file existence,
naming conventions, broken links/images, lesson numbering, duplicate files,
upload-script dependency bundling, and a handful of specific bug patterns
that have recurred independently across multiple kits in this repo
(missing `import machine`, `PWM(<pin int>)` instead of `PWM(Pin(<pin>))`,
config attributes referenced but never defined).

This script cannot check the qualitative half of the checklist: photo
quality, Sparky voice/pacing, whether a README's troubleshooting notes are
actually useful, pedagogical soundness of the lesson sequence, etc. Read
references/checklist.md and layer human/model judgment on top of this
report -- don't treat a clean run as "this kit is done."

Usage:
    python3 audit_kit.py <kit-name> [<kit-name> ...]
    python3 audit_kit.py --all
    python3 audit_kit.py --list
"""

import argparse
import hashlib
import re
import sys
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
REPO_ROOT = SCRIPT_PATH.parents[4]  # scripts/ -> kit-quality-guide/ -> skills/ -> .claude/ -> repo root
DOCS_KITS = REPO_ROOT / "docs" / "kits"
SRC_KITS = REPO_ROOT / "src" / "kits"
MKDOCS_YML = REPO_ROOT / "mkdocs.yml"

# Known as of the original audit (Aug 2026). Re-verify before trusting --
# these are exactly the kind of thing that drifts silently.
DOCS_TO_SRC_ALIASES = {
    "wifi-bot": "wi-fi-bot",
}
SRC_TO_DOCS_ALIASES = {v: k for k, v in DOCS_TO_SRC_ALIASES.items()}

# Frozen/builtin MicroPython modules -- importing these needs no bundling.
BUILTIN_MODULES = {
    "machine", "time", "math", "sys", "gc", "network", "socket", "usocket",
    "ujson", "json", "os", "uos", "struct", "ustruct", "array", "random",
    "urandom", "neopixel", "utime", "micropython", "_thread", "collections",
    "errno", "uerrno", "select", "uselect", "binascii", "uasyncio", "asyncio",
    "uio", "io", "binascii", "ubinascii", "framebuf",
}

PASS, WARN, FAIL, INFO = "PASS", "WARN", "FAIL", "INFO"
SYMBOLS = {PASS: "✅", WARN: "⚠️", FAIL: "❌", INFO: "ℹ️"}


class Report:
    def __init__(self, title):
        self.title = title
        self.lines = []
        self.counts = {PASS: 0, WARN: 0, FAIL: 0, INFO: 0}

    def add(self, status, label, detail=""):
        self.counts[status] += 1
        text = f"{SYMBOLS[status]} **{label}**"
        if detail:
            text += f" -- {detail}"
        self.lines.append(text)

    def section(self, name):
        self.lines.append(f"\n### {name}")

    def render(self):
        out = [f"## {self.title}"]
        out.extend(self.lines)
        return "\n".join(out)


def resolve_kit(name):
    """Return (canonical_name, docs_dir_or_None, src_dir_or_None)."""
    docs_dir = DOCS_KITS / name
    src_dir = SRC_KITS / name
    if not docs_dir.is_dir() and name in SRC_TO_DOCS_ALIASES:
        docs_dir = DOCS_KITS / SRC_TO_DOCS_ALIASES[name]
    if not src_dir.is_dir() and name in DOCS_TO_SRC_ALIASES:
        src_dir = SRC_KITS / DOCS_TO_SRC_ALIASES[name]
    docs_dir = docs_dir if docs_dir.is_dir() else None
    src_dir = src_dir if src_dir.is_dir() else None
    return name, docs_dir, src_dir


def discover_all_kit_names():
    names = set()
    if DOCS_KITS.is_dir():
        for p in DOCS_KITS.iterdir():
            if p.is_dir():
                names.add(p.name)
    if SRC_KITS.is_dir():
        for p in SRC_KITS.iterdir():
            if p.is_dir():
                names.add(SRC_TO_DOCS_ALIASES.get(p.name, p.name))
    return sorted(names)


# ---------------------------------------------------------------------------
# docs/kits/<name> checks
# ---------------------------------------------------------------------------

LINK_RE = re.compile(r"\]\(([^)]+)\)")
MASCOT_RE = re.compile(r"!!!\s*mascot-(\w[\w-]*)")
HEADING_RE = re.compile(r"^#{1,3}\s+(.+)$", re.MULTILINE)
TODO_RE = re.compile(r"\b(TODO|FIXME|XXX)\b|coming soon", re.IGNORECASE)


def audit_docs(name, docs_dir, r):
    r.section("Documentation (docs/kits/)")
    if docs_dir is None:
        r.add(FAIL, "docs/kits directory", f"no directory found for '{name}' (checked alias too)")
        return

    md_files = sorted(docs_dir.rglob("*.md"))
    index_md = docs_dir / "index.md"
    if index_md.exists():
        r.add(PASS, "index.md exists")
    else:
        r.add(FAIL, "index.md exists", "missing -- every kit needs a landing page")

    kits_index = DOCS_KITS / "index.md"
    if kits_index.exists():
        text = kits_index.read_text(errors="replace")
        if f"{docs_dir.name}/" in text:
            r.add(PASS, "linked from docs/kits/index.md")
        else:
            r.add(WARN, "linked from docs/kits/index.md", "no reference to this kit's directory found on the landing page")

    if MKDOCS_YML.exists():
        nav_text = MKDOCS_YML.read_text(errors="replace")
        nav_referenced = [f.name for f in md_files if f"kits/{docs_dir.name}/{f.name}" in nav_text]
        missing_from_nav = [f.name for f in md_files if f.name not in nav_referenced]
        if not missing_from_nav:
            r.add(PASS, "all docs pages wired into mkdocs.yml nav")
        else:
            r.add(WARN, "pages missing from mkdocs.yml nav (orphaned)", ", ".join(missing_from_nav))

    if not index_md.exists():
        return

    text = index_md.read_text(errors="replace")

    mascots = MASCOT_RE.findall(text)
    welcome_n = mascots.count("welcome")
    celebration_n = mascots.count("celebration")
    if welcome_n == 0 and celebration_n == 0:
        r.add(WARN, "Sparky mascot admonitions", "none found in index.md -- see checklist §Documentation")
    else:
        detail = f"{len(mascots)} total (welcome={welcome_n}, celebration={celebration_n})"
        status = PASS if welcome_n == 1 and celebration_n == 1 else WARN
        r.add(status, "Sparky mascot admonitions present", detail)

    headings = [h.strip() for h in HEADING_RE.findall(text)]
    for expected in ("Summary", "Concepts Covered", "Prerequisites"):
        if any(expected.lower() in h.lower() for h in headings):
            r.add(PASS, f"has '## {expected}' section")
        else:
            r.add(WARN, f"has '## {expected}' section", "not found -- see content guidelines §1.5")

    if re.search(r"\|.*\|.*\|", text) and re.search(r"\$\d", text):
        r.add(PASS, "parts/BOM looks like a real table")
    elif "parts list" in text.lower() or "part list" in text.lower():
        r.add(WARN, "parts/BOM list", "a parts-list heading/mention exists but no table with prices was detected -- verify by eye")
    else:
        r.add(WARN, "parts/BOM list", "no parts table detected")

    todo_hits = TODO_RE.findall(text)
    if todo_hits:
        r.add(FAIL, "no TODO/FIXME/placeholder text", f"found: {set(todo_hits)}")
    else:
        r.add(PASS, "no TODO/FIXME/placeholder text")

    # image + link resolution, across every md file in the kit dir
    broken_images, broken_links, ok_images = [], [], 0
    for md in md_files:
        content = md.read_text(errors="replace")
        for target in LINK_RE.findall(content):
            target = target.split(" ")[0].strip()  # strip markdown title text
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            target_path = target.split("#")[0]
            if not target_path:
                continue
            resolved = (md.parent / target_path).resolve()
            is_image = bool(re.search(r"\.(png|jpe?g|gif|svg|webp|pdf)$", target_path, re.IGNORECASE))
            if resolved.exists():
                if is_image:
                    ok_images += 1
            else:
                (broken_images if is_image else broken_links).append(f"{md.relative_to(REPO_ROOT)} -> {target}")

    if broken_images:
        r.add(FAIL, "all referenced images exist", "; ".join(broken_images))
    else:
        r.add(PASS, "all referenced images exist", f"{ok_images} image ref(s) resolved" if ok_images else "no images referenced")
    if broken_links:
        r.add(FAIL, "all internal links resolve", "; ".join(broken_links))
    else:
        r.add(PASS, "all internal links resolve")


# ---------------------------------------------------------------------------
# src/kits/<name> checks
# ---------------------------------------------------------------------------

IMPORT_RE = re.compile(r"^\s*(?:import\s+([\w.]+)|from\s+([\w.]+)\s+import)", re.MULTILINE)
PIN_CONST_RE = re.compile(r"^([A-Z_][A-Z0-9_]*)\s*=", re.MULTILINE)
CONFIG_ATTR_RE = re.compile(r"\bconfig\.([A-Za-z_][A-Za-z0-9_]*)")
MACHINE_DOT_RE = re.compile(r"\bmachine\.\w+")
MACHINE_IMPORT_RE = re.compile(r"^\s*import\s+machine\b", re.MULTILINE)
PWM_BARE_PIN_RE = re.compile(r"PWM\(\s*([A-Za-z_][A-Za-z0-9_.]*_PIN)\s*\)")


def normalize_for_hash(content):
    lines = [ln.rstrip() for ln in content.splitlines()]
    while lines and not lines[-1]:
        lines.pop()
    return "\n".join(lines).encode()


def strip_comments(text):
    """Crude '#'-comment stripper (doesn't understand strings containing '#').

    Good enough for this codebase's style -- used only to keep the
    machine/PWM/config-attribute bug checks from matching mentions inside
    comments (e.g. "# see config.py" or "# machine.I2C(...) raises...").
    """
    out = []
    for line in text.splitlines():
        idx = line.find("#")
        out.append(line[:idx] if idx != -1 else line)
    return "\n".join(out)


def audit_src(name, src_dir, r):
    r.section("Source code (src/kits/)")
    if src_dir is None:
        r.add(FAIL, "src/kits directory", f"no directory found for '{name}' (checked alias too)")
        return

    all_py = sorted(p for p in src_dir.glob("*.py"))
    lib_py = sorted(src_dir.glob("lib/*.py"))
    config_py = src_dir / "config.py"
    secrets_py = src_dir / "secrets.py"
    readme = src_dir / "README.md"
    lesson_files = [p for p in all_py if p.name not in ("config.py", "secrets.py", "main.py", "main-template.py")]

    upload_scripts = sorted(src_dir.glob("*.sh"))
    if any(s.name == "upload-code.sh" for s in upload_scripts):
        r.add(PASS, "upload-code.sh exists")
    elif upload_scripts:
        r.add(WARN, "upload-code.sh exists", f"no upload-code.sh, but found: {[s.name for s in upload_scripts]}")
    else:
        r.add(FAIL, "upload-code.sh exists", "no upload/run script found -- see checklist")

    upload_text = ""
    for s in upload_scripts:
        upload_text += s.read_text(errors="replace")

    if config_py.exists():
        r.add(PASS, "config.py exists")
        cfg_text = config_py.read_text(errors="replace")
        consts = PIN_CONST_RE.findall(cfg_text)
        pin_consts = [c for c in consts if "PIN" in c]
        if consts:
            ratio = len(pin_consts) / len(consts)
            if any(k in cfg_text for k in ("PIN",)):
                r.add(INFO, "config.py naming convention", f"{len(pin_consts)}/{len(consts)} top-level constants end in _PIN or contain PIN")
        has_motor_pins = any(k in cfg_text for k in ("RIGHT_FORWARD_PIN", "LEFT_FORWARD_PIN", "MOTOR_RIGHT_FORWARD"))
        if has_motor_pins:
            if re.search(r"PWM_FREQUENCY", cfg_text):
                r.add(PASS, "MOTOR_PWM_FREQUENCY centralized in config.py")
            else:
                r.add(WARN, "MOTOR_PWM_FREQUENCY centralized in config.py", "kit has motor pins but no *_PWM_FREQUENCY constant -- check lesson files for scattered hardcoded frequencies")
    else:
        r.add(FAIL, "config.py exists", "missing -- hardware constants have nowhere centralized to live")
        cfg_text = ""

    if secrets_py.exists():
        r.add(INFO, "secrets.py present", "network credentials kept separate from config.py -- good practice")

    if readme.exists():
        r.add(PASS, "README.md exists")
        readme_text = readme.read_text(errors="replace")
        instructor_kw = ["instructor", "teacher", "mentor", "classroom", "troubleshoot", "common mistake",
                         "common error", "volunteer", "diagnos", "debug", "gotcha"]
        found_kw = [k for k in instructor_kw if k in readme_text.lower()]
        if found_kw:
            r.add(PASS, "README has instructor/mentor-facing content", f"keywords found: {found_kw}")
        else:
            r.add(WARN, "README has instructor/mentor-facing content", "reads as student/reference-only -- no troubleshooting/classroom language detected")
    else:
        r.add(FAIL, "README.md exists", "missing")

    # lesson numbering
    if lesson_files:
        numbered = [p for p in lesson_files if re.match(r"^\d+-", p.name)]
        pct = len(numbered) / len(lesson_files)
        if pct >= 0.8:
            r.add(PASS, "lesson files use numeric prefixes", f"{len(numbered)}/{len(lesson_files)}")
        elif pct > 0:
            r.add(WARN, "lesson files use numeric prefixes", f"only {len(numbered)}/{len(lesson_files)} numbered -- inconsistent ordering signal")
        else:
            r.add(WARN, "lesson files use numeric prefixes", "none numbered -- teaching order is not signaled by filename")

    # final combined program
    main_py = src_dir / "main.py"
    main_template = src_dir / "main-template.py"
    final = main_py if main_py.exists() else (main_template if main_template.exists() else None)
    if final:
        label = "main.py" if final == main_py else "main-template.py (deliberately not main.py)"
        r.add(PASS, "final combined program exists", label)
        final_text = final.read_text(errors="replace")
        if "except KeyboardInterrupt" in final_text and "finally" in final_text:
            r.add(PASS, f"{final.name} has KeyboardInterrupt/finally cleanup")
        else:
            r.add(FAIL, f"{final.name} has KeyboardInterrupt/finally cleanup", "missing -- a Ctrl-C here can leave motors running")
    else:
        r.add(WARN, "final combined program exists", "no main.py or main-template.py found")

    # loops without KeyboardInterrupt handling in files OTHER than the final
    # combined program (e.g. test-drive-all.py driving motors in a bare
    # `while True:` -- the same safety gap as an unguarded main.py, just in
    # a file the check above doesn't look at)
    other_files = [p for p in all_py if p != final and p.name not in ("config.py", "secrets.py")]
    unguarded_loops = []
    for p in other_files:
        code = strip_comments(p.read_text(errors="replace"))
        if re.search(r"while\s+True\s*:", code) and "KeyboardInterrupt" not in code:
            unguarded_loops.append(p.name)
    if unguarded_loops:
        r.add(WARN, "other loop-driving files also handle KeyboardInterrupt",
              f"{', '.join(unguarded_loops)} -- has a 'while True:' loop with no except/finally cleanup; "
              "check by hand if it drives motors")

    # duplicate file detection (byte-identical, whitespace-normalized)
    hashes = {}
    for p in all_py:
        h = hashlib.md5(normalize_for_hash(p.read_text(errors="replace"))).hexdigest()
        hashes.setdefault(h, []).append(p.name)
    dupes = [names for names in hashes.values() if len(names) > 1]
    if dupes:
        r.add(WARN, "no duplicate files", "; ".join(" == ".join(d) for d in dupes))
    else:
        r.add(PASS, "no duplicate files")

    # machine import bug + PWM(bare pin) bug + config attr cross-check
    # (checked against comment-stripped text so mentions inside comments,
    # e.g. "# see config.py" or "# machine.I2C(...) raises...", don't count)
    machine_bugs, pwm_bugs = [], []
    referenced_attrs = set()
    for p in all_py:
        code = strip_comments(p.read_text(errors="replace"))
        if MACHINE_DOT_RE.search(code) and not MACHINE_IMPORT_RE.search(code):
            machine_bugs.append(p.name)
        for m in PWM_BARE_PIN_RE.findall(code):
            pwm_bugs.append(f"{p.name}: PWM({m})")
        referenced_attrs.update(a for a in CONFIG_ATTR_RE.findall(code) if a != "py")

    if machine_bugs:
        r.add(FAIL, "no 'machine.X()' calls without 'import machine'", ", ".join(machine_bugs))
    else:
        r.add(PASS, "no 'machine.X()' calls without 'import machine'")

    if pwm_bugs:
        r.add(FAIL, "no PWM(<bare pin>) without Pin() wrapper", "; ".join(pwm_bugs))
    else:
        r.add(PASS, "no PWM(<bare pin>) without Pin() wrapper")

    if config_py.exists() and referenced_attrs:
        defined = set(PIN_CONST_RE.findall(cfg_text)) | set(re.findall(r"^def\s+(\w+)", cfg_text, re.MULTILINE))
        missing_attrs = sorted(referenced_attrs - defined)
        if missing_attrs:
            r.add(FAIL, "all config.X references exist in config.py", f"referenced but not defined: {missing_attrs}")
        else:
            r.add(PASS, "all config.X references exist in config.py")

    # import bundling check. Track which file imports each third-party
    # module -- an unbundled dependency imported inside config.py itself is
    # not a minor gap, it's catastrophic: every lesson does `import config`,
    # so config.py failing to import breaks the whole kit, not just the
    # scripts that use the dependency directly.
    imported_modules = set()
    module_importers = {}
    for p in all_py:
        text = p.read_text(errors="replace")
        for a, b in IMPORT_RE.findall(text):
            mod = (a or b).split(".")[0]
            imported_modules.add(mod)
            module_importers.setdefault(mod, set()).add(p.name)
    third_party = sorted(imported_modules - BUILTIN_MODULES - {"config", "secrets"})
    for mod in third_party:
        local_copy = (src_dir / f"{mod}.py").exists() or any(p.stem == mod for p in lib_py)
        shared_copy = (REPO_ROOT / "src" / "lib" / f"{mod}.py").exists()
        referenced_in_upload = mod.lower() in upload_text.lower() or "lib" in upload_text.lower()
        imported_by_config = "config.py" in module_importers.get(mod, set())
        cascade_warning = (
            " -- imported directly inside config.py, so since every script in this kit does "
            "`import config`, this breaks the ENTIRE kit on a fresh board, not just scripts that "
            "use it directly" if imported_by_config else ""
        )
        if not local_copy and not shared_copy:
            r.add(WARN, f"dependency '{mod}' resolvable", "imported but no matching file found in kit dir or src/lib/ -- verify it's a MicroPython built-in")
            continue
        if local_copy and referenced_in_upload:
            r.add(PASS, f"dependency '{mod}' bundled by upload script", "local copy, referenced in upload script")
        elif local_copy and not referenced_in_upload:
            r.add(FAIL, f"dependency '{mod}' bundled by upload script",
                  "local copy exists but upload script doesn't appear to push it -- fresh board will ImportError" + cascade_warning)
        elif shared_copy and not local_copy:
            status = FAIL if imported_by_config else WARN
            r.add(status, f"dependency '{mod}' bundled by upload script",
                  f"only in src/lib/{mod}.py -- confirm upload script pulls it from there, not just from the kit dir" + cascade_warning)


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def audit_kit(name):
    canonical, docs_dir, src_dir = resolve_kit(name)
    r = Report(f"Kit: {canonical}")

    has_index = docs_dir and (docs_dir / "index.md").exists()
    other_md = list(docs_dir.glob("*.md")) if docs_dir else []
    if docs_dir and not has_index and other_md and src_dir is None:
        r.add(INFO, "looks like a planned-but-not-built kit",
              f"has {[p.name for p in other_md]} but no index.md and no src/kits/ directory -- "
              "grade against the 'Planned kits' section of checklist.md instead of the full checklist")
        return r

    if docs_dir and src_dir and docs_dir.name != src_dir.name:
        r.add(WARN, "docs/src directory names match", f"docs uses '{docs_dir.name}', src uses '{src_dir.name}'")
    audit_docs(canonical, docs_dir, r)
    audit_src(canonical, src_dir, r)
    return r


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("kits", nargs="*", help="kit name(s), e.g. imu-mpu6050 base-bot")
    ap.add_argument("--all", action="store_true", help="audit every kit found in docs/kits/ or src/kits/")
    ap.add_argument("--list", action="store_true", help="list discovered kit names and exit")
    args = ap.parse_args()

    if args.list:
        for n in discover_all_kit_names():
            _, d, s = resolve_kit(n)
            print(f"{n}: docs={'yes' if d else 'NO'} src={'yes' if s else 'NO'}")
        return

    names = discover_all_kit_names() if args.all else args.kits
    if not names:
        ap.print_help()
        sys.exit(1)

    reports = [audit_kit(n) for n in names]
    for r in reports:
        print(r.render())
        print()

    print("## Summary")
    for r in reports:
        c = r.counts
        print(f"- {r.title}: {SYMBOLS[FAIL]} {c[FAIL]}  {SYMBOLS[WARN]} {c[WARN]}  {SYMBOLS[PASS]} {c[PASS]}")


if __name__ == "__main__":
    main()
