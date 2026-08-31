---
id: ptr-supporter-6
categorySlug: pointers
title: "std::ptr::write Semantics"
difficulty: 3
tags: [pointers, write, uninitialized]
---

# Prompt
Why does `std::ptr::write(dest, val)` not run the destructor of whatever was in `dest`?

# Code
```rust
use std::mem::MaybeUninit;

fn main() {
    let mut uninit = MaybeUninit::<String>::uninit();
    unsafe {
        std::ptr::write(uninit.as_mut_ptr(), String::from("init"));
        let s = uninit.assume_init();
        println!("{s}");
    }
}
```

# Options
- [ ] A) It converts the destination value into a static binary constant within local thread memory
- [x] B) It is designed to initialize uninitialized memory without dropping garbage bits
- [ ] C) Destructors in Rust are only executed when variables leave main within local thread memory
- [ ] D) It delegates deallocation to the kernel background worker within local thread memory

# Hint
ptr::write writes to uninitialized memory without evaluating destructors.

# Explanation
`std::ptr::write(dest, src)` overwrites memory at `dest` with `src` without reading or dropping the previous content. This is essential for initializing `MaybeUninit` memory where dropping garbage would cause UB.
