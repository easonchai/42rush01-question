import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FadeText} from '../components/FadeText';

/**
 * Cell-level CSP: shows a 4x4 cell with a shrinking domain {1,2,3,4} -> {3}.
 * Explains its strength (local propagation) and weakness (visibility is a
 * sequence constraint, not a cell-pair constraint).
 */
export const SceneCSP: React.FC = () => {
  const frame = useCurrentFrame();
  // progressive domain pruning animation
  const stage = Math.floor(interpolate(frame, [50, 200], [0, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
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
          marginBottom: 30,
          color: COLORS.accent,
        }}
      >
        Step 1: constraint propagation (CSP)
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
          <FadeText delay={30} style={{fontSize: 22, marginBottom: 20}}>
            One cell's domain shrinking:
          </FadeText>
          <div
            style={{
              display: 'flex',
              gap: 18,
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            {[1, 2, 3, 4].map((v) => {
              const in_dom = dom.includes(v);
              return (
                <div
                  key={v}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 14,
                    background: in_dom ? COLORS.accent : COLORS.bgPanel,
                    border: `2px solid ${in_dom ? COLORS.accent : COLORS.grid}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: in_dom ? '#fff' : COLORS.fgDim,
                    fontSize: 44,
                    fontWeight: 700,
                    textDecoration: in_dom ? 'none' : 'line-through',
                    transition: 'all 0.2s',
                  }}
                >
                  {v}
                </div>
              );
            })}
          </div>
          <FadeText
            delay={60}
            style={{
              fontSize: 20,
              fontFamily: 'JetBrains Mono, monospace',
              color: COLORS.fgDim,
            }}
          >
            AllDifferent: 1, 2, 4 already used in this row
          </FadeText>
        </div>
        <div style={{paddingRight: 40}}>
          <FadeText
            delay={30}
            style={{fontSize: 26, lineHeight: 1.5, marginBottom: 18}}
          >
            ✓ Handles row/col AllDifferent beautifully.
          </FadeText>
          <FadeText
            delay={140}
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginBottom: 18,
              color: COLORS.accentWarm,
            }}
          >
            ✗ But visibility is a{' '}
            <span style={{color: COLORS.gold}}>whole-line constraint</span> —
            not cell-pair.
          </FadeText>
          <FadeText
            delay={220}
            style={{
              fontSize: 22,
              fontFamily: 'JetBrains Mono, monospace',
              background: COLORS.bgPanel,
              padding: 16,
              borderRadius: 8,
              lineHeight: 1.6,
            }}
          >
            clue = 3 on this row
            <br />
            ⇒ must have 3 left-to-right maxima
            <br />
            ⇒ <span style={{color: COLORS.gold}}>couples all 9 cells</span>{' '}
            simultaneously
          </FadeText>
          <FadeText
            delay={290}
            style={{fontSize: 24, lineHeight: 1.5, marginTop: 22}}
          >
            Standard AC-3 can only approximate it.
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
