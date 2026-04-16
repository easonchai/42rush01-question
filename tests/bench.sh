#!/bin/bash
# Multi-run benchmark + exhaustive correctness check.
# For each N in 3..9:
#   - Generate 30 random puzzles (fresh seeds each run).
#   - Solve with rush-01, verify output is a valid Latin square matching clues.
#   - Measure wall-clock time.
# Report min / median / max / mean per N.
# Repeat the whole thing RUNS times; fail if any correctness check fails.

set -u
cd "$(dirname "$0")/.."
RUSH=./ex00/rush-01
GEN=./tests/gen_puzzle
VER=./tests/verify
TMP=$(mktemp -d)
trap "rm -rf $TMP" EXIT

if [ ! -x "$RUSH" ]; then (cd ex00 && cc -Wall -Wextra -Werror -o rush-01 *.c) || exit 1; fi
if [ ! -x "$GEN" ]; then cc -O2 -o tests/gen_puzzle tests/gen_puzzle.c || exit 1; fi
if [ ! -x "$VER" ]; then cc -O2 -o tests/verify tests/verify.c || exit 1; fi

RUNS=${RUNS:-3}
PUZZLES=${PUZZLES:-30}
fail=0
pass=0

echo "runs=$RUNS puzzles_per_N=$PUZZLES"

for N in 3 4 5 6 7 8 9; do
    all_times=""
    for r in $(seq 1 $RUNS); do
        for i in $(seq 1 $PUZZLES); do
            SEED=$(( r * 1000 + i ))
            CLUE=$("$GEN" "$N" "$SEED" 2>/dev/null)
            if [ -z "$CLUE" ]; then fail=$((fail+1)); echo "GEN FAIL N=$N seed=$SEED"; continue; fi
            T0=$(date +%s%N)
            OUT=$("$RUSH" "$CLUE")
            T1=$(date +%s%N)
            US=$(( (T1 - T0) / 1000 ))
            if [ "$OUT" = "Error" ]; then
                fail=$((fail+1)); echo "SOLVER ERR N=$N seed=$SEED clue=$CLUE"; continue
            fi
            echo "$OUT" > "$TMP/out.txt"
            VRES=$("$VER" "$N" "$CLUE" "$TMP/out.txt")
            if [ "$VRES" != "OK" ]; then
                fail=$((fail+1)); echo "VERIFY FAIL N=$N seed=$SEED: $VRES"
                echo "  clue: $CLUE"
                echo "  out:"
                sed 's/^/    /' "$TMP/out.txt"
                continue
            fi
            pass=$((pass+1))
            all_times="$all_times $US"
        done
    done
    # compute stats
    echo "$all_times" | tr ' ' '\n' | grep -E '^[0-9]+$' | sort -n > "$TMP/times.txt"
    python3 - <<EOF
import statistics
vals = [int(x) for x in open("$TMP/times.txt").read().split()]
if not vals:
    print("N=$N no data")
else:
    mn, mx = min(vals), max(vals)
    med = statistics.median(vals)
    mean = statistics.mean(vals)
    print(f"N=$N  n={len(vals):3d}  min={mn/1000:7.2f}ms  med={med/1000:7.2f}ms  mean={mean/1000:7.2f}ms  max={mx/1000:7.2f}ms")
EOF
done

echo
echo "TOTAL passed=$pass failed=$fail"
[ "$fail" = "0" ]
