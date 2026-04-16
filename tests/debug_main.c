#include "../ex00/rush01.h"

void	dbg_state(const t_state *st);

int	main(int argc, char **argv)
{
	int		clues[4 * MAX_N];
	int		n;
	t_state	st;

	if (argc != 2)
		return (1);
	if (!parse_input(argv[1], clues, &n))
	{
		write(1, "parse fail\n", 11);
		return (1);
	}
	if (!precheck_clues(clues, n))
	{
		write(1, "precheck fail\n", 14);
		return (1);
	}
	if (!state_init(&st, clues, n))
	{
		write(1, "state_init fail\n", 16);
		dbg_state(&st);
		state_free(&st);
		return (1);
	}
	write(1, "after init:\n", 12);
	dbg_state(&st);
	if (!propagate(&st))
	{
		write(1, "propagate fail\n", 15);
		dbg_state(&st);
		state_free(&st);
		return (1);
	}
	write(1, "after propagate:\n", 17);
	dbg_state(&st);
	if (!solve(&st))
	{
		write(1, "solve fail\n", 11);
		dbg_state(&st);
		state_free(&st);
		return (1);
	}
	write(1, "solution:\n", 10);
	emit_solution(&st);
	state_free(&st);
	return (0);
}
