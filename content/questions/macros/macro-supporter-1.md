---
id: macro-supporter-1
categorySlug: macros
title: "Macro Fragment Specifiers (expr vs tt)"
difficulty: 2
tags: [macros, macro-rules, matchers]
---

# Prompt
How does the `$e:expr` matcher differ from `$t:tt` in declarative macros?

# Code
```rust
macro_rules! parse_token {
    ($t:tt) => { println!("single token tree"); };
}
```

# Options
- [ ] A) `tt` only matches primitive numbers while `expr` matches strings
- [ ] B) `expr` is evaluated at runtime while `tt` evaluates at compile time
- [ ] C) `tt` expands only into procedural macro attribute definitions
- [x] D) `expr` parses a full Rust expression; `tt` matches a single token tree

# Hint
expr matches a complete expression AST node; tt matches a single token or bracketed tree.

# Explanation
`$e:expr` requires the compiler to parse a complete Rust expression (like `1 + 2`). `$t:tt` matches a single token tree (an identifier, literal, punctuation mark, or balanced `(...)`, `[...]`, `{...}`).
