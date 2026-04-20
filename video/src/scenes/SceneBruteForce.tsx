import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, PDF_CLUES } from "../constants";
import { SkyscraperGrid } from "../components/SkyscraperGrid";
import { FadeText } from "../components/FadeText";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

export const SceneBruteForce: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 4;
  const N_CELLS = n * n;

  // Simulate brute force: cycle value at "current" cell 1..n many times, advance occasionally.
  const progress = interpolate(frame, [20, 330], [0, N_CELLS], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const filled = Math.floor(progress);
  const curCell = Math.min(filled, N_CELLS - 1);
  const cycleSpeed = 1.1;
  const curVal = 1 + (Math.floor(frame * cycleSpeed) % n);

  const cells: number[][] = PDF_CLUES.solution.map((row, r) =>
    row.map((v, c) => {
      const idx = r * n + c;
      if (idx < filled) return v;
      if (idx === curCell) return curVal;
      return 0;
    }),
  );

  const curR = Math.floor(curCell / n);
  const curC = curCell % n;

  return (
    <AbsoluteFill style={{ padding: 50 }}>
      <SceneAudio name="bruteforce" />
      <BackgroundGrid opacity={0.14} />
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 6,
          color: COLORS.accentWarm,
          letterSpacing: -0.5,
        }}
      >
        Option 1 — try every combination
      </FadeText>
      <FadeText
        delay={15}
        style={{
          fontSize: 20,
          textAlign: "center",
          color: COLORS.fgDim,
          marginBottom: 24,
        }}
      >
        Fill cell #1 with 1, 2, 3… backtrack, try the next value, repeat.
      </FadeText>
      <div style={{ display: "flex", gap: 30, alignItems: "center", flex: 1 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            transform: "scale(0.6)",
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
            ghostOpacity={0.1}
            highlights={[[curR, curC]]}
          />
        </div>
        <div style={{ flex: 1, paddingRight: 30 }}>
          <FadeText
            delay={60}
            style={{ fontSize: 25, lineHeight: 1.55, marginBottom: 18 }}
          >
            For 9×9 there are{" "}
            <span style={{ color: COLORS.gold, fontWeight: 700 }}>
              9⁸¹ ≈ 10⁷⁷
            </span>{" "}
            ways to fill cells.
          </FadeText>
          <FadeText
            delay={110}
            style={{ fontSize: 20, lineHeight: 1.6, color: COLORS.fgDim }}
          >
            More than atoms in the observable universe.
          </FadeText>
          <div
            style={{
              marginTop: 26,
              padding: "16px 20px",
              background: "rgba(22,25,36,0.75)",
              border: `1px solid ${COLORS.grid}`,
              borderRadius: 12,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <div style={{ fontSize: 14, color: COLORS.fgDim, marginBottom: 8, letterSpacing: 2 }}>
              ATTEMPTS
            </div>
            <div style={{ fontSize: 34, color: COLORS.accentWarm, fontWeight: 700 }}>
              <AnimatedNumber
                from={0}
                to={34_250_000_000}
                delay={30}
                duration={280}
                ease={(t) => Math.pow(t, 1.8)}
              />
            </div>
            <div style={{ fontSize: 13, color: COLORS.fgDim, marginTop: 6 }}>
              current cell ({curR + 1},{curC + 1}) · trying{" "}
              <span style={{ color: COLORS.gold }}>{curVal}</span>
            </div>
          </div>
          <FadeText
            delay={310}
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.red,
              marginTop: 28,
              letterSpacing: -1,
            }}
          >
            9×9 ≈ 20 minutes.
          </FadeText>
          <FadeText
            delay={360}
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              color: COLORS.fgDim,
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            Can we do better?
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
