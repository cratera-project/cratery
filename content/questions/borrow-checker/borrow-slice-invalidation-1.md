---
id: borrow-slice-invalidation-1
categorySlug: borrow-checker
title: "Slice Invalidation"
difficulty: 3
tags: [borrowing, slices]
---

# Prompt
Why can’t you mutate a `String` while holding a `&str` into it?

# Code
```rust
let mut s = String::from("hello");
let slice = &s[0..2];
s.push_str(" world");
println!("{slice}");
```

# Options
- [ ] A) `&str` slices forbid any later use of the `String`
- [ ] B) `push_str` is only allowed on empty `String` values
- [x] C) Growing `s` may reallocate and invalidate `slice`
- [ ] D) `slice` must be `mut` before `push_str` can run

# Hint
A string slice is a pointer into the `String` buffer.

# Explanation
A `&str` points into the `String`’s heap buffer. `push_str` may reallocate that buffer, leaving the slice dangling. The borrow checker blocks the mutable access while the slice borrow is still live.
