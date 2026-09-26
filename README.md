# ytchannel: paper-cutout explainer shorts

Faceless, Vox-style 9:16 shorts (econ, business, science) rendered from code with Remotion.
Look: newsprint paper, torn-paper rips, sticker cutouts, stamps, ransom letters, typewriter,
and **stepped frame rates**: everything animates "on 2s/3s/4s" (12/8/6 fps) over a 24fps base.

## Commands
```bash
npm install
npm run studio                                   # live preview/editor
npm run render -- NickelCoke out/nickel-coke.mp4 # render a video
pip install imageio-ffmpeg numpy pillow; python3 tools/analyze_ref.py refs/clip.mp4
```
In the cloud container, set `REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
(the Chrome download is blocked there).

## Layout
- `src/lib/stepped.tsx`: `<Stepped step={N}>` + `useSteppedFrame()`. Use this, not `useCurrentFrame`, for motion.
- `src/lib/timeline.tsx`: a video is a list of `Beat`s (`seconds`, `step`, `bg`, `render`); beats tear away with a paper rip.
- `src/lib/tokens.ts`: palette + fonts. Restyle here.
- `src/components/`: `TornSheet`, `Cutout`, `RipAway`, `SlamStrip`, `Stamp`, `Typewriter`, `Ransom`, `Highlight`, `Push`, paper/grain/halftone.
- `src/videos/*.tsx`: one file per video; register it in `src/Root.tsx`.
- `docs/videos/*.md`: script, beat list and claim-by-claim fact check per video.

## Reference clips (style only)
Drop 5-20s excerpts into `refs/` (gitignored, copyrighted material never gets committed).
`tools/analyze_ref.py` reports the animation-rate mix (share on 1s/2s/3s/4s), cut rhythm, palette,
and writes a contact sheet of every shot to `analysis/<clip>/`.

## Assets
Archival images go in `public/assets/` as transparent PNG cutouts, used via
`<Cutout src={staticFile('assets/x.png')} ... />`. Public domain only (LoC, NARA, NASA, Wikimedia PD),
note the source in the video's doc.
