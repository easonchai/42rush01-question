/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse_utils.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	count_tokens(const char *s)
{
	int	i;
	int	count;
	int	dummy;

	i = 0;
	count = 0;
	while (s[i])
	{
		while (s[i] && is_ws(s[i]))
			i++;
		if (!s[i])
			break ;
		if (!read_int(s, &i, &dummy))
			return (-1);
		count++;
		if (s[i] && !is_ws(s[i]))
			return (-1);
	}
	return (count);
}

int	infer_n(int token_count, int *n_out)
{
	int	n;

	if (token_count <= 0)
		return (0);
	if (token_count % 4 != 0)
		return (0);
	n = token_count / 4;
	if (n < MIN_N || n > MAX_N)
		return (0);
	*n_out = n;
	return (1);
}
