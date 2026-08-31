---
id: trait-dispatch-vtable-layout-1
categorySlug: traits
title: "Dynamic Trait Object Fat Pointer Layout"
difficulty: 2
tags: [traits, dyn, vtable, fat-pointer]
---

# Prompt
What constitutes the internal memory representation of a `&dyn Trait` fat pointer?

# Options
- [ ] A) A pointer to heap memory and an atomic reference counter
- [ ] B) A 64-bit integer hash code representing trait name token
- [ ] C) A CPU register pair allocated by operating system kernel
- [x] D) A pointer to data instance and a pointer to static vtable

# Hint
A trait object fat pointer holds two words: data pointer and vtable pointer.

# Explanation
`&dyn Trait` is a two-word fat pointer: the first word points to the concrete instance data, and the second points to the static vtable containing type size, align, drop, and method pointers.
