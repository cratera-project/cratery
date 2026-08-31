---
id: life-dangle-local-1
categorySlug: lifetimes
title: "Returning Local Ref"
difficulty: 3
tags: [lifetimes, dangling]
---

# Prompt
Why does this fail to compile?

# Code
```rust
fn make_ref<'a>() -> &'a str {
    let s = String::from("hi");
    s.as_str()
}
```

# Options
- [ ] A) `as_str()` requires a mutable `String` receiver
- [ ] B) `String::from` cannot appear in free functions
- [ ] C) The parameter `'a` must be written as `'static`
- [x] D) It returns a borrow of data dropped on return

# Hint
Naming a lifetime does not keep local `s` alive.

# Explanation
The `&str` points into `s`’s buffer. `s` is dropped when the function returns, so the reference would dangle. A lifetime parameter describes a relationship; it cannot extend a local’s storage. Return owned data or borrow an input from the caller.
