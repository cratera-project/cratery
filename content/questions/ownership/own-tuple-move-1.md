---
id: own-tuple-move-1
categorySlug: ownership
title: "Tuple Ownership"
difficulty: 2
tags: [ownership, move, tuple]
---

# Prompt
What is the ownership behavior in this code?

# Code
```rust
fn main() {
    let s = String::from("hello");
    let x = 5;
    let t = (s, x);

    println!("{}", t.1);
    // println!("{}", s);
}
```

# Options
- [ ] A) Tuples always clone every contained value
- [x] B) `s` moves into `t`; `x` is copied in
- [ ] C) Both `s` and `x` remain valid afterward
- [ ] D) The tuple only stores shared references

# Hint
Each field follows its own move/`Copy` rules.

# Explanation
Building `(s, x)` moves the non-`Copy` `String` and copies the `i32`. `s` is invalidated; `x` remains valid. `t.1` reads the copied integer inside the tuple.
