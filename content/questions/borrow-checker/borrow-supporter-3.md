---
id: borrow-supporter-3
categorySlug: borrow-checker
title: "Disjoint Slice Borrows with split_at_mut"
difficulty: 3
tags: [borrow-checker, slices, split_at_mut]
---

# Prompt
Why cannot you borrow `&mut slice[0]` and `&mut slice[1]` simultaneously using normal indexing?

# Code
```rust
fn main() {
    let mut arr = [1, 2, 3, 4];
    let (left, right) = arr.split_at_mut(2);
    left[0] = 10;
    right[0] = 20;
    println!("{arr:?}");
}
```

# Options
- [x] A) `IndexMut` takes `&mut self` on the entire slice, so multiple index calls overlap
- [ ] B) Array memory buffers can only be written from a single CPU register in runtime memory
- [ ] C) The compiler disables slice mutation for arrays with fewer than 16 items in runtime memory
- [ ] D) Simultaneous index writes trigger operating system page faults within local thread memory

# Hint
The IndexMut trait method signature borrows the entire slice &mut self.

# Explanation
`slice[i]` invokes `IndexMut::index_mut(&mut self, i)`, mutably borrowing the entire slice. The borrow checker cannot verify disjointness of indices at compile time, so `split_at_mut` uses unsafe internally to provide safe disjoint slices.
