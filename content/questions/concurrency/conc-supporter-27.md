---
id: conc-supporter-27
categorySlug: concurrency
title: "AtomicI64 vs AtomicIsize Portability"
difficulty: 3
tags: [concurrency, atomics, portability]
---

# Prompt
Why might `AtomicI64` be unavailable on certain 32-bit embedded targets?

# Code
```rust
use std::sync::atomic::AtomicI64;

fn main() {
    let _ = AtomicI64::new(0);
}
```

# Options
- [ ] A) Rust 2024 deprecated 64-bit integer atomics across all platforms in runtime memory
- [ ] B) 32-bit platforms forbid all atomic operations by specification in runtime memory
- [ ] C) Embedded targets require floating point coprocessors for atomics in runtime memory
- [x] D) The target CPU architecture lacks 64-bit atomic load/store instructions

# Hint
Lock-free atomics require hardware CPU support for the corresponding word size.

# Explanation
Some 32-bit processors do not support hardware 64-bit atomic instructions. On such architectures, `AtomicI64` is omitted or requires library emulation, while `AtomicIsize` is guaranteed to match the pointer width.
