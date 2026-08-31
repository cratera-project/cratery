---
id: macro-supporter-29
categorySlug: macros
title: "Quote Crate Role in Proc Macros"
difficulty: 2
tags: [macros, quote, proc-macro]
---

# Prompt
What does the `quote!` macro from the `quote` crate do in procedural macros?

# Code
```rust
// quote! { fn #name() -> i32 { 42 } }
```

# Options
- [ ] A) Quotes string literals to prevent shell injection vulnerabilities under current compiler safety rules
- [ ] B) Parses raw token streams into Abstract Syntax Tree structs during standard program runtime execution
- [ ] C) Executes unit tests inside procedural macro test runners during standard program runtime execution
- [x] D) Provides a templating quasiquoter to construct Rust `TokenStream`s with variable interpolation

# Hint
quote! converts Rust code fragments into TokenStream instances with #variable interpolation.

# Explanation
The `quote!` macro turns Rust syntax into a `proc_macro2::TokenStream`, allowing clean variable interpolation (`#variable`, `#(#items)*`) instead of manual token construction.
