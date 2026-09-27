# ytchannel

Faceless, Vox-style 9:16 shorts (econ, business, science): real public-domain photos, torn paper,
newspaper-clipping text, stepped 12/8/6 fps animation, perfect loops. Voiced by the owner.

## Where things are

| Folder | What's in it |
|---|---|
| **`finished/`** | **Final videos, ready to post.** One MP4 per video. |
| `videos/` | One folder per video: `README.md` (script, fact check, sources, photo credits), `voiceover/`, `photos/` |
| `inbox/` | Drop new voiceovers or photos here. Any file name is fine; Claude sorts them into `videos/`. |
| `NOTES.md` | Your notes and decisions |
| `engine/` | The code that builds videos. You never need to open it. |

The files at the top level (`package.json`, `tsconfig.json`, `remotion.config.ts`, `CLAUDE.md`) are settings; ignore them.

## Status

<!-- status:start -->
| # | Video | Voiceover | Photos | Finished video |
|---|---|---|---|---|
| 01 | [The 7½¢ coin](videos/01-the-7-5-cent-coin/) | synced | 5 | [01-the-7-5-cent-coin.mp4](finished/01-the-7-5-cent-coin.mp4) |
| 02 | [The four-cent penny](videos/02-the-four-cent-penny/) | recorded | - | - |
| 03 | [A picture of nothing](videos/03-a-picture-of-nothing/) | recorded | - | - |
| 04 | [Death by molasses](videos/04-death-by-molasses/) | recorded | - | - |
| 05 | [Too much gold](videos/05-too-much-gold/) | recorded | - | - |
| 06 | [Monopoly was a warning](videos/06-monopoly-was-a-warning/) | recorded | - | - |
| 07 | [Money at the bottom of the sea](videos/07-money-at-the-bottom-of-the-sea/) | recorded | - | - |
| 08 | [The kid who was mailed](videos/08-the-kid-who-was-mailed/) | recorded | - | - |
| 09 | [The chocolate bar that tastes bad](videos/09-the-chocolate-bar-that-tastes-bad/) | recorded | - | - |
| 10 | [Lip, dip, paint](videos/10-lip-dip-paint/) | recorded | - | - |
| 11 | [The army lost to emus](videos/11-the-army-lost-to-emus/) | recorded | - | - |
| 12 | [Why plane windows are round](videos/12-why-plane-windows-are-round/) | recorded | - | - |
| 13 | [This check bought Alaska](videos/13-this-check-bought-alaska/) | recorded | - | - |
| 14 | [Unplug the batteries](videos/14-unplug-the-batteries/) | recorded | - | - |
| 15 | [The moldy cantaloupe](videos/15-the-moldy-cantaloupe/) | recorded | - | - |
| 16 | [He sold the Eiffel Tower](videos/16-he-sold-the-eiffel-tower/) | recorded | - | - |
| 17 | [Tomato pills](videos/17-tomato-pills/) | recorded | - | - |
| 18 | [Twenty-two orphans](videos/18-twenty-two-orphans/) | recorded | - | - |
| 19 | [The Great Stink](videos/19-the-great-stink/) | - | - | - |
| 20 | [Tulip mania didn't happen](videos/20-tulip-mania-didnt-happen/) | - | - | - |
<!-- status:end -->

## Making a video (for Claude)
1. Voiceover lands in `videos/NN-*/voiceover/original.m4a` (sorted from `inbox/`).
2. `python3 engine/tools/vo_sync.py NN`: edits report, loop cut, word timings.
3. Photos: `engine/tools/fetch_commons.py` (license-checked) then `engine/tools/treat_photo.py` into `videos/NN-*/photos/`.
4. Code: `engine/src/videos/NN-*.tsx`, register in `engine/src/Root.tsx`.
5. `npm run render -- NN` writes `finished/NN-*.mp4` and updates the table above.
