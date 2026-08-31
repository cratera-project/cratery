---
id: borrow-nll-1
categorySlug: borrow-checker
title: "Non-Lexical Lifetimes"
difficulty: 3
tags: [borrowing, nll]
---

# Prompt
Why does this compile under current stable Rust?

# Code
```rust
let mut s = String::from("hello");
let r = &s;
println!("r: {r}");
s.push_str(" world");
```

# Options
- [ ] A) `push_str` ignores any outstanding shared borrows
- [ ] B) `r` is cleared automatically when `s` becomes mutable
- [ ] C) Scopes still end all borrows only at the closing brace
- [x] D) NLL ends the borrow of `r` after its last use

# Hint
Borrows last until last use, not necessarily until the end of the block.

# Explanation
With non-lexical lifetimes (the default since Rust 2018), a borrow ends at its last use. Here `r` is last used in `println!`, so the shared borrow is over before `push_str` needs `&mut s`.
