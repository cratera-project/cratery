---
id: ptr-supporter-21
categorySlug: pointers
title: "std::ptr::drop_in_place Execution"
difficulty: 3
tags: [pointers, drop-in-place, destructors]
---

# Prompt
What does `std::ptr::drop_in_place(ptr)` do to the value at `ptr`?

# Code
```rust
use std::ptr;

fn main() {
    let mut s = String::from("custom drop");
    let p: *mut String = &mut s;
    unsafe {
        ptr::drop_in_place(p);
        std::mem::forget(s); // avoid double drop
    }
}
```

# Options
- [x] A) Executes the destructor of the value in-place without freeing the memory container
- [ ] B) Deallocates the heap memory page and zeroes out all registers within local thread memory
- [ ] C) Transmutes the destination value into an uninitialized MaybeUninit within local thread memory
- [ ] D) Clones the value into the thread-local fallback storage under current compiler safety rules

# Hint
drop_in_place runs Drop on the referent without freeing the backing allocation.

# Explanation
`std::ptr::drop_in_place(ptr)` executes the destructor (`Drop::drop`) and field drop glue for the value at `ptr` in-place, without deallocating the memory holding it.
