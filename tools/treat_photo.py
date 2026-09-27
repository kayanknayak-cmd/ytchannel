#!/usr/bin/env python3
"""Turn a real photo into a collage-ready asset (transparent PNG).

  python3 tools/treat_photo.py in.jpg public/assets/out.png --cut --style halftone
  python3 tools/treat_photo.py in.jpg public/assets/out.png --torn --style duotone --ink "#1b1a17" --paper "#e9dfc8"

Modes
  --cut    subject cutout (rembg) + white paper border cut with "scissors" (straight polygon snips)
  --torn   full rectangular print with torn edges and exposed white fibers
  (neither) keep the rectangle, straight edges

Styles
  halftone  newsprint dot screen (45 deg), ink on paper
  duotone   shadows -> ink colour, highlights -> paper colour
  mono      punchy grayscale print with grain
  color     original colour, lightly aged
"""
import argparse
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

rng = np.random.default_rng(7)


def hex_rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float) / 255


def levels(g, lo=0.06, hi=0.94, gamma=1.0):
    return np.clip((g - lo) / (hi - lo), 0, 1) ** gamma


def luminance(rgb):
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def halftone(g, cell=7.0, angle=45):
    """AM screen: pixel is inked if its distance to the nearest cell centre < radius(darkness)."""
    h, w = g.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    a = np.deg2rad(angle)
    u = (xx * np.cos(a) + yy * np.sin(a)) / cell
    v = (-xx * np.sin(a) + yy * np.cos(a)) / cell
    du, dv = u - np.round(u), v - np.round(v)
    dist = np.sqrt(du ** 2 + dv ** 2)  # 0 .. 0.707 in cell units
    dark = ndimage.gaussian_filter(1 - g, cell * 0.35)
    radius = np.sqrt(np.clip(dark, 0, 1) / np.pi) * 1.12  # area-proportional dots, merge in deep shadow
    aa = 0.9 / cell
    return np.clip((radius - dist) / aa + 0.5, 0, 1)  # 1 = ink


def paper_grain(h, w, amt=0.05):
    n = ndimage.gaussian_filter(rng.standard_normal((h, w)), 0.8)
    blot = ndimage.gaussian_filter(rng.standard_normal((h, w)), max(h, w) / 18)
    return n / n.std() * amt + blot / (blot.std() + 1e-6) * amt * 0.8


def tone(rgb, style, ink, paper, cell):
    h, w, _ = rgb.shape
    g = levels(luminance(rgb))
    if style == 'halftone':
        inked = halftone(g, cell)
        out = paper[None, None] * (1 - inked[..., None]) + ink[None, None] * inked[..., None]
    elif style == 'duotone':
        t = levels(g, 0.02, 0.98, 1.15)[..., None]
        out = ink[None, None] * (1 - t) + paper[None, None] * t
    elif style == 'mono':
        t = levels(g, 0.08, 0.92, 1.1)[..., None]
        out = np.repeat(t, 3, axis=2) * paper[None, None]
    else:  # color, aged: lift blacks, warm, slight desaturation
        lum = luminance(rgb)[..., None]
        out = rgb * 0.8 + lum * 0.2
        out = out * 0.9 + 0.06
        out *= paper[None, None] / paper.max()
    out = out + paper_grain(h, w, 0.02 if style == 'halftone' else 0.012)[..., None]
    return np.clip(out, 0, 1)


def scissor_border(alpha, border):
    """White border around the subject whose outline is a polygon of straight snips."""
    import math
    grown = ndimage.binary_dilation(alpha > 0.5, iterations=border)
    grown = ndimage.binary_fill_holes(grown)
    # trace outline, simplify into straight cuts, jitter the vertices slightly
    from skimage import measure, draw
    contours = measure.find_contours(grown.astype(float), 0.5)
    mask = np.zeros_like(grown)
    for c in contours:
        if len(c) < 20:
            continue
        poly = measure.approximate_polygon(c, tolerance=max(3.0, border * 0.45))
        poly = poly + rng.normal(0, border * 0.12, poly.shape)
        rr, cc = draw.polygon(poly[:, 0], poly[:, 1], mask.shape)
        mask[rr, cc] = ~mask[rr, cc] if False else True
    return mask | (alpha > 0.5)


