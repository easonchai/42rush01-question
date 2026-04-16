#ifndef RUSH01_H
# define RUSH01_H

# include <unistd.h>
# include <stdlib.h>

# define MAX_N 9
# define MIN_N 3

typedef unsigned char		t_u8;
typedef unsigned short		t_u16;
typedef unsigned int		t_u32;
typedef unsigned long long	t_u64;

/*
** A packed permutation stores values v in [1..N] as 4-bit nibbles, field i in
** bits [4*i .. 4*i + 3]. Fits N=9 (9*4 = 36 bits) in a single t_u64.
*/

typedef struct s_line
{
	t_u64	*perms;
	t_u64	*alive;
	int		count;
	int		alive_count;
	t_u16	pos_val[MAX_N];
	int		left_clue;
	int		right_clue;
}	t_line;

typedef struct s_state
{
	int		n;
	t_line	row[MAX_N];
	t_line	col[MAX_N];
	t_u16	cell[MAX_N][MAX_N];
	t_u64	*pool_arena;
	int		pool_count[MAX_N + 2][MAX_N + 2];
	int		pool_start[MAX_N + 2][MAX_N + 2];
	int		pool_fill[MAX_N + 2][MAX_N + 2];
}	t_state;

/* parse.c */
int		parse_input(const char *s, int *clues, int *n_out);

/* precheck.c */
int		precheck_clues(const int *clues, int n);

/* visibility.c */
int		count_visible_left(const t_u64 perm, int n);
int		count_visible_right(const t_u64 perm, int n);

/* permgen.c */
int		generate_all_lines(t_state *st);

/* domain.c */
int		popcount16(t_u16 x);
int		ctz16(t_u16 x);
int		bitset_test(const t_u64 *bs, int i);
void	bitset_set(t_u64 *bs, int i);
void	bitset_clear(t_u64 *bs, int i);
int		bitset_bytes(int nbits);

/* state.c */
int		state_init(t_state *st, const int *clues, int n);
void	state_free(t_state *st);
int		state_copy(t_state *dst, const t_state *src);
void	state_move_free(t_state *dst);

/* propagate.c */
int		recompute_line_posval(t_line *L, int n);
int		propagate(t_state *st);

/* search.c */
int		solve(t_state *st);

/* output.c */
void	emit_error(void);
void	emit_solution(const t_state *st);

/* perm helpers */
static inline int	perm_get(t_u64 perm, int i)
{
	return ((int)((perm >> (4 * i)) & 0xF));
}

static inline t_u64	perm_set(t_u64 perm, int i, int v)
{
	t_u64	mask;

	mask = ((t_u64)0xF) << (4 * i);
	return ((perm & ~mask) | (((t_u64)v) << (4 * i)));
}

#endif
