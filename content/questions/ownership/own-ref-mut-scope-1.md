---
id: own-ref-mut-scope-1
categorySlug: ownership
title: "Mutable Reference Scope"
difficulty: 2
tags: [borrowing, mutability, nll]
---

# Prompt
Why does this code compile?

# Code
```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    r1.push_str(" world");

    let r2 = &mut s;
    r2.push_str("!");

    println!("{}", s);
}
```

# Options
- [x] A) Each `&mut` ends before the next one starts
- [ ] B) The compiler merges sequential `&mut` borrows
- [ ] C) `String` allows many overlapping `&mut` uses
- [ ] D) Method calls convert `&mut` into owned values

# Hint
NLL ends a borrow at its last use.

# Explanation
With non-lexical lifetimes, `r1`’s borrow ends after its last use (`push_str`), so `r2` can borrow mutably afterward. The mutable borrows never overlap in use, which satisfies the exclusivity rule.
