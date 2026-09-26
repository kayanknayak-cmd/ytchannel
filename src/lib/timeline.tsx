import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Stepped} from './stepped';
import {FPS} from './tokens';
import {GrainOverlay, PaperBackground} from '../components/Paper';
import {RipAway} from '../components/Rip';

export type Beat = {
  id: string;
  seconds: number;
  /** Hold each drawing N frames at 24fps: 1=24fps, 2=12fps, 3=8fps, 4=6fps. */
  step: 1 | 2 | 3 | 4;
  /** How this beat leaves. Default 'rip'. */
  exit?: 'rip' | 'cut';
  bg?: string;
  render: React.FC;
};

export const RIP_FRAMES = 14;

export const beatsDuration = (beats: Beat[]) =>
  beats.reduce((s, b) => s + Math.round(b.seconds * FPS), 0);

/**
 * Lays beats end to end. A 'rip' exit keeps the outgoing beat alive for RIP_FRAMES
 * past its end and tears it away over the next beat, so earlier beats stack on top.
 */
export const Timeline: React.FC<{beats: Beat[]}> = ({beats}) => {
  let cursor = 0;
  const placed = beats.map((b) => {
    const dur = Math.round(b.seconds * FPS);
    const from = cursor;
    cursor += dur;
    return {b, from, dur};
  });
  return (
    <AbsoluteFill>
      {placed.map(({b, from, dur}, i) => {
        const last = i === placed.length - 1;
        const rip = (b.exit ?? 'rip') === 'rip' && !last;
        const Scene = b.render;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur + (rip ? RIP_FRAMES : 0)} style={{zIndex: placed.length - i}}>
            <Stepped step={b.step}>
              <RipAway start={rip ? dur : Infinity} duration={RIP_FRAMES} seed={b.id}>
                <AbsoluteFill>
                  <PaperBackground tone={b.bg} />
                  <Scene />
                </AbsoluteFill>
              </RipAway>
            </Stepped>
          </Sequence>
        );
      })}
      <AbsoluteFill style={{zIndex: 1000}}>
        <Stepped step={2}>
          <GrainOverlay />
        </Stepped>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
