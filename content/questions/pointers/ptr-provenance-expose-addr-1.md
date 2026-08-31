---
id: ptr-provenance-expose-addr-1
categorySlug: pointers
title: "Pointer Provenance and expose_addr"
difficulty: 3
tags: [pointers, provenance]
---

# Prompt
What is the role of `expose_addr` in Rust pointer provenance models?

# Options
- [ ] A) It clears the pointer provenance and frees heap blocks
- [x] B) It exposes address integer while preserving provenance
- [ ] C) It converts pointers into random 64-bit integer values
- [ ] D) It turns raw addresses into compile-time const literals

# Hint
Exposing address informs compiler analysis that integer casts may recover provenance.

# Explanation
`expose_addr` converts a pointer to `usize` while exposing its provenance, signaling to compiler optimization passes that this address may later be cast back to a pointer.
