#!/usr/bin/env python3
"""Frame strip from finished videos for review: python3 engine/tools/strip.py out.png 02 03 ..."""
import sys, subprocess, glob
import imageio_ffmpeg
from PIL import Image, ImageDraw
ff = imageio_ffmpeg.get_ffmpeg_exe()
out, ids = sys.argv[1], sys.argv[2:]
rows = []
for n in ids:
    f = glob.glob(f'finished/{n}-*.mp4')[0]
    dur = float(subprocess.run([ff, '-i', f], capture_output=True, text=True).stderr.split('Duration: ')[1].split(',')[0].split(':')[-1])
    ims = []
    for k in range(8):
        t = dur * (k + 0.5) / 8
        raw = subprocess.run([ff, '-v', 'error', '-ss', f'{t:.2f}', '-i', f, '-frames:v', '1', '-vf', 'scale=135:240', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
        ims.append(Image.frombytes('RGB', (135, 240), raw))
    r = Image.new('RGB', (135 * 8 + 30, 240), 'white')
    for i, im in enumerate(ims):
        r.paste(im, (30 + i * 135, 0))
    ImageDraw.Draw(r).text((4, 110), n, fill='black')
    rows.append(r)
s = Image.new('RGB', (rows[0].width * 2, 240 * ((len(rows) + 1) // 2)), 'white')
for i, r in enumerate(rows):
    s.paste(r, ((i % 2) * r.width, (i // 2) * 240))
s.save(out)
