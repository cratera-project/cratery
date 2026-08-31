---
id: life-elision-1
categorySlug: lifetimes
title: "Lifetime Elision"
difficulty: 2
tags: [lifetimes, elision]
---

# Prompt
Why does this function compile without explicit lifetimes?

# Code
```rust
fn first_word(s: &str) -> &str {
    // ...
}
```

# Options
- [ ] A) Every `&str` is treated as `'static` by default
- [ ] B) Return lifetimes are ignored for `&str` outputs
- [ ] C) Elision always picks the longest lifetime nearby
- [x] D) The single input lifetime is assigned to output

# Hint
One input reference has a dedicated elision rule.

# Explanation
With exactly one input reference, elision assigns that input lifetime to any elided output reference. This is equivalent to `fn first_word<'a>(s: &'a str) -> &'a str`.
