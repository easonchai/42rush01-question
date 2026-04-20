import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, PDF_CLUES } from "../constants";
import { FadeText } from "../components/FadeText";
import { SkyscraperGrid } from "../components/SkyscraperGrid";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSp = spring({ frame, fps, config: { damping: 12 } });
  const titleY = interpolate(titleSp, [0, 1], [-40, 0]);
  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // tiny grid rises in the corner
  const n = 4;
  const cellRise: number[][] = [];
  for (let r = 0; r < n; r++) {
    const row: number[] = [];
    for (let c = 0; c < n; c++) {
      const d = 30 + (r + c) * 6;
      row.push(spring({ frame: frame - d, fps, config: { damping: 12 } }));
    }
    cellRise.push(row);
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        textAlign: "center",
      }}
    >
      <SceneAudio name="outro" />
      <BackgroundGrid opacity={0.18} />
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 14,
            letterSpacing: 4,
            color: COLORS.accent,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          big picture
        </div>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: 76,
            margin: 0,
            color: COLORS.fg,
            letterSpacing: -1.5,
          }}
        >
          the right abstraction beats raw power
        </h1>
      </div>
      <div style={{ marginTop: 48, maxWidth: 960 }}>
        <FadeText
          delay={30}
          style={{
            fontSize: 26,
            lineHeight: 1.5,
            marginBottom: 18,
            color: COLORS.fgDim,
          }}
        >
          brute force — <span style={{ color: COLORS.red, fontWeight: 700 }}>20 min</span>
        </FadeText>
        <FadeText
          delay={70}
          style={{
            fontSize: 26,
            lineHeight: 1.5,
            marginBottom: 18,
            color: COLORS.fgDim,
          }}
        >
          cell-level CSP — <span style={{ color: COLORS.accentWarm, fontWeight: 700 }}>can't see whole rows</span>
        </FadeText>
        <FadeText
          delay={120}
          style={{
            fontSize: 30,
            lineHeight: 1.5,
            color: COLORS.green,
            fontWeight: 700,
          }}
        >
          line-level WFC — <span style={{ color: COLORS.gold }}>≈ 40 ms</span>
        </FadeText>
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          transform: "scale(0.4)",
          transformOrigin: "bottom right",
          opacity: 0.9,
        }}
      >
        <SkyscraperGrid
          n={n}
          cells={PDF_CLUES.solution}
          colUp={PDF_CLUES.col_up}
          colDown={PDF_CLUES.col_down}
          rowLeft={PDF_CLUES.row_left}
          rowRight={PDF_CLUES.row_right}
          cellRise={cellRise}
          showClues={false}
        />
      </div>
      <FadeText
        delay={170}
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          fontSize: 16,
          color: COLORS.fgDim,
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: 3,
        }}
      >
        rush-01 · 42 piscine · line-level wave-function collapse
      </FadeText>
    </AbsoluteFill>
  );
};
