---
id: macro-repeat-1
categorySlug: macros
title: "Macro Repetition"
difficulty: 3
tags: [macros, repetition]
---

# Prompt
What does `*` mean in `$( $x:expr ),*`?

# Code
```rust
macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut v = Vec::new();
            $( v.push($x); )*
            v
        }
    };
}
```

# Options
- [x] A) Repeat the grouped pattern zero or more times
- [ ] B) Require exactly one trailing comma always
- [ ] C) Match the grouped pattern exactly one time
- [ ] D) Mark the whole pattern as a syntax error

# Hint
Compare `*`, `+`, and `?` repetition operators.

# Explanation
In `macro_rules!`, `$( ... ),*` means zero or more repetitions of the inner pattern, separated by commas. `+` is one or more; `?` is optional (zero or one). Trailing commas need an explicit pattern if you want them.
