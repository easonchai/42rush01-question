/*
** Validator for rush-01 output.
**   usage: verify <N> <clue-string> <solution-file>
** Reads the N×N solution from <solution-file>, asserts:
**   - every row and column is a permutation of 1..N (Latin square)
**   - each of the 4N clues matches the computed visibility from the grid
** Prints "OK" on success, "FAIL: <reason>" on failure. Exit 0/1.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int	vis(const int *line, int n, int reverse)
{
	int	m;
	int	c;
	int	i;

	m = 0;
	c = 0;
	if (!reverse)
	{
		for (i = 0; i < n; i++)
			if (line[i] > m) { m = line[i]; c++; }
	}
	else
	{
		for (i = n - 1; i >= 0; i--)
			if (line[i] > m) { m = line[i]; c++; }
	}
	return (c);
}

static int	parse_clues(const char *s, int *clues, int n)
{
	int	k;
	int	v;
	int	i;

	i = 0;
	k = 0;
	while (k < 4 * n)
	{
		while (s[i] == ' ' || s[i] == '\t' || s[i] == '\n')
			i++;
		if (!s[i]) return (-1);
		v = 0;
		while (s[i] >= '0' && s[i] <= '9')
			v = v * 10 + (s[i++] - '0');
		clues[k++] = v;
	}
	return (0);
}

int	main(int argc, char **argv)
{
	int		n;
	int		clues[36];
	int		grid[9][9];
	FILE	*f;
	int		i;
	int		j;
	int		row[9];
	int		col[9];
	int		seen[10];

	if (argc != 4) { printf("FAIL: usage\n"); return (1); }
	n = atoi(argv[1]);
	if (parse_clues(argv[2], clues, n) < 0)
	{ printf("FAIL: parse clues\n"); return (1); }
	f = fopen(argv[3], "r");
	if (!f) { printf("FAIL: open\n"); return (1); }
	for (i = 0; i < n; i++)
		for (j = 0; j < n; j++)
			if (fscanf(f, "%d", &grid[i][j]) != 1)
			{ printf("FAIL: not enough values\n"); fclose(f); return (1); }
	fclose(f);
	/* Latin square check */
	for (i = 0; i < n; i++)
	{
		memset(seen, 0, sizeof(seen));
		for (j = 0; j < n; j++)
		{
			if (grid[i][j] < 1 || grid[i][j] > n)
			{ printf("FAIL: row %d value out of range\n", i); return (1); }
			if (seen[grid[i][j]])
			{ printf("FAIL: row %d duplicate %d\n", i, grid[i][j]); return (1); }
			seen[grid[i][j]] = 1;
		}
	}
	for (j = 0; j < n; j++)
	{
		memset(seen, 0, sizeof(seen));
		for (i = 0; i < n; i++)
		{
			if (seen[grid[i][j]])
			{ printf("FAIL: col %d duplicate %d\n", j, grid[i][j]); return (1); }
			seen[grid[i][j]] = 1;
		}
	}
	/* clue check */
	for (j = 0; j < n; j++)
	{
		for (i = 0; i < n; i++) col[i] = grid[i][j];
		if (vis(col, n, 0) != clues[j])
		{ printf("FAIL: col %d up expected %d got %d\n", j, clues[j], vis(col,n,0)); return (1); }
		if (vis(col, n, 1) != clues[n + j])
		{ printf("FAIL: col %d down expected %d got %d\n", j, clues[n+j], vis(col,n,1)); return (1); }
	}
	for (i = 0; i < n; i++)
	{
		for (j = 0; j < n; j++) row[j] = grid[i][j];
		if (vis(row, n, 0) != clues[2 * n + i])
		{ printf("FAIL: row %d left expected %d got %d\n", i, clues[2*n+i], vis(row,n,0)); return (1); }
		if (vis(row, n, 1) != clues[3 * n + i])
		{ printf("FAIL: row %d right expected %d got %d\n", i, clues[3*n+i], vis(row,n,1)); return (1); }
	}
	printf("OK\n");
	return (0);
}
