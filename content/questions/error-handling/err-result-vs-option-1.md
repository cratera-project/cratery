---
id: err-result-vs-option-1
categorySlug: error-handling
title: "Result vs Option Design"
difficulty: 2
tags: [error-handling, result, option]
---

# Prompt
When should a lookup API return `Result<T, E>` instead of `Option<T>`?

# Code
```rust
fn get_user(id: u32) -> /* Option<User> or Result<User, DbError> */ {
    // database lookup
}
```

# Options
- [ ] A) Always prefer `Result` so every API looks alike in code
- [x] B) When failure needs a reason the caller can handle
- [ ] C) Never; `Option` and `Result` are interchangeable in code
- [ ] D) When you need faster code than `Option` provides in code

# Hint
`None` means absence; `Err` means failure with context.

# Explanation
Use `Option` when absence is a normal outcome (not found). Use `Result` when the caller may need to distinguish failure modes (I/O error vs not found, parse error, …). They are not performance synonyms.
