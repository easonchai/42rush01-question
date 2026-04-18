#include "rush01.h"

static void	write_int(int v)
{
	char	buf[16];
	int		len;
	int		neg;

	neg = 0;
	if (v < 0)
	{
		neg = 1;
		v = -v;
	}
	len = 0;
	if (v == 0)
		buf[len++] = '0';
	while (v > 0)
	{
		buf[len++] = (char)('0' + v % 10);
		v /= 10;
	}
	if (neg)
		buf[len++] = '-';
	while (len > 0)
	{
		len--;
		write(2, &buf[len], 1);
	}
}

static void	wstr(const char *s)
{
	int	l;

	l = 0;
	while (s[l])
		l++;
	write(2, s, (size_t)l);
}

void	dbg_state(const t_state *st)
{
	int	i;
	int	j;

	wstr("n=");
	write_int(st->n);
	wstr("\nrows: ");
	i = 0;
	while (i < st->n)
	{
		write_int(st->row[i].left_clue);
		wstr("/");
		write_int(st->row[i].right_clue);
		wstr("(");
		write_int(st->row[i].alive_count);
		wstr(") ");
		i++;
	}
	wstr("\ncols: ");
	i = 0;
	while (i < st->n)
	{
		write_int(st->col[i].left_clue);
		wstr("/");
		write_int(st->col[i].right_clue);
		wstr("(");
		write_int(st->col[i].alive_count);
		wstr(") ");
		i++;
	}
	wstr("\ncells:\n");
	i = 0;
	while (i < st->n)
	{
		j = 0;
		while (j < st->n)
		{
			wstr("[");
			write_int((int)st->cell[i][j]);
			wstr("]");
			j++;
		}
		wstr("\n");
		i++;
	}
}
