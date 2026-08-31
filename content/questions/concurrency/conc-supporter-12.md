---
id: conc-supporter-12
categorySlug: concurrency
title: "Sync Trait Definition"
difficulty: 3
tags: [concurrency, sync, send]
---

# Prompt
What is the formal definition of `Sync` in terms of `Send`?

# Code
```rust
// pub unsafe trait Sync {}
```

# Options
- [x] A) `T: Sync` if and only if `&T: Send`
- [ ] B) `T: Sync` if and only if `T: Copy + Send`
- [ ] C) `T: Sync` if and only if `&mut T: Send`
- [ ] D) `T: Sync` if and only if `T: 'static`

# Hint
A type T is Sync if it is safe to share references &T across threads (i.e. &T is Send).

# Explanation
In Rust, `T: Sync` is defined as: `&T: Send`. In other words, a type `T` is `Sync` if and only if a shared reference `&T` can safely be sent across thread boundaries.
