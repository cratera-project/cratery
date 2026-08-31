---
id: borrow-return-local-1
categorySlug: borrow-checker
title: "Returning a Local Borrow"
difficulty: 2
tags: [borrowing, lifetimes]
---

# Prompt
Why can’t this function return `&s`?

# Code
```rust
fn make() -> &String {
    let s = String::from("hi");
    &s
}
```

# Options
- [ ] A) Functions may never return references in safe Rust
- [ ] B) `String` must implement `Copy` before borrowing it
- [ ] C) The return type needs an explicit `'static` lifetime
- [x] D) `s` is dropped on return, so `&s` would dangle

# Hint
Who owns the `String` after `make` returns?

# Explanation
`s` is a local; it is dropped when `make` returns. Returning `&s` would hand the caller a dangling pointer. Return an owned `String` (or borrow from a parameter / `'static` data) instead.
