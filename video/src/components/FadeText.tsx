import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';

type Props = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  hold?: boolean;
  style?: React.CSSProperties;
};

/** Fade in at `delay`, optionally fade out after `duration` frames. */
export const FadeText: React.FC<Props> = ({
  children,
  delay = 0,
  duration = 9999,
  hold = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  const inOp = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outOp = hold
    ? 1
    : interpolate(t, [duration - 10, duration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  return (
    <div
      style={{
        opacity: Math.min(inOp, outOp),
        color: COLORS.fg,
        fontFamily: 'Inter, sans-serif',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
