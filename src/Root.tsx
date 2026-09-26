import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/tokens';
import {Timeline, beatsDuration, Beat} from './lib/timeline';
import {styleTest} from './videos/StyleTest';
import {Lab} from './videos/Lab';
import {cokeCoin, cokeCoinFrames} from './videos/CokeCoin';

const videos: Record<string, Beat[]> = {
  StyleTest: styleTest,
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="CokeCoin"
      component={() => <Timeline beats={cokeCoin} audio="vo/01.loop.wav" loop />}
      durationInFrames={cokeCoinFrames}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition id="Lab" component={Lab} durationInFrames={120} fps={FPS} width={W} height={H} />
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
