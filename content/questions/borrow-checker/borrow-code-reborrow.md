---
id: borrow-code-reborrow
categorySlug: borrow-checker
title: "Repeated Mutable Increment"
difficulty: 1
tags: [borrow-checker, coding]
kind: coding
---

# Prompt
Implement `increment_counter` taking `cnt: &mut u64` and `times: usize`, adding 1 to `*cnt` for `times` iterations in a loop.

# Code
```rust
pub fn increment_counter(cnt: &mut u64, times: usize) {
    for _ in 0..times {
        *cnt += 1;
    }
}
```

# Solution
```rust
pub fn increment_counter(cnt: &mut u64, times: usize) {
    for _ in 0..times {
        *cnt += 1;
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut c = 10;
    increment_counter(&mut c, 5);
    assert_eq!(c, 15);
    println!("test passed");
}
```

# Explanation
Implement `increment_counter` taking `cnt: &mut u64` and `times: usize`, adding 1 to `*cnt` for `times` iterations in a loop. Review the test cases to verify all assertions.
