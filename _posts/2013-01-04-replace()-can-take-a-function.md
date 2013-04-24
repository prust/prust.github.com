---
title: replace() can take a function
tags: [Javascript]
author: prust
---
I discovered today that `String.replace()` can take a function as the second argument. I checked the [ECMAScript 5.1 reference](http://www.ecma-international.org/ecma-262/5.1/#sec-15.5.4.11) and it looks like it matches the [MDN docs](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/replace) (though it is much less readable, as any good spec should be ;-).

The arguments passed to the function begin with `match` (the matched substring), followed by one argument for each regex capture group, followed by `offset` (the offset of the matched substring), and finally `string` (the entire string).

So you can do something like this:

    " test ".replace(/t(e)s(t)/, function(match, grp1, grp2, offset, str) {
    return 't' + grp2 + 's' + grp1;
    });

And it will swap the two capture groups, resulting in “ttse”. Of course, this example would be better written as `" test ".replace(/t(e)s(t)/, "t$2s$1");` but I’m sure I’ll find a situation someday that calls for the added flexibility.