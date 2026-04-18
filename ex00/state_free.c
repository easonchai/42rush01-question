/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   state_free.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static void	fill_tail(t_u64 *bs, int full_words, int tail_bits)
{
	if (tail_bits == 0)
		return ;
	if (tail_bits == 64)
		bs[full_words] = ~(t_u64)0;
	else
		bs[full_words] = (1ULL << tail_bits) - 1ULL;
}

int	alloc_line_alive(t_line *line)
{
	int		bytes;
	t_u64	*bs;
	int		i;

	bytes = bitset_bytes(line->count);
	bs = (t_u64 *)malloc((size_t)bytes);
	if (!bs)
		return (0);
	i = 0;
	while (i < bytes / 8)
	{
		bs[i] = ~(t_u64)0;
		i++;
	}
	fill_tail(bs, line->count / 64, line->count - (line->count / 64) * 64);
	line->alive = bs;
	line->alive_count = line->count;
	return (1);
}

static void	free_line(t_line *line)
{
	if (line->alive)
		free(line->alive);
	line->perms = NULL;
	line->alive = NULL;
}

void	state_free(t_state *st)
{
	int	i;

	i = 0;
	while (i < MAX_N)
	{
		free_line(&st->row[i]);
		free_line(&st->col[i]);
		i++;
	}
	if (st->pool_arena)
	{
		free(st->pool_arena);
		st->pool_arena = NULL;
	}
}
