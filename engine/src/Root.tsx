import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/tokens';
import {Timeline, beatsDuration, Beat} from './lib/timeline';
import {styleTest} from './videos/StyleTest';
import {Lab} from './videos/Lab';
import {cokeCoin, cokeCoinFrames} from './videos/01-the-7-5-cent-coin';

// One composition per video; id = the video's folder name in videos/. dev-* are component tests.
const videos: Record<string, Beat[]> = {
  'dev-style-test': styleTest,
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="01-the-7-5-cent-coin"
      component={() => <Timeline beats={cokeCoin} audio="videos/01-the-7-5-cent-coin/voiceover/loop.wav" loop />}
      durationInFrames={cokeCoinFrames}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition id="dev-lab" component={Lab} durationInFrames={120} fps={FPS} width={W} height={H} />
    {Object.entries(videos).map(([id, beats]) => (
      <Composition
        key={id}
        id={id}
        component={() => <Timeline beats={beats} />}
        durationInFrames={beatsDuration(beats)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
