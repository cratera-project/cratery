---
id: iter-code-closure-fnmut
categorySlug: iterators-closures
title: "Apply Mutating Closure"
difficulty: 2
tags: [iterators-closures, coding]
kind: coding
---

# Prompt
Implement `apply_each<F: FnMut(&mut i32)>(slice: &mut [i32], mut f: F)` applying the closure in-place to each element of the slice.

# Code
```rust
pub fn apply_each<F: FnMut(&mut i32)>(slice: &mut [i32], mut f: F) {
    for x in slice.iter_mut() {
        f(x);
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut arr = [1, 2, 3];
    apply_each(&mut arr, |x| *x *= 10);
    assert_eq!(arr, [10, 20, 30]);
    println!("test passed");
}
```

# Explanation
Implement `apply_each<F: FnMut(&mut i32)>(slice: &mut [i32], mut f: F)` applying the closure in-place to each element of the slice. Review the test cases to verify all assertions.
