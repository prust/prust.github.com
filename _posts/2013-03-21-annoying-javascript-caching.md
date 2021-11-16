---
title: Annoying Javascript Caching
tags: [Javascript, node.js]
author: prust
---

As our team has started to move from web-powered desktop apps to true web apps, we've been bit more than once by Chrome caching the javascript files.

Once Chrome has cached your files, the simplest way I've found to force Chrome to get the latest of a particular file is to find it in the Network panel, right-click to open it in a new tab and hit Ctrl+F5.

But it would be even better to tell Chrome to stop. And really, this isn't Chrome's fault. It's the server's fault, which is sending headers telling Chrome to cache the Javascript.

If you're using node's `http-server`, the default is a cache header of 1 hour (don't ask me why). To drop the cache header to 10 seconds, you could send `-c10`, or to disable caching entirely, send `-c-1`:

```
http-server -c-1
```

If you're using the `node-static` file server, you can turn off caching like this:

```javascript
var fileServer = new static.Server("./public", {
  headers: { "Cache-Control": "no-cache, must-revalidate" },
});
```
