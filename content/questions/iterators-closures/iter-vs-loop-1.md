---
id: iter-vs-loop-1
categorySlug: iterators-closures
title: "Iterators vs Loops"
difficulty: 2
tags: [iterators, loops]
---

# Prompt
When is an iterator chain usually preferred over a manual `for` loop?

# Code
```rust
// A
let evens: Vec<_> = nums.iter().filter(|n| *n % 2 == 0).collect();

// B
let mut evens = Vec::new();
for n in &nums {
    if n % 2 == 0 {
        evens.push(*n);
    }
}
```

# Options
- [x] A) For clear map/filter-style transforms over data
- [ ] B) Always; explicit loops are obsolete in Rust in code
- [ ] C) Only when you need identical machine code always
- [ ] D) Never; hand-written loops are always faster in code

# Hint
Prefer expressing the transformation, not micro-optimizing by default.

# Explanation
Iterator adapters read as the transformation you want and compose well. LLVM often optimizes them similarly to loops. Prefer a loop when control flow is complex (early exits, multi-step state) rather than from a blanket speed rule.
