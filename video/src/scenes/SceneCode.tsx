import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, HEIGHT_COLORS} from '../constants';
import {FadeText} from '../components/FadeText';

type Module = {name: string; role: string; color: string};

const MODULES: Module[] = [
  {name: 'parse.c', role: 'read the clue string', color: HEIGHT_COLORS[0]},
  {name: 'precheck.c', role: 'catch obviously impossible clues', color: HEIGHT_COLORS[1]},
  {name: 'permgen.c', role: 'list every legal row', color: HEIGHT_COLORS[2]},
  {name: 'state.c', role: 'set up the grid and candidate lists', color: HEIGHT_COLORS[3]},
  {name: 'propagate.c', role: 'cross-check rows vs columns', color: HEIGHT_COLORS[4]},
  {name: 'propagate_posval.c', role: '"what values can row r still place at column c?"', color: HEIGHT_COLORS[5]},
  {name: 'propagate_kill.c', role: 'eliminate candidates that no longer fit', color: HEIGHT_COLORS[6]},
  {name: 'search.c', role: 'guess only if propagation stalls', color: HEIGHT_COLORS[7]},
  {name: 'output.c', role: 'print the solved grid', color: HEIGHT_COLORS[8]},
];

export const SceneCode: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{padding: 50}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        What the code actually does
      </FadeText>
      <FadeText
        delay={20}
        style={{
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 28,
          color: COLORS.fgDim,
        }}
      >
        pure C · only <code style={{color: COLORS.accent}}>write</code>,{' '}
        <code style={{color: COLORS.accent}}>malloc</code>,{' '}
        <code style={{color: COLORS.accent}}>free</code> · passes norminette
      </FadeText>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          columnGap: 40,
          flex: 1,
          alignContent: 'start',
        }}
      >
        {MODULES.map((m, i) => {
          const delay = 45 + i * 22;
          const op = interpolate(frame, [delay, delay + 16], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={m.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: op,
                transform: `translateX(${(1 - op) * 30}px)`,
                padding: '12px 18px',
                background: COLORS.bgPanel,
                borderRadius: 8,
                borderLeft: `4px solid ${m.color}`,
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 20,
                  fontWeight: 600,
                  color: m.color,
                  width: 230,
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 17,
                  color: COLORS.fg,
                  lineHeight: 1.3,
                }}
              >
                {m.role}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
