import React from "react";
import { COLORS, HEIGHT_COLORS } from "../constants";

type Props = {
  n: number;
  // Value at each cell: 0 = undetermined; otherwise 1..n
  cells: number[][];
  colUp: number[];
  colDown: number[];
  rowLeft: number[];
  rowRight: number[];
  highlights?: Array<[number, number]>;
  ghostOpacity?: number;
  scale?: number;
  label?: string;
  // Global rise 0..1; scales every tower's height.
  rise?: number;
  // Per-cell rise override (takes precedence over `rise`).
  cellRise?: number[][];
  // Per-cell opacity override.
  cellOpacity?: number[][];
  // Line-of-sight rays from a side ("up" | "down" | "left" | "right"),
  // originating at index `index`, counting up to `count` visible towers.
  sightRay?: { side: "up" | "down" | "left" | "right"; index: number; heights: number[]; reveal: number };
  showClues?: boolean;
};

/**
 * Dimetric isometric grid rendered in SVG. Each tile (c, r, z) projects to
 *   x = (c - r) * W
 *   y = (c + r) * H - z * U
 * so the "top" corner of the grid is at the top of the screen and +r / +c go
 * down-left / down-right respectively. Painting order is ascending (r + c) —
 * the classic painter's algorithm for iso cubes.
 */
