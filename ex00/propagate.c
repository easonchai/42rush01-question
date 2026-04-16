#include "rush01.h"

static inline int	ctzll(t_u64 x)
{
	int	n;

	if (x == 0)
		return (64);
	n = 0;
	if ((x & 0xFFFFFFFFULL) == 0)
	{
		n += 32;
		x >>= 32;
	}
	if ((x & 0xFFFFULL) == 0)
	{
		n += 16;
		x >>= 16;
	}
	if ((x & 0xFFULL) == 0)
	{
		n += 8;
		x >>= 8;
	}
	if ((x & 0xFULL) == 0)
	{
		n += 4;
		x >>= 4;
	}
	if ((x & 0x3ULL) == 0)
	{
		n += 2;
		x >>= 2;
	}
	if ((x & 0x1ULL) == 0)
		n += 1;
	return (n);
}

int	recompute_line_posval(t_line *L, int n)
{
	int		i;
	int		words;
	int		w;
	int		k;
	int		bit;
	t_u64	word;
	t_u64	p;

	i = 0;
	while (i < n)
	{
		L->pos_val[i] = 0;
		i++;
	}
	words = (L->count + 63) / 64;
	w = 0;
	while (w < words)
	{
		word = L->alive[w];
		while (word)
		{
			bit = ctzll(word);
			k = w * 64 + bit;
			p = L->perms[k];
			i = 0;
			while (i < n)
			{
				L->pos_val[i] = (t_u16)(L->pos_val[i]
						| (1u << (perm_get(p, i) - 1)));
				i++;
			}
			word &= word - 1;
		}
		w++;
	}
	return (L->alive_count > 0);
}

static int	kill_in_line(t_line *L, int pos, t_u16 removed)
{
	int		words;
	int		w;
	int		bit;
	int		killed;
	int		v;
	t_u64	word;
	t_u64	kill_mask;

	words = (L->count + 63) / 64;
	killed = 0;
	w = 0;
	while (w < words)
	{
		word = L->alive[w];
		kill_mask = 0;
		while (word)
		{
			bit = ctzll(word);
			v = perm_get(L->perms[w * 64 + bit], pos);
			if (removed & (1u << (v - 1)))
			{
				kill_mask |= (1ULL << bit);
				killed++;
			}
			word &= word - 1;
		}
		L->alive[w] &= ~kill_mask;
		w++;
	}
	L->alive_count -= killed;
	return (L->alive_count);
}

static int	intersect_cells(t_state *st, int *changed)
{
	int		r;
	int		c;
	t_u16	nw;
	t_u16	removed;

	r = 0;
	while (r < st->n)
	{
		c = 0;
		while (c < st->n)
		{
			nw = (t_u16)(st->row[r].pos_val[c] & st->col[c].pos_val[r]);
			if (nw == 0)
				return (0);
			if (nw != st->cell[r][c])
			{
				removed = (t_u16)(st->cell[r][c] & ~nw);
				st->cell[r][c] = nw;
				if (kill_in_line(&st->row[r], c, removed) == 0)
					return (0);
				if (kill_in_line(&st->col[c], r, removed) == 0)
					return (0);
				*changed = 1;
			}
			c++;
		}
		r++;
	}
	return (1);
}

static int	recompute_all_posval(t_state *st)
{
	int	i;

	i = 0;
	while (i < st->n)
	{
		if (!recompute_line_posval(&st->row[i], st->n))
			return (0);
		if (!recompute_line_posval(&st->col[i], st->n))
			return (0);
		i++;
	}
	return (1);
}

int	propagate(t_state *st)
{
	int	changed;

	changed = 1;
	while (changed)
	{
		changed = 0;
		if (!recompute_all_posval(st))
			return (0);
		if (!intersect_cells(st, &changed))
			return (0);
	}
	return (1);
}
