---
id: own-code-drain-filter
categorySlug: ownership
title: "Retain Lower Numbers"
difficulty: 2
tags: [ownership, vec, coding]
kind: coding
---

# Prompt
Implement `retain_below` to keep only elements strictly less than `threshold` in the given vector, modifying it in-place.

# Code
```rust
pub fn retain_below(v: &mut Vec<i32>, threshold: i32) {
    // TODO: Retain elements < threshold
    todo!()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut nums = vec![1, 5, 2, 8, 3, 10];
    retain_below(&mut nums, 5);
    assert_eq!(nums, vec![1, 2, 3]);
    println!("all tests passed");
}
```

# Hint
Vec::retain accepts a predicate closure.

# Explanation
`Vec::retain` modifies the vector in-place by dropping elements for which the predicate returns false, shifting remaining items without allocating a new buffer.
