import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSteppedFrame} from '../lib/stepped';

/** Slow stepped camera push. Moves in visible ticks, like a rostrum camera nudged per drawing. */
export const Push: React.FC<{from?: number; to?: number; over?: number; children: React.ReactNode}> = ({
  from = 1,
  to = 1.07,
  over = 96,
  children,
}) => {
  const f = useSteppedFrame();
  const s = from + (to - from) * Math.min(1, f / over);
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

export const Stack: React.FC<{top?: number; gap?: number; children: React.ReactNode}> = ({top = 260, gap = 40, children}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: top, gap}}>{children}</AbsoluteFill>
);
