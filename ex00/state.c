#include "rush01.h"

static void	zero_line(t_line *L)
{
	int	i;

	L->perms = NULL;
	L->alive = NULL;
	L->count = 0;
	L->alive_count = 0;
	L->left_clue = 0;
	L->right_clue = 0;
	i = 0;
	while (i < MAX_N)
	{
		L->pos_val[i] = 0;
		i++;
	}
}

static int	alloc_line_alive(t_line *L)
{
	int		bytes;
	t_u64	*bs;
	int		i;
	int		full_words;
	int		tail_bits;

	bytes = bitset_bytes(L->count);
	bs = (t_u64 *)malloc((size_t)bytes);
	if (!bs)
		return (0);
	i = 0;
	while (i < bytes / 8)
	{
		bs[i] = ~(t_u64)0;
		i++;
	}
	full_words = L->count / 64;
	tail_bits = L->count - full_words * 64;
	if (tail_bits > 0)
		bs[full_words] = (tail_bits == 64) ? ~(t_u64)0
			: ((1ULL << tail_bits) - 1ULL);
	L->alive = bs;
	L->alive_count = L->count;
	return (1);
}

int	state_init(t_state *st, const int *clues, int n)
{
	int	i;
	int	j;

	st->n = n;
	st->pool_arena = NULL;
	i = 0;
	while (i < MAX_N)
	{
		zero_line(&st->row[i]);
		zero_line(&st->col[i]);
		i++;
	}
	i = 0;
	while (i < n)
	{
		st->col[i].left_clue = clues[i];
		st->col[i].right_clue = clues[n + i];
		st->row[i].left_clue = clues[2 * n + i];
		st->row[i].right_clue = clues[3 * n + i];
		j = 0;
		while (j < n)
		{
			st->cell[i][j] = (t_u16)((1u << n) - 1u);
			j++;
		}
		i++;
	}
	if (!generate_all_lines(st))
		return (0);
	i = 0;
	while (i < n)
	{
		if (st->row[i].count == 0 || st->col[i].count == 0)
			return (0);
		if (!alloc_line_alive(&st->row[i]))
			return (0);
		if (!alloc_line_alive(&st->col[i]))
			return (0);
		i++;
	}
	return (1);
}

static void	free_line(t_line *L)
{
	/* perms is a non-owning view into state->pool_arena; do not free. */
	if (L->alive)
		free(L->alive);
	L->perms = NULL;
	L->alive = NULL;
}

void	state_free(t_state *st)
{
	int	i;

	i = 0;
	while (i < MAX_N)
	{
		free_line(&st->row[i]);
		free_line(&st->col[i]);
		i++;
	}
	if (st->pool_arena)
	{
		free(st->pool_arena);
		st->pool_arena = NULL;
	}
}
