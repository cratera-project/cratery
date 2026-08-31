---
id: conc-code-mpsc-channel
categorySlug: concurrency
title: "MPSC Channel Message Sum"
difficulty: 2
tags: [concurrency, coding]
kind: coding
---

# Prompt
Implement `channel_sum(numbers: Vec<i32>) -> i32` sending each number through an `mpsc::channel` from a worker thread, and summing received messages in the main thread.

# Code
```rust
use std::sync::mpsc;
use std::thread;

pub fn channel_sum(numbers: Vec<i32>) -> i32 {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        for n in numbers {
            tx.send(n).unwrap();
        }
    });

    let mut sum = 0;
    while let Ok(val) = rx.recv() {
        sum += val;
    }
    sum
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let res = channel_sum(vec![1, 2, 3, 4, 5]);
    assert_eq!(res, 15);
    println!("test passed");
}
```

# Explanation
Implement `channel_sum(numbers: Vec<i32>) -> i32` sending each number through an `mpsc::channel` from a worker thread, and summing received messages in the main thread. Review the test cases to verify all assertions.
