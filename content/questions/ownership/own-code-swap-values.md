---
id: own-code-swap-values
categorySlug: ownership
title: "Swap Strings In-Place"
difficulty: 1
tags: [ownership, mem, coding]
kind: coding
---

# Prompt
Implement `swap_strings` to swap the contents of two mutable `String` references without allocating or cloning.

# Code
```rust
pub fn swap_strings(a: &mut String, b: &mut String) {
    // TODO: Swap contents in-place
    todo!()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut s1 = String::from("left");
    let mut s2 = String::from("right");
    swap_strings(&mut s1, &mut s2);
    assert_eq!(s1, "right");
    assert_eq!(s2, "left");
    println!("all tests passed");
}
```

# Hint
Check std::mem::swap.

# Explanation
`std::mem::swap` exchanges the values at two mutable locations safely without copying or allocating heap memory.
