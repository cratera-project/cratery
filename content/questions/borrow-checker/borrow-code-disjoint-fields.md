---
id: borrow-code-disjoint-fields
categorySlug: borrow-checker
title: "Disjoint Field Mutation"
difficulty: 1
tags: [borrow-checker, coding]
kind: coding
---

# Prompt
Given `struct Player { pub score: u32, pub name: String }`, implement `fn update_player(p: &mut Player, points: u32, suffix: &str)` that mutates both fields.

# Code
```rust
pub struct Player {
    pub score: u32,
    pub name: String,
}

pub fn update_player(p: &mut Player, points: u32, suffix: &str) {
    p.score += points;
    p.name.push_str(suffix);
}
```

# Solution
```rust
pub struct Player {
    pub score: u32,
    pub name: String,
}

pub fn update_player(p: &mut Player, points: u32, suffix: &str) {
    p.score += points;
    p.name.push_str(suffix);
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut p = Player { score: 100, name: String::from("Hero") };
    update_player(&mut p, 50, " (MVP)");
    assert_eq!(p.score, 150);
    assert_eq!(p.name, "Hero (MVP)");
    println!("test passed");
}
```

# Explanation
Given `struct Player { pub score: u32, pub name: String }`, implement `fn update_player(p: &mut Player, points: u32, suffix: &str)` that mutates both fields. Review the test cases to verify all assertions.
