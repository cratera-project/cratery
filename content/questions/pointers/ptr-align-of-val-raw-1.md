---
id: ptr-align-of-val-raw-1
categorySlug: pointers
title: "Raw Pointer Alignment Query"
difficulty: 2
tags: [pointers, alignment, raw]
---

# Prompt
What safety advantage does `std::mem::align_of_val_raw` offer over `align_of_val`?

# Options
- [x] A) It inspects memory alignment without creating a reference
- [ ] B) It dereferences the target memory to read runtime header
- [ ] C) It adjusts pointer alignment by rounding down to zero byte
- [ ] D) It enforces runtime alignment assertions inside debug mode

# Hint
align_of_val_raw operates directly on *const T without requiring a valid reference.

# Explanation
`align_of_val_raw` computes type alignment from a raw pointer without requiring a valid reference, making it sound even for uninitialized or unaligned memory.
