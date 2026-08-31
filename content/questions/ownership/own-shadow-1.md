---
id: own-shadow-1
categorySlug: ownership
title: "Shadowing vs Move"
difficulty: 2
tags: [ownership, shadowing]
---

# Prompt
Why does the second `let s` compile after printing the `String`?

# Code
```rust
fn main() {
    let s = String::from("hello");
    println!("{s}");
    let s = s.len();
    println!("{s}");
}
```

# Options
- [ ] A) `len()` returns a borrow of the original `s`
- [ ] B) Integers and strings share the same binding
- [x] C) Shadowing makes a new binding; old `s` ends
- [ ] D) The first `s` is implicitly cloned into `len`

# Hint
`let s = ...` again is not the same as `s = ...`.

# Explanation
The second `let s` shadows the first. RHS runs first: `s.len()` borrows the `String` and yields a `usize`. Then the new `s` binding takes that `usize`, and the previous owned `String` is dropped. This is shadowing, not a move of `s` into an integer.
