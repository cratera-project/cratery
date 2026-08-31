---
id: ptr-into-raw-1
categorySlug: pointers
title: "Box::into_raw"
difficulty: 2
tags: [pointers, box, ffi]
---

# Prompt
What does `Box::into_raw` require of the caller?

# Code
```rust
fn main() {
    let p = Box::into_raw(Box::new(1i32));
    unsafe {
        drop(Box::from_raw(p));
    }
}
```

# Options
- [ ] A) Nothing; dropping the old `Box` still frees it
- [ ] B) Pass the pointer to `mem::forget` before use
- [x] C) Reclaim with `from_raw` (or otherwise free it)
- [ ] D) Convert it to `&'static T` before any deref

# Hint
The `Box` is consumed; its destructor will not run.

# Explanation
`Box::into_raw` consumes the `Box` and returns `*mut T` without running the destructor. The caller owns the allocation and should later `Box::from_raw` (typical FFI round-trip) or free it with the matching layout. `Box::leak` instead yields a `'static` reference meant to last for the rest of the program.
