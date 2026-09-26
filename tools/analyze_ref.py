#!/usr/bin/env python3
"""Extract style (not content) from a reference clip.

Usage: python3 tools/analyze_ref.py refs/clip.mp4 [more.mp4 ...]
Writes analysis/<name>/: report.md, holds.png (timing strip), cuts.png (frames at cuts), palette.png

Measures:
  - Effective animation rate: how many source frames each drawing is held
    (1s/2s/3s/4s), and how that changes over the clip.
  - Cut rhythm: shot lengths.
  - Palette: dominant colors across the clip.
"""
import json, os, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = ROOT / 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg'
FFPROBE = ROOT / 'node_modules/@remotion/compositor-linux-x64-gnu/ffprobe'
ENV = {**os.environ, 'LD_LIBRARY_PATH': str(FFMPEG.parent)}
SW, SH = 96, 170  # analysis resolution (keeps 9:16-ish; aspect doesn't matter for diffs)
HOLD_T = 1.2   # mean abs diff (0-255) below which a frame repeats the previous drawing
CUT_T = 38.0   # above which it's a cut


def probe_fps(path):
    out = subprocess.run([str(FFPROBE), '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=r_frame_rate', '-of', 'json', str(path)], capture_output=True, env=ENV, text=True)
    num, den = json.loads(out.stdout)['streams'][0]['r_frame_rate'].split('/')
    return float(num) / float(den)


def frames(path, w, h, gray):
    fmt, ch = ('gray', 1) if gray else ('rgb24', 3)
    p = subprocess.run([str(FFMPEG), '-v', 'error', '-i', str(path), '-vf', f'scale={w}:{h}',
                        '-f', 'rawvideo', '-pix_fmt', fmt, '-'], capture_output=True, env=ENV, check=True)
    a = np.frombuffer(p.stdout, np.uint8)
    return a.reshape(-1, h, w, ch) if ch > 1 else a.reshape(-1, h, w)


def runs(mask):
    """Lengths of consecutive holds -> drawing durations in frames."""
    out, n = [], 1
    for held in mask:
        if held:
            n += 1
        else:
            out.append(n)
            n = 1
    out.append(n)
    return out


def kmeans(px, k=8, iters=12, seed=0):
    rng = np.random.default_rng(seed)
    c = px[rng.choice(len(px), k, replace=False)].astype(float)
    for _ in range(iters):
        lab = ((px[:, None, :] - c[None]) ** 2).sum(-1).argmin(1)
        for j in range(k):
            if (lab == j).any():
                c[j] = px[lab == j].mean(0)
    counts = np.bincount(lab, minlength=k)
    order = counts.argsort()[::-1]
    return c[order].astype(int), counts[order] / counts.sum()


def analyze(path):
    path = Path(path)
    out = ROOT / 'analysis' / path.stem
    out.mkdir(parents=True, exist_ok=True)
    fps = probe_fps(path)
    g = frames(path, SW, SH, gray=True).astype(np.int16)
    diff = np.abs(np.diff(g, axis=0)).mean(axis=(1, 2))
    cut = diff > CUT_T
    held = diff < HOLD_T

    # Drawing durations, split per shot so cuts don't pollute the stats.
    durations, shots, start = [], [], 0
    for i in np.where(cut)[0].tolist() + [len(diff)]:
        seg = held[start:i]
        if len(seg):
            durations += runs(seg)
        shots.append((start, i + 1))
        start = i + 1
    durations = np.array(durations)
    hist = {k: int((durations == k).sum()) for k in range(1, 7)}
    hist['7+'] = int((durations >= 7).sum())
    frames_by = {k: int(durations[durations == k].sum()) for k in range(1, 7)}
    total = max(1, int(durations.sum()))

    # Timing strip: one column per frame, height = diff, red = cut, grey = held.
    strip = Image.new('RGB', (len(diff), 120), 'white')
    d = ImageDraw.Draw(strip)
    for x, v in enumerate(diff):
        col = (215, 56, 43) if cut[x] else (200, 200, 200) if held[x] else (27, 26, 23)
        d.line([(x, 119), (x, 119 - min(119, v * 3))], fill=col)
    strip.resize((max(len(diff), 600), 120)).save(out / 'holds.png')

    # Frames just after each cut (max 24) as a contact sheet.
    rgb = frames(path, 270, 480, gray=False)
    picks = [s for s, _ in shots][:24]
    sheet = Image.new('RGB', (270 * min(6, len(picks)), 480 * ((len(picks) + 5) // 6)), 'white')
    for i, f in enumerate(picks):
        sheet.paste(Image.fromarray(rgb[min(f, len(rgb) - 1)]), ((i % 6) * 270, (i // 6) * 480))
    sheet.save(out / 'cuts.png')

    px = rgb[:: max(1, len(rgb) // 60), ::8, ::8].reshape(-1, 3)
    cols, share = kmeans(px)
    pal = Image.new('RGB', (80 * len(cols), 80))
    for i, c in enumerate(cols):
        ImageDraw.Draw(pal).rectangle([i * 80, 0, i * 80 + 79, 79], fill=tuple(int(v) for v in c))
    pal.save(out / 'palette.png')

    shot_s = [(b - a) / fps for a, b in shots]
    lines = [
        f'# {path.name}',
        f'- source fps: {fps:.2f}, frames: {len(g)}, duration: {len(g) / fps:.1f}s',
        f'- shots: {len(shots)}, median shot {np.median(shot_s):.2f}s, first cut at {shot_s[0]:.2f}s',
        '',
        '## Animation rate (share of screen time held for N source frames)',
        *[f'- on {k}s: {frames_by[k] / total:5.1%}  (~{fps / k:.0f} drawings/s)' for k in range(1, 7)],
        f'- held 7+ frames (static/hold shots): {1 - sum(frames_by.values()) / total:5.1%}',
        '',
        '## Palette (share)',
        *[f'- #{c[0]:02x}{c[1]:02x}{c[2]:02x}  {s:4.0%}' for c, s in zip(cols, share)],
        '',
        '## Shot lengths (s)',
        ', '.join(f'{s:.2f}' for s in shot_s),
        '',
        'Caveat: camera moves on 1s and film grain can mask holds; check holds.png by eye.',
    ]
    (out / 'report.md').write_text('\n'.join(lines))
    print('\n'.join(lines[:12]))
    print(f'-> {out}')


if __name__ == '__main__':
    for p in sys.argv[1:] or sorted((ROOT / 'refs').glob('*.mp4')):
        analyze(p)
