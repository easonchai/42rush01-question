/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   state.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static void	zero_line(t_line *line)
{
	int	i;

	line->perms = NULL;
	line->alive = NULL;
	line->count = 0;
	line->alive_count = 0;
	line->left_clue = 0;
	line->right_clue = 0;
	i = 0;
	while (i < MAX_N)
	{
		line->pos_val[i] = 0;
		i++;
	}
}

static void	init_line_clues(t_state *st, const int *clues, int n, int i)
{
	int	j;

	st->col[i].left_clue = clues[i];
	st->col[i].right_clue = clues[n + i];
	st->row[i].left_clue = clues[2 * n + i];
	st->row[i].right_clue = clues[3 * n + i];
	j = 0;
	while (j < n)
	{
		st->cell[i][j] = (t_u16)((1u << n) - 1u);
		j++;
	}
}

static int	finalize_lines(t_state *st, int n)
{
	int	i;

	i = 0;
	while (i < n)
	{
		if (st->row[i].count == 0 || st->col[i].count == 0)
			return (0);
		if (!alloc_line_alive(&st->row[i]))
			return (0);
		if (!alloc_line_alive(&st->col[i]))
			return (0);
		i++;
	}
	return (1);
}

int	state_init(t_state *st, const int *clues, int n)
{
	int	i;

	st->n = n;
	st->pool_arena = NULL;
	i = 0;
	while (i < MAX_N)
	{
		zero_line(&st->row[i]);
		zero_line(&st->col[i]);
		i++;
	}
	i = 0;
	while (i < n)
	{
		init_line_clues(st, clues, n, i);
		i++;
	}
	if (!generate_all_lines(st))
		return (0);
	return (finalize_lines(st, n));
}
