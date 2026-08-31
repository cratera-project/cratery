---
id: borrow-iter-mut-1
categorySlug: borrow-checker
title: "Iterator Invalidation"
difficulty: 2
tags: [borrowing, iterators]
---

# Prompt
Why doesn’t this compile?

# Code
```rust
let mut v = vec![1, 2, 3];
for x in &v {
    v.push(*x);
}
```

# Options
- [x] A) The shared borrow from `&v` overlaps `push`’s `&mut v`
- [ ] B) `for` loops cannot iterate integers stored in vectors
- [ ] C) `push` requires `v` to implement `Copy` before growing
- [ ] D) Indexing inside loops is deprecated on edition 2021

# Hint
Iteration holds a borrow for the whole loop body.

# Explanation
`for x in &v` keeps an immutable borrow of `v` alive for the loop. `v.push` needs a mutable borrow of the same vector, which conflicts. Collect indices/values first, or use other patterns that don’t alias mutably while iterating.
