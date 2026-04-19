export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;

// Scene durations in seconds
export const SCENES = {
  intro: 5,
  problem: 9,
  bruteforce: 10,
  csp: 11,
  wfc: 14,
  code: 10,
  perf: 8,
  outro: 6,
};

export const SCENE_FRAMES = {
  intro: SCENES.intro * FPS,
  problem: SCENES.problem * FPS,
  bruteforce: SCENES.bruteforce * FPS,
  csp: SCENES.csp * FPS,
  wfc: SCENES.wfc * FPS,
  code: SCENES.code * FPS,
  perf: SCENES.perf * FPS,
  outro: SCENES.outro * FPS,
};

export const TOTAL_DURATION =
  SCENE_FRAMES.intro +
  SCENE_FRAMES.problem +
  SCENE_FRAMES.bruteforce +
  SCENE_FRAMES.csp +
  SCENE_FRAMES.wfc +
  SCENE_FRAMES.code +
  SCENE_FRAMES.perf +
  SCENE_FRAMES.outro;

// Colors (matching the CLI visualizer's height gradient)
export const COLORS = {
  bg: '#0b0d14',
  bgPanel: '#161924',
  fg: '#e6e8ef',
  fgDim: '#8b93a8',
  accent: '#60d7ff',
  accentWarm: '#ff6b6b',
  gold: '#f5c86e',
  green: '#68d391',
  red: '#ff4757',
  grid: '#2a2f3e',
};

export const HEIGHT_COLORS = [
  '#6ee7f8', // 1 cyan
  '#6eb4f8',
  '#a97ef0',
  '#e07edc',
  '#f5a86e',
  '#f5c86e',
  '#f57e8a',
  '#f5586e',
  '#f53030', // 9 deep red
];

// The PDF puzzle example
export const PDF_CLUES = {
  col_up: [4, 3, 2, 1],
  col_down: [1, 2, 2, 2],
  row_left: [4, 3, 2, 1],
  row_right: [1, 2, 2, 2],
  solution: [
    [1, 2, 3, 4],
    [2, 3, 4, 1],
    [3, 4, 1, 2],
    [4, 1, 2, 3],
  ],
};
