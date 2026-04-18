/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   propagate.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	recompute_all_posval(t_state *st)
{
	int	i;

	i = 0;
	while (i < st->n)
	{
		if (!recompute_line_posval(&st->row[i], st->n))
			return (0);
		if (!recompute_line_posval(&st->col[i], st->n))
			return (0);
		i++;
	}
	return (1);
}

static int	cell_step(t_state *st, int r, int c, int *changed)
{
	t_u16	nw;
	t_u16	removed;

	nw = (t_u16)(st->row[r].pos_val[c] & st->col[c].pos_val[r]);
	if (nw == 0)
		return (0);
	if (nw != st->cell[r][c])
	{
		removed = (t_u16)(st->cell[r][c] & ~nw);
		st->cell[r][c] = nw;
		if (kill_in_line(&st->row[r], c, removed) == 0)
			return (0);
		if (kill_in_line(&st->col[c], r, removed) == 0)
			return (0);
		*changed = 1;
	}
	return (1);
}

static int	intersect_cells(t_state *st, int *changed)
{
	int	r;
	int	c;

	r = 0;
	while (r < st->n)
	{
		c = 0;
		while (c < st->n)
		{
			if (!cell_step(st, r, c, changed))
				return (0);
			c++;
		}
		r++;
	}
	return (1);
}

int	propagate(t_state *st)
{
	int	changed;

	changed = 1;
	while (changed)
	{
		changed = 0;
		if (!recompute_all_posval(st))
			return (0);
		if (!intersect_cells(st, &changed))
			return (0);
	}
	return (1);
}
