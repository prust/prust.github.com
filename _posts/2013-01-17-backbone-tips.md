---
title: Backbone Tips
tags: [Backbone.js]
author: prust
---
A team member asked me for some Backbone tips and, while I don't profess to be a Backbone guru yet, I have been around the block with Backbone a few times and thought it would be beneficial to share some things I've learned.  Please, take what follows with a grain of salt and correct me where you think differently.

# Keep the view self-contained & isolated to the view’s element
One recommendation off the top would be to let Backbone’s base view class create the view’s element for you – you can parameterize the tagName and className and add attributes to it in the constructor – and to constrain all DOM event-handlers and selector queries to within that element (via the jquery-wrapped reference, `this.$el`, and a declarative `events` dictionary). The new `listenTo()` and `stoplistening()` handlers (added in 0.9.9) are preferable over the `.on()`/`.off()` because they unbind the events automatically for you on `remove()`.

# Relationships / Associations
If you need to work with relationships between models (like you would with data from a relational database) and needing to ensure that there is never more than one model object that represents a DB record, I would recommend using [Supermodel.js](http://pathable.github.com/supermodel/) (or possibly [backbone-associations](https://github.com/dhruvaray/backbone-associations)).

# Subcutaneous Testing
Writing tests of the view layer that need to find things in the DOM and trigger DOM events can take a lot of developer time and is also an order of magnitude slower than unit tests that don’t involve the DOM (whether it’s the real DOM in a browser or the jsdom simulation in node). So we’ve been toying with the idea of doing what Martin Fowler calls “Subcutaneous testing” – testing everything but the thin outer “skin” via an M-V-VM pattern (Model – View – ViewModel), where the ViewModel or “Presentation Model” contains all presentation logic (but no DOM code) and has a very thin layer of generic code on top of it that keeps it in sync with a DOM template (perhaps [rivets](http://rivetsjs.com/) or [plates](https://github.com/flatiron/plates)).

# Use Backbone.Sync or write a pluggable sync adapter for all model CRUD
I wish I had followed this advice much earlier, instead I did what most people do and just hacked in the creation and saving of models by overriding save(), etc. It’s much better to learn do it the Backbone way and implement a Backbone.Sync plugin. There already are plugins readily available for Postgres, Socket.io, localStorage, Mongo, etc. This leads to more interchangeable code and coding styles, lends itself to cleaner separation and getting familiar with the established backbone APIs and allows you to swap in different persistence engines if you want.

# Getters/Setters
I recommend iterating over all the attributes names for your model and using `__defineGetter__` to make getters for them – that way you can use dot notation, which I find a lot cleaner and more maintainable. But for setting, you typically want to use .set() and consolidate as much as possible by passing multiple attributes to set() at a time, rather than doing separate .set() calls for each one (it’s more performant that way and you have a lot fewer change events to manage).

# Collection.fetch and Collection.comparator
`Collection.fetch()` takes an `{update: true}` option which is very handy, if you pass a property name string as the comparator, rather than a function, then Backbone Collections will automatically re-sort if necessary, should that property change on a model. If you do pass in a comparator function, beware of wrapping or binding the function you pass in because Backbone’s behavior differs based on the number of arguments the function takes and wrapping/binding the function obscures the number of arguments (see the [comparator docs](http://backbonejs.org/#Collection-comparator)).

# Read the Source & Step Through It
The one thing that will give you the best understanding of backbone is to read & step through the source. It might seem intimidating at first, but it’s actually comparatively quite short and well-written and designed for readability (unlike the source of jquery & other hefty libraries) – the annotated source is often a good starting point – and is the best path to mastery. If something doesn’t behave as you would expect, the best thing is usually to set a breakpoint and walk through it.
