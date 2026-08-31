---
id: life-supporter-7
categorySlug: lifetimes
title: "Multiple Lifetime Parameters on Struct"
difficulty: 2
tags: [lifetimes, structs, parameters]
---

# Prompt
Why might a struct need two distinct lifetime parameters struct Pair<'a, 'b>?

# Code
```rust
struct Pair<'a, 'b> {
    first: &'a str,
    second: &'b str,
}
```

# Options
- [ ] A) To ensure that both fields are dropped simultaneously at runtime in code
- [x] B) To allow the two fields to borrow from different independent scopes
- [ ] C) To enable automatic dereferencing between the two string slices in code
- [ ] D) To satisfy trait object safety constraints required by the compiler

# Hint
A single lifetime parameter forces both references to share the same (shorter) lifetime.

# Explanation
Using distinct lifetime parameters ('a and 'b) allows first and second to borrow from independent scopes with different durations, avoiding artificially shrinking the longer borrow to the shorter one.
