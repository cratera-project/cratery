---
id: macro-proc-macro-derive-helper-attrs-1
categorySlug: macros
title: "Custom Helper Attributes in Derive Macros"
difficulty: 3
tags: [macros, proc-macro, helper-attributes]
---

# Prompt
What is the purpose of `#[proc_macro_derive(MyTrait, attributes(my_helper))]`?

# Options
- [ ] A) They execute shell commands during procedural macro run
- [ ] B) They turn off type checking for all annotated structs
- [x] C) They register inert attributes allowed on fields or items
- [ ] D) They declare exported C-compatible dynamic symbol names

# Hint
The attributes(...) list registers inert attributes so the compiler does not reject them.

# Explanation
Listing `attributes(my_helper)` in `proc_macro_derive` informs `rustc` that `#[my_helper]` is an inert attribute meant for this derive macro, preventing "unknown attribute" errors.
