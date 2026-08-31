---
id: ptr-box-leak-1
categorySlug: pointers
title: "Box::leak"
difficulty: 2
tags: [pointers, box, static]
---

# Prompt
What does `Box::leak` return?

# Code
```rust
let s: &'static mut str = Box::leak(Box::from("hi"));
```

# Options
- [ ] A) An `Rc` that frees memory when the last clone drops
- [ ] B) A dangling pointer that must never be dereferenced
- [ ] C) Ownership of `T` moved back onto the stack frame
- [x] D) A `'static` reference, intentionally never freed

# Hint
Leaking is the point: the allocation outlives forever.

# Explanation
`Box::leak` consumes the `Box` and returns a `&'static mut T` (or shared) to the heap value, which will not be freed. Useful for certain global tables; misuse is just a deliberate leak.
