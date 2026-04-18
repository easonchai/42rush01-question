#!/bin/bash
# End-to-end test harness.
#  1) PDF known-answer test for N=4.
#  2) Random Latin-square tests for N=3..9: gen_puzzle produces clues, rush-01
#     solves, verify checks output is a valid Latin square matching the clues.
#  3) Error-path tests: malformed inputs must produce "Error" exactly.
#  4) Performance timing for N=9.

set -u
cd "$(dirname "$0")/.."
RUSH=./ex00/rush-01
GEN=./tests/gen_puzzle
VER=./tests/verify
TMP=$(mktemp -d)
trap "rm -rf $TMP" EXIT

pass=0
fail=0

# ---- Build if missing ----
if [ ! -x "$RUSH" ]; then
    (cd ex00 && cc -Wall -Wextra -Werror -o rush-01 *.c) || exit 1
fi
if [ ! -x "$GEN" ]; then
    cc -O2 -o tests/gen_puzzle tests/gen_puzzle.c || exit 1
fi
if [ ! -x "$VER" ]; then
    cc -O2 -o tests/verify tests/verify.c || exit 1
fi

report() {
    if [ "$1" = "OK" ]; then pass=$((pass+1)); else fail=$((fail+1)); fi
    printf "  [%s] %s\n" "$1" "$2"
}

# ---- PDF known example ----
echo "=== PDF example (N=4) ==="
EXPECTED="1 2 3 4
2 3 4 1
3 4 1 2
4 1 2 3"
GOT=$("$RUSH" "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2")
if [ "$GOT" = "$EXPECTED" ]; then report OK "pdf-example"; else report FAIL "pdf-example (got: $GOT)"; fi

# ---- Error-path tests ----
echo "=== Error-path tests ==="
check_error() {
    local label="$1"; shift
    local got
    got=$("$RUSH" "$@" 2>&1)
    if [ "$got" = "Error" ]; then report OK "err: $label"; else report FAIL "err: $label (got: $got)"; fi
}
check_error_no_arg() {
    local got
    got=$("$RUSH" 2>&1)
    if [ "$got" = "Error" ]; then report OK "err: no-args"; else report FAIL "err: no-args (got: $got)"; fi
}
check_error_no_arg
check_error "empty-string" ""
check_error "only-spaces" "    "
check_error "not-enough-tokens" "1 2 3 4"
check_error "non-digit" "1 2 a 4 1 2 3 4 1 2 3 4 1 2 3 4"
check_error "out-of-range-zero" "0 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4"
check_error "out-of-range-big" "5 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4"
check_error "infeasible-pair" "4 4 3 2 1 2 2 2 4 3 2 1 1 2 2 2"
check_error "no-solution" "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"
check_error "leading-zero-token" "01 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4"
check_error "too-many-tokens" "1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4 9"

# ---- Random puzzles for N=3..9 ----
for N in 3 4 5 6 7 8 9; do
    echo "=== Random N=$N (20 seeds) ==="
    for SEED in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
        CLUE=$("$GEN" "$N" "$SEED" 2>/dev/null)
        if [ -z "$CLUE" ]; then report FAIL "gen seed=$SEED"; continue; fi
        OUT=$("$RUSH" "$CLUE" 2>&1)
        if [ "$OUT" = "Error" ]; then
            report FAIL "N=$N seed=$SEED solver returned Error for clue: $CLUE"
            continue
        fi
        echo "$OUT" > "$TMP/out.txt"
        RES=$("$VER" "$N" "$CLUE" "$TMP/out.txt")
        if [ "$RES" = "OK" ]; then report OK "N=$N seed=$SEED"; else report FAIL "N=$N seed=$SEED $RES"; fi
    done
done

# ---- Benchmark N=9 ----
echo "=== Benchmark N=9 (10 random puzzles) ==="
for SEED in 100 101 102 103 104 105 106 107 108 109; do
    CLUE=$("$GEN" 9 "$SEED" 2>/dev/null)
    T0=$(date +%s%N)
    OUT=$("$RUSH" "$CLUE")
    T1=$(date +%s%N)
    MS=$(( (T1 - T0) / 1000000 ))
    if [ "$OUT" = "Error" ]; then
        echo "  FAIL N=9 seed=$SEED"; fail=$((fail+1))
    else
        echo "  seed=$SEED time=${MS}ms"
    fi
done

echo
echo "=== SUMMARY ==="
echo "passed: $pass   failed: $fail"
[ "$fail" = "0" ]
