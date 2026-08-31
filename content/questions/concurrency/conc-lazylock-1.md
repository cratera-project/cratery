---
id: conc-lazylock-1
categorySlug: concurrency
title: "LazyLock Initialization"
difficulty: 2
tags: [concurrency, lazylock]
---

# Prompt
When does the `LazyLock` closure run?

# Code
```rust
use std::sync::LazyLock;
static N: LazyLock<i32> = LazyLock::new(|| 1 + 1);

fn main() {
    assert_eq!(*N, 2);
    assert_eq!(*N, 2);
}
```

# Options
- [ ] A) At program start, before `main`, on every OS
- [ ] B) Each time `*N` is evaluated, including later
- [ ] C) Only after an explicit `N.init()` call first
- [x] D) Once on first deref; later reads reuse it

# Hint
`LazyLock` looks like `&T` because deref initializes.

# Explanation
`LazyLock` (stable since 1.80) runs its closure once on first deref or `force()`, even if several threads race; others wait. Later accesses reuse the stored value. Unlike `OnceLock`, the initializer is fixed at `new` and you do not pass extra arguments later. A panic in the closure poisons the lock unrecoverably.
