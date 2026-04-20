import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";
import { FadeText } from "../components/FadeText";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

type Row = { n: number; norm: number; fast: number };

const ROWS: Row[] = [
  { n: 6, norm: 12.2, fast: 15.3 },
  { n: 7, norm: 14.9, fast: 16.0 },
  { n: 8, norm: 37.0, fast: 19.5 },
  { n: 9, norm: 252.8, fast: 41.5 },
];

const MAX_MS = 260;

export const ScenePerf: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: 50 }}>
      <SceneAudio name="perf" />
      <BackgroundGrid />
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 6,
          letterSpacing: -0.5,
        }}
      >
        How fast is it really?
      </FadeText>
      <FadeText
        delay={18}
        style={{
          fontSize: 18,
          textAlign: "center",
          color: COLORS.fgDim,
          marginBottom: 28,
        }}
      >
        median time · 90 random puzzles per size · lower is better
      </FadeText>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          padding: "0 60px",
        }}
      >
        {ROWS.map((row, i) => {
          const delay = 36 + i * 28;
          const anim = interpolate(frame, [delay, delay + 55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const eased = 1 - Math.pow(1 - anim, 3);
          const normW = (row.norm / MAX_MS) * 100 * eased;
          const fastW = (row.fast / MAX_MS) * 100 * eased;
          const ratio = row.norm / row.fast;
          const showRatio = anim > 0.85 && ratio >= 1.4;
          return (
            <div
              key={row.n}
              style={{ display: "flex", alignItems: "center", gap: 18 }}
            >
              <div
                style={{
                  width: 70,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 26,
                  color: COLORS.fg,
                  textAlign: "right",
                  fontWeight: 700,
                }}
              >
                N={row.n}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: `${normW}%`,
                      minWidth: normW > 0 ? 4 : 0,
                      height: 24,
                      background: `linear-gradient(90deg, ${COLORS.accentWarm}, ${COLORS.red})`,
                      borderRadius: 4,
                      boxShadow: `0 0 12px ${COLORS.accentWarm}55`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 15,
                      color: COLORS.accentWarm,
                      opacity: anim,
                    }}
                  >
                    <AnimatedNumber
                      from={0}
                      to={row.norm}
                      delay={delay}
                      duration={55}
                      format={(v) => v.toFixed(1) + "ms"}
                    />{" "}
                    · norm
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: `${fastW}%`,
                      minWidth: fastW > 0 ? 4 : 0,
                      height: 24,
                      background: `linear-gradient(90deg, ${COLORS.green}, #4ade80)`,
                      borderRadius: 4,
                      boxShadow: `0 0 12px ${COLORS.green}55`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 15,
                      color: COLORS.green,
                      opacity: anim,
                    }}
                  >
                    <AnimatedNumber
                      from={0}
                      to={row.fast}
                      delay={delay}
                      duration={55}
                      format={(v) => v.toFixed(1) + "ms"}
                    />{" "}
                    · fast
                  </span>
                  {showRatio && (
                    <span
                      style={{
                        fontSize: 17,
                        color: COLORS.gold,
                        fontWeight: 700,
                        marginLeft: 12,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {ratio.toFixed(1)}× faster
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FadeText
        delay={230}
        style={{
          textAlign: "center",
          fontSize: 24,
          marginTop: 20,
          color: COLORS.gold,
          fontWeight: 700,
        }}
      >
        At N=9: brute force ≈ 20 min → norm ≈ 250 ms → fast ≈ 40 ms
      </FadeText>
      <FadeText
        delay={280}
        style={{
          textAlign: "center",
          fontSize: 18,
          marginTop: 8,
          color: COLORS.fgDim,
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: 2,
        }}
      >
        ≈30,000× SPEEDUP
      </FadeText>
    </AbsoluteFill>
  );
};
