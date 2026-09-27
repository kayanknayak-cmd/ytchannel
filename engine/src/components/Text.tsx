import React from 'react';
import {random} from 'remotion';
import {useSteppedFrame, useStep} from '../lib/stepped';
import {color, font} from '../lib/tokens';
import {TornSheet} from './TornSheet';

// Frame-by-frame keyframe lists: one entry per drawing. Stepped animation
// reads better as explicit poses than as eased curves.
const pose = <T,>(poses: T[], localDrawing: number) =>
  poses[Math.min(Math.max(localDrawing, 0), poses.length - 1)];

const useLocal = (at: number) => {
  const f = useSteppedFrame();
  const step = useStep();
  return {visible: f >= at, drawing: Math.floor((f - at) / step)};
};

/** Headline slammed onto a torn paper strip. Overshoot pose sequence: big, squash, settle. */
export const SlamStrip: React.FC<{
  text: string;
  at?: number;
  size?: number;
  fill?: string;
  ink?: string;
  rotate?: number;
  width?: number;
  seed?: string;
}> = ({text, at = 0, size = 150, fill = color.fiber, ink = color.ink, rotate = -2, width = 920, seed = text}) => {
  const {visible, drawing} = useLocal(at);
  if (!visible) return null;
  const s = pose([1.35, 0.94, 1.02, 1], drawing);
  const height = size * 1.35;
  return (
    <div style={{position: 'relative', width, height, transform: `rotate(${rotate}deg) scale(${s})`}}>
      <TornSheet width={width} height={height} seed={seed} fill={fill} amp={10} sides={{left: true, right: true, top: true, bottom: true}}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: font.headline,
            fontSize: size,
            color: ink,
            letterSpacing: 1,
            textTransform: 'uppercase',
            lineHeight: 1,
            paddingTop: size * 0.06,
          }}
        >
          {text}
        </div>
      </TornSheet>
    </div>
  );
};

/** Rubber stamp: slams in rotated, ink is patchy. */
export const Stamp: React.FC<{text: string; at?: number; size?: number; ink?: string; rotate?: number}> = ({
  text,
  at = 0,
  size = 110,
  ink = color.red,
  rotate = -12,
}) => {
  const {visible, drawing} = useLocal(at);
  if (!visible) return null;
  const s = pose([2.2, 0.9, 1], drawing);
  const o = pose([0.4, 1, 0.92], drawing);
  const wear = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="${text.length}"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.9"/></filter><rect width="100%" height="100%" filter="url(#f)"/></svg>`,
  );
  return (
    <div
      style={{
        display: 'inline-block',
        transform: `rotate(${rotate}deg) scale(${s})`,
        opacity: o,
        border: `${size * 0.09}px solid ${ink}`,
        borderRadius: size * 0.12,
        padding: `${size * 0.05}px ${size * 0.25}px 0`,
        fontFamily: font.headline,
        fontSize: size,
        lineHeight: 1.1,
        color: ink,
        textTransform: 'uppercase',
        mixBlendMode: 'multiply',
        WebkitMaskImage: `url("data:image/svg+xml,${wear}")`,
        WebkitMaskSize: 'cover',
      }}
    >
      {text}
    </div>
  );
};

/** Typewriter: N characters per drawing. */
export const Typewriter: React.FC<{
  text: string;
  at?: number;
  cps?: number; // characters per drawing
  size?: number;
  style?: React.CSSProperties;
}> = ({text, at = 0, cps = 2, size = 56, style}) => {
  const {visible, drawing} = useLocal(at);
  if (!visible) return null;
  const n = Math.min(text.length, (drawing + 1) * cps);
  return (
    <div style={{fontFamily: font.type, fontSize: size, color: color.ink, lineHeight: 1.35, whiteSpace: 'pre-wrap', ...style}}>
      {text.slice(0, n)}
      <span style={{opacity: n < text.length ? 1 : 0}}>▌</span>
    </div>
  );
};

const RANSOM_FACES = [
  {bg: color.fiber, fg: color.ink, f: font.headline},
  {bg: color.ink, fg: color.fiber, f: font.heavy},
  {bg: color.yellow, fg: color.ink, f: font.type},
  {bg: color.red, fg: color.fiber, f: font.headline},
  {bg: '#cfe0f5', fg: color.blue, f: font.heavy},
  {bg: color.kraft, fg: color.ink, f: font.hand},
];

/** Ransom-note letters, one new scrap per drawing. Spaces become gaps. */
export const Ransom: React.FC<{text: string; at?: number; size?: number; perDrawing?: number}> = ({
  text,
  at = 0,
  size = 120,
  perDrawing = 1,
}) => {
  const {visible, drawing} = useLocal(at);
  if (!visible) return null;
  const shown = (drawing + 1) * perDrawing;
  let letterIdx = 0;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: size * 0.08, maxWidth: 980}}>
      {text.split(' ').map((word, wi) => (
        <div key={wi} style={{display: 'flex', gap: size * 0.05, marginRight: size * 0.2}}>
          {word.split('').map((ch, ci) => {
            const i = letterIdx++;
            if (i >= shown) return <div key={ci} style={{width: size * 0.7}} />;
            const face = RANSOM_FACES[Math.floor(random(`rf-${text}-${i}`) * RANSOM_FACES.length)];
            const rot = (random(`rr-${text}-${i}`) - 0.5) * 14;
            const sz = size * (0.85 + random(`rs-${text}-${i}`) * 0.3);
            const just = i === shown - 1 ? 1.25 : 1;
            return (
              <div
                key={ci}
                style={{
                  background: face.bg,
                  color: face.fg,
                  fontFamily: face.f,
                  fontSize: sz,
                  lineHeight: 1.05,
                  padding: `${sz * 0.06}px ${sz * 0.1}px 0`,
                  transform: `rotate(${rot}deg) scale(${just})`,
                  boxShadow: `3px 6px 4px ${color.shadow}`,
                  textTransform: 'uppercase',
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Marker highlight that swipes in behind its children over a few drawings. */
export const Highlight: React.FC<{at?: number; drawings?: number; tint?: string; children: React.ReactNode}> = ({
  at = 0,
  drawings = 3,
  tint = color.yellow,
  children,
}) => {
  const {visible, drawing} = useLocal(at);
  const p = visible ? Math.min(1, (drawing + 1) / drawings) : 0;
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span
        style={{
          position: 'absolute',
          left: '-4%',
          top: '18%',
          height: '70%',
          width: `${108 * p}%`,
          background: tint,
          opacity: 0.85,
          transform: 'rotate(-1.5deg) skewX(-8deg)',
          borderRadius: '6px 18px 8px 14px',
          mixBlendMode: 'multiply',
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};
