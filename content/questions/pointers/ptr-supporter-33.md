---
id: ptr-supporter-33
categorySlug: pointers
title: "Raw Pointer Addr vs Expose Provenance"
difficulty: 3
tags: [pointers, strict-provenance, provenance]
---

# Prompt
How does `ptr::without_provenance::<T>(addr)` differ from casting an integer with `as *const T`?

# Code
```rust
use std::ptr;

fn main() {
    let p: *const u8 = ptr::without_provenance(0x1000);
    assert_eq!(p.addr(), 0x1000);
}
```

# Options
- [x] A) It creates a pointer with explicitly no provenance, valid only for address checks
- [ ] B) It registers the address in the kernel memory map table under current compiler safety rules
- [ ] C) It forces the CPU cache line to prefetch the address bytes within local thread memory
- [ ] D) It converts the address into a valid stack reference under current compiler safety rules

# Hint
without_provenance creates a pointer with no memory access rights (wildcard/null provenance).

# Explanation
`ptr::without_provenance(addr)` creates a pointer with zero provenance. It cannot be legally dereferenced for memory access, but is useful for sentinel values and address comparisons.
