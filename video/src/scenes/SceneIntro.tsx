import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, PDF_CLUES } from "../constants";
import { SkyscraperGrid } from "../components/SkyscraperGrid";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = 4;

  // Per-cell staggered rise keyed by (r+c) diagonal so towers sweep up.
  const cellRise: number[][] = [];
  for (let r = 0; r < n; r++) {
    const row: number[] = [];
    for (let c = 0; c < n; c++) {
      const delay = 18 + (r + c) * 7;
      const s = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 120, mass: 0.8 },
      });
      row.push(s);
    }
    cellRise.push(row);
  }
  const cells = PDF_CLUES.solution;

  // Title slides down from top
  const titleOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [-24, 0], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [20, 36], [0, 1], { extrapolateRight: "clamp" });

  // Subtle scale + tilt on grid wrapper
  const gridOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const gridScale = interpolate(frame, [10, 60], [0.72, 0.88], { extrapolateRight: "clamp" });
  const gridRot = interpolate(frame, [0, 180], [-2, 2]);

  // Reveal-flash when grid finishes rising
  const flashFrame = 18 + (n - 1 + n - 1) * 7 + 20;
  const flash = interpolate(frame, [flashFrame, flashFrame + 18], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <SceneAudio name="intro" />
      <BackgroundGrid />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div
          style={{
            textAlign: "center",
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 14,
              letterSpacing: 4,
              color: COLORS.accent,
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: 0.85,
            }}
          >
            rush-01 · 42 piscine
          </div>
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 72,
              margin: 0,
              color: COLORS.fg,
              letterSpacing: -1.5,
              lineHeight: 1.05,
            }}
          >
            The Skyscraper Puzzle
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 22,
              color: COLORS.fgDim,
              margin: "16px 0 0 0",
              opacity: subOp,
            }}
          >
            how a small change in perspective beats{" "}
            <span style={{ color: COLORS.accentWarm, fontWeight: 600 }}>20 minutes</span>{" "}
            of brute force
          </p>
        </div>
        <div
          style={{
            opacity: gridOp,
            transform: `scale(${gridScale}) rotate(${gridRot}deg)`,
            transformOrigin: "center",
            marginTop: -20,
          }}
        >
          <SkyscraperGrid
            n={n}
            cells={cells}
            colUp={PDF_CLUES.col_up}
            colDown={PDF_CLUES.col_down}
            rowLeft={PDF_CLUES.row_left}
            rowRight={PDF_CLUES.row_right}
            cellRise={cellRise}
            showClues={frame > 100}
          />
        </div>
      </AbsoluteFill>
      {flash > 0 && (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at center, rgba(96,215,255,0.3), transparent 60%)",
            opacity: flash,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
