---
id: ptr-read-unaligned-soundness-1
categorySlug: pointers
title: "Unaligned Memory Reading"
difficulty: 2
tags: [pointers, unaligned, safety]
---

# Prompt
How does `std::ptr::read_unaligned` safely read a value of type `T`?

# Options
- [ ] A) It asserts that the pointer address is a power-of-two number
- [ ] B) It allocates a 64-byte aligned stack frame to copy bytes
- [ ] C) It converts unaligned pointers into heap-allocated boxes
- [x] D) It reads values from memory without requiring type alignment

# Hint
read_unaligned copies bytes directly without enforcing T's alignment requirements.

# Explanation
`read_unaligned` reads a value `T` from memory without requiring the pointer to be aligned to `align_of::<T>()`, preventing hardware alignment faults.
