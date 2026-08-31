---
id: macro-crate-1
categorySlug: macros
title: "The $crate Metavariable"
difficulty: 3
tags: [macros, hygiene, export]
---

# Prompt
What is `$crate` for inside an exported `macro_rules!`?

# Code
```rust
// in crate helpers
#[macro_export]
macro_rules! check {
    ($e:expr) => {
        $crate::internal::validate($e)
    };
}
```

# Options
- [ ] A) It expands to the caller crate root module path
- [ ] B) It renames the macro so callers skip importing it
- [ ] C) It forces the expansion to evaluate in const context
- [x] D) It expands to the crate that defined the macro

# Hint
Exported macros may be called from other crates that lack your module paths.

# Explanation
`$crate` resolves to the crate where the macro is defined, so exported macros can refer to that crate's items reliably even when invoked from dependents. It is not the caller's crate path.
