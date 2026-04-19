import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, PDF_CLUES} from '../constants';
import {SkyscraperGrid} from '../components/SkyscraperGrid';
import {FadeText} from '../components/FadeText';

export const SceneProblem: React.FC = () => {
  const n = 4;
  const cells = PDF_CLUES.solution;
  return (
    <AbsoluteFill style={{padding: 40}}>
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        The rules — think Sudoku, but you can only see it from the side
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
        <div style={{transform: 'scale(0.55)', transformOrigin: 'center'}}>
          <SkyscraperGrid
            n={n}
            cells={cells}
            colUp={PDF_CLUES.col_up}
            colDown={PDF_CLUES.col_down}
            rowLeft={PDF_CLUES.row_left}
            rowRight={PDF_CLUES.row_right}
          />
        </div>
        <div style={{paddingLeft: 20, paddingRight: 40}}>
          <FadeText
            delay={40}
            style={{fontSize: 26, lineHeight: 1.5, marginBottom: 22}}
          >
            Put towers of heights{' '}
            <span style={{color: COLORS.accent, fontWeight: 600}}>1..N</span> in
            an <span style={{color: COLORS.accent}}>N×N</span> grid.
          </FadeText>
          <FadeText
            delay={100}
            style={{fontSize: 26, lineHeight: 1.5, marginBottom: 22}}
          >
            Each row and each column uses every height{' '}
            <em>exactly once</em>.
          </FadeText>
          <FadeText
            delay={180}
            style={{fontSize: 26, lineHeight: 1.5, marginBottom: 10}}
          >
            The <span style={{color: COLORS.gold}}>yellow numbers</span> are
            clues: stand on that side and count how many towers you can see.
          </FadeText>
          <FadeText
            delay={260}
            style={{
              fontSize: 22,
              lineHeight: 1.5,
              color: COLORS.fgDim,
              fontStyle: 'italic',
            }}
          >
            Taller towers hide shorter ones behind them.
          </FadeText>
          <FadeText
            delay={330}
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginTop: 30,
              color: COLORS.accentWarm,
              fontWeight: 600,
            }}
          >
            Goal: fill the grid so every clue matches — and do it for 9×9 fast.
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
