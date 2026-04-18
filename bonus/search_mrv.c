/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   search_mrv.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	is_solved(const t_state *st)
{
	int	i;
	int	j;

	i = 0;
	while (i < st->n)
	{
		j = 0;
		while (j < st->n)
		{
			if (popcount16(st->cell[i][j]) != 1)
				return (0);
			j++;
		}
		i++;
	}
	return (1);
}

int	pick_mrv_line(const t_state *st, int *idx_out)
{
	int	i;
	int	best;
	int	kind;

	best = 0x7fffffff;
	*idx_out = -1;
	kind = -1;
	i = 0;
	while (i < st->n)
	{
		if (st->row[i].alive_count > 1 && st->row[i].alive_count < best)
		{
			best = st->row[i].alive_count;
			*idx_out = i;
			kind = 0;
		}
		if (st->col[i].alive_count > 1 && st->col[i].alive_count < best)
		{
			best = st->col[i].alive_count;
			*idx_out = i;
			kind = 1;
		}
		i++;
	}
	return (kind);
}
