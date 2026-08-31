---
id: borrow-exclusive-mut-1
categorySlug: borrow-checker
title: "Exclusive Mutable Borrows"
difficulty: 1
tags: [borrowing, mutability]
---

# Prompt
Why does this fail?

# Code
```rust
let mut s = String::from("hi");
let r1 = &mut s;
let r2 = &mut s;
println!("{r1} {r2}");
```

# Options
- [ ] A) `String` forbids mutable references by default
- [x] B) Two live `&mut` to the same value are not allowed
- [ ] C) `println!` requires both arguments to be immutable
- [ ] D) Mutable borrows must use `ref mut` binding syntax

# Hint
At most one exclusive borrow may be live at a time.

# Explanation
Rust allows either one `&mut` or any number of `&`, but not two overlapping `&mut` to the same place. Both `r1` and `r2` are used in `println!`, so both would be live together.
