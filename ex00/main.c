/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static int	run_solver(const int *clues, int n)
{
	t_state	st;

	if (!state_init(&st, clues, n))
	{
		state_free(&st);
		return (0);
	}
	if (!propagate(&st) || !solve(&st))
	{
		state_free(&st);
		return (0);
	}
	emit_solution(&st);
	state_free(&st);
	return (1);
}

static int	prepare(int argc, char **argv, int *clues, int *n)
{
	if (argc != 2)
		return (0);
	if (!parse_input(argv[1], clues, n))
		return (0);
	if (!precheck_clues(clues, *n))
		return (0);
	return (1);
}

int	main(int argc, char **argv)
{
	int	clues[4 * MAX_N];
	int	n;

	if (!prepare(argc, argv, clues, &n))
	{
		emit_error();
		return (0);
	}
	if (!run_solver(clues, n))
	{
		emit_error();
		return (0);
	}
	return (0);
}
