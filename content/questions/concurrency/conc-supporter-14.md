---
id: conc-supporter-14
categorySlug: concurrency
title: "Atomic Sequential Consistency (SeqCst)"
difficulty: 3
tags: [concurrency, atomics, seqcst]
---

# Prompt
What does `Ordering::SeqCst` enforce beyond Acquire and Release?

# Code
```rust
use std::sync::atomic::{AtomicBool, Ordering};

static FLAG: AtomicBool = AtomicBool::new(false);

fn main() {
    FLAG.store(true, Ordering::SeqCst);
    let _ = FLAG.load(Ordering::SeqCst);
}
```

# Options
- [ ] A) Complete suspension of compiler vectorization and unrolling in code
- [ ] B) Automatic deadlock prevention on nested Mutex locks in runtime memory
- [x] C) A globally uniform total execution order observed by all threads
- [ ] D) Kernel-level thread prioritization for the active core in runtime memory

# Hint
Sequential consistency establishes a single total program order.

# Explanation
`Ordering::SeqCst` enforces a single, globally agreed-upon total execution order of all `SeqCst` operations across all threads in the system, preventing reordering that could otherwise appear in Acquire/Release.
