---
id: life-code-struct-ref
categorySlug: lifetimes
title: "Borrowed Struct View"
difficulty: 2
tags: [lifetimes, coding]
kind: coding
---

# Prompt
Define a struct `TextView<'a>` holding `pub content: &'a str`, and implement `fn new(content: &'a str) -> Self` and `fn first_char(&self) -> Option<char>`.

# Code
```rust
pub struct TextView<'a> {
    pub content: &'a str,
}

impl<'a> TextView<'a> {
    pub fn new(content: &'a str) -> Self {
        Self { content }
    }

    pub fn first_char(&self) -> Option<char> {
        self.content.chars().next()
    }
}
```

# Solution
```rust
pub struct TextView<'a> {
    pub content: &'a str,
}

impl<'a> TextView<'a> {
    pub fn new(content: &'a str) -> Self {
        Self { content }
    }

    pub fn first_char(&self) -> Option<char> {
        self.content.chars().next()
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let s = String::from("Ferris");
    let view = TextView::new(&s);
    assert_eq!(view.first_char(), Some('F'));
    let empty = TextView::new("");
    assert_eq!(empty.first_char(), None);
    println!("test passed");
}
```

# Explanation
Define a struct `TextView<'a>` holding `pub content: &'a str`, and implement `fn new(content: &'a str) -> Self` and `fn first_char(&self) -> Option<char>`. Review the test cases to verify all assertions.
