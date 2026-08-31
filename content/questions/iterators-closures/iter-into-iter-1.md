---
id: iter-into-iter-1
categorySlug: iterators-closures
title: "into_iter vs iter"
difficulty: 2
tags: [iterators, ownership]
---

# Prompt
What is the key difference between these methods?

# Code
```rust
let v = vec![1, 2, 3];
for _ in v.iter() {}
for _ in v.into_iter() {}
```

# Options
- [ ] A) They are identical for every collection type
- [ ] B) `into_iter` is deprecated; always prefer `iter`
- [ ] C) `iter` moves items out; `into_iter` only borrows
- [x] D) `into_iter` consumes `v`; `iter` only borrows it

# Hint
After which call is `v` still usable?

# Explanation
`iter()` yields `&T` and leaves the collection owned. `into_iter()` consumes the collection and yields owned `T`. A bare `for x in v` desugars to `into_iter()`.
