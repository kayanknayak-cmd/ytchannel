#!/usr/bin/env python3
"""Sync an owner-recorded voiceover to its script.

  python3 engine/tools/vo_sync.py 11            # uses videos/11-*/voiceover/original.m4a
  python3 engine/tools/vo_sync.py 11 take2.m4a  # or a specific file

1. Transcribes the take with word timestamps (local model, sherpa-onnx Parakeet; no cloud).
2. Diffs what was said against docs/scripts/SCRIPTS.md and lists every on-the-fly edit.
   Edits touching numbers, names or dates are flagged RE-CHECK so the fact check stays true.
3. Finds the loop point: the take is read as script + first line again ("...which is why,
   Coca-Cola once asked..."). Cuts right where the first line starts over, so the end flows
   into the start with no gap. Trims lead-in silence.
4. Writes videos/NN-*/voiceover/loop.wav and words.json (word timings for the visuals).

Setup (once per container): pip install sherpa-onnx imageio-ffmpeg numpy; pip install --no-deps num2words
  model: github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2
  extract into .models/ (gitignored)
"""
import argparse
import difflib
import json
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
MODEL = ROOT / '.models' / 'sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8'
SR = 16000


# ---------- text ----------

def video_dir(n):
    found = sorted((ROOT / 'videos').glob(f'{int(n):02d}-*'))
    if not found:
        sys.exit(f'no folder videos/{int(n):02d}-*')
    return found[0]


def script_text(n):
    readme = video_dir(n) / 'README.md'
    m = re.search(r'^## Script\n> ([^\n]+)', readme.read_text(), re.M)
    if not m:
        sys.exit(f'no "## Script" block in {readme}')
    return m.group(1).replace('||', '').strip()


def normalize(text):
    """Lowercase words with numbers spelled out, so '1932' and 'nineteen thirty-two' compare equal-ish."""
    from num2words import num2words
    t = text.replace('½', ' and a half').replace('¢', ' cents').replace('$', ' dollars ')
    t = t.replace('%', ' percent')

    def spell(m):
        s = m.group(0).replace(',', '')
        try:
            v = float(s) if '.' in s else int(s)
        except ValueError:
            return s
        if isinstance(v, int) and 1100 <= v <= 2099:  # read years as years
            return num2words(v, to='year')
        return num2words(v)
    t = re.sub(r'\d[\d,]*(\.\d+)?', spell, t)
    t = t.lower().replace('-', ' ')
    return re.findall(r"[a-z']+", t)


# ---------- audio ----------

