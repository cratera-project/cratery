---
id: closure-lifetime-1
categorySlug: iterators-closures
title: "Closure Lifetimes"
difficulty: 3
tags: [closures, lifetimes]
---

# Prompt
Does this function compile?

# Code
```rust
fn make_closure<'a>(s: &'a str) -> impl Fn() -> &'a str + 'a {
    move || s
}
```

# Options
- [ ] A) No; closures are unsized and cannot return refs
- [x] B) Yes; it captures `s` and returns that borrow
- [ ] C) No; `impl Fn` cannot appear in return position
- [ ] D) No; only `Box<dyn Fn()>` may return references

# Hint
The returned closure's lifetime is tied to `s`.

# Explanation
This compiles: the closure captures `s: &'a str` and returns it. Returning `impl Fn() -> &'a str + 'a` (or an equivalent bound) is valid. Boxing is only needed for type erasure or mixed concrete closure types.
