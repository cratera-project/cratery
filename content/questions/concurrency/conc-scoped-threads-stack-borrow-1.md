---
id: conc-scoped-threads-stack-borrow-1
categorySlug: concurrency
title: "std::thread::scope Borrow Safety"
difficulty: 2
tags: [concurrency, scoped-threads, lifetimes]
---

# Prompt
Why can threads spawned via `std::thread::scope` borrow non-'static stack data safely?

# Options
- [x] A) It guarantees threads join before the scope closure returns
- [ ] B) It converts local stack variables into heap-allocated Arcs
- [ ] C) It requires all borrowed stack references to live forever
- [ ] D) It runs all spawned thread closures sequentially in order

# Hint
The scope closure cannot exit until all spawned threads have terminated and joined.

# Explanation
`thread::scope` guarantees that all spawned threads complete before the scope exits, ensuring any stack references borrowed by threads remain valid for their entire execution.
