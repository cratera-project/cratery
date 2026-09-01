---
id: own-supporter-2
categorySlug: ownership
title: "mem::swap Exclusive Borrows"
difficulty: 2
tags: [ownership, mem, swap]
---

# Prompt
Why does `std::mem::swap` require mutable references to both arguments?

# Code
```rust
use std::mem;
fn main() {
    let mut x = String::from("a");
    let mut y = String::from("b");
    mem::swap(&mut x, &mut y);
    println!("{x} {y}");
}
```

# Options
- [x] A) It must write into both places, so each needs an exclusive `&mut`
- [ ] B) It clones both values first, so both types must implement `Clone`
- [ ] C) It runs Drop on both values, so both bindings must be declared `mut`
- [ ] D) It heap-allocates a temporary, so both owners must remain valid

# Hint
Exchanging contents in-place requires writing new data into both places.

# Explanation
The signature is `swap<T>(x: &mut T, y: &mut T)`. Docs: it swaps the values at two mutable locations without deinitializing either one (no `Drop`, no `Clone`). `&mut` makes both places readable and writable and non-overlapping, which is required because each location is overwritten.
