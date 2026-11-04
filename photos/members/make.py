#!/usr/bin/env python3
"""Rebuild the member photos on /cooperative/#team from the originals.

Each original (photos/members/originals/<slug>.png|webp, a cut-out with a
transparent background) is re-cropped so faces come out a similar size, with
the top of every head the same distance from the top edge. The result is
written to content/cooperative/<slug>/<slug>.webp (800x800); the site turns
it black and white when it builds.

Needs macOS (Swift and the Vision framework for face detection) and cwebp
(brew install webp). Run from anywhere:

    python3 photos/members/make.py            # all members
    python3 photos/members/make.py adam-otto  # one member

Tune a single person in TWEAKS below when face detection gets the size
slightly wrong (hats, hoods, turned heads).
"""
import json
import pathlib
import subprocess
import sys
import tempfile

# Face height as a share of the photo, and space above the head.
TARGET = 0.55
MARGIN = 0.06

# Per-person adjustments: target (face size), margin, dx/dy (nudge in
# original pixels). A lower target makes the head smaller.
TWEAKS = {
    "sebastian-carlier": {"target": 0.47},  # hood and hat make the head look bigger
    "adam-otto": {"target": 0.60},
}

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
TOOLS = HERE / "tools"
BUILD = pathlib.Path(tempfile.gettempdir()) / "fikaworks-member-photos"


def compile_tools():
    BUILD.mkdir(exist_ok=True)
    for name in ("faces", "crop"):
        src, exe = TOOLS / f"{name}.swift", BUILD / name
        if not exe.exists() or exe.stat().st_mtime < src.stat().st_mtime:
            subprocess.run(["swiftc", "-O", "-o", str(exe), str(src)], check=True)


def main(only):
    compile_tools()
    originals = sorted(p for p in (HERE / "originals").iterdir() if p.suffix in (".png", ".webp"))
    for src in originals:
        slug = src.stem
        if only and slug not in only:
            continue
        info = json.loads(subprocess.run([str(BUILD / "faces"), str(src)], check=True,
                                         capture_output=True, text=True).stdout)
        if not info["faces"]:
            print(f"{slug}: no face found, skipped")
            continue
        t = {"target": TARGET, "margin": MARGIN, "dx": 0, "dy": 0, **TWEAKS.get(slug, {})}
        png = BUILD / f"{slug}.png"
        out = subprocess.run(
            [str(BUILD / "crop"), str(src), str(png), *map(str, info["faces"][0]), str(info["headTop"]),
             str(t["target"]), str(t["margin"]), str(t["dx"]), str(t["dy"])],
            check=True, capture_output=True, text=True).stdout.strip()
        dest = ROOT / "content" / "cooperative" / slug / f"{slug}.webp"
        subprocess.run(["cwebp", "-quiet", "-q", "90", "-alpha_q", "100", "-exact", str(png), "-o", str(dest)],
                       check=True)
        print(f"{slug}: {out.split(' ', 1)[1]}")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
