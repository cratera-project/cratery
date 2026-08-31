---
id: conc-code-atomic-bool
categorySlug: concurrency
title: "Lock-Free Atomic Flag"
difficulty: 2
tags: [concurrency, coding]
kind: coding
---

# Prompt
Implement `AtomicFlag` using `std::sync::atomic::AtomicBool`. Support `new()`, `set()`, and `is_set() -> bool` with `Ordering::SeqCst`.

# Code
```rust
use std::sync::atomic::{AtomicBool, Ordering};

pub struct AtomicFlag {
    flag: AtomicBool,
}

impl AtomicFlag {
    pub fn new() -> Self {
        Self { flag: AtomicBool::new(false) }
    }

    pub fn set(&self) {
        self.flag.store(true, Ordering::SeqCst);
    }

    pub fn is_set(&self) -> bool {
        self.flag.load(Ordering::SeqCst)
    }
}
```

# Solution
```rust
use std::sync::atomic::{AtomicBool, Ordering};

pub struct AtomicFlag {
    flag: AtomicBool,
}

impl AtomicFlag {
    pub fn new() -> Self {
        Self { flag: AtomicBool::new(false) }
    }

    pub fn set(&self) {
        self.flag.store(true, Ordering::SeqCst);
    }

    pub fn is_set(&self) -> bool {
        self.flag.load(Ordering::SeqCst)
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let flag = AtomicFlag::new();
    assert!(!flag.is_set());
    flag.set();
    assert!(flag.is_set());
    println!("test passed");
}
```

# Explanation
Implement `AtomicFlag` using `std::sync::atomic::AtomicBool`. Support `new()`, `set()`, and `is_set() -> bool` with `Ordering::SeqCst`. Review the test cases to verify all assertions.
