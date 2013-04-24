---
title: Readability != closeness-to-natural-language
tags: [node,readability]
author: prust
---
I used to equate readability with closeness-to-natural-language, but have found that this does not always ring true. Sometimes a DSL is more readable than it's natural language equivalent, due to a higher signal-to-noise ratio.

In my opinion, CSS and HTML fit into this category, along with glob and, in rare cases, regular expressions (whose idea was it to make a DSL where capitalization of things like `\w` is not only significant, but it *negates* the meaning?!).

For example, `glob('*.sql', ...)` is more readable than `_.filter(files, function(file) { return _.str.endsWith(file, '.sql'); });`. You can just look at `glob('*.sql', ...)` and you know what it means. This ability to glance at it and know its meaning instantly, without needing to read or parse a sentence makes it even more readable than the natural language equivalent, "filter to all the files that end with .sql".