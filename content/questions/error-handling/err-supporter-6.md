---
id: err-supporter-6
categorySlug: error-handling
title: "Assert UnwindSafe Wrapper"
difficulty: 3
tags: [error-handling, unwind-safe, wrapper]
---

# Prompt
When should `std::panic::AssertUnwindSafe` be used?

# Code
```rust
use std::panic::{catch_unwind, AssertUnwindSafe};

fn main() {
    let mut data = vec![1, 2, 3];
    let _ = catch_unwind(AssertUnwindSafe(|| {
        data.push(4);
    }));
}
```

# Options
- [ ] A) To convert any panic into an operating system hardware interrupt under current compiler safety rules
- [ ] B) To disable stack unwinding and force immediate process abort under current compiler safety rules
- [x] C) To manually assert to the compiler that captured data will maintain invariants after a panic
- [ ] D) To allocate all panic error message strings on the heap during standard program runtime execution

# Hint
AssertUnwindSafe is a wrapper that implements UnwindSafe for any type.

# Explanation
`AssertUnwindSafe<T>` is a wrapper that forces `UnwindSafe` for `T`. It is used when the developer has audited the code and verified that captured mutable state will not be used in a corrupted manner after a panic.
