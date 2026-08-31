---
id: iter-filter-map-1
categorySlug: iterators-closures
title: "filter_map vs filter + map"
difficulty: 2
tags: [iterators, combinators]
---

# Prompt
When is `.filter_map` the better fit?

# Code
```rust
// A
strs.iter().filter_map(|s| s.parse::<i32>().ok())

// B
strs.iter()
    .map(|s| s.parse::<i32>())
    .filter(|r| r.is_ok())
    .map(|r| r.unwrap())
```

# Options
- [x] A) When mapping can both transform and drop failures
- [ ] B) Only when separating filter and map is required
- [ ] C) Only for `Result`; it cannot work with `Option`
- [ ] D) Never; the two-step form is always preferred

# Hint
`filter_map` expects an `Option` from the closure.

# Explanation
`filter_map` maps to `Option<U>`, keeps `Some`, and discards `None`, ideal for parse-or-skip. It works with any `Option`, not only `Result` (often via `.ok()`). The longer chain is noisier and uses `unwrap` after filtering.
