---
id: macro-token-tree-group-delimiter-1
categorySlug: macros
title: "Proc Macro TokenTree::Group Representation"
difficulty: 2
tags: [macros, proc-macro, token-tree]
---

# Prompt
How does `proc_macro::TokenTree::Group` represent delimited syntax like `(a, b)` or `[1, 2]`?

# Options
- [ ] A) TokenTree::Group can only contain literal string tokens
- [x] B) It represents delimited tokens preserving matched syntax
- [ ] C) It converts token trees into dynamic binary byte arrays
- [ ] D) It panics if token groups exceed sixteen elements total

# Hint
Group holds a delimiter (Parenthesis, Bracket, Brace, None) and an inner stream.

# Explanation
In procedural macro token streams, `Group` bundles delimited syntax with its delimiter kind (`Parenthesis`, `Bracket`, `Brace`, or `None`) and an inner `TokenStream`.
