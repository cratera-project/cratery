---
id: ptr-supporter-2
categorySlug: pointers
title: "Strict Provenance APIs (addr vs cast)"
difficulty: 3
tags: [pointers, strict-provenance, unsafe]
---

# Prompt
Why is `ptr.addr()` preferred over `ptr as usize` under strict provenance?

# Code
```rust
fn main() {
    let x = 42;
    let ptr: *const i32 = &x;
    let addr: usize = ptr.addr();
    println!("0x{addr:x}");
}
```

# Options
- [ ] A) It converts the pointer into a 128-bit hardware identifier within local thread memory
- [x] B) It explicitly reads the memory address without exposing pointer provenance metadata
- [ ] C) It executes in constant CPU time without accessing registers within local thread memory
- [ ] D) It ensures the pointer is allocated on a 64-byte boundary under current compiler safety rules

# Hint
Strict provenance separates integer addresses from pointer provenance capabilities.

# Explanation
Under the Strict Provenance model, `ptr.addr()` inspects the address portion of a pointer without "exposing" its provenance to the compiler's alias analysis, preserving optimization opportunities and memory sanitizer checks.
