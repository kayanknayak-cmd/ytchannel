import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {useStep, useSteppedFrame, useDrawingIndex} from '../lib/stepped';
import {H, W, font} from '../lib/tokens';
import {toPolygon, tornRectPoints} from '../lib/torn';

// ---------- camera ----------

export type CamKey = {at: number; x: number; y: number; zoom?: number; rot?: number};
type Cam = {x: number; y: number; zoom: number; rot: number};
const CamCtx = createContext<Cam>({x: W / 2, y: H / 2, zoom: 1, rot: 0});

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Rostrum camera over the collage. Keyframes are in board px (x,y = point at frame centre).
 * Moves are eased but sampled on the scene's step, so they tick like a hand-cranked rig.
 */
export const Camera: React.FC<{keys: CamKey[]; children: React.ReactNode}> = ({keys, children}) => {
  const f = useSteppedFrame();
  let cam: Cam = {x: keys[0].x, y: keys[0].y, zoom: keys[0].zoom ?? 1, rot: keys[0].rot ?? 0};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f >= a.at) {
      const t = ease(Math.min(1, (f - a.at) / Math.max(1, b.at - a.at)));
      const az = a.zoom ?? 1;
      const bz = b.zoom ?? az;
      const ar = a.rot ?? 0;
      const br = b.rot ?? ar;
      cam = {x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, zoom: az * Math.pow(bz / az, t), rot: ar + (br - ar) * t};
    }
  }
  return (
    <CamCtx.Provider value={cam}>
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${W / 2}px, ${H / 2}px) rotate(${cam.rot}deg) scale(${cam.zoom}) translate(${-cam.x}px, ${-cam.y}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </CamCtx.Provider>
  );
};

// ---------- items ----------

export type Enter = 'none' | 'drop' | 'slap' | 'slideL' | 'slideR' | 'slideU' | 'slideD' | 'pop';

// One pose per drawing. [dx, dy] as fractions of travel, lift (1 = resting), extra rotation.
const POSES: Record<Exclude<Enter, 'none'>, {off: number; lift: number; rot: number; scale?: number}[]> = {
  drop: [
    {off: 0, lift: 1.28, rot: 6},
    {off: 0, lift: 1.12, rot: 2},
    {off: 0, lift: 0.985, rot: -0.6},
    {off: 0, lift: 1, rot: 0},
  ],
  slap: [
    {off: 0, lift: 1.45, rot: -5},
    {off: 0, lift: 0.96, rot: 1},
    {off: 0, lift: 1, rot: 0},
  ],
  slideL: [
    {off: 1, lift: 1.06, rot: -7},
    {off: 0.42, lift: 1.06, rot: -3},
    {off: 0.1, lift: 1.04, rot: -1},
    {off: -0.025, lift: 1.01, rot: 0.4},
    {off: 0, lift: 1, rot: 0},
  ],
  slideR: [],
  slideU: [],
  slideD: [],
  pop: [
    {off: 0, lift: 1, rot: 0, scale: 0.2},
    {off: 0, lift: 1.1, rot: 3, scale: 1.12},
    {off: 0, lift: 1.02, rot: -1, scale: 0.96},
    {off: 0, lift: 1, rot: 0, scale: 1},
  ],
};
POSES.slideR = POSES.slideL;
POSES.slideU = POSES.slideL;
POSES.slideD = POSES.slideL;

const DIR: Record<string, [number, number]> = {slideL: [-1, 0], slideR: [1, 0], slideU: [0, -1], slideD: [0, 1]};

type ItemProps = {
  x: number;
  y: number;
  /** Width of the item in board px. Height follows content. */
  w?: number;
  rotate?: number;
  at?: number;
  enter?: Enter;
  /** Frame to leave, and how (reverse slide). */
  exitAt?: number;
  exit?: 'slideL' | 'slideR' | 'slideU' | 'slideD' | 'lift';
  /** Parallax depth: 0 = board, 0.2 = floats a little above (moves more with camera). */
  z?: number;
  /** Stop-motion nudge per drawing in px. */
  jitter?: number;
  shadow?: boolean;
  seed?: string;
  children: React.ReactNode;
};

