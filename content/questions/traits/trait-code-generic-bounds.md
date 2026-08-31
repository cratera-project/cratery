---
id: trait-code-generic-bounds
categorySlug: traits
title: "Generic Greater Item"
difficulty: 2
tags: [traits, coding]
kind: coding
---

# Prompt
Implement a generic function `greater<T: Ord>(a: T, b: T) -> T` returning the strictly greater value (or `b` if equal).

# Code
```rust
pub fn greater<T: Ord>(a: T, b: T) -> T {
    if a > b { a } else { b }
}
```

# Solution
```rust
pub fn greater<T: Ord>(a: T, b: T) -> T {
    if a > b { a } else { b }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(greater(5, 10), 10);
    assert_eq!(greater("zebra", "apple"), "zebra");
    println!("test passed");
}
```

# Explanation
Implement a generic function `greater<T: Ord>(a: T, b: T) -> T` returning the strictly greater value (or `b` if equal). Review the test cases to verify all assertions.
