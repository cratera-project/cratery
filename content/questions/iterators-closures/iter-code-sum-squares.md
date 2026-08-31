---
id: iter-code-sum-squares
categorySlug: iterators-closures
title: "Sum of Even Squares"
difficulty: 1
tags: [iterators-closures, coding]
kind: coding
---

# Prompt
Implement `sum_even_squares(nums: &[i32]) -> i32` that filters even numbers, squares them, and returns their sum.

# Code
```rust
pub fn sum_even_squares(nums: &[i32]) -> i32 {
    nums.iter().filter(|&&x| x % 2 == 0).map(|&x| x * x).sum()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(sum_even_squares(&[1, 2, 3, 4]), 20);
    assert_eq!(sum_even_squares(&[1, 3, 5]), 0);
    println!("test passed");
}
```

# Explanation
Implement `sum_even_squares(nums: &[i32]) -> i32` that filters even numbers, squares them, and returns their sum. Review the test cases to verify all assertions.
