/*
 * bonus/permgen.c -- parallel permutation generator using pthreads.
 *
 * The workload is N! permutations bucketed by (left_visible, right_visible).
 * We split the tree into N sub-trees, one per value at position 0, and run
 * each sub-tree on its own worker thread. Work is shared arena-free via a
 * two-phase scheme:
 *
 *   Phase 1 (count):  each worker computes its local bucket histogram.
 *   Main merges local histograms into st->pool_count and computes the
 *   prefix-sum start offsets for every bucket (and for each worker within
 *   each bucket).
 *
 *   Phase 2 (fill):   each worker re-descends its sub-tree and writes perms
 *   into its pre-assigned slot of the shared arena. No locks.
 */

#include "rush01.h"
#include <pthread.h>
#include <string.h>

typedef struct s_worker
{
	int		first_v;
	int		n;
	int		local_count[MAX_N + 2][MAX_N + 2];
	int		local_offset[MAX_N + 2][MAX_N + 2];
	t_u64	*arena;
}	t_worker;

static void	count_recurse_w(t_u64 perm, t_u16 used, int depth, t_worker *w)
{
	int	v;
	int	lv;
	int	rv;

	if (depth == w->n)
	{
		lv = count_visible_left(perm, w->n);
		rv = count_visible_right(perm, w->n);
		w->local_count[lv][rv]++;
		return ;
	}
	v = 1;
	while (v <= w->n)
	{
		if (!(used & (1u << (v - 1))))
			count_recurse_w(perm_set(perm, depth, v),
				(t_u16)(used | (1u << (v - 1))), depth + 1, w);
		v++;
	}
}

static void	fill_recurse_w(t_u64 perm, t_u16 used, int depth, t_worker *w)
{
	int	v;
	int	lv;
	int	rv;
	int	idx;

	if (depth == w->n)
	{
		lv = count_visible_left(perm, w->n);
		rv = count_visible_right(perm, w->n);
		idx = w->local_offset[lv][rv]++;
		w->arena[idx] = perm;
		return ;
	}
	v = 1;
	while (v <= w->n)
	{
		if (!(used & (1u << (v - 1))))
			fill_recurse_w(perm_set(perm, depth, v),
				(t_u16)(used | (1u << (v - 1))), depth + 1, w);
		v++;
	}
}

static void	*count_thread(void *arg)
{
	t_worker	*w = arg;
	t_u64		perm = 0;
	t_u16		used;

	perm = perm_set(perm, 0, w->first_v);
	used = (t_u16)(1u << (w->first_v - 1));
	count_recurse_w(perm, used, 1, w);
	return (NULL);
}

static void	*fill_thread(void *arg)
{
	t_worker	*w = arg;
	t_u64		perm = 0;
	t_u16		used;

	perm = perm_set(perm, 0, w->first_v);
	used = (t_u16)(1u << (w->first_v - 1));
	fill_recurse_w(perm, used, 1, w);
	return (NULL);
}

static void	reset_pool_counts(t_state *st)
{
	int	a;
	int	b;

	for (a = 0; a <= MAX_N + 1; a++)
		for (b = 0; b <= MAX_N + 1; b++)
		{
			st->pool_count[a][b] = 0;
			st->pool_start[a][b] = 0;
			st->pool_fill[a][b] = 0;
		}
}

static void	merge_counts(t_state *st, t_worker *ws, int nw)
{
	int	t;
	int	a;
	int	b;

	for (t = 0; t < nw; t++)
		for (a = 1; a <= st->n; a++)
			for (b = 1; b <= st->n; b++)
				st->pool_count[a][b] += ws[t].local_count[a][b];
}

static void	compute_worker_offsets(t_state *st, t_worker *ws, int nw)
{
	int	t;
	int	a;
	int	b;
	int	running;

	for (a = 1; a <= st->n; a++)
		for (b = 1; b <= st->n; b++)
		{
			running = st->pool_start[a][b];
			for (t = 0; t < nw; t++)
			{
				ws[t].local_offset[a][b] = running;
				running += ws[t].local_count[a][b];
			}
		}
}

int	generate_all_lines(t_state *st)
{
	pthread_t	tids[MAX_N];
	t_worker	ws[MAX_N];
	int			nw;
	int			i;

	nw = st->n;
	reset_pool_counts(st);
	for (i = 0; i < nw; i++)
	{
		memset(&ws[i], 0, sizeof(t_worker));
		ws[i].first_v = i + 1;
		ws[i].n = st->n;
	}
	for (i = 0; i < nw; i++)
		pthread_create(&tids[i], NULL, count_thread, &ws[i]);
	for (i = 0; i < nw; i++)
		pthread_join(tids[i], NULL);
	merge_counts(st, ws, nw);
	compute_offsets(st);
	compute_worker_offsets(st, ws, nw);
	st->pool_arena = malloc(sizeof(t_u64) * (size_t)factorial(st->n));
	if (!st->pool_arena)
		return (0);
	for (i = 0; i < nw; i++)
		ws[i].arena = st->pool_arena;
	for (i = 0; i < nw; i++)
		pthread_create(&tids[i], NULL, fill_thread, &ws[i]);
	for (i = 0; i < nw; i++)
		pthread_join(tids[i], NULL);
	bind_lines(st);
	return (1);
}
