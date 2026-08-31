---
id: life-hrtb-intro-1
categorySlug: lifetimes
title: "Higher-Ranked Bounds Intro"
difficulty: 2
tags: [lifetimes, hrtb]
---

# Prompt
What does `for<'a>` mean in this bound?

# Code
```rust
fn apply<F>(f: F)
where
    F: for<'a> Fn(&'a str) -> &'a str,
{
    let _ = f("hi");
}
```

# Options
- [ ] A) `F` works for some single lifetime chosen by caller
- [ ] B) `F` must only accept `'static` string slices
- [x] C) `F` must work for every lifetime `'a` of inputs
- [ ] D) `for<'a>` disables lifetime checking inside `F`

# Hint
Read it as “for all lifetimes …”.

# Explanation
`for<'a> Fn(&'a str) -> &'a str` is a higher-ranked trait bound: the closure/function must be valid for all lifetimes, not just one. That is stronger than having a single `'a` on `apply` itself.