def torn_mask(h, w, amp, fiber):
    """Rectangle with torn edges; returns (paper_mask, face_mask). Fibers show between them.
    The printed face tears a varying distance inside the paper edge, so the white band
    is ragged: thin in places, wide bites in others, like a real rip through coated stock."""
    def smooth(r, n, sigma):
        x = ndimage.gaussian_filter1d(r.standard_normal(n), sigma)
        return x / (x.std() + 1e-9)  # unit std regardless of smoothing

    def profile(n, amp, seed, big=0.9):
        r = np.random.default_rng(seed)
        wander = smooth(r, n, n / 25) * amp * big      # slow bites
        mid = smooth(r, n, 5) * amp * 0.45               # ragged chunks
        teeth = smooth(r, n, 0.8) * amp * 0.3           # fibres
        return amp * big * 1.2 + wander + np.abs(mid) + np.abs(teeth)

    yy, xx = np.mgrid[0:h, 0:w]
    def inside(extra, seed):
        t, b = profile(w, amp, seed), profile(w, amp, seed + 1)
        l, r = profile(h, amp, seed + 2), profile(h, amp, seed + 3)
        et, eb = extra(w, seed + 4), extra(w, seed + 5)
        el, er = extra(h, seed + 6), extra(h, seed + 7)
        return (yy > (t + et)[None, :]) & (yy < h - 1 - (b + eb)[None, :]) & \
               (xx > (l + el)[:, None]) & (xx < w - 1 - (r + er)[:, None])
    zero = lambda n, s: np.zeros(n)
    def band(n, s):
        r = np.random.default_rng(s)
        x = ndimage.gaussian_filter1d(r.standard_normal(n), n / 60)
        x = np.abs(x / (x.std() + 1e-9))
        return fiber * (0.35 + 1.6 * x ** 1.6)
    outer = inside(zero, 11)
    face = inside(band, 11) # same tear line, face pulled inward by a ragged band
    return outer, face


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--cut', action='store_true')
    ap.add_argument('--torn', action='store_true')
    ap.add_argument('--style', default='halftone', choices=['halftone', 'duotone', 'mono', 'color'])
    ap.add_argument('--ink', default='#1b1a17')
    ap.add_argument('--paper', default='#efe7d4')
    ap.add_argument('--cell', type=float, default=0, help='halftone cell px (default: width/150)')
    ap.add_argument('--border', type=int, default=0, help='cutout white border px (default: width/60)')
    ap.add_argument('--tear', type=float, default=0.7, help='torn-edge strength multiplier')
    ap.add_argument('--width', type=int, default=1400, help='output width px')
    ap.add_argument('--crop', default=None, help='x0,y0,x1,y1 as fractions of the source, e.g. 0.26,0.02,0.73,1')
    args = ap.parse_args()

    src = Image.open(args.src)
    src_alpha = src.getchannel('A') if src.mode in ('RGBA', 'LA') else None
    if args.crop:
        x0, y0, x1, y1 = [float(v) for v in args.crop.split(',')]
        box = (round(x0 * src.width), round(y0 * src.height), round(x1 * src.width), round(y1 * src.height))
        src = src.crop(box)
        src_alpha = src_alpha.crop(box) if src_alpha is not None else None
    if src_alpha is not None:  # composite over white so transparent areas don't turn black
        bg = Image.new('RGB', src.size, 'white')
        bg.paste(src.convert('RGB'), mask=src_alpha)
        im = bg
    else:
        im = src.convert('RGB')
    if im.width != args.width:
        size = (args.width, round(im.height * args.width / im.width))
        im = im.resize(size, Image.LANCZOS)
        if src_alpha is not None:
            src_alpha = src_alpha.resize(size, Image.LANCZOS)
    rgb = np.asarray(im, float) / 255
    h, w, _ = rgb.shape
    ink, paper = hex_rgb(args.ink), hex_rgb(args.paper)
    cell = args.cell or max(5.0, w / 150)
    face = tone(rgb, args.style, ink, paper, cell)
    white = np.array([0.985, 0.975, 0.955])

    if args.cut:
        if src_alpha is not None:  # source already cut out: trust its alpha
            a = np.asarray(src_alpha.resize(im.size), float) / 255
        else:
            from rembg import remove, new_session
            cut = remove(im, session=new_session('isnet-general-use'))
            a = np.asarray(cut, float)[..., 3] / 255
        a = ndimage.gaussian_filter(a, 0.7)
        border = args.border or max(6, w // 60)
        pad = border * 3
        face = np.pad(face, ((pad, pad), (pad, pad), (0, 0)), constant_values=1)
        a = np.pad(a, pad)
        paper_mask = scissor_border(a, border)
        pm = ndimage.gaussian_filter(paper_mask.astype(float), 0.6)
        rgbo = white[None, None] * (1 - a[..., None]) + face * a[..., None]
        out = np.dstack([rgbo, pm])
        ys, xs = np.where(pm > 0.01)
        out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    elif args.torn:
        amp = w / 150 * args.tear
        fiber = max(4, round(w / 180))
        outer, inner = torn_mask(h, w, amp, fiber)
        o = ndimage.gaussian_filter(outer.astype(float), 0.6)
        i = ndimage.gaussian_filter(inner.astype(float), 0.6)[..., None]
        rgbo = white[None, None] * (1 - i) + face * i
        out = np.dstack([rgbo, o])
    else:
        out = np.dstack([face, np.ones((h, w))])

    Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), 'RGBA').save(args.dst, optimize=True)
    print(f'{args.dst}: {out.shape[1]}x{out.shape[0]}')


if __name__ == '__main__':
    main()
