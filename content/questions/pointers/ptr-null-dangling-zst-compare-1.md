---
id: ptr-null-dangling-zst-compare-1
categorySlug: pointers
title: "Raw Pointers to Zero-Sized Types"
difficulty: 2
tags: [pointers, zst, dangling]
---

# Prompt
What is true about dereferencing dangling, properly aligned raw pointers to zero-sized types (ZST)?

# Options
- [ ] A) Zero-sized types cannot have raw pointer addresses
- [x] B) Dangling non-null pointers are valid for ZST reads
- [ ] C) Reading from a dangling ZST pointer is instant UB
- [ ] D) ZST pointers must always be cast to null pointers

# Hint
ZST reads/writes access 0 bytes of memory, so any aligned non-null pointer is valid.

# Explanation
Because zero-sized types occupy 0 bytes, reading or writing a ZST through a properly aligned, non-null (even dangling) pointer performs zero memory accesses and is sound.
