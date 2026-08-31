---
id: macro-vec-macro-1
categorySlug: macros
title: "Why vec! Is a Macro"
difficulty: 2
tags: [macros, stdlib]
---

# Prompt
Why is `vec![a, b, c]` a macro rather than a function?

# Code
```rust
let v = vec![1, 2, 3];
```

# Options
- [ ] A) Functions cannot construct `Vec` values on stable
- [x] B) Macros can accept a variable number of arguments
- [ ] C) `vec!` must run at runtime before `main` starts
- [ ] D) Only macros can allocate memory on the heap

# Hint
Think arity: functions have fixed parameters.

# Explanation
`vec!` supports zero or more elements (and `[elem; n]`). Rust functions cannot be variadic like that in the same syntactic way, so a macro expands into the right `Vec` construction code.
