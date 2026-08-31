---
id: iter-fold-1
categorySlug: iterators-closures
title: "Fold Accumulation"
difficulty: 2
tags: [iterators, fold]
---

# Prompt
What does `.fold` do that plain `.map` does not?

# Code
```rust
let sum = nums.iter().fold(0, |acc, x| acc + x);
```

# Options
- [ ] A) Keep only elements that match a predicate
- [x] B) Reduce many items into one accumulated value
- [ ] C) Transform each element into another element
- [ ] D) Reverse the order of the underlying iterator

# Hint
`fold` carries state from one step into the next.

# Explanation
`fold` starts from an initial accumulator and combines each item into it, producing one final value. `map` transforms items one-by-one without reducing them.
