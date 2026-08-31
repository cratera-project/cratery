---
id: macro-supporter-9
categorySlug: macros
title: "pat_param Specifier in Rust 2021/2024"
difficulty: 3
tags: [macros, pat_param, rust-2024]
---

# Prompt
What does the `$p:pat_param` fragment specifier match in declarative macros?

# Code
```rust
macro_rules! match_param {
    ($p:pat_param | $rest:pat) => { println!("matched"); };
}
```

# Options
- [ ] A) A function parameter identifier without type annotations in runtime memory
- [ ] B) A constant generic value passed into a struct constructor in runtime memory
- [ ] C) A procedural macro attribute parameter string literal within local thread memory
- [x] D) A pattern that does not include top-level or (`|`) pattern alternatives

# Hint
pat_param matches patterns excluding top-level | alternatives, allowing | to be used as a delimiter.

# Explanation
`pat_param` matches standard patterns excluding top-level `|` alternatives (e.g. matching `A` in `A | B`). This allows `|` to be used safely as a separator token after `$p:pat_param`.
