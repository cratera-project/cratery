---
id: ptr-supporter-5
categorySlug: pointers
title: "std::ptr::read vs Dereferencing"
difficulty: 3
tags: [pointers, read, ownership]
---

# Prompt
When is `std::ptr::read(ptr)` used instead of `*ptr`?

# Code
```rust
fn main() {
    let x = String::from("data");
    let ptr = &x as *const String;
    let copy = unsafe { std::ptr::read(ptr) };
    std::mem::forget(x); // prevent double drop
    println!("{copy}");
}
```

# Options
- [x] A) To read and move an owned value out of raw memory without dropping the source
- [ ] B) To clone a value across thread boundaries with atomic barriers in runtime memory
- [ ] C) To convert an unaligned pointer into an aligned reference within local thread memory
- [ ] D) To bypass the operating system virtual memory page tables within local thread memory

# Hint
ptr::read moves the value out by copying memory bits without running Drop on the source.

# Explanation
`std::ptr::read(src)` creates an owned `T` by bitwise copying from the raw pointer `src` without running any destructor on `src`. The caller must ensure `src` is not double-dropped.
