---
id: own-mut-immut-1
categorySlug: ownership
title: "Mixed Borrows"
difficulty: 2
tags: [borrowing, mutability]
---

# Prompt
What borrowing rule prevents compilation?

# Code
```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &s;
    let r2 = &s;
    let r3 = &mut s;
    println!("{}, {}, {}", r1, r2, r3);
}
```

# Options
- [ ] A) At most two references may exist per value
- [x] B) Shared and mutable borrows cannot overlap
- [ ] C) Mutable borrows must be declared first always
- [ ] D) `String` requires every borrow to match kind

# Hint
Many `&T`, or one `&mut T`, not both.

# Explanation
You may have multiple shared borrows or one mutable borrow, but not both at once. Here `r1`/`r2` and `r3` overlap at the `println!`, so the code is rejected.
