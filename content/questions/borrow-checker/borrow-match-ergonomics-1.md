---
id: borrow-match-ergonomics-1
categorySlug: borrow-checker
title: "Match Ergonomics"
difficulty: 2
tags: [borrowing, match]
---

# Prompt
What is the type of `s` in the `Some` arm?

# Code
```rust
fn show(x: &Option<String>) {
    match x {
        Some(s) => println!("{s}"),
        None => {}
    }
}
```

# Options
- [x] A) `&String`, via match ergonomics on `&Option`
- [ ] B) `String`, moved out of the borrowed option
- [ ] C) `&mut String`, because match always reborrows mut
- [ ] D) `&str`, because `String` always deref-coerces here

# Hint
Matching on a reference does not move the inner value.

# Explanation
Match ergonomics default-binds against a referenced scrutinee: `x` is `&Option<String>`, so `Some(s)` gives `s: &String` (equivalent to `Some(ref s)` on `*x`). Moving a `String` out of `&Option<String>` is not allowed. `s` is not `&str` unless you add a further deref/coercion in the pattern or body.
