# Quadratic Placement Lesson Notes

## Core instance

- Cells: A, B, C, D, E, F
- Fixed pads: A at `(0,0)` and D at `(8,8)`
- Free cells: B, C, E, F
- Starter total HPWL: `52`
- Source quadratic-lite result: approximately `48`

## HPWL

For one net:

```text
HPWL = (max x - min x) + (max y - min y)
```

The four-pin net A-B-C-D spans 8 units in both directions:

```text
HPWL = 8 + 8 = 16
```

Starter totals:

```text
A-B      8
C-D      8
A-C      8
B-D      8
A-B-C-D 16
E-F      4
Total   52
```

## Quadratic-lite update

For each free cell:

```text
new_x = 0.55 * average_neighbor_x + 0.45 * old_x
new_y = 0.55 * average_neighbor_y + 0.45 * old_y
```

The course runs six passes. A and D never update.

## Why the result is modest

- E-F almost merge and save roughly 4 units.
- A and D remain at opposite corners.
- Most other net bounding boxes still span a large part of the board.
- The starter therefore changes from 52 to about 48.

## Comparison warning

An unconstrained force-directed result near 18.7 is not directly comparable to
the pad-constrained result near 48. A fair comparison uses the same instance,
fixed pads, net model, iteration budget, and metric.

## What HPWL misses

Low HPWL can still produce:

- Cell overlap
- Density overflow
- Legalization failures
- Timing violations

Report coordinates, HPWL, and density together.
