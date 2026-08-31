---
id: life-mult-1
categorySlug: lifetimes
title: "Multiple Lifetimes"
difficulty: 3
tags: [lifetimes, generics]
---

# Prompt
What does this signature imply about the return value?

# Code
```rust
fn mix<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    x
}
```

# Options
- [ ] A) The function must allocate and return `String`
- [ ] B) The return must outlive both `'a` and `'b`
- [ ] C) The return is tied only to `y`'s lifetime `'b`
- [x] D) The return is tied only to `x`'s lifetime `'a`

# Hint
Look at which lifetime appears in the return type.

# Explanation
The return type `&'a str` ties the result to `x`’s borrow. Nothing requires `y` to live as long as `'a`, so you generally cannot return a borrow of `y` without an extra bound such as `'b: 'a`.
