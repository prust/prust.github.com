---
title: Revisiting the Test Pyramid
tags: [tips]
author: prust
---
* Rehash Fowler's test pyramid
* relate experiences & quotes re: "friction" - things that slow down development and in particular test friction - mocks, & stubs & spies, partial/unrealistic data, pieces of the system, various dependencies half-running, etc
* relate curve of software development cost & the need to "flatten the curve"
* subsystem tests: well-defined, isolated interface that changes infrequently (if at all) - could be function, but typically not - would have to be functional (no side-effects, zero dependencies on DB, state, etc)
* integration tests (subcutaneous?) that tests the whole system as realistically as possible (not defining half-complete, unrealistic data -- smallest thing that could possibly work)

