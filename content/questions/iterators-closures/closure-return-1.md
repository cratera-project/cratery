---
id: closure-return-1
categorySlug: iterators-closures
title: "Returning Closures"
difficulty: 3
tags: [closures, return-types]
---

# Prompt
Why return `Box<dyn Fn(i32) -> i32>` here?

# Code
```rust
fn make_op(add: bool) -> Box<dyn Fn(i32) -> i32> {
    if add {
        Box::new(|x| x + 1)
    } else {
        Box::new(|x| x - 1)
    }
}
```

# Options
- [ ] A) Every closure is unsized and must live on the heap
- [ ] B) `impl Fn` already unifies both branches without boxing
- [ ] C) Modern Rust removed `impl Trait` in return types
- [x] D) The branches are different closure types at compile time

# Hint
Each closure expression has its own unique anonymous type.

# Explanation
`impl Fn` works for one concrete closure type. Here the `if` arms produce two distinct types, so they cannot unify. `Box<dyn Fn...>` erases them behind one trait object. A single-branch function can return `impl Fn` without boxing.
