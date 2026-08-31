---
id: borrow-method-call-1
categorySlug: borrow-checker
title: "Method Call Desugaring"
difficulty: 2
tags: [borrowing, methods]
---

# Prompt
Does this compile, and why?

# Code
```rust
let mut s = String::from("hi");
let len = s.len();
s.push_str("!");
println!("{len}");
```

# Options
- [x] A) Yes: `len()`’s borrow ends when the call returns
- [ ] B) No: `len()` keeps a shared borrow of `s` alive
- [ ] C) No: `len` stores a mutable borrow used by `println!`
- [ ] D) Yes: method calls never borrow their receiver

# Hint
A method borrow usually lasts only for that call expression.

# Explanation
`len()` takes `&self` only for the call. Once it returns an `usize`, no borrow of `s` remains, so `push_str` can take `&mut s`. The code compiles.
