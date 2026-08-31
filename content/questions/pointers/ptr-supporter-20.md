---
id: ptr-supporter-20
categorySlug: pointers
title: "std::ptr::eq Pointer Comparison"
difficulty: 2
tags: [pointers, eq, references]
---

# Prompt
What does `std::ptr::eq(r1, r2)` test when passed two references `&T`?

# Code
```rust
use std::ptr;

fn main() {
    let s1 = String::from("hi");
    let s2 = String::from("hi");
    assert!(!ptr::eq(&s1, &s2));
}
```

# Options
- [ ] A) Whether the contents of both structs are structurally equal in code
- [ ] B) Whether both references share the same generic lifetime in runtime memory
- [ ] C) Whether both values were allocated on the same page in runtime memory
- [x] D) Whether both references point to the exact same memory address

# Hint
ptr::eq compares pointer addresses, not equality of the referenced values.

# Explanation
`std::ptr::eq` compares the raw memory addresses of two references, returning `true` only if they point to the exact same memory location, bypassing any `PartialEq` implementation.
