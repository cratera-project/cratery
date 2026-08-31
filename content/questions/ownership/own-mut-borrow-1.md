---
id: own-mut-borrow-1
categorySlug: ownership
title: "Mutable Borrowing Check"
difficulty: 2
tags: [borrowing, mutability]
---

# Prompt
Which rule prevents this code from compiling?

# Code
```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &mut s;
    let r2 = &mut s;
    println!("{}, {}", r1, r2);
}
```

# Options
- [x] A) Only one active `&mut` to a value is allowed
- [ ] B) Mutable borrows always need lifetime annotations
- [ ] C) `String` forbids holding more than one reference
- [ ] D) You must call `reborrow()` before a second `&mut`

# Hint
Alias XOR mutate: exclusivity for `&mut`.

# Explanation
Rust allows either one mutable reference or any number of shared references, not overlapping mutable borrows. Two simultaneous `&mut s` values would alias and could race, so the borrow checker rejects this.
