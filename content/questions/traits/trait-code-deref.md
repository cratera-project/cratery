---
id: trait-code-deref
categorySlug: traits
title: "Implement Deref for Wrapper"
difficulty: 2
tags: [traits, coding]
kind: coding
---

# Prompt
Implement `std::ops::Deref` for `pub struct Wrapped<T>(pub T)` targeting type `T`.

# Code
```rust
use std::ops::Deref;

pub struct Wrapped<T>(pub T);

impl<T> Deref for Wrapped<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
```

# Solution
```rust
use std::ops::Deref;

pub struct Wrapped<T>(pub T);

impl<T> Deref for Wrapped<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let w = Wrapped(String::from("inner"));
    assert_eq!(w.len(), 5);
    assert_eq!(&*w, "inner");
    println!("test passed");
}
```

# Explanation
Implement `std::ops::Deref` for `pub struct Wrapped<T>(pub T)` targeting type `T`. Review the test cases to verify all assertions.
