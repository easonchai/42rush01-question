import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FadeText} from '../components/FadeText';

type Row = {
  n: number;
  norm: number;   // ms
  fast: number;   // ms
};

const ROWS: Row[] = [
  {n: 3, norm: 11.8, fast: 13.3},
  {n: 4, norm: 12.0, fast: 13.7},
  {n: 5, norm: 12.1, fast: 15.0},
  {n: 6, norm: 12.2, fast: 15.3},
  {n: 7, norm: 14.9, fast: 16.0},
  {n: 8, norm: 37.0, fast: 19.5},
  {n: 9, norm: 252.8, fast: 41.5},
];

export const ScenePerf: React.FC = () => {
  const frame = useCurrentFrame();
  const maxMs = Math.max(...ROWS.map((r) => r.norm)); // 252.8
  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{fontSize: 40, fontWeight: 600, textAlign: 'center', marginBottom: 10}}
      >
        Measured performance
      </FadeText>
      <FadeText
        delay={15}
        style={{
          fontSize: 20,
          textAlign: 'center',
          color: COLORS.fgDim,
          marginBottom: 30,
        }}
      >
        median of 90 random puzzles per size · single thread
      </FadeText>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingInline: 40}}>
        {ROWS.map((row, i) => {
          const delay = 30 + i * 10;
          const anim = interpolate(frame, [delay, delay + 25], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const normW = (row.norm / maxMs) * 100 * anim;
          const fastW = (row.fast / maxMs) * 100 * anim;
          return (
            <div key={row.n} style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div
                style={{
                  width: 60,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 22,
                  color: COLORS.fg,
                  textAlign: 'right',
                }}
              >
                N={row.n}
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <div
                    style={{
                      width: `${normW}%`,
                      height: 20,
                      background: COLORS.accentWarm,
                      borderRadius: 4,
                      transition: 'width 0.2s',
                    }}
                  />
                  <span style={{fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color: COLORS.accentWarm}}>
                    {row.norm.toFixed(1)}ms · norm
                  </span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <div
                    style={{
                      width: `${fastW}%`,
                      height: 20,
                      background: COLORS.green,
                      borderRadius: 4,
                    }}
                  />
                  <span style={{fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color: COLORS.green}}>
                    {row.fast.toFixed(1)}ms · fast
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FadeText
        delay={180}
        style={{
          textAlign: 'center',
          fontSize: 28,
          marginTop: 20,
          color: COLORS.gold,
          fontWeight: 600,
        }}
      >
        N=9 ~ 40ms on the fast build (-O3 + pthread parallel gen)
      </FadeText>
    </AbsoluteFill>
  );
};
