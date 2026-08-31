---
id: borrow-supporter-28
categorySlug: borrow-checker
title: "Borrow Checker and DerefMut Reborrowing"
difficulty: 2
tags: [borrow-checker, deref-mut, reborrow]
---

# Prompt
How does the compiler treat `let s: &mut str = &mut *boxed_str;` for `Box<str>`?

# Code
```rust
fn main() {
    let mut b: Box<str> = String::from("hello").into_boxed_str();
    let s: &mut str = &mut *b;
    s.make_ascii_uppercase();
    println!("{b}");
}
```

# Options
- [ ] A) Moves the `Box` out of `b` and destroys the heap pointer under current compiler safety rules
- [x] B) Invokes `DerefMut::deref_mut` to produce an exclusive sub-borrow of the heap buffer
- [ ] C) Clones the string slice onto the local function stack under current compiler safety rules
- [ ] D) Converts the slice into an unaligned raw byte pointer under current compiler safety rules

# Hint
&mut *b calls DerefMut::deref_mut(&mut b) under the hood.

# Explanation
`&mut *b` triggers a `DerefMut` coercion: `DerefMut::deref_mut(&mut b)`, reborrowing the heap-allocated memory as an exclusive `&mut str` without moving the `Box`.
