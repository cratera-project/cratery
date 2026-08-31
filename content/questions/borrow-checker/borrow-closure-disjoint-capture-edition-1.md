---
id: borrow-closure-disjoint-capture-edition-1
categorySlug: borrow-checker
title: "Disjoint Closure Capture"
difficulty: 2
tags: [borrow-checker, closures, disjoint-capture]
---

# Prompt
Why is reading `p.y` allowed while `mutate_x` holds a mutable closure?

# Code
```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let mut p = Point { x: 1, y: 2 };
    let mut mutate_x = || p.x += 10;
    println!("y is {}", p.y);
    mutate_x();
    println!("x is {}, y is {}", p.x, p.y);
}
```

# Options
- [ ] A) println! macro calls automatically release active borrows
- [ ] B) mutate_x is only created when invoked on the next line
- [x] C) Closures capture disjoint fields rather than whole struct
- [ ] D) i32 fields implement Copy so borrow checking is skipped

# Hint
How did closure capture granularity change in Rust 2021?

# Explanation
In Rust 2021 and 2024 editions, closures capture individual fields rather than whole struct instances if only specific fields are referenced. Because `mutate_x` only mutates `p.x`, only `&mut p.x` is captured. Field `p.y` remains unborrowed, allowing `println!("y is {}", p.y)` to safely access `p.y` concurrently with the closure's existence.
