---
id: ptr-supporter-15
categorySlug: pointers
title: "Fat Pointers vs Thin Pointers"
difficulty: 2
tags: [pointers, fat-pointers, slices]
---

# Prompt
Which of the following types is represented as a fat pointer (two machine words)?

# Code
```rust
fn main() {
    println!("{}", std::mem::size_of::<&[u8]>());
    println!("{}", std::mem::size_of::<&i32>());
}
```

# Options
- [ ] A) `&i32` (contains data pointer only) during runtime execution
- [ ] B) `*const f64` (contains memory address only) in code
- [x] C) `&[u8]` (contains data pointer and length usize)
- [ ] D) `Box<u64>` (contains heap pointer only) during runtime execution

# Hint
Slice references and trait object references are fat pointers.

# Explanation
`&[u8]` is a slice fat pointer consisting of two words: a pointer to the first element and a `usize` length. In contrast, `&i32`, `*const f64`, and `Box<u64>` are thin single-word pointers.
