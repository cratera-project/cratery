---
id: own-rc-vs-clone-1
categorySlug: ownership
title: "Clone vs Share"
difficulty: 2
tags: [ownership, rc, clone]
---

# Prompt
When is `Rc` a better fit than `Clone` on a large value?

# Code
```rust
// Large tree or graph nodes shared by many owners
```

# Options
- [ ] A) When every owner must deep-copy the entire payload
- [x] B) When many owners should share one allocation cheaply
- [ ] C) When the value must cross thread boundaries unsafely
- [ ] D) When you want mutation without any synchronization

# Hint
`Clone` duplicates; `Rc` shares.

# Explanation
`Clone` creates another owned copy (often expensive). `Rc` (single-threaded) shares one allocation via reference counts. Cross-thread sharing needs `Arc`; shared mutation needs interior mutability.