/** A physical piece on the collage board: enters with a pose sequence, casts a lift-dependent shadow, boils. */
export const Item: React.FC<ItemProps> = ({
  x, y, w, rotate = 0, at = 0, enter = 'drop', exitAt, exit = 'slideU', z = 0, jitter = 1.4, shadow = true, seed = `${x}-${y}`, children,
}) => {
  const f = useSteppedFrame();
  const step = useStep();
  const d = useDrawingIndex();
  const cam = useContext(CamCtx);
  if (f < at) return null;

  let pose: {off: number; lift: number; rot: number; scale?: number} = {off: 0, lift: 1, rot: 0};
  let dir: [number, number] = [0, 0];
  if (enter !== 'none') {
    const seq = POSES[enter];
    const k = Math.floor((f - at) / step);
    pose = {...seq[Math.min(k, seq.length - 1)]};
    dir = DIR[enter] ?? [0, 0];
  }
  if (exitAt !== undefined && f >= exitAt) {
    const seq = POSES.slideL;
    const k = Math.floor((f - exitAt) / step);
    if (k >= seq.length) return null;
    pose = {...seq[seq.length - 1 - k]};
    dir = exit === 'lift' ? [0, 0] : DIR[exit];
    if (exit === 'lift') pose.lift = 1 + k * 0.12;
  }
  const travel = 1500;
  const jx = (random(`${seed}-jx-${d}`) - 0.5) * 2 * jitter;
  const jy = (random(`${seed}-jy-${d}`) - 0.5) * 2 * jitter;
  const jr = (random(`${seed}-jr-${d}`) - 0.5) * 0.5 * (jitter > 0 ? 1 : 0);
  const px = -(cam.x - W / 2) * z;
  const py = -(cam.y - H / 2) * z;
  const lifted = pose.lift - 1;
  const sc = (pose.scale ?? 1) * pose.lift;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        transform: `translate(-50%, -50%) translate(${dir[0] * pose.off * travel + jx + px}px, ${dir[1] * pose.off * travel + jy + py}px) rotate(${rotate + pose.rot + jr}deg) scale(${sc})`,
        filter: shadow
          ? `drop-shadow(${4 + lifted * 40}px ${8 + lifted * 70}px ${5 + lifted * 40}px rgba(20,12,4,${Math.max(0.12, 0.42 - lifted * 0.5)}))`
          : undefined,
      }}
    >
      {children}
    </div>
  );
};

/** A treated photo from public/. */
export const Photo: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={staticFile(src)} style={{width: '100%', display: 'block', ...style}} />
);

/** Full-bleed paper backdrop from public/paper. Oversized so camera moves never show an edge. */
export const Board: React.FC<{paper: string; w?: number; h?: number; x?: number; y?: number}> = ({paper, w = W * 2.2, h = H * 1.8, x = -W * 0.6, y = -H * 0.4}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, backgroundImage: `url(${staticFile(`paper/${paper}.jpg`)})`, backgroundSize: `${W}px ${H}px`}} />
);

// ---------- tape ----------

/** Masking tape strip with torn (zig-zag) ends. Place over photo corners. */
export const Tape: React.FC<{x: number; y: number; len?: number; width?: number; rotate?: number; at?: number; seed?: string; tint?: string}> = ({
  x, y, len = 190, width = 56, rotate = -35, at = 0, seed = `${x}${y}`, tint = 'rgba(236, 226, 196, 0.82)',
}) => {
  const f = useSteppedFrame();
  if (f < at) return null;
  const teeth = 7;
  const end = (side: 0 | 1) =>
    Array.from({length: teeth + 1}, (_, i) => {
      const yy = (i / teeth) * 100;
      const depth = 2 + random(`${seed}-${side}-${i}`) * 5;
      return side === 0 ? `${depth}% ${yy}%` : `${100 - depth}% ${100 - yy}%`;
    });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: len,
        height: width,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        clipPath: `polygon(${[...end(0), ...end(1)].join(',')})`,
        background: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.05)), ${tint}`,
        boxShadow: 'inset 0 0 6px rgba(120,100,60,0.25)',
        mixBlendMode: 'multiply',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))',
      }}
    >
      <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('paper/white.jpg')})`, opacity: 0.35, mixBlendMode: 'multiply'}} />
    </div>
  );
};

