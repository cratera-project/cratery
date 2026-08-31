---
id: iter-idiomatic-1
categorySlug: iterators-closures
title: "Idiomatic Iterator Chains"
difficulty: 2
tags: [iterators, idiomatic]
---

# Prompt
Which style is more idiomatic for this search?

# Code
```rust
// A
nums.iter().filter(|n| **n > 10).find(|n| **n % 2 == 0);

// B
for n in &nums {
    if *n > 10 && *n % 2 == 0 {
        return Some(n);
    }
}
None
```

# Options
- [ ] A) B only; iterator adapters are rarely idiomatic
- [ ] B) Neither; this search must use recursion instead
- [x] C) A; the chain states filter-then-find intent clearly
- [ ] D) B only; `find` cannot express compound conditions

# Hint
Idiomatic Rust often reads the query as a chain of adapters.

# Explanation
For a simple search/transform, adapters like `filter`/`find` (or a single `find` with a compound predicate) are idiomatic. Loops are fine for messier control flow, but not required here.
