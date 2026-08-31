---
id: ptr-arc-clone-1
categorySlug: pointers
title: "Arc Clone Cost"
difficulty: 2
tags: [pointers, arc]
---

# Prompt
What does `Arc::clone` primarily cost?

# Code
```rust
use std::sync::Arc;
let a = Arc::new(vec![1, 2, 3]);
let b = Arc::clone(&a);
```

# Options
- [x] A) An atomic reference-count increment, not a deep copy
- [ ] B) A full deep clone of the `Vec` into a new allocation
- [ ] C) A mutex lock around the entire process address space
- [ ] D) Moving the vector out of `a`, leaving `a` empty

# Hint
Sharing is cheap; cloning `T` is a separate choice.

# Explanation
`Arc::clone` bumps an atomic strong count so another owner shares the same allocation. It does not clone the inner `Vec`. Use `(*a).clone()` / `T: Clone` when you need a deep copy.
