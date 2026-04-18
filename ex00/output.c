/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   output.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

void	emit_error(void)
{
	write(1, "Error\n", 6);
}

static int	value_from_cell(t_u16 mask)
{
	return (ctz16(mask) + 1);
}

void	emit_solution(const t_state *st)
{
	char	buf[MAX_N * MAX_N * 2 + MAX_N];
	int		i;
	int		j;
	int		len;
	int		v;

	len = 0;
	i = 0;
	while (i < st->n)
	{
		j = 0;
		while (j < st->n)
		{
			v = value_from_cell(st->cell[i][j]);
			if (j > 0)
				buf[len++] = ' ';
			buf[len++] = (char)('0' + v);
			j++;
		}
		buf[len++] = '\n';
		i++;
	}
	write(1, buf, (size_t)len);
}
