/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   visibility.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	count_visible_left(const t_u64 perm, int n)
{
	int	i;
	int	max;
	int	v;
	int	count;

	max = 0;
	count = 0;
	i = 0;
	while (i < n)
	{
		v = perm_get(perm, i);
		if (v > max)
		{
			max = v;
			count++;
		}
		i++;
	}
	return (count);
}

int	count_visible_right(const t_u64 perm, int n)
{
	int	i;
	int	max;
	int	v;
	int	count;

	max = 0;
	count = 0;
	i = n - 1;
	while (i >= 0)
	{
		v = perm_get(perm, i);
		if (v > max)
		{
			max = v;
			count++;
		}
		i--;
	}
	return (count);
}
