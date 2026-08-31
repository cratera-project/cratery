---
id: macro-supporter-18
categorySlug: macros
title: "Proc Macro TokenStream Representation"
difficulty: 2
tags: [macros, proc-macro, token-stream]
---

# Prompt
What data structure is manipulated by procedural macros in the `proc_macro` crate?

# Code
```rust
// fn my_macro(input: TokenStream) -> TokenStream
```

# Options
- [x] A) `proc_macro::TokenStream`, a stream of syntax token trees and source spans
- [ ] B) A plain ASCII string containing unprocessed source text within local thread memory
- [ ] C) A fully typed and resolved LLVM Intermediate Representation graph in runtime memory
- [ ] D) A JSON object mapping identifiers to compiler symbol addresses in runtime memory

# Hint
proc_macro functions take and return TokenStream values.

# Explanation
Procedural macros operate on `proc_macro::TokenStream`, which represents a stream of token trees with associated source location metadata (`Span`), enabling tools like `syn` and `quote` to parse and emit code.
