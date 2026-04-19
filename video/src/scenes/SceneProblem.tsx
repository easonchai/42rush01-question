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
        The rules
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
            delay={30}
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginBottom: 18,
            }}
          >
            • Place heights{' '}
            <span style={{color: COLORS.accent, fontWeight: 600}}>1..N</span> on
            an <span style={{color: COLORS.accent}}>N×N</span> grid
          </FadeText>
          <FadeText
            delay={60}
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginBottom: 18,
            }}
          >
            • Each row and column is a{' '}
            <span style={{color: COLORS.accent}}>Latin square</span>
          </FadeText>
          <FadeText
            delay={95}
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginBottom: 18,
            }}
          >
            • <span style={{color: COLORS.gold}}>Clues</span> around the edge ={' '}
            how many towers you can see from that side
          </FadeText>
          <FadeText
            delay={140}
            style={{
              fontSize: 24,
              lineHeight: 1.5,
              color: COLORS.fgDim,
            }}
          >
            (a taller tower hides any shorter ones behind it)
          </FadeText>
          <FadeText
            delay={190}
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginTop: 30,
              color: COLORS.accentWarm,
              fontWeight: 600,
            }}
          >
            Goal: solve 9×9 — fast.
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
