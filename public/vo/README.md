# Voiceovers

One file per script, named after the script number:

- `01-nickel-coke.m4a`
- `02-penny.m4a`
- `03-hubble.m4a`
- `04-molasses.m4a`

Any format works (m4a from iPhone Voice Memos, mp3, wav). Add `-scratch` for rough reads
(`03-hubble-scratch.m4a`) and `-take2`, `-take3` for redos. Claude converts and trims them.

## How to record
Read the whole script, then roll straight into the first line again without stopping
("...which is why, Coca-Cola once asked the President..."). That's how the loop gets cut seamlessly.
Change words freely. Claude runs `tools/vo_sync.py`, which lists your edits and flags any that touch a fact.
