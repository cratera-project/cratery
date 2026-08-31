---
id: conc-supporter-1
categorySlug: concurrency
title: "Atomic Failure Ordering Constraints"
difficulty: 3
tags: [concurrency, atomics, memory-ordering]
---

# Prompt
Why cannot the failure ordering of `compare_exchange` be `Release` or `AcqRel`?

# Code
```rust
use std::sync::atomic::{AtomicUsize, Ordering};

fn main() {
    let a = AtomicUsize::new(0);
    let _ = a.compare_exchange(0, 1, Ordering::SeqCst, Ordering::Relaxed);
}
```

# Options
- [ ] A) Atomic registers cannot synchronize memory during hardware bus faults
- [x] B) Failure performs a read operation only, so no stores can be released
- [ ] C) Hardware cache lines are invalidated on failed compare-and-swap
- [ ] D) Release ordering requires exclusive write locks in the kernel scheduler

# Hint
When a compare-and-swap fails, no store takes place.

# Explanation
A failed `compare_exchange` performs only a load (read) of the current value. Because no store (write) occurs on failure, it cannot establish a "release" synchronization relationship.
