#!/usr/bin/env python3
"""
Skyscraper puzzle 3D terminal visualizer.

Shows the line-level wave-function-collapse algorithm solving a Skyscraper
puzzle in real time with an isometric 3D view of the grid.

Controls:
    space / k         step the algorithm once
    enter / p         auto-play (toggle pause)
    r                 reset to initial state
    left/right        rotate azimuth -/+ 15 deg
    up/down           rotate elevation -/+ 10 deg
    + / -             zoom in / out
    q / ESC           quit

Usage:
    python3 viz/skyscraper_viz.py "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2"

Non-interactive self-test (renders final frame to stdout, no TTY needed):
    python3 viz/skyscraper_viz.py --test "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2"

Stdlib only (no pip installs).
"""

import sys
import math
import time
from itertools import permutations


# ---------------------------------------------------------------------------
# Parser (mirrors ex00/parse.c + precheck.c)
# ---------------------------------------------------------------------------

def parse_clues(s):
    """Return (n, clues) or raise ValueError."""
    if not s:
        raise ValueError("empty input")
    tokens = s.split()
    if not tokens:
        raise ValueError("no tokens")
    for t in tokens:
        if not t.isdigit():
            raise ValueError(f"non-digit token: {t!r}")
        if len(t) > 1 and t[0] == "0":
            raise ValueError(f"leading-zero token: {t!r}")
    if len(tokens) % 4 != 0:
        raise ValueError(f"{len(tokens)} tokens not divisible by 4")
    n = len(tokens) // 4
    if n < 3 or n > 9:
        raise ValueError(f"n={n} out of [3..9]")
    clues = [int(t) for t in tokens]
    for c in clues:
        if c < 1 or c > n:
            raise ValueError(f"clue {c} out of [1..{n}]")
    for i in range(n):
        a, b = clues[i], clues[n + i]
        if a + b > n + 1:
            raise ValueError(f"col {i} pair ({a},{b}) infeasible")
        a, b = clues[2 * n + i], clues[3 * n + i]
        if a + b > n + 1:
            raise ValueError(f"row {i} pair ({a},{b}) infeasible")
    return n, clues


# ---------------------------------------------------------------------------
# Visibility + Solver
# ---------------------------------------------------------------------------

def visibility_left(p):
    m = 0
    c = 0
    for v in p:
        if v > m:
            m = v
            c += 1
    return c


def visibility_right(p):
    m = 0
    c = 0
    for v in reversed(p):
        if v > m:
            m = v
            c += 1
    return c


def popcount(x):
    return bin(x).count("1")


def bit_to_value(mask):
    if mask == 0:
        return 0
    return (mask & -mask).bit_length()


class Line:
    __slots__ = ("kind", "idx", "left_clue", "right_clue",
                 "perms", "alive", "alive_count", "pos_val", "initial_count")

    def __init__(self, kind, idx, left_clue, right_clue):
        self.kind = kind
        self.idx = idx
        self.left_clue = left_clue
        self.right_clue = right_clue
        self.perms = []
        self.alive = []
        self.alive_count = 0
        self.pos_val = []
        self.initial_count = 0


class State:
    def __init__(self, n, clues):
        self.n = n
        self.clues = clues
        self.rows = [Line("r", i, clues[2 * n + i], clues[3 * n + i])
                     for i in range(n)]
        self.cols = [Line("c", i, clues[i], clues[n + i]) for i in range(n)]
        self.cells = [[(1 << n) - 1 for _ in range(n)] for _ in range(n)]
        self.phase = "init"
        self.step = 0
        self.last_change = None          # (r, c) for UI highlight
        self.contradiction = None        # (r, c) if unsolvable

        buckets = {}
        for p in permutations(range(1, n + 1)):
            buckets.setdefault((visibility_left(p), visibility_right(p)),
                               []).append(p)
        for line in self.rows + self.cols:
            line.perms = buckets.get((line.left_clue, line.right_clue), [])
            line.alive = [True] * len(line.perms)
            line.alive_count = len(line.perms)
            line.initial_count = line.alive_count

    def clone(self):
        n = self.n
        new = State.__new__(State)
        new.n = n
        new.clues = self.clues
        new.rows = [Line("r", i, r.left_clue, r.right_clue)
                    for i, r in enumerate(self.rows)]
        new.cols = [Line("c", i, c.left_clue, c.right_clue)
                    for i, c in enumerate(self.cols)]
        for src, dst in zip(self.rows + self.cols, new.rows + new.cols):
            dst.perms = src.perms        # shared, immutable
            dst.alive = [True] * len(src.perms)
            dst.alive_count = len(src.perms)
            dst.initial_count = src.initial_count
        new.cells = [[(1 << n) - 1 for _ in range(n)] for _ in range(n)]
        new.phase = "init"
        new.step = 0
        new.last_change = None
        new.contradiction = None
        return new


