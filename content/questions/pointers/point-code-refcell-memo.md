---
id: point-code-refcell-memo
categorySlug: pointers
title: "Interior Mutability Counter with RefCell"
difficulty: 2
tags: [pointers, coding]
kind: coding
---

# Prompt
Define `pub struct SharedCounter { count: std::cell::RefCell<u64> }` with `new(initial: u64)`, `increment(&self)`, and `get(&self) -> u64`.

# Code
```rust
use std::cell::RefCell;

pub struct SharedCounter {
    count: RefCell<u64>,
}

impl SharedCounter {
    pub fn new(initial: u64) -> Self {
        Self { count: RefCell::new(initial) }
    }

    pub fn increment(&self) {
        *self.count.borrow_mut() += 1;
    }

    pub fn get(&self) -> u64 {
        *self.count.borrow()
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let c = SharedCounter::new(0);
    c.increment();
    c.increment();
    assert_eq!(c.get(), 2);
    println!("test passed");
}
```

# Explanation
Define `pub struct SharedCounter { count: std::cell::RefCell<u64> }` with `new(initial: u64)`, `increment(&self)`, and `get(&self) -> u64`. Review the test cases to verify all assertions.
