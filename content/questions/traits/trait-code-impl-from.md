---
id: trait-code-impl-from
categorySlug: traits
title: "From Tuple to Coordinate"
difficulty: 1
tags: [traits, coding]
kind: coding
---

# Prompt
Given `#[derive(Debug, PartialEq)] pub struct Coordinate { pub x: i32, pub y: i32 }`, implement `From<(i32, i32)>` for `Coordinate`.

# Code
```rust
#[derive(Debug, PartialEq)]
pub struct Coordinate {
    pub x: i32,
    pub y: i32,
}

impl From<(i32, i32)> for Coordinate {
    fn from((x, y): (i32, i32)) -> Self {
        Self { x, y }
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let c = Coordinate::from((10, 20));
    assert_eq!(c, Coordinate { x: 10, y: 20 });
    println!("test passed");
}
```

# Explanation
Given `#[derive(Debug, PartialEq)] pub struct Coordinate { pub x: i32, pub y: i32 }`, implement `From<(i32, i32)>` for `Coordinate`. Review the test cases to verify all assertions.
