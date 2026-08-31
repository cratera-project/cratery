---
id: borrow-supporter-25
categorySlug: borrow-checker
title: "Disjoint Array Chunk Mutability"
difficulty: 2
tags: [borrow-checker, slices, chunks_mut]
---

# Prompt
How can you mutably modify two distinct halves of an array concurrently?

# Code
```rust
fn main() {
    let mut data = [1, 2, 3, 4];
    let (h1, h2) = data.split_at_mut(2);
    h1[0] = 10;
    h2[0] = 20;
    assert_eq!(data, [10, 2, 20, 4]);
}
```

# Options
- [ ] A) By duplicating the array buffer into two independent heap vectors under current compiler safety rules
- [ ] B) By locking each element with a separate atomic compare-and-swap under current compiler safety rules
- [x] C) Using `split_at_mut` or `chunks_mut` to partition the slice into disjoint non-overlapping slices
- [ ] D) By annotating the slice with the `#[repr(simd)]` attribute during standard program runtime execution

# Hint
split_at_mut splits one mutable slice into two disjoint mutable sub-slices.

# Explanation
`split_at_mut` splits a mutable slice into two disjoint mutable sub-slices `(&mut [T], &mut [T])` whose memory ranges do not overlap, satisfying the borrow checker.
