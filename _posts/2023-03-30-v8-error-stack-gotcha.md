---
title: v8's Error.stack gotcha
tags: [Javascript, node.js, tips]
author: prust
subhead: v8 caches Error.stack and never invalidates the cache
---

## The Problem

Last week, [Travis Harris](https://github.com/tvharris) (a coworker) and I discovered a "gotcha" regarding appending to JavaScript's Error `.message` property, and the way that is (and isn't) reflected in the Error's `.stack` property.

It's a common and recommended practice to `try`/`catch` errors and to append additional context to the error's `.message` before re-throwing the error. One very common example is catching a `JSON.parse()` error and appending to the error message some or all of the string that failed to parse, since this isn't included in the `.message` by default. The example I ran into last week was an `assert()` in a low-level test helper function that was throwing the error, and a `try`/`catch` in a higher-level test helper that added context to the error message.

The problem was, when the assertion failed and the test framework reported the error, **it reported the original error message**, without the added context. This is problematic, since test failures should include as much context as possible (this is especially helpful for debugging intermittent failures or failures that only happen on CI).

## Understanding Why

The error message in the test framework output was coming from the error's `.stack` property, since it (for convenience, presumably) includes a mashup of both the error message and the stack trace. I assumed that the `.stack` property was evaluated and set in stone when the Error was created, so I made my code append the extra context to both `.message` and `.stack`. This isn't very helpful, since it's easy to miss the additional context at the bottom of the stack trace, but I figured it was the most pragmatic solution.

But in the code review, Travis questioned this, and when I explained my assumption about the behavior of `.stack`, he showed that I was wrong and that `.stack` _does_ include an updated `.message`.

It took some additional testing and googling to discover the difference between the behavior I was seeing and the behavior Travis was seeing. It turns out that the v8 engine [lazily generates the `.stack` the first time it is accessed and, for performance reasons, caches it](https://github.com/nodejs/node/issues/13832#issuecomment-309926008) for the future, and doesn't invalidate the cached value when the `.message` is changed.

To exacerbate this behavior, Node's assert() [accesses the `.stack`](https://github.com/nodejs/node/blob/v18.15.0/lib/assert.js#L293), pinning it to its original value.

## TL/DR

- If you append context to Error messages (you should) and use a test framework that reports the `.stack` (you probably do), then you should avoid prematurely accessing the `.stack` in your code and in the libraries you use.
- Chai's `assert()` library doesn't touch the stack and is (mostly?) API compatible with Node's `assert()`, so I was able to swap it in, working around the problem.
