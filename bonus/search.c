/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   search.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static t_line	*pick_line(t_state *st, int kind, int idx)
{
	if (kind == 0)
		return (&st->row[idx]);
	return (&st->col[idx]);
}

static int	try_candidate(t_state *st, t_line *line, int k)
{
	int	m;
	int	killed;

	m = 0;
	killed = 0;
	while (m < line->count)
	{
		if (bitset_test(line->alive, m) && m != k)
		{
			bitset_clear(line->alive, m);
			killed++;
		}
		m++;
	}
	line->alive_count -= killed;
	return (propagate(st));
}

static int	try_one(t_state *st, t_line *line, int k)
{
	t_snap	sn;

	if (!snapshot(&sn, st))
	{
		snap_free(&sn);
		return (0);
	}
	if (try_candidate(st, line, k) && solve(st))
	{
		snap_free(&sn);
		return (1);
	}
	restore(st, &sn);
	snap_free(&sn);
	return (0);
}

static int	search_line(t_state *st, int kind, int idx)
{
	t_line	*line;
	int		k;

	line = pick_line(st, kind, idx);
	k = 0;
	while (k < line->count)
	{
		if (bitset_test(line->alive, k))
		{
			if (try_one(st, line, k))
				return (1);
		}
		k++;
	}
	return (0);
}

int	solve(t_state *st)
{
	int	idx;
	int	kind;

	if (is_solved(st))
		return (1);
	kind = pick_mrv_line(st, &idx);
	if (kind < 0)
		return (is_solved(st));
	return (search_line(st, kind, idx));
}
