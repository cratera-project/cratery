---
id: borrow-code-index-mut
categorySlug: borrow-checker
title: "Double First Even Number"
difficulty: 1
tags: [borrow-checker, coding]
kind: coding
---

# Prompt
Implement `double_first_even` to find the first even number in a mutable slice of integers, double its value in place, and return `true`. If no even number exists, return `false`.

# Code
```rust
pub fn double_first_even(slice: &mut [i32]) -> bool {
    if let Some(first) = slice.iter_mut().find(|x| **x % 2 == 0) {
        *first *= 2;
        true
    } else {
        false
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut arr = [1, 3, 4, 6];
    assert!(double_first_even(&mut arr));
    assert_eq!(arr, [1, 3, 8, 6]);

    let mut odds = [1, 3, 5];
    assert!(!double_first_even(&mut odds));
    println!("test passed");
}
```

# Explanation
Implement `double_first_even` to find the first even number in a mutable slice of integers, double its value in place, and return `true`. If no even number exists, return `false`. Review the test cases to verify all assertions.
