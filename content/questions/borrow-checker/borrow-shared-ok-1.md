---
id: borrow-shared-ok-1
categorySlug: borrow-checker
title: "Multiple Shared Borrows"
difficulty: 1
tags: [borrowing, shared]
---

# Prompt
Why does this compile?

# Code
```rust
let s = String::from("hi");
let r1 = &s;
let r2 = &s;
println!("{r1} {r2}");
```

# Options
- [ ] A) `String` is `Copy`, so each `&` clones the whole buffer
- [x] B) Shared `&` borrows may overlap; only `&mut` is exclusive
- [ ] C) `println!` upgrades both references into mutable ones
- [ ] D) Two `&String` values merge into one compiler-tracked borrow

# Hint
Shared and exclusive access are asymmetric rules.

# Explanation
Any number of immutable (`&`) borrows may exist at once because they cannot mutate. The exclusivity rule applies to `&mut`. Here both `r1` and `r2` are shared, so the code is fine.
