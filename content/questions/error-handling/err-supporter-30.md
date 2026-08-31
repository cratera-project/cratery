---
id: err-supporter-30
categorySlug: error-handling
title: "Option to Result with ok_or and ?"
difficulty: 2
tags: [error-handling, question-mark, option-return]
---

# Prompt
What happens when `None?` is evaluated inside a function returning `Option<T>`?

# Code
```rust
fn get_first_char(s: &str) -> Option<char> {
    let c = s.chars().next()?;
    Some(c.to_ascii_uppercase())
}
```

# Options
- [ ] A) Panics with an unwrap exception error message during runtime execution
- [ ] B) Converts `None` into an empty default character `'\\0'` in code
- [x] C) Causes the enclosing function to return early with `None`
- [ ] D) Triggers a compiler syntax error because `?` requires `Result`

# Hint
The ? operator works on Option in functions that return Option, returning None early.

# Explanation
In functions returning `Option`, the `?` operator extracts `v` from `Some(v)`, and returns `None` early from the enclosing function if applied to `None`.
