#include "rush01.h"

/*
** Generate all N! permutations of {1..N} once, classify each by its pair
** (left-visibility, right-visibility), then store them contiguously in a flat
** arena owned by the state. Each line (row or col) gets a non-owning view
** into the bucket for its clue pair (t_line::perms is a pointer into the
** arena, not independently allocated). This removes redundant per-perm line
** testing and avoids duplicate storage when multiple lines share a clue pair.
*/

static int	factorial(int n)
{
	int	r;
	int	i;

	r = 1;
	i = 2;
	while (i <= n)
	{
		r *= i;
		i++;
	}
	return (r);
}

static void	count_recurse(t_u64 perm, t_u16 used, int depth, t_state *st)
{
	int	v;
	int	lv;
	int	rv;

	if (depth == st->n)
	{
		lv = count_visible_left(perm, st->n);
		rv = count_visible_right(perm, st->n);
		st->pool_count[lv][rv]++;
		return ;
	}
	v = 1;
	while (v <= st->n)
	{
		if (!(used & (1u << (v - 1))))
			count_recurse(perm_set(perm, depth, v),
				(t_u16)(used | (1u << (v - 1))), depth + 1, st);
		v++;
	}
}

static void	fill_recurse(t_u64 perm, t_u16 used, int depth, t_state *st)
{
	int	v;
	int	lv;
	int	rv;
	int	idx;

	if (depth == st->n)
	{
		lv = count_visible_left(perm, st->n);
		rv = count_visible_right(perm, st->n);
		idx = st->pool_start[lv][rv] + st->pool_fill[lv][rv]++;
		st->pool_arena[idx] = perm;
		return ;
	}
	v = 1;
	while (v <= st->n)
	{
		if (!(used & (1u << (v - 1))))
			fill_recurse(perm_set(perm, depth, v),
				(t_u16)(used | (1u << (v - 1))), depth + 1, st);
		v++;
	}
}

static void	compute_offsets(t_state *st)
{
	int	a;
	int	b;
	int	off;

	off = 0;
	a = 1;
	while (a <= st->n)
	{
		b = 1;
		while (b <= st->n)
		{
			st->pool_start[a][b] = off;
			st->pool_fill[a][b] = 0;
			off += st->pool_count[a][b];
			b++;
		}
		a++;
	}
}

static void	bind_lines(t_state *st)
{
	int		i;
	int		lc;
	int		rc;
	t_line	*L;

	i = 0;
	while (i < st->n)
	{
		L = &st->row[i];
		lc = L->left_clue;
		rc = L->right_clue;
		L->perms = &st->pool_arena[st->pool_start[lc][rc]];
		L->count = st->pool_count[lc][rc];
		L = &st->col[i];
		lc = L->left_clue;
		rc = L->right_clue;
		L->perms = &st->pool_arena[st->pool_start[lc][rc]];
		L->count = st->pool_count[lc][rc];
		i++;
	}
}

int	generate_all_lines(t_state *st)
{
	int	a;
	int	b;
	int	total;

	a = 0;
	while (a <= MAX_N + 1)
	{
		b = 0;
		while (b <= MAX_N + 1)
		{
			st->pool_count[a][b] = 0;
			st->pool_start[a][b] = 0;
			st->pool_fill[a][b] = 0;
			b++;
		}
		a++;
	}
	count_recurse(0ULL, 0, 0, st);
	compute_offsets(st);
	total = factorial(st->n);
	st->pool_arena = (t_u64 *)malloc(sizeof(t_u64) * (size_t)total);
	if (!st->pool_arena)
		return (0);
	fill_recurse(0ULL, 0, 0, st);
	bind_lines(st);
	return (1);
}
