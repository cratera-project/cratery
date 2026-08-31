---
id: own-supporter-22
categorySlug: ownership
title: "Disjoint Struct Field Mutation"
difficulty: 2
tags: [ownership, borrow-checker, disjoint]
---

# Prompt
Can you mutably borrow `user.name` while holding an immutable borrow of `user.age`?

# Code
```rust
struct User {
    name: String,
    age: u32,
}

fn main() {
    let mut u = User { name: String::from("Sam"), age: 25 };
    let age_ref = &u.age;
    u.name.push_str("!");
    println!("{} is {}", u.name, *age_ref);
}
```

# Options
- [ ] A) No; borrowing any field exclusively borrows the entire struct in code
- [x] B) Yes; the borrow checker allows disjoint borrows of struct fields
- [ ] C) No; age_ref is invalidated as soon as u is touched mutably in code
- [ ] D) Yes, but only if all struct fields implement the Copy trait in code

# Hint
The borrow checker tracks distinct fields of local structs independently.

# Explanation
Rust understands disjoint field access for local structs. Because `u.name` and `u.age` occupy distinct memory locations, an exclusive borrow of `u.name` does not conflict with a shared borrow of `u.age`.
