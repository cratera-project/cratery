---
id: life-early-vs-late-bound-1
categorySlug: lifetimes
title: "Early vs Late Bound Lifetimes"
difficulty: 3
tags: [lifetimes, early-bound, late-bound]
---

# Prompt
What distinguishes early-bound from late-bound lifetime parameters on functions?

# Options
- [ ] A) Early-bound lifetimes cannot be used in function signatures
- [ ] B) Late-bound lifetimes are converted directly into raw heap
- [x] C) Early-bound lifetimes are resolved at item definition site
- [ ] D) Late-bound lifetimes prevent higher-rank trait bound impl

# Hint
Early-bound lifetimes are chosen when naming the function item, while late-bound are chosen at call site.

# Explanation
Early-bound lifetimes (often involved in trait bounds or `where` clauses) are monomorphized when referencing the item, whereas late-bound lifetimes are quantified at each specific call site.
