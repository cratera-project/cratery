---
id: borrow-closure-capture-1
categorySlug: borrow-checker
title: "Closure Capture Conflicts"
difficulty: 2
tags: [borrowing, closures]
---

# Prompt
Why is this rejected?

# Code
```rust
let mut s = String::from("hi");
let r = &s;
let mut c = || s.push_str("!");
c();
println!("{r}");
```

# Options
- [ ] A) Closures cannot capture `String` values in safe Rust
- [ ] B) `push_str` requires `s` to be `'static` before use
- [ ] C) Closures that mutate need `move` on every capture
- [x] D) `r` borrows `s` while the closure needs `&mut s`

# Hint
Shared and exclusive access still cannot overlap.

# Explanation
`r` holds an immutable borrow of `s`. The closure captures `s` mutably to call `push_str`, which needs exclusive access. Those borrows overlap, so the code is rejected.
