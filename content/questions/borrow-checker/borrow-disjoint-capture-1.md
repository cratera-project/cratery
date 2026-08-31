---
id: borrow-disjoint-capture-1
categorySlug: borrow-checker
title: "Disjoint Closure Capture"
difficulty: 2
tags: [borrowing, closures, edition2021]
---

# Prompt
Why can `p.y` be used while the closure mutates `p.x`?

# Code
```rust
struct Point {
    x: i32,
    y: String,
}

fn main() {
    let mut p = Point { x: 1, y: "a".into() };
    let mut c = || p.x += 1;
    println!("{}", p.y);
    c();
}
```

# Options
- [ ] A) `String` fields are exempt from borrow checking
- [ ] B) Closures capture copies of structs, never fields
- [x] C) Edition 2021 captures `p.x` only, not all of `p`
- [ ] D) `println!` extends the mutable borrow until `c()`

# Hint
Rust 2021 closures capture paths, not whole bindings.

# Explanation
Edition 2021 disjoint capture (RFC 2229) lets a closure capture only `p.x`. That leaves `p.y` free to borrow. In 2018 the closure would capture all of `p` and this would not compile. `let _ = &p;` inside the closure forces capturing the whole binding if you need the old behavior.
