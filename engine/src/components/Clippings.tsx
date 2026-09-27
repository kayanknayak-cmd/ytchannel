import React from 'react';
import {random, staticFile} from 'remotion';
import {CLIP_FACES, Face, faceCss} from '../lib/fonts';
import {useSteppedFrame, useStep} from '../lib/stepped';

// Newspaper / magazine clippings. Each letter (or word) is its own scrap of real-looking
// paper: own face, own stock, scissor-cut outline, rough ink, and cropped bits of the
// surrounding page peeking in at the edges.

type Stock = {paper: string; ink: string; body?: string; halftone?: boolean};

export const STOCKS: Record<string, Stock> = {
  news: {paper: 'newsprint', ink: '#1c1a17', body: '#3b3833'},
  aged: {paper: 'aged', ink: '#2a1f14', body: '#5a4a35'},
  white: {paper: 'white', ink: '#16140f', body: '#4a4640'},
  whiteRed: {paper: 'white', ink: '#c8321f', body: '#4a4640'},
  whiteBlue: {paper: 'white', ink: '#1f3f78', body: '#4a4640'},
  black: {paper: 'black', ink: '#f2ede0', halftone: true},
  red: {paper: 'red', ink: '#f7f1e3', halftone: true},
  blue: {paper: 'blue', ink: '#f7f1e3', halftone: true},
  yellow: {paper: 'yellow', ink: '#1c1a17', halftone: true},
  kraft: {paper: 'kraft', ink: '#1c1a17'},
};
const STOCK_WEIGHTS: [keyof typeof STOCKS, number][] = [
  ['news', 5], ['aged', 3], ['white', 3], ['whiteRed', 1.2], ['whiteBlue', 0.8],
  ['black', 2], ['red', 1.4], ['blue', 0.8], ['yellow', 1.2], ['kraft', 1],
];

const pick = <T,>(seed: string, arr: [T, number][]) => {
  const total = arr.reduce((s, [, w]) => s + w, 0);
  let x = random(seed) * total;
  for (const [v, w] of arr) {
    if ((x -= w) < 0) return v;
  }
  return arr[arr.length - 1][0];
};

// Fragments of "surrounding copy": tiny and cropped, never meant to be read.
const BODY = [
  'the committee said on', 'prices rose sharply in', 'according to officials', 'continued on page 4',
  'reported late Tuesday', 'in the first quarter', 'a spokesman declined', 'of the new plant',
  'market closed higher', 'by our correspondent', 'SPECIAL TO THE', 'is expected to reach',
];

/**
 * Scissor cut: 5-8 straight snips around the box, never a clean rectangle.
 * Offsets are px from each edge (calc), so wide word scraps and square letter scraps cut alike.
 */
const scissorClip = (seed: string, pad: number[]) => {
  const j = (k: string) => random(`${seed}-${k}`);
  const [t, r, b, l] = pad;
  const X = (fromLeft: boolean, px: number) => (fromLeft ? `${px.toFixed(1)}px` : `calc(100% - ${px.toFixed(1)}px)`);
  const Y = (fromTop: boolean, px: number) => (fromTop ? `${px.toFixed(1)}px` : `calc(100% - ${px.toFixed(1)}px)`);
  const mid = (k: string) => `${(35 + j(k) * 30).toFixed(1)}%`;
  const pts: [string, string][] = [
    [X(true, j('a') * l * 0.7), Y(true, j('b') * t * 0.7)],
    [mid('c'), Y(true, j('d') * t * 0.5)],
    [X(false, j('e') * r * 0.7), Y(true, j('f') * t * 0.8)],
    [X(false, j('g') * r * 0.5), mid('h')],
    [X(false, j('i') * r * 0.7), Y(false, j('k') * b * 0.7)],
    [mid('l'), Y(false, j('m') * b * 0.5)],
    [X(true, j('n') * l * 0.7), Y(false, j('o') * b * 0.8)],
    [X(true, j('p') * l * 0.5), mid('q')],
  ];
  const keep = pts.filter((_, i) => i % 2 === 0 || random(`${seed}-keep-${i}`) > 0.35);
  return `polygon(${keep.map(([x, y]) => `${x} ${y}`).join(',')})`;
};

type ClipProps = {
  text: string;
  size: number;
  seed: string;
  face?: Face;
  stock?: keyof typeof STOCKS;
  rotate?: number;
  /** Visual pose: 1 = resting, >1 = still in the air (bigger, bigger shadow). */
  lift?: number;
  fragments?: boolean;
};

