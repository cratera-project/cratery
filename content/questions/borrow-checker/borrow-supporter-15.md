---
id: borrow-supporter-15
categorySlug: borrow-checker
title: "Disjoint Struct Field Method Borrowing"
difficulty: 2
tags: [borrow-checker, disjoint-fields, refactoring]
---

# Prompt
How can you resolve borrow checker conflicts when a method only touches specific struct fields?

# Code
```rust
struct Canvas {
    width: u32,
    pixels: Vec<u8>,
}

fn draw(pixels: &mut [u8], width: u32) {
    // ...
}
```

# Options
- [x] A) Pass individual fields `(&mut canvas.pixels, canvas.width)` instead of `&mut self`
- [ ] B) Annotate the struct with `#[repr(packed)]` during runtime execution in runtime memory
- [ ] C) Cast the struct to raw pointers inside unsafe blocks under current compiler safety rules
- [ ] D) Clone the entire Canvas struct before each mutation under current compiler safety rules

# Hint
Passing individual field references allows the borrow checker to track disjoint access.

# Explanation
Passing individual fields (e.g. free functions taking `&mut canvas.pixels` and `canvas.width`) allows the borrow checker to verify that distinct fields are accessed without locking the entire struct.
