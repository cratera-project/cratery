---
id: life-struct-field-vs-param-1
categorySlug: lifetimes
title: "Field vs Param Lifetimes"
difficulty: 3
tags: [lifetimes, structs, methods]
---

# Prompt
What does this signature guarantee about the returned reference?

# Code
```rust
struct Holder<'a> { s: &'a str }

impl<'a> Holder<'a> {
    fn choose<'b>(&self, other: &'b str) -> &'a str {
        self.s
    }
}
```

# Options
- [ ] A) It may return `other` whenever `'b: 'a` holds
- [x] B) It returns a reference tied only to lifetime `'a`
- [ ] C) It returns a borrow limited by both `'a` and `'b`
- [ ] D) It returns owned data with no borrow relationship

# Hint
The return type names only one lifetime.

# Explanation
The return type is `&'a str`, so the result is valid for `'a`, the struct field’s lifetime. `other` has `'b` with no `'b: 'a` bound, so returning `other` would be illegal. As written, the contract is independent of `'b`.
