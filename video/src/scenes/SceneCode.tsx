import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, HEIGHT_COLORS} from '../constants';
import {FadeText} from '../components/FadeText';

type Module = {name: string; role: string; color: string};

const MODULES: Module[] = [
  {name: 'parse.c', role: 'tokenize + validate argv', color: HEIGHT_COLORS[0]},
  {name: 'precheck.c', role: 'reject impossible clue pairs', color: HEIGHT_COLORS[1]},
  {name: 'permgen.c', role: 'bucket all N! perms by (lv, rv)', color: HEIGHT_COLORS[2]},
  {name: 'state.c', role: 'wire lines → buckets, init cell domains', color: HEIGHT_COLORS[3]},
  {name: 'propagate.c', role: 'fixed-point loop + cell intersection', color: HEIGHT_COLORS[4]},
  {name: 'propagate_posval.c', role: 'recompute pos_val from alive perms', color: HEIGHT_COLORS[5]},
  {name: 'propagate_kill.c', role: 'kill perms whose value is now forbidden', color: HEIGHT_COLORS[6]},
  {name: 'search.c', role: 'MRV backtracking if propagation stalls', color: HEIGHT_COLORS[7]},
  {name: 'output.c', role: 'format grid, single write()', color: HEIGHT_COLORS[8]},
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
          marginBottom: 12,
        }}
      >
        The code, piece by piece
      </FadeText>
      <FadeText
        delay={15}
        style={{
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 28,
          color: COLORS.fgDim,
        }}
      >
        20 files, ~500 LOC of C · only{' '}
        <code style={{color: COLORS.accent}}>write</code>,{' '}
        <code style={{color: COLORS.accent}}>malloc</code>,{' '}
        <code style={{color: COLORS.accent}}>free</code> · norminette-clean
      </FadeText>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          columnGap: 40,
          flex: 1,
          alignContent: 'start',
        }}
      >
        {MODULES.map((m, i) => {
          const delay = 30 + i * 12;
          const op = interpolate(frame, [delay, delay + 12], [0, 1], {
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
                padding: '10px 16px',
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
                  width: 200,
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
