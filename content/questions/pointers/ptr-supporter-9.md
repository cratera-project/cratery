---
id: ptr-supporter-9
categorySlug: pointers
title: "Aliasing Rules for Raw Pointers vs References"
difficulty: 2
tags: [pointers, raw-pointers, aliasing]
---

# Prompt
Can multiple `*mut T` raw pointers alias the same memory location simultaneously in safe blocks?

# Code
```rust
fn main() {
    let mut x = 42;
    let p1: *mut i32 = &mut x;
    let p2: *mut i32 = &mut x;
    println!("{p1:p} {p2:p}");
}
```

# Options
- [x] A) Yes; creating and holding multiple raw pointers is safe, but dereferencing requires unsafe
- [ ] B) No; creating multiple `*mut T` pointers is an immediate compiler error within local thread memory
- [ ] C) Only if `x` implements the `Copy` and `Clone` traits during standard program runtime execution
- [ ] D) Only when compiled under debug mode with sanitizers disabled under current compiler safety rules

# Hint
Creating raw pointers is safe; dereferencing them is unsafe.

# Explanation
Creating multiple raw pointers (`*const T` or `*mut T`) that point to the same memory is permitted in safe Rust code. Undefined Behavior only arises if dereferencing violates Rust's aliasing or validity rules in `unsafe`.
