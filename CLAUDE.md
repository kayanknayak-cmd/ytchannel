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
- Every script topic must have public-domain photos/documents to cut up. No brand-owned subjects without PD imagery.
- All scripts PG: no gore, no graphic injury detail, no swearing.
- Owner talks fast (~200 wpm) and edits scripts while recording. Always run tools/vo_sync.py on a take:
  the recording, not SCRIPTS.md, is the source of truth for timing; re-fact-check any RE-CHECK line.
- Scripts: curious-storyteller tone, 20-30s, must not sound AI-written (see NOTES.md).
- Voiceover: the owner records it. No ElevenLabs/AI voice. Visuals get locked first, then retimed to VO.
- Fact-check every on-screen claim; log sources in videos/NN-*/README.md. No readable fabricated
  headlines/quotes in decor (NewsScrap stays illegible body text).
- No em dashes in any output.
- Videos must loop perfectly: last line/frame flows into the first. No "follow for more" outros.
- Open owner notes live in NOTES.md. Check them before starting work.

## Repo layout (keep it this way; the owner navigates it on GitHub)
- `finished/NN-slug.mp4`: final videos (tracked in git; the only MP4s that are).
- `videos/NN-slug/`: README.md (script under "## Script", fact check, sources, photo credits),
  `voiceover/` (original.m4a, loop.wav, words.json), `photos/` (treated PNGs).
- `inbox/`: owner uploads land here with arbitrary names. Identify recordings by transcribing,
  move them to `videos/NN-*/voiceover/original.m4a`, leave inbox empty (README only).
- `engine/`: all code. `engine/src` (Remotion; one file per video `engine/src/videos/NN-slug.tsx`,
  composition id = folder name), `engine/tools` (Python), `engine/static` (paper textures).
- Update the README status table with `python3 engine/tools/status.py` after any change.
- `refs/`, `out/`, `analysis/`, `.models/`, `engine/.public/` are local scratch (gitignored).

## Pipeline
- Voiceover: `python3 engine/tools/vo_sync.py NN` -> voiceover/loop.wav + words.json + edit report (RE-CHECK lines need fact re-check).
  Needs sherpa-onnx + Parakeet model in .models/ (GitHub release, see tool docstring). HF/OpenAI model hosts are blocked.
- Photos: `python3 engine/tools/fetch_commons.py --info|--get ...` (prints license; Wikimedia rate-limits originals from this IP,
  use standard thumbnail widths 1280/1920). LoC items: `https://www.loc.gov/item/<id>/?fo=json`, check rights_advisory.
  Then `python3 engine/tools/treat_photo.py src videos/NN-*/photos/x.png --cut|--torn --style halftone|duotone|mono|color [--crop x0,y0,x1,y1]`.
  Needs: pip install numpy pillow scipy scikit-image "rembg[cpu]" imageio-ffmpeg sherpa-onnx; pip install --no-deps num2words
- Paper: `python3 engine/tools/make_paper.py` -> engine/static/paper/*.jpg
- Render: `npm run render -- NN` (builds engine/.public, renders, compresses to finished/, checks loop seam, updates status).
- Network: environment set to allow archive hosts on 2026-09-27 (wikimedia, loc.gov, archives.gov). GitHub + PyPI + npm work.
