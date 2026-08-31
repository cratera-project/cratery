---
id: macro-supporter-6
categorySlug: macros
title: "Macro Rules Matcher Order"
difficulty: 2
tags: [macros, matcher-order, evaluation]
---

# Prompt
In what order does `macro_rules!` test its pattern matching arms?

# Code
```rust
macro_rules! test_order {
    ($x:ident) => { println!("ident"); };
    ($x:expr) => { println!("expr"); };
}
```

# Options
- [x] A) Top to bottom in order of declaration, using the first arm that matches
- [ ] B) Specificity order, prioritizing more restrictive matchers first in runtime memory
- [ ] C) Alphabetical order based on fragment specifier token names in runtime memory
- [ ] D) Non-deterministic order determined by LLVM AST optimization passes in code

# Hint
macro_rules! evaluates arms sequentially from top to bottom.

# Explanation
`macro_rules!` tests arms sequentially from top to bottom. The first arm whose pattern matches the provided input tokens is expanded; subsequent arms are ignored.
