---
id: macro-supporter-8
categorySlug: macros
title: "$crate Special Metavariable"
difficulty: 3
tags: [macros, crate-variable, hygiene]
---

# Prompt
Why should exported declarative macros use `$crate::...` when referencing crate items?

# Code
```rust
#[macro_export]
macro_rules! call_internal {
    () => {
        $crate::internal_helper();
    };
}
```

# Options
- [ ] A) To prevent cargo from compiling unused items in release builds within local thread memory
- [ ] B) To convert function calls into inlined constant assembly instructions in runtime memory
- [x] C) To correctly resolve items from the defining crate when called in external crates
- [ ] D) To verify that the calling module has identical Rust edition settings in runtime memory

# Hint
$crate expands to the name of the crate where the macro was defined.

# Explanation
`$crate` expands to the path of the defining crate (e.g. `crate` when used internally or `::my_crate` when used downstream), ensuring paths resolve correctly regardless of the caller's scope.
