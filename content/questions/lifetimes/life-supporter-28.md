---
id: life-supporter-28
categorySlug: lifetimes
title: "Covariance of Box<T>"
difficulty: 3
tags: [lifetimes, box, covariance]
---

# Prompt
Why can Box<&'static str> be assigned to Box<&'a str>?

# Code
```rust
fn convert<'a>(b: Box<&'static str>) -> Box<&'a str> {
    b
}
```

# Options
- [ ] A) Box performs deep heap cloning on type conversions
- [ ] B) All heap pointers in Rust are invariant by definition
- [x] C) Box<T> is covariant over its type argument T
- [ ] D) The compiler transmutes box pointers in unsafe code

# Hint
Box owns its T and has no shared mutable access to T, so it is covariant in T.

# Explanation
Box<T> owns its contents exclusively and is covariant over T. Because &'static str is a subtype of &'a str, Box<&'static str> is a subtype of Box<&'a str> and can be assigned directly.
