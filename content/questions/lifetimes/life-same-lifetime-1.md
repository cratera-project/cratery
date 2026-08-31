---
id: life-same-lifetime-1
categorySlug: lifetimes
title: "Shared Lifetime Parameter"
difficulty: 2
tags: [lifetimes, constraints]
---

# Prompt
What does using one `'a` on both inputs require?

# Code
```rust
fn pick<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

# Options
- [x] A) Both borrows must be valid for a common lifetime
- [ ] B) `x` and `y` must point at the exact same allocation
- [ ] C) The function body may only return the first argument
- [ ] D) Callers must pass `'static` strings and nothing else

# Hint
One parameter names a single region both must fit.

# Explanation
A shared `'a` means both references are borrowed for (at least) that same region, the overlap where both are valid. They need not be the same allocation, and non-`'static` borrows are fine if they overlap long enough.
