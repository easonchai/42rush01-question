import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, PDF_CLUES} from '../constants';
import {SkyscraperGrid} from '../components/SkyscraperGrid';
import {FadeText} from '../components/FadeText';

export const SceneBruteForce: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 4;
  const cellsDone = Math.min(
    n * n,
    Math.floor(interpolate(frame, [30, 240], [0, n * n])),
  );
  const cells = PDF_CLUES.solution.map((row, r) =>
    row.map((v, c) => (r * n + c < cellsDone ? v : 0)),
  );
  const attempt = Math.floor(
    interpolate(frame, [30, 320], [0, 34_250_000_000]),
  );

  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 10,
          color: COLORS.accentWarm,
        }}
      >
        Option 1: try every combination
      </FadeText>
      <FadeText
        delay={15}
        style={{
          fontSize: 22,
          textAlign: 'center',
          color: COLORS.fgDim,
          marginBottom: 28,
        }}
      >
        Fill cell #1 with 1, 2, 3... backtrack, try the next value, repeat.
      </FadeText>
      <div
        style={{display: 'flex', gap: 40, alignItems: 'center', flex: 1}}
      >
        <div
          style={{
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
            flex: 1,
          }}
        >
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
            delay={70}
            style={{fontSize: 25, lineHeight: 1.55, marginBottom: 22}}
          >
            For a 9×9 grid there are{' '}
            <span style={{color: COLORS.gold, fontWeight: 600}}>
              9⁸¹ ≈ 10⁷⁷
            </span>{' '}
            ways to fill the cells.
          </FadeText>
          <FadeText
            delay={140}
            style={{fontSize: 22, lineHeight: 1.6, color: COLORS.fgDim}}
          >
            That's more than the number of atoms in the observable universe.
          </FadeText>
          <FadeText
            delay={220}
            style={{
              fontSize: 22,
              fontFamily: 'JetBrains Mono, monospace',
              color: COLORS.fgDim,
              marginTop: 20,
            }}
          >
            attempts tried: {attempt.toLocaleString()}
          </FadeText>
          <FadeText
            delay={300}
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.red,
              marginTop: 35,
            }}
          >
            9×9 takes ~20 minutes.
          </FadeText>
          <FadeText
            delay={350}
            style={{fontSize: 22, lineHeight: 1.5, color: COLORS.fgDim, marginTop: 10}}
          >
            Can we do better?
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
