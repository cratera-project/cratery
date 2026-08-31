---
id: life-code-longest-str
categorySlug: lifetimes
title: "Longer of Two Slices"
difficulty: 1
tags: [lifetimes, coding]
kind: coding
---

# Prompt
Implement `longest<'a>(x: &'a str, y: &'a str) -> &'a str` that returns the string slice with greater character length (returning `x` in case of a tie).

# Code
```rust
pub fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() {
        x
    } else {
        y
    }
}
```

# Solution
```rust
pub fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() {
        x
    } else {
        y
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let a = "short";
    let b = "longer string";
    assert_eq!(longest(a, b), "longer string");
    assert_eq!(longest("same", "size"), "same");
    println!("test passed");
}
```

# Explanation
Implement `longest<'a>(x: &'a str, y: &'a str) -> &'a str` that returns the string slice with greater character length (returning `x` in case of a tie). Review the test cases to verify all assertions.
