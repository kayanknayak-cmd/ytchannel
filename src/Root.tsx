import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/tokens';
import {Timeline, beatsDuration, Beat} from './lib/timeline';
import {nickelCoke} from './videos/nickelCoke';

const videos: Record<string, Beat[]> = {
  NickelCoke: nickelCoke,
};

export const Root: React.FC = () => (
  <>
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
