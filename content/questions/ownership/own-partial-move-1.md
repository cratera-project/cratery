---
id: own-partial-move-1
categorySlug: ownership
title: "Partial Move"
difficulty: 2
tags: [ownership, move, struct]
---

# Prompt
What happens when this code runs?

# Code
```rust
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let p = Person {
        name: String::from("Alice"),
        age: 30,
    };
    let name = p.name;
    println!("Age: {}", p.age);
}
```

# Options
- [x] A) `p.age` still works; that field was not moved
- [ ] B) Any field access freezes the whole struct
- [ ] C) Error: no field use after a partial move
- [ ] D) Moving one field always moves every field

# Hint
Only the fields you move are gone; the rest stay usable.

# Explanation
Moving `p.name` is a partial move: the whole `p` and `p.name` cannot be used again, but fields that were not moved stay usable. Here `p.age` still works (`u32` is also `Copy`, so reading it does not move it). Remaining non-`Copy` fields can still be moved out one by one.
