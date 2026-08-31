---
id: macro-export-1
categorySlug: macros
title: "Macro Visibility"
difficulty: 2
tags: [macros, visibility]
---

# Prompt
How do you make a `macro_rules!` macro usable from other crates?

# Code
```rust
#[macro_export]
macro_rules! my_assert {
    ($cond:expr) => {
        if !$cond {
            panic!("assertion failed");
        }
    };
}
```

# Options
- [ ] A) Mark it `pub` like a function; export is automatic
- [x] B) Apply `#[macro_export]` so it is crate-root exported
- [ ] C) Put it in `main.rs` only; macros never cross crates
- [ ] D) Wrap it in `pub mod macros` without other attributes

# Hint
Macro visibility is not the same as item `pub` alone.

# Explanation
`#[macro_export]` places the macro at the crate root and makes it available to dependents (`use your_crate::my_assert;`). Ordinary `pub` on modules is not enough for classic `macro_rules!` export across crates.
