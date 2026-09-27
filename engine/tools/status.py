#!/usr/bin/env python3
"""Rewrite the status table in README.md from what's actually in videos/ and finished/."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
START, END = '<!-- status:start -->', '<!-- status:end -->'


def main():
    rows = ['| # | Video | Voiceover | Photos | Finished video |', '|---|---|---|---|---|']
    for v in sorted((ROOT / 'videos').glob('[0-9][0-9]-*')):
        title = re.search(r'^# \d+\. (.+)$', (v / 'README.md').read_text(), re.M).group(1)
        vo = 'synced' if (v / 'voiceover/loop.wav').exists() else ('recorded' if list((v / 'voiceover').glob('original.*')) else '-')
        photos = len([p for p in (v / 'photos').glob('*') if p.is_file()])
        fin = ROOT / 'finished' / f'{v.name}.mp4'
        rows.append(f"| {v.name[:2]} | [{title}](videos/{v.name}/) | {vo} | {photos or '-'} | "
                    + (f'[{fin.name}](finished/{fin.name})' if fin.exists() else '-') + ' |')
    readme = ROOT / 'README.md'
    s = readme.read_text()
    s = re.sub(re.escape(START) + '.*?' + re.escape(END), START + '\n' + '\n'.join(rows) + '\n' + END, s, flags=re.S)
    readme.write_text(s)
    print('README status table updated')


if __name__ == '__main__':
    main()
