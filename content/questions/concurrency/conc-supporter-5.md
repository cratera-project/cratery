---
id: conc-supporter-5
categorySlug: concurrency
title: "OnceLock vs LazyLock Initialization"
difficulty: 2
tags: [concurrency, lazylock, oncelock]
---

# Prompt
What is the main semantic difference between `std::sync::LazyLock` and `OnceLock`?

# Code
```rust
use std::sync::LazyLock;

static CONFIG: LazyLock<String> = LazyLock::new(|| {
    String::from("initialized")
});

fn main() {
    println!("{}", *CONFIG);
}
```

# Options
- [ ] A) `OnceLock` can be written to multiple times across different threads in code
- [x] B) `LazyLock` takes an init closure and auto-evaluates on first dereference
- [ ] C) `LazyLock` requires unsafe code to read the underlying stored value in code
- [ ] D) `OnceLock` is non-thread-safe and intended only for single-thread apps in code

# Hint
LazyLock wraps a closure and initializes automatically upon Deref.

# Explanation
`LazyLock` takes an initialization closure at declaration and computes the value upon first dereference (`Deref`). `OnceLock` is manually written to with `get_or_init` or `set`.
