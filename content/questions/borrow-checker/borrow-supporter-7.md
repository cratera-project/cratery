---
id: borrow-supporter-7
categorySlug: borrow-checker
title: "Aliasing Rule: One Mutable XOR Many Shared"
difficulty: 1
tags: [borrow-checker, invariants, aliasing]
---

# Prompt
What is the fundamental aliasing invariant enforced by the Rust borrow checker?

# Code
```rust
fn main() {
    let mut x = 5;
    let _r1 = &x;
    let _r2 = &x; // OK: multiple shared
    // let _m = &mut x; // Error: cannot borrow as mutable while shared
}
```

# Options
- [x] A) At any given time, you can have either one mutable reference OR any number of shared references
- [ ] B) You can have up to two mutable references if they operate on distinct CPU threads in runtime memory
- [ ] C) Shared references are only allowed for types that implement the `Display` trait within local thread memory
- [ ] D) Mutable references must always be stored in heap-allocated Box containers within local thread memory

# Hint
References must be either exclusively mutable XOR non-exclusively shared.

# Explanation
Rust's core safety invariant states: for any memory location, you can have any number of immutable shared references (`&T`), OR exactly one exclusive mutable reference (`&mut T`), but never both simultaneously.
