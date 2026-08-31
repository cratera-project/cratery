---
id: iter-enumerate-1
categorySlug: iterators-closures
title: "Enumerate Pattern"
difficulty: 1
tags: [iterators, combinators]
---

# Prompt
What does `.enumerate` add to each item?

# Code
```rust
for (i, val) in [10, 20, 30].iter().enumerate() {
    println!("{i}: {val}");
}
```

# Options
- [ ] A) The memory address of the element being visited
- [ ] B) A countdown of how many items remain ahead
- [x] C) A 0-based index paired with the element
- [ ] D) A stable hash used for keyed lookups later

# Hint
It is the idiomatic replacement for a manual counter.

# Explanation
`enumerate` yields `(usize, Item)` starting at index `0`. It does not expose addresses, remaining counts, or hashes.
