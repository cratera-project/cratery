---
id: ptr-supporter-32
categorySlug: pointers
title: "std::ptr::slice_from_raw_parts"
difficulty: 2
tags: [pointers, raw-slices, syntax]
---

# Prompt
What does `std::ptr::slice_from_raw_parts(data, len)` construct?

# Code
```rust
use std::ptr;

fn main() {
    let arr = [1, 2, 3];
    let p: *const [i32] = ptr::slice_from_raw_parts(arr.as_ptr(), 3);
    assert_eq!(unsafe { &*p }, &[1, 2, 3]);
}
```

# Options
- [ ] A) A safe borrowed slice `&[T]` with lifetime tied to `data` in code
- [ ] B) An owned `Vec<T>` cloned from the raw buffer elements in runtime memory
- [ ] C) A heap-allocated `Box<[T]>` managing the pointer memory in code
- [x] D) A raw slice pointer `*const [T]` without creating a reference

# Hint
slice_from_raw_parts returns a raw slice pointer *const [T], not a reference.

# Explanation
`std::ptr::slice_from_raw_parts` builds a raw slice pointer (`*const [T]`). Unlike `std::slice::from_raw_parts` (which returns a reference `&[T]`), creating the raw pointer is safe and does not assert reference validity.
