/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	is_ws(char c)
{
	return (c == ' ' || c == '\t' || c == '\n' || c == '\v'
		|| c == '\f' || c == '\r');
}

int	is_digit(char c)
{
	return (c >= '0' && c <= '9');
}

int	read_int(const char *s, int *i, int *out)
{
	int	v;
	int	start;

	start = *i;
	if (!is_digit(s[*i]))
		return (0);
	v = 0;
	while (is_digit(s[*i]))
	{
		if (v > 100000)
			return (0);
		v = v * 10 + (s[*i] - '0');
		(*i)++;
	}
	if (s[start] == '0' && (*i - start) > 1)
		return (0);
	*out = v;
	return (1);
}

static int	read_all(const char *s, int *clues, int total, int n)
{
	int	i;
	int	k;
	int	v;

	i = 0;
	k = 0;
	while (k < total)
	{
		while (s[i] && is_ws(s[i]))
			i++;
		if (!read_int(s, &i, &v))
			return (0);
		if (v < 1 || v > n)
			return (0);
		clues[k++] = v;
	}
	return (1);
}

int	parse_input(const char *s, int *clues, int *n_out)
{
	int	n;
	int	total;

	if (!s)
		return (0);
	total = count_tokens(s);
	if (total < 0)
		return (0);
	if (!infer_n(total, &n))
		return (0);
	if (!read_all(s, clues, total, n))
		return (0);
	*n_out = n;
	return (1);
}
