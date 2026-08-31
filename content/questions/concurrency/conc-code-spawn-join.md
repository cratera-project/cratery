---
id: conc-code-spawn-join
categorySlug: concurrency
title: "Parallel Thread Sum"
difficulty: 2
tags: [concurrency, coding]
kind: coding
---

# Prompt
Implement `parallel_sum(a: i32, b: i32) -> i32` spawning two threads: one computing `a * 2`, one computing `b * 3`, and joining both to return their sum.

# Code
```rust
use std::thread;

pub fn parallel_sum(a: i32, b: i32) -> i32 {
    let h1 = thread::spawn(move || a * 2);
    let h2 = thread::spawn(move || b * 3);
    h1.join().unwrap() + h2.join().unwrap()
}
```

# Solution
```rust
use std::thread;

pub fn parallel_sum(a: i32, b: i32) -> i32 {
    let h1 = thread::spawn(move || a * 2);
    let h2 = thread::spawn(move || b * 3);
    h1.join().unwrap() + h2.join().unwrap()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(parallel_sum(5, 4), 10 + 12);
    println!("test passed");
}
```

# Explanation
Implement `parallel_sum(a: i32, b: i32) -> i32` spawning two threads: one computing `a * 2`, one computing `b * 3`, and joining both to return their sum. Review the test cases to verify all assertions.
