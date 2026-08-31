---
id: iter-code-zip-indices
categorySlug: iterators-closures
title: "Dot Product of Vectors"
difficulty: 1
tags: [iterators-closures, coding]
kind: coding
---

# Prompt
Implement `dot_product(a: &[i32], b: &[i32]) -> i32` calculating the sum of `a[i] * b[i]` for corresponding elements using `.iter().zip().map().sum()`.

# Code
```rust
pub fn dot_product(a: &[i32], b: &[i32]) -> i32 {
    a.iter().zip(b.iter()).map(|(x, y)| x * y).sum()
}
```

# Solution
```rust
pub fn dot_product(a: &[i32], b: &[i32]) -> i32 {
    a.iter().zip(b.iter()).map(|(x, y)| x * y).sum()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let a = [1, 2, 3];
    let b = [4, 5, 6];
    assert_eq!(dot_product(&a, &b), 4 + 10 + 18);
    println!("test passed");
}
```

# Explanation
Implement `dot_product(a: &[i32], b: &[i32]) -> i32` calculating the sum of `a[i] * b[i]` for corresponding elements using `.iter().zip().map().sum()`. Review the test cases to verify all assertions.
