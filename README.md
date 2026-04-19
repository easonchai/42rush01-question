# Rush-01 — Skyscraper Puzzle Solver

Solver for the 42 Rush-01 Skyscraper (Towers) puzzle, supporting N = 3..9.

## Algorithm

Wave-function-collapse at the **line level** with two-sided constraint
propagation. Rather than reasoning about individual cells (where the visibility
clue is non-local and hard to propagate tightly), each row and each column is
modeled as a variable whose domain is the set of N-permutations consistent with
its two edge clues.

The core loop:

1. **Bucket-classify** all N! permutations by their (left_visible, right_visible)
   pair in a single pass into a flat arena. Each line gets a non-owning view
   into the bucket for its clue pair.
2. **Project** each line's alive permutations to per-position value bitmasks
   (`pos_val[p]` = OR over alive perms of `1 << (perm[p] - 1)`).
3. **Intersect** at each cell: `cell[r][c] = row[r].pos_val[c] & col[c].pos_val[r]`.
   Any value removed from a cell kills all perms in its row/col that would have
   placed that value there.
4. **Fixed-point** loop: repeat (2)–(3) until nothing changes.
5. **Search** only if cells remain undetermined: pick the line with the
   fewest alive perms (MRV), commit each candidate in turn, propagate,
   recurse, restore on failure.

Key facts (from Khovanova's skyscraper-numbers result) that make this tractable:
- The number of N-permutations with a given (left, right) pair is
  `f_N(a,b) = Σ_k C(N-1, k) · c(k, a-1) · c(N-1-k, b-1)` where `c` is the
  unsigned Stirling number of the first kind (LR-maxima counts).
- `f_N(a,b) = 0` iff `a + b > N + 1`.
- For N=9 the largest bucket is under 14,000 perms; typical lines far smaller.

## Two build variants

| Variant | Directory | Compiler flags | Libraries | Norminette | Intended for |
|---|---|---|---|---|---|
| **norm** | `ex00/` | `-Wall -Wextra -Werror` | `write`, `malloc`, `free` only | ✅ clean | 42 submission |
| **fast** | `bonus/` | `-O3 -march=native -pthread` | + `pthread`, `string.h`, compiler intrinsics | n/a | raw performance |

Both solve the exact same puzzles with the same algorithm; the `bonus/` version
adds compiler intrinsics (`__builtin_popcount`, `__builtin_ctzll` → single
CPU instructions) and parallelizes the N! bucket-generation phase across
one thread per starting value using pthreads.

### Build and run

```
make norm              # builds ex00/rush-01 (42-submission)
make fast              # builds bonus/rush-01 (optimized)
make all               # both

./ex00/rush-01  "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2"
./bonus/rush-01 "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2"
```

Clue order: `c1_up .. cN_up c1_down .. cN_down r1_left .. rN_left r1_right .. rN_right`.
Error input → prints `Error\n`.

### Tests

```
make test              # run 152-case suite against ex00
make test-fast         # same suite against bonus
make bench             # side-by-side benchmark of both
RUNS=5 PUZZLES=50 RUSH_BIN=./bonus/rush-01 bash tests/bench.sh   # ad-hoc
```

### Measured performance (3 runs × 30 random puzzles per N)

```
                ex00 (norminette)           bonus (-O3 + pthreads)
N   median       mean       max          median       mean        max
3   11.8ms      11.9ms     19.2ms         13.3ms     13.3ms      16.7ms
4   12.0ms      12.0ms     17.2ms         13.7ms     14.0ms      18.0ms
5   12.1ms      12.5ms     16.4ms         15.0ms     15.5ms      35.5ms
6   12.2ms      12.6ms     32.2ms         15.3ms     15.5ms      18.5ms
7   14.9ms      15.1ms     22.0ms         16.0ms     16.6ms      39.1ms
8   37.0ms      39.9ms     88.3ms         19.5ms     19.9ms      27.7ms
9  252.8ms     292.4ms   2086.3ms         41.5ms     49.0ms     389.7ms
```

For small N, thread-creation overhead outweighs the parallel gain. For N=8
and N=9 the bonus version is 2-6× faster. The ex00 version remains the
reference for 42 submission and compiles cleanly under norminette.

(For reference: naive cell-level backtracking takes ~20 minutes on N=9.
Both our versions are ~3000-30000× faster.)

## File layout

Files are split across 20 translation units to satisfy Norminette's
5-functions-per-file and 25-lines-per-function limits while keeping each
module's responsibility focused.

```
ex00/
  rush01.h              types (t_u*, t_line, t_state, t_snap), constants, prototypes
  main.c                argv dispatch, top-level orchestration
  parse.c               tokenize, read_int, validate range
  parse_utils.c         count_tokens, infer_n
  precheck.c            opposite-clue pair validity (a+b <= n+1)
  visibility.c          count_visible_{left,right} over packed perms
  permgen.c             bucket-classify all N! perms into a flat arena
  permgen_utils.c       factorial, compute_offsets, bind_lines
  domain.c              popcount16, ctz16, ctzll (log-time)
  bitset.c              bitset get/set/clear, sizing
  state.c               init: clue install, cell domain init, line generation
  state_free.c          line alive-bitmap alloc + state teardown
  propagate.c           fixed-point loop, cell intersection
  propagate_posval.c    recompute pos_val from alive perms (word iteration)
  propagate_kill.c      kill perms whose value at a given pos is now forbidden
  search.c              solve() entry, try_candidate, recursive search_line
  search_mrv.c          is_solved, pick_mrv_line (minimum remaining values)
  search_snap.c         snapshot state for backtracking
  search_restore.c      restore state on failed branch
  output.c              format grid → single write; emit "Error\n"
  Makefile

tests/
  gen_puzzle.c          generate random Latin square, emit 4N clues
  verify.c              validate solver output: Latin square + clue match
  run_tests.sh          PDF case + error paths + N=3..9 × 20 seeds (152 checks)
  bench.sh              multi-run correctness + timing stats
  add_header.py         helper to insert 42 headers into source files
  debug_main.c          optional debug harness that dumps intermediate state
  debug_dump.c          helper for the above
```

## Constraints honored

- Only `write`, `malloc`, `free` — no other libc function calls in `ex00/`.
- Compiles clean with `cc -Wall -Wextra -Werror`.
- Passes `norminette` with zero errors across all 20 files.
- Binary is named `rush-01` per subject.
- Input is a single quoted argv string; any malformation → `Error\n`.
- No parallelization in this version.
