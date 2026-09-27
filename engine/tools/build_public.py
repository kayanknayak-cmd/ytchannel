#!/usr/bin/env python3
"""Gather everything the videos load into engine/.public (Remotion's public folder).

  engine/static/*            -> .public/*            (paper textures, test photos)
  videos/NN-*/photos/*       -> .public/videos/NN-*/photos/*
  videos/NN-*/voiceover/*.wav-> .public/videos/NN-*/voiceover/*

Hard links, so it's instant and uses no extra disk. Run automatically by render.py / npm run studio.
"""
import os, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / 'engine' / '.public'


def link(src, dst):
    dst.parent.mkdir(parents=True, exist_ok=True)
    try:
        os.link(src, dst)
    except OSError:
        shutil.copy2(src, dst)


def main():
    shutil.rmtree(PUB, ignore_errors=True)
    n = 0
    for f in (ROOT / 'engine' / 'static').rglob('*'):
        if f.is_file():
            link(f, PUB / f.relative_to(ROOT / 'engine' / 'static')); n += 1
    for vdir in sorted((ROOT / 'videos').glob('[0-9][0-9]-*')):
        for sub, pat in (('photos', '*'), ('voiceover', '*.wav')):
            for f in (vdir / sub).glob(pat):
                if f.is_file():
                    link(f, PUB / 'videos' / vdir.name / sub / f.name); n += 1
    print(f'engine/.public: {n} files')


if __name__ == '__main__':
    main()
