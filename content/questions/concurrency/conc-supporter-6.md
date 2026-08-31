---
id: conc-supporter-6
categorySlug: concurrency
title: "Memory Ordering Acquire-Release Pair"
difficulty: 3
tags: [concurrency, memory-ordering, acquire-release]
---

# Prompt
What guarantee is provided by pairing a `Release` store with an `Acquire` load?

# Code
```rust
use std::sync::atomic::{AtomicBool, Ordering};

static READY: AtomicBool = AtomicBool::new(false);
static mut DATA: i32 = 0;

fn writer() {
    unsafe { DATA = 42; }
    READY.store(true, Ordering::Release);
}

fn reader() -> Option<i32> {
    if READY.load(Ordering::Acquire) {
        Some(unsafe { DATA })
    } else {
        None
    }
}
```

# Options
- [ ] A) The entire program establishes a globally unified sequential execution order
- [ ] B) Operating system thread scheduling is synchronized across CPU cores in code
- [x] C) All prior writes in writer are visible to reader once load returns true
- [ ] D) The memory buffer is transferred through a kernel hardware pipeline in code

# Hint
Release synchronizes with Acquire to publish preceding memory modifications.

# Explanation
An `Acquire` load synchronizes-with a `Release` store on the same atomic variable. Any memory operations preceding the `Release` store in program order become visible to the thread that observes the store via an `Acquire` load.
