#!/usr/bin/env python3
"""Add 42 header to the top of each source file listed on argv."""
import sys
import os

HDR_TEMPLATE = """/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   {fname:<51}:+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: claude <claude@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/18 00:00:00 by claude          #+#    #+#              */
/*   Updated: 2026/04/18 00:00:00 by claude         ###   ########.fr        */
/*                                                                            */
/* ************************************************************************** */

"""

def add_header(path):
    fname = os.path.basename(path)
    assert len(fname) <= 51, f"filename too long: {fname}"
    hdr = HDR_TEMPLATE.format(fname=fname)
    with open(path) as f:
        body = f.read()
    # strip any existing 42-style header (starts with /* **... and ends with */)
    lines = body.split('\n')
    if lines and lines[0].startswith('/* **'):
        # find the closing marker and skip
        end = 0
        for i, L in enumerate(lines):
            if i > 0 and L.startswith('/* **'):
                end = i + 1
                break
        body = '\n'.join(lines[end:]).lstrip('\n')
    with open(path, 'w') as f:
        f.write(hdr + body)

for p in sys.argv[1:]:
    add_header(p)
    print(f"hdr: {p}")
