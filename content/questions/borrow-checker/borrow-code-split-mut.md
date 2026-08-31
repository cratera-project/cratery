---
id: borrow-code-split-mut
categorySlug: borrow-checker
title: "Mutate Halves with split_at_mut"
difficulty: 2
tags: [borrow-checker, coding]
kind: coding
---

# Prompt
Implement `add_to_halves` taking a mutable slice of even length, splitting it down the middle with `split_at_mut`, adding 10 to every element in the first half and 20 to every element in the second half.

# Code
```rust
pub fn add_to_halves(slice: &mut [i32]) {
    let mid = slice.len() / 2;
    let (left, right) = slice.split_at_mut(mid);
    for x in left.iter_mut() {
        *x += 10;
    }
    for x in right.iter_mut() {
        *x += 20;
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut data = [1, 2, 3, 4];
    add_to_halves(&mut data);
    assert_eq!(data, [11, 12, 23, 24]);
    println!("test passed");
}
```

# Explanation
Implement `add_to_halves` taking a mutable slice of even length, splitting it down the middle with `split_at_mut`, adding 10 to every element in the first half and 20 to every element in the second half. Review the test cases to verify all assertions.
