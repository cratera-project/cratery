---
id: iter-supporter-7
categorySlug: iterators-closures
title: "Iterator::try_fold Early Exit"
difficulty: 2
tags: [iterators-closures, try-fold, short-circuit]
---

# Prompt
What is the primary advantage of `try_fold` over standard `fold`?

# Code
```rust
fn main() {
    let nums = vec![1, 2, -3, 4];
    let res = nums.into_iter().try_fold(0, |acc, x| {
        if x < 0 { Err("negative") } else { Ok(acc + x) }
    });
    assert_eq!(res, Err("negative"));
}
```

# Options
- [ ] A) Catches thread panics and converts them into Result values in runtime memory
- [x] B) Short-circuits immediately upon encountering an error (`Err` or `None`)
- [ ] C) Executes closure operations in parallel across Rayon pools in runtime memory
- [ ] D) Allocates the accumulator variable on heap page memory within local thread memory

# Hint
try_fold short-circuits early when the closure returns Err or Break.

# Explanation
`Iterator::try_fold` is the foundational primitive for all fallible/short-circuiting iterator consumers. If the accumulator closure returns `Err(e)` or `Break(b)`, `try_fold` stops immediately without processing remaining items.
