import {random} from 'remotion';

// Jagged edge = slow wander (big irregular bites) + fast teeth (fibers).
const edgeOffsets = (n: number, seed: string, amp: number) => {
  const out: number[] = [];
  let wander = 0;
  for (let i = 0; i < n; i++) {
    wander += (random(`${seed}-w-${i}`) - 0.5) * amp * 0.5;
    wander *= 0.86;
    const tooth = (random(`${seed}-t-${i}`) - 0.5) * amp * 0.55;
    out.push(wander + tooth);
  }
  return out;
};

export type Sides = {top?: boolean; right?: boolean; bottom?: boolean; left?: boolean};

/** Points (clockwise) for a rectangle whose chosen sides are torn. Coords in px. */
export const tornRectPoints = (
  w: number,
  h: number,
  sides: Sides,
  seed: string,
  amp = 14,
  spacing = 9,
): [number, number][] => {
  const pts: [number, number][] = [];
  const edge = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    torn: boolean | undefined,
    key: string,
  ) => {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = torn ? Math.max(2, Math.round(len / spacing)) : 1;
    const offs = torn ? edgeOffsets(n, `${seed}-${key}`, amp) : [];
    // inward normal for a clockwise rect
    const nx = -(y1 - y0) / len;
    const ny = (x1 - x0) / len;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const o = torn ? Math.abs(offs[i]) : 0;
      pts.push([x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o]);
    }
  };
  edge(0, 0, w, 0, sides.top, 'top');
  edge(w, 0, w, h, sides.right, 'right');
  edge(w, h, 0, h, sides.bottom, 'bottom');
  edge(0, h, 0, 0, sides.left, 'left');
  return pts;
};

/** A torn horizontal line across width w at height y. Returns points left->right. */
export const tornLine = (w: number, y: number, seed: string, amp = 26, spacing = 10) => {
  const n = Math.round(w / spacing) + 1;
  const offs = edgeOffsets(n, seed, amp);
  return offs.map((o, i) => [(i / (n - 1)) * w, y + o] as [number, number]);
};

export const toPolygon = (pts: [number, number][]) =>
  `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;

export const toPath = (pts: [number, number][], close = true) =>
  `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}${close ? 'Z' : ''}`;
