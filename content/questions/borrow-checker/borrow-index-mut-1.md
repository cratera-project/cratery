---
id: borrow-index-mut-1
categorySlug: borrow-checker
title: "Indexed Mutable Borrows"
difficulty: 3
tags: [borrowing, indexing]
---

# Prompt
Why doesn’t this compile, unlike `split_at_mut`?

# Code
```rust
let mut v = vec![1, 2, 3];
let a = &mut v[0];
let b = &mut v[1];
*a += 1;
*b += 1;
```

# Options
- [x] A) Index ops borrow the whole `Vec`, so `&mut` alias
- [ ] B) Integer elements cannot be mutated through indexes
- [ ] C) `Vec` indexing always moves the element out by value
- [ ] D) Two `&mut` are illegal even for proven-disjoint ranges

# Hint
Does the compiler see disjoint fields, or one container borrow?

# Explanation
`v[i]` desugars to an `Index`/`IndexMut` call that borrows the entire vector. The compiler cannot see that `0` and `1` are disjoint the way `split_at_mut` promises, so the second `&mut v[1]` conflicts with `a`.
