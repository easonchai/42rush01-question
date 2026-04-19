import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, PDF_CLUES, HEIGHT_COLORS} from '../constants';
import {SkyscraperGrid} from '../components/SkyscraperGrid';
import {FadeText} from '../components/FadeText';

/**
 * Line-level wave-function-collapse.
 * Shows:
 *  - Step A: generate all N! perms, bucket by (L, R) clues
 *  - Step B: each line = a variable whose domain is a small set of perms
 *  - Step C: row ∩ col projections at each cell
 *  - Step D: propagate until fixed point (grid fills in)
 */
export const SceneWFC: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 4;

  const stage = Math.floor(interpolate(frame, [30, 330], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  // Progressive reveal of the solution grid
  const visibleCells = Math.min(
    n * n,
    Math.max(0, Math.floor(interpolate(frame, [220, 370], [0, n * n]))),
  );
  const cells = PDF_CLUES.solution.map((row, r) =>
    row.map((v, c) => (r * n + c < visibleCells ? v : 0)),
  );

  const stepBoxes: Array<{n: number; label: string; detail: string}> = [
    {n: 1, label: 'Enumerate', detail: 'N! permutations, each bucketed by (L,R)'},
    {n: 2, label: 'Variable = line', detail: 'domain = valid perms for that line'},
    {n: 3, label: 'Intersect', detail: 'row ∩ column at each cell'},
    {n: 4, label: 'Propagate', detail: 'kill dead perms, repeat to fixed point'},
  ];

  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 22,
          color: COLORS.green,
        }}
      >
        Our approach: line-level WFC
      </FadeText>
      <FadeText
        delay={20}
        style={{
          fontSize: 22,
          textAlign: 'center',
          marginBottom: 30,
          color: COLORS.fgDim,
        }}
      >
        treat each row and column as a variable with a domain of permutations
      </FadeText>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'center',
          flex: 1,
        }}
      >
        <div>
          {stepBoxes.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'center',
                marginBottom: 20,
                opacity: stage >= i ? 1 : 0.25,
                transition: 'opacity 0.2s',
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background:
                    stage >= i ? HEIGHT_COLORS[i * 2] : COLORS.bgPanel,
                  color: '#fff',
                  fontSize: 30,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    stage === i
                      ? `0 0 22px ${HEIGHT_COLORS[i * 2]}`
                      : 'none',
                }}
              >
                {s.n}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: COLORS.fg,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: COLORS.fgDim,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {s.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{transform: 'scale(0.55)', transformOrigin: 'center'}}>
          <SkyscraperGrid
            n={n}
            cells={cells}
            colUp={PDF_CLUES.col_up}
            colDown={PDF_CLUES.col_down}
            rowLeft={PDF_CLUES.row_left}
            rowRight={PDF_CLUES.row_right}
            highlights={
              visibleCells > 0 && visibleCells < n * n
                ? [
                    [
                      Math.floor((visibleCells - 1) / n),
                      (visibleCells - 1) % n,
                    ],
                  ]
                : []
            }
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
