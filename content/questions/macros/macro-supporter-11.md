---
id: macro-supporter-11
categorySlug: macros
title: "Macro Expansion Recursion Limit"
difficulty: 2
tags: [macros, recursion-limit, compiler]
---

# Prompt
How can you increase the maximum recursion depth for deeply recursive macros?

# Code
```rust
#![recursion_limit = "256"]
```

# Options
- [ ] A) By passing `--max-depth 256` to the cargo build command line in code
- [x] B) By adding `#![recursion_limit = "256"]` at the crate root level
- [ ] C) By annotating each recursive macro with `#[inline(deep)]` in code
- [ ] D) By allocating recursive token buffers on the global heap in runtime memory

# Hint
#![recursion_limit = "..."] sets the maximum macro expansion depth for the crate.

# Explanation
The inner attribute `#![recursion_limit = "N"]` at the root of a crate adjusts the maximum recursion depth for macro expansions, auto trait checks, and const evaluation.
