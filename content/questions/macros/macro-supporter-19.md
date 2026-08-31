---
id: macro-supporter-19
categorySlug: macros
title: "Proc Macro Crate Type"
difficulty: 2
tags: [macros, cargo, proc-macro]
---

# Prompt
What crate type declaration must be set in `Cargo.toml` to build a procedural macro library?

# Code
```rust
// [lib]
// proc-macro = true
```

# Options
- [ ] A) `[lib] crate-type = ["dylib"]`
- [x] B) `[lib] proc-macro = true`
- [ ] C) `[package] macro-plugin = true`
- [ ] D) `[build] proc-macro = "enabled"`

# Hint
proc-macro = true in [lib] declares a procedural macro crate.

# Explanation
To define procedural macros, the crate's `Cargo.toml` must declare `[lib] proc-macro = true`. This compiles the crate as a dynamic library loaded by the compiler during compilation of dependent crates.
