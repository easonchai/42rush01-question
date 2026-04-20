import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, PDF_CLUES, HEIGHT_COLORS } from "../constants";
import { SkyscraperGrid } from "../components/SkyscraperGrid";
import { FadeText } from "../components/FadeText";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

const STEPS = [
  { n: 1, label: "List every legal row", detail: "for each row's two clues, enumerate matching permutations" },
  { n: 2, label: "Same for every column", detail: "each row and each column now has a small candidate set" },
  { n: 3, label: "Cross-check at every cell", detail: "row's options for (r,c) ∩ column's options for (r,c)" },
  { n: 4, label: "Prune, repeat", detail: "kill any candidate that disagrees; stop when nothing changes" },
];

// A few hand-picked permutations that match row 0's clues (up=4 from col side, left=4 → sees all, right=1 → last is tallest)
// For illustration only — these are 4-permutations shown as colored bar strips.
const CANDIDATES = [
  [1, 2, 3, 4],
  [2, 1, 3, 4],
  [1, 3, 2, 4],
  [3, 1, 2, 4],
];

export const SceneWFC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = 4;

  const stage = Math.min(
    3,
    Math.floor(interpolate(frame, [30, 400], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
  );

  // Per-cell rise for the collapsing grid, triggered when stage >= 2.
  const cellRise: number[][] = [];
  for (let r = 0; r < n; r++) {
    const row: number[] = [];
    for (let c = 0; c < n; c++) {
      const delay = 310 + (r + c) * 12;
      const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 110 } });
      row.push(s);
    }
    cellRise.push(row);
  }

  // Intersection flash at cell (0,0) when cross-check lands.
  const flash = interpolate(frame, [290, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ padding: 50 }}>
      <SceneAudio name="wfc" />
      <BackgroundGrid />
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 10,
          color: COLORS.green,
          letterSpacing: -0.5,
        }}
      >
        Option 3 — reason about whole rows at once
      </FadeText>
      <FadeText
        delay={18}
        style={{
          fontSize: 20,
          textAlign: "center",
          marginBottom: 24,
          color: COLORS.fgDim,
        }}
      >
        Instead of guessing per cell: list every row that <em>could</em> satisfy
        its clues — then let rows and columns argue.
      </FadeText>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: 30,
          alignItems: "center",
          flex: 1,
        }}
      >
        <div>
          {STEPS.map((s, i) => {
            const active = stage >= i;
            const current = stage === i;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  marginBottom: 18,
                  opacity: active ? 1 : 0.22,
                  transform: current ? "translateX(8px)" : "translateX(0)",
                  transition: "opacity 0.3s, transform 0.3s",
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: active ? HEIGHT_COLORS[i * 2] : COLORS.bgPanel,
                    color: "#0b0d14",
                    fontSize: 28,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: current ? `0 0 24px ${HEIGHT_COLORS[i * 2]}` : "none",
                    flexShrink: 0,
                    border: `2px solid ${active ? HEIGHT_COLORS[i * 2] : COLORS.grid}`,
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.fg }}>
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: COLORS.fgDim,
                      lineHeight: 1.4,
                      marginTop: 3,
                    }}
                  >
                    {s.detail}
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                color: COLORS.fgDim,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              CANDIDATES FOR ROW 0
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CANDIDATES.map((perm, pi) => {
                const d = 70 + pi * 18;
                const op = interpolate(frame, [d, d + 20], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const slide = interpolate(frame, [d, d + 20], [-20, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const killed = stage >= 3 && pi !== 0;
                return (
                  <div
                    key={pi}
                    style={{
                      display: "flex",
                      gap: 4,
                      opacity: op * (killed ? 0.2 : 1),
                      transform: `translateX(${slide}px)`,
                      filter: killed ? "grayscale(0.7)" : "none",
                      transition: "opacity 0.3s, filter 0.3s",
                    }}
                  >
                    {perm.map((v, j) => (
                      <div
                        key={j}
                        style={{
                          width: 44,
                          height: 22,
                          background: HEIGHT_COLORS[v - 1],
                          borderRadius: 3,
                          fontSize: 13,
                          color: "#0b0d14",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <FadeText
            delay={420}
            style={{
              fontSize: 18,
              fontStyle: "italic",
              color: COLORS.gold,
              marginTop: 14,
            }}
          >
            On most puzzles this finishes the job — no guessing at all.
          </FadeText>
        </div>
        <div
          style={{
            position: "relative",
            transform: "scale(0.55)",
            transformOrigin: "center",
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
            highlights={flash > 0 && flash < 1 ? [[0, 0]] : []}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
