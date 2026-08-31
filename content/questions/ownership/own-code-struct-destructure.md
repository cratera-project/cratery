---
id: own-code-struct-destructure
categorySlug: ownership
title: "Consume Struct and Extract Field"
difficulty: 1
tags: [ownership, struct, coding]
kind: coding
---

# Prompt
Define a struct `User { pub name: String, pub age: u32 }` and implement `consume_user(user: User) -> (String, u32)` that consumes the struct by moving its fields.

# Code
```rust
pub struct User {
    pub name: String,
    pub age: u32,
}

pub fn consume_user(user: User) -> (String, u32) {
    // TODO: Deconstruct and return tuple
    todo!()
}
```

# Solution
```rust
pub struct User {
    pub name: String,
    pub age: u32,
}

pub fn consume_user(user: User) -> (String, u32) {
    (user.name, user.age)
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let u = User { name: String::from("Alice"), age: 30 };
    let (name, age) = consume_user(u);
    assert_eq!(name, "Alice");
    assert_eq!(age, 30);
    println!("all tests passed");
}
```

# Hint
Destructure the struct with (user.name, user.age).

# Explanation
Taking `User` by value allows moving its individual fields into a new tuple without requiring `Clone` or `Copy`.
