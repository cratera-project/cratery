---
id: borrow-static-local-1
categorySlug: borrow-checker
title: "Static Bound on Locals"
difficulty: 2
tags: [borrowing, static]
---

# Prompt
Why can’t a local `String` satisfy a `'static` borrow bound?

# Code
```rust
fn needs_static(s: &'static str) {
    println!("{s}");
}

fn main() {
    let owned = String::from("hi");
    // needs_static(&owned); // error
}
```

# Options
- [x] A) The local is dropped at end of `main`, not `'static`
- [ ] B) `String` can never be borrowed as `&str` in Rust
- [ ] C) `needs_static` requires owned `String`, not a borrow
- [ ] D) Only `str` literals fail `'static`; locals always work

# Hint
`'static` means valid for the remaining program life.

# Explanation
`'static` references must be valid for the whole program. A local `String` is freed when `main` ends, so `&owned` is temporary. String literals and leaked/`Box::leak` data can be `'static`.
