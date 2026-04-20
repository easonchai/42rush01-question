#!/usr/bin/env bash
set -euo pipefail

VOICE="${VOICE:-Daniel}"
RATE="${RATE:-185}"
OUT="$(dirname "$0")/../public/audio"
TMP="$(mktemp -d)"
mkdir -p "$OUT"

say_scene() {
  local name="$1"
  local text="$2"
  echo "  → ${name}"
  say -v "$VOICE" -r "$RATE" -o "$TMP/${name}.aiff" "$text"
  ffmpeg -y -i "$TMP/${name}.aiff" -c:a libmp3lame -b:a 160k "$OUT/${name}.mp3" -loglevel error
}

say_scene "intro" \
  "The Skyscraper Puzzle. How a small change in perspective beats twenty minutes of brute force."

say_scene "problem" \
  "Fill an N by N grid with towers, heights one to N. Each row and column uses every height once. The yellow numbers are clues: stand on that side and count the towers you can see. Taller towers hide shorter ones."

say_scene "bruteforce" \
  "Option one. Try every combination. Fill cell one, then the next, backtrack when it fails. For nine by nine there are ten to the seventy seven possibilities. More than atoms in the universe. Takes twenty minutes."

say_scene "csp" \
  "Option two. Be a detective. Keep the set of possible values per cell and cross them off. That works for sudoku. But a skyscraper clue isn't about one cell. It describes a whole row at once. Cell by cell reasoning can't capture that."

say_scene "wfc" \
  "Option three. Reason about whole rows at once. Step one, list every legal row. Step two, same for every column. Step three, cross-check at each cell. The row's options intersected with the column's options. Step four, kill whatever disagrees, then repeat. On most puzzles this finishes with no guessing at all."

say_scene "code" \
  "The solver is pure C. Parse reads the clues. Permgen lists every legal row. Propagate cross-checks rows against columns. Search only steps in if propagation stalls. Output prints the grid. Twenty files."

say_scene "perf" \
  "The numbers. For small N, both builds solve in milliseconds. At nine by nine, brute force takes twenty minutes; the forty-two submission takes two hundred fifty; optimized lands at forty. About thirty thousand times faster."

say_scene "outro" \
  "Brute force: twenty minutes. Cell level C S P: can't see whole rows. Line level wave function collapse: forty milliseconds. The right abstraction beats raw power."

echo "Done. Audio in $OUT"
