---
id: iter-rchunks-exact-remainder-1
categorySlug: iterators-closures
title: "Reverse Slicing with rchunks_exact"
difficulty: 2
tags: [iterators-closures, rchunks, slice]
---

# Prompt
How does `slice.rchunks_exact(n)` partition a slice?

# Options
- [x] A) It yields non-overlapping chunks from the slice tail
- [ ] B) It allocates copies of slice segments in reverse order
- [ ] C) It panics if the slice length is not an exact multiple
- [ ] D) It sorts the chunks in descending order automatically

# Hint
rchunks_exact starts chunking from the end of the slice towards the front.

# Explanation
`rchunks_exact(n)` yields exact chunks of length `n` starting from the end of the slice, leaving any remainder at the start available via `.remainder()`.
