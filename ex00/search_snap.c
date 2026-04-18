/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   search_snap.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static int	snap_save_line(t_u64 **dst, int *words_out, const t_line *line)
{
	int	w;
	int	i;

	w = (line->count + 63) / 64;
	*words_out = w;
	if (w == 0)
	{
		*dst = NULL;
		return (1);
	}
	*dst = (t_u64 *)malloc(sizeof(t_u64) * (size_t)w);
	if (!*dst)
		return (0);
	i = 0;
	while (i < w)
	{
		(*dst)[i] = line->alive[i];
		i++;
	}
	return (1);
}

static int	snap_save_index(t_snap *sn, const t_state *st, int i)
{
	int	j;

	j = 0;
	while (j < st->n)
	{
		sn->cell[i][j] = st->cell[i][j];
		j++;
	}
	sn->row_alive_count[i] = st->row[i].alive_count;
	sn->col_alive_count[i] = st->col[i].alive_count;
	if (!snap_save_line(&sn->row_alive[i], &sn->row_words[i], &st->row[i]))
		return (0);
	if (!snap_save_line(&sn->col_alive[i], &sn->col_words[i], &st->col[i]))
		return (0);
	return (1);
}

int	snapshot(t_snap *sn, const t_state *st)
{
	int	i;

	i = 0;
	while (i < MAX_N)
	{
		sn->row_alive[i] = NULL;
		sn->col_alive[i] = NULL;
		i++;
	}
	i = 0;
	while (i < st->n)
	{
		if (!snap_save_index(sn, st, i))
			return (0);
		i++;
	}
	return (1);
}

void	snap_free(t_snap *sn)
{
	int	i;

	i = 0;
	while (i < MAX_N)
	{
		if (sn->row_alive[i])
			free(sn->row_alive[i]);
		if (sn->col_alive[i])
			free(sn->col_alive[i]);
		sn->row_alive[i] = NULL;
		sn->col_alive[i] = NULL;
		i++;
	}
}
