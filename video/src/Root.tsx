import React from 'react';
import {Composition} from 'remotion';
import {SkyscraperExplainer} from './SkyscraperExplainer';
import {TOTAL_DURATION, FPS, WIDTH, HEIGHT} from './constants';

export const Root: React.FC = () => {
  return (
    <Composition
      id="SkyscraperExplainer"
      component={SkyscraperExplainer}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
