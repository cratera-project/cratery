---
id: own-into-raw-leak-1
categorySlug: ownership
title: "Box into_raw Ownership Transfer"
difficulty: 2
tags: [ownership, box, raw-pointers]
---

# Prompt
What happens to ownership when calling `Box::into_raw(b)`?

# Options
- [ ] A) The allocation is deallocated immediately on return
- [x] B) Ownership is transferred to the returned raw pointer
- [ ] C) The pointer is wrapped in an atomic reference count
- [ ] D) The compiler emits a dynamic stack memory warning

# Hint
into_raw consumes the Box without dropping the allocated heap memory.

# Explanation
`Box::into_raw` consumes the `Box` and returns a raw pointer `*mut T`. The destructor is not run, transferring memory cleanup responsibility to the caller.
