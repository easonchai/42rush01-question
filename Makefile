# Root Makefile — dispatches to ex00/ (norminette-compliant) or bonus/ (fast).
#
#   make norm    build ex00/rush-01  (norminette-compliant, -Wall -Wextra -Werror)
#   make fast    build bonus/rush-01 (-O3 -march=native, pthread-parallel gen)
#   make all     build both
#   make test    run full test suite against ex00/rush-01
#   make test-fast   same, against bonus/rush-01
#   make bench   benchmark both versions side-by-side
#   make clean   remove object files from both
#   make fclean  remove objects and binaries from both

.PHONY: all norm fast test test-fast bench clean fclean re

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

clean:
	$(MAKE) -C ex00 clean
	$(MAKE) -C bonus clean

fclean:
	$(MAKE) -C ex00 fclean
	$(MAKE) -C bonus fclean

re: fclean all
