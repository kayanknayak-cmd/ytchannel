import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/tokens';
import {Timeline, beatsDuration, Beat} from './lib/timeline';
import {styleTest} from './videos/StyleTest';
import {Lab} from './videos/Lab';
import {cokeCoin, cokeCoinFrames} from './videos/01-the-7-5-cent-coin';
import {VideoDef} from './videos/registry';
import {VIDEOS} from './videos/all';

// One composition per video; id = the video's folder name in videos/. dev-* are component tests.
const dev: Record<string, Beat[]> = {'dev-style-test': styleTest};

const all: VideoDef[] = [
  {id: '01-the-7-5-cent-coin', beats: cokeCoin, frames: cokeCoinFrames, audio: 'videos/01-the-7-5-cent-coin/voiceover/loop.wav'},
  ...VIDEOS,
];

export const Root: React.FC = () => (
  <>
    {all.map((v) => (
      <Composition key={v.id} id={v.id} component={() => <Timeline beats={v.beats} audio={v.audio} loop />} durationInFrames={v.frames} fps={FPS} width={W} height={H} />
    ))}
    <Composition id="dev-lab" component={Lab} durationInFrames={120} fps={FPS} width={W} height={H} />
    {Object.entries(dev).map(([id, beats]) => (
      <Composition key={id} id={id} component={() => <Timeline beats={beats} />} durationInFrames={beatsDuration(beats)} fps={FPS} width={W} height={H} />
    ))}
  </>
);
