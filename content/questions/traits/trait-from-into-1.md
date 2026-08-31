---
id: trait-from-into-1
categorySlug: traits
title: "From and Into"
difficulty: 2
tags: [traits, from, into]
---

# Prompt
Why does implementing `From<A> for B` give you `Into`?

# Code
```rust
struct Id(u32);

impl From<u32> for Id {
    fn from(v: u32) -> Self {
        Id(v)
    }
}

fn main() {
    let id: Id = 7u32.into();
}
```

# Options
- [ ] A) `into` is a keyword that ignores trait impls entirely
- [x] B) A blanket `Into` impl is provided for all `From` impls
- [ ] C) `From` and `Into` are identical traits with two names
- [ ] D) Only `u32` gets `Into` automatically; others need both

# Hint
Prefer implementing `From`; callers can still use `.into()`.

# Explanation
The standard library provides `impl<T, U: From<T>> Into<U> for T`. Implement `From`, and `.into()` becomes available. Implementing both manually is unnecessary and can conflict.
