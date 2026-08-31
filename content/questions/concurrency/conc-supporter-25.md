---
id: conc-supporter-25
categorySlug: concurrency
title: "AtomicBool Fetch Operations"
difficulty: 2
tags: [concurrency, atomics, fetch-or]
---

# Prompt
What does `flag.fetch_or(true, Ordering::SeqCst)` return?

# Code
```rust
use std::sync::atomic::{AtomicBool, Ordering};

fn main() {
    let flag = AtomicBool::new(false);
    let old = flag.fetch_or(true, Ordering::SeqCst);
    assert_eq!(old, false);
    assert_eq!(flag.load(Ordering::SeqCst), true);
}
```

# Options
- [ ] A) The new boolean value resulting from the OR operation in code
- [x] B) The previous boolean value before the OR operation occurred
- [ ] C) `true` if and only if the bitwise operation changed state in code
- [ ] D) A boolean error flag indicating whether bus collision occurred

# Hint
All fetch_* methods on atomics return the previous value held by the atomic.

# Explanation
`AtomicBool::fetch_or(val, ...)` performs a bitwise OR operation and returns the *previous* boolean value that was contained in the atomic before the operation.
