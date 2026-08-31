---
id: macro-macro-rules-local-inner-macros-1
categorySlug: macros
title: "local_inner_macros Attribute"
difficulty: 3
tags: [macros, local-inner-macros, hygiene]
---

# Prompt
What does `#[macro_export(local_inner_macros)]` do for declarative macros calling sibling helper macros?

# Options
- [x] A) It prefixes internal macro invocations with $crate::
- [ ] B) It prevents other crates from calling the macro rules
- [ ] C) It hides macro definitions from the public rustdoc pages
- [ ] D) It generates inline assembly stubs for macro expanders

# Hint
local_inner_macros automatically adds $crate:: to macro calls made within the macro body.

# Explanation
`#[macro_export(local_inner_macros)]` tells the compiler to expand internal macro calls within the macro body by prefixing them with `$crate::`, allowing helper macros to resolve correctly.
