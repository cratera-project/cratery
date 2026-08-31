---
id: ptr-strict-provenance-with-addr-1
categorySlug: pointers
title: "Strict Provenance with_addr"
difficulty: 3
tags: [pointers, provenance, strict-provenance]
---

# Prompt
What does `ptr.with_addr(new_addr)` do under strict provenance rules?

# Options
- [x] A) It replaces pointer address while retaining provenance
- [ ] B) It discards all provenance tags from the raw pointer
- [ ] C) It converts pointers into arbitrary 64-bit integers
- [ ] D) It allocates fresh provenance identifiers dynamically

# Hint
with_addr creates a pointer with the new address but copies the provenance of the receiver.

# Explanation
`with_addr` creates a new raw pointer with the address `new_addr` while preserving the exact provenance (allocation permission) of `self`.
