---
id: trait-unsize-coercion-slice-1
categorySlug: traits
title: "Unsize Coercion for Fixed Arrays"
difficulty: 2
tags: [traits, unsize, coercion]
---

# Prompt
How does the compiler perform Unsize coercion from `&[T; N]` to `&[T]`?

# Options
- [ ] A) It dynamically reallocates the array on the system heap
- [ ] B) It clones each element into an intermediate vector struct
- [x] C) It adjusts pointer metadata to convert [T; N] into &[T]
- [ ] D) It converts the array into a raw null-terminated pointer

# Hint
Unsize coercion attaches length metadata to the thin array pointer to create a fat slice pointer.

# Explanation
Unsize coercion converts a thin reference to a sized array `&[T; N]` into a fat slice reference `&[T]` by attaching the length `N` into pointer metadata with zero runtime cost.
