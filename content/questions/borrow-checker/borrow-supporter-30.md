---
id: borrow-supporter-30
categorySlug: borrow-checker
title: "Borrow Checker and Option::as_ref in Match"
difficulty: 2
tags: [borrow-checker, option, as_ref]
---

# Prompt
Why is `opt.as_ref()` commonly used when matching on `&Option<T>`?

# Code
```rust
fn inspect(opt: &Option<String>) {
    match opt.as_ref() {
        Some(s) => println!("string len: {}", s.len()),
        None => println!("none"),
    }
}
```

# Options
- [ ] A) Duplicates the `Option` on the heap to prevent borrow conflicts within local thread memory
- [ ] B) Turns the `Option` into a Result with panic diagnostics under current compiler safety rules
- [ ] C) Forces the match expression to execute at compile time under current compiler safety rules
- [x] D) Converts `&Option<T>` to `Option<&T>` so pattern matching borrows the inner `T` cleanly

# Hint
as_ref turns &Option<T> into Option<&T>.

# Explanation
`Option::as_ref(&self)` converts `&Option<T>` into `Option<&T>`, making it easy to match against `Some(s)` where `s` is `&T` without consuming or moving the original `Option`.
