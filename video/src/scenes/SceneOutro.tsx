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
        text="Line-level WFC"
        subtitle="the right abstraction beats raw power"
        size={80}
      />
      <div style={{marginTop: 60, maxWidth: 920}}>
        <FadeText
          delay={20}
          style={{fontSize: 26, lineHeight: 1.5, marginBottom: 20, color: COLORS.fg}}
        >
          Brute force: 9<sup>81</sup> states → 20 minutes.
        </FadeText>
        <FadeText
          delay={50}
          style={{fontSize: 26, lineHeight: 1.5, marginBottom: 20, color: COLORS.fg}}
        >
          Cell-level CSP: tight on uniqueness, loose on visibility.
        </FadeText>
        <FadeText
          delay={80}
          style={{fontSize: 30, lineHeight: 1.5, color: COLORS.green, fontWeight: 600}}
        >
          Line-level WFC: domains of whole permutations → 40ms.
        </FadeText>
      </div>
      <FadeText
        delay={120}
        style={{
          fontSize: 18,
          color: COLORS.fgDim,
          marginTop: 80,
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        rush-01  ·  42 Piscine · C with only write / malloc / free
      </FadeText>
    </AbsoluteFill>
  );
};
