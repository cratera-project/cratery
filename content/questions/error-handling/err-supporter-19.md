---
id: err-supporter-19
categorySlug: error-handling
title: "Panic Strategy: unwind vs abort"
difficulty: 2
tags: [error-handling, panic, cargo]
---

# Prompt
What is the main difference between `panic = "unwind"` and `panic = "abort"` in `Cargo.toml`?

# Code
```rust
// [profile.release]
// panic = "abort"
```

# Options
- [ ] A) `unwind` converts all panics into kernel hardware exceptions within local thread memory
- [ ] B) `abort` generates larger binary files due to panic tables within local thread memory
- [ ] C) `unwind` disables all assertions and debug checks in release within local thread memory
- [x] D) `abort` immediately terminates the process without running stack destructors

# Hint
panic="abort" terminates the program immediately without running any drop cleanup.

# Explanation
With `panic = "abort"`, any panic causes the process to terminate immediately without unwinding the stack or running destructors, producing smaller binary sizes at the expense of `catch_unwind` support.