def recompute_posval(line, n):
    line.pos_val = [0] * n
    for k, al in enumerate(line.alive):
        if al:
            p = line.perms[k]
            for i in range(n):
                line.pos_val[i] |= 1 << (p[i] - 1)


def _propagate_loop(state):
    """Inner fixed-point loop; yields events; returns True/False (ok/contradiction)."""
    n = state.n
    changed = True
    while changed:
        changed = False
        for line in state.rows + state.cols:
            recompute_posval(line, n)
        for r in range(n):
            for c in range(n):
                old = state.cells[r][c]
                new = state.rows[r].pos_val[c] & state.cols[c].pos_val[r]
                if new == 0:
                    state.phase = "contradiction"
                    state.contradiction = (r, c)
                    yield ("contradiction", r, c)
                    return False
                if new != old:
                    removed = old & ~new
                    state.cells[r][c] = new
                    row = state.rows[r]
                    col = state.cols[c]
                    for k, al in enumerate(row.alive):
                        if al and removed & (1 << (row.perms[k][c] - 1)):
                            row.alive[k] = False
                            row.alive_count -= 1
                    for k, al in enumerate(col.alive):
                        if al and removed & (1 << (col.perms[k][r] - 1)):
                            col.alive[k] = False
                            col.alive_count -= 1
                    recompute_posval(row, n)
                    recompute_posval(col, n)
                    state.last_change = (r, c)
                    state.step += 1
                    changed = True
                    yield ("cell", r, c, old, new)
    return True


def _snapshot(state):
    return {
        "cells": [row[:] for row in state.cells],
        "row_alive": [line.alive[:] for line in state.rows],
        "row_count": [line.alive_count for line in state.rows],
        "col_alive": [line.alive[:] for line in state.cols],
        "col_count": [line.alive_count for line in state.cols],
    }


def _restore(state, snap):
    state.cells = [row[:] for row in snap["cells"]]
    for line, a, c in zip(state.rows, snap["row_alive"], snap["row_count"]):
        line.alive = a[:]
        line.alive_count = c
    for line, a, c in zip(state.cols, snap["col_alive"], snap["col_count"]):
        line.alive = a[:]
        line.alive_count = c


def _pick_mrv(state):
    best = None
    best_a = 10 ** 9
    for line in state.rows + state.cols:
        if 1 < line.alive_count < best_a:
            best_a = line.alive_count
            best = line
    return best


def _all_determined(state):
    n = state.n
    return all(popcount(state.cells[r][c]) == 1
               for r in range(n) for c in range(n))


def _search(state):
    """Recursive search generator. Yields events; returns via StopIteration
    with value True (solved) or False (failed)."""
    # Propagate first
    ok = yield from _propagate_loop(state)
    if not ok:
        return False
    if _all_determined(state):
        return True
    line = _pick_mrv(state)
    if line is None:
        return _all_determined(state)
    state.phase = "search"
    yield ("phase", state.phase)
    for k in range(len(line.perms)):
        if not line.alive[k]:
            continue
        snap = _snapshot(state)
        # commit: kill all other perms in this line
        for j in range(len(line.perms)):
            if j != k and line.alive[j]:
                line.alive[j] = False
                line.alive_count -= 1
        yield ("branch", line.kind, line.idx, k)
        solved = yield from _search(state)
        if solved:
            return True
        _restore(state, snap)
        yield ("backtrack", line.kind, line.idx, k)
    return False


def solve_steps(state):
    """Full solver generator (propagation + backtracking)."""
    state.phase = "propagate"
    yield ("phase", state.phase)
    solved = yield from _search(state)
    state.phase = "solved" if solved else ("contradiction" if
                                           state.contradiction else "no_solution")
    yield ("phase", state.phase)


# ---------------------------------------------------------------------------
# 3D projection + rasterizer
# ---------------------------------------------------------------------------

