import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';

type Props = {
  text: string;
  subtitle?: string;
  color?: string;
  delay?: number;
  align?: 'left' | 'center';
  size?: number;
};

export const Title: React.FC<Props> = ({
  text,
  subtitle,
  color = COLORS.fg,
  delay = 0,
  align = 'center',
  size = 64,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = Math.max(0, frame - delay);
  const opacity = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = spring({frame: t, fps, config: {damping: 14}});
  const y = interpolate(slide, [0, 1], [24, 0]);
  return (
    <div
      style={{
        textAlign: align,
        width: '100%',
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <h1
        style={{
          color,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: size,
          margin: 0,
          letterSpacing: -1,
        }}
      >
        {text}
      </h1>
      {subtitle && (
        <p
          style={{
            color: COLORS.fgDim,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: size * 0.35,
            margin: '14px 0 0 0',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
