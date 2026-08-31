---
id: ptr-supporter-31
categorySlug: pointers
title: "Unsafe Pointer Cast Rules"
difficulty: 3
tags: [pointers, casts, alignment]
---

# Prompt
Is casting a `*const u8` to `*const u64` valid before checking alignment?

# Code
```rust
fn check(ptr: *const u8) {
    let p_u64 = ptr as *const u64;
    let _ = p_u64; // casting is safe; dereferencing requires alignment
}
```

# Options
- [ ] A) No; casting between mismatched alignments causes a compiler error in runtime memory
- [ ] B) Only if both types implement the `Copy` marker trait within local thread memory
- [x] C) Yes; raw pointer casts are always valid, but dereferencing requires alignment
- [ ] D) Only inside functions marked with the `#[inline(always)]` attribute in runtime memory

# Hint
Casting pointer types with `as` is safe; dereferencing is unsafe.

# Explanation
Casting pointer types (e.g. `ptr as *const u64`) is allowed in safe code. The pointer only becomes subject to safety requirements (such as alignment and validity) when dereferenced.
