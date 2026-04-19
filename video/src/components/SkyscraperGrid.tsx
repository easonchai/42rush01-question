import React from 'react';
import {COLORS, HEIGHT_COLORS} from '../constants';

type Props = {
  n: number;
  // Value at each cell: 0 = undetermined; otherwise 1..n
  cells: number[][];
  // Clues on the 4 sides; length n each
  colUp: number[];
  colDown: number[];
  rowLeft: number[];
  rowRight: number[];
  // cells that should pulse (e.g. just changed)
  highlights?: Array<[number, number]>;
  // ghost opacity for undetermined
  ghostOpacity?: number;
  // scale factor
  scale?: number;
  label?: string;
};

/**
 * Pseudo-3D isometric grid of skyscrapers. Each tower's height in world units
 * is its value; undetermined cells render as a short translucent placeholder.
 * Rendering is pure CSS — no canvas / SVG transforms — so it stays readable in
 * a rendered MP4.
 */
export const SkyscraperGrid: React.FC<Props> = ({
  n,
  cells,
  colUp,
  colDown,
  rowLeft,
  rowRight,
  highlights = [],
  ghostOpacity = 0.35,
  scale = 1,
  label,
}) => {
  // Tile geometry (px)
  const tile = 80 * scale;
  const unit = 24 * scale;
  const skew = 0.5; // iso skew factor
  const gridPx = n * tile;
  const maxTowerPx = n * unit;
  const canvasW = gridPx + gridPx * skew + 160;
  const canvasH = gridPx + maxTowerPx + 160;
  const isHighlighted = (r: number, c: number) =>
    highlights.some(([hr, hc]) => hr === r && hc === c);

  const towers: React.ReactElement[] = [];
  // back-to-front iso order: smaller (r + c) drawn last in screen space
  const cellOrder: Array<[number, number]> = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) cellOrder.push([r, c]);
  }
  cellOrder.sort((a, b) => b[0] + b[1] - (a[0] + a[1]));
  // reverse so back renders first
  cellOrder.reverse();

  for (const [r, c] of cellOrder) {
    const val = cells[r][c];
    const hPx = val > 0 ? val * unit : unit * 0.4;
    const color = val > 0 ? HEIGHT_COLORS[Math.min(val - 1, 8)] : '#3a4256';
    const opacity = val > 0 ? 1 : ghostOpacity;
    const highlight = isHighlighted(r, c);
    // isometric placement: x = c*tile + r*tile*skew/2, y = r*tile*0.5
    const x = c * tile + r * tile * skew * 0.5 + 80;
    const y = r * tile * 0.5 + maxTowerPx + 80 - hPx;
    towers.push(
      <div
        key={`${r}-${c}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: tile,
          height: hPx,
          transition: 'none',
          filter: highlight
            ? 'brightness(1.6) drop-shadow(0 0 12px #fff)'
            : 'none',
        }}
      >
        {/* Top face */}
        <div
          style={{
            position: 'absolute',
            top: -tile * skew * 0.5,
            left: 0,
            width: tile,
            height: tile * skew,
            background: shade(color, 1.0),
            opacity,
            transform: 'skewX(-45deg) scaleY(1)',
            transformOrigin: 'bottom left',
            borderTop: '1px solid rgba(255,255,255,0.4)',
          }}
        />
        {/* Front face */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: tile,
            height: hPx,
            background: shade(color, 0.75),
            opacity,
            borderRight: '1px solid rgba(0,0,0,0.3)',
          }}
        />
        {/* Right face */}
        <div
          style={{
            position: 'absolute',
            top: -tile * skew * 0.25,
            left: tile,
            width: tile * skew * 0.5,
            height: hPx,
            background: shade(color, 0.5),
            opacity,
            transform: 'skewY(-26.5deg)',
            transformOrigin: 'top left',
          }}
        />
        {val > 0 && (
          <div
            style={{
              position: 'absolute',
              top: hPx / 2 - 14,
              left: tile / 2 - 12,
              width: 24,
              height: 28,
              color: '#fff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 22 * scale,
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(0,0,0,0.9)',
              textAlign: 'center',
              lineHeight: '28px',
              opacity,
            }}
          >
            {val}
          </div>
        )}
      </div>,
    );
  }

  // clues (fixed to canvas, outside grid)
  const cluePositions: React.ReactElement[] = [];
  const cluFont = 20 * scale;
  for (let c = 0; c < n; c++) {
    // top (col_up)
    cluePositions.push(
      <div
        key={`u${c}`}
        style={{
          position: 'absolute',
          left: c * tile + (n - 1) * tile * skew * 0.5 + 80 + tile / 2 - 10,
          top: 40,
          color: COLORS.gold,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: cluFont,
          fontWeight: 600,
        }}
      >
        {colUp[c]}
      </div>,
    );
    // bottom (col_down)
    cluePositions.push(
      <div
        key={`d${c}`}
        style={{
          position: 'absolute',
          left: c * tile + 80 + tile / 2 - 10,
          top: maxTowerPx + gridPx * 0.5 + 100,
          color: COLORS.gold,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: cluFont,
          fontWeight: 600,
        }}
      >
        {colDown[c]}
      </div>,
    );
  }
  for (let r = 0; r < n; r++) {
    // left (row_left)
    cluePositions.push(
      <div
        key={`l${r}`}
        style={{
          position: 'absolute',
          left: r * tile * skew * 0.5 + 40,
          top: r * tile * 0.5 + maxTowerPx + 40,
          color: COLORS.gold,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: cluFont,
          fontWeight: 600,
        }}
      >
        {rowLeft[r]}
      </div>,
    );
    // right (row_right)
    cluePositions.push(
      <div
        key={`rr${r}`}
        style={{
          position: 'absolute',
          left: gridPx + r * tile * skew * 0.5 + 90,
          top: r * tile * 0.5 + maxTowerPx + 40,
          color: COLORS.gold,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: cluFont,
          fontWeight: 600,
        }}
      >
        {rowRight[r]}
      </div>,
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: canvasW,
        height: canvasH,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {/* ground tint */}
      <div
        style={{
          position: 'absolute',
          top: maxTowerPx + 80,
          left: 80,
          width: gridPx,
          height: gridPx * 0.5,
          background: '#1a1f2e',
          transform: 'skewX(-45deg) scaleY(1)',
          transformOrigin: 'top left',
          borderRadius: 4,
          opacity: 0.6,
        }}
      />
      {towers}
      {cluePositions}
      {label && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 8,
            width: '100%',
            textAlign: 'center',
            color: COLORS.fgDim,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 18 * scale,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

function shade(hex: string, factor: number): string {
  const r = Math.round(
    Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) * factor)),
  );
  const g = Math.round(
    Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) * factor)),
  );
  const b = Math.round(
    Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) * factor)),
  );
  return `rgb(${r},${g},${b})`;
}
