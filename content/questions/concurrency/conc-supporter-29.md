---
id: conc-supporter-29
categorySlug: concurrency
title: "Atomic Fence Operations"
difficulty: 3
tags: [concurrency, fence, memory-ordering]
---

# Prompt
What is `std::sync::atomic::fence` used for?

# Code
```rust
use std::sync::atomic::{fence, Ordering};

fn sync_memory() {
    fence(Ordering::SeqCst);
}
```

# Options
- [ ] A) Blocks thread execution until all CPU cache lines are completely drained in runtime memory
- [x] B) Establishes memory synchronization order without binding to a specific variable
- [ ] C) Prevents thread interrupts and context switches in kernel space within local thread memory
- [ ] D) Allocates a hardware synchronization barrier on the processor bus in runtime memory

# Hint
Atomic fences establish ordering constraints independent of individual atomic variables.

# Explanation
`std::sync::atomic::fence(ordering)` inserts a memory barrier that synchronizes memory accesses without operating directly on a specific atomic variable.
