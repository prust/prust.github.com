---
title: Multi-line strings are not part of ECMAScript
layout: post
tags: [Javascript]
author: prust
---

I've always stayed away from multi-line strings, but didn't realize until today that they aren't part of the ECMAScript standard:

```
var str = 'this is a long string, \
           that is two lines long.';
```

It also never dawned on me what exactly the backslash is doing: it is escaping the newline in the source code!

As [Google's styleguide says](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Multiline_string_literals#Multiline_string_literals):

> The whitespace at the beginning of each line
> can't be safely stripped at compile time;
> whitespace after the slash will result in tricky errors;
> and while most script engines support this, it is not part of ECMAScript.

Over the years, I've gravitated toward using simple string concatenation when I don't care about preserving newlines:

```
var str = 'this is a long string, ' +
          'that is two lines long.';
```

and array joining when I do want newlines:

```
var str = ['this is a long string, ',
           'that is two lines long.'].join('\n');
```

Neither is pretty, but we don't get true multi-line strings until ECMAScript 6:

```
var str = `this is a long string, 
           that is two lines long.`;
```