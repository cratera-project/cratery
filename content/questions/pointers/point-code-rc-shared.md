---
id: point-code-rc-shared
categorySlug: pointers
title: "Shared Reference Counting with Rc"
difficulty: 2
tags: [pointers, coding]
kind: coding
---

# Prompt
Implement `share_and_count(item: String) -> (std::rc::Rc<String>, usize)` creating an `Rc<String>`, cloning it once, and returning `(cloned_rc, Rc::strong_count(&rc))`.

# Code
```rust
use std::rc::Rc;

pub fn share_and_count(item: String) -> (Rc<String>, usize) {
    let original = Rc::new(item);
    let clone = Rc::clone(&original);
    (clone, Rc::strong_count(&original))
}
```

# Solution
```rust
use std::rc::Rc;

pub fn share_and_count(item: String) -> (Rc<String>, usize) {
    let original = Rc::new(item);
    let clone = Rc::clone(&original);
    (clone, Rc::strong_count(&original))
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let (rc, count) = share_and_count(String::from("data"));
    assert_eq!(*rc, "data");
    assert_eq!(count, 2);
    println!("test passed");
}
```

# Explanation
Implement `share_and_count(item: String) -> (std::rc::Rc<String>, usize)` creating an `Rc<String>`, cloning it once, and returning `(cloned_rc, Rc::strong_count(&rc))`. Review the test cases to verify all assertions.
