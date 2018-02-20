---
title: SQLite's HAVING clause picks an arbitrary row
tags: [sql, sqlite, postgresql]
author: prust
layout: post
---

Most SQL engines don't allow non-aggregate expressions in the `HAVING` clause. For instance, the [Postgres docs][1] state:

> Each column referenced in `condition` must unambiguously reference a grouping column

SQLite, on the other hand, [takes a surprising approach][2]:

> If a HAVING clause is a non-aggregate expression,
> it is evaluated with respect to an arbitrarily selected row from the group.

Perhaps this approach has precedence in other SQL implementations, but I would much prefer a hard fail over an arbitrary result.


[1]: http://www.postgresql.org/docs/9.2/static/sql-select.html
[2]: http://www.sqlite.org/lang_select.html#resultset