#include "rush01.h"

static int	is_ws(char c)
{
	return (c == ' ' || c == '\t' || c == '\n' || c == '\v'
		|| c == '\f' || c == '\r');
}

static int	is_digit(char c)
{
	return (c >= '0' && c <= '9');
}

/*
** Read one unsigned integer. *i must point to a digit. Value must fit in int,
** must not have a leading zero unless the number is exactly "0". Returns 1 on
** success and writes the value to *out; returns 0 on any parse error.
*/
static int	read_int(const char *s, int *i, int *out)
{
	int	v;
	int	start;

	start = *i;
	if (!is_digit(s[*i]))
		return (0);
	v = 0;
	while (is_digit(s[*i]))
	{
		if (v > 100000)
			return (0);
		v = v * 10 + (s[*i] - '0');
		(*i)++;
	}
	if (s[start] == '0' && (*i - start) > 1)
		return (0);
	*out = v;
	return (1);
}

/*
** Count whitespace-separated tokens. Returns -1 on malformed (non-digit/non-ws
** characters). Rejects leading zeros within tokens.
*/
static int	count_tokens(const char *s)
{
	int	i;
	int	count;
	int	dummy;

	i = 0;
	count = 0;
	while (s[i])
	{
		while (s[i] && is_ws(s[i]))
			i++;
		if (!s[i])
			break ;
		if (!read_int(s, &i, &dummy))
			return (-1);
		count++;
		if (s[i] && !is_ws(s[i]))
			return (-1);
	}
	return (count);
}

static int	infer_n(int token_count, int *n_out)
{
	int	n;

	if (token_count <= 0)
		return (0);
	if (token_count % 4 != 0)
		return (0);
	n = token_count / 4;
	if (n < MIN_N || n > MAX_N)
		return (0);
	*n_out = n;
	return (1);
}

/*
** Parse the single argv string into `clues` (size >= 4N) and write N to n_out.
** clue order: col1..colN up, col1..colN down, row1..rowN left, row1..rowN right.
** Each clue must be in [1..N]. Returns 1 on success, 0 on error.
*/
int	parse_input(const char *s, int *clues, int *n_out)
{
	int	i;
	int	k;
	int	v;
	int	n;
	int	total;

	if (!s)
		return (0);
	total = count_tokens(s);
	if (total < 0)
		return (0);
	if (!infer_n(total, &n))
		return (0);
	i = 0;
	k = 0;
	while (k < total)
	{
		while (s[i] && is_ws(s[i]))
			i++;
		if (!read_int(s, &i, &v))
			return (0);
		if (v < 1 || v > n)
			return (0);
		clues[k++] = v;
	}
	*n_out = n;
	return (1);
}
