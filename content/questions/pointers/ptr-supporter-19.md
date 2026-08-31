---
id: ptr-supporter-19
categorySlug: pointers
title: "Raw Pointer Null Check"
difficulty: 1
tags: [pointers, raw-pointers, null]
---

# Prompt
Which method safely checks if a raw pointer `*const T` is null?

# Code
```rust
fn check(ptr: *const i32) {
    if ptr.is_null() {
        println!("null pointer");
    }
}
```

# Options
- [ ] A) `ptr == 0` in code
- [ ] B) `ptr.is_none()`
- [x] C) `ptr.is_null()`
- [ ] D) `ptr.is_empty()`

# Hint
Raw pointers provide the is_null() method in safe Rust.

# Explanation
`ptr.is_null()` is a safe method on raw pointers (`*const T` and `*mut T`) that returns `true` if the pointer points to address zero.
