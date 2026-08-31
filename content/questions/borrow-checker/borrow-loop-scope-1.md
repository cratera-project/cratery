---
id: borrow-loop-scope-1
categorySlug: borrow-checker
title: "Borrow Scope in Loops"
difficulty: 3
tags: [borrowing, loops]
---

# Prompt
Why does this fail to compile?

# Code
```rust
let mut v = vec![1, 2, 3];
let mut refs = Vec::new();
for i in 0..v.len() {
    refs.push(&v[i]);
}
v.push(4);
println!("{}", refs.len());
```

# Options
- [ ] A) `v.len()` mutably borrows `v` for the whole loop
- [ ] B) Indexing inside a loop is treated as an exclusive borrow
- [ ] C) `push` after any `for` over a range is always illegal
- [x] D) `refs` keeps shared borrows of `v` alive past the push

# Hint
A later use of `refs` keeps those borrows alive across `v.push`.

# Explanation
Each `&v[i]` is stored in `refs`, and `refs` is used after `v.push(4)`, so the shared borrows stay live across the push. `push` needs exclusive access and conflicts with those borrows. If `refs` were never used again, NLL could end the borrows earlier and the push would compile.
