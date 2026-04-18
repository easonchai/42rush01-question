/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   propagate_posval.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static void	clear_pos_val(t_line *line, int n)
{
	int	i;

	i = 0;
	while (i < n)
	{
		line->pos_val[i] = 0;
		i++;
	}
}

static void	or_perm_into_pos_val(t_line *line, t_u64 p, int n)
{
	int	i;

	i = 0;
	while (i < n)
	{
		line->pos_val[i] = (t_u16)(line->pos_val[i]
				| (1u << (perm_get(p, i) - 1)));
		i++;
	}
}

int	recompute_line_posval(t_line *line, int n)
{
	int		words;
	int		w;
	int		k;
	t_u64	word;

	clear_pos_val(line, n);
	words = (line->count + 63) / 64;
	w = 0;
	while (w < words)
	{
		word = line->alive[w];
		while (word)
		{
			k = w * 64 + ctzll(word);
			or_perm_into_pos_val(line, line->perms[k], n);
			word &= word - 1;
		}
		w++;
	}
	return (line->alive_count > 0);
}
