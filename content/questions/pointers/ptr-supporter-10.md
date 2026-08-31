---
id: ptr-supporter-10
categorySlug: pointers
title: "Box::into_raw and Box::from_raw"
difficulty: 3
tags: [pointers, box, raw-pointers]
---

# Prompt
Why must `Box::from_raw(ptr)` be called on a pointer originally produced by `Box::into_raw`?

# Code
```rust
fn main() {
    let b = Box::new(42);
    let ptr = Box::into_raw(b);
    let b2 = unsafe { Box::from_raw(ptr) };
    println!("{b2}");
}
```

# Options
- [ ] A) Because `Box::from_raw` converts raw pointers into thread-safe atomics in runtime memory
- [x] B) To ensure the allocator receives the exact same layout and allocation metadata
- [ ] C) To prevent the operating system from clearing physical RAM pages in runtime memory
- [ ] D) Because raw pointers lose their data types when cast to usize within local thread memory

# Hint
Box::from_raw expects a pointer allocated by GlobalAlloc with the same type layout.

# Explanation
`Box::from_raw` assumes the pointer was allocated by the global allocator with the exact layout of `T`. Calling it on stack pointers or mismatched types causes memory corruption when `Box` drops.
