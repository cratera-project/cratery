---
id: iter-scan-1
categorySlug: iterators-closures
title: "Scan Accumulator"
difficulty: 3
tags: [iterators, stateful]
---

# Prompt
How does `.scan` differ from `.map`?

# Code
```rust
let running_sum: Vec<_> = [1, 2, 3, 4]
    .into_iter()
    .scan(0, |acc, x| {
        *acc += x;
        Some(*acc)
    })
    .collect();
```

# Options
- [ ] A) No difference; `scan` is only an alias of `map`
- [x] B) `scan` keeps mutable state across yielded items
- [ ] C) `scan` works only for numbers; `map` is general
- [ ] D) `scan` always parallelizes; `map` stays sequential

# Hint
Notice the accumulator argument threaded through calls.

# Explanation
`scan` is a stateful adapter: the closure gets `&mut State` and may yield `Some`/`None` (ending early). `map` is stateless per element. Use `scan` for running totals and similar pipelines.
