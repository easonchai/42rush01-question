/*
 * bonus/domain.c -- bit-op helpers using compiler intrinsics.
 *
 * The ex00 version implements popcount/ctz in portable C. Here we use
 * __builtin_popcount and __builtin_ctzll, which gcc/clang lower to a single
 * POPCNT / TZCNT / BSF instruction on x86-64 and equivalent on ARM. Under -O3
 * these inline at every call site, eliminating function-call overhead too.
 *
 * Correctness is identical to ex00/domain.c.
 */

#include "rush01.h"

int	popcount16(t_u16 x)
{
	return (__builtin_popcount((unsigned int)x));
}

int	ctz16(t_u16 x)
{
	if (x == 0)
		return (16);
	return (__builtin_ctz((unsigned int)x));
}

int	ctzll(t_u64 x)
{
	if (x == 0)
		return (64);
	return (__builtin_ctzll(x));
}
