---
id: own-supporter-8
categorySlug: ownership
title: "Partial Struct Move with Copy Fields"
difficulty: 2
tags: [ownership, partial-move, copy]
---

# Prompt
Which fields remain usable after `let name = user.name;`?

# Code
```rust
struct User {
    name: String,
    age: u32,
    active: bool,
}

fn main() {
    let user = User { name: String::from("Ada"), age: 36, active: true };
    let name = user.name;
    println!("age: {}, active: {}", user.age, user.active);
}
```

# Options
- [ ] A) No fields; moving one field invalidates the whole struct
- [ ] B) Only age; boolean fields are invalidated on partial move
- [ ] C) Only active; numeric fields are invalidated on move in code
- [x] D) Both age and active; un-moved fields remain fully valid

# Hint
Rust tracks partial moves on individual fields independently.

# Explanation
When a struct is partially moved, un-moved fields (like `user.age` and `user.active`) remain completely accessible. The struct as a whole cannot be used, but individual untouched fields can.
