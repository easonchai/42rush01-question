/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   bitset.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

#include "rush01.h"

int	bitset_bytes(int nbits)
{
	return (((nbits + 63) / 64) * 8);
}

int	bitset_test(const t_u64 *bs, int i)
{
	return ((int)((bs[i >> 6] >> (i & 63)) & 1ULL));
}

void	bitset_set(t_u64 *bs, int i)
{
	bs[i >> 6] |= (1ULL << (i & 63));
}

void	bitset_clear(t_u64 *bs, int i)
{
	bs[i >> 6] &= ~(1ULL << (i & 63));
}
