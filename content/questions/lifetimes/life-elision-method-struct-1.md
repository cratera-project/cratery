---
id: life-elision-method-struct-1
categorySlug: lifetimes
title: "Method Lifetime Elision"
difficulty: 2
tags: [lifetimes, elision, methods]
---

# Prompt
What is the elided lifetime of the returned `&str`?

# Code
```rust
struct Parser<'a> {
    text: &'a str,
}

impl<'a> Parser<'a> {
    fn next_token(&self) -> &str {
        self.text
    }
}
```

# Options
- [x] A) The lifetime of `&self`, not the generic lifetime `'a`
- [ ] B) The struct parameter `'a`, inherited from `&Parser<'a>`
- [ ] C) An unconstrained lifetime chosen by the caller site
- [ ] D) 'static, because the struct field borrows static data

# Hint
Review the third lifetime elision rule for methods.

# Explanation
Under Rust's lifetime elision rules for methods with a `self` parameter, the lifetime of any returned reference defaults to the lifetime of `&self`. Here, `next_token(&self) -> &str` is elided as `fn next_token<'b>(&'b self) -> &'b str`, tying the return value's lifetime to the temporary borrow of the parser rather than the underlying `'a`. To return a reference valid for `'a`, write `fn next_token(&self) -> &'a str`.
