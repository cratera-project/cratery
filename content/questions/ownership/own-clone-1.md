---
id: own-clone-1
categorySlug: ownership
title: "Clone vs Copy"
difficulty: 2
tags: [ownership, clone, copy]
---

# Prompt
What is the key difference shown here?

# Code
```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();

    let x1 = 5;
    let x2 = x1;

    println!("{} {} {} {}", s1, s2, x1, x2);
}
```

# Options
- [ ] A) `Copy` types are always faster than `Clone`
- [x] B) `clone()` is explicit; `Copy` happens on assign
- [ ] C) `Clone` makes references; `Copy` duplicates bytes
- [ ] D) `Copy` only applies to values under 64 bytes

# Hint
One trait is opt-in via a method call.

# Explanation
`Clone` requires an explicit `.clone()` call (and may allocate). `Copy` is implicit on assignment for types that implement it. There is no size cutoff in the language; `Copy` means bitwise copy is always valid and cheap enough to be implicit.
