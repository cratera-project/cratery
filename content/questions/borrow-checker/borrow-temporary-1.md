---
id: borrow-temporary-1
categorySlug: borrow-checker
title: "Temporary Values and Lifetimes"
difficulty: 2
tags: [borrowing, temporaries]
---

# Prompt
Why does this not compile?

# Code
```rust
let r = String::from("hello").as_str();
println!("{r}");
```

# Options
- [ ] A) `as_str` takes ownership and drops the temporary early
- [x] B) Temporary `String` drops at statement end, so `r` dangles
- [ ] C) `println!` requires an owned `String`, not a `&str` slice
- [ ] D) `r` must be marked `mut` to point at heap-allocated text

# Hint
Ask how long the temporary `String` lives.

# Explanation
`String::from("hello")` is a temporary. `as_str()` returns a `&str` into that temporary, which is dropped at the end of the statement. Binding `r` for a later statement would create a dangling reference, so Rust rejects it.
