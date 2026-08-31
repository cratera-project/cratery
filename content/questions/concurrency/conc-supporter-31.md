---
id: conc-supporter-31
categorySlug: concurrency
title: "AtomicUsize vs Mutex<usize> Performance"
difficulty: 2
tags: [concurrency, atomics, mutex]
---

# Prompt
Why is `AtomicUsize` generally faster than `Mutex<usize>` for a single counter?

# Code
```rust
use std::sync::atomic::{AtomicUsize, Ordering};

static COUNTER: AtomicUsize = AtomicUsize::new(0);

fn tick() {
    COUNTER.fetch_add(1, Ordering::Relaxed);
}
```

# Options
- [ ] A) It runs the increment asynchronously on a background thread pool in runtime memory
- [ ] B) It stores counter data in CPU register space permanently in runtime memory
- [ ] C) It disables compiler bounds checks during arithmetic updates in runtime memory
- [x] D) It maps to single hardware CPU instructions without OS context switches

# Hint
Atomics use hardware lock-free instructions (like LOCK XADD on x86) with no syscalls.

# Explanation
`AtomicUsize` compiles directly to single hardware atomic CPU instructions (e.g. `LOCK XADD` on x86), avoiding OS syscalls, thread parking, and context switches involved in `Mutex`.
