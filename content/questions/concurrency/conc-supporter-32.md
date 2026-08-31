---
id: conc-supporter-32
categorySlug: concurrency
title: "Arc Strong Count vs Weak Count"
difficulty: 3
tags: [concurrency, arc, drop]
---

# Prompt
When does `Arc<T>` deallocate the underlying heap allocation for `T`?

# Code
```rust
use std::sync::Arc;

fn main() {
    let strong = Arc::new(String::from("data"));
    let weak = Arc::downgrade(&strong);
    drop(strong);
    assert!(weak.upgrade().is_none());
}
```

# Options
- [x] A) `T` is dropped when `strong_count` hits 0; memory is freed when `weak_count` also hits 0
- [ ] B) Memory and `T` are both immediately deallocated when `strong_count` hits 0 in runtime memory
- [ ] C) `T` is kept alive until the process terminates regardless of counts within local thread memory
- [ ] D) `T` is moved onto the stack of the last thread referencing `weak` within local thread memory

# Hint
The inner T is dropped when strong count reaches 0, but the counter block persists until weak count is 0.

# Explanation
When `strong_count` drops to 0, the inner `T` is destroyed (`Drop::drop`). However, the memory block containing the reference counters remains allocated until all `Weak` references are dropped (`weak_count == 0`).
