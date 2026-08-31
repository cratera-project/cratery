---
id: iter-supporter-2
categorySlug: iterators-closures
title: "Rust 2021/2024 Disjoint Closure Capture"
difficulty: 2
tags: [iterators-closures, disjoint-capture, closures]
---

# Prompt
Why can two closures capture disjoint fields of the same struct simultaneously in Rust 2024?

# Code
```rust
struct State {
    a: i32,
    b: String,
}

fn main() {
    let mut s = State { a: 1, b: String::from("hi") };
    let mut c1 = || s.a += 1;
    let mut c2 = || s.b.push_str("!");
    c1();
    c2();
    println!("{} {}", s.a, s.b);
}
```

# Options
- [x] A) Closures capture individual struct fields rather than the entire enclosing struct
- [ ] B) Closures clone all captured fields into heap memory automatically within local thread memory
- [ ] C) The compiler demotes closure calls into atomic compare-and-swap loops in runtime memory
- [ ] D) Field mutation inside closures is deferred until the main block exits in runtime memory

# Hint
Since Rust 2021, closures only capture the specific fields they touch.

# Explanation
Starting in Rust 2021 and continuing in 2024, closures capture precise field paths (`s.a`, `s.b`) rather than the entire struct `s`, enabling independent simultaneous borrows of disjoint struct fields.
