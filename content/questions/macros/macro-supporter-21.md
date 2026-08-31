---
id: macro-supporter-21
categorySlug: macros
title: "Macro Question Mark Operator in Repetition"
difficulty: 2
tags: [macros, optional-repetition, syntax]
---

# Prompt
What does `$(,)?` match at the end of a macro argument list in modern Rust?

# Code
```rust
macro_rules! items {
    ($($item:expr),* $(,)?) => {
        vec![$($item),*]
    };
}
```

# Options
- [ ] A) An optional trailing comma
- [ ] B) A mandatory error operator
- [ ] C) A wildcard regex pattern
- [x] D) A conditional compile flag

# Hint
$(...)? specifies 0 or 1 occurrences of the enclosed token.

# Explanation
In Rust macro repetition syntax, `$(...)?` denotes an optional occurrence (0 or 1 time). `$(,)?` conveniently permits an optional trailing comma at the end of parameter lists.
