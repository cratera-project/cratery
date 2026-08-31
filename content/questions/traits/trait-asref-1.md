---
id: trait-asref-1
categorySlug: traits
title: "AsRef Generic APIs"
difficulty: 2
tags: [traits, asref]
---

# Prompt
Why can `is_hello` take both `&str` and `String`?

# Code
```rust
fn is_hello<T: AsRef<str>>(s: T) {
    assert_eq!("hello", s.as_ref());
}

fn main() {
    is_hello("hello");
    is_hello("hello".to_string());
}
```

# Options
- [ ] A) `AsRef` clones every argument into a `String`
- [ ] B) Generic functions ignore the argument’s type
- [x] C) Both types implement `AsRef<str>` cheaply
- [ ] D) `String` is a subtype of `str` in the type system

# Hint
The bound asks for a cheap `&str` view, not ownership.

# Explanation
`AsRef<str>` is a cheap reference-to-reference conversion. Both `&str` and `String` implement it, so the generic function accepts either without cloning. `String` is not a subtype of `str`; you typically go through `Deref`/`AsRef`. Prefer `Borrow` when hash/eq must match an owned key.
