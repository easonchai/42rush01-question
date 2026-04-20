import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT_COLORS } from "../constants";
import { FadeText } from "../components/FadeText";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

// Times (frames) at which each value gets eliminated (1, 2, 4) → 3 survives.
const ELIMS: Array<{ val: number; at: number; reason: string }> = [
  { val: 1, at: 95, reason: "1 is already in this row" },
  { val: 2, at: 170, reason: "2 is already in this column" },
  { val: 4, at: 245, reason: "4 would see too many towers" },
];

export const SceneCSP: React.FC = () => {
  const frame = useCurrentFrame();

  const isEliminated = (v: number) => {
    const e = ELIMS.find((x) => x.val === v);
    return e && frame >= e.at;
  };
  const strikeProgress = (v: number) => {
    const e = ELIMS.find((x) => x.val === v);
    if (!e) return 0;
    return interpolate(frame, [e.at, e.at + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const reasonIdx = ELIMS.filter((e) => frame >= e.at).length - 1;
  const reason =
    reasonIdx < 0
      ? "all four still possible"
      : reasonIdx < ELIMS.length
        ? ELIMS[reasonIdx].reason
        : "only 3 is possible — it must be 3";
  const survivorOnly = frame >= 300;

  return (
    <AbsoluteFill style={{ padding: 50 }}>
      <SceneAudio name="csp" />
      <BackgroundGrid />
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 8,
          color: COLORS.accent,
          letterSpacing: -0.5,
        }}
      >
        Option 2 — be a detective, not a gambler
      </FadeText>
      <FadeText
        delay={18}
        style={{
          fontSize: 20,
          textAlign: "center",
          color: COLORS.fgDim,
          marginBottom: 30,
        }}
      >
        Keep a list of <em>possible</em> values per cell. Cross them off as you learn.
      </FadeText>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "center",
          flex: 1,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <FadeText delay={30} style={{ fontSize: 22, marginBottom: 28, color: COLORS.fgDim }}>
            One cell's possibilities shrinking
          </FadeText>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            {[1, 2, 3, 4].map((v) => {
              const eliminated = isEliminated(v);
              const sp = strikeProgress(v);
              const survivor = survivorOnly && v === 3;
              const color = HEIGHT_COLORS[v - 1];
              const dim = eliminated ? 0.25 : 1;
              const glow = survivor ? `0 0 40px ${color}` : "none";
              const scale = survivor ? 1.15 : 1;
              return (
                <div
                  key={v}
                  style={{
                    position: "relative",
                    width: 92,
                    height: 92,
                    borderRadius: 16,
                    background: eliminated ? COLORS.bgPanel : color,
                    border: `2px solid ${eliminated ? COLORS.grid : color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: eliminated ? COLORS.fgDim : "#0b0d14",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 44,
                    fontWeight: 800,
                    opacity: dim,
                    boxShadow: glow,
                    transform: `scale(${scale})`,
                    transition: "background 0.2s, color 0.2s, opacity 0.2s, border 0.2s",
                  }}
                >
                  {v}
                  {sp > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 6,
                        height: 4,
                        width: `${(92 - 12) * sp}px`,
                        background: COLORS.red,
                        borderRadius: 2,
                        transform: "translateY(-50%)",
                        boxShadow: `0 0 8px ${COLORS.red}`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "JetBrains Mono, monospace",
              color: reasonIdx >= ELIMS.length ? COLORS.green : COLORS.gold,
              minHeight: 28,
            }}
          >
            {reason}
          </div>
        </div>
        <div style={{ paddingRight: 40 }}>
          <FadeText
            delay={30}
            style={{ fontSize: 24, lineHeight: 1.5, marginBottom: 18 }}
          >
            Classic Sudoku trick — great for "each row/column uses every value once".
          </FadeText>
          <FadeText
            delay={140}
            style={{
              fontSize: 24,
              lineHeight: 1.5,
              marginBottom: 18,
              color: COLORS.accentWarm,
            }}
          >
            But a Skyscraper <em>clue</em> doesn't talk about one cell — it talks
            about a <strong>whole row at once</strong>.
          </FadeText>
          <FadeText
            delay={220}
            style={{
              fontSize: 19,
              fontFamily: "JetBrains Mono, monospace",
              background: "rgba(22,25,36,0.85)",
              border: `1px solid ${COLORS.grid}`,
              padding: "16px 18px",
              borderRadius: 10,
              lineHeight: 1.65,
            }}
          >
            <span style={{ color: COLORS.gold }}>clue = 3</span> → "see 3 towers"
            <br />
            which towers? depends on{" "}
            <span style={{ color: COLORS.gold }}>all 9 cells together</span>.
          </FadeText>
          <FadeText
            delay={330}
            style={{
              fontSize: 22,
              lineHeight: 1.55,
              marginTop: 24,
              color: COLORS.fgDim,
              fontStyle: "italic",
            }}
          >
            Cell-by-cell reasoning can't capture that. We need a bigger brush.
          </FadeText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
