---
title: git URLs in NPM compare package.json versions
tags: [npm]
author: prust
---
The npm [package.json docs](https://npmjs.org/doc/json.html) make it sound like you can use git URLs for dependent repos and reference them via a tag, branch-name or commit SHA. While this is technically true, the docs don’t mention that “npm install” will compare the local version of the repository and the remote one (at that tag/branch/commit) and if they are identical, it will assume that nothing needs to be done -- even if the tag/branch/commit URL previously used to pull that repo is different from the current tag/branch/commit.

For instance, if your main repo depends on “my-sub-repo#master” and you change it to “my-sub-repo#new-feature” and don’t change the version in package.json on the new-feature branch, “npm install” will do nothing. You have to change the version on that branch to something like “1.1.0-new-feature.1″ and then “npm install” will realize that it different from what was previously downloaded (“master”) and will update it.