import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";

type Props = {
  opacity?: number;
  spacing?: number;
};

/**
 * Subtle animated dot grid for 3b1b-style backgrounds. Dots breathe with a
 * low-frequency sine so the frame never feels flat.
 */
export const BackgroundGrid: React.FC<Props> = ({
  opacity = 0.18,
  spacing = 48,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.sin(frame / 36);
  const dotOp = opacity * pulse;
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <pattern
          id="bgDots"
          x={0}
          y={0}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={spacing / 2} cy={spacing / 2} r={1.2} fill={COLORS.fg} opacity={dotOp} />
        </pattern>
        <radialGradient id="bgFade" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity={1} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <mask id="bgMask">
          <rect width="100%" height="100%" fill="url(#bgFade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgDots)" mask="url(#bgMask)" />
    </svg>
  );
};

type SceneTitleProps = {
  eyebrow?: string;
  children: React.ReactNode;
  color?: string;
  delay?: number;
};

/** Small eyebrow label + big scene title with slide-in. */
export const SceneTitle: React.FC<SceneTitleProps> = ({
  eyebrow,
  children,
  color = COLORS.fg,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  const op = interpolate(t, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(t, [0, 14], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, transform: `translateY(${y}px)` }}>
      {eyebrow && (
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 16,
            letterSpacing: 3,
            color: color,
            opacity: 0.7,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </div>
      )}
      <h1
        style={{
          color,
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 44,
          margin: 0,
          letterSpacing: -0.5,
        }}
      >
        {children}
      </h1>
    </div>
  );
};
