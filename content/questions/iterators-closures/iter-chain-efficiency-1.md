---
id: iter-chain-efficiency-1
categorySlug: iterators-closures
title: "Iterator Chain Performance"
difficulty: 2
tags: [iterators, performance]
---

# Prompt
Where do allocations happen in this chain?

# Code
```rust
let result: Vec<_> = nums
    .iter()
    .filter(|n| **n > 0)
    .map(|n| n * 2)
    .take(5)
    .collect();
```

# Options
- [ ] A) Each adapter builds a temporary `Vec` of results
- [x] B) Only `collect` allocates; adapters stay lazy wrappers
- [ ] C) Only `filter` allocates; later steps mutate in place
- [ ] D) The parser rewrites the chain into raw C-style loops

# Hint
Adapters return iterator types; consumers force work.

# Explanation
`filter`/`map`/`take` are lazy zero-cost wrappers. The closure work runs as `collect` pulls items, and that is when the output `Vec` is allocated. LLVM may optimize further, but that is not a parse-time rewrite.
