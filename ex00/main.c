#include "rush01.h"

int	main(int argc, char **argv)
{
	int		clues[4 * MAX_N];
	int		n;
	t_state	st;

	if (argc != 2)
	{
		emit_error();
		return (0);
	}
	if (!parse_input(argv[1], clues, &n))
	{
		emit_error();
		return (0);
	}
	if (!precheck_clues(clues, n))
	{
		emit_error();
		return (0);
	}
	if (!state_init(&st, clues, n))
	{
		state_free(&st);
		emit_error();
		return (0);
	}
	if (!propagate(&st) || !solve(&st))
	{
		state_free(&st);
		emit_error();
		return (0);
	}
	emit_solution(&st);
	state_free(&st);
	return (0);
}
