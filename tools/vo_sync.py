#!/usr/bin/env python3
"""Sync an owner-recorded voiceover to its script.

  python3 tools/vo_sync.py public/vo/11-emu.m4a --script 11

1. Transcribes the take with word timestamps (local model, sherpa-onnx Parakeet; no cloud).
2. Diffs what was said against docs/scripts/SCRIPTS.md and lists every on-the-fly edit.
   Edits touching numbers, names or dates are flagged RE-CHECK so the fact check stays true.
3. Finds the loop point: the take is read as script + first line again ("...which is why,
   Coca-Cola once asked..."). Cuts right where the first line starts over, so the end flows
   into the start with no gap. Trims lead-in silence.
4. Writes public/vo/<n>.loop.wav and public/vo/<n>.words.json (word timings for the visuals).

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

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / '.models' / 'sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8'
SCRIPTS = ROOT / 'docs' / 'scripts' / 'SCRIPTS.md'
SR = 16000


# ---------- text ----------

def script_text(n):
    s = SCRIPTS.read_text()
    m = re.search(rf'^## {n}\. [^\n]+\n> ([^\n]+)', s, re.M)
    if not m:
        sys.exit(f'script {n} not found in {SCRIPTS}')
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

def load_audio(path):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run([ff, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


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
    ap.add_argument('audio')
    ap.add_argument('--script', required=True, help='script number in SCRIPTS.md')
    ap.add_argument('--out', default=None, help='output stem (default public/vo/<n>)')
    args = ap.parse_args()

    text = script_text(args.script)
    names = {w.lower() for w in re.findall(r"\b[A-Z][a-z]+\b", text)} - {'the', 'and', 'but', 'so', 'okay', 'in', 'a'}
    audio = load_audio(args.audio)
    words = transcribe(audio)
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
    t0 = max(0.0, words[0]['start'] - 0.04)
    if loop_i is not None:
        t1 = words[loop_i]['start'] - 0.02
        body = [w for w in words if w['start'] < t1]
    else:
        t1 = min(len(audio) / SR, words[-1]['end'] + 0.15)
        body = words
        print('! No repeat of the first line found at the end: loop point not cut. Read the last line straight into the first line.')

    said_body = [w for word in body for w in normalize(word['text'])]
    ops, ratio = diff(target, said_body, names)

    stem = Path(args.out) if args.out else ROOT / 'public' / 'vo' / str(args.script)
    clip = audio[int(t0 * SR):int(t1 * SR)].copy()
    fade = int(0.008 * SR)
    clip[:fade] *= np.linspace(0, 1, fade)
    clip[-fade:] *= np.linspace(1, 0, fade)
    peak = np.abs(clip).max() or 1
    clip = clip / peak * 0.89
    with wave.open(str(stem) + '.loop.wav', 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes((clip * 32767).astype(np.int16).tobytes())
    out_words = [{'text': w['text'], 'start': round(w['start'] - t0, 3), 'end': round(min(w['end'], t1) - t0, 3)} for w in body]
    dur = (t1 - t0)
    Path(str(stem) + '.words.json').write_text(json.dumps({'script': int(args.script), 'duration': round(dur, 3), 'words': out_words}, indent=1))

    wpm = len(said_body) / dur * 60 if dur else 0
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
    print(f'-> {stem}.loop.wav, {stem}.words.json')


if __name__ == '__main__':
    main()
