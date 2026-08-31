---
id: macro-supporter-28
categorySlug: macros
title: "Attribute Proc Macro Signature"
difficulty: 3
tags: [macros, proc-macro, attribute-macro]
---

# Prompt
What are the two arguments passed to a `#[proc_macro_attribute]` function?

# Code
```rust
// #[proc_macro_attribute]
// pub fn my_attr(attr: TokenStream, item: TokenStream) -> TokenStream
```

# Options
- [ ] A) `name: &str` and `body: &str` during runtime execution during standard program runtime execution
- [ ] B) `ast: syn::DeriveInput` and `output: &mut TokenStream` during standard program runtime execution
- [x] C) `attr: TokenStream` (the attribute arguments) and `item: TokenStream` (the annotated item)
- [ ] D) `config: HashMap<String, String>` and `code: String` during standard program runtime execution

# Hint
Attribute macros take the attribute args tokens and the item tokens as arguments.

# Explanation
An attribute macro has the signature `pub fn my_attr(attr: TokenStream, item: TokenStream) -> TokenStream`. `attr` holds any tokens inside `#[my_attr(...)]`, and `item` holds the item to which the attribute was applied.
