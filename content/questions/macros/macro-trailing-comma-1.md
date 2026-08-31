---
id: macro-trailing-comma-1
categorySlug: macros
title: "Trailing Comma Patterns"
difficulty: 2
tags: [macros, repetition]
---

# Prompt
Why might this macro reject `my_vec![1, 2,]`?

# Code
```rust
macro_rules! my_vec {
    ( $( $x:expr ),* ) => { /* ... */ };
}

// my_vec![1, 2,]; // often fails to match
```

# Options
- [ ] A) Trailing commas are forbidden in all Rust syntax
- [x] B) `),*` does not accept an optional trailing comma
- [ ] C) `:expr` cannot appear inside repetition groups
- [ ] D) Macros expand after commas are stripped by rustc

# Hint
Compare patterns that end with `$(,)?` or `,*.`

# Explanation
`),*` matches comma-separated items without a final trailing comma. Idiomatic macros add an optional trailing comma arm (e.g. `$( $x:expr ),* $(,)?`) so call sites can use Rust’s usual trailing-comma style.
