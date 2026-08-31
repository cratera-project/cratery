---
id: life-return-shorter-1
categorySlug: lifetimes
title: "Output Lifetime Needs a Source"
difficulty: 2
tags: [lifetimes, annotations, elision]
---

# Prompt
Why must the return borrow be tied to `x` explicitly here?

# Code
```rust
fn first<'a>(x: &'a str, _y: &str) -> &'a str {
    x
}
```

# Options
- [ ] A) Rust forbids two lifetime parameters on one function
- [x] B) Full elision cannot choose an output lifetime source
- [ ] C) Distinct lifetimes force both inputs to be `'static`
- [ ] D) Returning `x` always requires cloning into a `String`

# Hint
Two input references make elision refuse to guess the return.

# Explanation
With more than one input reference, elision will not assign the output lifetime (Reference, Lifetime elision). You must name which input the return borrows from. `_y` can stay elided as `&str`; the important part is tying the return to `x` via `'a`.
