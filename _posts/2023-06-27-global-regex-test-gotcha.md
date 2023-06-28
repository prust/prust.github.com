---
title: Global regexes & .test()
tags: [Javascript, tips]
author: prust
subhead: When .test() return true, the .lastIndex doesn't reset, even when testing another string
---

## The Problem

The more I've used regular expressions in JavaScript, the more I've tended to use the global flag, since this is typically the behavior I want (for example, when doing `str.replace(regex)` or `regex.exec(str)`).

Recently, I created a regex to determine if a SQL statement manipulates the DB (insert/update/delete) or if it's a simple query (select):

```
let is_change_regex = /^INSERT|^UPDATE|^DELETE/gi;
```

Notice that I included a `g` flag at the end to make it `global` out of habit.

However, when I ran `is_change_regex.test(sql)` against several `DELETE` statements, every _other_ one returned `true`. They are all `DELETE` statements, so I had expected all of them to return `true`.

## Understanding Why

As usual, MDN gives a clear explanation of what's going on in the [`RegExp.test()` docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag):

> When a regex has the global flag set, `test()` will advance the `lastIndex` of the regex. Further calls to `test(str)` will resume searching `str` starting from `lastIndex`. The `lastIndex` property will continue to increase each time `test()` returns `true`.

Then it highlights the gotcha with a highlighted **Note**:

> **Note:** As long as `test()` returns `true`, `lastIndex` will _not_ reset — even when testing a different string!

This mostly makes sense when thinking about it from an implementation standpoint. The `.lastIndex` property is how a `global` regex can maintain state when replacing something multiple times throughout a string, or when `.exec()` is called multiple times against the same string. It makes sense that using a `global` regex with `.test()` would allow the caller to `test()` the string multiple times, walking through the string to see how many regex matches there are in it.

But it's counter-intuitive that it doesn't reset the `.lastIndex` when testing a different string. Perhaps the implementers felt like that was too much magic, or may not be performant.

## TL/DR

- Unless you're intentionally calling `.test()` multiple times with the same string to see how many matches are in the string, you probably don't want to use `.test()` with a `global` regex. It's best to use a regular regex, to avoid unintuitive behavior.
- It's probably better to only use `global` regexes when you know you need them (typically for `str.replace(regex)` and `regex.exec(str)`), and to default to regular, non-global regexes.
