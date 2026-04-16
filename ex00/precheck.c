#include "rush01.h"

/*
** Clue layout after parse:
**   [0 .. n-1]        col[i] top view   (down the column)
**   [n .. 2n-1]       col[i] bottom view (up the column)
**   [2n .. 3n-1]      row[i] left view   (right along the row)
**   [3n .. 4n-1]      row[i] right view  (left along the row)
**
** Opposite pair validity: for a line of length n with two-sided clues (a, b),
** the Khovanova decomposition gives f_n(a,b) = 0 iff a + b > n + 1.
** Boundary cases (a+b = n+1) are feasible: e.g. (n, 1) = [1,2,...,n] and
** (1, n) = [n, n-1, ..., 1] are the unique tight sequences.
*/

static int	valid_pair(int a, int b, int n)
{
	if (a < 1 || a > n || b < 1 || b > n)
		return (0);
	if (a + b > n + 1)
		return (0);
	return (1);
}

int	precheck_clues(const int *clues, int n)
{
	int	i;

	i = 0;
	while (i < n)
	{
		if (!valid_pair(clues[i], clues[n + i], n))
			return (0);
		if (!valid_pair(clues[2 * n + i], clues[3 * n + i], n))
			return (0);
		i++;
	}
	return (1);
}
