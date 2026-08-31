---
id: ptr-null-mut-cast-1
categorySlug: pointers
title: "Null Pointer Dereference"
difficulty: 1
tags: [pointers, null, ub]
---

# Prompt
What happens when dereferencing `std::ptr::null_mut::<i32>()` inside an `unsafe` block?

# Options
- [ ] A) Dereferencing returns a default unit value safely
- [ ] B) Dereferencing executes a clean hardware interrupt
- [ ] C) Dereferencing automatically catches unwinding panic
- [x] D) Dereferencing triggers immediate undefined behavior

# Hint
Dereferencing null in unsafe Rust is undefined behavior.

# Explanation
Dereferencing a null pointer is undefined behavior (UB) in Rust, which can cause segfaults, compiler miscompilations, or crashes.
