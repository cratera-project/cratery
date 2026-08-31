---
id: borrow-lifetime-link-1
categorySlug: borrow-checker
title: "Reference Lifetime Scope"
difficulty: 2
tags: [borrowing, scope]
---

# Prompt
How would you fix this code to satisfy the borrow checker?

# Code
```rust
let r;
{
    let x = 5;
    r = &x;
}
println!("{r}");
```

# Options
- [ ] A) Annotate `r` as `&'static i32` so it outlives `x`
- [ ] B) Wrap `x` in `Box` so the reference becomes owned
- [x] C) Declare `x` in the outer scope so it outlives `r`
- [ ] D) Mark `r` as `mut` so the borrow can be extended

# Hint
A reference cannot outlive the value it points to.

# Explanation
`x` is dropped at the end of the inner block, so `r` would dangle. Moving `x` into the outer scope keeps the referent alive for as long as `r` is used. Lifetime annotations describe relationships; they do not create storage.
