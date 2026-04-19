/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   propagate_kill.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static t_u64	kill_mask_word(t_line *line, int w, int pos,
								t_u16 removed)
{
	t_u64	word;
	t_u64	mask;
	int		bit;
	int		v;

	word = line->alive[w];
	mask = 0;
	while (word)
	{
		bit = ctzll(word);
		v = perm_get(line->perms[w * 64 + bit], pos);
		if (removed & (1u << (v - 1)))
			mask |= (1ULL << bit);
		word &= word - 1;
	}
	return (mask);
}

static int	popcount64(t_u64 x)
{
	int	c;

	c = 0;
	while (x)
	{
		c++;
		x &= x - 1;
	}
	return (c);
}

int	kill_in_line(t_line *line, int pos, t_u16 removed)
{
	int		words;
	int		w;
	int		killed;
	t_u64	mask;

	words = (line->count + 63) / 64;
	killed = 0;
	w = 0;
	while (w < words)
	{
		mask = kill_mask_word(line, w, pos, removed);
		killed += popcount64(mask);
		line->alive[w] &= ~mask;
		w++;
	}
	line->alive_count -= killed;
	return (line->alive_count);
}
