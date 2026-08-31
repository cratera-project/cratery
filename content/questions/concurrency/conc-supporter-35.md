---
id: conc-supporter-35
categorySlug: concurrency
title: "Sync Trait on Raw Pointers"
difficulty: 2
tags: [concurrency, raw-pointers, safety]
---

# Prompt
Why do `*const T` and `*mut T` not implement `Send` or `Sync`?

# Code
```rust
fn check_sync<T: Sync>() {}

// check_sync::<*const i32>(); // Error: *const i32 is not Sync
```

# Options
- [ ] A) Raw pointers cannot be formatted with Debug or Display traits in runtime memory
- [ ] B) 64-bit pointers cannot fit inside CPU registers across threads in runtime memory
- [ ] C) Raw pointers are automatically freed when crossing thread borders in runtime memory
- [x] D) Raw pointers lack compiler lifetime and aliasing guarantees across threads

# Hint
Raw pointers have no aliasing or lifetime checks, so sending or sharing them is inherently unsafe.

# Explanation
Because raw pointers bypass Rust's borrow checker (allowing unconstrained aliasing, mutation, and nullability), the compiler cannot verify thread-safety invariants. Developers must manually use `unsafe impl Send` / `Sync` after verifying safety.
