import type React from 'react';
// Every face used by clippings. Imported once from index.ts.
import '@fontsource/anton';
import '@fontsource/archivo-black';
import '@fontsource/special-elite';
import '@fontsource/permanent-marker';
import '@fontsource/inter';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/abril-fatface';
import '@fontsource/bodoni-moda/900.css';
import '@fontsource/bodoni-moda/700-italic.css';
import '@fontsource/dm-serif-display';
import '@fontsource/old-standard-tt/700.css';
import '@fontsource/alfa-slab-one';
import '@fontsource/rye';
import '@fontsource/unifrakturcook/700.css';
import '@fontsource/oswald/700.css';
import '@fontsource/bebas-neue';
import '@fontsource/ultra';
import '@fontsource/fjalla-one';
import '@fontsource/staatliches';
import '@fontsource/libre-franklin/900.css';
import '@fontsource/libre-franklin/800-italic.css';
import '@fontsource/zilla-slab/700.css';
import '@fontsource/league-gothic';
import '@fontsource/libre-baskerville/700.css';
import '@fontsource/chivo/900.css';

export type Face = {family: string; weight?: number; italic?: boolean; scale?: number};

/** Headline faces a newspaper or magazine would plausibly have printed. `scale` evens out cap heights. */
export const CLIP_FACES: Face[] = [
  {family: 'Playfair Display', weight: 900},
  {family: 'Playfair Display', weight: 900, italic: true},
  {family: 'Abril Fatface'},
  {family: 'Bodoni Moda', weight: 900},
  {family: 'Bodoni Moda', weight: 700, italic: true},
  {family: 'DM Serif Display'},
  {family: 'Old Standard TT', weight: 700},
  {family: 'Alfa Slab One', scale: 0.9},
  {family: 'Rye', scale: 0.85},
  {family: 'UnifrakturCook', weight: 700, scale: 1.05},
  {family: 'Oswald', weight: 700, scale: 0.95},
  {family: 'Bebas Neue', scale: 1.15},
  {family: 'Anton', scale: 1.0},
  {family: 'Archivo Black', scale: 0.88},
  {family: 'Ultra', scale: 0.82},
  {family: 'Fjalla One', scale: 1.0},
  {family: 'Staatliches', scale: 1.1},
  {family: 'Libre Franklin', weight: 900, scale: 0.92},
  {family: 'Libre Franklin', weight: 800, italic: true, scale: 0.92},
  {family: 'Zilla Slab', weight: 700},
  {family: 'League Gothic', scale: 1.25},
  {family: 'Libre Baskerville', weight: 700, scale: 0.9},
  {family: 'Chivo', weight: 900, scale: 0.9},
];

export const faceCss = (f: Face): React.CSSProperties => ({
  fontFamily: `"${f.family}"`,
  fontWeight: f.weight ?? 400,
  fontStyle: f.italic ? 'italic' : 'normal',
});
