import {FPS} from './tokens';

export type VoWords = {script: number; duration: number; words: {text: string; start: number; end: number}[]};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9½']/g, '');

/**
 * Cue sheet from the synced voiceover (tools/vo_sync.py). Everything is timed to the owner's
 * actual take, so re-recording just means re-running the tool: the video retimes itself.
 */
export const cues = (vo: VoWords) => {
  const find = (text: string, nth = 0) => {
    const target = text.split(' ').map(norm);
    let seen = 0;
    for (let i = 0; i <= vo.words.length - target.length; i++) {
      if (target.every((t, k) => norm(vo.words[i + k].text) === t)) {
        if (seen++ === nth) return vo.words[i];
      }
    }
    throw new Error(`cue "${text}" (#${nth}) not in voiceover. Re-check the take with tools/vo_sync.py`);
  };
  return {
    /** Frame where `text` starts being said. */
    at: (text: string, nth = 0) => Math.round(find(text, nth).start * FPS),
    /** Seconds where `text` starts. */
    sec: (text: string, nth = 0) => find(text, nth).start,
    frames: Math.round(vo.duration * FPS),
  };
};
