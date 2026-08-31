---
id: trait-code-add-trait
categorySlug: traits
title: "Vector2D Addition"
difficulty: 2
tags: [traits, coding]
kind: coding
---

# Prompt
Implement `std::ops::Add` for `#[derive(Debug, PartialEq, Clone, Copy)] pub struct Vec2 { pub x: i32, pub y: i32 }`.

# Code
```rust
use std::ops::Add;

#[derive(Debug, PartialEq, Clone, Copy)]
pub struct Vec2 {
    pub x: i32,
    pub y: i32,
}

impl Add for Vec2 {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let a = Vec2 { x: 1, y: 2 };
    let b = Vec2 { x: 3, y: 4 };
    assert_eq!(a + b, Vec2 { x: 4, y: 6 });
    println!("test passed");
}
```

# Explanation
Implement `std::ops::Add` for `#[derive(Debug, PartialEq, Clone, Copy)] pub struct Vec2 { pub x: i32, pub y: i32 }`. Review the test cases to verify all assertions.