/** One scrap of paper carrying a letter or word. */
export const Clip: React.FC<ClipProps> = ({text, size, seed, face, stock, rotate = 0, lift = 1, fragments = true}) => {
  const pool = CLIP_FACES.filter((c) => c.family !== 'UnifrakturCook'); // blackletter hurts legibility
  const f = face ?? pool[Math.floor(random(`${seed}-face`) * pool.length)];
  const s = STOCKS[stock ?? pick(`${seed}-stock`, STOCK_WEIGHTS)];
  const fs = size * (f.scale ?? 1);
  const pad = [0, 1, 2, 3].map((i) => 8 + random(`${seed}-pad-${i}`) * 16);
  const bgx = Math.floor(random(`${seed}-bx`) * 900);
  const bgy = Math.floor(random(`${seed}-by`) * 1700);
  const showFrag = fragments && !!s.body && random(`${seed}-frag`) > 0.45;
  const fragTop = random(`${seed}-ft`) > 0.5;
  const lifted = lift - 1;
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        transform: `rotate(${rotate}deg) scale(${lift})`,
        filter: `drop-shadow(${2 + lifted * 30}px ${3 + lifted * 50}px ${1.5 + lifted * 30}px rgba(20,12,4,${0.45 - lifted * 0.4}))`,
      }}
    >
      <div
        style={{
          position: 'relative',
          clipPath: scissorClip(seed, pad),
          background: `url(${staticFile(`paper/${s.paper}.jpg`)}) -${bgx}px -${bgy}px`,
          padding: `${pad[0] + fs * 0.06}px ${pad[1] + fs * 0.1}px ${pad[2]}px ${pad[3] + fs * 0.1}px`,
          lineHeight: 1,
          overflow: 'hidden',
        }}
      >
        {showFrag && (
          <div
            style={{
              position: 'absolute',
              left: -10,
              right: -10,
              [fragTop ? 'top' : 'bottom']: -fs * 0.03,
              fontFamily: '"Libre Baskerville", serif',
              fontSize: Math.max(9, fs * 0.075),
              color: s.body,
              whiteSpace: 'nowrap',
              opacity: 0.8,
              filter: 'url(#ink)',
            }}
          >
            {BODY[Math.floor(random(`${seed}-fb`) * BODY.length)]} {BODY[Math.floor(random(`${seed}-fc`) * BODY.length)]}
          </div>
        )}
        {s.halftone && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.22) 0.9px, transparent 1.4px)',
              backgroundSize: '4px 4px',
              mixBlendMode: 'multiply',
            }}
          />
        )}
        <span
          style={{
            ...faceCss(f),
            position: 'relative',
            fontSize: fs,
            color: s.ink,
            display: 'block',
            filter: 'url(#ink)',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/** SVG defs shared by all clippings: ink that bleeds and wears. Mount once per composition. */
export const InkDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={4} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves={2} seed={8} result="wear" />
      <feColorMatrix in="wear" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 16.8" result="wearA" />
      <feComposite in="d" in2="wearA" operator="in" />
    </filter>
  </svg>
);

type HeadlineProps = {
  text: string;
  size?: number;
  /** 'letters': one scrap per letter (hooks, key words). 'words': one scrap per word (longer lines). */
  mode?: 'letters' | 'words';
  at?: number;
  /** Scraps placed per drawing. */
  rate?: number;
  maxWidth?: number;
  seed?: string;
  /** Force a stock for specific words, e.g. {"5¢": "red"}. */
  stocks?: Record<string, keyof typeof STOCKS>;
  align?: 'center' | 'flex-start';
};

/** Headline assembled from clippings, slapped down one scrap at a time (lift 1.35 -> 0.97 -> 1). */
export const Headline: React.FC<HeadlineProps> = ({
  text,
  size = 120,
  mode = 'letters',
  at = 0,
  rate = 1,
  maxWidth = 980,
  seed = text,
  stocks = {},
  align = 'center',
}) => {
  const f = useSteppedFrame();
  const step = useStep();
  const drawing = Math.floor((f - at) / step);
  const words = text.split(' ');
  const longest = Math.max(...words.map((w) => w.length));
  const est = mode === 'letters' ? longest * size * 0.82 : 0;
  if (est > maxWidth) size = size * (maxWidth / est);
  let idx = 0;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align, alignItems: 'center', rowGap: size * 0.12, columnGap: size * 0.28, maxWidth}}>
      {words.map((w, wi) => {
        const units = mode === 'letters' ? w.split('') : [w];
        const forced = stocks[w];
        return (
          <div key={wi} style={{display: 'flex', alignItems: 'center', gap: mode === 'letters' ? size * 0.02 : 0}}>
            {units.map((u, ui) => {
              const i = idx++;
              const k = `${seed}-${wi}-${ui}`;
              const age = drawing - Math.floor(i / rate);
              const lift = age < 0 ? 0 : [1.35, 0.97, 1][Math.min(age, 2)];
              const sz = mode === 'letters' ? size * (0.86 + random(`${k}-sz`) * 0.3) : size;
              return (
                <div
                  key={ui}
                  style={{
                    visibility: age < 0 ? 'hidden' : 'visible',
                    transform: `translateY(${(random(`${k}-by`) - 0.5) * size * 0.14}px)`,
                    marginLeft: mode === 'letters' ? -size * 0.05 : 0,
                  }}
                >
                  <Clip
                    text={mode === 'letters' && random(`${k}-lc`) > 0.8 && !'ILJ1O0'.includes(u.toUpperCase()) ? u.toLowerCase() : u.toUpperCase()}
                    size={sz}
                    seed={k}
                    stock={forced}
                    rotate={(random(`${k}-rot`) - 0.5) * (mode === 'letters' ? 14 : 5)}
                    lift={lift || 1}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
