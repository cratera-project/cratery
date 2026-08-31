---
id: life-static-promoted-1
categorySlug: lifetimes
title: "Static Promotion"
difficulty: 2
tags: [lifetimes, static, const]
---

# Prompt
Why can a const reference get a `'static` lifetime?

# Code
```rust
fn main() {
    let x: &'static i32 = &10;
    println!("{x}");
}
```

# Options
- [ ] A) Integer literals are stored on the caller’s stack frame
- [x] B) The compiler promotes the value to a `'static` slot
- [ ] C) All shared references are implicitly `'static` forever
- [ ] D) `println!` extends temporary borrows to `'static`

# Hint
Const/promotable values can outlive the statement.

# Explanation
When a value expression is eligible, constant promotion places it in a `'static` slot (Reference, Destructors). That is why `&10` can be a `&'static i32`. Arbitrary locals are not promoted.
