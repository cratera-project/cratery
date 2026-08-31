---
id: ptr-supporter-4
categorySlug: pointers
title: "NonNull vs Raw Pointer"
difficulty: 2
tags: [pointers, non-null, niche-optimization]
---

# Prompt
What guarantee does `std::ptr::NonNull<T>` provide over a raw `*mut T`?

# Code
```rust
use std::ptr::NonNull;

fn main() {
    let mut x = 10;
    let ptr = NonNull::new(&mut x).unwrap();
    assert_eq!(std::mem::size_of::<Option<NonNull<i32>>>(), std::mem::size_of::<*mut i32>());
    println!("{}", unsafe { *ptr.as_ptr() });
}
```

# Options
- [ ] A) Guaranteed valid memory alignment and lifetime safety by the compiler within local thread memory
- [ ] B) Thread-safe atomic read and write access across all cores under current compiler safety rules
- [ ] C) Automatic memory deallocation when the NonNull wrapper drops within local thread memory
- [x] D) Guaranteed non-null, enabling null-pointer niche optimization in `Option<NonNull<T>>`

# Hint
NonNull is guaranteed to never be null, so Option<NonNull<T>> has the same size as *mut T.

# Explanation
`NonNull<T>` is guaranteed to be non-null and covariant over `T`. This invariant enables the compiler to use `0` as the `None` representation for `Option<NonNull<T>>` (niche optimization).
