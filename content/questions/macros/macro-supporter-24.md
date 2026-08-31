---
id: macro-supporter-24
categorySlug: macros
title: "Macro Scoping within Modules"
difficulty: 3
tags: [macros, scoping, textual-scope]
---

# Prompt
How does macro availability differ between `macro_rules!` without `#[macro_export]` and standard items?

# Code
```rust
// call_me!(); // Error if defined below
macro_rules! call_me { () => {}; }
// call_me!(); // OK here
```

# Options
- [ ] A) Macros are always visible anywhere within the same crate regardless of location in code
- [ ] B) Macros must be imported with `use super::*` in all child submodules within local thread memory
- [x] C) Unexported `macro_rules!` are only visible textually *after* their definition point
- [ ] D) Macros are only visible inside the exact function where declared within local thread memory

# Hint
Declarative macros follow textual order and are not visible before they are defined.

# Explanation
Unlike functions and structs (which are available throughout their module regardless of declaration order), unexported `macro_rules!` follow strict textual scoping and are only available after their point of declaration in source order.
