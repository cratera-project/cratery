---
id: point-code-arc-clone
categorySlug: pointers
title: "Thread-Safe Vector Sharing with Arc"
difficulty: 2
tags: [pointers, coding]
kind: coding
---

# Prompt
Implement `spawn_sum_reader(data: std::sync::Arc<Vec<i32>>) -> std::thread::JoinHandle<i32>` that spawns a thread summing the elements and joins to return the sum.

# Code
```rust
use std::sync::Arc;
use std::thread;

pub fn spawn_sum_reader(data: Arc<Vec<i32>>) -> thread::JoinHandle<i32> {
    thread::spawn(move || data.iter().sum())
}
```

# Solution
```rust
use std::sync::Arc;
use std::thread;

pub fn spawn_sum_reader(data: Arc<Vec<i32>>) -> thread::JoinHandle<i32> {
    thread::spawn(move || data.iter().sum())
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let numbers = Arc::new(vec![10, 20, 30]);
    let handle = spawn_sum_reader(Arc::clone(&numbers));
    assert_eq!(handle.join().unwrap(), 60);
    println!("test passed");
}
```

# Explanation
Implement `spawn_sum_reader(data: std::sync::Arc<Vec<i32>>) -> std::thread::JoinHandle<i32>` that spawns a thread summing the elements and joins to return the sum. Review the test cases to verify all assertions.
