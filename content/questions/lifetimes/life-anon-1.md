---
id: life-anon-1
categorySlug: lifetimes
title: "Anonymous Lifetime"
difficulty: 2
tags: [lifetimes, elision]
---

# Prompt
What does `'_` mean in this return type?

# Code
```rust
fn trim(s: &str) -> &'_ str {
    s.trim()
}
```

# Options
- [ ] A) It forces the returned borrow to be `'static`
- [x] B) It marks an elided lifetime inferred from context
- [ ] C) It creates a brand-new named lifetime parameter
- [ ] D) It disables borrow checking for this function body

# Hint
`'_` is the explicitly elided / inferred lifetime.

# Explanation
`'_` stands for a lifetime the compiler infers (often the same as writing an elided `&str`). Here it still ties the output to the input `s`; it does not mean `'static` or turn off checking.
