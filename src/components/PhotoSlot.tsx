import React from 'react';
import {Photo, TornPaper} from './Collage';
import {font} from '../lib/tokens';

/**
 * A photo position in the edit. With `src` it's the real treated photo; without, it renders an
 * obvious animatic card naming the public-domain image that goes there. Never ships as final.
 */
export const PhotoSlot: React.FC<{src?: string | null; label: string; w: number; h: number; seed: string; dark?: boolean}> = ({
  src, label, w, h, seed, dark = false,
}) =>
  src ? (
    <div style={{width: w}}>
      <Photo src={src} />
    </div>
  ) : (
    <TornPaper width={w} height={h} seed={seed} paper={dark ? 'black' : 'white'}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,${dark ? 0.25 : 0.08}) 0 14px, transparent 14px 28px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontFamily: font.type,
          color: dark ? '#e9e2d0' : '#3a352c',
          textAlign: 'center',
          padding: 30,
        }}
      >
        <div style={{fontSize: 30, letterSpacing: 4}}>PHOTO</div>
        <div style={{fontSize: Math.min(44, w / 12), lineHeight: 1.2}}>{label}</div>
      </div>
    </TornPaper>
  );
