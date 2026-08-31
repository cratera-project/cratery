---
id: iter-partition-1
categorySlug: iterators-closures
title: "Partition Method"
difficulty: 2
tags: [iterators, combinators]
---

# Prompt
What does `.partition` return?

# Code
```rust
let nums = vec![1, 2, 3, 4, 5, 6];
let (evens, odds): (Vec<_>, Vec<_>) =
    nums.into_iter().partition(|&x| x % 2 == 0);
```

# Options
- [x] A) Two collections split by a boolean predicate
- [ ] B) Fixed-size chunks meant for parallel workers
- [ ] C) Only the rejected elements; matches are dropped
- [ ] D) Runs of equal consecutive values as sub-vectors

# Hint
True goes left; false goes right.

# Explanation
`partition` consumes the iterator and builds two collections: predicate-true first, false second. It keeps both sides, unlike `filter`. Chunking/grouping consecutive equals are different adapters/crates.
