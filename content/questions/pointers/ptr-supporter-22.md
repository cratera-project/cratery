---
id: ptr-supporter-22
categorySlug: pointers
title: "std::mem::size_of_val Dynamically Sized Types"
difficulty: 2
tags: [pointers, size-of-val, dst]
---

# Prompt
What does `std::mem::size_of_val(&[1, 2, 3][..])` return on 64-bit systems?

# Code
```rust
fn main() {
    let slice: &[i32] = &[1, 2, 3];
    let bytes = std::mem::size_of_val(slice);
    assert_eq!(bytes, 12);
}
```

# Options
- [ ] A) 16 bytes (size of the fat pointer reference)
- [x] B) 12 bytes (3 elements * 4 bytes per i32)
- [ ] C) 8 bytes (size of a single machine pointer word)
- [ ] D) 24 bytes (slice overhead plus capacity)

# Hint
size_of_val returns the size in bytes of the pointed-to value (the slice data).

# Explanation
`std::mem::size_of_val(val)` inspects the metadata of the dynamically sized slice and returns the size of the underlying elements: 3 `i32`s * 4 bytes = 12 bytes.
