/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   permgen.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static void	count_recurse(t_u64 perm, t_u16 used, int depth, t_state *st)
{
	int	v;
	int	lv;
	int	rv;

	if (depth == st->n)
	{
		lv = count_visible_left(perm, st->n);
		rv = count_visible_right(perm, st->n);
		st->pool_count[lv][rv]++;
		return ;
	}
	v = 1;
	while (v <= st->n)
	{
		if (!(used & (1u << (v - 1))))
			count_recurse(perm_set(perm, depth, v),
				(t_u16)(used | (1u << (v - 1))), depth + 1, st);
		v++;
	}
}

static void	fill_recurse(t_u64 perm, t_u16 used, int depth, t_state *st)
{
	int	v;
	int	lv;
	int	rv;
	int	idx;

	if (depth == st->n)
	{
		lv = count_visible_left(perm, st->n);
		rv = count_visible_right(perm, st->n);
		idx = st->pool_start[lv][rv] + st->pool_fill[lv][rv]++;
		st->pool_arena[idx] = perm;
		return ;
	}
	v = 1;
	while (v <= st->n)
	{
		if (!(used & (1u << (v - 1))))
			fill_recurse(perm_set(perm, depth, v),
				(t_u16)(used | (1u << (v - 1))), depth + 1, st);
		v++;
	}
}

static void	reset_pool_counts(t_state *st)
{
	int	a;
	int	b;

	a = 0;
	while (a <= MAX_N + 1)
	{
		b = 0;
		while (b <= MAX_N + 1)
		{
			st->pool_count[a][b] = 0;
			st->pool_start[a][b] = 0;
			st->pool_fill[a][b] = 0;
			b++;
		}
		a++;
	}
}

int	generate_all_lines(t_state *st)
{
	int	total;

	reset_pool_counts(st);
	count_recurse(0ULL, 0, 0, st);
	compute_offsets(st);
	total = factorial(st->n);
	st->pool_arena = (t_u64 *)malloc(sizeof(t_u64) * (size_t)total);
	if (!st->pool_arena)
		return (0);
	fill_recurse(0ULL, 0, 0, st);
	bind_lines(st);
	return (1);
}
