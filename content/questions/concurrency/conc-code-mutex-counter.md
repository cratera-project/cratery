---
id: conc-code-mutex-counter
categorySlug: concurrency
title: "Shared Mutex Counter"
difficulty: 2
tags: [concurrency, coding]
kind: coding
---

# Prompt
Implement `concurrent_count(threads: usize, increments_per_thread: usize) -> usize` using `Arc<Mutex<usize>>` to coordinate concurrent increments across threads.

# Code
```rust
use std::sync::{Arc, Mutex};
use std::thread;

pub fn concurrent_count(threads: usize, increments_per_thread: usize) -> usize {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();

    for _ in 0..threads {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..increments_per_thread {
                let mut lock = c.lock().unwrap();
                *lock += 1;
            }
        }));
    }

    for h in handles {
        h.join().unwrap();
    }

    let final_val = *counter.lock().unwrap();
    final_val
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let total = concurrent_count(4, 250);
    assert_eq!(total, 1000);
    println!("test passed");
}
```

# Explanation
Implement `concurrent_count(threads: usize, increments_per_thread: usize) -> usize` using `Arc<Mutex<usize>>` to coordinate concurrent increments across threads. Review the test cases to verify all assertions.
