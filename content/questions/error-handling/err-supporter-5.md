---
id: err-supporter-5
categorySlug: error-handling
title: "std::panic::catch_unwind Exception Safety"
difficulty: 3
tags: [error-handling, panic, unwind-safe]
---

# Prompt
What trait bound is required on the closure passed to `std::panic::catch_unwind`?

# Code
```rust
use std::panic;

fn main() {
    let result = panic::catch_unwind(|| {
        println!("running safe block");
    });
    assert!(result.is_ok());
}
```

# Options
- [ ] A) `std::marker::Send` to ensure the panic runs in a separate thread in runtime memory
- [x] B) `std::panic::UnwindSafe` to prevent observing broken invariants across panics
- [ ] C) `std::marker::Copy` so captured variables can be duplicated within local thread memory
- [ ] D) `std::error::Error` allowing the panic to return a Result within local thread memory

# Hint
UnwindSafe prevents capturing types with interior mutability that might be left in broken states.

# Explanation
`panic::catch_unwind` requires the closure to implement `UnwindSafe`. This marker trait prevents types with interior mutability (like `&mut RefCell`) from being observed in a potentially corrupted state after a panic.
