---
title: `this` in Node modules and IIFEs
tags: [javascript, nodejs, iife, root, backbone, underscore, module]
author: prust
layout: post
---
For the past 8 months I've been following the convention in Backbone and Underscore and wrapping my modules in an [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) and setting a local variable `root` to whatever `this` is outside the IIFE:

```javascript
(function() {
  var root = this;
  // body of the module here

}).call(this);
```

This provides convenient access to the global context in both environments... at least that's what the Backbone docs said and I believed them. So I was surprised when I set properties on `root` but didn't find them available globally in Node. However, being new to Node, I assumed that this was because Node enforced stricter isolation between modules and that `global` was really a sort of pseudo-global that was just global to the module. Months later I found that different [Isomorphic Javascript](http://blog.nodejitsu.com/scaling-isomorphic-javascript-code) frameworks ([airBNB/rendr](https://github.com/airbnb/rendr) and [developmentseed/bones](https://github.com/developmentseed/bones)) were setting a boolean on the `global` object to indicate whether the module is running server-side or client-side... and that the global *was actually global*.

I had been fooled all this time: the docs were wrong (and [were corrected](https://github.com/documentcloud/backbone/issues/1751) shortly after I read them). `this` inside a module (and, hence, the `root` variable) does not refer to the `global` object in Node; it refers to `module.exports`. `this` only refers to the `global` object when it is inside a IIFE (provided the value of `this` is not overriden via `call()` or `apply()`).

It makes a lot of sense to map both of these (`exports` and `global`) to the `window` object in the browser. The simplest way is to map `exports` via an argument passed to the IIFE and to map `global` via a local variable set to `this`:

```javascript
(function(exports) {
  var global = this;

  // body of the module here

})(this);
```

These two variables can then be used for globals, imports and exports:

```javascript
(function(exports) {
  var global = this;
  var _ = global._ || require('underscore'); // imports
  var is_server = global.is_server;

  function Class1() { /* ... */ }
  function Class2() { /* ... */ }

  // exports
  exports.Class1 = Class1;
  exports.Class2 = Class2;

})(this);
```

There is still one case where it is necessary to fall back on a `typeof` check for Node-specific code: when you want to export a single class as the entire module:

```javascript
(function(exports) {
  var global = this;

  function Class1() { /* ... */ }

  // export Class1 as entire module
  if (typeof module != 'undefined')
    module.exports = Class1
  else
    global.Class1 = Class1;

})(this);
```
