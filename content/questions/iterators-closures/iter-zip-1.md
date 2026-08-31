---
id: iter-zip-1
categorySlug: iterators-closures
title: "Zipping Iterators"
difficulty: 2
tags: [iterators, combinators]
---

# Prompt
What happens when zipped iterators have different lengths?

# Code
```rust
let a = vec![1, 2, 3];
let b = vec!["x", "y"];
let zipped: Vec<_> = a.iter().zip(b.iter()).collect();
```

# Options
- [x] A) It stops at the shorter length (two pairs here)
- [ ] B) It fails to compile because element types differ
- [ ] C) It pads the shorter side with default values
- [ ] D) It panics unless both iterators have equal length

# Hint
`zip` ends when either side is exhausted.

# Explanation
`Iterator::zip` yields pairs until one side ends. Different payload types are fine (`(&i32, &&str)`). No padding and no length panic in std.
