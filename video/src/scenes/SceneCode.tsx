import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT_COLORS } from "../constants";
import { FadeText } from "../components/FadeText";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SceneAudio } from "../components/SceneAudio";

type Module = { name: string; role: string; color: string };

const MODULES: Module[] = [
  { name: "parse.c", role: "read the clue string", color: HEIGHT_COLORS[0] },
  { name: "precheck.c", role: "catch obviously impossible clues", color: HEIGHT_COLORS[1] },
  { name: "permgen.c", role: "list every legal row", color: HEIGHT_COLORS[2] },
  { name: "state.c", role: "set up the grid and candidate lists", color: HEIGHT_COLORS[3] },
  { name: "propagate.c", role: "cross-check rows vs columns", color: HEIGHT_COLORS[4] },
  { name: "propagate_posval.c", role: "what values can row r still place at col c?", color: HEIGHT_COLORS[5] },
  { name: "propagate_kill.c", role: "eliminate candidates that no longer fit", color: HEIGHT_COLORS[6] },
  { name: "search.c", role: "guess only if propagation stalls", color: HEIGHT_COLORS[7] },
  { name: "output.c", role: "print the solved grid", color: HEIGHT_COLORS[8] },
];

export const SceneCode: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: 50 }}>
      <SceneAudio name="code" />
      <BackgroundGrid />
      <FadeText
        delay={0}
        style={{
          fontSize: 40,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 8,
          letterSpacing: -0.5,
        }}
      >
        What the code actually does
      </FadeText>
      <FadeText
        delay={18}
        style={{
          fontSize: 19,
          textAlign: "center",
          marginBottom: 26,
          color: COLORS.fgDim,
        }}
      >
        pure C · only <code style={{ color: COLORS.accent }}>write</code>,{" "}
        <code style={{ color: COLORS.accent }}>malloc</code>,{" "}
        <code style={{ color: COLORS.accent }}>free</code> · passes norminette
      </FadeText>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          columnGap: 28,
          flex: 1,
          alignContent: "start",
        }}
      >
        {MODULES.map((m, i) => {
          const delay = 40 + i * 20;
          const op = interpolate(frame, [delay, delay + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const slide = interpolate(frame, [delay, delay + 18], [24, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={m.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: op,
                transform: `translateX(${slide}px)`,
                padding: "12px 16px",
                background: "rgba(22,25,36,0.85)",
                borderRadius: 10,
                borderLeft: `4px solid ${m.color}`,
                boxShadow: `inset 0 0 0 1px ${COLORS.grid}`,
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  color: m.color,
                  width: 220,
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  color: COLORS.fg,
                  lineHeight: 1.35,
                }}
              >
                {m.role}
              </div>
            </div>
          );
        })}
      </div>
      <FadeText
        delay={250}
        style={{
          fontSize: 18,
          color: COLORS.fgDim,
          fontFamily: "JetBrains Mono, monospace",
          textAlign: "center",
          marginTop: 22,
          letterSpacing: 2,
        }}
      >
        20 FILES · 5 FUNCTIONS PER FILE · 25 LINES PER FUNCTION
      </FadeText>
    </AbsoluteFill>
  );
};
