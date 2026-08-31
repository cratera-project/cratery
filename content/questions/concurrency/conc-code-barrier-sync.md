---
id: conc-code-barrier-sync
categorySlug: concurrency
title: "Thread Synchronization with Barrier"
difficulty: 3
tags: [concurrency, coding]
kind: coding
---

# Prompt
Implement `sync_workers(n_workers: usize)` using `std::sync::Barrier` to coordinate `n_workers` threads reaching a rendezvous point before completing.

# Code
```rust
use std::sync::{Arc, Barrier};
use std::thread;

pub fn sync_workers(n_workers: usize) -> Vec<usize> {
    let barrier = Arc::new(Barrier::new(n_workers));
    let mut handles = Vec::new();

    for i in 0..n_workers {
        let b = Arc::clone(&barrier);
        handles.push(thread::spawn(move || {
            b.wait();
            i
        }));
    }

    handles.into_iter().map(|h| h.join().unwrap()).collect()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let results = sync_workers(4);
    assert_eq!(results.len(), 4);
    println!("test passed");
}
```

# Explanation
Implement `sync_workers(n_workers: usize)` using `std::sync::Barrier` to coordinate `n_workers` threads reaching a rendezvous point before completing. Review the test cases to verify all assertions.
