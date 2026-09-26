import React from 'react';
import {Img, random} from 'remotion';
import {useDrawingIndex} from '../lib/stepped';

type Props = {
  src?: string; // transparent PNG (archival cutout) or omit and pass children (SVG)
  width: number;
  x: number;
  y: number;
  rotate?: number;
  /** Stop-motion wobble per drawing, in px / deg. 0 disables. */
  jitter?: number;
  seed?: string;
  border?: number;
  children?: React.ReactNode;
};

/**
 * Sticker-style cutout: white paper border traced around the alpha + hard drop shadow,
 * re-positioned by a tiny random amount each drawing like it was nudged by hand.
 */
export const Cutout: React.FC<Props> = ({
  src,
  width,
  x,
  y,
  rotate = 0,
  jitter = 1,
  seed = 'cut',
  border = 6,
  children,
}) => {
  const d = useDrawingIndex();
  const jx = (random(`${seed}-x-${d}`) - 0.5) * 4 * jitter;
  const jy = (random(`${seed}-y-${d}`) - 0.5) * 4 * jitter;
  const jr = (random(`${seed}-r-${d}`) - 0.5) * 1.6 * jitter;
  const b = border;
  const outline = [
    `drop-shadow(${b}px 0 0 #fff)`,
    `drop-shadow(-${b}px 0 0 #fff)`,
    `drop-shadow(0 ${b}px 0 #fff)`,
    `drop-shadow(0 -${b}px 0 #fff)`,
    'drop-shadow(8px 14px 6px rgba(20,14,6,0.4))',
  ].join(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        transform: `translate(-50%, -50%) translate(${jx}px, ${jy}px) rotate(${rotate + jr}deg)`,
        filter: outline,
      }}
    >
      {src ? <Img src={src} style={{width: '100%', display: 'block'}} /> : children}
    </div>
  );
};
