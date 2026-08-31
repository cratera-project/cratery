---
id: ptr-supporter-14
categorySlug: pointers
title: "Pointer Offsetting Safety (add vs offset)"
difficulty: 2
tags: [pointers, add, bounds]
---

# Prompt
Why is `ptr.add(count)` unsafe?

# Code
```rust
fn main() {
    let arr = [10, 20, 30];
    let p = arr.as_ptr();
    let second = unsafe { *p.add(1) };
    println!("{second}");
}
```

# Options
- [ ] A) Pointer arithmetic modifies the underlying array contents directly in runtime memory
- [x] B) The caller must ensure the offset remains within the allocated object bounds
- [ ] C) The operation disables hardware memory protection on the CPU within local thread memory
- [ ] D) Offsets can only be calculated on heap-allocated vector pointers in runtime memory

# Hint
Offsetting out of bounds or wrapping around the address space is undefined behavior.

# Explanation
`ptr.add(count)` is unsafe because the caller must guarantee that both the starting pointer and the resulting pointer remain within the bounds of the same allocated object (or one byte past the end).
