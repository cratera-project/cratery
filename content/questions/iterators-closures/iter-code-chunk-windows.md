---
id: iter-code-chunk-windows
categorySlug: iterators-closures
title: "Window Triplet Maxima"
difficulty: 2
tags: [iterators-closures, coding]
kind: coding
---

# Prompt
Implement `triplet_maxima(nums: &[i32]) -> Vec<i32>` that uses `.windows(3)` and returns the maximum element of each 3-element sliding window.

# Code
```rust
pub fn triplet_maxima(nums: &[i32]) -> Vec<i32> {
    nums.windows(3).map(|w| *w.iter().max().unwrap()).collect()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let res = triplet_maxima(&[1, 3, 2, 5, 4]);
    assert_eq!(res, vec![3, 5, 5]);
    println!("test passed");
}
```

# Explanation
Implement `triplet_maxima(nums: &[i32]) -> Vec<i32>` that uses `.windows(3)` and returns the maximum element of each 3-element sliding window. Review the test cases to verify all assertions.
