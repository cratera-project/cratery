---
id: trait-code-impl-summary
categorySlug: traits
title: "Summary Trait Implementation"
difficulty: 1
tags: [traits, coding]
kind: coding
---

# Prompt
Define a trait `Summary` with `fn summarize(&self) -> String;`. Implement `Summary` for `struct Article { pub title: String, pub author: String }` returning `"{title} by {author}"`.

# Code
```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct Article {
    pub title: String,
    pub author: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}
```

# Solution
```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct Article {
    pub title: String,
    pub author: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let a = Article { title: String::from("The Rust Book"), author: String::from("Steve & Carol") };
    assert_eq!(a.summarize(), "The Rust Book by Steve & Carol");
    println!("test passed");
}
```

# Explanation
Define a trait `Summary` with `fn summarize(&self) -> String;`. Implement `Summary` for `struct Article { pub title: String, pub author: String }` returning `"{title} by {author}"`. Review the test cases to verify all assertions.
