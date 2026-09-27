#!/usr/bin/env python3
"""Render one video to finished/.

  npm run render -- 1        (or: python3 engine/tools/render.py 1)

Composition id = the video's folder name (e.g. 01-the-7-5-cent-coin). Output: finished/<folder>.mp4,
compressed for upload, with a check that the last frame loops cleanly into the first.
"""
import os, subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
CHROME = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'


def main():
    n = int(sys.argv[1])
    vdir = next((ROOT / 'videos').glob(f'{n:02d}-*'))
    name = vdir.name
    subprocess.run([sys.executable, str(ROOT / 'engine/tools/build_public.py')], check=True)
    env = dict(os.environ)
    if 'REMOTION_CHROME' not in env and Path(CHROME).exists():
        env['REMOTION_CHROME'] = CHROME
    raw = ROOT / 'out' / f'{name}.mp4'
    raw.parent.mkdir(exist_ok=True)
    subprocess.run(['npx', 'remotion', 'render', name, str(raw)], cwd=ROOT, env=env, check=True)
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    final = ROOT / 'finished' / f'{name}.mp4'
    final.parent.mkdir(exist_ok=True)
    subprocess.run([ff, '-v', 'error', '-y', '-i', str(raw), '-c:v', 'libx264', '-crf', '24', '-preset', 'slow',
                    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(final)], check=True)
    g = subprocess.run([ff, '-v', 'error', '-i', str(raw), '-vf', 'scale=108:192', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                       capture_output=True).stdout
    fr = np.frombuffer(g, np.uint8).reshape(-1, 192, 108).astype(float)
    seam = np.abs(fr[-1] - fr[0]).mean()
    typ = np.median([np.abs(fr[i] - fr[i + 1]).mean() for i in range(len(fr) - 1)])
    print(f'loop seam {seam:.1f} vs typical frame step {typ:.1f} ({"clean" if seam < typ * 2 else "CHECK THE LOOP"})')
    print(f'-> finished/{final.name} ({final.stat().st_size / 1e6:.1f} MB)')
    subprocess.run([sys.executable, str(ROOT / 'engine/tools/status.py')])


if __name__ == '__main__':
    main()
