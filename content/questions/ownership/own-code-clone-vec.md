---
id: own-code-clone-vec
categorySlug: ownership
title: "Duplicate Vector Elements"
difficulty: 1
tags: [ownership, clone, coding]
kind: coding
---

# Prompt
Implement `duplicate_items` to take an owned `Vec<String>`, clone it, and return a tuple `(Vec<String>, Vec<String>)` containing both vectors.

# Code
```rust
pub fn duplicate_items(v: Vec<String>) -> (Vec<String>, Vec<String>) {
    // TODO: Clone and return both
    todo!()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let v = vec![String::from("a"), String::from("b")];
    let (v1, v2) = duplicate_items(v);
    assert_eq!(v1, vec!["a", "b"]);
    assert_eq!(v2, vec!["a", "b"]);
    println!("all tests passed");
}
```

# Hint
Use .clone() on the vector to duplicate its heap allocation.

# Explanation
Calling `v.clone()` creates an independent heap copy of the vector and its string elements, allowing you to return both the original owned vector and its clone.
