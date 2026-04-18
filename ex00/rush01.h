/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rush01.h                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

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

int		parse_input(const char *s, int *clues, int *n_out);
int		is_ws(char c);
int		is_digit(char c);
int		read_int(const char *s, int *i, int *out);
int		count_tokens(const char *s);
int		infer_n(int token_count, int *n_out);

int		precheck_clues(const int *clues, int n);

int		count_visible_left(const t_u64 perm, int n);
int		count_visible_right(const t_u64 perm, int n);

int		generate_all_lines(t_state *st);
int		factorial(int n);
void	compute_offsets(t_state *st);
void	bind_lines(t_state *st);

int		popcount16(t_u16 x);
int		ctz16(t_u16 x);
int		ctzll(t_u64 x);
int		bitset_bytes(int nbits);
int		bitset_test(const t_u64 *bs, int i);
void	bitset_set(t_u64 *bs, int i);
void	bitset_clear(t_u64 *bs, int i);

int		state_init(t_state *st, const int *clues, int n);
void	state_free(t_state *st);
int		alloc_line_alive(t_line *line);

int		recompute_line_posval(t_line *line, int n);
int		recompute_all_posval(t_state *st);
int		kill_in_line(t_line *line, int pos, t_u16 removed);
int		propagate(t_state *st);

int		solve(t_state *st);
int		is_solved(const t_state *st);
int		pick_mrv_line(const t_state *st, int *idx_out);
int		snapshot(t_snap *sn, const t_state *st);
void	snap_free(t_snap *sn);
void	restore(t_state *st, t_snap *sn);

void	emit_error(void);
void	emit_solution(const t_state *st);

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