def hsv_to_rgb(h, s, v):
    h = h - math.floor(h)
    i = int(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    i %= 6
    if i == 0: r, g, b = v, t, p
    elif i == 1: r, g, b = q, v, p
    elif i == 2: r, g, b = p, v, t
    elif i == 3: r, g, b = p, q, v
    elif i == 4: r, g, b = t, p, v
    else:       r, g, b = v, p, q
    return (int(r * 255), int(g * 255), int(b * 255))


def height_base_color(h, n):
    if h <= 0 or n <= 0:
        return (80, 80, 80)
    hue = 0.58 - (h - 1) / max(1, n - 1) * 0.58   # N = red, 1 = cyan
    return hsv_to_rgb(hue, 0.75, 0.92)


def shade(rgb, factor):
    return tuple(max(0, min(255, int(c * factor))) for c in rgb)


class Pixels:
    """Half-block pixel buffer. Each cell row = 2 pixel rows."""

    def __init__(self, w, rows):
        self.w = w
        self.rows = rows
        self.ph = rows * 2
        self.fg = [[None] * w for _ in range(self.ph)]
        self.depth = [[float("inf")] * w for _ in range(self.ph)]

    def clear(self):
        for y in range(self.ph):
            row_fg = self.fg[y]
            row_d = self.depth[y]
            for x in range(self.w):
                row_fg[x] = None
                row_d[x] = float("inf")

    def put(self, x, y, rgb, depth):
        if 0 <= x < self.w and 0 <= y < self.ph:
            if depth < self.depth[y][x]:
                self.fg[y][x] = rgb
                self.depth[y][x] = depth

    def to_ansi_lines(self):
        """Return list of (row_index, ansi_string) for the full buffer."""
        out = []
        for row in range(self.rows):
            parts = []
            last_fg = last_bg = None
            ytop = row * 2
            ybot = row * 2 + 1
            for x in range(self.w):
                top = self.fg[ytop][x]
                bot = self.fg[ybot][x]
                if top is None and bot is None:
                    if last_fg is not None or last_bg is not None:
                        parts.append("\033[0m")
                        last_fg = last_bg = None
                    parts.append(" ")
                elif top is not None and bot is None:
                    if top != last_fg:
                        parts.append(f"\033[38;2;{top[0]};{top[1]};{top[2]}m")
                        last_fg = top
                    if last_bg is not None:
                        parts.append("\033[49m")
                        last_bg = None
                    parts.append("\u2580")          # ▀
                elif top is None and bot is not None:
                    if bot != last_fg:
                        parts.append(f"\033[38;2;{bot[0]};{bot[1]};{bot[2]}m")
                        last_fg = bot
                    if last_bg is not None:
                        parts.append("\033[49m")
                        last_bg = None
                    parts.append("\u2584")          # ▄
                else:
                    if top != last_fg:
                        parts.append(f"\033[38;2;{top[0]};{top[1]};{top[2]}m")
                        last_fg = top
                    if bot != last_bg:
                        parts.append(f"\033[48;2;{bot[0]};{bot[1]};{bot[2]}m")
                        last_bg = bot
                    parts.append("\u2580")          # ▀ top-fg, bot-bg
            parts.append("\033[0m")
            out.append((row, "".join(parts)))
        return out


def project(xw, yw, zw, az, el, scale):
    """World -> 2D screen coords (float). Character cells are ~2x taller
    than wide, so we pre-stretch X by 2 to correct aspect."""
    ca, sa = math.cos(az), math.sin(az)
    ce, se = math.cos(el), math.sin(el)
    xr = xw * ca - yw * sa
    yr = xw * sa + yw * ca
    yt = yr * ce - zw * se
    return (xr * scale * 2.0, yt * scale)


def fill_quad(pix, quad, color, depth):
    """Rasterize a convex quadrilateral (4 screen-space corners)."""
    xs = [q[0] for q in quad]
    ys = [q[1] for q in quad]
    minx = max(0, int(math.floor(min(xs))))
    maxx = min(pix.w - 1, int(math.ceil(max(xs))))
    miny = max(0, int(math.floor(min(ys))))
    maxy = min(pix.ph - 1, int(math.ceil(max(ys))))

    def cross(ax, ay, bx, by, px, py):
        return (bx - ax) * (py - ay) - (by - ay) * (px - ax)

    for y in range(miny, maxy + 1):
        py = y + 0.5
        for x in range(minx, maxx + 1):
            px = x + 0.5
            s0 = cross(quad[0][0], quad[0][1], quad[1][0], quad[1][1], px, py)
            s1 = cross(quad[1][0], quad[1][1], quad[2][0], quad[2][1], px, py)
            s2 = cross(quad[2][0], quad[2][1], quad[3][0], quad[3][1], px, py)
            s3 = cross(quad[3][0], quad[3][1], quad[0][0], quad[0][1], px, py)
            pos = s0 >= 0 and s1 >= 0 and s2 >= 0 and s3 >= 0
            neg = s0 <= 0 and s1 <= 0 and s2 <= 0 and s3 <= 0
            if pos or neg:
                pix.put(x, y, color, depth)


def draw_box(pix, cx_w, cy_w, x0, y0, z0, x1, y1, z1,
             az, el, scale, ox, oy, base_color, depth_base):
    """Draw a filled 3D box with 3 visible faces (painter's + depth)."""
    def p(x, y, z):
        sx, sy = project(x - cx_w, y - cy_w, z, az, el, scale)
        return (sx + ox, sy + oy)

    c000 = p(x0, y0, z0); c100 = p(x1, y0, z0)
    c110 = p(x1, y1, z0); c010 = p(x0, y1, z0)
    c001 = p(x0, y0, z1); c101 = p(x1, y0, z1)
    c111 = p(x1, y1, z1); c011 = p(x0, y1, z1)

    top_col   = shade(base_color, 1.00)
    front_col = shade(base_color, 0.75)
    side_col  = shade(base_color, 0.50)

    # top face (z=z1): always visible when elevation > 0
    fill_quad(pix, (c001, c101, c111, c011), top_col, depth_base - 0.3)

    # Decide which two side faces face the camera using normal · view direction.
    # In our projection, the camera looks along -Y_view direction (after rot).
    # A face is visible if its projected area is positive (counterclockwise).
    def ccw_area(a, b, c):
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

    # four side faces: y=y0 (front), x=x1 (right), y=y1 (back), x=x0 (left)
    side_faces = [
        ((c000, c100, c101, c001), front_col, "front"),   # y = y0
        ((c100, c110, c111, c101), side_col,  "right"),   # x = x1
        ((c110, c010, c011, c111), front_col, "back"),    # y = y1
        ((c010, c000, c001, c011), side_col,  "left"),    # x = x0
    ]
    for quad, color, name in side_faces:
        if ccw_area(quad[0], quad[1], quad[2]) < 0:
            fill_quad(pix, quad, color, depth_base)


def compute_depth(r, c, n, az):
    """Approx depth for painter's algo: farther = bigger number.
    Camera faces -y direction in rotated frame; farther means larger y_rot."""
    xw = r - n / 2 + 0.5
    yw = c - n / 2 + 0.5
    # rotate around z by az; y_rot = x*sa + y*ca; farther = more +
    return xw * math.sin(az) + yw * math.cos(az)


# ---------------------------------------------------------------------------
# Scene assembly
# ---------------------------------------------------------------------------

def tower_height_for_cell(cell_mask, n):
    """If fully determined, return the value. If uncertain, return the
    average possible value (float). Also return popcount for ghost alpha."""
    pc = popcount(cell_mask)
    if pc == 0:
        return (0, 0)
    if pc == 1:
        return (float(bit_to_value(cell_mask)), 1)
    total = 0
    count = 0
    m = cell_mask
    while m:
        b = m & -m
        total += b.bit_length()
        count += 1
        m ^= b
    return (total / count, pc)


def render_scene(state, az, el, scale, w, rows, highlight_cell=None):
    pix = Pixels(w, rows)
    n = state.n
    ox = w / 2.0
    oy = rows * 2.0 * 0.60
    cx_w = n / 2.0
    cy_w = n / 2.0

    # Draw the ground plane grid first (back) for context
    ground_color = (30, 32, 42)
    p00 = project(0 - cx_w, 0 - cy_w, 0, az, el, scale)
    p10 = project(n - cx_w, 0 - cy_w, 0, az, el, scale)
    p11 = project(n - cx_w, n - cy_w, 0, az, el, scale)
    p01 = project(0 - cx_w, n - cy_w, 0, az, el, scale)
    ground = [(p00[0] + ox, p00[1] + oy),
              (p10[0] + ox, p10[1] + oy),
              (p11[0] + ox, p11[1] + oy),
              (p01[0] + ox, p01[1] + oy)]
    fill_quad(pix, ground, ground_color, 1e6)

    # Towers, sorted back-to-front
    towers = []
    for r in range(n):
        for c in range(n):
            depth = -compute_depth(r, c, n, az)   # negate: back first
            towers.append((depth, r, c))
    towers.sort()

    for depth, r, c in towers:
        cell = state.cells[r][c]
        h_avg, pc = tower_height_for_cell(cell, n)
        if pc == 0:
            # contradiction marker: red X base
            base = (200, 40, 40)
            draw_box(pix, cx_w, cy_w, r, c, 0, r + 1, c + 1, 0.15,
                     az, el, scale, ox, oy, base, depth)
            continue
        if pc == 1:
            base = height_base_color(int(h_avg), n)
        else:
            # desaturated "ghost" color for uncertain cells
            base = shade(height_base_color(int(round(h_avg)), n), 0.55)
            base = (base[0] // 2 + 40, base[1] // 2 + 40, base[2] // 2 + 50)

        if highlight_cell == (r, c):
            base = (255, 255, 255)       # flash white this frame

        height = max(0.15, h_avg)
        draw_box(pix, cx_w, cy_w, r, c, 0, r + 1, c + 1, height,
                 az, el, scale, ox, oy, base, depth)

    return pix


# ---------------------------------------------------------------------------
# HUD overlay (text drawn over the pixel output)
# ---------------------------------------------------------------------------

def hud_lines(state, az, el, scale, auto_play, steps_total):
    n = state.n
    phase = state.phase
    det_count = sum(1 for r in range(n) for c in range(n)
                    if popcount(state.cells[r][c]) == 1)
    total = n * n
    clue_up = " ".join(str(state.clues[i]) for i in range(n))
    clue_dn = " ".join(str(state.clues[n + i]) for i in range(n))
    clue_l = " ".join(str(state.clues[2 * n + i]) for i in range(n))
    clue_r = " ".join(str(state.clues[3 * n + i]) for i in range(n))

    title = f" SKYSCRAPER  N={n}  phase={phase}  step={state.step}  " \
            f"determined={det_count}/{total} "
    controls = (" [space] step   [enter] autoplay   [←→] az   [↑↓] el   "
                "[+/-] zoom   [r] reset   [q] quit ")
    ap = " AUTO " if auto_play else "      "
    camera = f" az={math.degrees(az):+6.1f}  el={math.degrees(el):+5.1f}  " \
             f"zoom={scale:.1f}  {ap}"
    clues = (f" col_up:   {clue_up}\n"
             f" col_dn:   {clue_dn}\n"
             f" row_l:    {clue_l}\n"
             f" row_r:    {clue_r}")

    # Per-line domain size bar
    bars = []
    for i, line in enumerate(state.rows):
        a = line.alive_count
        bars.append(f"row {i}: {a:4d} / {line.initial_count}")
    for i, line in enumerate(state.cols):
        a = line.alive_count
        bars.append(f"col {i}: {a:4d} / {line.initial_count}")
    return title, controls, camera, clues, bars


# ---------------------------------------------------------------------------
# Interactive curses UI
# ---------------------------------------------------------------------------

def run_interactive(state):
    import curses

    def main(stdscr):
        curses.curs_set(0)
        stdscr.nodelay(True)
        az = math.radians(35)
        el = math.radians(30)
        scale_base = 3.0
        scale = scale_base
        auto = False
        gen = solve_steps(state)
        last_step_time = 0.0
        auto_delay = 0.06
        highlight = None
        highlight_until = 0.0
        finished = False

        while True:
            t = time.time()
            # input
            try:
                key = stdscr.getch()
            except Exception:
                key = -1
            if key == ord("q") or key == 27:
                return
            if key == curses.KEY_LEFT:
                az -= math.radians(15)
            elif key == curses.KEY_RIGHT:
                az += math.radians(15)
            elif key == curses.KEY_UP:
                el = min(math.radians(85), el + math.radians(10))
            elif key == curses.KEY_DOWN:
                el = max(math.radians(-20), el - math.radians(10))
            elif key in (ord("+"), ord("=")):
                scale = min(20.0, scale * 1.2)
            elif key in (ord("-"), ord("_")):
                scale = max(0.8, scale / 1.2)
            elif key in (ord(" "), ord("k")):
                if not finished:
                    try:
                        ev = next(gen)
                        if ev[0] == "cell":
                            highlight = (ev[1], ev[2])
                            highlight_until = t + 0.3
                    except StopIteration:
                        finished = True
            elif key in (10, 13, ord("p")):
                auto = not auto
            elif key == ord("r"):
                state_new = State(state.n, state.clues)
                state.__dict__.update(state_new.__dict__)
                gen = solve_steps(state)
                finished = False
                highlight = None

            if auto and not finished and t - last_step_time >= auto_delay:
                last_step_time = t
                try:
                    ev = next(gen)
                    if ev[0] == "cell":
                        highlight = (ev[1], ev[2])
                        highlight_until = t + 0.15
                    if ev[0] in ("contradiction", "phase") and ev[-1] in (
                            "solved", "need_search", "contradiction"):
                        auto = False
                except StopIteration:
                    finished = True
                    auto = False

            if highlight and t > highlight_until:
                highlight = None

            rows, cols = stdscr.getmaxyx()
            if cols < 60 or rows < 20:
                stdscr.clear()
                stdscr.addstr(0, 0, "Terminal too small (need >= 60x20).")
                stdscr.refresh()
                time.sleep(0.1)
                continue

            # viewport
            view_w = cols
            view_rows = rows - 9        # room for HUD
            if view_rows < 5:
                view_rows = 5
            pix = render_scene(state, az, el, scale,
                               view_w, view_rows, highlight)
            # draw
            stdscr.erase()
            for row_idx, s in pix.to_ansi_lines():
                try:
                    stdscr.addstr(row_idx, 0, s)
                except curses.error:
                    pass

            title, controls, camera, clues, bars = hud_lines(
                state, az, el, scale, auto, state.step)
            hud_y = view_rows
            try:
                stdscr.addstr(hud_y, 0, title[:cols])
                stdscr.addstr(hud_y + 1, 0, controls[:cols])
                stdscr.addstr(hud_y + 2, 0, camera[:cols])
                for i, line in enumerate(clues.split("\n")):
                    stdscr.addstr(hud_y + 4 + i, 0, line[:cols])
            except curses.error:
                pass

            stdscr.refresh()
            time.sleep(0.02)

    curses.wrapper(main)


# ---------------------------------------------------------------------------
# Non-interactive render (for testing without TTY)
# ---------------------------------------------------------------------------

def run_test(state, frames=1, az_deg=35, el_deg=30, scale=3.0,
             w=80, rows=30, solve=True, out=sys.stdout):
    """Render frames to stdout. If solve, run to completion first."""
    if solve:
        for ev in solve_steps(state):
            pass
    az = math.radians(az_deg)
    el = math.radians(el_deg)
    for f in range(frames):
        pix = render_scene(state, az, el, scale, w, rows)
        out.write("\n")
        for row_idx, s in pix.to_ansi_lines():
            out.write(s + "\n")
        title, controls, camera, clues, bars = hud_lines(
            state, az, el, scale, False, state.step)
        out.write(title + "\n")
        out.write(camera + "\n")
        out.write(clues + "\n")
        # Also print the plain grid
        out.write("\ngrid:\n")
        for r in range(state.n):
            row = []
            for c in range(state.n):
                m = state.cells[r][c]
                v = bit_to_value(m) if popcount(m) == 1 else 0
                row.append(str(v) if v else "?")
            out.write(" ".join(row) + "\n")
        az += math.radians(15)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def usage():
    sys.stderr.write(__doc__)
    sys.exit(2)


def main(argv):
    if len(argv) < 2:
        usage()
    args = argv[1:]
    mode = "interactive"
    if args and args[0] == "--test":
        mode = "test"
        args = args[1:]
    if not args:
        usage()
    clue_str = args[0]
    try:
        n, clues = parse_clues(clue_str)
    except ValueError as e:
        sys.stderr.write(f"Error: {e}\n")
        sys.exit(1)
    state = State(n, clues)
    if mode == "test":
        run_test(state, frames=1)
    else:
        run_interactive(state)


if __name__ == "__main__":
    main(sys.argv)
