---
id: conc-supporter-24
categorySlug: concurrency
title: "False Sharing and Alignment"
difficulty: 3
tags: [concurrency, false-sharing, alignment]
---

# Prompt
How do concurrent programs prevent false sharing on multicore CPUs in Rust?

# Code
```rust
#[repr(align(64))]
struct CachePadded<T>(T);
```

# Options
- [x] A) By aligning variables to the CPU cache line boundary (`#[repr(align(64))]`)
- [ ] B) By disabling L1 CPU caches during compilation with compiler flags in runtime memory
- [ ] C) By wrapping all atomic variables inside standard Mutex locks in runtime memory
- [ ] D) By allocating all shared variables on distinct thread stacks in runtime memory

# Hint
False sharing occurs when independent variables share a single 64-byte cache line.

# Explanation
False sharing occurs when variables modified by different cores reside on the same cache line (typically 64 bytes), causing unnecessary cache invalidations. Using `#[repr(align(64))]` ensures each variable occupies its own cache line.
