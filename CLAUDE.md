# Project notes for Claude

Faceless Vox / Johnny Harris-style 9:16 shorts (econ, business, science), rendered with Remotion.

## Owner's style rules (non-negotiable)
- Real photos, edited (cutout, halftone, duotone, torn prints). No clip art, no drawn stand-ins.
  Generated assets only if procedural (paper, tape, marker, grain). No AI imagery.
- Main text = newspaper clippings, different font/paper per letter (`Headline mode="letters"`).
  Use `mode="words"` for longer lines so they stay readable in ~1s.
- Frames must be dense and layered (photo + newspaper scraps + tape + marker + clippings), never a
  lone element on blank paper. Visuals tell the story; text is the accent, not a slideshow.
- Stepped animation: 12/8/6 fps (`step` 2/3/4) over 24fps base. Nothing smooth at 24.
- Voiceover: the owner records it. No ElevenLabs/AI voice. Visuals get locked first, then retimed to VO.
- Fact-check every on-screen claim; log sources in docs/videos/<video>.md. No readable fabricated
  headlines/quotes in decor (NewsScrap stays illegible body text).
- No em dashes in any output.
- Videos must loop perfectly: last line/frame flows into the first. No "follow for more" outros.
- Open owner notes live in docs/NOTES.md. Check them before starting work.

## Pipeline
- Photos: `python3 tools/treat_photo.py in.jpg public/assets/<video>/x.png --cut|--torn --style halftone|duotone|mono|color`
  Needs: pip install numpy pillow scipy scikit-image "rembg[cpu]" imageio-ffmpeg
- Paper: `python3 tools/make_paper.py` -> public/paper/*.jpg
- Reference clips: `python3 tools/analyze_ref.py refs/clip.mp4` (refs/ is gitignored)
- Render in cloud container: `REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell npx remotion render src/index.ts <Comp> out/x.mp4`
- Network: archive hosts (wikimedia, loc.gov, archives.gov, nasa, archive.org) were blocked as of 2026-09-26;
  owner asked how to allowlist them. GitHub + PyPI + npm work.
