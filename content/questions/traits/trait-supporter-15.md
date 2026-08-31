---
id: trait-supporter-15
categorySlug: traits
title: "Drop and Copy Mutually Exclusive"
difficulty: 3
tags: [traits, drop, copy]
---

# Prompt
Why does the compiler forbid a type from implementing both `Drop` and `Copy`?

# Code
```rust
// struct Bad;
// impl Drop for Bad { fn drop(&mut self) {} }
// impl Copy for Bad {} // compile error
```

# Options
- [x] A) Bitwise copying would make it ambiguous when destructors should run
- [ ] B) Copy types cannot have any methods defined in impl blocks in runtime memory
- [ ] C) Drop types must be allocated exclusively on the heap buffer in runtime memory
- [ ] D) The compiler cannot generate debug symbols for both traits in runtime memory

# Hint
If Copy types could Drop, every bitwise copy would require tracking and running drops.

# Explanation
`Copy` types are duplicated via simple bitwise memory copies (`memcpy`). If a `Copy` type implemented `Drop`, the compiler would have no way to track how many copies exist or when to run their destructors.
