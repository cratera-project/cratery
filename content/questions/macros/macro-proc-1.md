---
id: macro-proc-1
categorySlug: macros
title: "Procedural vs Declarative"
difficulty: 3
tags: [macros, procedural]
---

# Prompt
What mainly distinguishes procedural macros from `macro_rules!`?

# Code
```rust
#[derive(Debug)]
struct User {
    id: u32,
}
```

# Options
- [ ] A) They cannot generate `impl` blocks at all
- [x] B) They are Rust functions over `TokenStream` values
- [ ] C) They are deprecated in favor of only `macro_rules!`
- [ ] D) They are always simpler to write than `macro_rules!`

# Hint
Think `derive`, attribute, and function-like proc macros.

# Explanation
Procedural macros are compiled plugins: functions from `TokenStream` to `TokenStream` (often via `syn`/`quote`). Declarative macros use pattern → template rules. Proc macros power `derive` and many attributes; they are not deprecated.