// ---------- marker annotations ----------

const wobble = (seed: string, i: number, amt: number) => (random(`${seed}-${i}`) - 0.5) * amt;

/** Progress 0..1 of a draw-on that takes `drawings` drawings. */
const useDraw = (at: number, drawings: number) => {
  const f = useSteppedFrame();
  const step = useStep();
  if (f < at) return 0;
  return Math.min(1, (Math.floor((f - at) / step) + 1) / drawings);
};

const Stroke: React.FC<{d: string; p: number; color: string; width: number}> = ({d, p, color, width}) => (
  <g>
    <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={0.88} />
    <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill="none" stroke={color} strokeWidth={width * 0.45} strokeLinecap="round" opacity={0.5} transform="translate(2 -1.5)" />
  </g>
);

/** Hand-drawn loop around something: overshoots its start like a real marker circle. */
export const MarkerCircle: React.FC<{x: number; y: number; rx: number; ry: number; at?: number; drawings?: number; color?: string; width?: number; seed?: string}> = ({
  x, y, rx, ry, at = 0, drawings = 4, color = '#d7382b', width = 12, seed = 'circle',
}) => {
  const p = useDraw(at, drawings);
  if (p === 0) return null;
  const n = 48;
  const start = -2.2 + wobble(seed, 99, 0.6);
  const pts = Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const a = start + t * Math.PI * 2 * 1.13;
    const grow = 1 + t * 0.07; // spirals out slightly so the ends don't meet
    return [x + Math.cos(a) * rx * grow + wobble(seed, i, rx * 0.04), y + Math.sin(a) * ry * grow + wobble(seed, i + 50, ry * 0.04)];
  });
  const d = `M${pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join('L')}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <Stroke d={d} p={p} color={color} width={width} />
    </svg>
  );
};

/** Curved hand-drawn arrow from (x1,y1) to (x2,y2). Head draws after the shaft. */
export const MarkerArrow: React.FC<{x1: number; y1: number; x2: number; y2: number; bend?: number; at?: number; drawings?: number; color?: string; width?: number}> = ({
  x1, y1, x2, y2, bend = 0.25, at = 0, drawings = 4, color = '#d7382b', width = 11,
}) => {
  const p = useDraw(at, drawings);
  if (p === 0) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const shaft = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const L = 46;
  const hx = (da: number) => x2 - Math.cos(ang + da) * L;
  const hy = (da: number) => y2 - Math.sin(ang + da) * L;
  const head = `M${hx(0.55)},${hy(0.55)} L${x2},${y2} L${hx(-0.5)},${hy(-0.5)}`;
  const ps = Math.min(1, p / 0.7);
  const ph = Math.max(0, (p - 0.7) / 0.3);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <Stroke d={shaft} p={ps} color={color} width={width} />
      {ph > 0 && <Stroke d={head} p={ph} color={color} width={width} />}
    </svg>
  );
};

/** Quick double-stroke underline. */
export const MarkerUnderline: React.FC<{x: number; y: number; w: number; at?: number; drawings?: number; color?: string; width?: number; seed?: string}> = ({
  x, y, w, at = 0, drawings = 3, color = '#d7382b', width = 10, seed = 'ul',
}) => {
  const p = useDraw(at, drawings);
  if (p === 0) return null;
  const d = `M${x},${y + wobble(seed, 1, 6)} Q${x + w * 0.5},${y + 10 + wobble(seed, 2, 8)} ${x + w},${y - 4 + wobble(seed, 3, 6)} L${x + w * 0.1},${y + 18 + wobble(seed, 4, 6)}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <Stroke d={d} p={p} color={color} width={width} />
    </svg>
  );
};

