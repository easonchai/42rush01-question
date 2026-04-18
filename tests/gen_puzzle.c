/*
** Generates a random Latin square of order N (3..9) and emits the 4N clues
** in rush-01 input format, followed by a newline.
**
** Usage:  gen_puzzle <N> <seed>
** Output: single line "c1u .. cNu c1d .. cNd r1l .. rNl r1r .. rNr"
**
** Latin square generation: start from the cyclic base L[i][j] = ((i+j) % N) + 1,
** then shuffle rows and shuffle columns. This yields a broad class of Latin
** squares — not uniform over all Latin squares, but plenty diverse for tests.
*/

#include <stdio.h>
#include <stdlib.h>

static int	g_rng;

static int	rng(void)
{
	g_rng = g_rng * 1103515245 + 12345;
	return ((g_rng >> 16) & 0x7fff);
}

static void	shuffle(int *a, int n)
{
	int	i;
	int	j;
	int	tmp;

	i = n - 1;
	while (i > 0)
	{
		j = rng() % (i + 1);
		tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
		i--;
	}
}

static int	vis_left(const int *line, int n)
{
	int	i;
	int	m;
	int	c;

	m = 0;
	c = 0;
	i = 0;
	while (i < n)
	{
		if (line[i] > m)
		{
			m = line[i];
			c++;
		}
		i++;
	}
	return (c);
}

static int	vis_right(const int *line, int n)
{
	int	i;
	int	m;
	int	c;

	m = 0;
	c = 0;
	i = n - 1;
	while (i >= 0)
	{
		if (line[i] > m)
		{
			m = line[i];
			c++;
		}
		i--;
	}
	return (c);
}

int	main(int argc, char **argv)
{
	int	n;
	int	L[9][9];
	int	row_perm[9];
	int	col_perm[9];
	int	col[9];
	int	i;
	int	j;

	if (argc != 3)
		return (1);
	n = atoi(argv[1]);
	g_rng = atoi(argv[2]);
	if (n < 3 || n > 9)
		return (1);
	for (i = 0; i < n; i++)
		row_perm[i] = i;
	for (i = 0; i < n; i++)
		col_perm[i] = i;
	shuffle(row_perm, n);
	shuffle(col_perm, n);
	for (i = 0; i < n; i++)
		for (j = 0; j < n; j++)
			L[i][j] = ((row_perm[i] + col_perm[j]) % n) + 1;
	/* clues: col1up..colNup, col1dn..colNdn, row1L..rowNL, row1R..rowNR */
	for (j = 0; j < n; j++)
	{
		for (i = 0; i < n; i++)
			col[i] = L[i][j];
		printf("%d ", vis_left(col, n));
	}
	for (j = 0; j < n; j++)
	{
		for (i = 0; i < n; i++)
			col[i] = L[i][j];
		printf("%d ", vis_right(col, n));
	}
	for (i = 0; i < n; i++)
		printf("%d ", vis_left(L[i], n));
	for (i = 0; i < n; i++)
		printf("%d%c", vis_right(L[i], n), (i == n - 1) ? '\n' : ' ');
	/* also emit the ground-truth Latin square on stderr for debug */
	for (i = 0; i < n; i++)
	{
		for (j = 0; j < n; j++)
			fprintf(stderr, "%d%c", L[i][j], (j == n - 1) ? '\n' : ' ');
	}
	return (0);
}
