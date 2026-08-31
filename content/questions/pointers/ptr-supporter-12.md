---
id: ptr-supporter-12
categorySlug: pointers
title: "std::ptr::copy vs copy_nonoverlapping"
difficulty: 3
tags: [pointers, copy, memmove]
---

# Prompt
What is the difference between `std::ptr::copy` and `std::ptr::copy_nonoverlapping`?

# Code
```rust
use std::ptr;

fn main() {
    let mut arr = [1, 2, 3, 4, 5];
    unsafe {
        ptr::copy(arr.as_ptr(), arr.as_mut_ptr().add(1), 4);
    }
    println!("{arr:?}");
}
```

# Options
- [ ] A) `copy_nonoverlapping` uses multi-threaded CPU SIMD instructions in runtime memory
- [ ] B) `copy` drops the original values at the destination location in runtime memory
- [ ] C) `copy_nonoverlapping` is safe to call outside of unsafe blocks in runtime memory
- [x] D) `copy` allows overlapping source and destination buffers (like C memmove)

# Hint
copy handles overlapping memory (memmove); copy_nonoverlapping requires disjoint memory (memcpy).

# Explanation
`std::ptr::copy` is equivalent to C `memmove` (handles overlapping memory regions correctly). `copy_nonoverlapping` is equivalent to `memcpy` and requires source and destination to be non-overlapping for performance.
