#!/usr/bin/env python3
"""Procedural paper backdrops (static PNGs): fibers, pulp blotches, folds, creases, edge wear.

  python3 tools/make_paper.py            # writes public/paper/*.jpg at 1080x1920
Folds are rendered as a height field and lit, so they read as physical relief, not drawn lines.
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

OUT = Path(__file__).resolve().parents[1] / 'public' / 'paper'
W, H = 1080, 1920


def unit(x):
    return (x - x.mean()) / (x.std() + 1e-9)


def noise(r, sigma, shape=(H, W)):
    return unit(ndimage.gaussian_filter(r.standard_normal(shape), sigma))


def fibres(r, n=2600, length=(8, 40)):
    """Short random strokes, a bit lighter/darker than the pulp."""
    img = np.zeros((H, W))
    for _ in range(n):
        x, y = r.uniform(0, W), r.uniform(0, H)
        a = r.uniform(0, np.pi)
        L = r.uniform(*length)
        ts = np.linspace(0, 1, int(L))
        bend = r.normal(0, 0.15)
        xs = (x + np.cos(a + bend * ts) * L * ts).astype(int)
        ys = (y + np.sin(a + bend * ts) * L * ts).astype(int)
        ok = (xs >= 0) & (xs < W) & (ys >= 0) & (ys < H)
        img[ys[ok], xs[ok]] += r.choice([-1, 1]) * r.uniform(0.4, 1)
    return ndimage.gaussian_filter(img, 0.6)


def folds(r, n_folds, n_creases):
    """Height field: straight folds (sharp ridge/valley) + random crumple creases."""
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    hgt = np.zeros((H, W))
    for i in range(n_folds):
        # mostly horizontal/vertical folds like a folded newspaper
        horiz = i % 2 == 0
        pos = r.uniform(0.3, 0.7) * (H if horiz else W)
        tilt = r.normal(0, 0.02)
        d = (yy - pos - xx * tilt) if horiz else (xx - pos - yy * tilt)
        hgt += r.choice([-1, 1]) * 4 * np.exp(-np.abs(d) / 5)
        hgt += 0.004 * np.clip(d, -400, 400)  # the two panels sit at slightly different angles
    for _ in range(n_creases):
        # crumple crease: a bent polyline with tapering depth, drawn into its own layer
        layer = np.zeros((H, W))
        x, y = r.uniform(0, W), r.uniform(0, H)
        a = r.uniform(0, 2 * np.pi)
        L = r.uniform(200, 900)
        steps = int(L / 3)
        for k in range(steps):
            a += r.normal(0, 0.035)
            x += np.cos(a) * 3
            y += np.sin(a) * 3
            if 0 <= x < W and 0 <= y < H:
                layer[int(y), int(x)] = np.sin(np.pi * k / steps) ** 0.6
        width = r.uniform(1.2, 3.0)
        hgt += r.choice([-1, 1]) * 9 * ndimage.gaussian_filter(layer, width) * width
    hgt += noise(r, 60) * 0.35 + noise(r, 8) * 0.04  # faint cockle
    return hgt


def shade(hgt, light=(-0.6, -0.8, 0.9)):
    gy, gx = np.gradient(hgt)
    n = np.dstack([-gx, -gy, np.ones_like(hgt)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    l = np.array(light) / np.linalg.norm(light)
    return (n @ l) / l[2]  # 1.0 on flat paper


def paper(seed, base, fibre_amt=0.05, blotch=0.045, n_folds=1, n_creases=6, edge=0.18, speckle=0.0):
    r = np.random.default_rng(seed)
    base = np.array([int(base[i:i + 2], 16) for i in (1, 3, 5)], float) / 255
    tone = 1 + noise(r, 120) * blotch + noise(r, 18) * blotch * 0.4 + fibres(r, n=9000) * fibre_amt * 1.6 + noise(r, 0.7) * 0.015
    light = shade(folds(r, n_folds, n_creases))
    yy, xx = np.mgrid[0:H, 0:W]
    dx = np.minimum(xx, W - 1 - xx) / W
    dy = np.minimum(yy, H - 1 - yy) / H
    vign = 1 - edge * np.exp(-np.minimum(dx, dy) * 14)
    img = base[None, None] * (tone * light * vign)[..., None]
    if speckle:
        spots = (r.random((H, W)) < speckle).astype(float) * r.uniform(0.2, 1, (H, W))
        img *= 1 - np.clip(ndimage.gaussian_filter(spots, 1.3) * 5, 0, 0.35)[..., None]
    return np.clip(img, 0, 1)


PAPERS = {
    'newsprint': dict(seed=1, base='#e8e0cc', n_folds=2, n_creases=5, speckle=0.00015),
    'aged': dict(seed=2, base='#e2cfa4', blotch=0.07, n_folds=1, n_creases=9, edge=0.3, speckle=0.0003),
    'kraft': dict(seed=3, base='#b98c5a', fibre_amt=0.09, blotch=0.05, n_folds=0, n_creases=4, speckle=0.0006),
    'blue': dict(seed=4, base='#2f4f7a', fibre_amt=0.07, blotch=0.035, n_folds=1, n_creases=3),
    'red': dict(seed=5, base='#c23a2b', fibre_amt=0.07, blotch=0.035, n_folds=0, n_creases=3),
    'black': dict(seed=6, base='#23211e', fibre_amt=0.12, blotch=0.05, n_folds=0, n_creases=4),
    'yellow': dict(seed=8, base='#ecc43c', fibre_amt=0.06, blotch=0.03, n_folds=0, n_creases=2),
    'white': dict(seed=7, base='#f4f0e6', fibre_amt=0.03, blotch=0.02, n_folds=0, n_creases=2, edge=0.1),
}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for name, kw in PAPERS.items():
        Image.fromarray((paper(**kw) * 255).astype(np.uint8)).save(OUT / f'{name}.jpg', quality=90)
        print(name)
