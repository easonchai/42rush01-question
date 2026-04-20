import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  from: number;
  to: number;
  delay?: number;
  duration?: number;
  format?: (v: number) => string;
  ease?: (t: number) => number;
  style?: React.CSSProperties;
};

/** Counts smoothly from `from` to `to` between [delay, delay+duration] frames. */
export const AnimatedNumber: React.FC<Props> = ({
  from,
  to,
  delay = 0,
  duration = 60,
  format = (v) => Math.round(v).toLocaleString(),
  ease,
  style,
}) => {
  const frame = useCurrentFrame();
  const raw = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const e = ease ? ease(raw) : 1 - Math.pow(1 - raw, 3);
  const v = from + (to - from) * e;
  return <span style={style}>{format(v)}</span>;
};
