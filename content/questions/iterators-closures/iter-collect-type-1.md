---
id: iter-collect-type-1
categorySlug: iterators-closures
title: "Collect Type Inference"
difficulty: 2
tags: [iterators, type-inference]
---

# Prompt
Why does this fail to compile?

# Code
```rust
let nums = vec![1, 2, 3];
let doubled = nums.iter().map(|x| x * 2).collect();
```

# Options
- [x] A) `collect` needs a target type; annotate `Vec<_>`
- [ ] B) `collect` is invalid; use `for_each` to consume
- [ ] C) `map` cannot multiply `&i32`; the chain is illegal
- [ ] D) `collect` demands mutable ownership of `nums`

# Hint
`collect` is generic over many collection types.

# Explanation
`FromIterator` is implemented for many types (`Vec`, `HashSet`, …), so Rust needs a concrete target. Write `.collect::<Vec<_>>()` or `let doubled: Vec<_> = ...`. Multiplying `&i32` by `2` is fine via auto-deref/`Mul`.
