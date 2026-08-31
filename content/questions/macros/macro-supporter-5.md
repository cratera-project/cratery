---
id: macro-supporter-5
categorySlug: macros
title: "Procedural Macro Types"
difficulty: 2
tags: [macros, proc-macro, categories]
---

# Prompt
What are the three distinct categories of procedural macros in Rust?

# Code
```rust
// Custom Derive, Attribute-like, and Function-like proc macros
```

# Options
- [ ] A) Inline macros, Template macros, and Expression replacement macros in code
- [ ] B) Declarative macros, Hygiene macros, and Runtime reflection macros in code
- [ ] C) Static macros, Dynamic macros, and Const generic evaluation macros in code
- [x] D) Custom Derive macros, Attribute-like macros, and Function-like macros

# Hint
Derive (#[derive]), Attribute (#[my_attr]), and Function-like (my_macro!()) are the three proc macro types.

# Explanation
Rust supports three kinds of procedural macros: 1) Custom Derive (`#[proc_macro_derive]`), 2) Attribute-like (`#[proc_macro_attribute]`), and 3) Function-like (`#[proc_macro]`).
