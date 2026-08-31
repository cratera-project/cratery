---
id: ptr-addr-of-mut-uninit-1
categorySlug: pointers
title: "Safe Raw Pointer Creation"
difficulty: 3
tags: [pointers, raw-pointers, addr-of]
---

# Prompt
Why is `std::ptr::addr_of_mut!` preferred over `&mut place as *mut _` for uninitialized data?

# Options
- [ ] A) It asserts the referenced data is initialized on stack
- [x] B) It creates a raw pointer without producing invalid &mut
- [ ] C) It allocates memory dynamically using system allocator
- [ ] D) It casts uninitialized integers into valid zero bytes

# Hint
Creating an intermediate &mut to uninitialized memory is instant UB.

# Explanation
`addr_of_mut!` directly computes the raw pointer to a memory location without creating an intermediate `&mut T` reference, which requires validity.
