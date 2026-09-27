import React from 'react';
import {AbsoluteFill, random, staticFile, useCurrentFrame} from 'remotion';
import {toPath, toPolygon, tornLine} from '../lib/torn';
import {W, H} from '../lib/tokens';

type Pt = [number, number];

/**
 * Tear-away wipe for the OUTGOING scene. For `duration` frames after `start`,
 * the scene is clipped above a jagged tear that sweeps up the frame. The torn
 * edge shows a white fiber band and casts a shadow onto the incoming scene underneath.
 * Always on 2s regardless of the scene's own rate: a smooth rip reads as a cheap wipe.
 */
export const RipAway: React.FC<{start: number; duration: number; seed: string; children: React.ReactNode}> = ({
  start,
  duration,
  seed,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) return <>{children}</>;
  const tq = Math.floor(t / 2) * 2;
  if (tq >= duration) return null;
  const p = Math.pow(tq / duration, 1.35); // accelerate like a real pull
  const y = H * (1.1 - p * 1.4);
  const tilt = 0.22; // slope so the tear isn't flat
  const edge: Pt[] = tornLine(W, 0, `${seed}-rip`, 34).map(([x, dy]) => [x, y + dy + (x - W / 2) * tilt]);
  // Printed face ends a ragged 6-20px above the tear; the gap is exposed fiber.
  const face: Pt[] = edge.map(([x, yy], i) => [x, yy - 6 - random(`${seed}-f-${i}`) * 14]);
  const top: Pt[] = [[W, -600], [0, -600]];
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute', overflow: 'visible'}}>
        <filter id={`rs-${seed}`} x="-10%" y="-50%" width="120%" height="200%">
          <feDropShadow dx="0" dy="16" stdDeviation="10" floodColor="rgba(20,14,6,0.5)" />
        </filter>
        <pattern id={`rf-${seed}`} patternUnits="userSpaceOnUse" width={W} height={H}>
          <image href={staticFile('paper/white.jpg')} width={W} height={H} />
        </pattern>
        <path d={toPath([...edge, ...top])} fill={`url(#rf-${seed})`} filter={`url(#rs-${seed})`} />
        {/* loose fibers sticking out of the tear */}
        {edge.filter((_, i) => random(`${seed}-h-${i}`) > 0.55).map(([x, yy], i) => {
          const len = 4 + random(`${seed}-hl-${i}`) * 10;
          const a = Math.PI / 2 + (random(`${seed}-ha-${i}`) - 0.5) * 1.4;
          return (
            <line key={i} x1={x} y1={yy - 1} x2={x + Math.cos(a) * len} y2={yy + Math.sin(a) * len} stroke="rgba(250,246,236,0.85)" strokeWidth={1.1} strokeLinecap="round" />
          );
        })}
      </svg>
      <AbsoluteFill style={{clipPath: toPolygon([...face, ...top])}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
