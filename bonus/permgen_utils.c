/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   permgen_utils.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	factorial(int n)
{
	int	r;
	int	i;

	r = 1;
	i = 2;
	while (i <= n)
	{
		r *= i;
		i++;
	}
	return (r);
}

void	compute_offsets(t_state *st)
{
	int	a;
	int	b;
	int	off;

	off = 0;
	a = 1;
	while (a <= st->n)
	{
		b = 1;
		while (b <= st->n)
		{
			st->pool_start[a][b] = off;
			st->pool_fill[a][b] = 0;
			off += st->pool_count[a][b];
			b++;
		}
		a++;
	}
}

static void	bind_one(t_line *line, t_state *st)
{
	int	lc;
	int	rc;

	lc = line->left_clue;
	rc = line->right_clue;
	line->perms = &st->pool_arena[st->pool_start[lc][rc]];
	line->count = st->pool_count[lc][rc];
}

void	bind_lines(t_state *st)
{
	int	i;

	i = 0;
	while (i < st->n)
	{
		bind_one(&st->row[i], st);
		bind_one(&st->col[i], st);
		i++;
	}
}
