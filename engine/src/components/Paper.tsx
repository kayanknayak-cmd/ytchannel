import React from 'react';
import {AbsoluteFill} from 'remotion';
import {color} from '../lib/tokens';
import {useDrawingIndex} from '../lib/stepped';

/** Full-frame paper backdrop: base tone + mottling + fibers. Static (paper doesn't boil). */
export const PaperBackground: React.FC<{tone?: string}> = ({tone = color.paper}) => (
  <AbsoluteFill style={{backgroundColor: tone}}>
    <svg width="100%" height="100%" style={{position: 'absolute'}}>
      <filter id="mottle">
        <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves={3} seed={3} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.28 0" />
      </filter>
      <filter id="fibers">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.35" numOctaves={2} seed={9} />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.6 0.9" />
      </filter>
      <rect width="100%" height="100%" filter="url(#mottle)" />
      <rect width="100%" height="100%" filter="url(#fibers)" opacity={0.35} />
    </svg>
  </AbsoluteFill>
);

/**
 * Grain + vignette on top of everything. Grain re-seeds once per drawing,
 * so it "boils" at the step rate instead of every frame (a big part of the handmade feel).
 */
export const GrainOverlay: React.FC<{strength?: number}> = ({strength = 0.22}) => {
  const d = useDrawingIndex();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', mixBlendMode: 'multiply'}}>
        <filter id={`grain-${d}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={d % 97} />
          <feColorMatrix values={`0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 ${strength * 2.2} -${strength}`} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${d})`} />
      </svg>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,25,5,0.32) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Halftone dot screen, for printing an image "on newsprint". Place over an image with multiply. */
export const Halftone: React.FC<{size?: number; opacity?: number}> = ({size = 7, opacity = 0.35}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(circle, rgba(0,0,0,${opacity}) ${size * 0.22}px, transparent ${size * 0.3}px)`,
      backgroundSize: `${size}px ${size}px`,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
    }}
  />
);
