import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {COLORS, SCENE_FRAMES} from './constants';
import {SceneIntro} from './scenes/SceneIntro';
import {SceneProblem} from './scenes/SceneProblem';
import {SceneBruteForce} from './scenes/SceneBruteForce';
import {SceneCSP} from './scenes/SceneCSP';
import {SceneWFC} from './scenes/SceneWFC';
import {SceneCode} from './scenes/SceneCode';
import {ScenePerf} from './scenes/ScenePerf';
import {SceneOutro} from './scenes/SceneOutro';

export const SkyscraperExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_FRAMES.intro}>
          <SceneIntro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.problem}>
          <SceneProblem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.bruteforce}>
          <SceneBruteForce />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.csp}>
          <SceneCSP />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.wfc}>
          <SceneWFC />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.code}>
          <SceneCode />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.perf}>
          <ScenePerf />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.outro}>
          <SceneOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
