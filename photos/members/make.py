#!/usr/bin/env python3
"""Rebuild the member photos on /cooperative/#team from the originals.

Each original (photos/members/originals/<slug>.jpg|png|webp, named after
the member's folder in content/cooperative) is cut out if it still has its
background, then re-cropped so faces come out a similar size, with the top
of every head the same distance from the top edge.

The results are the exact files the site serves, black and white with a
transparent background (the card colour shows through):

    content/cooperative/<slug>/<slug>-320.webp   320x320
    content/cooperative/<slug>/<slug>-640.webp   640x640

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

# Output sizes in pixels (the card shows them at up to 240 CSS pixels).
SIZES = (320, 640)

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
    for name in ("faces", "crop", "cutout"):
        src, exe = TOOLS / f"{name}.swift", BUILD / name
        if not exe.exists() or exe.stat().st_mtime < src.stat().st_mtime:
            subprocess.run(["swiftc", "-O", "-o", str(exe), str(src)], check=True)


def has_alpha(path):
    out = subprocess.run(["sips", "-g", "hasAlpha", str(path)], check=True,
                         capture_output=True, text=True).stdout
    return "hasAlpha: yes" in out


def main(only):
    compile_tools()
    originals = sorted(p for p in (HERE / "originals").iterdir()
                       if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"))
    for src in originals:
        slug = src.stem
        if only and slug not in only:
            continue
        if not has_alpha(src):
            cut = BUILD / f"{slug}-cutout.png"
            subprocess.run([str(BUILD / "cutout"), str(src), str(cut)], check=True, capture_output=True)
            src = cut
        info = json.loads(subprocess.run([str(BUILD / "faces"), str(src)], check=True,
                                         capture_output=True, text=True).stdout)
        if not info["faces"]:
            print(f"{slug}: no face found, skipped")
            continue
        t = {"target": TARGET, "margin": MARGIN, "dx": 0, "dy": 0, **TWEAKS.get(slug, {})}
        folder = ROOT / "content" / "cooperative" / slug
        for old in folder.glob("*.webp"):
            old.unlink()
        for size in SIZES:
            png = BUILD / f"{slug}-{size}.png"
            out = subprocess.run(
                [str(BUILD / "crop"), str(src), str(png), *map(str, info["faces"][0]), str(info["headTop"]),
                 str(t["target"]), str(t["margin"]), str(t["dx"]), str(t["dy"]), str(size), "1"],
                check=True, capture_output=True, text=True).stdout.strip()
            subprocess.run(["cwebp", "-quiet", "-q", "88", "-alpha_q", "100", "-exact", str(png),
                            "-o", str(folder / f"{slug}-{size}.webp")], check=True)
        print(f"{slug}: {out.split(' ', 1)[1]}")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
