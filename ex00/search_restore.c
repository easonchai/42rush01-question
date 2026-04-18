/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   search_restore.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

static void	restore_line(t_line *line, t_u64 *src, int words,
						int alive_count)
{
	int	i;

	i = 0;
	while (i < words)
	{
		line->alive[i] = src[i];
		i++;
	}
	line->alive_count = alive_count;
}

static void	restore_cells_row(t_state *st, t_snap *sn, int i)
{
	int	j;

	j = 0;
	while (j < st->n)
	{
		st->cell[i][j] = sn->cell[i][j];
		j++;
	}
}

void	restore(t_state *st, t_snap *sn)
{
	int	i;

	i = 0;
	while (i < st->n)
	{
		restore_cells_row(st, sn, i);
		restore_line(&st->row[i], sn->row_alive[i],
			sn->row_words[i], sn->row_alive_count[i]);
		restore_line(&st->col[i], sn->col_alive[i],
			sn->col_words[i], sn->col_alive_count[i]);
		i++;
	}
}
