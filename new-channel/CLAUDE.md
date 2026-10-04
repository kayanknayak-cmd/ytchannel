# New channel: Claude's workspace

The owner reads chat in full and rarely opens the repo. This folder is Claude's memory, context, opinions and outputs.
Anything the owner must see goes in chat, not only here. Read this file first in every session on this branch.

## Owner
- Wants concise answers, real pushback, fact-checked claims. No em dashes. Ask questions with the clickable question tool.
- Wants to discuss and find the niche most likely to blow up before spending effort building videos.

## Decisions so far
- Shorts only, 30-45s, ElevenLabs voiceover.
- Look: polished soft 3D, all-round primitives, floating elements. Person = rounded cylinder + floating sphere head.
- Niche: psychology / why people decide things. Not "scientific" in tone.
- Every script opens in second person, casting the viewer as a character ("You own a casino...").

## Working proposal (not yet confirmed by owner)
- Angle: "you're the one designing other people's decisions": the viewer runs the business that profits from psychology
  (casino, supermarket, popcorn decoy pricing, slot near-misses, gym overselling, airlines, buffets, F2P games).
- Loop ending: "...and now you're the customer."
- Risks: claims still need fact-checking (e.g., casino-clock story is only partly true); second-person hook alone is not unique.

## Inputs
- Owner shared https://www.youtube.com/watch?v=QXfugR3ZIAs ("I Blew Up a Shorts Channel in 7 Days!", Isaac / @isaacverse).
  Transcript not accessible from this environment; ask owner for takeaways.

## Update (session 1, Q&A)
- Goal: views for fun, not money. So no RPM optimization; pick topics purely for reach.
- Owner likes: "you're a scientist designing an experiment", gambling, accessible behavioral psych ("quick dopamine hits").
- Behind-the-counter angle: owner unsure. My proposal: "You're the experimenter" as the core frame; business/gambling as recurring episodes.
- Cadence idea: batch ~30 videos, post every 3rd day. My pushback: batch 10, post, read retention, then adjust; post more often early.
- Voice: owner deferred to me. Proposed sly/conspiratorial insider, mid-fast pace.
- Voice rec (unverified vs current library): Callum first, then George, Brian. Owner to test with script 03 on v3.
- VOICE LOCKED: Callum, Scottish accent variant (English). Owner likes the twist. Watch: Americanisms (candy, guy) and runtime over 45s.

## Video 01 (pigeon box)
- VO received: voice is actually "Adam - Classic Scottish Storyteller" (not Callum). 52.2s: OVER the 45s target; flag to owner.
- Storyboard v1 stills: videos/01-pigeon-box/storyboard/ (7 frames + sheet.png). Code: engine/storyboard (three.js + playwright, serve dir on :8765).
- Style v1: cream bg #F2E6D8, coral/teal/mustard/navy/pigeon-blue, matte + env light, floating confetti spheres, glass box w/ navy base.
- Storyboard v1 REJECTED by owner: "AI slop", random pastel confetti, mushy light. Lesson: intentional palette, no random decor, real lighting.
- Storyboard v2: cobalt set #3F5E9E (floor+fog seamless), bone #EDE5D8 objects, gold #F2B33D = reward, vermilion #F04A2A = "you". Spot key + cool rim, light bloom, vignette+grain. Dark ink set tried and rejected (muddy).
- Storyboard v2 ALSO rejected: 'too simple or too complex, looks bad'. Conclusion: hand-coded procedural 3D from me hits a quality ceiling. Need references / pro assets / different medium before more renders.
- Storyboard v3: Blender Cycles via pip 'bpy' 5.0.1 (works, CPU, ~3-5 min/frame @64spp). engine/blender/frame.py. Warm off-white set #E4DACB, all-white objects, grey pigeon, red button, gold pellets, big soft area key, AgX. Product-photo minimal.
- v3 approved as direction ('right direction'). Pigeon v2: side profile, egg body + darker wing #7E8A9C + tail + floating head, faces button.
- Owner: pigeon = just a plain grey sphere. Don't add detail to it.
- Owner then: pigeon = sphere body + floating sphere head + gold beak. No eyes/wings/tail.
- Beak enlarged (r .07, depth .24). Owner said: "make the video".
- Animation: engine/blender/v01.py builds the full 52.2s scene (14 camera shots, pecks, pellets, slot machines in giant open-top box, giant scientist reveal). Render: 720x1280 16spp Cycles + motion blur, ~12s/frame, PNG seq then ffmpeg upscale to 1080x1920 + VO.
- Word timings: voiceover/words.json (sherpa-onnx parakeet; model in /home/user/ytchannel/.models).
- EEVEE works only with apt libegl1/mesa (software), not faster. Cycles CPU is the path.
- VO received: 02 (37.3s), 03 (36.0s). Both match SCRIPTS_V2 verbatim. Owner uploaded 02 twice (identical).
- VO received: 04 39.5s, 05 36.2s, 06 40.5s, 07 33.6s, 08 34.0s (08 filename lacks voice name: confirm same voice). All verbatim. Remaining: 09, 10.
- LOOP FIX: every VO ends "You're a scientist" which repeats the opening. Each video is cut just before that final line (01 cut at 48.9s before "So, you've got a pigeon in a box").
- Pipeline: engine/blender/lib.py (shared cast/motion/camera), scenes/vNN.py (one per video), preview.py (contact sheet), queue.sh + queue.txt (renders one at a time forever, encodes 1080x1920 with VO, commits finished/NN-slug.mp4). Restart after container reset: nohup engine/blender/queue.sh & (renders resume: no-overwrite + placeholders). Scratch frames in scratchpad are lost on reset.
- Visual grammar: grey = test subject (pigeon, volunteer, kid), white = neutral, glasses = works for the scientist (actors), red = wrong/answer A/danger, gold = right/reward.
- Scenes 02-08 built and queued (queue.txt). Gotcha: two keys landing on the same frame collapse (F() rounding); use F(t)-n for holds.
- Container SUSPENDED at 22:32 when session went idle; processes died, scratchpad frames survived. Restart: nohup engine/blender/queue.sh & (resumes). Rendering only progresses while the session is active.
- RENDER FARM (replaces local queue): .github/workflows/render.yml. Push a change to new-channel/engine/blender/render-request.txt (video numbers) -> 16 chunks/video on GitHub Actions (public repo = free, 20 parallel), encode with VO, commit to new-channel/finished/. Manifest: engine/blender/videos.json. Local queue stopped.
- First farm run: all 8 rendered OK (~4h15m). Publish step failed silently: .gitignore ignores *.mp4 -> fixed with git add -f. Videos in new-channel/finished/.
