# Root Makefile — dispatches to ex00/ (norminette-compliant) or bonus/ (fast).
#
#   make norm    build ex00/rush-01  (norminette-compliant, -Wall -Wextra -Werror)
#   make fast    build bonus/rush-01 (-O3 -march=native, pthread-parallel gen)
#   make all     build both
#   make test    run internal test suite against ex00/rush-01
#   make test-fast   same, against bonus/rush-01
#   make bench   benchmark both versions side-by-side
#   make test-external   run the hochan222/rush01-tester external suite
#   make viz    launch the 3D terminal visualizer on the PDF N=4 example
#               (override with: make viz CLUES="...")
#   make clean   remove object files from both
#   make fclean  remove objects and binaries from both

.PHONY: all norm fast test test-fast bench test-external viz clean fclean re

CLUES ?= 4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2

all: norm fast

norm:
	$(MAKE) -C ex00

fast:
	$(MAKE) -C bonus

test: norm
	RUSH_BIN=./ex00/rush-01 bash tests/run_tests.sh

test-fast: fast
	RUSH_BIN=./bonus/rush-01 bash tests/run_tests.sh

bench: norm fast
	@echo "=== Benchmarking ex00 (norminette-compliant) ==="
	RUNS=3 PUZZLES=30 RUSH_BIN=./ex00/rush-01 bash tests/bench.sh
	@echo ""
	@echo "=== Benchmarking bonus (-O3 + pthread parallel gen) ==="
	RUNS=3 PUZZLES=30 RUSH_BIN=./bonus/rush-01 bash tests/bench.sh

test-external: norm
	@if [ ! -d rush01-tester ]; then \
		git clone --depth 1 https://github.com/hochan222/rush01-tester.git; \
	fi
	cp ex00/rush-01 rush01-tester/rush01
	cd rush01-tester && echo "" | bash test.sh | tail -5

viz:
	python3 viz/skyscraper_viz.py "$(CLUES)"

viz-test:
	python3 viz/skyscraper_viz.py --test "$(CLUES)"

clean:
	$(MAKE) -C ex00 clean
	$(MAKE) -C bonus clean

fclean:
	$(MAKE) -C ex00 fclean
	$(MAKE) -C bonus fclean

re: fclean all
