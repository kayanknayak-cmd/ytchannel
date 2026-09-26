import React from 'react';
import {Sides, toPolygon, tornRectPoints} from '../lib/torn';
import {color} from '../lib/tokens';

type Props = {
  width: number;
  height: number;
  sides?: Sides;
  seed: string;
  fill?: string;
  /** Width of the exposed white fiber band along torn edges. */
  fiber?: number;
  amp?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * A piece of paper with torn edges. Two layers: a white fiber core that pokes out,
 * then the colored face torn a little further in. That white rim is what sells "ripped".
 */
export const TornSheet: React.FC<Props> = ({
  width,
  height,
  sides = {top: true, right: true, bottom: true, left: true},
  seed,
  fill = color.paper,
  fiber = 7,
  amp = 14,
  shadow = true,
  style,
  children,
}) => {
  const core = tornRectPoints(width, height, sides, `${seed}-core`, amp);
  const inset = (s?: boolean) => (s ? fiber : 0);
  const face = tornRectPoints(
    width - inset(sides.left) - inset(sides.right),
    height - inset(sides.top) - inset(sides.bottom),
    sides,
    `${seed}-face`,
    amp * 0.9,
  ).map(([x, y]) => [x + inset(sides.left), y + inset(sides.top)] as [number, number]);

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        filter: shadow ? `drop-shadow(5px 12px 10px ${color.shadow})` : undefined,
        ...style,
      }}
    >
      <div style={{position: 'absolute', inset: 0, background: color.fiber, clipPath: toPolygon(core)}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: fill,
          clipPath: toPolygon(face),
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};
