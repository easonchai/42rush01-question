import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FadeText} from '../components/FadeText';

type Row = {n: number; norm: number; fast: number};

const ROWS: Row[] = [
  {n: 6, norm: 12.2, fast: 15.3},
  {n: 7, norm: 14.9, fast: 16.0},
  {n: 8, norm: 37.0, fast: 19.5},
  {n: 9, norm: 252.8, fast: 41.5},
];

// Bar scale is capped to the N=9 norm time (the clear story anchor)
const MAX_MS = 260;

export const ScenePerf: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        How fast is it really?
      </FadeText>
      <FadeText
        delay={20}
        style={{
          fontSize: 20,
          textAlign: 'center',
          color: COLORS.fgDim,
          marginBottom: 34,
        }}
      >
        median time to solve · 90 random puzzles per size · lower is better
      </FadeText>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          padding: '0 70px',
        }}
      >
        {ROWS.map((row, i) => {
          const delay = 40 + i * 30;
          const anim = interpolate(frame, [delay, delay + 45], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const normW = (row.norm / MAX_MS) * 100 * anim;
          const fastW = (row.fast / MAX_MS) * 100 * anim;
          const ratio = row.norm / row.fast;
          const showRatio = anim > 0.9 && ratio >= 1.4;
          return (
            <div
              key={row.n}
              style={{display: 'flex', alignItems: 'center', gap: 20}}
            >
              <div
                style={{
                  width: 70,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 26,
                  color: COLORS.fg,
                  textAlign: 'right',
                  fontWeight: 600,
                }}
              >
                N={row.n}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{display: 'flex', alignItems: 'center', gap: 10}}
                >
                  <div
                    style={{
                      width: `${normW}%`,
                      minWidth: normW > 0 ? 4 : 0,
                      height: 24,
                      background: COLORS.accentWarm,
                      borderRadius: 4,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 16,
                      color: COLORS.accentWarm,
                      opacity: anim,
                    }}
                  >
                    {row.norm.toFixed(1)}ms  ·  norm (42 build)
                  </span>
                </div>
                <div
                  style={{display: 'flex', alignItems: 'center', gap: 10}}
                >
                  <div
                    style={{
                      width: `${fastW}%`,
                      minWidth: fastW > 0 ? 4 : 0,
                      height: 24,
                      background: COLORS.green,
                      borderRadius: 4,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 16,
                      color: COLORS.green,
                      opacity: anim,
                    }}
                  >
                    {row.fast.toFixed(1)}ms  ·  fast (-O3 + threads)
                  </span>
                  {showRatio && (
                    <span
                      style={{
                        fontSize: 18,
                        color: COLORS.gold,
                        fontWeight: 700,
                        marginLeft: 14,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {ratio.toFixed(1)}× faster
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FadeText
        delay={260}
        style={{
          textAlign: 'center',
          fontSize: 26,
          marginTop: 24,
          color: COLORS.gold,
          fontWeight: 600,
        }}
      >
        At N=9: brute force ≈ 20 min → our norm ≈ 250 ms → fast ≈ 40 ms
      </FadeText>
    </AbsoluteFill>
  );
};
