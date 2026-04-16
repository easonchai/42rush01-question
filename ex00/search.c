#include "rush01.h"

typedef struct s_snap
{
	t_u16	cell[MAX_N][MAX_N];
	int		row_alive_count[MAX_N];
	int		col_alive_count[MAX_N];
	t_u64	*row_alive[MAX_N];
	t_u64	*col_alive[MAX_N];
	int		row_words[MAX_N];
	int		col_words[MAX_N];
}	t_snap;

static int	words_for(int count)
{
	return ((count + 63) / 64);
}

static int	snap_save_line(t_u64 **dst, int *words_out,
							const t_line *L)
{
	int	w;
	int	i;

	w = words_for(L->count);
	*words_out = w;
	if (w == 0)
	{
		*dst = NULL;
		return (1);
	}
	*dst = (t_u64 *)malloc(sizeof(t_u64) * (size_t)w);
	if (!*dst)
		return (0);
	i = 0;
	while (i < w)
	{
		(*dst)[i] = L->alive[i];
		i++;
	}
	return (1);
}

static int	snapshot(t_snap *S, const t_state *st)
{
	int	i;
	int	j;

	i = 0;
	while (i < MAX_N)
	{
		S->row_alive[i] = NULL;
		S->col_alive[i] = NULL;
		i++;
	}
	i = 0;
	while (i < st->n)
	{
		j = 0;
		while (j < st->n)
		{
			S->cell[i][j] = st->cell[i][j];
			j++;
		}
		S->row_alive_count[i] = st->row[i].alive_count;
		S->col_alive_count[i] = st->col[i].alive_count;
		if (!snap_save_line(&S->row_alive[i], &S->row_words[i], &st->row[i]))
			return (0);
		if (!snap_save_line(&S->col_alive[i], &S->col_words[i], &st->col[i]))
			return (0);
		i++;
	}
	return (1);
}

static void	snap_free(t_snap *S)
{
	int	i;

	i = 0;
	while (i < MAX_N)
	{
		if (S->row_alive[i])
			free(S->row_alive[i]);
		if (S->col_alive[i])
			free(S->col_alive[i]);
		S->row_alive[i] = NULL;
		S->col_alive[i] = NULL;
		i++;
	}
}

static void	restore_line(t_line *L, t_u64 *src, int words, int alive_count)
{
	int	i;

	i = 0;
	while (i < words)
	{
		L->alive[i] = src[i];
		i++;
	}
	L->alive_count = alive_count;
}

static void	restore(t_state *st, t_snap *S)
{
	int	i;
	int	j;

	i = 0;
	while (i < st->n)
	{
		j = 0;
		while (j < st->n)
		{
			st->cell[i][j] = S->cell[i][j];
			j++;
		}
		restore_line(&st->row[i], S->row_alive[i],
			S->row_words[i], S->row_alive_count[i]);
		restore_line(&st->col[i], S->col_alive[i],
			S->col_words[i], S->col_alive_count[i]);
		i++;
	}
}

static int	is_solved(const t_state *st)
{
	int	i;
	int	j;

	i = 0;
	while (i < st->n)
	{
		j = 0;
		while (j < st->n)
		{
			if (popcount16(st->cell[i][j]) != 1)
				return (0);
			j++;
		}
		i++;
	}
	return (1);
}

/*
** Returns 0 if rows, 1 if cols; sets *idx_out. Returns -1 if every line is
** already down to exactly one candidate (fully determined, no branching needed).
*/
static int	pick_mrv_line(const t_state *st, int *idx_out)
{
	int	i;
	int	best;
	int	best_idx;
	int	best_kind;

	best = 0x7fffffff;
	best_idx = -1;
	best_kind = -1;
	i = 0;
	while (i < st->n)
	{
		if (st->row[i].alive_count > 1 && st->row[i].alive_count < best)
		{
			best = st->row[i].alive_count;
			best_idx = i;
			best_kind = 0;
		}
		if (st->col[i].alive_count > 1 && st->col[i].alive_count < best)
		{
			best = st->col[i].alive_count;
			best_idx = i;
			best_kind = 1;
		}
		i++;
	}
	*idx_out = best_idx;
	return (best_kind);
}

static int	try_candidate(t_state *st, t_line *L, int k)
{
	int	m;
	int	killed;

	m = 0;
	killed = 0;
	while (m < L->count)
	{
		if (bitset_test(L->alive, m) && m != k)
		{
			bitset_clear(L->alive, m);
			killed++;
		}
		m++;
	}
	L->alive_count -= killed;
	return (propagate(st));
}

static int	search_line(t_state *st, int kind, int idx)
{
	t_line	*L;
	t_snap	snap;
	int		k;

	if (kind == 0)
		L = &st->row[idx];
	else
		L = &st->col[idx];
	k = 0;
	while (k < L->count)
	{
		if (bitset_test(L->alive, k))
		{
			if (!snapshot(&snap, st))
			{
				snap_free(&snap);
				return (0);
			}
			if (try_candidate(st, L, k) && solve(st))
			{
				snap_free(&snap);
				return (1);
			}
			restore(st, &snap);
			snap_free(&snap);
		}
		k++;
	}
	return (0);
}

int	solve(t_state *st)
{
	int	idx;
	int	kind;

	if (is_solved(st))
		return (1);
	kind = pick_mrv_line(st, &idx);
	if (kind < 0)
		return (is_solved(st));
	return (search_line(st, kind, idx));
}