/** Handwritten note in marker. */
export const Scrawl: React.FC<{x: number; y: number; text: string; size?: number; at?: number; rotate?: number; color?: string}> = ({
  x, y, text, size = 64, at = 0, rotate = -4, color = '#d7382b',
}) => {
  const p = useDraw(at, Math.max(2, Math.ceil(text.length / 3)));
  if (p === 0) return null;
  const n = Math.ceil(text.length * p);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg)`, fontFamily: font.hand, fontSize: size, color, whiteSpace: 'nowrap', opacity: 0.95, textShadow: '0 0 1px rgba(0,0,0,0.25)'}}>
      {text.slice(0, n)}
    </div>
  );
};

// ---------- global stop-motion feel ----------

/** Whole-frame nudge + exposure flicker per drawing, like frames shot one by one on a copy stand. */
export const StopMotion: React.FC<{children: React.ReactNode; step?: number}> = ({children, step = 2}) => {
  const frame = useCurrentFrame();
  const d = Math.floor(frame / step);
  const dx = (random(`sm-x-${d}`) - 0.5) * 3;
  const dy = (random(`sm-y-${d}`) - 0.5) * 3;
  const b = 1 + (random(`sm-b-${d}`) - 0.5) * 0.035;
  return <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(1.004)`, filter: `brightness(${b})`}}>{children}</AbsoluteFill>;
};

// ---------- newspaper decor ----------

const COPY = [
  'The measure passed late on Tuesday after a long debate in which members of both parties raised objections to the cost',
  'Officials said the figures, released yesterday, showed the sharpest rise in more than a decade and were likely to be revised',
  'In a statement the company said it would continue to review its prices in light of rising costs for raw materials and freight',
  'Economists cautioned that the numbers reflect only the first quarter and that seasonal factors may have played a part',
  'The plant, which employs several hundred workers, is expected to reach full production by the end of the year officials said',
];

/** Torn piece of a newspaper page: headline rule + justified body columns. Pure texture, not meant to be read. */
export const NewsScrap: React.FC<{width: number; height: number; seed: string; cols?: number; paper?: string; headline?: string}> = ({
  width, height, seed, cols = 3, paper = 'newsprint', headline,
}) => {
  const para = (i: number) => COPY[Math.floor(random(`${seed}-p${i}`) * COPY.length)];
  const body = Array.from({length: 14}, (_, i) => para(i)).join('. ');
  return (
    <TornPaper width={width} height={height} seed={seed} paper={paper}>
      <div style={{padding: '34px 30px', height: '100%', boxSizing: 'border-box'}}>
        {headline && (
          <div style={{fontFamily: '"Old Standard TT"', fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: '#23201b', borderBottom: '2px solid #2a2620', paddingBottom: 10, marginBottom: 12, filter: 'url(#ink)'}}>
            {headline}
          </div>
        )}
        <div style={{columnCount: cols, columnGap: 18, columnRule: '1px solid rgba(40,36,30,0.5)', fontFamily: '"Libre Baskerville", serif', fontSize: 15, lineHeight: 1.35, color: '#2b2822', textAlign: 'justify', filter: 'url(#ink)', opacity: 0.85}}>
          {body}
        </div>
      </div>
    </TornPaper>
  );
};

/** Torn sheet cut from one of the paper textures (fiber rim + real paper face). */
export const TornPaper: React.FC<{width: number; height: number; seed: string; paper?: string; children?: React.ReactNode}> = ({
  width, height, seed, paper = 'newsprint', children,
}) => {
  const core = tornRectPoints(width, height, {top: true, right: true, bottom: true, left: true}, `${seed}-c`, 16, 8);
  const face = tornRectPoints(width - 12, height - 12, {top: true, right: true, bottom: true, left: true}, `${seed}-f`, 14, 8).map(
    ([a, b]) => [a + 6, b + 6] as [number, number],
  );
  const ox = Math.floor(random(`${seed}-ox`) * 600);
  const oy = Math.floor(random(`${seed}-oy`) * 1200);
  return (
    <div style={{position: 'relative', width, height}}>
      <div style={{position: 'absolute', inset: 0, background: '#fbf8f1', clipPath: toPolygon(core)}} />
      <div style={{position: 'absolute', inset: 0, clipPath: toPolygon(face), background: `url(${staticFile(`paper/${paper}.jpg`)}) -${ox}px -${oy}px`, overflow: 'hidden'}}>
        {children}
      </div>
    </div>
  );
};
