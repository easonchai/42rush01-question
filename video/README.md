# Skyscraper Explainer — Remotion Video

A 73-second animated explainer video that walks through what the solver does
and *why* line-level wave-function-collapse beats brute force and cell-level
constraint propagation. Built with [Remotion](https://remotion.dev) (React +
TypeScript → MP4 via headless Chrome + ffmpeg).

## Output

The rendered MP4 is checked in at `video/out/skyscraper.mp4` (1280×720 @
30 fps, 73 seconds, h264, ~5 MB).

## Scene breakdown

| # | Scene | Duration | Purpose |
|---|---|---|---|
| 1 | Intro | 5 s | Title, subtitle "6000× speedup", grid rises into view |
| 2 | Problem | 9 s | The rules: heights 1..N, Latin square, visibility clues |
| 3 | Brute force | 10 s | Cell-by-cell counter, 9⁸¹ states, "20 minutes" reveal |
| 4 | CSP | 11 s | Cell domain shrinking animation; why visibility isn't cell-local |
| 5 | Line-level WFC | 14 s | 4-step pipeline: enumerate → line variable → intersect → propagate |
| 6 | Code walk | 10 s | 9 modules animated in with responsibilities |
| 7 | Performance | 8 s | Animated bar chart ex00 vs bonus for N=3..9 |
| 8 | Outro | 6 s | Summary + crediting the approach |

## Building

```
cd video
npm install
```

### Render the video

You need either a local Chrome install (macOS/Linux), or let Remotion
auto-download its headless Chrome on first run. On macOS both usually work
out of the box:

```
npm run render                       # -> out/skyscraper.mp4
npm run render:preview               # same with concurrency=1 (slower but safer)
```

If you've already got a specific Chromium you want to use:

```
npx remotion render SkyscraperExplainer out/skyscraper.mp4 \
    --browser-executable=/path/to/chrome \
    --concurrency=1
```

### Interactive preview (Remotion Studio)

```
npm run dev
```

Opens `http://localhost:3000` with a live preview, scrubber, and timeline
where you can iterate on any scene.

## File layout

```
video/
  package.json           remotion + react + typescript deps
  tsconfig.json
  remotion.config.ts     video codec + renderer config
  src/
    index.ts             registerRoot entry
    Root.tsx             <Composition> wiring
    SkyscraperExplainer.tsx   top-level Series of scenes
    constants.ts         FPS, WIDTH, HEIGHT, scene durations, palette,
                         PDF example data (used as the recurring sample)
    components/
      SkyscraperGrid.tsx  pseudo-3D isometric grid (shared prop)
      Title.tsx           spring-animated heading
      FadeText.tsx        staggered fade-in copy blocks
    scenes/
      SceneIntro.tsx
      SceneProblem.tsx
      SceneBruteForce.tsx
      SceneCSP.tsx
      SceneWFC.tsx
      SceneCode.tsx
      ScenePerf.tsx
      SceneOutro.tsx
  out/
    skyscraper.mp4       rendered output (committed)
    frames/              scene-midpoint PNGs for spot checks
```

## Notes

- Timings were chosen so each scene has a "read phase" (fade-in) and a "hold
  phase" before the next scene transitions in. Check `constants.SCENES` to
  retune — those values are seconds per scene.
- All animation uses Remotion's `interpolate` and `spring` for predictable
  timeline positions (no external animation libs).
- Font: relies on the host system's Inter and JetBrains Mono. If they're
  missing, Chrome falls back to a sans-serif/monospace — still readable.
- The isometric grid is done with CSS transforms (skew + stacked z faces)
  rather than WebGL, so it renders reliably on any headless Chrome without
  GPU.
