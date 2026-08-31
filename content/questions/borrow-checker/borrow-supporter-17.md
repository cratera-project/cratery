---
id: borrow-supporter-17
categorySlug: borrow-checker
title: "Reborrowing in Nested Mutable Slices"
difficulty: 3
tags: [borrow-checker, reborrow, slices]
---

# Prompt
What happens when calling `slice.split_first_mut()` in a loop?

# Code
```rust
fn process_all(mut slice: &mut [i32]) {
    while let Some((head, tail)) = slice.split_first_mut() {
        *head += 1;
        slice = tail; // updates slice binding to the remaining sub-slice
    }
}
```

# Options
- [ ] A) Causes a compile error because mutable references cannot be reassigned in runtime memory
- [ ] B) Allocates a new heap slice buffer on each loop step under current compiler safety rules
- [x] C) Each iteration reborrows `tail` and rebinds `slice`, shrinking the remaining borrow
- [ ] D) Triggers undefined behavior when slice length reaches zero within local thread memory

# Hint
Reassigning slice = tail shortens the borrow to the remainder of the slice.

# Explanation
`split_first_mut` reborrows `&mut *slice` into `(&mut head, &mut tail)`. Reassigning `slice = tail` narrows the scope of `slice` to the remaining elements without violating borrow rules.
