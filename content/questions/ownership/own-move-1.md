---
id: own-move-1
categorySlug: ownership
title: "Value Movement"
difficulty: 1
tags: [ownership, move]
---

# Prompt
Why does the following code fail to compile?

# Code
```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}, world!", s1);
}
```

# Options
- [ ] A) `String` values are always immutable by default
- [x] B) Ownership moved from `s1` into `s2` on assign
- [ ] C) Variables cannot be reassigned in the same scope
- [ ] D) `println!` requires a mutable reference argument

# Hint
Ask whether `String` is `Copy` after the assignment.

# Explanation
Assigning a non-`Copy` value like `String` moves ownership. After `let s2 = s1`, `s1` is invalid, so using it in `println!` is a use-after-move error. This prevents a double free when both bindings would otherwise drop the same heap buffer.
