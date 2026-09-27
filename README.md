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
| 02 | [The four-cent penny](videos/02-the-four-cent-penny/) | synced | 3 | [02-the-four-cent-penny.mp4](finished/02-the-four-cent-penny.mp4) |
| 03 | [A picture of nothing](videos/03-a-picture-of-nothing/) | synced | 3 | [03-a-picture-of-nothing.mp4](finished/03-a-picture-of-nothing.mp4) |
| 04 | [Death by molasses](videos/04-death-by-molasses/) | synced | 3 | [04-death-by-molasses.mp4](finished/04-death-by-molasses.mp4) |
| 05 | [Too much gold](videos/05-too-much-gold/) | synced | 1 | [05-too-much-gold.mp4](finished/05-too-much-gold.mp4) |
| 06 | [Monopoly was a warning](videos/06-monopoly-was-a-warning/) | synced | 2 | [06-monopoly-was-a-warning.mp4](finished/06-monopoly-was-a-warning.mp4) |
| 07 | [Money at the bottom of the sea](videos/07-money-at-the-bottom-of-the-sea/) | synced | 3 | [07-money-at-the-bottom-of-the-sea.mp4](finished/07-money-at-the-bottom-of-the-sea.mp4) |
| 08 | [The kid who was mailed](videos/08-the-kid-who-was-mailed/) | synced | 1 | [08-the-kid-who-was-mailed.mp4](finished/08-the-kid-who-was-mailed.mp4) |
| 09 | [The chocolate bar that tastes bad](videos/09-the-chocolate-bar-that-tastes-bad/) | synced | 1 | [09-the-chocolate-bar-that-tastes-bad.mp4](finished/09-the-chocolate-bar-that-tastes-bad.mp4) |
| 10 | [Lip, dip, paint](videos/10-lip-dip-paint/) | synced | 2 | [10-lip-dip-paint.mp4](finished/10-lip-dip-paint.mp4) |
| 11 | [The army lost to emus](videos/11-the-army-lost-to-emus/) | synced | 2 | [11-the-army-lost-to-emus.mp4](finished/11-the-army-lost-to-emus.mp4) |
| 12 | [Why plane windows are round](videos/12-why-plane-windows-are-round/) | synced | 2 | [12-why-plane-windows-are-round.mp4](finished/12-why-plane-windows-are-round.mp4) |
| 13 | [This check bought Alaska](videos/13-this-check-bought-alaska/) | synced | 3 | [13-this-check-bought-alaska.mp4](finished/13-this-check-bought-alaska.mp4) |
| 14 | [Unplug the batteries](videos/14-unplug-the-batteries/) | synced | 2 | [14-unplug-the-batteries.mp4](finished/14-unplug-the-batteries.mp4) |
| 15 | [The moldy cantaloupe](videos/15-the-moldy-cantaloupe/) | synced | 1 | [15-the-moldy-cantaloupe.mp4](finished/15-the-moldy-cantaloupe.mp4) |
| 16 | [He sold the Eiffel Tower](videos/16-he-sold-the-eiffel-tower/) | synced | 2 | [16-he-sold-the-eiffel-tower.mp4](finished/16-he-sold-the-eiffel-tower.mp4) |
| 17 | [Tomato pills](videos/17-tomato-pills/) | synced | 2 | [17-tomato-pills.mp4](finished/17-tomato-pills.mp4) |
| 18 | [Twenty-two orphans](videos/18-twenty-two-orphans/) | synced | 2 | [18-twenty-two-orphans.mp4](finished/18-twenty-two-orphans.mp4) |
| 19 | [The Great Stink](videos/19-the-great-stink/) | - | - | - |
| 20 | [Tulip mania didn't happen](videos/20-tulip-mania-didnt-happen/) | - | - | - |
<!-- status:end -->

## Making a video (for Claude)
1. Voiceover lands in `videos/NN-*/voiceover/original.m4a` (sorted from `inbox/`).
2. `python3 engine/tools/vo_sync.py NN`: edits report, loop cut, word timings.
3. Photos: `engine/tools/fetch_commons.py` (license-checked) then `engine/tools/treat_photo.py` into `videos/NN-*/photos/`.
4. Code: `engine/src/videos/NN-*.tsx`, register in `engine/src/Root.tsx`.
5. `npm run render -- NN` writes `finished/NN-*.mp4` and updates the table above.
