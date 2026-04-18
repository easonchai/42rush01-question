/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   domain.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	popcount16(t_u16 x)
{
	int	c;

	c = 0;
	while (x)
	{
		c += (int)(x & 1);
		x >>= 1;
	}
	return (c);
}

int	ctz16(t_u16 x)
{
	int	c;

	if (x == 0)
		return (16);
	c = 0;
	while ((x & 1) == 0)
	{
		c++;
		x >>= 1;
	}
	return (c);
}

static int	ctz_low8(t_u32 x)
{
	int	n;

	n = 0;
	if ((x & 0xF) == 0)
	{
		n += 4;
		x >>= 4;
	}
	if ((x & 0x3) == 0)
	{
		n += 2;
		x >>= 2;
	}
	if ((x & 0x1) == 0)
		n += 1;
	return (n);
}

static int	ctz_low32(t_u32 x)
{
	int	n;

	n = 0;
	if ((x & 0xFFFF) == 0)
	{
		n += 16;
		x >>= 16;
	}
	if ((x & 0xFF) == 0)
	{
		n += 8;
		x >>= 8;
	}
	return (n + ctz_low8(x));
}

int	ctzll(t_u64 x)
{
	if (x == 0)
		return (64);
	if ((x & 0xFFFFFFFFULL) == 0)
		return (32 + ctz_low32((t_u32)(x >> 32)));
	return (ctz_low32((t_u32)x));
}
