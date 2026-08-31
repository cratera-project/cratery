---
id: macro-supporter-3
categorySlug: macros
title: "Macro Repetition Separators"
difficulty: 2
tags: [macros, repetition, syntax]
---

# Prompt
What does `$($x:expr),*` specify in a macro matcher pattern?

# Code
```rust
macro_rules! my_vec {
    ($($x:expr),*) => {
        vec![$($x),*]
    };
}
```

# Options
- [ ] A) At least one expression without any delimiters
- [x] B) Zero or more expressions separated by commas
- [ ] C) Exactly two comma-separated expressions in code
- [ ] D) An array slice of constant integer expressions

# Hint
* means zero or more repetitions with the preceding comma as separator.

# Explanation
`$($x:expr),*` matches zero or more occurrences of `$x:expr` separated by commas. Using `+` instead of `*` would require at least one expression.
