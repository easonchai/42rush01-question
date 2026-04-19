import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, PDF_CLUES} from '../constants';
import {SkyscraperGrid} from '../components/SkyscraperGrid';
import {Title} from '../components/Title';

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 4;
  // grid "appears" by raising towers
  const rise = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cells: number[][] = PDF_CLUES.solution.map((row) =>
    row.map((v) => (rise >= 1 ? v : 0)),
  );
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      <div style={{marginBottom: 40}}>
        <Title
          text="The Skyscraper Puzzle"
          subtitle="how a small change in perspective beats 20 minutes of brute force"
          color={COLORS.fg}
        />
      </div>
      <div style={{opacity, transform: 'scale(0.55)'}}>
        <SkyscraperGrid
          n={n}
          cells={cells}
          colUp={PDF_CLUES.col_up}
          colDown={PDF_CLUES.col_down}
          rowLeft={PDF_CLUES.row_left}
          rowRight={PDF_CLUES.row_right}
        />
      </div>
    </AbsoluteFill>
  );
};
