---
id: err-option-question-1
categorySlug: error-handling
title: "Question Mark on Option"
difficulty: 2
tags: [error-handling, option, question-operator]
---

# Prompt
What does `?` do on `None` in this function?

# Code
```rust
fn first_even(nums: &[i32]) -> Option<i32> {
    let n = nums.get(0)?;
    if n % 2 == 0 {
        Some(*n)
    } else {
        None
    }
}
```

# Options
- [ ] A) It panics with an index-out-of-bounds message
- [x] B) It returns `None` from the enclosing function
- [ ] C) It converts `None` into `Err(())` automatically
- [ ] D) It substitutes `0` and continues the function body

# Hint
`?` works on `Option` in `Option`-returning functions.

# Explanation
For `Option`, `?` early-returns `None` when the value is `None`. It does not panic, invent `Err`, or default to zero. Mixing `Option`/`Result` with `?` needs a compatible return type or conversion (`ok_or`, etc.).
