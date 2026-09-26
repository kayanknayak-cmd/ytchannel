import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';

// Animation "on Ns": hold each drawing for N frames of the 24fps base.
// 1 = smooth 24fps, 2 = 12fps, 3 = 8fps, 4 = 6fps.
const StepContext = createContext(2);

export const Stepped: React.FC<{step: number; children: React.ReactNode}> = ({
  step,
  children,
}) => <StepContext.Provider value={step}>{children}</StepContext.Provider>;

export const useStep = () => useContext(StepContext);

/** Current frame quantized to the active step rate. Use this instead of useCurrentFrame for motion. */
export const useSteppedFrame = (override?: number) => {
  const frame = useCurrentFrame();
  const ctx = useStep();
  const step = override ?? ctx;
  return Math.floor(frame / step) * step;
};

/** Index of the current drawing; changes once per step. Feed to seeds for boil/jitter. */
export const useDrawingIndex = (override?: number) => {
  const frame = useCurrentFrame();
  const ctx = useStep();
  return Math.floor(frame / (override ?? ctx));
};
