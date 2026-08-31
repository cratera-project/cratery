---
id: life-elision-two-inputs-1
categorySlug: lifetimes
title: "Elision Limit"
difficulty: 2
tags: [lifetimes, elision]
---

# Prompt
Which elision outcome applies to this signature?

# Code
```rust
fn first(x: &str, y: &str) -> &str {
    x
}
```

# Options
- [ ] A) Elision silently ties the output borrow only to `x`
- [ ] B) Elision silently ties the output borrow only to `y`
- [x] C) Elision fails; explicit lifetimes must be written
- [ ] D) Elision promotes both input borrows to `'static`

# Hint
Body intent does not drive elision defaults.

# Explanation
Even if the body only returns `x`, elision still refuses to guess an output lifetime when there are multiple input references. You must annotate, e.g. `fn first<'a>(x: &'a str, y: &str) -> &'a str`.
