---
id: borrow-deref-mut-1
categorySlug: borrow-checker
title: "Multiple Field Borrows"
difficulty: 2
tags: [borrowing, structs]
---

# Prompt
Why does borrowing two fields of a struct usually work?

# Code
```rust
struct Pair {
    a: String,
    b: String,
}

fn take(p: &mut Pair) {
    let x = &mut p.a;
    let y = &mut p.b;
    x.push_str("!");
    y.push_str("?");
}
```

# Options
- [x] A) Mutable borrows of disjoint fields can coexist
- [ ] B) Structs automatically clone fields when borrowing them
- [ ] C) `String` fields ignore the exclusive-borrow rule
- [ ] D) Only `unsafe` can borrow more than one field

# Hint
Disjoint fields vs borrowing the whole struct.

# Explanation
The borrow checker understands disjoint field paths: `&mut p.a` and `&mut p.b` do not alias. Borrowing `p` as a whole (`&mut p`) would conflict with either field borrow.
