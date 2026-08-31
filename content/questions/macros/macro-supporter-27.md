---
id: macro-supporter-27
categorySlug: macros
title: "Derive Macro Helper Attributes"
difficulty: 3
tags: [macros, proc-macro, helper-attributes]
---

# Prompt
What are "helper attributes" in custom derive procedural macros?

# Code
```rust
// #[proc_macro_derive(MyDerive, attributes(my_helper))]
```

# Options
- [ ] A) Attributes that run additional background thread compilation jobs within local thread memory
- [x] B) Inert attributes that the derive macro can inspect on fields without compiler errors
- [ ] C) Helper functions exported into the C dynamic library table under current compiler safety rules
- [ ] D) Attributes that disable borrow checking on specific struct fields within local thread memory

# Hint
Helper attributes are registered inert attributes used for per-field configuration.

# Explanation
When declaring `#[proc_macro_derive(Trait, attributes(helper))]`, `helper` is registered as an inert attribute. The compiler permits `#[helper(...)]` on struct fields for the derive macro to read without raising "unknown attribute" errors.
