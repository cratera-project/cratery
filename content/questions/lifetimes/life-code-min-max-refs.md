---
id: life-code-min-max-refs
categorySlug: lifetimes
title: "Min and Max References"
difficulty: 2
tags: [lifetimes, coding]
kind: coding
---

# Prompt
Implement `min_max_refs<'a>(slice: &'a [i32]) -> Option<(&'a i32, &'a i32)>` returning borrowed references to the minimum and maximum elements in the slice.

# Code
```rust
pub fn min_max_refs<'a>(slice: &'a [i32]) -> Option<(&'a i32, &'a i32)> {
    if slice.is_empty() {
        return None;
    }
    let min = slice.iter().min()?;
    let max = slice.iter().max()?;
    Some((min, max))
}
```

# Solution
```rust
pub fn min_max_refs<'a>(slice: &'a [i32]) -> Option<(&'a i32, &'a i32)> {
    if slice.is_empty() {
        return None;
    }
    let min = slice.iter().min()?;
    let max = slice.iter().max()?;
    Some((min, max))
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let nums = [4, 1, 9, -2, 7];
    let (min, max) = min_max_refs(&nums).unwrap();
    assert_eq!(*min, -2);
    assert_eq!(*max, 9);
    assert!(min_max_refs(&[]).is_none());
    println!("test passed");
}
```

# Explanation
Implement `min_max_refs<'a>(slice: &'a [i32]) -> Option<(&'a i32, &'a i32)>` returning borrowed references to the minimum and maximum elements in the slice. Review the test cases to verify all assertions.
