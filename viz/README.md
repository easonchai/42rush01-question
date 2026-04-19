# Skyscraper 3D Terminal Visualizer

Interactive 3D terminal visualizer for the Skyscraper puzzle solver.
Shows the line-level wave-function-collapse algorithm running in real time,
with a rotatable isometric 3D view of the tower grid.

## Requirements

- Python 3.6+ (standard library only — no `pip install` needed)
- A terminal that supports 24-bit (truecolor) ANSI (most modern terminals,
  including iTerm2, kitty, Alacritty, Windows Terminal, and recent GNOME
  Terminal)
- Terminal size ≥ 60×20 characters

## Usage

From the repo root:

```
python3 viz/skyscraper_viz.py "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2"
```

Or via the Makefile:

```
make viz                 # runs the PDF N=4 example
make viz CLUES="2 1 4 4 3 4 4 3 4 5 5 2 3 3 2 1 4 4 2 1 4 3 6 3 3 5 4 3 3 3 1 2 2 3 3 2"
```

## Controls

| Key              | Action                                |
|------------------|---------------------------------------|
| `space` / `k`    | Step the algorithm once               |
| `enter` / `p`    | Toggle auto-play                      |
| `←` / `→`        | Rotate azimuth ±15°                  |
| `↑` / `↓`        | Tilt elevation ±10°                  |
| `+` / `-`        | Zoom in / out                         |
| `r`              | Reset to initial (undetermined) state |
| `q` / `ESC`      | Quit                                  |

## What you see

- **Determined cells** render as full-colored 3D towers. Height and hue are
  mapped from the tower's value: 1 = cyan → N = red.
- **Undetermined cells** render as pale ghost towers at the average of their
  remaining possible heights.
- **Contradictions** render in bright red with a flat marker.
- **HUD** (bottom of screen):
  - Phase: `init` → `propagate` → `search` (if needed) → `solved` /
    `contradiction`.
  - Step counter: incremented every time a cell's domain shrinks.
  - Determined ratio: `X/N²` cells with a unique value.
  - Current camera (azimuth / elevation / zoom).
  - All 4N input clue values.

The 3 visible faces of each tower are shaded differently (top brightest,
front medium, side darkest) to give a proper isometric look.

## Testing without a TTY

Headless render mode (single frame of the solved state to stdout, no curses):

```
python3 viz/skyscraper_viz.py --test "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2"
```

This prints the ANSI frame, the HUD text, and the plain-text final grid.
It's how correctness was cross-checked against the C solver: 70/70 random
puzzles N=3..9 produced visualizer solutions that validated as correct
Latin squares matching their clues.

## Implementation notes

- Single-file Python, ~500 lines, stdlib only.
- Solver is the same **line-level WFC** as `ex00/` / `bonus/`: enumerate N!
  perms once, bucket by `(left_visible, right_visible)`, project each line's
  alive perms to per-position value bitmasks, intersect at cells, kill
  dead perms, loop to fixed point. Backtracking (MRV line + snapshot/restore)
  when propagation doesn't finish the puzzle.
- 3D renderer uses a half-block pixel buffer (`▀` / `▄`, U+2580/U+2584) for
  2× vertical resolution per character row. Faces are rasterized via a
  convex-quad scan (painter's algorithm plus a per-pixel depth buffer).
- Tower color is height-mapped through HSV; face shading (100/75/50 %) is
  applied per face to simulate lighting.
