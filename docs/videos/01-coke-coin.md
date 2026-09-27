# 01: The 7½¢ coin

Script: docs/scripts/SCRIPTS.md #1

## Voiceover
- Take: `public/vo/01-coke-coin.m4a` (owner, 2026-09-26)
- Synced: `public/vo/01.loop.wav` (25.4s, 48kHz), word timings `public/vo/01.words.json`
- Read word for word (100% match), 176 wpm. No on-the-fly edits, so no fact re-check needed.
- Mic clipped on 7 stressed words (1.1ms bursts); repaired by peak reconstruction. Peak now -1 dBFS.
- Loop: take stops at "which is why". v1 cut clipped the tail of "why" (tool guessed word end). Fixed: end now found from loudness,
  full word + 60ms fade; lead silence trimmed; join gap 0.17s (a spoken comma).

## Fact check
| Claim | Status | Source |
|---|---|---|
| Coke asked the President for a 7.5¢ coin; declined | Verified (Woodruff to Eisenhower, 1953) | [Wikipedia summary of Levy & Young 2004](https://en.wikipedia.org/wiki/Fixed_price_of_Coca-Cola_from_1886_to_1959) |
| A Coke cost a nickel for over seventy years | Verified (1886-1959) | Levy & Young (2004); [NPR](https://www.npr.org/transcripts/456410327) |
| Vending machines took one coin, a nickel | Verified | [NPR](https://www.npr.org/transcripts/456410327) |
| Next coin up is a dime; doubling the price | Arithmetic | |

## Visuals
Composition `CokeCoin` (src/videos/CokeCoin.tsx). Every event keyed to a word in the take; re-recording retimes it.
Animatic done 2026-09-26: motion, clippings, stamps, marker, transitions, audio, seamless loop
(last->first frame diff 2.3 vs 1.9 typical frame step).

Photo slots still empty (archive hosts blocked). Fill `P` in CokeCoin.tsx with treated PNGs:
- ike: Eisenhower official portrait (PD)
- ad: pre-1929 Coca-Cola print ad (PD)
- vending: 1950s Coca-Cola vending machine (LoC)
- nickel / dime: Jefferson nickel, Roosevelt dime (US Mint, PD)

## Photos (all public domain, verified license)
| Slot | Source |
|---|---|
| ike | [Eisenhower official portrait, May 29, 1959](https://commons.wikimedia.org/wiki/File:Dwight_D._Eisenhower,_official_photo_portrait,_May_29,_1959.jpg) (US gov) |
| ad | [Coca-Cola 5¢ ad, c.1900, Hilda Clark](https://commons.wikimedia.org/wiki/File:Cocacola-5cents-1900_edit1.jpg) (pre-1929) |
| vending | [Carol M. Highsmith, Coke machine, Benton Harbor MI](https://www.loc.gov/item/2020742383/) (LoC, no known restrictions) |
| nickel | [1938 Jefferson nickel, Smithsonian NNC](https://commons.wikimedia.org/wiki/File:NNC-US-1938-5C-Jefferson_Nickel.jpg) |
| dime | [Roosevelt dime, US Mint](https://commons.wikimedia.org/wiki/File:Dime_Obverse_13.png) (2013 strike; design unchanged since 1946) |

Status 2026-09-27: final render done. Loop seam 2.3 vs 2.1 typical frame step.
Note: Wikimedia rate-limits this IP for originals; use standard thumbnail widths (1280/1920).
