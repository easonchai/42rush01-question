import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, PDF_CLUES, HEIGHT_COLORS} from '../constants';
import {SkyscraperGrid} from '../components/SkyscraperGrid';
import {FadeText} from '../components/FadeText';

export const SceneWFC: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 4;

  const stage = Math.floor(
    interpolate(frame, [60, 420], [0, 4], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  // Grid progressively reveals after stage 2
  const visibleCells = Math.min(
    n * n,
    Math.max(0, Math.floor(interpolate(frame, [300, 540], [0, n * n]))),
  );
  const cells = PDF_CLUES.solution.map((row, r) =>
    row.map((v, c) => (r * n + c < visibleCells ? v : 0)),
  );

  const stepBoxes: Array<{n: number; label: string; detail: string}> = [
    {n: 1, label: 'List every legal row', detail: "for each row's two clues, enumerate the permutations that match them"},
    {n: 2, label: 'Same for every column', detail: 'now each row and each column has a small set of candidates'},
    {n: 3, label: 'Cross-check at every cell', detail: "row's options for (r,c) ∩ column's options for (r,c)"},
    {n: 4, label: 'Prune, repeat', detail: 'kill any candidate that disagrees; re-cross-check; stop when nothing changes'},
  ];

  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 14,
          color: COLORS.green,
        }}
      >
        Option 3: reason about whole rows at once
      </FadeText>
      <FadeText
        delay={20}
        style={{
          fontSize: 22,
          textAlign: 'center',
          marginBottom: 32,
          color: COLORS.fgDim,
        }}
      >
        Instead of guessing cell-by-cell, list every row that <em>could</em>{' '}
        satisfy its clues — then let rows and columns argue with each other.
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
                opacity: stage >= i ? 1 : 0.22,
                transition: 'opacity 0.3s',
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
                    stage === i ? `0 0 22px ${HEIGHT_COLORS[i * 2]}` : 'none',
                  flexShrink: 0,
                }}
              >
                {s.n}
              </div>
              <div>
                <div
                  style={{fontSize: 24, fontWeight: 600, color: COLORS.fg}}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    color: COLORS.fgDim,
                    lineHeight: 1.4,
                    marginTop: 3,
                  }}
                >
                  {s.detail}
                </div>
              </div>
            </div>
          ))}
          <FadeText
            delay={460}
            style={{
              fontSize: 20,
              fontStyle: 'italic',
              color: COLORS.gold,
              marginTop: 16,
            }}
          >
            On most puzzles this finishes the job — no guessing at all.
          </FadeText>
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
