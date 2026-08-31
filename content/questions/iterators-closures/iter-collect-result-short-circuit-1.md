---
id: iter-collect-result-short-circuit-1
categorySlug: iterators-closures
title: "Collecting Iterator of Results into Result<Vec<T>, E>"
difficulty: 2
tags: [iterators-closures, collect, result]
---

# Prompt
What happens when `iter.collect::<Result<Vec<T>, E>>()` encounters an `Err`?

# Options
- [ ] A) It replaces all Err variants with default zero values
- [ ] B) It returns a tuple of successful values and error lists
- [ ] C) It continues iteration and collects all errors to vector
- [x] D) It stops on the first Err and returns that Err directly

# Hint
Collecting into Result short-circuits on the first error.

# Explanation
`collect()` into `Result<Vec<T>, E>` short-circuits: upon encountering the first `Err(e)`, iteration immediately stops and returns `Err(e)`.
