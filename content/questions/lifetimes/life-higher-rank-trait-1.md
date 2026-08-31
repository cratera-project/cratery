---
id: life-higher-rank-trait-1
categorySlug: lifetimes
title: "Higher-Rank Trait Bounds (HRTB)"
difficulty: 3
tags: [lifetimes, hrtb, closure]
---

# Prompt
What is the meaning of `for<'a> F: Fn(&'a str)` in a trait bound?

# Options
- [ ] A) The closure accepts only static references during execution
- [x] B) The closure accepts references with any caller lifetime 'a
- [ ] C) The closure captures its enclosing lexical stack lifetime
- [ ] D) The closure converts all inputs into owned heap allocations

# Hint
`for<'a>` quantifies universally over any chosen lifetime.

# Explanation
`for<'a>` is a Higher-Rank Trait Bound (HRTB) indicating that `F` can accept a reference with *any* lifetime `'a` chosen by the caller.
