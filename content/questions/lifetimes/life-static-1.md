---
id: life-static-1
categorySlug: lifetimes
title: "Static Lifetime"
difficulty: 2
tags: [lifetimes, static]
---

# Prompt
What is true about the `'static` lifetime?

# Code
```rust
let s: &'static str = "I live forever";
```

# Options
- [ ] A) The referenced value must live on the stack
- [ ] B) The reference is required to be mutable
- [x] C) The data stays valid for the remaining program run
- [ ] D) It may only appear inside `static` functions

# Hint
Think duration of the data, not stack vs heap.

# Explanation
As a reference lifetime, `'static` means the data lives for the remaining program run (Rust By Example). Literals are the usual case; runtime values can also be `'static` if never dropped afterward (e.g. `Box::leak`). It is not about mutability or requiring a `static fn`.
