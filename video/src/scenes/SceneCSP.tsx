import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FadeText} from '../components/FadeText';

export const SceneCSP: React.FC = () => {
  const frame = useCurrentFrame();
  // progressive domain pruning: {1,2,3,4} -> {2,3,4} -> {3,4} -> {3}
  const stage = Math.floor(
    interpolate(frame, [80, 280], [0, 3], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const domains = [
    [1, 2, 3, 4],
    [2, 3, 4],
    [3, 4],
    [3],
  ];
  const dom = domains[stage];

  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 10,
          color: COLORS.accent,
        }}
      >
        Option 2: be a detective, not a gambler
      </FadeText>
      <FadeText
        delay={20}
        style={{
          fontSize: 22,
          textAlign: 'center',
          color: COLORS.fgDim,
          marginBottom: 30,
        }}
      >
        Keep a list of *possible* values per cell. Cross them off as you learn.
      </FadeText>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 50,
          alignItems: 'center',
          flex: 1,
        }}
      >
        <div style={{textAlign: 'center'}}>
          <FadeText delay={40} style={{fontSize: 22, marginBottom: 22}}>
            One cell's possibilities shrinking:
          </FadeText>
          <div
            style={{
              display: 'flex',
              gap: 18,
              justifyContent: 'center',
              marginBottom: 22,
            }}
          >
            {[1, 2, 3, 4].map((v) => {
              const in_dom = dom.includes(v);
              return (
                <div
                  key={v}
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 14,
                    background: in_dom ? COLORS.accent : COLORS.bgPanel,
                    border: `2px solid ${
                      in_dom ? COLORS.accent : COLORS.grid
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: in_dom ? '#fff' : COLORS.fgDim,
                    fontSize: 44,
                    fontWeight: 700,
                    textDecoration: in_dom ? 'none' : 'line-through',
                    transition: 'all 0.3s',
                  }}
                >
                  {v}
                </div>
              );
            })}
          </div>
          <FadeText
            delay={80}
            style={{
              fontSize: 19,
              fontFamily: 'JetBrains Mono, monospace',
              color: COLORS.fgDim,
            }}
          >
            {stage === 0 ? 'all four still possible' : null}
            {stage === 1 ? '1 is already used in this row' : null}
            {stage === 2 ? '2 is already used in this column' : null}
            {stage === 3 ? '4 would see too few towers. it must be 3.' : null}
          </FadeText>
        </div>
        <div style={{paddingRight: 40}}>
          <FadeText
            delay={40}
            style={{fontSize: 24, lineHeight: 1.55, marginBottom: 18}}
          >
            This is what Sudoku solvers do, and it works great for "each
            row/column uses every value once".
          </FadeText>
          <FadeText
            delay={150}
            style={{
              fontSize: 24,
              lineHeight: 1.55,
              marginBottom: 18,
              color: COLORS.accentWarm,
            }}
          >
            But a Skyscraper <em>clue</em> doesn't talk about one cell — it
            talks about the <strong>whole row at once</strong>.
          </FadeText>
          <FadeText
            delay={260}
            style={{
              fontSize: 20,
              fontFamily: 'JetBrains Mono, monospace',
              background: COLORS.bgPanel,
              padding: 16,
              borderRadius: 8,
              lineHeight: 1.6,
            }}
          >
            clue = 3  →  "from here you see 3 towers"
            <br />
            which towers? depends on{' '}
            <span style={{color: COLORS.gold}}>all 9 cells together</span>.
          </FadeText>
          <FadeText
            delay={370}
            style={{
              fontSize: 22,
              lineHeight: 1.55,
              marginTop: 22,
              color: COLORS.fgDim,
            }}
          >
            Reasoning cell-by-cell can't capture that well. We need a bigger
            brush.
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
