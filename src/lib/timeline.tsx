import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Stepped} from './stepped';
import {FPS, H, W} from './tokens';
import {toPolygon, tornRectPoints} from './torn';
import {GrainOverlay} from '../components/Paper';
import {RipAway} from '../components/Rip';
import {Board, StopMotion} from '../components/Collage';
import {InkDefs} from '../components/Clippings';

export type Beat = {
  id: string;
  seconds: number;
  /** Hold each drawing N frames at 24fps: 1=24fps, 2=12fps, 3=8fps, 4=6fps. */
  step: 1 | 2 | 3 | 4;
  /** How this beat hands over to the next. 'rip' tears it away; 'slide' pushes the next sheet over it. */
  exit?: 'rip' | 'slide' | 'cut';
  /** Paper from public/paper (newsprint, aged, kraft, blue, red, black, white, yellow). */
  paper?: string;
  render: React.FC;
};

export const RIP_FRAMES = 14;
export const SLIDE_FRAMES = 10;

export const beatsDuration = (beats: Beat[]) => beats.reduce((s, b) => s + Math.round(b.seconds * FPS), 0);

/** Incoming sheet slides over the previous beat, torn leading edge, on 2s. */
const SlideOver: React.FC<{duration: number; seed: string; children: React.ReactNode}> = ({duration, seed, children}) => {
  const frame = useCurrentFrame();
  if (frame >= duration) return <>{children}</>;
  const poses = [1.02, 0.62, 0.3, 0.1, -0.015, 0];
  const k = Math.min(poses.length - 1, Math.floor((frame / duration) * poses.length));
  const x = poses[k] * W;
  const edge = tornRectPoints(W + 60, H + 200, {left: true}, `${seed}-slide`, 22, 12).map(([a, b]) => [a - 30, b - 100] as [number, number]);
  return (
    <AbsoluteFill style={{transform: `translateX(${x}px)`, filter: 'drop-shadow(-18px 0 16px rgba(20,12,4,0.45))'}}>
      <AbsoluteFill style={{clipPath: toPolygon(edge)}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Lays beats end to end. 'rip' keeps the outgoing beat alive RIP_FRAMES past its end and tears it
 * off the top of the stack; 'slide' starts the next beat SLIDE_FRAMES early on top of it.
 */
export const Timeline: React.FC<{beats: Beat[]}> = ({beats}) => {
  let cursor = 0;
  let z = 500;
  const placed = beats.map((b, i) => {
    const dur = Math.round(b.seconds * FPS);
    const prev = beats[i - 1];
    const slidIn = prev?.exit === 'slide';
    const from = cursor - (slidIn ? SLIDE_FRAMES : 0);
    cursor += dur;
    if (i > 0) z += prev.exit === 'rip' || prev.exit === undefined ? -1 : 1;
    return {b, from, dur: dur + (slidIn ? SLIDE_FRAMES : 0), slidIn, z};
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#1a1612'}}>
      <InkDefs />
      <StopMotion>
        {placed.map(({b, from, dur, slidIn, z: zi}, i) => {
          const last = i === placed.length - 1;
          const rip = (b.exit ?? 'rip') === 'rip' && !last;
          const Scene = b.render;
          const body = (
            <AbsoluteFill style={{overflow: 'hidden'}}>
              <Board paper={b.paper ?? 'newsprint'} />
              <Scene />
            </AbsoluteFill>
          );
          return (
            <Sequence key={b.id} from={from} durationInFrames={dur + (rip ? RIP_FRAMES : 0)} style={{zIndex: zi}}>
              <Stepped step={b.step}>
                <RipAway start={rip ? dur : Infinity} duration={RIP_FRAMES} seed={b.id}>
                  {slidIn ? (
                    <SlideOver duration={SLIDE_FRAMES} seed={b.id}>
                      {body}
                    </SlideOver>
                  ) : (
                    body
                  )}
                </RipAway>
              </Stepped>
            </Sequence>
          );
        })}
      </StopMotion>
      <AbsoluteFill style={{zIndex: 1000}}>
        <Stepped step={2}>
          <GrainOverlay strength={0.12} />
        </Stepped>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
