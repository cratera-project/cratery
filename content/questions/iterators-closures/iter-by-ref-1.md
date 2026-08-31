---
id: iter-by-ref-1
categorySlug: iterators-closures
title: "Iterator by_ref"
difficulty: 2
tags: [iterators, by-ref]
---

# Prompt
What does `.by_ref()` let you do?

# Code
```rust
let mut it = [1, 2, 3, 4].into_iter();
let first_two: Vec<_> = it.by_ref().take(2).collect();
let rest: Vec<_> = it.collect();
```

# Options
- [ ] A) Clone every remaining item before further adapters run
- [ ] B) Convert the iterator into a parallel `rayon` pipeline
- [x] C) Borrow the iterator so later code can keep using it
- [ ] D) Force the iterator to restart from the first element

# Hint
Adapters often take `self`; `by_ref` peels that off.

# Explanation
Many iterator adapters consume `self`. `.by_ref()` borrows the iterator so you can apply adapters (like `take`) and still use the original afterward for the remainder.
