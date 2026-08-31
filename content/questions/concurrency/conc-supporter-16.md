---
id: conc-supporter-16
categorySlug: concurrency
title: "Relaxed Ordering Guarantees"
difficulty: 3
tags: [concurrency, atomics, relaxed]
---

# Prompt
What guarantee is provided by atomic operations with `Ordering::Relaxed`?

# Code
```rust
use std::sync::atomic::{AtomicU32, Ordering};

fn increment(counter: &AtomicU32) {
    counter.fetch_add(1, Ordering::Relaxed);
}
```

# Options
- [x] A) Atomicity and modification order of that single variable only
- [ ] B) Synchronization of all surrounding memory reads and writes in code
- [ ] C) Deterministic instruction execution order across CPU pipelines
- [ ] D) Hardware memory barrier synchronization across all cores in code

# Hint
Relaxed only guarantees atomicity of the operation itself with no cross-variable ordering.

# Explanation
`Ordering::Relaxed` guarantees only that the atomic operation itself is atomic (no tearing) and that all threads agree on a single modification order for that specific atomic variable, with zero cross-variable synchronization or ordering.
