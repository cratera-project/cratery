---
id: life-for-lifetime-fn-ptr-subtyping-1
categorySlug: lifetimes
title: "HRTB Function Pointer Subtyping"
difficulty: 3
tags: [lifetimes, hrtb, subtyping]
---

# Prompt
What is the subtyping relationship between `for<'a> fn(&'a T)` and `fn(&'b T)` for a fixed lifetime `'b`?

# Options
- [ ] A) A pointer accepting short lifetimes subtypes longer lifetimes
- [ ] B) Function pointer subtyping is disabled unless using nightly
- [x] C) for<'a> fn(&'a T) is a subtype of fn(&'b T) for any fixed 'b
- [ ] D) Lifetime bounds in function pointers are erased in bytecode

# Hint
A function that can accept any lifetime is more general than one requiring a specific lifetime.

# Explanation
`for<'a> fn(&'a T)` is a subtype of `fn(&'b T)`: a function capable of handling references of *any* lifetime can safely be passed wherever a specific lifetime `'b` is expected.