export const SkyscraperGrid: React.FC<Props> = ({
  n,
  cells,
  colUp,
  colDown,
  rowLeft,
  rowRight,
  highlights = [],
  ghostOpacity = 0.3,
  scale = 1,
  label,
  rise = 1,
  cellRise,
  cellOpacity,
  sightRay,
  showClues = true,
}) => {
  const W = 40 * scale;
  const H = 20 * scale;
  const U = 26 * scale;

  const project = (c: number, r: number, z: number) => ({
    x: (c - r) * W,
    y: (c + r) * H - z * U,
  });

  const clueSpace = 52 * scale;
  const minX = -n * W - clueSpace;
  const maxX = n * W + clueSpace;
  const minY = -n * U - clueSpace;
  const maxY = 2 * n * H + clueSpace + (label ? 24 : 0);
  const viewW = maxX - minX;
  const viewH = maxY - minY;

  const isHighlight = (r: number, c: number) =>
    highlights.some(([hr, hc]) => hr === r && hc === c);

  // Ground diamond
  const groundCorners = [
    project(0, 0, 0),
    project(n, 0, 0),
    project(n, n, 0),
    project(0, n, 0),
  ];
  const groundPts = groundCorners.map((p) => `${p.x},${p.y}`).join(" ");

  // Ground grid lines
  const gridLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i <= n; i++) {
    const a = project(i, 0, 0);
    const b = project(i, n, 0);
    gridLines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    const c_ = project(0, i, 0);
    const d = project(n, i, 0);
    gridLines.push({ x1: c_.x, y1: c_.y, x2: d.x, y2: d.y });
  }

  // Cells back-to-front
  const orderedCells: Array<{ r: number; c: number; val: number }> = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      orderedCells.push({ r, c, val: cells[r][c] });
    }
  }
  orderedCells.sort((a, b) => a.r + a.c - (b.r + b.c));

  const towers = orderedCells.map(({ r, c, val }) => {
    const t = cellRise ? cellRise[r][c] : rise;
    if (t <= 0) return null;
    const baseH = val > 0 ? val : 0.35;
    const h = baseH * t;
    if (h < 0.02) return null;
    const color = val > 0 ? HEIGHT_COLORS[Math.min(val - 1, 8)] : "#3b435a";
    const opOverride = cellOpacity ? cellOpacity[r][c] : undefined;
    const opacity = opOverride !== undefined ? opOverride : val > 0 ? 1 : ghostOpacity;

    const A = project(c, r, h);
    const B = project(c + 1, r, h);
    const C = project(c + 1, r + 1, h);
    const D = project(c, r + 1, h);
    const C0 = project(c + 1, r + 1, 0);
    const D0 = project(c, r + 1, 0);
    const B0 = project(c + 1, r, 0);

    const topPts = [A, B, C, D].map((p) => `${p.x},${p.y}`).join(" ");
    const frontPts = [D, C, C0, D0].map((p) => `${p.x},${p.y}`).join(" ");
    const rightPts = [B, C, C0, B0].map((p) => `${p.x},${p.y}`).join(" ");

    const hl = isHighlight(r, c);
    const labelPos = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };

    return (
      <g key={`${r}-${c}`} opacity={opacity} filter={hl ? "url(#skGlow)" : undefined}>
        <polygon points={rightPts} fill={shade(color, 0.5)} />
        <polygon points={frontPts} fill={shade(color, 0.78)} />
        <polygon
          points={topPts}
          fill={shade(color, 1.08)}
          stroke={hl ? "#fff" : shade(color, 1.3)}
          strokeWidth={hl ? 2 : 1}
        />
        {val > 0 && t > 0.8 && (
          <text
            x={labelPos.x}
            y={labelPos.y + 5 * scale}
            textAnchor="middle"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 16 * scale,
              fontWeight: 700,
              fill: "#fff",
              paintOrder: "stroke",
              stroke: "rgba(0,0,0,0.7)",
              strokeWidth: 3,
            }}
          >
            {val}
          </text>
        )}
      </g>
    );
  });

  // Clues
  const clueElements: React.ReactElement[] = [];
  if (showClues) {
    const off = 0.55;
    for (let c = 0; c < n; c++) {
      const up = project(c + 0.5, -off, 0);
      clueElements.push(
        <text
          key={`u${c}`}
          x={up.x}
          y={up.y + 7 * scale}
          textAnchor="middle"
          style={{ fill: COLORS.gold, fontFamily: "JetBrains Mono, monospace", fontSize: 20 * scale, fontWeight: 700 }}
        >
          {colUp[c]}
        </text>,
      );
      const down = project(c + 0.5, n + off, 0);
      clueElements.push(
        <text
          key={`d${c}`}
          x={down.x}
          y={down.y + 7 * scale}
          textAnchor="middle"
          style={{ fill: COLORS.gold, fontFamily: "JetBrains Mono, monospace", fontSize: 20 * scale, fontWeight: 700 }}
        >
          {colDown[c]}
        </text>,
      );
    }
    for (let r = 0; r < n; r++) {
      const left = project(-off, r + 0.5, 0);
      clueElements.push(
        <text
          key={`l${r}`}
          x={left.x}
          y={left.y + 7 * scale}
          textAnchor="middle"
          style={{ fill: COLORS.gold, fontFamily: "JetBrains Mono, monospace", fontSize: 20 * scale, fontWeight: 700 }}
        >
          {rowLeft[r]}
        </text>,
      );
      const right = project(n + off, r + 0.5, 0);
      clueElements.push(
        <text
          key={`rr${r}`}
          x={right.x}
          y={right.y + 7 * scale}
          textAnchor="middle"
          style={{ fill: COLORS.gold, fontFamily: "JetBrains Mono, monospace", fontSize: 20 * scale, fontWeight: 700 }}
        >
          {rowRight[r]}
        </text>,
      );
    }
  }

  // Sight ray: segment(s) from the clue point toward the line, drawn on top.
  let rayNode: React.ReactElement | null = null;
  if (sightRay) {
    const { side, index, heights, reveal } = sightRay;
    // Build sequence of segment anchors along the line at z=0.
    const stops: Array<{ x: number; y: number }> = [];
    if (side === "left") {
      stops.push(project(-0.55, index + 0.5, 0));
      for (let c = 0; c < n; c++) stops.push(project(c + 0.5, index + 0.5, Math.max(heights[c], 0)));
    } else if (side === "right") {
      stops.push(project(n + 0.55, index + 0.5, 0));
      for (let c = n - 1; c >= 0; c--) stops.push(project(c + 0.5, index + 0.5, Math.max(heights[c], 0)));
    } else if (side === "up") {
      stops.push(project(index + 0.5, -0.55, 0));
      for (let r = 0; r < n; r++) stops.push(project(index + 0.5, r + 0.5, Math.max(heights[r], 0)));
    } else {
      stops.push(project(index + 0.5, n + 0.55, 0));
      for (let r = n - 1; r >= 0; r--) stops.push(project(index + 0.5, r + 0.5, Math.max(heights[r], 0)));
    }
    const path = stops.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    rayNode = (
      <path
        d={path}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={2.5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - reveal}
        style={{ filter: "url(#skGlow)" }}
      />
    );
  }

  return (
    <svg
      viewBox={`${minX} ${minY} ${viewW} ${viewH}`}
      width={viewW}
      height={viewH}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <filter id="skGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={3 * scale} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="groundGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a2032" />
          <stop offset="100%" stopColor="#0f1320" />
        </radialGradient>
      </defs>
      <polygon points={groundPts} fill="url(#groundGrad)" />
      {gridLines.map((l, i) => (
        <line
          key={`gl${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#2a3148"
          strokeWidth={1}
        />
      ))}
      {showClues && clueElements}
      {towers}
      {rayNode}
      {label && (
        <text
          x={0}
          y={maxY - 12}
          textAnchor="middle"
          style={{ fill: COLORS.fgDim, fontFamily: "JetBrains Mono, monospace", fontSize: 16 * scale }}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

function shade(hex: string, factor: number): string {
  if (!hex.startsWith("#")) return hex;
  const r = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) * factor)));
  const g = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) * factor)));
  const b = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) * factor)));
  return `rgb(${r},${g},${b})`;
}
