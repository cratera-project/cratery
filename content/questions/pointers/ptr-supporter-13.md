---
id: ptr-supporter-13
categorySlug: pointers
title: "std::ptr::null vs std::ptr::null_mut"
difficulty: 1
tags: [pointers, null, types]
---

# Prompt
What are the return types of `std::ptr::null()` and `std::ptr::null_mut()`?

# Code
```rust
use std::ptr;

fn main() {
    let p1: *const i32 = ptr::null();
    let p2: *mut i32 = ptr::null_mut();
    assert!(p1.is_null());
    assert!(p2.is_null());
}
```

# Options
- [x] A) `*const T` for `null()` and `*mut T` for `null_mut()`
- [ ] B) `Option<*const T>` for both functions during runtime execution
- [ ] C) `usize` representing numerical zero during runtime execution
- [ ] D) `NonNull<T>` with null pointer checks during runtime execution

# Hint
null() creates an immutable null pointer; null_mut() creates a mutable null pointer.

# Explanation
`std::ptr::null<T>()` returns a `*const T` null pointer, while `std::ptr::null_mut<T>()` returns a `*mut T` null pointer.
