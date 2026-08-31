---
id: ptr-supporter-24
categorySlug: pointers
title: "Raw Pointer Alignment Requirements"
difficulty: 3
tags: [pointers, alignment, undefined-behavior]
---

# Prompt
What happens when dereferencing an unaligned raw pointer with `*ptr`?

# Code
```rust
// let unaligned: *const u32 = ...;
// let val = unsafe { *unaligned }; // Undefined Behavior if not 4-byte aligned
```

# Options
- [ ] A) The CPU automatically fixes alignment with a trap handler in runtime memory
- [ ] B) The compiler inserts bit-shift operations transparently in runtime memory
- [ ] C) The operation returns Ok(0) if alignment fails during runtime execution
- [x] D) Immediate Undefined Behavior; use `std::ptr::read_unaligned` instead

# Hint
Directly dereferencing an unaligned pointer violates Rust's safety invariants.

# Explanation
In Rust, all reference and standard raw pointer dereferences (`*ptr`) require the pointer to be properly aligned for `T`. To read unaligned memory safely, you must use `std::ptr::read_unaligned`.
