import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, PDF_CLUES} from '../constants';
import {SkyscraperGrid} from '../components/SkyscraperGrid';
import {FadeText} from '../components/FadeText';

/**
 * Brute force scene: cells fill one at a time, counter ticks up with
 * exploding multiplication, final "~20 minutes" reveal.
 */
export const SceneBruteForce: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 4;
  // progressively fill cells 0..N*N based on frame
  const cellsDone = Math.min(n * n, Math.floor(interpolate(frame, [20, 200], [0, n * n])));
  const cells = PDF_CLUES.solution.map((row, r) =>
    row.map((v, c) => (r * n + c < cellsDone ? v : 0)),
  );
  const attempt = Math.floor(interpolate(frame, [20, 240], [0, 12_340_000_000]));

  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 20,
          color: COLORS.accentWarm,
        }}
      >
        Brute force: try every combination
      </FadeText>
      <div style={{display: 'flex', gap: 40, alignItems: 'center', flex: 1}}>
        <div style={{transform: 'scale(0.5)', transformOrigin: 'top left', flex: 1}}>
          <SkyscraperGrid
            n={n}
            cells={cells}
            colUp={PDF_CLUES.col_up}
            colDown={PDF_CLUES.col_down}
            rowLeft={PDF_CLUES.row_left}
            rowRight={PDF_CLUES.row_right}
            ghostOpacity={0.15}
          />
        </div>
        <div style={{flex: 1, paddingRight: 40}}>
          <FadeText
            delay={30}
            style={{fontSize: 26, lineHeight: 1.6, marginBottom: 22}}
          >
            Walk cells in order, try values 1..N, backtrack on conflict.
          </FadeText>
          <FadeText
            delay={90}
            style={{
              fontSize: 24,
              fontFamily: 'JetBrains Mono, monospace',
              background: COLORS.bgPanel,
              padding: 18,
              borderRadius: 8,
              marginBottom: 20,
              color: COLORS.fg,
            }}
          >
            9<sup>81</sup> ≈ 10<sup>77</sup> raw states
            <br />
            (pruned by row/col uniqueness: still astronomical)
          </FadeText>
          <FadeText
            delay={150}
            style={{
              fontSize: 22,
              fontFamily: 'JetBrains Mono, monospace',
              color: COLORS.fgDim,
            }}
          >
            attempts explored: {attempt.toLocaleString()}
          </FadeText>
          <FadeText
            delay={240}
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: COLORS.red,
              marginTop: 30,
            }}
          >
            9×9 → ~20 minutes
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
