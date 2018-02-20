---
title: jQuery setters act as getters if you pass undefined, breaking jQuery chainability
tags: [jQuery]
author: prust
---
This code works fine most of the time:
  
    var link = $('<a>').text(this.model.get('name'));
  
`.text()`, when used as a setter, returns a reference to the link and you can continue chaining to your heart's content.
  
That is, until `this.model.get(‘name’)` is `undefined`. When that happens, jQuery thinks you're `.text()` as a getter instead of a setter and `link` is set to an empty string instead of a jQueryified element -- which breaks subsequent code.