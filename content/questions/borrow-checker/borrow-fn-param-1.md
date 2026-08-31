---
id: borrow-fn-param-1
categorySlug: borrow-checker
title: "Borrows Across Calls"
difficulty: 2
tags: [borrowing, functions]
---

# Prompt
Why is this rejected?

# Code
```rust
fn add(v: &mut Vec<i32>) {
    v.push(1);
}

let mut data = vec![0];
let first = &data[0];
add(&mut data);
println!("{first}");
```

# Options
- [ ] A) `add` moves `data`, so `first` cannot be printed later
- [ ] B) Function arguments always end every active borrow
- [x] C) `first`’s shared borrow overlaps `add`’s `&mut data`
- [ ] D) Indexing returns an owned `i32`, never a reference

# Hint
A live shared borrow conflicts with a mutable parameter borrow.

# Explanation
`first` still borrows `data` when `add(&mut data)` runs. That call needs exclusive access (and may reallocate), so the overlapping borrows are rejected. Dropping `first` before the call would fix it.
