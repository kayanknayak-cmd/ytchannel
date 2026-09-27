// Visual language. Every template pulls from here so a restyle is one file.
export const W = 1080;
export const H = 1920;
export const FPS = 24; // base rate; "on 2s" = 12 drawings/s, "on 4s" = 6

export const color = {
  paper: '#ece3cf', // newsprint cream
  paperDark: '#d9ccb0',
  fiber: '#fbf8f1', // exposed core of torn paper
  ink: '#1b1a17',
  red: '#d7382b', // accent 1: stamps, highlights
  yellow: '#f4c430', // accent 2: highlighter
  blue: '#2e5aa8',
  kraft: '#b98c5a',
  shadow: 'rgba(20, 14, 6, 0.38)',
};

export const font = {
  headline: '"Anton", "Archivo Black", Impact, sans-serif',
  heavy: '"Archivo Black", sans-serif',
  type: '"Special Elite", "Courier New", monospace',
  hand: '"Permanent Marker", cursive',
  body: '"Inter", sans-serif',
};
