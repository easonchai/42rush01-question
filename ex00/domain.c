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
