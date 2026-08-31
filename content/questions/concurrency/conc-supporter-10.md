---
id: conc-supporter-10
categorySlug: concurrency
title: "Arc::make_mut Copy-on-Write"
difficulty: 3
tags: [concurrency, arc, cow]
---

# Prompt
What does `Arc::make_mut(&mut arc)` do when `strong_count > 1`?

# Code
```rust
use std::sync::Arc;

fn main() {
    let mut data = Arc::new(vec![1, 2, 3]);
    let _other = Arc::clone(&data);
    let mutable_ref = Arc::make_mut(&mut data);
    mutable_ref.push(4);
    println!("{data:?}");
}
```

# Options
- [ ] A) Panics immediately because shared pointers cannot be mutated in runtime memory
- [ ] B) Blocks the current thread until all other Arc clones are dropped in code
- [x] C) Clones the inner value to create a private unique copy before mutation
- [ ] D) Modifies the shared buffer in-place without notifying other handles in code

# Hint
Arc::make_mut provides Copy-on-Write semantics.

# Explanation
`Arc::make_mut` checks if the `Arc` is uniquely owned. If `strong_count > 1`, it clones the inner data into a fresh unique `Arc` allocation and returns a mutable reference `&mut T` to the private copy.
