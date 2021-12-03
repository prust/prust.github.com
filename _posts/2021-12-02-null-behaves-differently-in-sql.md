---
title: null behaves differently in SQL
tags: [SQL, tips]
author: prust
---

### A Broken Validation Query

We recently had a bug where child records were getting stripped in a deep-clone operation, but what surprised me more than the bug was that our validation routines hadn't alerted us to the problem.

The key part of the validation query boiled down to something like this:

```
WHERE child_join.num_records <> num_expected_child_records
```

This checks, for each record, whether the number of child records matches what's expected. But it hadn't returned anything, even though there were no child records and that clearly wasn't the expected number.

When I debugged the problem I found that the value of `child_join.num_records` was `null` (as you may have guessed from this post's title). It was `null` because it was coming from a `COUNT(*)` in a joined subquery:

```
LEFT JOIN (
    SELECT COUNT(*) AS num_records
    FROM child_table
    GROUP BY parent_id
) AS child_join ON child_join.parent_id = parent.id

WHERE child_join.num_records <> num_expected_child_records
```

### Understanding Why

Why doesn't `null <> num_expected_child_records` evaluate to `true`? It would in JavaScript or Python. But the standard SQL comparison operators handle `null` differently, as explained in the PostgreSQL docs:

> Ordinary comparison operators yield `null` (signifying “unknown”), not `true` or `false`, when either input is `null`. For example, `7 = NULL` yields `null`, as does `7 <> NULL`.

This means that using `NOT` in combination with `=` won't work either:

```
WHERE NOT (child_join.num_records = num_expected_child_records)
```

In popular dynamic languages like Python and JavaScript, the comparison operators boil everything down to `true` or `false`, so that downstream code only has to deal with those two values. But in SQL, comparison operators can return _three_ values: `true`, `false` or `null`. The upshot of this is that a `null` value will be propagated and can "infect" downstream code if it isn't handled at one of the layers.

### What To Do About It

One way to approach this problem is to use an alternative comparison operator. SQL:2003 introduced a new operator that handles `null` in the same way that Python and JavaScript do: `IS (NOT) DISTINCT FROM`. So the above `WHERE` clause would look like this:

```
WHERE child_join.num_records IS DISTINCT FROM num_expected_child_records
```

Note that SQLite does not support this operator. An older way to handle this situation is to use an additional `IS (NOT) NULL` clause, like this:

```
WHERE child_join.num_records <> num_expected_child_records AND child_join.num_records IS NOT NULL
```

But my preferred approach in this situation is to use `COALESCE()` because I think it most clearly signals the intent to treat a `null` as equivalent to `0` records:

```
WHERE COALESCE(child_join.num_records, 0) <> num_expected_child_records
```
