---
id: iter-scan-internal-state-1
categorySlug: iterators-closures
title: "Stateful Iteration with scan"
difficulty: 2
tags: [iterators-closures, scan, state]
---

# Prompt
What is the primary role of `.scan(initial_state, |state, item| ...)` in Rust?

# Options
- [ ] A) It stores historical items in a global static array pool
- [ ] B) It parses items into token streams using compiler syntax
- [x] C) It maintains internal mutable state across closure calls
- [ ] D) It scans system memory pages for matching byte sequences

# Hint
scan is like fold/reduce but yields an iterator while maintaining internal mutable state.

# Explanation
`scan()` maintains internal mutable state across iteration steps, allowing stateful transformations and early termination by returning `None` from the closure.