def resample(audio, src, dst):
    from scipy.signal import resample_poly
    from math import gcd
    g = gcd(src, dst)
    return resample_poly(audio, dst // g, src // g).astype(np.float32)


def load_audio(path, sr=SR):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run([ff, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def declip(audio, thresh=0.985):
    """Rebuild flattened peaks: fit a cubic through the good samples around each clipped run.
    Works well for short runs (a few ms), which is what an overloaded phone mic produces on stressed words.
    Returns (repaired, n_clipped_samples, longest_run_ms)."""
    from scipy.interpolate import CubicSpline
    x = audio.astype(np.float64).copy()
    bad = np.abs(x) >= thresh
    n = int(bad.sum())
    if n == 0:
        return audio, 0, 0.0
    edges = np.flatnonzero(np.diff(np.r_[0, bad.astype(np.int8), 0]))
    longest = 0
    for s, e in zip(edges[::2], edges[1::2]):
        longest = max(longest, e - s)
        ctx = 6
        lo, hi = max(0, s - ctx), min(len(x), e + ctx)
        good = np.r_[np.arange(lo, s), np.arange(e, hi)]
        if len(good) < 4:
            continue
        cs = CubicSpline(good, x[good])
        rebuilt = cs(np.arange(s, e))
        sign = np.sign(x[s:e])
        x[s:e] = sign * np.maximum(np.abs(rebuilt), thresh)  # never below the clip level it came from
    x /= max(1.0, np.abs(x).max() / 0.89)
    return x.astype(np.float32), n, longest / SR * 1000


def speech_bounds(audio, sr, t_first, t_last):
    """True start of the first word and true end of the last word, from loudness.
    The model only gives word START times, so the last word's end must come from the audio:
    walk forward until the level sits near the room noise for 120ms."""
    hop = sr // 100
    fr = audio[:len(audio) // hop * hop].reshape(-1, hop)
    db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
    floor = np.percentile(db, 5)
    quiet = db < floor + 9
    i = int(t_last * 100)
    run = 0
    while i < len(db):
        run = run + 1 if quiet[i] else 0
        if run >= 12:
            break
        i += 1
    end = (i - run + 1) / 100 if i < len(db) else len(audio) / sr
    j = int(t_first * 100)
    if quiet[min(j, len(quiet) - 1)]:  # model placed the word early, in silence: walk forward to the onset
        while j < len(quiet) - 1 and quiet[j]:
            j += 1
    while j > 0 and not quiet[j - 1]:
        j -= 1
    return max(0.0, j / 100), end


def transcribe(audio):
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=str(MODEL / 'encoder.int8.onnx'), decoder=str(MODEL / 'decoder.int8.onnx'),
        joiner=str(MODEL / 'joiner.int8.onnx'), tokens=str(MODEL / 'tokens.txt'),
        model_type='nemo_transducer', num_threads=4)
    words = []
    chunk = SR * 25  # model is happiest under ~30s; overlap-free chunks at silence-ish points
    start = 0
    while start < len(audio):
        end = min(len(audio), start + chunk)
        if end < len(audio):  # move the cut to the quietest 20ms in the last 3s
            win = audio[end - 3 * SR:end]
            e = np.convolve(win ** 2, np.ones(320), 'valid')
            end = end - 3 * SR + int(np.argmin(e)) + 160
        st = rec.create_stream()
        st.accept_waveform(SR, audio[start:end])
        rec.decode_stream(st)
        r = st.result
        cur = None
        for tok, ts in zip(r.tokens, r.timestamps):
            t = start / SR + ts
            if tok.startswith(' ') or tok.startswith('▁') or cur is None:
                if cur:
                    words.append(cur)
                cur = {'text': tok.strip(' ▁'), 'start': t}
            else:
                cur['text'] += tok
            cur['end'] = t + 0.08
        if cur:
            words.append(cur)
        start = end
    for i, w in enumerate(words[:-1]):  # a word ends where the next begins (capped)
        w['end'] = min(words[i + 1]['start'], w['start'] + 1.2)
    return [w for w in words if w['text']]


# ---------- diff ----------

RISKY = re.compile(r"(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|"
                   r"sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|"
                   r"hundred|thousand|million|billion|half|percent|cents|dollars)")


def diff(script_words, said_words, names):
    ops = []
    sm = difflib.SequenceMatcher(a=script_words, b=said_words, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            continue
        a = ' '.join(script_words[i1:i2])
        b = ' '.join(said_words[j1:j2])
        risky = bool(RISKY.search(a) or RISKY.search(b)) or any(n in (a + ' ' + b) for n in names)
        ops.append((tag, a, b, risky))
    return ops, sm.ratio()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('script', help='video number, e.g. 11')
    ap.add_argument('audio', nargs='?', help='default: videos/NN-*/voiceover/original.m4a')
    ap.add_argument('--end-after', default=None, help='drop everything after the last occurrence of this word (e.g. a trailing "uh")')
    ap.add_argument('--out', default=None, help='output folder (default: the video\'s voiceover/ folder)')
    args = ap.parse_args()
    vdir = video_dir(args.script)
    args.audio = args.audio or str(next((vdir / 'voiceover').glob('original.*')))

    text = script_text(args.script)
    names = {w.lower() for w in re.findall(r"\b[A-Z][a-z]+\b", text)} - {'the', 'and', 'but', 'so', 'okay', 'in', 'a'}
    audio = load_audio(args.audio, sr=48000)
    audio, n_clip, longest_ms = declip(audio)
    words = transcribe(resample(audio, 48000, SR))
    if args.end_after:
        tgt = normalize(args.end_after)[0]
        idx = max(i for i, w in enumerate(words) if tgt in normalize(w['text']))
        words = words[:idx + 1]
    said = [w for word in words for w in normalize(word['text'])]
    target = normalize(text)

    # --- loop point: last place the opening words are said again ---
    head = target[:4]
    flat = []  # (normalized word, index into words)
    for i, w in enumerate(words):
        for nw in normalize(w['text']):
            flat.append((nw, i))
    loop_i = None
    for k in range(len(flat) - len(head), len(flat) // 3, -1):
        if [x for x, _ in flat[k:k + len(head)]] == head:
            loop_i = flat[k][1]
            break
    first_on, _ = speech_bounds(audio, 48000, words[0]['start'], words[-1]['start'])
    t0 = max(0.0, first_on - 0.03)
    if loop_i is not None:
        t1 = words[loop_i]['start'] - 0.02
        body = [w for w in words if w['start'] < t1]
    else:
        _, last_off = speech_bounds(audio, 48000, words[0]['start'], words[-1]['start'])
        t1 = min(len(audio) / 48000, last_off + 0.12)  # small natural tail after the word dies away
        body = words
        print('Note: take ends without rolling into the first line; loop cut right after the last word (fine, rolling in just makes the join smoother).')

    said_body = [w for word in body for w in normalize(word['text'])]
    ops, ratio = diff(target, said_body, names)

    outdir = Path(args.out) if args.out else vdir / 'voiceover'
    OUT = 48000
    clip = audio[int(t0 * OUT):int(t1 * OUT)].copy()
    fade_in, fade_out = int(0.006 * OUT), int(0.06 * OUT)
    clip[:fade_in] *= np.linspace(0, 1, fade_in)
    clip[-fade_out:] *= np.linspace(1, 0, fade_out) ** 2
    peak = np.abs(clip).max() or 1
    clip = clip / peak * 0.89
    with wave.open(str(outdir / 'loop.wav'), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(OUT)
        f.writeframes((clip * 32767).astype(np.int16).tobytes())
    if loop_i is None and body:
        body[-1]['end'] = t1  # the last word lasts until the speech actually dies away
    out_words = [{'text': w['text'], 'start': round(max(0.0, w['start'] - t0), 3), 'end': round(min(w['end'], t1) - t0, 3)} for w in body]
    dur = (t1 - t0)
    (outdir / 'words.json').write_text(json.dumps({'script': int(args.script), 'duration': round(dur, 3), 'words': out_words}, indent=1))

    wpm = len(said_body) / dur * 60 if dur else 0
    if n_clip:
        print(f'! Mic clipped on {n_clip} samples (longest burst {longest_ms:.1f} ms). Repaired by peak reconstruction.'
              + (' Bursts over ~3 ms may still sound rough: listen, re-record if so.' if longest_ms > 3 else ''))
    print(f'Script {args.script}: {dur:.1f}s loop, {len(said_body)} words, {wpm:.0f} wpm, match {ratio:.0%}')
    if not ops:
        print('Read exactly as written.')
    for tag, a, b, risky in ops:
        flag = '  RE-CHECK FACT' if risky else ''
        if tag == 'replace':
            print(f'  changed: "{a}" -> "{b}"{flag}')
        elif tag == 'delete':
            print(f'  cut:     "{a}"{flag}')
        else:
            print(f'  added:   "{b}"{flag}')
    print(f'-> {outdir}/loop.wav, words.json')


if __name__ == '__main__':
    main()
