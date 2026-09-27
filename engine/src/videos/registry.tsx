import {Beat, beatsDuration} from '../lib/timeline';
import {buildVideo, Shot} from '../lib/spec';
import {VoWords} from '../lib/vo';

export type VideoDef = {id: string; beats: Beat[]; frames: number; audio: string};

/** A video defined as shots over the owner's voiceover. id = folder name in videos/. */
export const defineVideo = (id: string, vo: VoWords, shots: Shot[]): VideoDef => {
  const beats = buildVideo(vo, shots, id.slice(0, 2));
  return {id, beats, frames: beatsDuration(beats), audio: `videos/${id}/voiceover/loop.wav`};
};

/** Photo path helper: p('02-the-four-cent-penny', 'penny') -> videos/02-.../photos/penny.png */
export const photo = (id: string, name: string) => `videos/${id}/photos/${name}.png`;
