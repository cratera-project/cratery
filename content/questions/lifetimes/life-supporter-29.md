---
id: life-supporter-29
categorySlug: lifetimes
title: "Invariance of UnsafeCell<T>"
difficulty: 3
tags: [lifetimes, unsafe-cell, invariance]
---

# Prompt
Why is UnsafeCell<T> invariant with respect to T?

# Code
```rust
use std::cell::UnsafeCell;

struct MyCell<T>(UnsafeCell<T>);
```

# Options
- [ ] A) It forces data to be synchronized across multi-core processors in code
- [ ] B) It prevents pointers from being dereferenced inside unsafe blocks in code
- [ ] C) It disables compiler optimizations in release compilation mode in code
- [x] D) It permits interior mutability, which requires invariance for safety

# Hint
Interior mutability allows writing through shared references, which requires invariance.

# Explanation
UnsafeCell<T> is the core primitive for interior mutability. Because it allows mutation through a shared reference (&UnsafeCell<T>), allowing covariance over T would reintroduce the ability to overwrite longer lifetimes with shorter ones.
