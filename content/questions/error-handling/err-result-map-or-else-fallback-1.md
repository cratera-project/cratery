---
id: err-result-map-or-else-fallback-1
categorySlug: error-handling
title: "Result map_or_else Transformation"
difficulty: 2
tags: [error-handling, map_or_else, result]
---

# Prompt
How does `result.map_or_else(fallback_fn, map_fn)` handle `Ok` vs `Err`?

# Options
- [ ] A) It panics immediately on Err without running fallback
- [ ] B) It forces the fallback error closure to return unit ()
- [ ] C) It converts the Result into a raw pointer exit code
- [x] D) It applies op to Ok or evaluates fallback closure on Err

# Hint
map_or_else computes a default value lazily on Err and maps Ok value on success.

# Explanation
`map_or_else` maps an `Ok(t)` value using `map_fn(t)`, or computes a fallback return value by evaluating `fallback_fn(e)` on `Err(e)`.
