import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, PDF_CLUES } from "../constants";
import { SkyscraperGrid } from "../components/SkyscraperGrid";
import { FadeText } from "../components/FadeText";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 4;
  const cells = PDF_CLUES.solution;

  // Demo clue "4" from the left on row 0 (heights: 1,2,3,4 → sees all 4).
  const row0 = PDF_CLUES.solution[0];
  const rayReveal = interpolate(frame, [200, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ray2 = interpolate(frame, [300, 370], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Choose which ray to show: first left-from-row0 (sees all), then left-from-row3 clue=1 (sees only the giant tower at c=0)
  const activeRay =
    frame >= 290
      ? { side: "left" as const, index: 3, heights: PDF_CLUES.solution[3], reveal: ray2 }
      : frame >= 200
        ? { side: "left" as const, index: 0, heights: row0, reveal: rayReveal }
        : undefined;

  return (
    <AbsoluteFill style={{ padding: 40 }}>
      <SceneAudio name="problem" />
      <BackgroundGrid />
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 20,
          letterSpacing: -0.5,
        }}
      >
        The rules — Sudoku, but you can only see it from the side
      </FadeText>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
          alignItems: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "scale(0.58)",
            transformOrigin: "center",
          }}
        >
          <SkyscraperGrid
            n={n}
            cells={cells}
            colUp={PDF_CLUES.col_up}
            colDown={PDF_CLUES.col_down}
            rowLeft={PDF_CLUES.row_left}
            rowRight={PDF_CLUES.row_right}
            sightRay={activeRay}
            highlights={
              frame >= 200 && frame < 290
                ? [
                    [0, 0],
                    [0, 1],
                    [0, 2],
                    [0, 3],
                  ]
                : frame >= 290
                  ? [[3, 0]]
                  : []
            }
          />
        </div>
        <div style={{ paddingRight: 40 }}>
          <FadeText
            delay={30}
            style={{ fontSize: 26, lineHeight: 1.5, marginBottom: 20 }}
          >
            Put towers of heights{" "}
            <span style={{ color: COLORS.accent, fontWeight: 600 }}>1..N</span> in
            an <span style={{ color: COLORS.accent }}>N×N</span> grid.
          </FadeText>
          <FadeText
            delay={80}
            style={{ fontSize: 26, lineHeight: 1.5, marginBottom: 20 }}
          >
            Each row and column uses every height{" "}
            <em>exactly once</em>.
          </FadeText>
          <FadeText
            delay={150}
            style={{ fontSize: 26, lineHeight: 1.5, marginBottom: 14 }}
          >
            <span style={{ color: COLORS.gold }}>Yellow numbers</span> = clues.
            Stand on that side, count visible towers.
          </FadeText>
          <FadeText
            delay={210}
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              color: COLORS.fgDim,
              fontStyle: "italic",
              marginBottom: 14,
            }}
          >
            Taller towers hide shorter ones behind them.
          </FadeText>
          <FadeText
            delay={200}
            style={{
              fontSize: 20,
              fontFamily: "JetBrains Mono, monospace",
              background: "rgba(22,25,36,0.7)",
              border: `1px solid ${COLORS.grid}`,
              borderRadius: 10,
              padding: "12px 16px",
              color: COLORS.gold,
              marginBottom: 10,
            }}
          >
            row 1 from left: see 1,2,3,4 → clue = 4 ✓
          </FadeText>
          <FadeText
            delay={290}
            style={{
              fontSize: 20,
              fontFamily: "JetBrains Mono, monospace",
              background: "rgba(22,25,36,0.7)",
              border: `1px solid ${COLORS.grid}`,
              borderRadius: 10,
              padding: "12px 16px",
              color: COLORS.gold,
            }}
          >
            row 4 from left: only the 4 — clue = 1 ✓
          </FadeText>
          <FadeText
            delay={350}
            style={{
              fontSize: 24,
              lineHeight: 1.4,
              marginTop: 20,
              color: COLORS.accentWarm,
              fontWeight: 600,
            }}
          >
            Goal: match every clue — for 9×9, fast.
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
