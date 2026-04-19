import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../constants';
import {FadeText} from '../components/FadeText';
import {Title} from '../components/Title';

export const SceneOutro: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        textAlign: 'center',
      }}
    >
      <Title
        text="Big picture"
        subtitle="the right abstraction beats raw power"
        size={72}
      />
      <div style={{marginTop: 70, maxWidth: 980}}>
        <FadeText
          delay={30}
          style={{
            fontSize: 26,
            lineHeight: 1.55,
            marginBottom: 24,
            color: COLORS.fg,
          }}
        >
          Brute force: try everything, one cell at a time —{' '}
          <span style={{color: COLORS.red}}>20 minutes</span>.
        </FadeText>
        <FadeText
          delay={80}
          style={{
            fontSize: 26,
            lineHeight: 1.55,
            marginBottom: 24,
            color: COLORS.fg,
          }}
        >
          Sudoku-style CSP: smart per-cell — but can't see{' '}
          <em>whole rows</em>.
        </FadeText>
        <FadeText
          delay={140}
          style={{
            fontSize: 30,
            lineHeight: 1.55,
            color: COLORS.green,
            fontWeight: 600,
          }}
        >
          List legal rows, cross-check at cells, prune — ≈ 40 milliseconds.
        </FadeText>
      </div>
      <FadeText
        delay={200}
        style={{
          fontSize: 18,
          color: COLORS.fgDim,
          marginTop: 80,
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        rush-01  ·  42 Piscine  ·  line-level wave-function collapse
      </FadeText>
    </AbsoluteFill>
  );
};
