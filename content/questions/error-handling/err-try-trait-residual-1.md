---
id: err-try-trait-residual-1
categorySlug: error-handling
title: "The Try Trait and Residuals"
difficulty: 3
tags: [error-handling, try-trait, residual]
---

# Prompt
What is the purpose of `std::ops::Try` and `std::ops::FromResidual` in Rust?

# Options
- [ ] A) It converts all errors to static boxed error trait objects
- [x] B) It enables custom types to support the question mark operator
- [ ] C) It forces the compiler to catch panics at function boundary
- [ ] D) It replaces error variants with uninitialized zero buffers

# Hint
The Try trait abstracts early-return control flow for `?`.

# Explanation
`Try` and `FromResidual` parameterize the behavior of the `?` operator, enabling types like `Result`, `Option`, and `ControlFlow` to customize early returns and error conversions.
