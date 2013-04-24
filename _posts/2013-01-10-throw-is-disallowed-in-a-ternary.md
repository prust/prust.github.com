---
title: throw is disallowed in a ternary
tags: [Javascript]
author: prust
---
I hadn’t realized this before, but `throw` is a statement -- just like `var` -- and therefore cannot be used in a ternary or anywhere that requires an expression. So you can’t do this:

    callback ? callback(err) : throw err;

You have to either fall back to an `if/else` or wrap the throw in an anonymous function.