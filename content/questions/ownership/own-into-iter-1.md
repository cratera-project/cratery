---
id: own-into-iter-1
categorySlug: ownership
title: "Consuming Iteration"
difficulty: 2
tags: [ownership, move, iterators]
---

# Prompt
Why can’t `v` be used after this loop?

# Code
```rust
fn main() {
    let v = vec![1, 2, 3];
    for x in v {
        println!("{x}");
    }
    // println!("{:?}", v); // error
}
```

# Options
- [ ] A) `for` loops freeze vectors until the process exits
- [ ] B) `println!` inside the loop deletes the binding `v`
- [ ] C) Integers in vectors are not printable after moving
- [x] D) `for` in `v` takes ownership via `IntoIterator`

# Hint
Compare `for x in v` with `for x in &v`.

# Explanation
`for x in v` desugars to `IntoIterator::into_iter(v)`, which consumes the vector. Use `for x in &v` or `v.iter()` to borrow, or `iter_mut` to mutate in place.
