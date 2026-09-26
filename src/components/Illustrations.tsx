import React from 'react';
import {color, font} from '../lib/tokens';

// Stand-ins drawn in code. Swap for archival PNG cutouts (public/assets) via <Cutout src=...>.

export const Coin: React.FC<{label?: string; size?: number; ring?: string}> = ({
  label = '5¢',
  size = 420,
  ring = 'UNITED STATES OF AMERICA · FIVE CENTS · ',
}) => (
  <svg viewBox="0 0 400 400" width={size} height={size} style={{width: "100%", height: "auto", display: "block"}}>
    <defs>
      <radialGradient id="metal" cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#f1f1ec" />
        <stop offset="0.55" stopColor="#b9b8b0" />
        <stop offset="1" stopColor="#7c7a72" />
      </radialGradient>
      <path id="ringPath" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0" />
    </defs>
    <circle cx="200" cy="200" r="196" fill="url(#metal)" />
    <circle cx="200" cy="200" r="178" fill="none" stroke="#8d8b83" strokeWidth="5" />
    <circle cx="200" cy="200" r="122" fill="none" stroke="#9c9a92" strokeWidth="3" />
    <text fontFamily={font.heavy} fontSize="25" fill="#5d5b54" letterSpacing="3">
      <textPath href="#ringPath">{ring}</textPath>
    </text>
    <text x="200" y="245" textAnchor="middle" fontFamily={font.headline} fontSize={label.length > 2 ? 110 : 140} fill="#4a4843">
      {label}
    </text>
  </svg>
);

export const Bottle: React.FC<{height?: number}> = ({height = 760}) => (
  <svg viewBox="0 0 220 640" height={height} width={(height * 220) / 640}>
    <defs>
      <linearGradient id="glass" x1="0" x2="1">
        <stop offset="0" stopColor="#2a130b" />
        <stop offset="0.3" stopColor="#5a2c18" />
        <stop offset="0.55" stopColor="#3b1c10" />
        <stop offset="1" stopColor="#1d0d07" />
      </linearGradient>
    </defs>
    <path
      d="M88,10 h44 v18 h-4 v70 c0,40 36,60 40,120 c3,40 -18,70 -18,110 c0,40 22,70 22,150 c0,70 -6,120 -12,140 h-120 c-6,-20 -12,-70 -12,-140 c0,-80 22,-110 22,-150 c0,-40 -21,-70 -18,-110 c4,-60 40,-80 40,-120 v-70 h-4 z"
      fill="url(#glass)"
    />
    <rect x="84" y="4" width="52" height="22" rx="4" fill="#c9c6bd" />
    <rect x="30" y="330" width="160" height="92" fill={color.red} />
    <text x="110" y="395" textAnchor="middle" fontFamily={font.headline} fontSize="52" fill={color.fiber}>
      COLA
    </text>
    <path d="M70,120 c-16,40 -26,70 -26,110" stroke="rgba(255,255,255,0.35)" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M52,460 c-4,50 -2,90 4,130" stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" strokeLinecap="round" />
  </svg>
);
