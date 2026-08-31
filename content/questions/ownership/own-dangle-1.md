---
id: own-dangle-1
categorySlug: ownership
title: "Dangling References"
difficulty: 2
tags: [ownership, lifetimes]
---

# Prompt
Why is returning a reference to a local variable rejected?

# Code
```rust
fn dangle() -> &String {
    let s = String::from("hello");
    &s
}
```

# Options
- [ ] A) The return type must wrap the ref in `Box`
- [ ] B) Functions are never allowed to return references
- [x] C) Local `s` is dropped when the function returns
- [ ] D) `String` must implement a special `Return` trait

# Hint
Who still owns the data after `return`?

# Explanation
`s` is owned by `dangle` and dropped at the end of the function. A returned `&s` would point at freed memory. Return an owned `String`, or borrow from data the caller provides.
