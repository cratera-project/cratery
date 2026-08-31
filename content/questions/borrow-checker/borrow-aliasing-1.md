---
id: borrow-aliasing-1
categorySlug: borrow-checker
title: "Aliasing and Mutation"
difficulty: 2
tags: [borrowing, mutability]
---

# Prompt
Why does the borrow checker reject this code?

# Code
```rust
let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4);
println!("{first}");
```

# Options
- [x] A) `push` may reallocate while `first` still borrows `v`
- [ ] B) `first` must be marked `mut` before any vector can grow
- [ ] C) `println!` extends every borrow past the end of `main`
- [ ] D) Indexing a `Vec` always moves and consumes the vector

# Hint
Ask whether a live shared borrow overlaps a write that may move the buffer.

# Explanation
`first` holds an immutable borrow into `v`. `push` needs `&mut v` and may reallocate, invalidating that pointer. The borrow checker forbids overlapping shared and exclusive access so this potential use-after-free never compiles.
