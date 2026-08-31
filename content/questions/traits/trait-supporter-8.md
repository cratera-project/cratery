---
id: trait-supporter-8
categorySlug: traits
title: "AsRef vs Borrow"
difficulty: 3
tags: [traits, asref, borrow]
---

# Prompt
How does the `Borrow` trait differ from `AsRef`?

# Code
```rust
use std::borrow::Borrow;

fn lookup<K: Borrow<str>>(map: &std::collections::HashMap<String, i32>, key: K) -> Option<&i32> {
    map.get(key.borrow())
}
```

# Options
- [ ] A) `Borrow` creates heap clones while `AsRef` is zero-cost in runtime memory
- [x] B) `Borrow` guarantees identical `Hash`, `Eq`, and `Ord` semantics
- [ ] C) `AsRef` is only implemented for primitive numeric types in runtime memory
- [ ] D) `Borrow` requires unsafe code blocks to access inner data in code

# Hint
Borrow requires the borrowed form to have matching Eq and Hash implementations.

# Explanation
`Borrow<Borrowed>` requires that `Eq`, `Ord`, and `Hash` for a borrowed value act identically to the owned value, which is crucial for collections like `HashMap` and `BTreeSet`. `AsRef` makes no such behavioral guarantees.
