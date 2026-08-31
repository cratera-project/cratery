---
id: iter-flat-map-1
categorySlug: iterators-closures
title: "flat_map Usage"
difficulty: 2
tags: [iterators, combinators]
---

# Prompt
What does `.flat_map` add over plain `.map`?

# Code
```rust
let nested = vec![vec![1, 2], vec![3, 4]];
let flat: Vec<_> = nested.iter().flat_map(|v| v.iter()).collect();
```

# Options
- [ ] A) Nothing; `.map` already flattens nested iterators
- [ ] B) It deduplicates mapped values like a set insert
- [x] C) It maps each item to an iterator, then flattens
- [ ] D) It only accepts `Vec<Vec<_>>`, unlike general `.map`

# Hint
Think `.map(f).flatten()`.

# Explanation
`flat_map(f)` is `.map(f).flatten()`: each element produces an iterable (`IntoIterator`), and one level of nesting is removed. It works with many iterable outputs, including `Option`/`Result` as 0-or-1 iterators.
