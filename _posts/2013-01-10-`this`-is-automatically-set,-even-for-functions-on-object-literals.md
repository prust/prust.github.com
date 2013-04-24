---
title: `this` is automatically set, even for functions on object literals
tags: [Javascript]
author: prust
---
Whenever you use dot notation to call a function that is a property of the object, `this` is set to that object -- even if it’s a simple object literal:

    >>> var obj = {'a': function() {return this;}};
    >>> obj.a()
    Object { a=function()}