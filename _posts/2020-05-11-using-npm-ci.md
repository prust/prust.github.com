---
title: Using npm ci
tags: tips
author: prust
subhead: Attempting to create reproducible builds.
---

According to the docs on [npm package locks](https://docs.npmjs.com/files/package-locks), the presence of `package-lock.json` is supposed to mean that npm install will recreate the exact same node_modules structure and will not make changes to `package-lock.json`:

> The presence of a package lock changes the installation behavior such that:
>
> 1. The module tree described by the package lock is reproduced. This means reproducing the structure described in the file, using the specific files referenced in “resolved” if available, falling back to normal package resolution using “version” if one isn’t.
> 2. The tree is walked and any missing dependencies are installed in the usual fashion.

But in practice I have found there are often differences, like versions of npm that [change the hash from sha1 to sha512](https://stackoverflow.com/questions/47638381/why-did-package-lock-json-change-the-integrity-hash-from-sha1-to-sha512) or de-duplicate a dependency via changing its position in the hierarchy. I have a feeling that I've caught it making changes to versions of packages, but perhaps that's just paranoia and didn't actually happen. At any rate, I have a subtle-yet-disturbing sense that using `npm install` incrementally does not consistently create reproducible builds.

The other factor that reinforced this unsettled feeling is the fact that npm introduced a new command, [npm ci](https://docs.npmjs.com/cli/ci.html), which is for when "you want to make sure you’re doing a clean install of your dependencies". What does "clean" mean? Not simply that it deletes `/node_modules/` and starts over (eventually resulting in the same reproducible build that npm install would have produced), but rather that it "is more strict than a regular install, which can help catch errors or inconsistencies caused by the incrementally-installed local environments of most npm users".

That sentence raises questions for me. How exactly is `npm install` less strict? How can `npm install`, when used incrementally, create "errors or inconsistencies"? And what do they mean by "incrementally-installed local environments"? In my understanding it is the _modules_ that are installed incrementally, not environments. Are they referring to the build chain used to install native modules? Unfortunately, the blog post [introducing npm ci](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable) doesn't answer these questions, it just adds to the vague impression that `npm install` should not be depended on to create reproducible builds.

Therefore, I am going to try to do the following:

- use `npm ci` when doing a fresh install (no previous node_modules folder)
- use `npm ci` whenever I'm doing a major branch change or going far back in history
- use `npm ci` if I haven't run it in a week or more (but not daily because it's slower than incremental npm installs)
- examine package-lock.json diffs when they happen to better understand what `npm install` is doing
- use `npm ci` in all CI environments and deploy scripts
