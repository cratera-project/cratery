---
id: own-vec-push-1
categorySlug: ownership
title: "Vec Reallocation"
difficulty: 2
tags: [ownership, borrowing, vec]
---

# Prompt
Why does this code fail to compile?

# Code
```rust
fn main() {
    let mut v = vec![1, 2, 3];
    let first = &v[0];
    v.push(4);
    println!("First element: {}", first);
}
```

# Options
- [ ] A) Capacity must be reserved before any element borrow
- [x] B) `push` needs `&mut v` while `first` still borrows
- [ ] C) Indexing consumes ownership of the whole `Vec`
- [ ] D) `push` only works when you still own the `Vec`

# Hint
`push` may reallocate the buffer behind `first`.

# Explanation
`first` immutably borrows into `v`. `v.push(4)` needs a mutable borrow and may reallocate, invalidating that reference. The borrow checker forbids mutable access while the immutable borrow is live.
