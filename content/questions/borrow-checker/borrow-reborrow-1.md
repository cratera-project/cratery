---
id: borrow-reborrow-1
categorySlug: borrow-checker
title: "Reborrowing Rules"
difficulty: 2
tags: [borrowing, reborrow]
---

# Prompt
Why does this fail to compile?

# Code
```rust
let mut x = 10;
let r1 = &mut x;
let r2 = &*r1;
*r1 += 1;
println!("{r2}");
```

# Options
- [ ] A) Immutable reborrows always cancel the original `&mut`
- [ ] B) `println!` forces exclusive access to every argument
- [ ] C) `i32` implements `Copy`, so reborrowing is forbidden
- [x] D) `r2` stays live through `println!`, blocking `*r1`

# Hint
An immutable reborrow from `&mut` still forbids mutation while it is live.

# Explanation
You may reborrow immutably from a `&mut`, but while that reborrow is live you cannot mutate through the original. Because `r2` is used later in `println!`, `*r1 += 1` overlaps a live shared borrow and is rejected.
